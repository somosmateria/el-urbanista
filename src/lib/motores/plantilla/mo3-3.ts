import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.3 · La infraestructura verde. Un condicionante superpuesto a la
 * ordenación (marco conceptual) — incluye también 3.3.2, que no tiene fila
 * propia en mapeo_capitulos.
 *
 * 100% plantilla: confirmado palabra por palabra idéntico entre Osuna y
 * Lora del Río (test-data/), sin una sola mención al nombre del municipio
 * en todo el pasaje. El contenido municipio-específico (áreas núcleo,
 * corredores ecológicos con nombre propio) vive en 3.3.1, que es motor
 * "tabla" y no se genera aquí.
 */
export function generarMO3_3(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">3.3 · LA INFRAESTRUCTURA VERDE. UN CONDICIONANTE SUPERPUESTO A LA ORDENACIÓN</div>
<div class="doc-text">
<p>La Infraestructura Verde forma parte fundamental del modelo territorial propuesto
por este Avance.</p>

<p>La Infraestructura Verde se define como una red ecológicamente coherente y
estratégicamente planificada de zonas naturales y seminaturales y de otros elementos
ambientales, diseñada y gestionada para la conservación de los ecosistemas y el
mantenimiento de los servicios que nos proveen. Incluye espacios y otros elementos
físicos "verdes" en áreas terrestres (naturales, rurales y urbanas) y marinas.</p>

<p>La Infraestructura Verde se concibe, por tanto, como una red ecológicamente
coherente y estratégicamente planificada compuesta por un conjunto de áreas
naturales y semi-naturales, elementos y espacios verdes rurales y urbanos, que en
conjunto mejoran el estado de conservación de los ecosistemas y su resiliencia,
contribuyen a la conservación de la biodiversidad y benefician a las poblaciones
humanas mediante el mantenimiento y mejora de las funciones que generan los
servicios de los ecosistemas. Para poder cumplir con sus funciones debe ser dinámica
y adaptativa. Tiene, por tanto, un carácter multiescalar, multisectorial y
multifuncional:</p>

<ul>
<li>Europea, de integración territorial con las iniciativas de infraestructura verde a
escala continental.</li>
<li>Peninsular e insular, de coordinación, cooperación e integración territorial de las
acciones emprendidas en materia de protección de la biodiversidad, servicios de los
ecosistemas, conectividad y restauración ecológicas por parte de la Administración
General del Estado y las comunidades autónomas.</li>
<li>Regional y comarcal, con la conformación de redes ecológicas funcionales
integradas por espacios protegidos, grandes reservorios de fauna y flora, ríos,
llanuras de inundación, litoral, etc. y actuaciones dirigidas a la protección de
hábitats, la restauración de espacios degradados y la restitución de la
conectividad ecológica.</li>
<li>Municipal y local, en la que cobran especial importancia elementos con alta
potencialidad ecológica como setos, muros de piedra, bosques de galería, árboles
aislados, determinados cultivos extensivos o pastizales, etc., que, junto a ríos y
pequeños arroyos, cualquier otro tipo de masa de agua y vías pecuarias,
constituyen corredores ecológicos por antonomasia y forman parte esencial de la
Infraestructura Verde.</li>
<li>Urbana y de barrio, en la que la infraestructura verde se apoya tanto en elementos
naturales como seminaturales y artificiales como parques y jardines, calles y
plazas arboladas, cementerios, tejados y fachadas verdes, estanques o áreas de
juego y, en general, cualquier superficie permeable o susceptible de aumentar su
permeabilidad y con potencialidad para mejorar la biocapacidad urbana.</li>
</ul>

<p>La inversión en una Infraestructura Verde tiene también una lógica económica:
optar por soluciones basadas en la naturaleza para, por ejemplo, mitigar los efectos
negativos del cambio climático, es más rentable que sustituir esos servicios perdidos
por soluciones tecnológicas.</p>

<p><strong>Antecedentes y marco legislativo.</strong> La Ley 42/2007 del Patrimonio Natural y la
Biodiversidad, en su modificación por la Ley 33/2015, recoge estas nuevas
orientaciones. Así, establece en su art. 15 "Del Marco estratégico de la Infraestructura
Verde y de la conectividad y restauración ecológicas" que, para garantizar la
conectividad ecológica y la restauración del territorio español, el Ministerio con
competencias en medio ambiente elaborará una Estrategia estatal de infraestructura
verde y de la conectividad y restauración ecológicas, con cartografía adecuada para
visualizarla. Dicha estrategia tendrá por objetivo marcar las directrices para la
identificación y conservación de los elementos del territorio que componen la
infraestructura verde, terrestre y marino, y para que la planificación territorial y
sectorial de las Administraciones públicas asegure la conectividad ecológica y la
funcionalidad de los ecosistemas, la mitigación y adaptación al cambio climático y la
restauración de ecosistemas degradados, con especial consideración a espacios
protegidos, hábitats y especies amenazadas, cursos fluviales, humedales, vías
pecuarias y demás sistemas de alto valor natural.</p>

<p>La Estrategia Nacional de Infraestructura Verde y de la Conectividad y Restauración
Ecológicas entró en vigor el 14 de julio de 2021 mediante la Orden PCM/735/2021, de 9
de julio, y es el documento de planificación estratégica que regula la implantación y el
desarrollo de la Infraestructura Verde en España, estableciendo un marco
administrativo y técnico armonizado para el conjunto del territorio español, incluyendo
las aguas marítimas bajo soberanía o jurisdicción nacional. Para su comprensión,
interpretación, desarrollo e implementación, el ministerio competente en materia
ambiental elabora las Bases científico-técnicas para la Estrategia estatal de
infraestructura verde y de la conectividad y restauración ecológicas, publicación que
también ha servido de referencia en la definición de este Avance.</p>

<p>La Agenda Urbana Española (Ministerio de Fomento, 2019) ya incluye, dentro del
objetivo específico de "ordenar el suelo de manera compatible con su entorno
territorial", una línea de actuación específica para mejorar las infraestructuras verdes
y azules y vincularlas con el contexto natural (línea de actuación 1.3). La Comunidad
Autónoma de Andalucía, por su parte, ha aprobado el Plan Director para la mejora de
la Conectividad Ecológica en Andalucía, que se aborda desde la perspectiva de una
estrategia de Infraestructura Verde y que establece como objetivo garantizar y
mejorar de forma integral la conectividad ecológica en Andalucía, priorizando el
diseño y desarrollo de soluciones basadas en la naturaleza. Asimismo, Andalucía está
incorporando todos los aspectos relativos a la conservación, mejora y refuerzo de la
Infraestructura Verde del territorio en la planificación de las áreas protegidas
andaluzas (PORN, PRUG y Planes de Gestión de la Red Natura 2000).</p>

<p><strong>La infraestructura verde en las relaciones campo-ciudad.</strong> La Infraestructura
Verde del municipio no estaría completa si no se incluyeran aquellos elementos que
garanticen su continuidad en el suelo rústico como un condicionante superpuesto
también en el suelo en situación básica de suelo urbanizado, ya que resulta
imprescindible para proporcionar una red de interconexión urbana con la naturaleza,
áreas seminaturales y espacios verdes, que brindan servicios ecosistémicos que
sustentan el bienestar humano y la calidad de vida. Y así, esta continuidad debe: conectar
el entorno periurbano y el urbano; crear una red continua que enlace los diferentes
corredores ambientales estructurantes, así como los espacios libres urbanos tanto
generales como locales; y servir de base a los equipamientos usados por los colectivos
más vulnerables, para que puedan ser más accesibles mediante recorridos peatonales
y de proximidad.</p>

<p>La Infraestructura Verde se entiende así como parte fundamental del acceso de la
población al medio rural y natural. Su vinculación con el medio urbano se basa en la
continuidad de los capilares procedentes del campo conectados con los viarios no
motorizados y los ámbitos de distensión social reflejados por los espacios libres
representativos y los equipamientos de ocio y cultura, entendidos estos últimos como
alveolos cívicos de lo urbano. A tal efecto, la Carta para la Planificación Ecosistémica
de Ciudades y Metrópolis, en su Principio 8 "Verde versus Asfalto", apremia a
proyectar en el medio urbano una red verde que se infiltre entre las diferentes matrices
de la ciudad con un entramado de itinerarios peatonales de enlace, reclamando
prestar especial atención a las zonas de interfase urbano-rural para evitar la
destrucción innecesaria de biodiversidad. Las ganancias que aportan las
Infraestructuras Verdes en el medio urbano resultan especialmente importantes por
su contribución a la salud y al bienestar de la ciudadanía.</p>

<p>La Infraestructura Verde Urbana estará constituida, fundamentalmente, por la red
de sistemas generales de espacios libres y por los conectores verdes asociados a usos
urbanos — entre otros, los espacios libres locales estructurantes (que cumplen
funciones de corredores ambientales en suelo urbano o urbanizable) y concretos
tramos de la red viaria que precisan ser objeto de re-naturalización para asegurar su
función conectora.</p>
</div>
<div class="src-note">PLANTILLA — marco conceptual común, sin datos del diagnóstico. Los componentes concretos de este municipio (áreas núcleo, corredores con nombre propio) van en 3.3.1.</div>
`.trim();
}
