# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Sobre el requisito «Lo que cada tarea muestra de su responsable», solo ese requisito, no la capability entera.
Rellena el punto `## A.1 · La matriz de trazabilidad`, cumpliendo con el formato y teniendo en cuenta las reglas.

## FORMATO:
El formato lo fija esta lección, y no es negociable: una fila por scenario, con estas `cuatro casillas`, y dos números arriba del todo.
- Los dos números son cuántos scenarios tiene ese requisito y cuántos resultaron estar cubiertos. El segundo se escribe al final; el primero, al principio.

### Cuatro casillas:
- El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
- Qué prueba lo cubre, nombrada tal cual aparece en la suite. Sin el nombre concreto, la casilla se queda vacía: "seguro que algo lo cubre" no es una fila.
- Cubierto · No cubierto · No lo sé. Los tres estados existen.
- Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

## REGLAS:
- Un nombre de test no es una prueba de cobertura. Un test puede llamarse igual que el scenario y comprobar otra cosa, o comprobar la mitad. Para marcar cubierto hay que abrir el test y leer lo que afirma.
```

**Qué salió:** rellenó el documento pero añadió explicación que no pedí que añadiera sobre un caso de un test en la suite de `auth`.

## Prompt 2

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
De las filas que quedaron en **No cubierto**, escribe los tests que faltan: **uno por scenario**, siguiendo el estilo de los que ya existen en el proyecto, y **sin tocar nada fuera de la carpeta de tests**.

Después, ejecútalos y dame el resultado.

Reglas:
- **Pase lo que pase, no arregles el código, y no aflojes el test para que pase.** Si algo se pone rojo, se queda rojo y se entrega rojo: hoy toca saber qué está mal, no taparlo.
- Si tienes dudas con algún caso, consúltame antes.
```

**Qué salió:** me hizo preguntas como esperaba por la abigüedad de los scenarios.

## Prompt 3

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Scenario «Responsable sin nombre» dice que «sus iniciales siguen llegando, para que la interfaz pueda representarlo sin recurrir a su email». Pero hoy el modelo User saca las iniciales del email cuando no hay nombre (ada@example.com → 'AE'). ¿Qué afirma el test sobre las iniciales?

- Que valen 'AE': Fija el comportamiento actual (derivadas del email). Decide algo que la spec no dice. Saldría verde.

Scenario «La tarea no filtra datos de cuenta»: ¿el test busca solo campos prohibidos en el assignee o exige que traiga exactamente unos campos? (Aviso: la lista usa UserTransformer y hoy devuelve el email, así que va a salir rojo con cualquiera de las dos opciones.)

- Lista negra (Recommended): Lo que dice el scenario: ni email ni password, tanto en la tarea suelta como en la lista. No decide nada más.
```

**Qué salió:** implementó los tests y uno falló como se esperaba.
