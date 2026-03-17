import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Usuarios ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Password1', 10)

  const alice = await prisma.user.upsert({
    where: { email: 'alice@taskflow.dev' },
    update: {},
    create: { email: 'alice@taskflow.dev', name: 'Alice', passwordHash },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@taskflow.dev' },
    update: {},
    create: { email: 'bob@taskflow.dev', name: 'Bob', passwordHash },
  })

  // Usuario de tests E2E (referenciado en la CI)
  const seed = await prisma.user.upsert({
    where: { email: 'seed@test.com' },
    update: {},
    create: { email: 'seed@test.com', name: 'Seed User', passwordHash },
  })

  console.log(`  ✓ Usuarios: ${alice.email}, ${bob.email}, ${seed.email}`)

  // ── Proyecto principal (Alice) ─────────────────────────────
  const project = await prisma.project.upsert({
    where: { ownerId_name: { ownerId: alice.id, name: 'TaskFlow App' } },
    update: {},
    create: {
      name: 'TaskFlow App',
      description: 'Proyecto de ejemplo con tareas en distintos estados',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'OWNER' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  })

  // Proyecto E2E (referenciado en tests)
  const seedProject = await prisma.project.upsert({
    where: { ownerId_name: { ownerId: seed.id, name: 'seed-project' } },
    update: {},
    create: {
      name: 'seed-project',
      description: 'Proyecto para tests E2E',
      ownerId: seed.id,
      members: { create: [{ userId: seed.id, role: 'OWNER' }] },
    },
  })

  console.log(`  ✓ Proyectos: "${project.name}", "${seedProject.name}"`)

  // ── Tareas ─────────────────────────────────────────────────
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Configurar CI/CD',
        description: 'GitHub Actions para lint, tests y deploy automático.',
        status: 'DONE',
        priority: 'HIGH',
        projectId: project.id,
        assignedTo: alice.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implementar autenticación JWT',
        description: 'Registro, login y middleware de autorización.',
        status: 'DONE',
        priority: 'CRITICAL',
        projectId: project.id,
        assignedTo: alice.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Agregar filtros de tareas',
        description: 'Filtrar por status, prioridad y búsqueda full-text.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project.id,
        assignedTo: bob.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Escribir tests E2E con Playwright',
        description: 'Cubrir flujos de registro, login y gestión de tareas.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implementar contract tests con Pact',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Optimizar queries de la base de datos',
        status: 'TODO',
        priority: 'LOW',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Documentar API con OpenAPI',
        status: 'TODO',
        priority: 'LOW',
        projectId: project.id,
      },
    }),
  ])

  console.log(`  ✓ Tareas: ${tasks.length} creadas`)

  // ── Comentarios ────────────────────────────────────────────
  const taskInProgress = tasks[2] // "Agregar filtros"

  await prisma.comment.createMany({
    data: [
      {
        body: 'Empecé con el filtro por status, funciona bien.',
        taskId: taskInProgress.id,
        authorId: bob.id,
      },
      {
        body: 'Falta implementar el full-text search, lo hago mañana.',
        taskId: taskInProgress.id,
        authorId: bob.id,
      },
      {
        body: 'Revisé el código, se ve bien. Acordate de agregar el test de integración.',
        taskId: taskInProgress.id,
        authorId: alice.id,
      },
    ],
  })

  console.log('  ✓ Comentarios creados')
  console.log('')
  console.log('✅ Seed completo.')
  console.log('')
  console.log('   Usuarios de prueba (contraseña: Password1)')
  console.log('   → alice@taskflow.dev')
  console.log('   → bob@taskflow.dev')
  console.log('   → seed@test.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
