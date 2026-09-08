import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.6.2 · Propuesta para la protección medioambiental, de los recursos
 * naturales y del paisaje (condiciones de protección ambiental, recursos
 * hidrológicos, vegetación/fauna/suelo, paisaje, bienes demaniales).
 *
 * Era el hueco más grande detectado en la comparativa contra un Avance
 * real (informe de Lora del Río, sept. 2026): el capítulo entero de MO.6
 * caía a ~35% de cobertura sobre todo por la ausencia total de este
 * bloque, pese a estar dado de alta como "plantilla" en mapeo_capitulos
 * desde el principio — nunca llegó a implementarse.
 *
 * 100% plantilla: confirmado idéntico entre Osuna y Lora del Río
 * (test-data/) — párrafo de apertura de 6.2, de 6.2.3, de 6.2.4 y de 6.2.5
 * verificados palabra por palabra en ambos documentos (6.2.5 solo difiere
 * en "el Plan General" vs "el Plan General de Ordenación Municipal", una
 * variante trivial). Marco legal y normativo puro, sin ningún dato
 * concreto de municipio en todo el bloque.
 */
export function generarMO6_2(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">6.2 · PROPUESTA PARA LA PROTECCIÓN MEDIAMBIENTAL, DE LOS RECURSOS NATURALES Y DEL PAISAJE</div>
<div class="doc-text">
<p>Los condicionantes ambientales en la actividad urbanística se configuran como un marco
esencial que guiará el desarrollo de las actuaciones de transformación del territorio en el
municipio, asegurando que los procesos de crecimiento, renovación o rehabilitación de la ciudad
se produzcan en coherencia con la preservación del medio natural, la sostenibilidad y la calidad
de vida de la población. Toda intervención urbanística deberá reconocer que el suelo, el agua,
el aire, la biodiversidad y el paisaje son recursos limitados, y que su protección constituye un
objetivo de interés general que condicionará la ordenación y ejecución de cualquier actuación.</p>

<p>En este sentido, el planeamiento y los instrumentos de ordenación detallada deberán
integrar criterios que permitan la protección de los recursos naturales, garantizando el respeto
a suelos agrícolas y forestales de alto valor, a hábitats y ecosistemas de interés, y a los recursos
hídricos tanto superficiales como subterráneos, evitando su contaminación, sobreexplotación
o degradación. Del mismo modo, los criterios de calidad ambiental se incorporarán como
condicionantes directos a la ordenación urbana, lo que implica la reducción de emisiones a la
atmósfera, la prevención del ruido y las vibraciones, el control de la contaminación lumínica
y el diseño de infraestructuras que garanticen la recogida, tratamiento y gestión adecuada de
residuos sólidos, líquidos y peligrosos.</p>

<p>El diseño urbanístico y arquitectónico habrá de responder también a la integración
paisajística y patrimonial, de forma que los nuevos desarrollos se inserten de manera armónica
en el entorno natural y urbano, respetando la topografía, los elementos culturales y las vistas
significativas. Estos principios se acompañarán de la obligación de implantar medidas frente al
cambio climático, adoptando soluciones que contribuyan tanto a la mitigación de sus efectos
(reducción de emisiones de CO₂, eficiencia energética, energías renovables) como a la adaptación
del territorio a los riesgos derivados (olas de calor, inundaciones, incendios forestales o sequías).
La incorporación de arbolado, zonas verdes, corredores ecológicos y soluciones basadas en la
naturaleza se establece como estrategia prioritaria para mejorar el confort ambiental, reducir el
efecto isla de calor y aumentar la resiliencia del municipio.</p>

<p>Los condicionantes ambientales incidirán, igualmente, en la protección de la salud y el
bienestar de la población, orientando la actividad urbanística hacia la creación de entornos
seguros, accesibles e inclusivos. La calidad del aire, la reducción de la exposición al ruido, el
acceso equitativo a espacios públicos de calidad y zonas verdes, y la prevención de riesgos
naturales o tecnológicos deberán ser objetivos presentes en cada propuesta de planeamiento y
en cada proyecto de ejecución.</p>

<p>Finalmente, estos condicionantes se apoyan en un marco normativo y procedimental
que hace obligatoria la incorporación de la legislación ambiental sectorial, el sometimiento de
los planes y proyectos a evaluación ambiental estratégica o de impacto, y la aplicación de las
medidas correctoras y compensatorias que se deriven de tales procesos. Con ello se asegura
que el planeamiento urbano no se limite a ordenar el espacio desde una perspectiva funcional
o económica, sino que actúe como un instrumento de sostenibilidad territorial y de protección
ambiental activa, alineado con los compromisos europeos, estatales y autonómicos en materia
de lucha contra el cambio climático y desarrollo sostenible.</p>

<p><strong>6.2.1. Condiciones de protección ambiental.</strong></p>

<p>El Plan configurará un marco normativo que integrará las exigencias de protección
ambiental en la ordenación urbanística, vinculando cada desarrollo a una estrategia de
sostenibilidad basada en la eficiencia en el uso de recursos, la prevención de la contaminación,
la reducción de emisiones y la mejora de la calidad de vida de la ciudadanía.</p>

<p>Evidentemente este régimen de protección ambiental tendrá como fundamento la
legislación sectorial sobre medio ambiente, recursos naturales y bienes demaniales, incorporando
además normativa propia dirigida a salvaguardar y mejorar los valores ambientales y paisajísticos
del municipio. Este régimen se aplicará a todas las clases de suelo, aunque algunas de las medidas
previstas se ajustarán de manera específica a la naturaleza de cada categoría. Las medidas
correctoras y compensatorias previstas en el Estudio Ambiental Estratégico y en la Declaración
Ambiental Estratégica serán de obligado cumplimiento, y se desarrollarán con mayor grado de
detalle en los instrumentos de ordenación y ejecución que se aprueben.</p>

<p>En el desarrollo de los planes parciales y de los proyectos de urbanización se incorporarán
medidas orientadas a garantizar la correcta gestión ambiental. Entre ellas se incluirá la conexión
obligatoria a las redes municipales de saneamiento, abastecimiento y recogida de residuos,
asegurando que estén ejecutadas y operativas antes de la ocupación de los ámbitos. Se justificará
la disponibilidad de recursos hídricos en función de los consumos previstos y se fomentará el
empleo de redes diferenciadas de agua no potable para riego, limpieza y prevención de incendios.
Los proyectos promoverán superficies permeables y sistemas de drenaje sostenible, así como la
captación y aprovechamiento de aguas pluviales, favoreciendo un uso eficiente de los recursos.</p>

<p>La gestión de residuos se regulará de manera estricta, prohibiéndose los vertidos
incontrolados en suelos, cauces y alcantarillado. Los proyectos deberán prever la recogida
selectiva, la utilización de vertederos autorizados para materiales sobrantes de obra y, en suelos
productivos, la implantación de puntos limpios con capacidad suficiente para la gestión de
residuos peligrosos. Del mismo modo, se reforzará el control de vertidos líquidos, prohibiendo el
uso de fosas sépticas en suelos urbanos y exigiendo depuración previa en origen en actividades
industriales, de acuerdo con los parámetros fijados por la normativa ambiental. Respecto a las
emisiones a la atmósfera, no se permitirán instalaciones que superen los límites establecidos en
la legislación vigente en materia de calidad del aire.</p>

<p>El Plan incorporará directrices para prevenir la contaminación acústica y lumínica. En
materia de ruido, se exigirá que las nuevas actuaciones respeten los objetivos de calidad acústica,
fijando distancias y separaciones adecuadas entre usos productivos y residenciales, así como la
obligación de estudios acústicos previos en ámbitos expuestos a tráfico rodado de carreteras
principales. El Ayuntamiento aprobará el Mapa de Ruidos y la Zonificación Acústica del municipio
en el plazo máximo de tres años desde la entrada en vigor del Plan. En cuanto a la iluminación,
todas las instalaciones deberán ajustarse a la normativa sobre protección del cielo nocturno y
eficiencia energética, debiendo clasificarse las áreas lumínicas en función de los usos del suelo y
previendo luminarias que garanticen uniformidad, seguridad y ahorro energético.</p>

<p>Asimismo, el Plan establecerá condiciones de prevención de incendios, que se concretarán
en la obligatoriedad de planes de autoprotección en ámbitos próximos a montes públicos o
suelos forestales, la implantación de redes contra incendios y la garantía de accesibilidad para los
equipos de emergencias. En estas áreas limítrofes con el suelo rústico forestal, se priorizarán los
usos públicos sin edificación con el fin de reducir el riesgo de propagación del fuego.</p>

<p>El régimen de protección ambiental también abarcará criterios sobre materiales y diseño
constructivo. Se prohibirá el uso de productos nocivos o peligrosos para la salud y el medio
ambiente, potenciando en su lugar el empleo de materiales locales, naturales y renovables que
reduzcan la huella de carbono. Las edificaciones deberán proyectarse y ejecutarse siguiendo
principios de sostenibilidad: uso eficiente de recursos, reciclaje, energías alternativas,
aprovechamiento de la iluminación natural, ventilación adecuada, ahorro energético e hídrico, y
accesibilidad universal. Se fomentará el diseño adaptado a las condiciones bioclimáticas locales
y la incorporación de vegetación y masas de agua como elementos reguladores del microclima
urbano, contribuyendo a mitigar el efecto isla de calor y a mejorar la calidad ambiental de los
entornos.</p>

<p>Finalmente, el Plan impondrá la obligación de restitución medioambiental en los supuestos
de daños al medio, de forma que las personas responsables deberán ejecutar a su cargo las
medidas de recuperación necesarias, incluidas las relativas a explotaciones extractivas en activo
o abandonadas. Asimismo, en el plazo máximo de un año desde la entrada en vigor del Plan, el
Ayuntamiento aprobará o adaptará ordenanzas específicas para garantizar una gestión eficiente
del agua, orientadas a reducir y estabilizar el consumo de agua potable, asegurar el suministro
sostenible a largo plazo y fomentar la concienciación ciudadana en el uso racional de este recurso
básico.</p>

<p><strong>6.2.2. La protección de recursos hidrológicos.</strong></p>

<p>El PGOM debe convertir la protección de los recursos hidrológicos en un condicionante
esencial de la actividad urbanística, de forma que cauces, riberas, márgenes, acuíferos y zonas
inundables dejen de ser espacios residuales para pasar a concebirse como infraestructuras
ambientales críticas. Su preservación y adecuada integración en la ordenación del territorio
permitirá reforzar la sostenibilidad del municipio y aumentar su resiliencia frente a riesgos
naturales.</p>

<p>Se establecerá un régimen específico de protección de los recursos hidrológicos, con el
fin de garantizar la integridad de los cauces, riberas, márgenes, acuíferos y zonas inundables, en
coherencia con la legislación vigente en materia de aguas y con los objetivos de sostenibilidad
ambiental. Esta estrategia se fundamentará en el reconocimiento del agua como recurso
esencial y limitado, cuya adecuada gestión resultará determinante para el equilibrio ecológico,
la seguridad de la población y el desarrollo urbanístico y económico del municipio.</p>

<p>En relación con los cauces y riberas, el Plan prohibirá la ocupación del Dominio Público
Hidráulico, salvo para usos comunes especiales previstos en la normativa. Toda actuación
en el DPH, su zona de servidumbre o de policía requerirá autorización administrativa y
deberá garantizar la continuidad ecológica de los ecosistemas fluviales, evitando procesos de
degradación o interferencias en el curso natural de las aguas. Los instrumentos de ordenación
detallada integrarán la preservación de las franjas de servidumbre y policía, destinándolas
preferentemente a espacios libres, drenaje y medidas de protección frente a avenidas, de modo
que se minimicen los riesgos para la población y los aprovechamientos aguas abajo.</p>

<p>El Plan también dispondrá que los proyectos de regeneración de riberas se ajusten a los
criterios de la Administración Hidráulica, priorizando la conservación de la vegetación autóctona,
la estabilización de márgenes y la reforestación en tramos erosionados. En cuanto a las
infraestructuras, se exigirá que las obras de paso garanticen la continuidad hidráulica y ecológica,
dimensionándose para avenidas de hasta 500 años de retorno y evitando entubamientos o
encauzamientos, salvo en casos excepcionales justificados por la defensa de núcleos urbanos
consolidados frente a inundaciones.</p>

<p>Respecto a los acuíferos y captaciones para abastecimiento humano, el PGOM
establecerá la prohibición de cualquier actuación que afecte a la calidad o cantidad de las
aguas subterráneas. No se permitirán vertidos, infiltraciones contaminantes ni captaciones
sin autorización del organismo competente. Las fosas sépticas en suelo rústico únicamente
se autorizarán con garantías técnicas suficientes de no afección a las aguas, y en todo caso se
establecerán perímetros de protección en torno a lagunas y puntos de captación. Asimismo,
toda actividad industrial, extractiva o de servicios deberá justificar la disponibilidad de recursos
hídricos y la ausencia de impacto negativo sobre ellos para poder obtener licencia urbanística o
de apertura.</p>

<p>En cuanto a las zonas inundables, el Plan determinará que solo podrán destinarse a
usos agrícolas, forestales o ambientales compatibles con la evacuación de caudales. Quedará
prohibida la construcción de edificaciones, depósitos o rellenos que puedan modificar el
relieve o incrementar el riesgo de inundación. En el suelo urbano, estas áreas se reservarán
preferentemente como espacios libres de carácter público —parques, jardines o áreas
recreativas— siempre al aire libre y sin cerramientos, integrándose en la trama urbana mediante
vegetación autóctona y actuaciones de restauración fluvial. Toda intervención en estos espacios
requerirá informe favorable de la Administración Hidráulica, y las infraestructuras que se
proyecten deberán garantizar la evacuación de caudales de avenidas de hasta 500 años de
retorno sin ocasionar daños a terceros.</p>

<p><strong>6.2.3. Medidas para la protección de la vegetación, de la fauna y del suelo.</strong></p>

<p>La protección de la vegetación, la fauna y el suelo se configurará como un eje transversal
de la actividad urbanística del municipio. El PGOM incorporará estas exigencias no solo como
condicionantes ambientales, sino como oportunidades para integrar la naturaleza en la ciudad,
mejorar la resiliencia frente al cambio climático y reforzar la identidad paisajística y ecológica del
territorio. Para ello se establecerá un marco de protección integral de la vegetación, la fauna y el
suelo, reconociéndolos como recursos esenciales para la sostenibilidad ambiental y la calidad de
vida de la población. En este sentido, la ordenación urbanística futura se apoyará en criterios de
conservación, integración y mejora del patrimonio natural, de manera que el desarrollo urbano
no suponga pérdida irreversible de biodiversidad ni degradación de los ecosistemas locales.</p>

<p>En materia de vegetación, los nuevos desarrollos urbanísticos deberán conservar e integrar
el mayor número posible de ejemplares autóctonos dentro de los espacios libres, asegurando
su adecuada protección durante la ejecución de las obras y su consolidación al finalizar los
proyectos. El diseño de zonas verdes y áreas ajardinadas se orientará al uso preferente de
especies autóctonas adaptadas a las condiciones climáticas y de bajo consumo hídrico, en línea
con los principios de xerojardinería y eficiencia en el uso del agua. El Ayuntamiento supervisará
el mantenimiento de los espacios verdes y organizará campañas periódicas de reforestación,
especialmente en áreas degradadas, como estrategia de mitigación frente al cambio climático y
de fortalecimiento de la infraestructura verde urbana.</p>

<p>La tala y poda de arbolado quedará sujeta a autorización municipal, garantizando que las
intervenciones respeten los ciclos biológicos de la fauna silvestre y evitando actuaciones durante
el periodo de nidificación. Además, las masas arboladas se preservarán en al menos un 70% de su
cobertura y cualquier eliminación se compensará con la reposición de ejemplares, reforzando el
carácter estructurante del arbolado en la configuración de los espacios urbanos. Para las nuevas
edificaciones en suelo urbano se exigirá la presencia de arbolado suficiente como condición para
considerar las parcelas como solares, introduciendo así un criterio de calidad ambiental en la
consolidación de la ciudad.</p>

<p>De manera complementaria, el municipio se dotará de un Plan Director de Arbolado
Urbano, concebido como instrumento estratégico para planificar la protección, conservación
y gestión sostenible del patrimonio arbóreo. Dicho Plan establecerá un inventario exhaustivo,
criterios de selección de especies, mecanismos de participación ciudadana y un sistema de
seguimiento y evaluación periódica, garantizando así una gestión coherente y sostenible del
arbolado.</p>

<p>En relación con la fauna y la avifauna, el Plan exigirá que todas las actuaciones urbanísticas
consideren la presencia de especies silvestres y, en su caso, adapten sus diseños para preservar
hábitats, corredores ecológicos y áreas críticas de reproducción. Las infraestructuras eléctricas
aéreas deberán incorporar medidas de antielectrocución y anticolisión, y en parcelas edificables
donde se detecte fauna protegida se realizarán estudios específicos de impacto, estableciéndose
medidas correctoras como la instalación de nidales artificiales o la delimitación de zonas de
exclusión temporal durante la cría.</p>

<p>Finalmente, en relación con el suelo y las actividades extractivas, el PGOM dispondrá que
toda explotación se ajuste a la normativa minera y ambiental vigente, incorporando planes de
clausura y restauración para garantizar la recuperación de las áreas degradadas. En terrenos con
pendientes pronunciadas, los proyectos deberán incluir estudios que aseguren la estabilidad y
eviten procesos erosivos, pudiendo exigirse garantías adicionales para la ejecución de medidas
correctoras. Asimismo, la gestión de escombros y residuos quedará vinculada al cumplimiento
estricto de la normativa autonómica de residuos y a la adopción de soluciones que prioricen la
restauración ambiental.</p>

<p><strong>6.2.4. La protección del paisaje urbano y natural un principio transversal.</strong></p>

<p>Para la propuesta de ordenación de este PGOM la protección del paisaje urbano y natural
es un principio transversal, integrando la imagen de la ciudad, su patrimonio edificado y su
entorno natural en un modelo armónico, coherente y sostenible.</p>

<p>El Plan establecerá un marco de protección y gestión del paisaje, reconociendo el derecho
de la ciudadanía a disfrutar de unos niveles adecuados de calidad paisajística, tanto en el medio
urbano como en el natural. En coherencia con ello, se asumirá que todas las personas tendrán el
deber de contribuir a mantener y mejorar la imagen y calidad de los espacios públicos y privados,
mientras que el Ayuntamiento se constituirá como garante último de este derecho colectivo,
ejerciendo funciones de información, fomento, asesoramiento, regulación, vigilancia y, en su
caso, sanción de aquellas actuaciones que generen mayor incidencia paisajística.</p>

<p>La protección de la imagen urbana se abordará mediante la adaptación de las nuevas
construcciones y de las intervenciones en el patrimonio edificado a su entorno inmediato,
evitando impactos visuales negativos y asegurando la integración paisajística en áreas de especial
sensibilidad, como paisajes abiertos, entornos históricos o vías pintorescas. El Ayuntamiento
podrá requerir estudios de impacto visual y abrir procesos de participación en intervenciones de
especial relevancia, y regulará elementos de fachadas, cubiertas, materiales, colores o vegetación
con el fin de preservar la coherencia formal de la ciudad. Las instalaciones de servicios públicos
deberán soterrarse en todo el suelo urbano, y las actividades con alto impacto, como canteras o
desmontes, estarán obligadas a justificar sus efectos y prever planes de restauración.</p>

<p>Las nuevas edificaciones se diseñarán respetando la topografía, la vegetación, la
orientación, los hitos visuales y la tipología del área, con materiales acordes y de carácter
armónico. Los instrumentos de planeamiento detallado deberán justificar su coherencia formal
mediante criterios de disposición y orientación de edificios, relación con espacios abiertos,
selección de materiales y tratamiento cromático, generando una estructura espacial ordenada
y legible.</p>

<p>La integración paisajística se extenderá también a las fachadas y a los cerramientos de
parcelas y solares, que deberán mantener armonía con el entorno edificado. En caso de edificios
colindantes a inmuebles catalogados, las nuevas fachadas se adaptarán en proporciones, aleros,
huecos y acabados, garantizando continuidad visual. El Ayuntamiento podrá exigir proyectos
unitarios de fachada en casos de cerramientos heterogéneos o anárquicos, y el diseño de
cerramientos incluirá soluciones acordes con el entorno urbano o natural, prohibiéndose
apantallamientos no vegetales en vallados transparentes o semiopacos.</p>

<p>En relación con los inmuebles catalogados y su entorno, toda actuación requerirá
autorización previa de la Consejería competente en patrimonio, incluyendo obras, instalaciones,
modificaciones o rotulación. Se prohibirá la contaminación visual que degrade la percepción
de bienes patrimoniales y se obligará a retirar los elementos discordantes en un plazo máximo.
Además, se exigirá que las instalaciones técnicas se ubiquen en lugares discretos y no alteren
el carácter del inmueble; se eliminarán equipos visibles en fachada, se restringirá la colocación
de cableado o antenas y se integrarán los elementos de seguridad o identificación sin alterar la
composición arquitectónica.</p>

<p>La colocación de publicidad, rótulos comerciales y toldos se regulará con criterios estrictos.
La publicidad exterior quedará prohibida en bienes catalogados, permitiéndose únicamente
identificaciones discretas de las actividades y, de forma excepcional, lonas temporales asociadas
a obras de conservación. Los rótulos deberán integrarse en los huecos de planta baja y respetar
la composición arquitectónica, mientras que las actividades en plantas piso se identificarán
únicamente mediante placas o directorios acordes al edificio. Los toldos, cuando se autoricen,
deberán cumplir condiciones de retranqueo, altura y respeto al arbolado.</p>

<p>El mobiliario urbano se someterá a criterios de diseño homogéneo, contemporáneo y
funcional, evitando folclorismos o distorsiones visuales. No se permitirá la incorporación de
publicidad que supere un 10% de cada elemento, y se buscará la coherencia de diseño en cada
unidad espacial. La instalación de cartelería o señalización en espacio público se condicionará
a la no interferencia con la contemplación del patrimonio histórico, debiendo ser reversible y
sobria.</p>

<p>En relación con la recogida de residuos sólidos urbanos, se prohibirá situar contenedores
frente a inmuebles catalogados y, en entornos de bienes patrimoniales, solo se permitirá su
colocación si no existe alternativa eficiente, empleando en tal caso diseños que reduzcan su
impacto visual.</p>

<p><strong>6.2.5. La defensa de los bienes demaniales.</strong></p>

<p>Es necesario que el Plan General de Ordenación Municipal establezca un marco de
protección específico para los bienes de dominio público y sus áreas colindantes, garantizando
que toda actuación se ajuste a las limitaciones de uso fijadas por las legislaciones sectoriales y a
las determinaciones propias del Plan. En este sentido, las servidumbres de protección asociadas
a bienes demaniales y a los servicios públicos prevalecerán siempre sobre la normativa de zona,
asegurando que los intereses generales se sitúen por encima de los usos particulares.</p>

<p>En materia de vías de comunicación, se aplicarán las servidumbres y limitaciones
establecidas por la normativa estatal y autonómica de carreteras. De esta forma, quedará
prohibida cualquier edificación que invada o afecte a carreteras existentes o previstas, así como a
sus franjas de dominio público, servidumbre y afección. Toda intervención en estas zonas deberá
contar con la autorización previa del titular de la vía, que podrá imponer condiciones específicas.
Asimismo, las conexiones de nuevos desarrollos con carreteras autonómicas o provinciales se
realizarán a cargo de la propia promoción, y en los suelos colindantes se exigirán estudios de
impacto acústico que se incorporarán a los proyectos posteriores de urbanización y edificación.</p>

<p>En relación con la red de energía eléctrica, se establecerán zonas de reserva mínimas en
torno a las líneas de alta tensión, cuyos anchos oscilarán entre quince y treinta metros en función
de la potencia. Aunque la servidumbre de paso no impedirá completamente el aprovechamiento
de los terrenos, se deberá respetar siempre la seguridad de las instalaciones y las distancias
fijadas por la normativa sectorial, quedando condicionada cualquier construcción o uso del
suelo a estos límites.</p>

<p>La protección de cauces públicos se regulará por lo establecido en la normativa de
aguas y en el propio Plan, garantizando la conservación del Dominio Público Hidráulico y de sus
márgenes, y evitando la ocupación o alteración indebida de sus zonas de servidumbre y policía.</p>

<p>Por su parte, las redes de abastecimiento y saneamiento en suelo rústico contarán con
una franja de no edificación de cuatro metros, medida simétricamente a cada lado del eje de
la tubería. En esta franja quedarán prohibidas tanto las edificaciones como los movimientos de
tierras o las labores agrícolas, asegurando así la protección de estas infraestructuras básicas.</p>

<p>En lo referente a las vías pecuarias, reconocidas como bienes de dominio público
destinados prioritariamente al tránsito ganadero y a las comunicaciones agrarias, se ratificará su
permanencia como suelos rústicos de especial protección. Cualquier infraestructura que deba
atravesarlas estará sujeta a la autorización de la Consejería competente y no podrá interrumpir
ni el tránsito ganadero ni los usos complementarios. Además, se evaluará en cada caso la
afección a la vegetación, imponiéndose, en su caso, medidas de trasplante y revegetación para
compensar los impactos. Las ocupaciones longitudinales se admitirán únicamente cuando no
exista alternativa viable, manteniéndose siempre la integridad funcional de estas vías históricas.</p>

<p>Finalmente, la red de caminos rurales de uso público municipal se mantendrá bajo criterios
de conservación y acondicionamiento, sin permitir alteraciones sustanciales de su trazado o
anchura salvo en los casos en que se justifique por la actividad agraria. Su finalidad seguirá
siendo la de permitir un tránsito libre, seguro y general para personas, animales y vehículos,
quedando prohibido su cierre, roturación o la realización de vertidos. Los caminos privados,
cuando existan, no podrán superar una anchura máxima de cinco metros y deberán mantener
firmes preferentemente de zahorra. Para los nuevos caminos que resulten necesarios, se exigirá
su adaptación a la topografía, la incorporación de sistemas de drenaje adecuados y la aplicación
de medidas que reduzcan el impacto ambiental y protejan los cauces naturales.</p>

<p>En conjunto, este régimen garantizará la preservación y el adecuado funcionamiento de
los bienes de dominio público en el municipio, asegurando su compatibilidad con el desarrollo
urbano y rural y reforzando su papel como elementos esenciales de la ordenación territorial y
ambiental.</p>
</div>
<div class="src-note">PLANTILLA — marco legal y normativo común, confirmado idéntico entre Osuna y Lora del Río. Sin datos concretos de municipio en todo el bloque.</div>
`.trim();
}
