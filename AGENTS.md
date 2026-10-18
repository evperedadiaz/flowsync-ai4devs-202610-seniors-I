# Flowsync

## Qué es el repositorio

FlowSync es un proyecto de ejercicio de un curso. Monorepo con dos paquetes independientes, cada uno con su `package.json` y `node_modules` (no hay workspace raíz). Requiere **Node.js 24+**. Los textos de documentación y de la interfaz están en español.

- `backend/`: AdonisJS 7 (TypeScript, Lucid + SQLite, VineJS, auth por tokens de acceso opacos `oat_`). **Ya existe y no se modifica por ahora.** API en `http://localhost:3333`.
- `frontend/`: React 19 + Vite 8 + TypeScript 6, lint con oxlint. Es donde se trabaja por ahora. Dev server en `http://localhost:5173`.

## Comandos

Backend (desde `backend/`): `npm run dev` (servidor con HMR), `npm test` (Japa vía `node ace test`), `npm run lint`, `npm run typecheck`, `npm run build`. Un solo test: `node ace test --files "tests/<ruta>.spec.ts"`.

Frontend (desde `frontend/`): `npm run dev`, `npm run lint` (oxlint), `npm run build` (`tsc -b && vite build`). **No hay script de tests todavía**; la propuesta está en `docs/frontend-test.md`.

El backend y el frontend se arrancan en terminales distintas. En desarrollo el CORS del backend acepta cualquier origen, así que el frontend llama directamente a `http://localhost:3333`.

## Verificar lint, tests y build
Se deben ejecuttar los siguientes comandos:
- `npm run lint` (oxlint)
- `npm run build` (`tsc -b && vite build`)
- `npm run validate-frontend.sh`

## Documentación del frontend

- **Arquitectura**: lee `docs/frontend-architecture.md` cuando necesites entender cómo se organiza el frontend (estructura feature-first, capas, flujo de datos, cliente HTTP, autenticación, enrutado, shadcn/ui) o decidir dónde colocar código nuevo.
- **Convenciones**: `docs/frontend-conventions.md` (nombres, TypeScript, imports, estilos, textos).
- **Tests**: `docs/frontend-test.md` (herramientas, buenas prácticas y Gotchas).

## Reglas del frontend

- Los componentes de UI deben ser **shadcn/ui** (copiados a `src/shared/components/ui/`); no crear equivalentes propios.
- No introducir dependencias nuevas sin justificarlas en el PR.
- TypeScript con `verbatimModuleSyntax` y `erasableSyntaxOnly`: `import type` para tipos y sin `enum`/`namespace`. `react/only-export-components` está activo.
- Si no se conocen los tipos de los campos de formularios o de los parámetros que se deben enviar al backend, se debe consultar en la carpeta `backend` en el endpoint correspondiente.

## Harness

- Hook `PostToolUse` (`.claude/settings.json` → `.claude/hooks/validate-frontend.sh`): tras editar ficheros de `frontend/` ejecuta `lint`, `test` (si existe el script) y `build`; si falla, el error vuelve al agente y debe corregirse.
- Agente `adversarial-reviewer` (`.claude/agents/adversarial-reviewer.md`): revisor cuyo objetivo es refutar el trabajo, no confirmarlo. Úsalo antes de dar una tarea por terminada.
