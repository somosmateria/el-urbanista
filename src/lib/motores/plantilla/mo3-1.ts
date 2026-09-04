import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.1 · El suelo rústico. Categorías y zonas (marco legal del art. 14
 * LISTA) — la entidad que faltaba antes de 3.1.1-3.1.4, así que la lista de
 * subepígrafes saltaba directamente a "3.1.1" sin pasar por "3.1".
 *
 * 100% plantilla: confirmado palabra por palabra idéntico entre Osuna y Lora
 * del Río (test-data/), salvo el nombre del municipio en la frase de cierre
 * ("La formulación del presente Avance del PGOM de..."). El desarrollo de
 * cada categoría con los datos concretos del municipio va en 3.1.1-3.1.4.
 */
export function generarMO3_1(municipio: MunicipioRow): string {
  return `
<div class="doc-eyebrow">3.1 · EL SUELO RÚSTICO. CATEGORÍAS Y ZONAS</div>
<div class="doc-text">
<p>El artículo 14 de la LISTA establece las siguientes categorías del suelo rústico:</p>

<ul>
<li><strong>a) Suelo rústico especialmente protegido por legislación sectorial.</strong> Este
suelo incluye los terrenos que tengan establecido en la legislación reguladora de los
dominios públicos, de protección del medio ambiente, de la naturaleza o del patrimonio
histórico, u otras análogas, y previa aprobación de los actos o disposiciones necesarios
para su delimitación o identificación cuando así se contemple en dicha legislación, un
régimen jurídico sobre los usos del suelo que demande para su integridad y efectividad
su clasificación como suelo rústico.</li>
<li><strong>b) Suelo rústico preservado por la existencia acreditada de procesos naturales o
actividades antrópicas susceptibles de generar riesgos</strong>, lo que hace incompatible su
transformación mediante la urbanización mientras subsistan dichos procesos o
actividades.</li>
<li><strong>c) Suelo rústico preservado por la ordenación territorial o urbanística</strong>, que
incluye "los terrenos cuya transformación mediante la urbanización se considere, por los
instrumentos de ordenación territorial o urbanística, incompatible con la consecución de
los fines y objetivos establecidos en dichos instrumentos", por diversos motivos: por
razones de "sostenibilidad"; por razones "de protección de los recursos culturales"; por
razones "de racionalidad y viabilidad"; por "los valores en ellos concurrentes"
(ecológicos, agrícolas, ganaderos, forestales, paisajísticos); y aquellos que deban ser
reservados para usos de interés general, atendiendo a las características y condiciones
del municipio.</li>
</ul>

<p>En definitiva, en el suelo rústico preservado por la ordenación territorial o urbanística
de la LISTA se integran no sólo los terrenos de suelo no urbanizable de especial
protección por planificación territorial o urbanística de la LOUA, sino también los
terrenos de la categoría de carácter natural o rural (es decir, los inadecuados para su
transformación por razones de sostenibilidad).</p>

<p>Por tanto, no sólo se trata de preservar los terrenos con valores vinculados al medio
natural (como los ecológicos), vinculados a los agropecuarios propios del medio rural
(agrícolas, ganaderos o forestales) o con valores culturales o paisajísticos, sino que
también se han de preservar los terrenos que —aún no teniendo estos valores
específicos— no deban ser transformados por razones de "sostenibilidad" (es decir,
desde una ponderación general de la oferta de suelo susceptible de ser urbanizado,
teniendo presente el mandato del artículo 20.1 TRLSRU de que sólo puede ser
transformado "el suelo preciso para satisfacer las necesidades que lo justifiquen"), por
razones "de racionalidad" (es decir, desde su contraste de adecuación al modelo
territorial adoptado, debiendo ser considerados terrenos inidóneos para su
transformación aquellos que se presentan en posición alejada de la malla urbana,
teniendo presente el mandato del artículo 6 de la LISTA de promover una ciudad
compacta), por razones de "viabilidad" (porque por las condiciones físicas y de
preexistencias de los terrenos o por la dificultad de acceso a las redes generales la
transformación de los mismos se considera inviable económica o técnicamente) y, por
último, igualmente deben ser adscritos a la categoría de rústico preservado aquellos que
deben quedar reservados "para usos de interés general" (cuando no puedan quedar
vinculados a actuaciones de transformación urbanísticas).</p>

<p><strong>d) Suelo rústico común</strong>, que incluye el resto del suelo rústico del término
municipal. Es decir, es suelo rústico común el que no debe ser protegido ni preservado y,
por tanto, es susceptible de ser transformado conforme a las estrategias y directrices que
establezca el PGOM y conforme a su evaluación ambiental estratégica.</p>

<p>Por tanto, en la sistemática que incorpora la LISTA, el suelo rústico común es la
categoría propia en la que se pueden desarrollar las actuaciones de nueva urbanización.
Por ello, establece el artículo 19 en su apartado 2 que el contenido de la propiedad del
suelo rústico "también comprende el derecho a participar en las actuaciones de
transformación urbanísticas", que también son deberes en suelo rústico común los
inherentes a las actuaciones de transformación urbanística. Y en el apartado 4.e) del
artículo 19, establece que cuando el suelo rústico común se incluya en una actuación de
transformación urbanística, "el propietario deberá asumir, como carga real, la
participación en los deberes legales de la promoción de la actuación en un régimen de
equitativa distribución de beneficios y cargas, así como permitir ocupar los bienes
necesarios para la realización de las obras, en su caso, al responsable de ejecutar la
actuación, en los términos establecidos en esta Ley y en los instrumentos de ordenación
territorial y urbanística".</p>

<p>Además, existe otra situación o categoría (así también la denomina el apartado 3 de
este artículo 14): en concreto, el Hábitat Rural Diseminado existente. El apartado 2 del
artículo 14 establece que "se identificarán como hábitat rural diseminado existente los
terrenos que constituyen el ámbito territorial sobre el que se ubica un conjunto de
edificaciones sin estructura urbana y ligadas en su origen a la actividad agropecuaria y
del medio rural, que poseen características propias que deben preservarse y que
pueden demandar algunas infraestructuras, dotaciones o servicios comunes para cuya
ejecución no se precise una actuación urbanizadora".</p>

<p>La formulación del presente Avance del PGOM de ${municipio.nombre} se hace teniendo
en cuenta la sostenibilidad y la valoración del medio natural.</p>

<p>Así, este Avance tiene presente el estudio del medio físico, referido al suelo rústico,
contenido en la Memoria de Información y en el Documento Inicial Estratégico y, en
atención a la regulación establecida en el artículo 14 de la LISTA, se formula la siguiente
propuesta de categorías de suelo rústico y adscripción de terrenos a cada una.</p>
</div>
<div class="src-note">PLANTILLA — marco legal común (art. 14 LISTA), confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio. Los apartados 3.1.1 a 3.1.4 desarrollan cada categoría con los datos concretos del municipio.</div>
`.trim();
}
