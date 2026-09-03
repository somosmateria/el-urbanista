# Análisis: Memoria de Ordenación (Avance PGOM/PBOM) — Osuna vs. Lora del Río

Base: comparación línea a línea de los 12 (11 en Lora) capítulos MO.1–MO.12 de ambos
Avances, cruzados contra sus respectivos Diagnósticos (Fase II).

## El hallazgo clave

Cada capítulo se compone de tres tipos de contenido, mezclados en proporciones distintas:

| Tipo | Qué es | Fuente | Ejemplo comprobado |
|---|---|---|---|
| **A. Boilerplate normativo** | Párrafos casi idénticos entre municipios, citando LISTA/TRLSRU/POTA | La ley, no el diagnóstico | MO.1 (Osuna) y MO.1 (Lora) comparten ~90% del texto literal, solo cambia el nombre del municipio y "39 años" ↔ "20 años" |
| **B. Datos extraídos del diagnóstico** | Cifras, códigos, listados (hectáreas, ZEC, BIC, riesgos, vías pecuarias) | Diagnóstico, sección concreta | Código ZEC "ES6180011" y sus hectáreas aparecen en el diagnóstico (MI.4) y se reutilizan tal cual en MO.3 |
| **C. Propuesta técnica ("criterio")** | Decisiones de diseño urbano específicas del redactor | No está en ningún documento previo — es creación nueva | Tabla de áreas recreativas propuestas en MO.5 (código, nombre, superficie, existente/propuesto) |

Esto significa que **automatizar "genera el capítulo X a partir del diagnóstico" es la pregunta
equivocada para la mitad de los capítulos**. Para el tipo A no hace falta ni RAG ni LLM —
hace falta una plantilla con variables. Para el tipo B sí hace falta RAG bien dirigido a
secciones concretas del diagnóstico. Para el tipo C, el LLM solo puede dar una propuesta
de borrador; el criterio final es del técnico.

---

## Tabla capítulo a capítulo

| Cap. | Título (común a ambos) | Mezcla A/B/C | Secciones del diagnóstico de las que bebe | Estrategia de generación |
|---|---|---|---|---|
| **MO.1** | Procedencia/oportunidad del PGOM y alternativas | ~90% A, 10% variables | Ninguna (fecha del plan vigente, nº de años) | Plantilla fija + 2-3 variables (nombre municipio, plan vigente y su fecha, años transcurridos) |
| **MO.2** | Criterios y objetivos del modelo (11 subapartados: medio físico, patrimonio natural, patrimonio cultural, cambio climático, movilidad, agua, energía, residuos, salud, género, gobernanza) | ~70% A/B (banco de objetivos reutilizable), 30% C | MI.6 (diagnóstico-síntesis), MI.7 (líneas de trabajo), MI.8 (criterios ya esbozados en el propio diagnóstico) | "Menú" de objetivos estándar por temática (biblioteca reutilizable) + selección/ajuste según problemas detectados en MI.6-8 del municipio concreto |
| **MO.3** | Clasificación del suelo: SR especialmente protegido, sistemas generales, infraestructura verde, suelo urbano | ~15% A, ~70% B, 15% C | MI.4 (vínculos ambientales: ZEC, ZEPA, vías pecuarias, patrimonio), MI.1.9-1.12 (usos, riesgos, estructura parcelaria) | RAG dirigido: extraer inventario íntegro de MI.4 + tablas de MI.1.10/1.12, y verterlo en la estructura de categorías del art. 14 LISTA |
| **MO.4** | Regulación de usos en suelo rústico/urbano | ~85% A, 15% B | MI.1.9 (usos y actividades actuales) | Plantilla fija (cita literal de arts. 21 LISTA / 28 RGLISTA) + inserción de usos actuales detectados |
| **MO.5** | Sistemas generales: espacios libres, equipamientos, movilidad, redes | ~10% A, 30% B, ~60% C | MI.1.13 (asentamientos), MI.3 (infraestructuras), MI.5 (movilidad/PMUS) | Aquí el LLM puede dar la estructura y redactar a partir de un input tabular que el técnico rellena (nombre, código, superficie, propuesto/existente) — no generar la propuesta él solo |
| **MO.6** | Protección patrimonio cultural, ambiental, paisaje | ~15% A, ~65% B, 20% C | MI.1.7 (patrimonio histórico, con código BIC y descripción), MI.4.4 (bienes catalogados) | RAG: volcar ficha por ficha el catálogo BIC/patrimonial del diagnóstico, expandiendo la descripción ya existente |
| **MO.7** | Urbanismo inclusivo: accesibilidad, diversidad, género, seguridad | ~80% A/B, 20% C | MI.7.1 (perspectiva de género ya trabajada en diagnóstico) | Plantilla estándar por eje temático, ligero ajuste con datos socio-demográficos de MI.1.2 |
| **MO.8** | Programación y estudios económicos | ~75% A (marco conceptual y normativo), 25% B/C (cifras de inversión, plazos) | MI.2 (grado de ejecución del planeamiento vigente) | Plantilla fija para el marco conceptual + tabla de programación que aporta el técnico/consultora económica |
| **MO.9** | Contenido de las normas urbanísticas | ~100% A | Ninguna | Plantilla 100% fija, sin variables de municipio (podría ni pasar por LLM) |
| **MO.10** | Planificación estratégica del modelo | ~80% A, 20% C | MI.6/MI.7 | Plantilla + ajuste fino con problemas/oportunidades detectados |
| **MO.11** | Compatibilización con municipios colindantes | ~70% A, 30% B | MI.1.1 (encuadre territorial — municipios limítrofes) | Plantilla + inserción automática de la lista de municipios colindantes desde el diagnóstico |
| **MO.12**¹ | Diseño del informe de seguimiento de ejecución | ~100% A | Ninguna | Plantilla 100% fija |

