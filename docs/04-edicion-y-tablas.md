# Edición de texto, historial de versiones y tablas editables

## Editor de texto

Cualquier capítulo con contenido en prosa (🟢 "Listo" o 🟡 "Revisar" — ver
`03-flujo-de-usuario.md`) se puede abrir en un editor real, no solo leer:

- Barra de herramientas de formato básico: negrita, cursiva, subrayado, lista, cita.
- El texto del capítulo es directamente editable en el propio lienzo del documento
  (no un textarea aparte) — el usuario edita sobre el documento tal como se vería
  exportado.
- Si el capítulo tenía fragmentos resaltados por venir citados del diagnóstico (motor
  RAG dirigido, capítulos 🟡), ese resaltado se conserva en modo edición, para que el
  usuario siga viendo qué parte estaba verificada mientras edita alrededor.
- Botón explícito **Guardar cambios** — la edición no se autoguarda en silencio sin que
  el usuario lo sepa; el botón deja claro el momento en que la versión queda fijada.

## Historial de versiones — regla no negociable

**Cada vez que se guarda un capítulo, la versión anterior se conserva en un historial,
nunca se sobrescribe ni se pierde.**

- Al entrar al editor de un capítulo, se ve un panel de historial junto al texto con,
  como mínimo: la versión actual (la que se está editando ahora) y las versiones
  anteriores guardadas, cada una con cuándo se guardó y si fue una edición manual o la
  generación automática original.
- Al pulsar "Guardar cambios": la versión que estaba activa pasa a formar parte del
  historial (deja de ser "la actual"), y la nueva edición pasa a ser la versión activa.
- Cada entrada del historial (salvo la actual) tiene una opción de **Restaurar**, que
  recupera esa versión como la activa.
- La versión "original" (la primera generación automática del capítulo, antes de
  cualquier edición manual) se conserva siempre en el historial y nunca se elimina —
  es la referencia de vuelta al punto de partida generado desde el diagnóstico o la
  plantilla.
- Esta misma regla de historial aplica también a los cambios sobre las tablas de los
  capítulos de propuesta técnica (ver más abajo), no solo al texto en prosa.

Este comportamiento no es opcional ni configurable a "desactivar": es una garantía frente
a pérdida de trabajo, dado que varias personas del estudio pueden tocar el mismo municipio
en momentos distintos.

## Tablas editables (capítulos de propuesta técnica — motor asistido por tabla)

Los capítulos 🔴 (ver `02-arquitectura-motores.md`, Motor 3) no muestran texto generado
libremente; muestran una tabla estructurada que el usuario rellena, y el sistema redacta
solo el texto que la envuelve.

### Añadir filas

Dentro de cualquier tabla ya existente (por ejemplo, "áreas recreativas propuestas"), el
usuario tiene siempre un botón **Añadir fila** para meter un elemento más — el número de
elementos de un capítulo de propuesta técnica es siempre distinto entre municipios, así
que esto tiene que estar disponible sin límite.

### Añadir columnas

Además de filas, el usuario debe poder **añadir una columna nueva** a una tabla ya
existente, no solo elegir entre las columnas previstas de fábrica (código, nombre,
superficie, suelo, estado...). Al añadir una columna:

- Se pide al usuario el nombre de la nueva columna.
- La columna se añade a la cabecera de la tabla y se crea una celda vacía para esa
  columna en todas las filas ya existentes (no rompe los datos ya introducidos).
- Cualquier fila nueva que se añada después respeta el número de columnas actualizado en
  ese momento, incluida la columna añadida por el usuario.

Esto existe porque distintos municipios pueden necesitar registrar información distinta
dentro del mismo tipo de propuesta (por ejemplo, un municipio con más detalle de gestión
del suelo que otro), y la tabla no puede depender de un molde cerrado.

### Categorías de tabla distintas dentro del mismo capítulo

Un mismo capítulo de propuesta técnica (por ejemplo, MO.5 — sistemas generales) puede
necesitar más de un bloque de tabla a la vez: áreas recreativas, equipamientos, viario,
redes de infraestructuras... El usuario activa solo los bloques que le hacen falta para
ese municipio; si necesita un tipo de propuesta que no está previsto, puede crear un
bloque de tabla nuevo con sus propias columnas libres, sin depender de que el equipo de
producto lo añada de antemano.

### Diferencia con las tablas de capítulos 🟡 (dato del diagnóstico)

No todas las tablas del documento se comportan igual:

- En capítulos de **propuesta técnica** (🔴, p. ej. MO.5): la tabla arranca vacía y la
  rellena el usuario desde cero.
- En capítulos de **dato del diagnóstico** (🟡, p. ej. MO.6 — catálogo de patrimonio,
  zonas protegidas, riesgos): la tabla arranca ya rellenada por el sistema con lo
  encontrado en el diagnóstico. El usuario la revisa como quien revisa una lista ya
  hecha, no como quien empieza de cero — aunque conserva el mismo botón de añadir fila
  (por si el diagnóstico se quedó corto) y debería poder quitar una fila si algún
  elemento no aplica a la ordenación aunque estuviera en el diagnóstico.
