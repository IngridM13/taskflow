# TaskFlow 🗂️

Proyecto integrador del curso **Testing y Calidad de Software**.  
App de gestión de tareas (tipo Jira simplificado) con suite completa de tests.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express + TypeScript |
| Frontend | React 18 + TypeScript + Vite |
| ORM | Prisma + PostgreSQL |
| Unit/Integration | Vitest + Supertest |
| BDD | Cucumber.js + Gherkin |
| E2E | Playwright |
| Performance | k6 |
| CI/CD | GitHub Actions |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar DATABASE_URL con tu PostgreSQL local

# 3. Aplicar migraciones y seed
cd apps/api
npx prisma migrate dev
npx prisma db seed

# 4. Levantar todo
cd ../..
npm run dev
# API en http://localhost:3001
# Web en http://localhost:5173
```

---

## Correr los tests

```bash
# Unit tests con coverage
npm run test:unit

# Integration tests
npm run test:integration

# BDD / Cucumber
npm run test:bdd

# E2E con Playwright (requiere app corriendo)
npm run test:e2e

# Todos
npm run test:all

# Performance (requiere k6 instalado)
k6 run performance/scenarios/api-load.k6.js
```

---

## Estructura

```
taskflow/
├── apps/api/          # Backend Express + TS
│   ├── src/
│   │   ├── routes/
│   │   ├── services/  ← lógica de negocio + bugs intencionales
│   │   ├── middleware/
│   │   └── prisma/
│   └── tests/
│       ├── unit/      ← Vitest — lógica pura
│       └── integration/ ← Vitest + Supertest
├── apps/web/          # Frontend React + TS
├── e2e/               # Playwright + Cucumber
│   ├── features/      ← archivos .feature (Gherkin)
│   ├── pages/         ← Page Object Model
│   └── step-definitions/
├── performance/       ← k6 scripts
├── docs/adr/          ← Architecture Decision Records
└── .github/workflows/ ← CI/CD pipelines
```

---

## Hitos del semestre

| Clase | Entregable |
|-------|-----------|
| 3 | Repo + pipeline lint verde |
| 5 | US-01 y US-02 con unit + integration tests |
| 7 | US-03–05 + escenarios BDD pasando |
| 9 | US-06–08 + coverage ≥ 80% |
| 11 | E2E flujos críticos + contract tests |
| 13 | Scripts k6 + reporte SLOs |
| 15 | Suite completa + ADR + trazabilidad |
| 16 | Demo day 🎉 |

---

## Definition of Done

Una US está DONE cuando:
- [ ] Código compila sin errores TS
- [ ] Unit tests pasan con coverage ≥ 80%
- [ ] Integration tests cubren happy path + 2 casos de error
- [ ] Escenarios Gherkin implementados y pasando
- [ ] Sin errores ESLint
- [ ] Pipeline CI verde
- [ ] Matriz de trazabilidad actualizada
- [ ] PR con al menos 1 review aprobado
