import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.9 · El contenido de las normas urbanísticas.
 *
 * 100% plantilla, sin variables de municipio — confirmado comparando el
 * texto real de Osuna y Lora del Río (test-data/): es literalmente idéntico
 * palabra por palabra en ambos Avances, solo cambia dónde se empaqueta
 * (capítulo aparte en Osuna; subapartado dentro de MO.11 en Lora del Río,
 * ver docs/01-analisis-diagnostico-a-ordenacion.md, nota al pie de la tabla
 * capítulo a capítulo).
 */
export function generarMO9(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">MO.9 · EL CONTENIDO DE LAS NORMAS URBANÍSTICAS</div>
<div class="doc-text">
<p>Las Normas Urbanísticas del PGOM se proponen estructurar de la siguiente forma.</p>

<p>El Título I establecerá los principios, objetivos y mecanismos para garantizar un
desarrollo territorial sostenible y coherente a largo plazo. Este título articulará las
directrices necesarias para garantizar la sostenibilidad social, económica y ambiental
del desarrollo urbano, asegurando el acceso equitativo a vivienda, servicios,
infraestructuras y movilidad sostenible. También detalla el contenido normativo del
plan, incluyendo un diagnóstico territorial, la normativa aplicable, representaciones
gráficas y estudios técnicos complementarios que sustentan su coherencia e
inclusividad. Para mantener su efectividad, establecerá mecanismos de seguimiento y
evaluación periódicos, como informes sobre el impacto urbanístico, ambiental y
económico de las actuaciones, y el monitoreo de indicadores de sostenibilidad.
Asimismo, se preverán procedimientos para su modificación o revisión ante cambios
normativos o contextuales, asegurando su adaptabilidad sin perder consistencia.</p>

<p>El Título II establecerá el régimen urbanístico del suelo y las edificaciones, con las
disposiciones generales y específicas que regulen el uso, la gestión y las actuaciones
permitidas en el suelo y las edificaciones del municipio, diferenciando entre suelo
urbano y suelo rústico, y fijando las condiciones para cada tipo. En conjunto, este
Título II debe proporcionar un marco normativo detallado para asegurar que el uso y
las intervenciones en el suelo y las edificaciones del municipio se lleven a cabo de
manera ordenada, sostenible y en beneficio del interés general.</p>

<p>El Título III establecerá las normas que regulen los diferentes usos del suelo y las
edificaciones, definiendo su clasificación, compatibilidad y limitaciones. Los usos se
organizarán en dos niveles principales: usos globales, que agrupan las actividades
según su función principal, como residencial, turístico, productivo, servicios o
dotacional; y usos pormenorizados, que detallan las actividades específicas permitidas
dentro de cada uso global, asegurando una regulación más precisa.</p>

<p>Se definirán los usos principales o dominantes en cada zona, junto con los usos
complementarios que los refuercen. También se especificarán los usos compatibles,
permitidos bajo ciertas condiciones, y los prohibidos, que no se admiten por ser
incompatibles con la ordenación del territorio. Se priorizará la integración funcional
de los usos, promoviendo la diversidad en los espacios urbanos sin comprometer la
calidad de vida ni el equilibrio territorial. Además, se establecerán criterios
específicos para garantizar que las actividades sean compatibles con su entorno y
respeten la normativa aplicable.</p>

<p>El Título IV estará a regular los usos y actuaciones permitidas en el suelo rústico,
estableciendo normas específicas según su categoría y orientación a la preservación
del entorno natural, el aprovechamiento sostenible de los recursos y la compatibilidad
con el desarrollo urbano controlado. Se debe asegurar que el uso del suelo rústico se
realice de manera controlada, sostenible y respetuosa con el entorno, garantizando su
preservación como recurso estratégico para el municipio.</p>

<p>El Título V se dedicará a la planificación estratégica de la evolución del modelo
general de ordenación. Se dedicará al establecimiento de los criterios y estrategias
generales de ordenación que orientan la planificación y el desarrollo urbano del
municipio. Este título establecerá un marco estratégico para garantizar un modelo de
ordenación territorial sostenible, equitativo y adaptado a las necesidades presentes y
futuras, priorizando la cohesión social, la sostenibilidad ambiental y la eficiencia
económica.</p>

<p>Se debe priorizar la mejora de la ciudad consolidada mediante la rehabilitación,
regeneración y renovación de los espacios urbanos, incluyendo estrategias para la
modernización de infraestructuras y servicios, la mejora de la calidad del entorno
construido y la accesibilidad, y la integración de criterios paisajísticos y ambientales
en las intervenciones urbanas. Para los nuevos ámbitos de urbanización, hay que
establecer criterios específicos que garantizan su sostenibilidad e integración con el
entorno. En ambos casos, hay que definir criterios para reservar suelo destinado a
vivienda protegida, con el objetivo de atender las necesidades de las personas más
vulnerables y fomentar la equidad en el acceso a la vivienda.</p>

<p>Se deben incluir estrategias para priorizar modos de transporte sostenibles, como
el transporte público, la movilidad peatonal y ciclista, procurando la reducción del uso
del vehículo privado y promoviendo la planificación de infraestructuras que favorezcan
una movilidad más eficiente y menos contaminante.</p>

<p>Y por último, se deben establecer directrices para equilibrar las cargas y beneficios
derivados de las actuaciones urbanísticas, garantizando que los costos del desarrollo
sean asumidos de manera justa por todos los actores involucrados, sin comprometer el
interés general.</p>

<p>El Título VI regulará los elementos estructurantes del territorio, considerados
piezas clave para garantizar la funcionalidad, conectividad y sostenibilidad del modelo
urbanístico. Estos elementos incluyen sistemas generales de áreas libres,
equipamientos comunitarios, movilidad e infraestructuras, los cuales deben asegurar
el equilibrio entre el desarrollo urbano, la calidad ambiental y el bienestar social. El
título debe incorporar estándares mínimos para la planificación y ejecución de los
elementos estructurantes, asegurando su coherencia con el modelo general de
ordenación. También debe promover la adaptación de estos elementos a las
necesidades futuras del municipio y al cambio climático.</p>

<p>El Título VII se dedicará, por un lado, a establecer la delimitación de los bienes y
espacios que deban contar con una singular protección por su valor histórico, cultural,
urbanístico o arquitectónico, en cumplimiento del artículo 63.1.c de la LISTA y del
artículo 75.5 de su Reglamento General. Y por otro lado, debe identificar los bienes y
espacios en suelo rústico que, por su valor histórico, cultural, urbanístico o
arquitectónico, deban contar con protección, aunque no sean de singular protección
(artículo 77 del Reglamento de la LISTA). Se deben regular las intervenciones en bienes
protegidos, priorizando aquellas que respeten su valor histórico, arquitectónico o
ambiental. Las actuaciones irán desde la conservación y mantenimiento hasta
rehabilitaciones compatibles, siempre bajo la supervisión de las autoridades
competentes. También se deben prever mecanismos para revisar y modificar el
catálogo de bienes y espacios protegidos, asegurando su actualización ante la
identificación de nuevos elementos de interés o cambios en el contexto urbanístico o
normativo.</p>

<p>El Título VIII establecerá las disposiciones necesarias para integrar la protección
ambiental en todas las actividades urbanísticas, asegurando que el desarrollo del
territorio sea compatible con la conservación del medio ambiente, el paisaje y los
recursos naturales. Se definirá la aplicación de normas específicas para garantizar la
protección de bienes de dominio público, el respeto a las servidumbres legales y la
incorporación de criterios ambientales en los instrumentos de ordenación y desarrollo
urbano. Estas disposiciones deben buscar minimizar el impacto ambiental y maximizar
la eficiencia en el uso de recursos.</p>

<p>Es especialmente importante establecer directrices para conservar el arbolado, la
vegetación y la fauna local, promoviendo la integración del patrimonio natural en las
actuaciones urbanísticas. Así como adoptar medidas para garantizar la protección e
integración del paisaje en las actuaciones urbanísticas, y promover un modelo de
desarrollo que optimice los recursos disponibles mediante la incorporación de medidas
de eficiencia energética y ahorro de agua en los proyectos urbanísticos, la integración
de infraestructuras sostenibles, como redes de agua regenerada y sistemas de drenaje
eficiente, o el fomento de prácticas urbanísticas responsables que minimicen residuos
y emisiones.</p>

<p>El Título IX se dedica al establecimiento de los objetivos y criterios esenciales para
garantizar un desarrollo urbano que priorice la calidad de los espacios públicos, la
funcionalidad de las infraestructuras, la sostenibilidad y la habitabilidad. Este título
debe orientarse a que las actuaciones urbanísticas contribuyan a crear una ciudad más
eficiente, inclusiva y adaptada a las necesidades de sus habitantes.</p>

<p>Se detallarán las condiciones de diseño y trazado de las redes viarias y de los
espacios libres y zonas verdes como elementos clave para la calidad urbana, y se
establecerán los criterios para el diseño y desarrollo de las redes de servicios urbanos,
como agua, energía, saneamiento y drenaje. Se incluirán disposiciones específicas
sobre las obras de urbanización, asegurando que cumplan con estándares de calidad
técnica, accesibilidad y sostenibilidad. Además, fomenta la coordinación entre las
redes de servicios y los elementos urbanos para maximizar su funcionalidad.</p>

<p>El Título X regulará los aspectos fundamentales para la construcción, diseño y uso
de edificaciones, estableciendo estándares que aseguren la funcionalidad, seguridad,
sostenibilidad y armonía estética de las construcciones en el municipio. Estas normas
buscan garantizar una edificación coherente con el modelo urbanístico, respetando
tanto el entorno construido como el natural.</p>

<p>Este título definirá las condiciones generales aplicables a las edificaciones en
términos de localización, diseño, volumen y ocupación, detallando aspectos clave
como: definición de tipos de obras, condiciones de edificabilidad, altura máxima y
rasantes, normas relativas a parcelas, etc.</p>

<p>El título debe incorporar criterios para fomentar la sostenibilidad en las
edificaciones, como: uso eficiente de recursos energéticos y de agua, adaptación a
normativas de ahorro energético y reducción de emisiones, incentivos para el uso de
materiales sostenibles y la incorporación de tecnologías innovadoras; así como
estándares básicos de seguridad estructural, además de garantizar la accesibilidad
universal, incorporando elementos que faciliten el uso por parte de personas con
movilidad reducida o necesidades específicas.</p>

<p>Finalizarían las normas con las Disposiciones Finales, necesarias para garantizar la
correcta aplicación, transición y actualización de las normas urbanísticas establecidas
en el plan. Se regularían aquí los aspectos relacionados con la adaptación de los
desarrollos existentes, las normas transitorias y las disposiciones adicionales y
derogatorias, asegurando una implementación ordenada del PGOM.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>
`.trim();
}
