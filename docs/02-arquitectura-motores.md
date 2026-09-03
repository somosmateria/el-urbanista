# Arquitectura: los tres motores de generación

Ver primero `01-analisis-diagnostico-a-ordenacion.md` — este documento asume ya conocida
la distinción entre contenido tipo A (plantilla), tipo B (dato del diagnóstico) y tipo C
(propuesta técnica).

No hay un único prompt "genera este capítulo a partir del diagnóstico". Cada uno de los
12 capítulos (y en algunos casos cada subepígrafe) se resuelve con uno de estos tres
motores, según lo que domine en su contenido.

## Motor 1 — Plantilla con variables (contenido tipo A)

- No necesita RAG ni generación libre por parte del modelo.
- Es una plantilla de texto con huecos (`{nombre_municipio}`, `{plan_vigente}`,
  `{años_desde_plan_anterior}`, `{lista_municipios_colindantes}`, etc.) que se rellenan
  con datos ya conocidos o extraídos de un lugar fijo del diagnóstico.
- El LLM puede intervenir solo al final para dar una pasada de estilo si hace falta, pero
  no decide contenido.
- Cubre la mayoría del volumen de páginas de la Memoria de Ordenación (MO.1, MO.4, MO.9,
  MO.12 casi enteros; buena parte de MO.7, MO.10, MO.11).
- Es el motor de menor coste y menor riesgo de alucinación — debe ser la opción por
  defecto siempre que el contenido lo permita.

## Motor 2 — RAG dirigido, no libre (contenido tipo B)

- Se activa cuando el capítulo necesita datos concretos que ya están verificados en el
  diagnóstico (catálogos, cifras, códigos, listados).
- La diferencia clave respecto a una búsqueda RAG libre: **cada bloque de contenido tiene
  mapeada de antemano la sección exacta del diagnóstico de la que debe tirar** (ver
  `01-analisis-diagnostico-a-ordenacion.md` para el mapeo capítulo → sección a nivel de
  epígrafe, y su apartado de detalle para MO.3/MO.6 a nivel de subepígrafe).
- El modelo no "busca qué es relevante"; se le entrega ya el fragmento correcto del
  diagnóstico y su tarea es reformatear/expandir ese contenido al formato del capítulo de
  ordenación. Esto es una tarea mucho más acotada y fiable que una búsqueda abierta.
- Ejemplo: el catálogo de Bienes de Interés Cultural de MO.6.1.1 siempre se recupera de
  la sección de Patrimonio Histórico del diagnóstico (bloque MI.1.7), nunca de una
  búsqueda semántica sobre el documento completo.

## Motor 3 — Generación asistida por tabla (contenido tipo C)

- Se activa en los capítulos de propuesta técnica real (el caso más claro es MO.5,
  sistemas generales: parques, equipamientos, viario, redes).
- El usuario rellena una tabla estructurada (ver `04-edicion-y-tablas.md`): filas con los
  elementos propuestos y columnas con sus atributos (nombre, tipo, superficie,
  existente/propuesto...).
- El LLM recibe esa tabla como dato de entrada y **solo redacta el texto que la envuelve**
  (la frase introductoria del apartado, el contexto), nunca inventa ni completa filas.
- Mientras la tabla esté vacía, el capítulo no se genera — se le presenta al usuario el
  formulario/tabla en blanco, nunca un texto de propuesta inventado.

## El mapeo capítulo → sección del diagnóstico debe ser editable, no fijo en el código

Decisión explícita: aunque hoy todos los diagnósticos de origen siguen la misma plantilla
del estudio (uso interno, ver `00-README.md`), el mapeo de qué sección del diagnóstico
alimenta cada bloque de cada capítulo **puede cambiar en el futuro** si cambia la plantilla
de diagnóstico. Por tanto:

- El mapeo vive en un panel de configuración editable (no hardcodeado), donde alguien del
  equipo puede actualizar "la sección de patrimonio ahora está en X" sin tocar código.
- Cada entrada del mapeo declara, como mínimo: capítulo/subepígrafe de destino, motor a
  usar, sección de origen en el diagnóstico (si aplica), y si el bloque es opcional o
  puede fusionarse con otro (ver siguiente apartado).

Ficha de ejemplo (formato ilustrativo, no definitivo):

```
Capítulo: MO.6.1.1
Motor: RAG dirigido
Fuente: diagnóstico → sección "Patrimonio Histórico" (bloque MI.1.7)
Salida: ficha por bien catalogado (código, tipo, descripción) + texto envolvente (plantilla)
Editable manualmente: sí
Regenerable desde diagnóstico: sí, con confirmación si hay ediciones previas
```

## Qué pasa cuando un capítulo no tiene información

Un capítulo o subepígrafe puede llegar sin datos por dos motivos distintos, y la
herramienta debe distinguirlos — no tratarlos igual:

1. **Falta información real** — el diagnóstico debería traer ese dato y no está (por
   ejemplo, no se encuentra el apartado de riesgos de inundación). Esto es una alerta:
   el capítulo se marca para revisar y se informa de qué no se encontró.

2. **El capítulo no aplica o se fusiona con otro** — no es un error, es una decisión
   editorial válida del equipo redactor. Ejemplo real: en Lora del Río, el contenido que
   en Osuna es el capítulo MO.12 (diseño del informe de seguimiento) está fusionado dentro
   de MO.11 como un segundo epígrafe, no existe como capítulo aparte.

En ambos casos el capítulo se marca de forma distinguible en el semáforo (ver
`03-flujo-de-usuario.md`, estado "sin información / no aplica"), y se le pregunta al
usuario cuál de las dos situaciones es — sin bloquear el resto del proceso ni asumir por
defecto que es un error.

## Resumen de qué motor usa cada capítulo

| Capítulo | Motor principal |
|---|---|
| MO.1 | Plantilla |
| MO.2 | Plantilla (banco de objetivos reutilizable) + ajuste con datos de síntesis del diagnóstico |
| MO.3 | RAG dirigido (con partes de propuesta técnica en 3.2 y 3.3.1/3.3.2) |
| MO.4 | Plantilla |
| MO.5 | Asistido por tabla |
| MO.6 | RAG dirigido |
| MO.7 | Plantilla |
| MO.8 | Plantilla + tabla de programación económica (aportada por el técnico/consultora económica) |
| MO.9 | Plantilla |
| MO.10 | Plantilla |
| MO.11 | Plantilla + inserción de datos (lista de municipios colindantes) |
| MO.12 | Plantilla |

Ver `01-analisis-diagnostico-a-ordenacion.md` para el detalle de por qué cada uno se
clasifica así.
