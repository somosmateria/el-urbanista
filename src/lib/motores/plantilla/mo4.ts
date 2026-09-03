import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.4 · Regulación de los usos.
 *
 * docs/01-analisis-diagnostico-a-ordenacion.md estima esta plantilla como
 * "~85% A, 15% B" (con una posible inserción de usos actuales detectados,
 * fuente MI.1.9). En la práctica, comparando el texto real completo de
 * Osuna y Lora del Río (test-data/) epígrafe a epígrafe — usos y
 * actuaciones ordinarias/extraordinarias en suelo rústico, usos globales de
 * suelo urbano, actividades incompatibles — el contenido es 100% idéntico
 * palabra por palabra en ambos Avances; no hay ningún dato específico de
 * municipio insertado en ninguno de los dos. Se implementa tal cual la
 * evidencia real, sin fabricar una inserción de datos que no se observa en
 * ninguno de los dos documentos de referencia.
 */
export function generarMO4(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">MO.4 · REGULACIÓN DE LOS USOS</div>
<div class="doc-text">
<p><strong>4.1. Usos y actividades en suelo rústico.</strong></p>

<p><em>4.1.1. Usos ordinarios en suelo rústico.</em></p>

<p>Conforme a lo establecido en el artículo 21.1 de la Ley 7/2021, de 1 de diciembre, de
impulso para la sostenibilidad del territorio de Andalucía, son usos ordinarios del
suelo rústico los usos agrícolas, ganaderos, forestales, cinegéticos, mineros y cualquier
otro vinculado a la utilización racional de los recursos naturales que no supongan la
transformación de su naturaleza rústica.</p>

<p>También son usos ordinarios del suelo rústico los vinculados al aprovechamiento
hidráulico, a las energías renovables, los destinados al fomento de proyectos de
compensación y de autocompensación de emisiones, actividades mineras, a las
telecomunicaciones y, en general, a la ejecución de infraestructuras, instalaciones y
servicios técnicos que necesariamente deban discurrir o localizarse en esta clase de
suelo.</p>

<p>Se debe entender que un uso está vinculado a la utilización racional de los recursos
naturales cuando necesariamente requiera de su implantación en suelo rústico para
un aprovechamiento normal de los recursos disponibles en la explotación. Y de la
misma forma, se debe entender que un uso produce la transformación de la
naturaleza rústica del suelo cuando, como consecuencia de su implantación, provoca
la pérdida irreversible de su capacidad vegetativa, de manera que ésta no puede
restaurarse al finalizar la actividad que se desarrolla. Aunque podrá considerarse
como cumplida esta condición cuando, conforme a lo previsto en la legislación
reguladora de la concreta actividad, se ejecuten planes de restauración de los
terrenos que permiten recuperar parcialmente el estado natural de los terrenos.</p>

<p><em>4.1.2. Actuaciones ordinarias en suelo rústico.</em></p>

<p>Son actuaciones ordinarias las obras, construcciones, edificaciones, viarios,
infraestructuras, instalaciones y servicios técnicos que sean necesarios para el
normal funcionamiento y desarrollo de los usos ordinarios del suelo rústico,
incluyendo aquellas que demanden las actividades complementarias de primera
transformación y comercialización de las materias primas generadas en la misma
explotación que contribuyan al sostenimiento de la actividad principal, siempre que
se acredite la unidad de esta. De acuerdo con lo estipulado en el 28.4 del Reglamento
General de la Ley 7/2021, solo podrá considerarse como actuación ordinaria cuando la
superficie de las edificaciones no supere el dos por ciento (2%) de la superficie de la
parcela donde se desarrolla la explotación.</p>

<p>Hay que considerar como edificaciones necesarias para el normal funcionamiento de
las actividades agrícolas y de las explotaciones forestales: las casetas de aperos de
labranza, las naves destinadas al almacenamiento de productos fitosanitarios y de
maquinaria, así como las destinadas a las instalaciones que necesite la explotación,
las infraestructuras de riego y otras de naturaleza similar. Se consideran
edificaciones necesarias para el normal funcionamiento de las actividades
ganaderas: las cuadras, establos, vaquerías, porquerizas, corrales, colmenas,
tentaderos y otras de naturaleza similar.</p>

<p>Se consideran edificaciones destinadas a actividades complementarias de primera
transformación y comercialización aquellas que coadyuvan al sostenimiento de la
actividad principal que se desarrolla en la explotación, tales como: las de
almacenamiento, manipulación y envasado de productos del sector primario y las
actividades industriales y artesanales que generan valor a partir de las materias
primas obtenidas. Estas actividades solo podrán considerarse como actuación
ordinaria cuando sirvan exclusivamente a la explotación que justifica su
implantación y, además, la superficie de la edificación vinculada no supere los 2.500
metros cuadrados.</p>

<p>Tendrán la consideración de necesarias para el desarrollo de los usos ordinarios del
suelo rústico aquellas edificaciones destinadas a uso residencial, incluidos los
alojamientos para personas que desarrollen trabajos por temporada, que cumplan
con los requisitos establecidos en el artículo 29 del Reglamento general de la Ley
7/2021, de 1 de diciembre. Tendrán también la consideración de actuaciones
ordinarias la ejecución de aquellas infraestructuras, instalaciones y servicios técnicos
de carácter permanente que, no estando previstas en los instrumentos de
planeamiento, necesariamente deban discurrir o localizarse en suelo rústico, para lo
que se deberán valorar las alternativas para su localización sobre el rústico
atendiendo a los criterios de: menor impacto sobre el medio ambiente, el paisaje y el
patrimonio histórico; funcionalidad y eficiencia; menor coste de ejecución y
mantenimiento.</p>

<p><em>4.1.3. Actuaciones extraordinarias en suelo rústico.</em></p>

<p>De acuerdo a lo estipulado en el artículo 21.1 de la Ley 7/2021, de 1 de diciembre, de
impulso para la sostenibilidad del territorio de Andalucía, en suelo rústico podrán
implantarse con carácter extraordinario, y siempre que no estén expresamente
prohibidas por la legislación o por la ordenación territorial y/o urbanística, y respeten
el régimen de protección que, en su caso, les sea de aplicación, usos y actuaciones de
interés público o social que contribuyan a la ordenación y el desarrollo del medio
rural, o que hayan de emplazarse en esta clase de suelo por resultar incompatible su
localización en suelo urbano.</p>

<p>Conforme a lo establecido por el artículo 30.2 del Reglamento General de la Ley
7/2021, son usos y actuaciones de interés público o social que contribuyen a la
ordenación y el desarrollo del medio rural las siguientes: las promovidas por las
Administraciones Públicas en ejercicio de sus competencias, las establecidas en los
instrumentos de ordenación territorial y las declaradas de Interés Autonómico; y las
declaradas de interés público o social mediante acuerdo municipal que fundamente
alguna de las siguientes circunstancias: que se trate de dotaciones no previstas en los
instrumentos de ordenación territorial o urbanística y que sea necesaria o
conveniente su localización en suelo rústico; que se considere de carácter estratégico
para el desarrollo económico y social del municipio o que genere efectos positivos y
duraderos sobre la economía y empleo local; que contribuya a la conservación y
puesta en valor del patrimonio histórico mediante la implantación de usos que
permitan su mantenimiento, conservación y rehabilitación; que contribuya a
conservar y proteger los espacios naturales, a su disfrute por la población o a su
conocimiento y difusión; o que contribuya a diversificar la economía local de una
forma sostenible basada en la economía verde y circular o a evitar el despoblamiento
de las zonas rurales.</p>

<p>Conjuntamente a las actuaciones extraordinarias anteriores podrán autorizarse
edificaciones destinadas a uso residencial, debiendo garantizarse la
proporcionalidad y vinculación entre estas y las actuaciones extraordinarias, y
cumplir con las condiciones de implantación establecida en el artículo 30.4 del
Reglamento General de la Ley 7/2021.</p>

<p>De acuerdo con lo previsto en el artículo 22.2 de la Ley 7/2021, de 1 de diciembre,
también se consideran actuaciones extraordinarias la ejecución de viviendas
unifamiliares no vinculadas a actuaciones ordinarias ni a otras actuaciones
extraordinarias, y siempre que no induzcan la formación de nuevos asentamientos ni
al normal desarrollo de los usos ordinarios del suelo rústico. Se requerirá de
autorización previa a la licencia, y deberán cumplir además con los parámetros y
condiciones establecidas en el artículo 31 del Reglamento General de la Ley 7/2021, de
1 de diciembre, de impulso para la sostenibilidad del territorio de Andalucía.</p>

<p>Todas las actuaciones extraordinarias en suelo rústico no promovidas por las
Administraciones Públicas en el ejercicio de sus competencias, o que estén
establecidas en los instrumentos de ordenación territorial, sean declaradas de
Interés Autonómico, o aquellas para las que la legislación sectorial establezca un
procedimiento especial de armonización con la ordenación urbanística, requieren,
para ser legitimadas, de una autorización previa a la licencia municipal que cualifique
los terrenos donde pretendan implantarse, y que alternativamente: declare la
actuación de interés público o social; reconozca su incompatibilidad con el medio
urbano de acuerdo con los supuestos establecidos en el artículo 30.3 del Reglamento
General de la Ley 7/2021, de 1 de diciembre; o autorice la implantación de una
vivienda no vinculada.</p>

<p>Con la finalidad de que se produzca la necesaria compensación por el uso y
aprovechamiento de carácter extraordinario del suelo, se establece una prestación
compensatoria que gestionará el municipio y que se destinará al Patrimonio
Municipal de Suelo con una cuantía del 10% del presupuesto de ejecución material de
las obras que hayan de realizarse, excluido el coste correspondiente a maquinaria y
equipos. Esta cuantía podrá ser minorada mediante ordenanza municipal que valore
los criterios que se establecen en el artículo 35.3 del Reglamento General de la Ley
7/2021. Para las viviendas unifamiliares aisladas será, en todo caso, del 15%.</p>

<p><strong>4.2. Usos globales propuestos para el suelo urbano y actuaciones de
transformación urbanística de nueva urbanización.</strong></p>

<p>La regulación y determinación de los usos/actividades en el Plan General se
propone establecer a partir de las siguientes definiciones.</p>

<p>Para la calificación urbanística: uso/s global/es es aquel destino urbanístico de una
zona de suelo urbano o de un ámbito de actuación de transformación urbanística que
la caracteriza por ser mayoritario en términos de edificabilidad, pudiendo asignarse a
una zona dos o más usos globales; uso/s pormenorizado/s es aquél que el
instrumento que establezca la ordenación urbanística detallada atribuye a cada
parcela, manzana o terrenos concretos.</p>

<p>Para la asignación de usos: uso/s característico/s o principal/es es el asignado como
predominante o mayoritario en los ámbitos de ordenación, con mayor superficie
edificable computada en metros cuadrados de techo; uso/s alternativo/s son aquellos
cuyas condiciones de implantación y efectos se consideran semejantes al del uso
característico, por lo que pueden implantarse sin restricciones; uso/s compatible/s es
aquel que el instrumento de ordenación urbanística considere que puede coexistir
con el uso del ámbito, debiendo garantizarse el destino de más del 50% de la
edificabilidad a los usos globales en zonas de suelo urbano y áreas de transformación,
y de más del 50% al uso pormenorizado en las parcelas; uso/s preexistente/s son
usos ya materializados en una zona de ordenación o en una parcela concreta; uso/s
autorizable/s son aquellos cuya implantación está condicionada a la previa
autorización de la administración competente, cuya denegación deberá ser siempre
motivada; uso/s prohibido/s son aquellos cuya implantación está excluida por el Plan
General por imposibilitar la consecución de los objetivos de la ordenación; y uso/s
provisional/es son usos que pueden ubicarse en áreas, sectores o unidades de
ejecución en los que aún no se ha aprobado la ordenación pormenorizada, autorizables
excepcionalmente cuando no se hallen expresamente prohibidos ni dificulten la
ejecución del planeamiento.</p>

<p>Para el establecimiento de la equidistribución urbanística: uso/s lucrativo/s son los
que se ejercen con fines lucrativos cualquiera que sea su naturaleza; uso/s no
lucrativo/s corresponde con aquellos al servicio de la población de acuerdo a los
estándares legalmente establecidos.</p>

<p>Para señalar la titularidad de los usos y su régimen público o privado: usos públicos
corresponde con aquellos que, siendo de titularidad pública, se encuentran afectados
al uso general o al servicio público, así como aquellos a los que una ley les otorgue
expresamente el carácter de demaniales; usos privados corresponde con aquellos de
titularidad particular, sea ejercida de forma individual o colectiva — dada su
naturaleza jurídica, los bienes patrimoniales de la administración pública son
considerados en el Plan General como bienes de propiedad privada, incluso aquellos
afectos a actividades de servicio público.</p>

<p>A los efectos de asignación de usos en suelo urbano y en las áreas de transformación
urbanística de nueva urbanización se definen las siguientes clases de usos globales,
ajustados a la propuesta que se incorpora en el Anexo del Reglamento General de la
LISTA: <strong>Residencial (RES)</strong>, destinado a proporcionar alojamiento permanente,
diferenciando vivienda unifamiliar y plurifamiliar, libre y sometida a algún régimen de
protección pública; <strong>Turístico (TUR)</strong>, atribuido de manera mayoritaria a una zona
por incorporar más del 50% de la edificabilidad total a alojamientos turísticos o
actividades deportivas con incidencia turística, con usos pormenorizados de
establecimientos de alojamiento turístico y actividades con incidencia en el ámbito
turístico; <strong>Servicios (SER)</strong>, que engloba la prestación de servicios personales,
profesionales, administrativos, técnicos, monetarios y comerciales no clasificados
como industriales, con usos pormenorizados comercial, oficinas, restauración y
recreativo; <strong>Productivo (PRO)</strong>, que comprende las actividades de obtención,
elaboración, transformación y reparación de productos y las de depósito, guarda y
distribución de bienes, con usos pormenorizados artesanal, industrial,
almacenamiento y logístico, servicios avanzados, y estaciones de suministro de
carburantes y recarga eléctrica; y <strong>Dotacional (DOT)</strong>, tanto público como privado,
que sirve para proveer prestaciones sociales, servicios propios de la vida urbana y
recreo y esparcimiento mediante espacios deportivos y zonas verdes, con usos
pormenorizados de equipamientos comunitarios, espacios libres y zonas verdes,
movilidad, e infraestructuras y servicios técnicos.</p>

<p><strong>4.3. Actividades incompatibles con el modelo territorial y el medio
urbano.</strong></p>

<p>Se propone que se declaren incompatibles con el modelo territorial del municipio y,
por tanto, queden prohibidas en cualquier clase de suelo: las centrales y otros
reactores nucleares, con exclusión de las instalaciones de investigación para la
producción y transformación de materias fisionables y fértiles en las que la potencia
máxima no pase de un (1) KW de duración permanente térmica; y las instalaciones
destinadas exclusivamente al almacenamiento permanente o a la eliminación
definitiva de residuos radiactivos.</p>

<p>Y se propone que sean incompatibles con el medio urbano del municipio y, por
tanto, queden prohibidas en suelo urbano y en las áreas de transformación de nueva
urbanización: las instalaciones para el aprovechamiento de la energía eólica cuya
potencia nominal total sea igual o superior a un (1) MW; las instalaciones para la
extracción, tratamiento y transformación del amianto y de los productos que lo
contienen, según los umbrales de producción anual establecidos por tipo de
producto; las instalaciones industriales de almacenamiento al por mayor de
productos químicos incluidos en el Reglamento de almacenamiento de productos
químicos y sus Instrucciones Técnicas complementarias; las industrias de fabricación
de pasta de celulosa, coquerías, fabricación y formulación de pesticidas e
instalaciones de fabricación de explosivos; las refinerías de petróleo bruto, así como
las instalaciones de gasificación y licuefacción inferiores a quinientas (500) toneladas
de carbón de esquistos y bituminosos al día; las plantas de generación eléctrica de
cualquier tipo, salvo la implantación de placas fotovoltaicas sobre edificaciones e
instalaciones admitidas en suelo urbano o urbanizable; las instalaciones químicas
integradas y plantas siderúrgicas integrales; y las granjas de animales.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>
`.trim();
}
