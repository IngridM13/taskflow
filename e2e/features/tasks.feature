# e2e/features/tasks.feature
Feature: Gestión de tareas y máquina de estados
  Como miembro de un proyecto
  Quiero gestionar el estado de las tareas
  Para reflejar el avance real del equipo

  Background:
    Given estoy autenticado como "member@test.com" con password "Password1"
    And soy miembro del proyecto "Proyecto Test"

  # ── US-05: Crear tarea ───────────────────────────────────────
  Scenario: Crear tarea con estado inicial TODO
    When creo una tarea con título "Implementar login" y prioridad "HIGH"
    Then la respuesta tiene status 201
    And la tarea tiene estado "TODO"

  Scenario: Crear tarea falla con prioridad inválida
    When creo una tarea con título "Tarea inválida" y prioridad "URGENTE"
    Then la respuesta tiene status 400

  # ── US-06: Cambiar estado ────────────────────────────────────
  Scenario: Transición válida TODO a IN_PROGRESS
    Given existe una tarea "task-pending" con estado "TODO"
    When cambio el estado de "task-pending" a "IN_PROGRESS"
    Then la respuesta tiene status 200
    And la tarea tiene estado "IN_PROGRESS"

  Scenario: Transición válida IN_PROGRESS a DONE
    Given existe una tarea "task-wip" con estado "IN_PROGRESS"
    When cambio el estado de "task-wip" a "DONE"
    Then la respuesta tiene status 200
    And la tarea tiene estado "DONE"

  Scenario: Transición inválida TODO a DONE directamente
    Given existe una tarea "task-skip" con estado "TODO"
    When cambio el estado de "task-skip" a "DONE"
    Then la respuesta tiene status 422
    And el campo "error" contiene "TODO → DONE"

  Scenario: No se puede reabrir una tarea DONE
    Given existe una tarea "task-closed" con estado "DONE"
    When cambio el estado de "task-closed" a "TODO"
    Then la respuesta tiene status 422
    And el campo "error" contiene "none"

  # ── US-07: Filtros ───────────────────────────────────────────
  Scenario: Filtrar tareas por estado
    Given el proyecto tiene 3 tareas con estado "TODO" y 2 con estado "DONE"
    When consulto las tareas del proyecto con filtro status="TODO"
    Then recibo exactamente 3 tareas
    And todas las tareas tienen estado "TODO"

  Scenario: Buscar tareas por texto
    Given existen tareas con títulos "Implementar login" y "Revisar diseño"
    When busco tareas con search="login"
    Then recibo exactamente 1 tarea
    And la primera tarea tiene título "Implementar login"
