import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`.
 *
 * «Se obtiene una tarea» puede ser de dos maneras: suelta (`GET /tasks/:id`) o
 * dentro de la lista (`GET /tasks`). Las dos pasan por transformers distintos,
 * así que cada test mira las dos.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function tareaDe(fullName: string | null, email: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })
    const tarea = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: responsable.id,
    })

    return { responsable, tarea }
  }

  async function obtener(client: any, responsable: User, tarea: Task) {
    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-11-09' })
      .loginAs(responsable)
    suelta.assertStatus(200)

    const lista = await client.get('/api/v1/tasks').loginAs(responsable)
    lista.assertStatus(200)
    const enLista = lista.body().data.find((t: any) => t.id === tarea.id)

    return { suelta: suelta.body().data.assignee, enLista: enLista?.assignee }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { responsable, tarea } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const { suelta, enLista } = await obtener(client, responsable, tarea)

    for (const assignee of [suelta, enLista]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('el responsable no trae el email ni datos de acceso', async ({ client, assert }) => {
    const { responsable, tarea } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const { suelta, enLista } = await obtener(client, responsable, tarea)

    for (const [donde, assignee] of [
      ['suelta', suelta],
      ['en la lista', enLista],
    ]) {
      assert.notProperty(assignee, 'email', `la tarea ${donde} expone el email`)
      assert.notProperty(assignee, 'password', `la tarea ${donde} expone la contraseña`)
      // Por si el email viaja bajo otra clave.
      assert.notInclude(JSON.stringify(assignee), 'ada@example.com', `tarea ${donde}`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { responsable, tarea } = await tareaDe(null, 'ada@example.com')

    const { suelta, enLista } = await obtener(client, responsable, tarea)

    // La spec no dice de dónde salen las iniciales sin nombre. Se fija el
    // comportamiento actual del modelo (`User.initials`): la primera letra de
    // cada lado de la arroba (ada@example.com → AE).
    for (const assignee of [suelta, enLista]) {
      assert.isNull(assignee.fullName)
      assert.equal(assignee.initials, 'AE')
    }
  })
})
