import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.10 · Planificación estratégica de la evolución del modelo general de
 * ordenación.
 *
 * Comparado íntegro contra el texto real de Osuna y Lora del Río
 * (test-data/): es prácticamente invariante — el único contenido específico
 * de municipio son dos menciones genéricas por nombre ("La ordenación del
 * suelo urbano en {municipio} se concibe...", "El PGOM de {municipio}
 * establecerá..."), sin observaciones locales del tipo de las de MO.7. Se
 * implementa con esas dos interpolaciones; el resto es plantilla fija.
 */
export function generarMO10(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">MO.10 · PLANIFICACIÓN ESTRATÉGICA DE LA EVOLUCIÓN DEL MODELO GENERAL DE ORDENACIÓN</div>
<div class="doc-text">
<p><strong>10.1. Criterios y estrategias generales de ordenación.</strong></p>

<p>Toda intervención urbanística o de transformación del territorio deberá diseñarse e
implementarse conforme al principio de desarrollo sostenible y a los principios
generales de ordenación recogidos en el artículo 4 de la Ley 7/2021, de 1 de diciembre,
de impulso para la sostenibilidad del territorio de Andalucía. Estas actuaciones deben
evaluarse teniendo en cuenta la viabilidad de sus determinaciones en términos
sociales, económicos, ambientales y paisajísticos, garantizando una ocupación
racional del suelo, promoviendo el uso eficiente de los recursos naturales, la
eficiencia energética, la resiliencia del territorio y una gobernanza transparente y
participativa.</p>

<p>Desde el punto de vista social, tanto las actuaciones urbanísticas como los
instrumentos de ordenación detallada deben responder al interés general, evitando
desarrollos basados en dinámicas especulativas y ajustando el crecimiento urbano a
las necesidades reales, consolidando la función social del suelo e incorporando de
manera transversal criterios de accesibilidad universal, cohesión social, igualdad de
género, perspectiva familiar y bienestar colectivo.</p>

<p>En el ámbito económico, será obligatorio justificar la viabilidad de las propuestas
mediante informes específicos que analicen la sostenibilidad financiera de las
actuaciones, acreditando la capacidad de la hacienda local para asumir los
compromisos derivados del planeamiento y equilibrar los costes e ingresos asociados.</p>

<p>Desde una perspectiva ambiental, todas las intervenciones deberán priorizar la
conservación del medio natural y de la biodiversidad, proteger y poner en valor el
patrimonio cultural, histórico y paisajístico, e incorporar medidas eficaces para
mitigar y revertir los efectos del cambio climático.</p>

<p><em>Estrategia territorial en materia de vivienda protegida.</em> La planificación
urbanística debe contemplar como directriz fundamental la reserva obligatoria de
suelo y edificabilidad para vivienda protegida en todas las actuaciones de
transformación del territorio, en suelo urbano y en suelo rústico. En los desarrollos
gestionados por entidades públicas, se establecerá una reserva mínima orientativa
del 60% para distintas tipologías de vivienda protegida. La ubicación de las parcelas
destinadas a este fin deberá atender a criterios de proximidad a transporte público,
servicios y equipamientos, y se fomentará una distribución territorial equilibrada
para evitar fenómenos de segregación social.</p>

<p>La determinación del mínimo obligatorio de vivienda protegida se basará en la
edificabilidad residencial prevista para cada ámbito, fijando un número concreto de
viviendas de carácter vinculante que no podrá reducirse, aunque sí incrementarse
hasta en un 15%. Estas parcelas solo podrán destinarse a vivienda sometida a algún
régimen de protección pública, permitiéndose de forma limitada usos
complementarios como servicios o pequeño comercio, siempre que no se altere el
número de viviendas protegidas comprometidas. Las obras deberán iniciarse en un
plazo máximo de dos años desde la conclusión de la urbanización y concluirse en un
plazo general de 30 meses, ampliable excepcionalmente en 15 meses adicionales; el
incumplimiento habilita al Ayuntamiento a ejercer mecanismos de intervención
directa mediante expropiación o sustitución del titular.</p>

<p><strong>10.2. Criterios y directrices para la delimitación de nuevas actuaciones de
transformación urbanística de nueva urbanización.</strong></p>

<p>La delimitación y ordenación de las actuaciones de nueva urbanización
corresponde a los Planes Parciales de Ordenación, en base a la planificación
estratégica de la evolución del modelo general de ordenación que ha de definir con
mayor precisión el documento completo del PGOM. Las actuaciones de
transformación urbanística en suelo rústico deberán justificar, conforme al artículo
31 de la LISTA, su viabilidad social, económica, ambiental y paisajística respecto a las
alternativas posibles en suelo urbano, aplicando criterios de proporcionalidad en
cuanto a su dimensión y evitando el consumo innecesario de suelo.</p>

<p>Las propuestas de delimitación de nuevas actuaciones en suelo rústico común
deberán justificar la necesidad de transformación conforme al artículo 50 del
RGLISTA, adoptando como referencia: las tasas de crecimiento de los últimos cinco
años y su proyección a diez, por población y actividad económica; el análisis de la
demanda prevista en los planes de vivienda y sectoriales; las áreas de suelo urbano
con potencialidad para nuevos usos o mayor intensidad; la superficie de suelo ya
incluida en actuaciones de transformación y su grado de ejecución; y la
disponibilidad de recursos hídricos y energéticos. Como criterios de priorización se
adoptan: favorecer desarrollos con densidad de viviendas eficiente que permitan
implementar o aprovechar el transporte público, y priorizar ámbitos que generen
mayor reserva de dotaciones y de vivienda protegida.</p>

<p>Los terrenos delimitados constituirán un sector de carácter homogéneo, con
capacidad de desarrollar una ordenación detallada coherente e integrada en la
estructura general, deberán ser colindantes al suelo urbano existente y quedar
integrados en la malla urbana tras su transformación. La atribución de densidad e
intensidad para cada sector se adoptará por el Plan Parcial siguiendo los criterios de
&laquo;densidad e intensidad contextualizada&raquo; y &laquo;densidad eficiente&raquo;.</p>

<p>Las bases generales para la ordenación detallada de estas actuaciones incluyen:
movilidad sostenible y red de calles articulada con las áreas adyacentes, priorizando
la accesibilidad universal, el recorrido peatonal continuo, los carriles bici y el
principio de la supermanzana; diseño del espacio público y verde urbano, con un
sistema de espacios libres que reconozca los elementos naturales del sector,
parques de contacto en las transiciones y especies de arbolado de sombra y
diversidad mediterránea; diversidad funcional, con mezcla equilibrada de usos
residenciales, laborales y de equipamiento, recomendándose que el comercio y
servicios de proximidad ocupen al menos el 41% de las plantas bajas en sectores con
densidades superiores a 30 viviendas/hectárea; dotación de equipamientos de
proximidad, distribuidos equilibradamente según su función (referenciales en
posiciones centrales, de gran consumo de suelo en la periferia, y de vecindad
próximos a las unidades residenciales); integración paisajística y natural, asegurando
el sostenimiento del arbolado autóctono existente y un diagnóstico del paisaje
conforme al artículo 37.4 de la LISTA; puesta en valor del patrimonio histórico,
priorizando usos compatibles con su régimen de protección; aprovechamiento de
recursos renovables y reducción de emisiones, mediante orientación adecuada de la
trama urbana, generación de energías renovables, arbolado suficiente conforme al
artículo 82.6.c) del RGLISTA, y sistemas urbanos de drenaje sostenible; e integración
de la perspectiva de género y colectivos desfavorecidos, exigiendo una evaluación de
impacto de género en la memoria de ordenación de cada Plan Parcial, espacios libres
seguros e inclusivos, equipamientos multifuncionales de barrio y diversidad de
tamaños y tipologías de vivienda.</p>

<p>En materia de vivienda protegida en actuaciones de nueva urbanización, se
reservará como mínimo el 30% de la edificabilidad residencial, porcentaje que el
documento completo del PGOM podrá elevar según un estudio actualizado de
necesidades. Se podrá eximir total o parcialmente de esta obligación a actuaciones
con densidad inferior a 15 viviendas por hectárea cuya tipología no se considere apta
para este tipo de vivienda, siempre que se garantice la reserva en el ámbito de
ordenación correspondiente.</p>

<p><strong>10.3. Estrategias para el mantenimiento, la mejora, rehabilitación,
regeneración y renovación de la ciudad existente.</strong></p>

<p>La ordenación del suelo urbano en ${nombre} se concibe como un proceso flexible y
adaptado a las distintas realidades del tejido consolidado y en transformación,
pudiendo desarrollarse mediante un único Plan de Ordenación Urbana o mediante
planes específicos por zonas, siempre bajo una visión coherente con el modelo
territorial. Los futuros planes deberán partir de la situación urbanística existente,
optando por su conservación o su corrección, con objetivos como la mejora de las
condiciones de habitabilidad del parque residencial, el impulso de nuevas tipologías
de vivienda adaptadas a la diversidad social, la incorporación de servicios comunes
en edificios residenciales y la renovación de infraestructuras básicas.</p>

<p>La ordenación del suelo urbano incorporará además la noción de zonas o ámbitos
funcionales, entendidos como unidades estratégicas para fomentar la diversidad
social y funcional, asegurar dotaciones y servicios de proximidad, favorecer la mezcla
de usos y preservar la identidad de cada parte de la ciudad. Su delimitación deberá
incluir terrenos que constituyan una unidad geográfica y urbanística homogénea,
considerar el planeamiento vigente y los sistemas generales existentes, y respetar la
identidad propia de cada área urbana.</p>

<p>El PGOM de ${nombre} establecerá un marco de referencia para la delimitación de
nuevas actuaciones urbanísticas y de transformación en suelo urbano, partiendo
siempre de la identificación del problema o déficit urbano a resolver (habitabilidad,
accesibilidad, eficiencia funcional o calidad del espacio público) y valorando la
estructura de la propiedad, la complejidad de gestión y los costes de intervención.
Se da prioridad a las actuaciones en la ciudad existente, con objetivos como la
sustitución de tipologías edificatorias inadecuadas, la reestructuración de áreas de
baja densidad con buena accesibilidad y dotaciones, y la renovación de tejidos
urbanos obsoletos mediante actualización de tipologías constructivas, eliminación de
usos incompatibles y provisión de nuevas dotaciones y espacios libres.</p>

<p>Las actuaciones deberán abordar prioritariamente las infraestructuras de
urbanización deficientes —movilidad rodada, ciclista y peatonal, accesibilidad— y
dar preferencia a ámbitos con servicios e infraestructuras obsoletas, orientando la
intervención a la modernización de abastecimiento, saneamiento, energía o
telecomunicaciones. Los vacíos urbanos carentes de ordenación detallada deberán
someterse a Actuaciones de Transformación Urbanística de Reforma Interior que
contemplen unitariamente la totalidad de los terrenos, incluidos los colindantes en
igual situación, sin admitir delimitaciones fragmentadas.</p>

<p>Para la ordenación detallada de estas actuaciones, el espacio público se sitúa
como eje central de la planificación: no se admitirán propuestas que releguen los
espacios libres, zonas verdes o equipamientos comunitarios a un papel residual, y el
diseño urbano deberá priorizar la movilidad sostenible y los desplazamientos
peatonales, garantizando confort ambiental, seguridad y atractivo paisajístico. Toda
actuación deberá justificar su interconexión con los sistemas generales y locales de
espacios libres y equipamientos, incorporar arbolado suficiente para el confort
climático y la mitigación del cambio climático, e incentivar pavimentos que reduzcan
el efecto isla de calor. La accesibilidad universal deberá estar garantizada en todos
los espacios públicos.</p>

<p>En las actuaciones de transformación urbanística en vacíos integrados en la malla
urbana se aplicarán los mismos criterios que para las actuaciones de nueva
urbanización en suelo rústico, salvo en la determinación de vivienda protegida, que
podrá modularse en función de la demanda real y del Plan Municipal de Vivienda y
Suelo, si existiera. La ordenación detallada de nuevas actuaciones se concibe así no
solo como un proceso de ocupación del suelo, sino como una oportunidad para
reforzar la calidad del espacio público, consolidar la movilidad sostenible, garantizar
la equidad en el acceso a dotaciones y contribuir a la adaptación al cambio climático.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>
`.trim();
}
