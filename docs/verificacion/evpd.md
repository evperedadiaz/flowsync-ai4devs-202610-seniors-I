# Parte A

## A.1 · La matriz de trazabilidad

Requisito: «Lo que cada tarea muestra de su responsable» (`openspec/specs/tasks/spec.md`)

- **Scenarios del requisito:** 3
- **Cubiertos:** 0

| Scenario | Test que lo cubre | Estado | Qué faltó (si «No lo sé») |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es «Ada Lovelace», su `assignee` trae ese nombre y sus iniciales | | No cubierto | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no trae el email ni otro dato de acceso | | No cubierto | |
| Si el responsable se registró sin nombre, su `assignee` llega con el nombre nulo y con las iniciales | | No cubierto | |

El que más se acerca es `sin nombre, las iniciales salen del email` (`auth/initials.spec.ts`). Afirma que una cuenta sin nombre trae iniciales (`AE`), pero lo mira en la respuesta de `POST /auth/login`, no en el `assignee` de una tarea. No cubre el tercer scenario.

---

# Parte B
1. 2 y 0
2. En el escenario **Responsable sin nombre**, porque no se especifica de dónde se sacan las iniciales cuando el nombre está vacío.
3. En el escenario **La tarea no filtra datos de cuenta** decidí que **datos de acceso** son el email y la contraseña, y nada más, aunque el requisito dice que no se expone **ningún otro dato de acceso**.
