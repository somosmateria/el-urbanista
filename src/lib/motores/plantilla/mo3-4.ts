import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.4 · El contenido urbanístico. Derechos y deberes de la propiedad del
 * suelo rústico.
 *
 * 100% plantilla: confirmado palabra por palabra idéntico entre Osuna y Lora
 * del Río (test-data/), salvo el nombre del municipio en tres puntos (la
 * frase inicial y dos menciones a "el documento completo del PGOM de...").
 * Puro desarrollo del régimen de derechos/deberes del art. 13-14 LISTA y del
 * régimen de parcelaciones — sin ningún dato concreto de este municipio.
 */
export function generarMO3_4(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">3.4 · EL CONTENIDO URBANÍSTICO. DERECHOS Y DEBERES DE LA PROPIEDAD DEL SUELO RÚSTICO</div>
<div class="doc-text">
<p>El contenido urbanístico de la propiedad en suelo rústico de ${nombre} comprende los
derechos de disposición, uso, disfrute y explotación de los terrenos, lo que incluye los
actos precisos para el desarrollo:</p>

<ul>
<li>De los usos ordinarios que, de conformidad con lo dispuesto en la Ley 7/2021, de 1 de
diciembre, de impulso para la sostenibilidad del territorio de Andalucía, no se encuentren
prohibidos por la ordenación territorial y urbanística, quedando sujetos a las limitaciones
y requisitos impuestos por la legislación y planificación aplicables por razón de la
materia.</li>
<li>De los usos extraordinarios que, de conformidad con lo dispuesto en la citada Ley
7/2021, pudieran autorizarse en esta clase de suelo.</li>
</ul>

<p>En los suelos rústicos especialmente protegidos y en los suelos rústicos preservados,
los derechos reconocidos en el apartado anterior quedan sometidos a la defensa y
mantenimiento de los valores, fines y objetivos que motiven su protección o preservación
conforme al régimen que se establezca en la legislación y ordenación sectorial, territorial
y urbanística correspondiente. Las determinaciones de los Planes de Ordenación de
Recursos Naturales prevalecerán sobre el resto de los instrumentos de ordenación
conforme a la legislación básica estatal.</p>

<p>El contenido urbanístico de la propiedad en suelo rústico comprende los siguientes
deberes:</p>

<ul>
<li>Conservar el suelo, en los términos legalmente establecidos, debiendo dedicarlo a los
usos ordinarios de esta clase de suelo o, en su caso, a los usos extraordinarios que
pudieran autorizarse, contribuyendo al mantenimiento de las condiciones ambientales y
paisajísticas del territorio y a la conservación de las edificaciones existentes conforme a
su régimen jurídico, para evitar riesgos y daños o perjuicios a terceras personas o al
interés general.</li>
<li>Solicitar las licencias, presentar las declaraciones responsables o comunicaciones
previas y, en su caso, las autorizaciones previas, tanto para los usos ordinarios como
para los usos extraordinarios, así como para todo acto de segregación o división, de
conformidad con lo establecido en la Ley 7/2021 y su Reglamento General y en la
correspondiente legislación sectorial, y cumplir con el régimen correspondiente a dichas
autorizaciones.</li>
<li>Satisfacer las prestaciones patrimoniales establecidas en la Ley 7/2021 y su
Reglamento General, o en la disposición sectorial correspondiente, para legitimar los
usos privados extraordinarios, así como el de costear y, en su caso, ejecutar las
infraestructuras de conexión de las instalaciones y construcciones autorizables con las
redes generales de servicios y entregarlas a la Administración competente para su
incorporación al dominio público, cuando deban formar parte del mismo.</li>
</ul>

<p>En suelo rústico quedan prohibidas las parcelaciones urbanísticas, consideradas como
tal la división simultánea o sucesiva de terrenos, fincas o parcelas en dos o más lotes
que, con independencia de lo establecido en la Ley 7/2021 y en la legislación agraria,
forestal o similar, pueda inducir a la formación de nuevos asentamientos. A estos
efectos, no constituyen parcelación urbanística en suelo rústico los lotes que sean
adquiridos de forma simultánea por los propietarios de terrenos colindantes a fin de
agruparlos con sus fincas para constituir una nueva, siempre que las fincas que resulten
reúnan los requisitos establecidos como mínimos en el Reglamento General de la Ley
7/2021, y si son más exigentes, en los instrumentos de ordenación territorial y en el
documento completo del PGOM de ${nombre}.</p>

<p>Son indivisibles las fincas o parcelas rústicas siguientes:</p>
<ul>
<li>Los que tengan unas dimensiones inferiores o iguales a las determinadas como
mínimas en el Reglamento General de la Ley 7/2021, o en el documento completo del
PGOM de ${nombre} si resultaran más exigentes, salvo que los lotes resultantes se
adquieran simultáneamente por los propietarios de fincas, unidades aptas para la
edificación, o parcelas colindantes, con la finalidad de agruparlos y formar uno nuevo
con las dimensiones mínimas exigibles.</li>
<li>Los de dimensiones inferiores al doble de las requeridas como mínimas en el
documento completo del PGOM, salvo que el exceso de éstas se agrupe en el mismo
acto a terrenos colindantes para formar otra finca, unidades aptas para la edificación o
parcela y solar que tenga las condiciones mínimas exigibles.</li>
<li>Las vinculadas o afectadas legalmente a las construcciones o edificaciones e
instalaciones autorizadas sobre ellos.</li>
</ul>

<p>Se presumirá que una parcelación es urbanística cuando en terrenos que tengan el
régimen del suelo rústico, se proceda a la división simultánea o sucesiva de terrenos,
fincas o parcelas en dos o más lotes que, con independencia de lo establecido en la Ley
7/2021 y en la legislación agraria, forestal o similar, pueda inducir a la formación de
nuevos asentamientos conforme a lo establecido en el Capítulo III del Título I del
Reglamento General de la Ley 7/2021 y en los instrumentos de ordenación territorial, y en
el documento completo del PGOM.</p>
</div>
<div class="src-note">PLANTILLA — régimen legal de derechos/deberes y parcelaciones (LISTA), confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.</div>
`.trim();
}
