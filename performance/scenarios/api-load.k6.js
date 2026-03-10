// performance/scenarios/api-load.k6.js
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// ── Custom metrics ────────────────────────────────────────────
const errorRate = new Rate('error_rate')
const loginDuration = new Trend('login_duration', true)
const tasksDuration = new Trend('tasks_list_duration', true)

// ── Thresholds (SLOs definidos en US como NFRs) ───────────────
export const options = {
  thresholds: {
    // SLO: p95 de todos los requests < 500ms
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    // SLO: error rate < 1%
    error_rate: ['rate<0.01'],
    // SLOs por endpoint
    login_duration: ['p(95)<300'],
    tasks_list_duration: ['p(95)<400'],
  },

  scenarios: {
    // Carga normal: 50 usuarios concurrentes durante 2 minutos
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },  // ramp up
        { duration: '1m',  target: 50 },  // steady state
        { duration: '30s', target: 0 },   // ramp down
      ],
      tags: { scenario: 'load' },
    },

    // Pico: spike de 200 usuarios
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 }, // spike súbito
        { duration: '30s', target: 200 }, // mantener
        { duration: '10s', target: 0 },   // bajar
      ],
      startTime: '3m', // empieza después del load test
      tags: { scenario: 'spike' },
    },
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001'

// ── Setup: crear usuario para el test ────────────────────────
export function setup() {
  const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
    email: `perf-${Date.now()}@test.com`,
    password: 'Password1',
    name: 'Perf User',
  }), { headers: { 'Content-Type': 'application/json' } })

  return { token: res.json('token'), userId: res.json('user.id') }
}

// ── Main scenario ─────────────────────────────────────────────
export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
  }

  // 1. Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: `perf-load@test.com`,
    password: 'Password1',
  }), { headers: { 'Content-Type': 'application/json' } })

  loginDuration.add(loginRes.timings.duration)
  errorRate.add(loginRes.status !== 200)
  check(loginRes, { 'login status 200': (r) => r.status === 200 })

  sleep(0.5)

  // 2. List projects
  const projectsRes = http.get(`${BASE_URL}/projects`, { headers })
  check(projectsRes, { 'projects status 200': (r) => r.status === 200 })
  errorRate.add(projectsRes.status !== 200)

  sleep(0.3)

  // 3. Get tasks with filter
  const projectId = projectsRes.json('0.id')
  if (projectId) {
    const tasksRes = http.get(`${BASE_URL}/projects/${projectId}/tasks?status=TODO`, { headers })
    tasksDuration.add(tasksRes.timings.duration)
    errorRate.add(tasksRes.status !== 200)
    check(tasksRes, { 'tasks status 200': (r) => r.status === 200 })
  }

  sleep(1)
}
