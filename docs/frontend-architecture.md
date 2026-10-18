# Arquitectura del frontend

Stack: **React 19 + Vite 8 + TypeScript 6** (modo `bundler`, `verbatimModuleSyntax`, `erasableSyntaxOnly`), lint con **oxlint**, componentes de UI con **shadcn/ui** (Tailwind + Radix). El frontend consume la API de AdonisJS (`backend/`, puerto 3333) bajo el prefijo `/api/v1`.

> Estado actual: `frontend/src` solo contiene la plantilla de Vite (`App.tsx`, `main.tsx`). Este documento describe la arquitectura **objetivo** a la que deben converger los cambios nuevos.

## Principios

1. **Organización por funcionalidad (feature-first)**, no por tipo de fichero. Todo lo que cambia junto vive junto.
2. **Dependencias en un solo sentido**: `app → features → shared`. Una feature nunca importa de otra feature; si dos la necesitan, el código sube a `shared`.
3. **Separar UI, estado de servidor y acceso a la API**: los componentes no llaman a `fetch` directamente.
4. **Tipos en el límite**: lo que llega del backend se valida/tipa en la capa `api`, el resto de la app trabaja con tipos del dominio.

## Estructura de carpetas

```
frontend/
├── components.json              # configuración de shadcn/ui
├── src/
│   ├── main.tsx                 # punto de entrada: monta <App />
│   ├── app/                     # composición global de la aplicación
│   │   ├── App.tsx
│   │   ├── providers.tsx        # QueryClient, AuthProvider, Router...
│   │   ├── router.tsx           # definición de rutas y rutas protegidas
│   │   └── layouts/             # layouts compartidos (público, autenticado)
│   ├── features/                # una carpeta por funcionalidad de negocio
│   │   ├── auth/
│   │   │   ├── api/             # login.ts, signup.ts, logout.ts
│   │   │   ├── components/      # LoginForm.tsx, SignupForm.tsx
│   │   │   ├── hooks/           # useLogin.ts, useSession.ts
│   │   │   ├── pages/           # LoginPage.tsx, SignupPage.tsx
│   │   │   ├── schemas.ts       # esquemas de formulario (zod)
│   │   │   ├── types.ts
│   │   │   └── index.ts         # API pública de la feature
│   │   └── profile/
│   │       └── ...              # misma forma que auth
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/              # componentes shadcn/ui (generados, editables)
│   │   │   └── ...              # componentes propios reutilizables
│   │   ├── hooks/               # hooks genéricos (useDebounce...)
│   │   ├── lib/
│   │   │   ├── api-client.ts    # cliente HTTP único (base URL, token, errores)
│   │   │   ├── utils.ts         # cn() y helpers puros
│   │   │   └── env.ts           # lectura tipada de import.meta.env
│   │   └── types/
│   ├── styles/
│   │   └── index.css            # Tailwind + variables de tema de shadcn
│   └── test/                    # setup global de tests, mocks de MSW, utilidades
└── public/
```

### Qué va en cada capa

| Capa            | Contenido                               | Puede importar de                    |
|-----------------|-----------------------------------------|--------------------------------------|
| `app/`          | Providers, router, layouts, composición | `features`, `shared`                 |
| `features/<x>/` | Lógica y UI de una funcionalidad        | `shared`, y solo su propio contenido |
| `shared/`       | Código agnóstico del negocio            | solo `shared`                        |

Dentro de una feature, los ficheros se exponen únicamente a través de `index.ts`. Importar `features/auth/components/LoginForm` desde fuera de la feature está prohibido; se importa `features/auth`.

## Alias de importación

Usar el alias `@/` → `src/` (configurado en `tsconfig.app.json` `paths` y en `vite.config.ts` `resolve.alias`; shadcn/ui también lo requiere). Los imports relativos solo se usan dentro de la misma feature (`./`), nunca `../../..`.

## Flujo de datos

```
Página → hook de feature (useLogin) → función de api (login.ts) → api-client → backend /api/v1
                 ↑
        TanStack Query (caché, estados loading/error)
```

- **Estado de servidor**: TanStack Query (propuesto). No se copia a `useState`/contexto.
- **Estado de UI local**: `useState`/`useReducer` en el componente.
- **Estado global de cliente**: solo la sesión (token + usuario), en un `AuthProvider` con contexto. No introducir un gestor global (Redux, Zustand) salvo necesidad demostrada.
- **Formularios**: React Hook Form + zod, usando el componente `Form` de shadcn/ui.

## Cliente HTTP y autenticación

- Un único `api-client.ts` envuelve `fetch`: añade la base URL (`VITE_API_URL`, por defecto `http://localhost:3333`), la cabecera `Authorization: Bearer <token>` y normaliza los errores en una clase `ApiError { status, message, fieldErrors }`.
- El backend usa tokens de acceso opacos (prefijo `oat_`). El token se guarda en el `AuthProvider`; si se persiste, es en un único módulo (`features/auth/session-storage.ts`) para poder cambiarlo.
- Un `401` en una ruta protegida limpia la sesión y redirige a `/login`.
- Los errores de validación del backend se mapean a errores por campo en el formulario.

## Enrutado

- React Router (propuesto) con rutas declaradas en `app/router.tsx`.
- Las páginas son componentes finos: leen parámetros, llaman a hooks de la feature y componen componentes. Sin lógica de negocio.
- Rutas protegidas mediante un componente `RequireAuth` que envuelve el layout autenticado.
- Carga diferida (`React.lazy`) por página cuando el tamaño del bundle lo justifique.

## UI con shadcn/ui

- Los componentes se añaden con la CLI (`npx shadcn@latest add button input form ...`) y quedan copiados en `src/shared/components/ui/`. Se pueden editar, pero se mantienen genéricos.
- Configurar `components.json` con los alias apuntando a `@/shared/components/ui`, `@/shared/lib/utils` y `@/shared/hooks`.
- Los componentes de feature **componen** primitivas de shadcn/ui; no se crean botones, inputs, diálogos ni tarjetas propios si existe el equivalente en shadcn/ui.
- Estilos con clases de Tailwind y variables de tema CSS; no CSS por componente salvo excepción justificada. La plantilla `App.css` de Vite se elimina.

## Configuración y entorno

- Variables en `.env` con prefijo `VITE_` (nunca secretos: todo lo que lleva ese prefijo acaba en el bundle). Se leen solo en `shared/lib/env.ts`.
- En desarrollo el CORS del backend acepta cualquier origen (`origin: true` cuando `app.inDev`), por lo que no hace falta proxy; si se añade, se configura en `vite.config.ts` (`server.proxy`).

## Reglas de decisión rápidas

- ¿Se usa en una sola feature? → dentro de la feature. ¿En dos o más? → `shared`.
- ¿Necesita datos del servidor? → hook de feature con TanStack Query, no `useEffect + fetch`.
- ¿Es un elemento visual genérico? → ¿existe en shadcn/ui? Úsalo. Si no, `shared/components`.

Ver también: `docs/frontend-conventions.md` (estilo y nombres) y `docs/frontend-test.md` (tests).
