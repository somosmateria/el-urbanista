import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.12 · Diseño preliminar del informe de seguimiento de la ejecución
 * urbanística: estructura y contenidos clave.
 *
 * 100% plantilla, sin variables de municipio — confirmado palabra por
 * palabra contra Osuna y Lora del Río (test-data/). En Lora del Río este
 * contenido no es un capítulo aparte: va como segundo epígrafe dentro de
 * MO.11 ("2. Avance de la propuesta de estructura y contenido del
 * preceptivo informe..."), pero el texto es idéntico — es una diferencia de
 * empaquetado, no de contenido (ver docs/01-analisis-diagnostico-a-ordenacion.md).
 */
export function generarMO12(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">MO.12 · DISEÑO PRELIMINAR DEL INFORME DE SEGUIMIENTO DE LA EJECUCIÓN URBANÍSTICA</div>
<div class="doc-text">
<p>La Disposición Adicional Segunda de la Ley para el Impulso de la Sostenibilidad del
Territorio de Andalucía (LISTA) establece que el informe de seguimiento de la
actividad de ejecución urbanística, elaborado conforme a lo dispuesto en el artículo
22.6 del Texto Refundido de la Ley de Suelo y Rehabilitación Urbana, aprobado por el
Real Decreto Legislativo 7/2015, de 30 de octubre, deberá formularse con una
periodicidad cuatrienal.</p>

<p>Desde este Plan se propone que dicho informe se configure como una herramienta
tanto técnica como estratégica, destinada a garantizar un seguimiento efectivo del
planeamiento urbanístico.</p>

<p>Su finalidad principal debe ser la de constituir un mecanismo periódico y
sistemático que permita evaluar, con rigor técnico y transparencia, el grado de avance
en la ejecución del PGOM, su impacto sobre el entorno urbano, su nivel de
sostenibilidad y su contribución al cumplimiento de los objetivos estratégicos
definidos por el propio plan.</p>

<p>El informe debe ofrecer una visión integral y multidimensional de la gestión
urbanística local, convirtiéndose en una guía para la mejora continua del
planeamiento y en un instrumento de apoyo a la toma de decisiones en todos los
niveles de la administración municipal.</p>

<p>Se propone que la estructura del informe responda a una lógica funcional orientada
al análisis del proceso urbanístico en torno a tres ejes fundamentales: la ejecución
formal del plan, la sostenibilidad del modelo urbano adoptado, y los resultados
observables en el territorio.</p>

<p>Para ello, debe aplicarse una metodología basada en indicadores específicos,
cuantificables y verificables, que permitan generar conocimiento a partir de datos
objetivos y faciliten la identificación de avances, estancamientos o desviaciones
respecto a las metas del PGOM. La selección de estos indicadores debe realizarse en
función de su relevancia, la disponibilidad de información, su coherencia con las
políticas públicas sectoriales y su capacidad para representar de forma sintética y
comparable los procesos urbanos a lo largo del tiempo.</p>

<p>Los indicadores se agrupan en tres bloques principales. Primero, indicadores de
seguimiento, orientados a medir el estado de ejecución operativa del PGOM: el
porcentaje de suelo urbanizado respecto al total planificado, el número de licencias de
edificación concedidas según tipología de uso, la proporción de vivienda protegida
sobre el total autorizado, la superficie de sistemas generales efectivamente ejecutada
y el número de actuaciones de transformación urbanística en desarrollo o finalizadas.
Estos datos permiten valorar el ritmo y la calidad del desarrollo urbano, así como
identificar áreas de oportunidad o de retraso en la implementación de los
instrumentos urbanísticos previstos.</p>

<p>Segundo, indicadores de sostenibilidad del modelo urbano: este bloque analiza
tanto las dimensiones ambientales como sociales y económicas del modelo urbano.
Entre las variables a considerar se encuentran la densidad bruta de población
(habitantes por hectárea urbana), el porcentaje de superficie impermeabilizada en el
ámbito municipal, el porcentaje de la población con acceso a espacios verdes a menos
de 300 metros de su residencia, la proporción de desplazamientos realizados a pie o
en bicicleta respecto al total, las emisiones de CO₂ per cápita asociadas al consumo
energético residencial, la tasa de reciclaje de residuos sólidos urbanos y el porcentaje
de viviendas vacías en relación con el parque edificado. Estos indicadores deben
ofrecer una imagen clara sobre la eficiencia en el uso del suelo, el grado de
compactación del tejido urbano, la equidad en el acceso a servicios y espacios
públicos, el comportamiento energético de la ciudad y el nivel de circularidad en la
gestión de recursos, en coherencia con los objetivos de sostenibilidad urbana
establecidos a nivel regional, estatal y europeo.</p>

<p>Tercero, indicadores de resultados territoriales: se centran en los efectos
generados por la aplicación del PGOM. Se analizarán variables como la evolución del
precio medio del suelo y de la vivienda, el grado de mezcla funcional en los nuevos
desarrollos (residencial, comercial, terciario, dotacional), la tasa de crecimiento
poblacional en áreas de expansión, la creación de empleo vinculado a nuevas
actividades económicas asociadas al desarrollo urbanístico, los cambios en la
estructura modal del transporte urbano, el nivel de satisfacción ciudadana respecto al
entorno urbano —evaluado mediante encuestas o consultas—, y el grado de
cumplimiento de los objetivos estratégicos y operativos del PGOM.</p>

<p>Este conjunto de indicadores permite evaluar no solo la eficacia técnica del
planeamiento, sino también su impacto real sobre la calidad de vida, la cohesión
territorial, la funcionalidad del espacio urbano y la percepción ciudadana.</p>

<p>La información que alimenta estos indicadores debe provenir de fuentes fiables,
actualizadas y fácilmente auditables, tales como registros municipales de licencias y
obras, estadísticas del padrón y del catastro, bases de datos territoriales, encuestas de
movilidad, inventarios de emisiones, datos de la Agencia Andaluza de la Energía,
encuestas ciudadanas promovidas por la administración, servicios de información
geográfica (SIG), y publicaciones del IECA, entre otras.</p>

<p>Siempre que sea posible, los datos deberán compararse con valores de referencia
anteriores, generando series temporales que permitan detectar tendencias y anticipar
escenarios futuros. Asimismo, los indicadores deberán permitir desagregaciones
espaciales (por barrio, distrito o zona urbanística) y sociales (por edad, género o nivel
socioeconómico), si la disponibilidad de los datos lo permite, a fin de mejorar la
capacidad diagnóstica del informe.</p>

<p>Desde el punto de vista formal, el informe debe redactarse con un lenguaje claro y
preciso, basado en un razonamiento técnico riguroso y una estructura lógica. Aunque
debe ser comprensible para personas no expertas, su contenido debe conservar la
profundidad analítica necesaria para su uso por equipos técnicos, responsables
políticos y agentes sectoriales en la toma de decisiones. Se recomienda un uso
intensivo de mapas temáticos, gráficos de evolución, infografías comparativas, tablas
resumen y otros recursos visuales que faciliten la interpretación de los datos y
permitan captar de forma rápida la magnitud de los fenómenos analizados.</p>

<p>El documento debe incorporar, además, una reflexión interpretativa que vincule los
datos obtenidos con el modelo urbano-territorial promovido por el PGOM,
identificando sus aciertos, limitaciones, contradicciones o potencialidades aún no
desarrolladas.</p>

<p>A partir de esta reflexión deberán plantearse propuestas concretas para corregir
desviaciones, mejorar la gestión urbanística, introducir nuevas estrategias de
intervención o actualizar el enfoque del PGOM conforme a los cambios normativos,
sociales o climáticos. Estas propuestas deben ser operativas, priorizadas y vinculadas a
horizontes temporales realistas, y deben poder incorporarse en futuros ciclos
evaluativos.</p>

<p>Finalmente, el informe debe cerrarse con un conjunto de anexos técnicos que
incluyan las fichas completas de todos los indicadores utilizados, especificando su
definición, fórmula de cálculo, unidad de medida, fuente de datos, frecuencia de
actualización, nivel de desagregación y observaciones metodológicas. También deben
incorporarse los mapas utilizados, resultados completos de encuestas o consultas
públicas, tablas de datos desagregados, referencias normativas y bibliográficas
empleadas, y un glosario de términos técnicos.</p>

<p>Este modelo de informe debe concebirse como una herramienta de planificación
evaluativa en continua evolución, flexible y adaptada a las características específicas
del municipio, pero con capacidad para establecer una base común de referencia que
facilite la comparación entre territorios, la coordinación entre escalas de planificación
y la mejora progresiva del sistema urbano andaluz en su conjunto.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>
`.trim();
}