¹ En Lora del Río, MO.12 no existe como capítulo separado — su contenido está fusionado
dentro de MO.11 (segundo epígrafe). Es una diferencia de *empaquetado*, no de contenido:
conviene que la herramienta trate "contenido de normas urbanísticas" y "diseño del informe
de seguimiento" como dos *bloques* independientes que luego se puedan montar en 1 o 2
capítulos según la plantilla que elija cada equipo redactor.

---

## Otras diferencias estructurales observadas entre los dos municipios

- **Orden de las memorias**: Osuna = Información → Ordenación → Participación. Lora del Río =
  Información → Participación → Ordenación. El *contenido* de cada memoria es equivalente;
  cambia el orden de encuadernación. La herramienta debería generar capítulos "sueltos"
  (que es justo lo que planteáis, un .doc por capítulo) y dejar el montaje final al usuario.
- **Granularidad de subapartados**: mismo esqueleto temático (medio físico, patrimonio,
  cambio climático, movilidad, agua, energía, residuos, género, gobernanza) pero Lora del Río
  añade un punto específico ("LA INUNDABILIDAD EN LORA DEL RÍO") dentro de MO.5 que Osuna no
  tiene — un añadido justificado por un riesgo detectado en su diagnóstico. Esto confirma que
  el esqueleto es fijo pero **admite subapartados adicionales cuando el diagnóstico señala un
  problema específico** (así que la herramienta necesita permitir "insertar subapartado" a partir
  de alertas del diagnóstico, no solo rellenar un molde cerrado).
- **Nombres de epígrafes**: casi idénticos pero no verbatim (p.ej. MO.6 se llama distinto en cada
  uno aunque cubre lo mismo). Para una biblioteca de plantillas conviene fijar un nombre canónico
  por capítulo y no depender del título exacto que use cada consultora.

---

## Propuesta de arquitectura (para discutir)

Dado que ya tenéis en UrbanDocs AI: RAG con LlamaIndex, prompts encadenados por sección,
edición por bloques y plantillas por tipo de plan/CCAA, la Memoria de Ordenación encaja como
un **nuevo tipo de plantilla con tres motores distintos según el tipo de bloque**, no un único
prompt "resume el diagnóstico en este capítulo":

1. **Motor de plantilla (tipo A)** — variables simples (nombre del municipio, fechas, plan
   vigente, municipios colindantes). Cero LLM, o LLM solo para pulir la redacción final. Esto
   cubre MO.1, MO.4, MO.7 (base), MO.9, MO.10 (base), MO.11 (base), MO.12 casi entero — es
   la mayoría del volumen de páginas con el menor riesgo de alucinación.
2. **Motor RAG dirigido (tipo B)** — no "busca en todo el diagnóstico", sino recuperación
   **por sección predefinida**: cada capítulo de ordenación tiene mapeadas de antemano las
   secciones exactas del diagnóstico de las que debe tirar (ver tabla). Esto reduce
   drásticamente el riesgo de alucinación porque el prompt no "busca libremente", solo
   reformatea/expande datos que ya están verificados en el diagnóstico.
3. **Motor asistido (tipo C)** — aquí el LLM no debe proponer solo; necesita un input
   estructurado del técnico (tabla de propuestas: código, nombre, superficie, clasificación,
   existente/propuesto) y su función es redactar el texto de acompañamiento, no decidir el
   contenido urbanístico.

