# ADR-001: Stack de Testing

**Estado:** Aceptado  
**Fecha:** 2025  
**Autores:** Equipo TaskFlow

---

## Contexto

Necesitamos definir el stack de testing para TaskFlow, una API REST en Node.js + TypeScript con frontend en React. El equipo tiene experiencia con Jest pero queremos evaluar alternativas más modernas.

## Decisión

Adoptamos el siguiente stack:

| Capa | Herramienta elegida | Alternativa descartada |
|------|---------------------|------------------------|
| Unit / Integration | **Vitest** | Jest |
| API Integration | **Supertest** | Axios + servidor real |
| BDD | **Cucumber.js** | Jest-Cucumber |
| E2E | **Playwright** | Cypress |
| Contract | **Pact** | Spring Cloud Contract |
| Performance | **k6** | JMeter |

## Justificación

### Vitest sobre Jest
- Nativo con Vite (mismo toolchain que el frontend)
- ~10x más rápido en modo watch por HMR
- API 100% compatible con Jest → sin curva de aprendizaje
- Soporte nativo de TypeScript sin configuración extra

### Playwright sobre Cypress
- Soporte multi-browser real (Chromium, Firefox, WebKit)
- No limitado a un solo tab — puede testear flujos multi-ventana
- Mejor soporte de mobile emulation
- Trace Viewer para debugging visual de fallas en CI
- Licencia Apache 2.0 (Cypress tiene limitaciones en versión gratuita)

### k6 sobre JMeter
- Scripts en JavaScript (mismo lenguaje del proyecto)
- CLI-first, diseñado para CI/CD
- Thresholds como código → SLOs versionados en el repo
- Output nativo a Grafana/InfluxDB

## Consecuencias

**Positivas:**
- Stack cohesivo (todo TypeScript/JavaScript)
- Fácil incorporación de nuevos miembros del equipo
- Pipeline CI/CD más rápido que con Jest

**Negativas:**
- Vitest tiene menor ecosistema de plugins que Jest (aunque crece rápido)
- Playwright requiere instalar browsers (~300MB en CI)

## Revisión

Esta decisión se revisará al final del semestre en la retrospectiva del proyecto.
