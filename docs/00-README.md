# El Urbanista — Generador de Memoria de Ordenación

Especificación funcional y técnica para desarrollar, dentro de El Urbanista (UrbanDocs AI),
la funcionalidad que genera los 12 capítulos de la Memoria de Ordenación de un Documento
de Avance (PGOM/PBOM), a partir del Diagnóstico ya redactado del municipio.

Esta carpeta es el encargo para Claude Code. Contiene el análisis que fundamenta el diseño,
las reglas funcionales acordadas y un prototipo visual navegable de referencia (no es el
producto final, es la maqueta de estilo y de flujo).

## Cómo leer esta carpeta, en orden

1. **01-analisis-diagnostico-a-ordenacion.md** — por qué la funcionalidad está diseñada así.
   Análisis capítulo a capítulo de dos Avances reales (Osuna y Lora del Río) contrastados
   contra sus Diagnósticos. Es la base de todo lo demás: qué parte de cada capítulo es
   plantilla fija, qué parte son datos que ya están en el diagnóstico, y qué parte es
   propuesta técnica nueva que solo puede aportar el redactor.

2. **02-arquitectura-motores.md** — cómo se genera cada capítulo en la práctica: los tres
   "motores" de generación (plantilla, RAG dirigido, asistido por tabla), el mapeo
   capítulo → sección del diagnóstico, y cómo se gestiona cuando un capítulo no tiene
   información o no aplica a un municipio concreto.

3. **03-flujo-de-usuario.md** — el recorrido completo de pantallas: desde elegir qué
   documento redactar hasta descargar los .doc finales. Describe cada pantalla, qué
   dispara la navegación entre ellas y los estados (semáforo de capítulos).

4. **04-edicion-y-tablas.md** — reglas del editor de texto, el historial de versiones,
   y las tablas editables de los capítulos de propuesta técnica (añadir filas y columnas).

5. **05-sistema-de-diseno.md** — identidad visual: nombre de la app, paleta de color,
   tipografía, principio de "sin degradados", y componentes reutilizables.

6. **06-decisiones-pendientes.md** — lo que quedó abierto en la conversación de diseño y
   que hay que resolver o acordar con el equipo antes/durante el desarrollo.

7. **prototipo.html** — maqueta HTML navegable (abrir directamente en el navegador) con
   el flujo de pantallas y el estilo visual ya aplicados. Sirve de referencia de diseño,
   no de arquitectura de código: no está construido en el stack real (Next.js/Supabase),
   es solo HTML/CSS/JS estático para enseñar el aspecto y la interacción.

## Contexto del producto (resumen)

El Urbanista es una plataforma de documentación urbanística (PGOU, PBOM, PERI, etc. por
comunidad autónoma), construida sobre Next.js, Supabase y la API de Claude, con arquitectura
RAG (LlamaIndex) para evitar alucinaciones, prompts encadenados por sección de documento,
edición por bloques y exportación a Word/PDF. Ya existe una biblioteca de plantillas
cruzando tipo de plan × comunidad autónoma.

Esta funcionalidad — la Memoria de Ordenación de los Avances — es nueva, pero debe encajar
en esa arquitectura: no es un tipo de documento aparte, es un nuevo miembro de la biblioteca
de plantillas con una particularidad — usa tres motores de generación distintos según el
capítulo, en lugar de un único prompt de generación libre.

Uso previsto: **herramienta interna del propio estudio de urbanismo**, no multi-tenant para
clientes externos con diagnósticos de formato desconocido — se puede asumir que todos los
diagnósticos que alimentan esta funcionalidad siguen (más o menos) la misma plantilla del
estudio.
