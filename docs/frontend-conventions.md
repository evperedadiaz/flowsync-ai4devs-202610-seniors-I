# Convenciones del frontend

Convenciones **detectadas** en el código actual (`frontend/`) y convenciones **propuestas** donde no existía ninguna. Las propuestas están marcadas con 🆕.

## Detectadas

- TypeScript estricto en modo bundler: `verbatimModuleSyntax` (usar `import type { ... }` para tipos), `erasableSyntaxOnly` (sin `enum` ni `namespace`; usar uniones de literales y objetos `as const`), `noUnusedLocals` y `noUnusedParameters`.
- ESM puro (`"type": "module"`), JSX automático (`react-jsx`: no se importa `React`).
- Estilo de código de la plantilla de Vite: **sin punto y coma**, **comillas simples**, indentación de 2 espacios, comas finales en estructuras multilínea.
- Lint con **oxlint** (`npm run lint`) con `react/rules-of-hooks` en error y `react/only-export-components` en aviso (un fichero de componente exporta solo componentes; las constantes van aparte).
- Importaciones con extensión permitida (`allowImportingTsExtensions`) en la plantilla (`./App.tsx`); en código nuevo se omite la extensión.

## Propuestas 🆕

### Nombres

| Elemento              | Convención                                            | Ejemplo                |
|-----------------------|-------------------------------------------------------|------------------------|
| Componentes React     | `PascalCase.tsx`, un componente principal por fichero | `LoginForm.tsx`        |
| Componentes shadcn/ui | `kebab-case.tsx` (así los genera la CLI)              | `button.tsx`           |
| Hooks                 | `useXxx.ts` en `camelCase`                            | `useSession.ts`        |
| Funciones de API      | verbo + recurso, `camelCase`                          | `login.ts` → `login()` |
| Tipos e interfaces    | `PascalCase`, sin prefijo `I`                         | `UserProfile`          |
| Constantes globales   | `UPPER_SNAKE_CASE`                                    | `TOKEN_STORAGE_KEY`    |
| Carpetas              | `kebab-case`                                          | `features/auth`        |
| Tests                 | junto al código, `*.test.ts(x)`                       | `LoginForm.test.tsx`   |

### Componentes y hooks

- Componentes de función con `export function Nombre()`; sin `export default` salvo páginas con `React.lazy`.
- Props tipadas con un `type NombreProps = { ... }` local; no `React.FC`.
- Un componente que supera ~150 líneas o mezcla lógica y presentación se divide: la lógica pasa a un hook.
- Hooks solo en el cuerpo del componente o de otros hooks. Los efectos (`useEffect`) se reservan para sincronizar con sistemas externos, no para derivar estado ni cargar datos.
- Sin `key` basada en el índice en listas dinámicas.

### TypeScript

- Prohibido `any`; usar `unknown` y estrechar. Evitar aserciones `as` salvo en el límite con la API.
- Tipos del backend en `features/<x>/types.ts`; los datos se tipan en la capa `api`.
- Preferir `type` sobre `interface` salvo que se necesite extender o fusionar declaraciones.

### Imports

- Orden: librerías externas → alias `@/` → relativos. Una línea en blanco entre grupos.
- Alias `@/` para todo lo que cruce de carpeta de primer nivel; relativos solo dentro de la misma feature.
- Prohibido importar desde el interior de otra feature; se usa su `index.ts`.

### Estilos y UI

- Usar componentes `shadcn/ui` para cualquier elemento que tenga equivalente. Las clases de Tailwind se combinan con `cn()`.
- Nada de estilos en línea (`style={{}}`) salvo valores dinámicos que Tailwind no pueda expresar.
- Accesibilidad: cada `input` con `label` asociado, botones solo con icono con `aria-label`, mensajes de error enlazados con `aria-describedby` (los componentes `Form` de shadcn/ui ya lo hacen).

### Textos y errores

- Los mensajes de la interfaz están en **español**.
- Los errores de red/validación se muestran al usuario en el propio formulario; nunca solo en consola. Sin `console.log` en el código entregado.

### Git

- Commits en formato Conventional Commits (`feat(frontend): ...`, `fix(frontend): ...`), en el mismo estilo que el historial del repositorio.
- No introducir dependencias nuevas sin justificarlas en el PR (ver Gotchas en `docs/frontend-test.md`).
