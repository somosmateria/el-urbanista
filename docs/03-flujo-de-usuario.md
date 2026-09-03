# Flujo de usuario y pantallas

Recorrido completo de alguien del estudio generando la Memoria de Ordenación de un
municipio. Ver `prototipo.html` para la maqueta visual de cada pantalla descrita aquí.

## 1. Inicio — elegir tipo de documento

Tres tarjetas: **Pre-diagnóstico**, **Diagnóstico**, **Avance**. Por ahora solo Avance
está desarrollado; las otras dos aparecen desactivadas con la etiqueta "Próximamente" —
se dejan visibles para no rehacer la navegación cuando se desarrollen más adelante.

Al elegir Avance, se navega a la siguiente pantalla (no se queda todo en una sola vista).

## 2. Dentro de Avance — elegir memoria

Tres tarjetas: **Información**, **Ordenación**, **Participación**. El Documento de Avance
se compone de esas tres memorias. Por ahora solo Ordenación está desarrollada; Información
y Participación quedan desactivadas con "Próximamente", con la misma lógica que el paso 1.

Al elegir Ordenación, se navega al panel de municipios.

## 3. Panel de municipios

Lista de municipios en los que ya se ha trabajado la Memoria de Ordenación, cada uno con
un resumen de su progreso (p. ej. "Osuna — 10/12 capítulos listos"). Los capítulos
marcados como "sin información / no aplica" (ver `02-arquitectura-motores.md`) se cuentan
aparte, para no dar la falsa impresión de que faltan capítulos por generar cuando en
realidad es una decisión ya tomada.

Desde aquí:
- Abrir un municipio ya existente → va al semáforo de capítulos (paso 5).
- **+ Nuevo municipio** → va a la pantalla de creación (paso 4).

## 4. Nuevo municipio

Formulario simple:
- Nombre del municipio.
- Diagnóstico de origen: si el diagnóstico de ese municipio ya se generó dentro de El
  Urbanista, aparece automáticamente localizado y marcado como "Encontrado" — el usuario
  no tiene que buscarlo ni subirlo. Si no está en el sistema, opción de subir el PDF.

Botón **Generar memoria de ordenación** → pantalla de generación (paso 4b).

## 4b. Generando

Pantalla de progreso mientras se procesan los 12 capítulos: lista de capítulos con su
estado apareciendo uno a uno (listo / generando, con indicador de actividad / en cola).
El usuario puede seguir esperando ahí o navegar a otra parte y volver luego — el semáforo
de capítulos (paso 5) refleja el estado real en cualquier momento.

## 5. Semáforo de capítulos

Pantalla central del flujo. Lista de los 12 capítulos de un municipio, cada uno con un
estado:

- 🟢 **Listo** — capítulo tipo plantilla o ya generado y aceptado. Se puede previsualizar,
  editar si se quiere matizar algo, o descargar directamente.
- 🟡 **Revisar** — capítulo generado con datos extraídos del diagnóstico (motor RAG
  dirigido); necesita que el técnico confirme que los datos están bien antes de darlo
  por cerrado.
- 🔴 **Tu aportación** — capítulo de propuesta técnica (motor asistido por tabla); no se
  genera nada hasta que el usuario rellena la tabla correspondiente. El botón de descarga
  de ese capítulo aparece desactivado hasta entonces.
- ⚪ **Sin información / no aplica** — ver `02-arquitectura-motores.md`. Se le pregunta al
  usuario cuál de las dos situaciones es (falta un dato real vs. decisión editorial de no
  incluir/fusionar ese capítulo).

Todas las filas son clicables — incluidas las 🟢 "Listo" — porque el usuario debe poder
previsualizar y editar cualquier capítulo, esté o no en su estado final.

Cada fila tiene, además, un botón de descarga individual (desactivado si el capítulo aún
no tiene contenido, como en 🔴 sin tabla rellenada). Arriba de la lista, un botón
**Descargar todo** exporta los 12 .doc en un único paquete.

## 6. Dentro de un capítulo — previsualizar

Al entrar en cualquier capítulo se ve su contenido actual:

- Si es 🟡 (con datos del diagnóstico): el texto que proviene del diagnóstico aparece
  visualmente resaltado, con una nota de fuente al final indicando de qué sección del
  diagnóstico sale, para que el técnico pueda verificarlo rápido sin releer todo el
  capítulo. Mensaje de contexto: "Redactado a partir del diagnóstico... confírmalo antes
  de cerrar el capítulo."
- Si es 🟢 (plantilla, ya listo): se ve el texto sin resaltados (no hay nada que
  verificar contra el diagnóstico), con nota de fuente "Plantilla — texto normativo
  común, sin datos del diagnóstico". Mensaje de contexto: "Listo para entregar. Puedes
  editarlo igualmente si quieres matizar algo."
- Si es 🔴 (propuesta técnica): en vez de texto, se muestra directamente la tabla
  editable (ver `04-edicion-y-tablas.md`), no una vista previa de texto.

Desde la previsualización de cualquier capítulo con texto (🟢 o 🟡), botón **Editar** que
lleva al editor completo (paso 7).

## 7. Editor de capítulo

Ver `04-edicion-y-tablas.md` para el detalle del editor y el historial de versiones.

## Volver a un municipio ya empezado

Un municipio no se genera una sola vez y ya está: el usuario vuelve a menudo a corregir
o actualizar. Dos formas de tocar un capítulo ya existente:

1. **Editar directamente el texto** — a mano, desde el editor (paso 7). Vale para
   cualquier capítulo, esté en el estado que esté.
2. **Regenerar desde el origen** — si lo que cambió es el diagnóstico (un dato corregido,
   una cifra actualizada), un botón "volver a generar este capítulo con los datos
   actuales del diagnóstico" lo regenera. Si el capítulo ya tenía ediciones manuales,
   regenerar **no debe sobrescribir sin avisar**: se debe mostrar qué cambiaría y dejar
   elegir entre aplicarlo o mantener la versión editada.

Los capítulos 🔴 (tabla de propuesta técnica) nunca se regeneran automáticamente — esos
datos no vienen de ningún sitio que se pueda "actualizar", solo se editan a mano
(añadir/quitar filas y columnas).
