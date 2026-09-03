# Decisiones pendientes

Cosas que se hablaron pero se dejaron abiertas a propósito, para resolverlas durante el
desarrollo o antes de empezarlo. No están respondidas en el resto de la carpeta — si algo
de aquí ya está decidido en otro documento, ese documento manda.

## 1. Formato exacto del panel de configuración del mapeo capítulo → sección

`02-arquitectura-motores.md` establece que el mapeo entre cada capítulo/subepígrafe y su
sección de origen en el diagnóstico debe ser editable desde un panel, no fijo en el
código. No se ha definido:

- Si ese panel es de uso interno del equipo técnico (config JSON/YAML versionado) o una
  pantalla de la propia aplicación pensada para que cualquiera del estudio la edite.
- Qué pasa con capítulos ya generados cuando se cambia el mapeo — ¿se regeneran, quedan
  como están hasta que alguien lo pida, o se marcan para revisión?

## 2. Umbral de "no se encontró información"

Se acordó que hace falta distinguir "falta información real" de "capítulo no aplica /
se fusiona con otro" (ver `02-arquitectura-motores.md`), pero no se ha definido el
mecanismo técnico para decidir cuándo el sistema considera que una sección "no se
encontró" en el diagnóstico — necesita algún criterio de confianza en la recuperación
(RAG), no solo "hubo resultado o no hubo resultado", porque un resultado de baja
relevancia no debería tratarse igual que uno claro.

## 3. Nivel de granularidad final del mapeo RAG para el resto de capítulos

`01-analisis-diagnostico-a-ordenacion.md` baja el mapeo a nivel de subepígrafe solo para
MO.3 y MO.6, que son los capítulos más densos en datos. El resto de capítulos con
contenido tipo B (MO.2, MO.4, MO.8, MO.11) siguen mapeados solo a nivel de epígrafe
general del diagnóstico. Antes de construir el motor RAG dirigido para esos capítulos,
conviene repetir el mismo ejercicio de bajar a subepígrafe.

## 4. Regeneración con ediciones previas — mecánica exacta

`03-flujo-de-usuario.md` establece la regla de producto ("mostrar qué cambiaría y dejar
elegir entre aplicar o mantener la versión editada" al regenerar un capítulo con
ediciones manuales previas), pero no el mecanismo técnico: ¿diff visual entre versión
editada y versión regenerada, fusión asistida, o simplemente ofrecer las dos versiones
completas una al lado de la otra para elegir?

## 5. Alcance real de "categorías de tabla" en capítulos de propuesta técnica

`04-edicion-y-tablas.md` describe que MO.5 puede necesitar varios bloques de tabla
(áreas recreativas, equipamientos, viario, redes...). No se ha hecho el inventario
completo de qué bloques son realmente recurrentes entre municipios distintos del estudio
más allá de los vistos en Osuna y Lora del Río — conviene revisarlo con más ejemplos
reales antes de fijar la lista de bloques "de fábrica".

## 6. Multi-tenant a futuro

Todo este diseño asume diagnósticos que siguen la plantilla del propio estudio (ver
`00-README.md`). Si en el futuro esta funcionalidad se abre a diagnósticos de formato
distinto (otros estudios, otros clientes), el motor RAG dirigido por mapeo fijo dejaría
de ser suficiente por sí solo y haría falta una capa de detección/confirmación de
estructura antes de generar — el equipo ya valoró esta idea y decidió aplazarla
explícitamente, no descartarla.
