# Tests del frontend

> Estado actual: `frontend/` **no tiene** framework de tests ni script `npm test`. Lo que sigue es la configuración propuesta; añadirla es una excepción a la regla de dependencias y debe justificarse en el PR (ver Gotchas).

## Herramientas propuestas

| Necesidad           | Herramienta                                                | Motivo                                                             |
|---------------------|------------------------------------------------------------|--------------------------------------------------------------------|
| Runner y aserciones | **Vitest**                                                 | Comparte la configuración de Vite; sin transformaciones duplicadas |
| Render y consultas  | **@testing-library/react** + `@testing-library/user-event` | Prueba el comportamiento visible para el usuario                   |
| Matchers del DOM    | `@testing-library/jest-dom`                                | `toBeInTheDocument`, `toBeDisabled`...                             |
| Entorno DOM         | `jsdom`                                                    | Entorno de navegador simulado                                      |
| Mock de red         | **MSW** (Mock Service Worker)                              | Intercepta `fetch` a nivel de red, sin mockear módulos             |

Scripts a añadir en `frontend/package.json`: `"test": "vitest run"` y `"test:watch": "vitest"`. Configuración en `vite.config.ts` (`test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: false }`).

Para ejecutar un solo fichero o test: `npx vitest run src/features/auth/components/LoginForm.test.tsx -t "muestra error"`.

## Qué probar y cuánto

Pirámide recomendada:

1. **Unitarios** (muchos): funciones puras, esquemas zod, utilidades, `api-client` (normalización de errores).
2. **De componente/feature** (núcleo): un formulario o página renderizada con sus hooks reales y la red simulada con MSW. Es la capa con mejor relación valor/coste.
3. **E2E** (pocos, fuera de alcance por ahora): flujo completo contra el backend real.

Se prueba **comportamiento**, no implementación: lo que ve y hace el usuario, no el estado interno ni los nombres de hooks.

## Estructura y nombres

- Tests junto al código: `LoginForm.tsx` → `LoginForm.test.tsx`.
- Setup global, handlers de MSW y utilidades en `src/test/`:
  - `setup.ts` (jest-dom, arranque/reinicio/cierre del servidor MSW)
  - `handlers.ts` (respuestas por defecto de `/api/v1/...`)
  - `render.tsx` (`renderWithProviders`: QueryClient nuevo por test, Router, AuthProvider)
- `describe` por unidad, `it` en español describiendo el comportamiento: `it('muestra un mensaje claro si las credenciales son inválidas')`.
- Estructura Arrange–Act–Assert, un comportamiento por test.

## Buenas prácticas

- **Consultas por rol y accesibilidad**: `getByRole('button', { name: /entrar/i })`, `getByLabelText`. `getByTestId` es el último recurso.
- **`userEvent`, no `fireEvent`**; siempre `const user = userEvent.setup()`.
- **Asincronía**: `await screen.findBy...` o `waitFor` para esperar resultados; nunca `setTimeout` ni `sleep`.
- **Red**: MSW con handlers por defecto en `handlers.ts` y `server.use(...)` dentro del test para casos de error (`401`, `422`, `500`). No mockear `fetch` ni el `api-client` a mano.
- **Aislamiento**: cada test crea su propio `QueryClient` (con `retry: false`) y limpia `localStorage`. Sin orden ni estado compartido entre tests.
- **Determinismo**: sin dependencia de fecha, aleatorios o red real; fijar el tiempo con `vi.useFakeTimers()` cuando haga falta.
- **Cubrir caminos de error**, no solo el feliz. Para el login: credenciales inválidas, email ya registrado, error de validación por campo, sesión expirada (`401`) y fallo de red.
- **Tests que fallen por la razón correcta**: al escribir un test nuevo, comprobar que falla antes de implementar el cambio.
- **Cobertura** como indicador, no como objetivo; priorizar la lógica de autenticación y los formularios.
- **Componentes shadcn/ui** (`shared/components/ui`) no se testean: son código de terceros copiado. Se prueban las composiciones que los usan.

## Validación antes de dar el trabajo por hecho

Desde `frontend/`:

```bash
npm run lint && npm test && npm run build
```

Un hook de Claude Code (`.claude/hooks/validate-frontend.sh`) ejecuta esta comprobación tras cada edición de ficheros del frontend.

## Gotchas

- **No introducir dependencias nuevas sin justificarlas en el PR.**
- Probar siempre contra la validación real del backend: `password` y `passwordConfirmation` exigen 8–32 caracteres y deben coincidir. Un test con una contraseña de 4 caracteres pasa en el mock pero falla contra el backend.
- Los mocks de MSW deben reproducir la forma real de los errores del backend (`422` con lista de errores por campo), no inventar un formato propio.
- `npm run build` ejecuta `tsc -b`: los errores de tipos (incluidos `noUnusedLocals`) rompen el build aunque `lint` y los tests pasen.
- Los ficheros de componente solo deben exportar componentes (`react/only-export-components`); las utilidades de test y constantes van en ficheros aparte.
- Con `verbatimModuleSyntax`, los tipos se importan con `import type`; si no, el build falla.
- Las variables `VITE_*` se incrustan en el bundle: nunca poner secretos en ellas ni en los fixtures de tests.
- No hacer commit de tokens reales (`oat_...`) en fixtures; usar valores falsos evidentes.
- Los componentes de `shared/components/ui` los genera la CLI de shadcn/ui: regenerar con `npx shadcn@latest add <componente>` puede sobrescribir cambios locales; revisar el diff antes de aceptar.
- No hacer `export default` en los tests ni dejar `it.only`/`describe.only`/`console.log` en lo que se entrega.