### Por qué esto importa para que "otros usuarios lo hagan sin recurrir a ti"

Si tratáis los 12 capítulos como un único prompt "genera desde el diagnóstico", vais a tener
buenos resultados en MO.3/MO.6 (datos) y muy flojos en MO.1/MO.9/MO.12 (donde sobra
o falta literalidad legal) y en MO.5 (donde el LLM se inventará propuestas urbanísticas que
no le corresponden). Separar los tres motores permite que un usuario sin tu supervisión:
- reciba automáticamente los capítulos tipo A ya casi terminados,
- reciba los tipo B con los datos correctos volcados (y solo tenga que revisar), y
- reciba los tipo C como una plantilla en blanco con la estructura correcta esperando su
  tabla de propuestas, en lugar de un texto inventado que parezca terminado pero no lo esté.

---

## Mapeo detallado a nivel de subepígrafe: MO.3 y MO.6

Estos dos capítulos son los más densos en datos, así que merece la pena bajar un nivel más.

### MO.3 — Clasificación del suelo

| Subepígrafe de MO.3 | Tipo | De dónde sale |
|---|---|---|
| 3.1.1. Suelo especialmente protegido por legislación sectorial (ZEC, ZEPA, vías pecuarias, patrimonio) | Dato | Inventario de espacios protegidos del diagnóstico (vínculos ambientales) — códigos, hectáreas y nombres se copian y se reformatean en fichas por zona |
| 3.1.2. Suelo preservado por riesgos (inundación, etc.) | Dato + un poco de plantilla | Apartado de riesgos hidrológicos del diagnóstico — el texto regulador que rodea el dato sí es plantilla fija |
| 3.1.3. Suelo preservado por ordenación territorial (POTA, PEMF) | Dato | Apartado de planificación territorial del diagnóstico |
| 3.1.4. Suelo rústico común | Mayormente plantilla | Casi no depende de datos, es la categoría "resto" |
| 3.2. Sistemas generales en suelo rústico | Propuesta (criterio) | No viene del diagnóstico, es diseño del técnico |
| 3.3. Infraestructura verde (marco conceptual) | Plantilla pura | Ninguna — es teoría general, igual en todos los municipios |
| 3.3.1 / 3.3.2. Infraestructura verde aplicada al municipio | Propuesta con apoyo de datos | Combina el inventario ambiental del diagnóstico con una propuesta de diseño |
| 3.5. Edificaciones irregulares en suelo rústico | Dato | Catálogo de agrupaciones de edificaciones del diagnóstico (aparece calcado) |

### MO.6 — Protección del patrimonio y el medio ambiente

| Subepígrafe de MO.6 | Tipo | De dónde sale |
|---|---|---|
| 6.1.1. Bienes con protección singular (BIC) | Dato | Catálogo de patrimonio histórico del diagnóstico — se reutiliza la ficha completa (código, tipo, descripción histórica) casi sin cambios, solo se reencuadra como "medida de protección" |
| 6.1.2. Niveles de protección | Mitad plantilla, mitad dato | La escala de niveles es fija; los bienes concretos a los que se aplica cada nivel salen del catálogo |
| 6.1.3. Bienes sin protección singular en suelo rústico | Dato | Igual que 6.1.1 pero para el patrimonio "menor" (yacimientos no BIC) del diagnóstico |
| 6.2.1 a 6.2.5. Condiciones de protección ambiental, hidrológica, de fauna/flora, paisaje, bienes demaniales | Plantilla (normativa genérica) | Prácticamente nada town-specific — es la misma redacción reguladora en ambos municipios, cambia poco más que el nombre |

**Conclusión de este nivel de detalle**: dentro de MO.3 y MO.6, el patrón se repite en miniatura —
los "catálogos" (BIC, ZEC, riesgos, agrupaciones irregulares) son puro volcado de datos ya
verificados en el diagnóstico, mientras que los apartados "de condiciones/regulación" que los
rodean son plantilla fija. Esto es una muy buena noticia para la herramienta: la parte más
mecánica de estos dos capítulos (que es también la más larga en páginas) es la más fácil y
segura de automatizar bien.

---

## Siguiente paso sugerido

Antes de tocar arquitectura técnica en detalle, propongo fijar el **mapeo sección-a-sección
por capítulo** (la columna "de qué secciones del diagnóstico bebe") con más precisión —
ahora mismo está a nivel de epígrafe (MI.4, MI.1.7...) pero convendría bajar a subepígrafe
para poder automatizar la recuperación RAG sin ambigüedad, sobre todo en MO.3 y MO.6 que
son los capítulos con más densidad de datos.
