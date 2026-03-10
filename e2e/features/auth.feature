# e2e/features/auth.feature
Feature: Autenticación de usuarios
  Como usuario de TaskFlow
  Quiero poder registrarme e iniciar sesión
  Para poder acceder a mis proyectos y tareas

  Background:
    Given la API está disponible en "http://localhost:3001"

  # ── US-01: Registro ─────────────────────────────────────────
  Scenario: Registro exitoso con datos válidos
    Given que no existe ningún usuario con email "e2e-new@test.com"
    When envío POST /auth/register con email "e2e-new@test.com" y password "Password1"
    Then la respuesta tiene status 201
    And la respuesta contiene un campo "token"
    And la respuesta contiene un campo "user.email" con valor "e2e-new@test.com"

  Scenario: Registro falla si el email ya existe
    Given que ya existe un usuario con email "existing@test.com"
    When envío POST /auth/register con email "existing@test.com" y password "Password1"
    Then la respuesta tiene status 409
    And el campo "error" contiene "already registered"

  Scenario Outline: Registro falla con contraseña inválida
    When envío POST /auth/register con email "test@test.com" y password "<password>"
    Then la respuesta tiene status 400

    Examples:
      | password  | motivo                    |
      | abc       | muy corta                 |
      | password1 | sin mayúscula             |
      | Password  | sin número                |

  # ── US-02: Login ─────────────────────────────────────────────
  Scenario: Login exitoso con credenciales válidas
    Given que existe un usuario con email "login@test.com" y password "Password1"
    When envío POST /auth/login con email "login@test.com" y password "Password1"
    Then la respuesta tiene status 200
    And la respuesta contiene un campo "token"

  Scenario: Login falla con password incorrecto
    Given que existe un usuario con email "login@test.com" y password "Password1"
    When envío POST /auth/login con email "login@test.com" y password "WrongPass1"
    Then la respuesta tiene status 401

  Scenario: Cuenta bloqueada después del quinto intento fallido
    Given que existe un usuario con email "brute@test.com" y password "Password1"
    When fallo el login 5 veces con email "brute@test.com"
    And envío POST /auth/login con email "brute@test.com" y password "WrongPass1"
    Then la respuesta tiene status 401
    And el campo "error" contiene "locked"
