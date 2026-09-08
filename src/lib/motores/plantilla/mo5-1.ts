import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.5.1 · La infraestructura verde urbana. El sistema de espacios libres
 * (marco conceptual) — incluye también la intro general de MO.5 completo
 * ("En una primera aproximación a cualquier hecho urbano…"), que en el
 * documento real precede a 5.1 sin tener su propio epígrafe.
 *
 * El informe comparativo (Avance real de Lora del Río, sept. 2026) marcó
 * MO.5 entero a 0%: era motor "tabla" desde el principio, sin ningún
 * generador — la app nunca redactaba nada aquí, solo dejaba la tabla en
 * blanco para el técnico.
 *
 * Verificado contra Osuna y Lora del Río (test-data/): idéntico salvo el
 * nombre del municipio (interpolado) y un dato — el punto "1º Solvencia
 * cuantitativa" citaba en AMBOS documentos, palabra por palabra, un
 * estándar de "9,18 m2/habitante calculado para 256.800 habitantes": una
 * cifra que no corresponde a la población de ninguno de los dos
 * municipios, claramente un arrastre de una plantilla o documento previo
 * no corregido. Se ha quitado esa cifra concreta (no se replica un error
 * conocido) dejando el principio general; el resto —incluida la
 * recomendación real de la OMS de 10 m2/habitante— sí está confirmado.
 */
export function generarMO5_1(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">5 · ESQUEMA DE LOS ELEMENTOS ESTRUCTURANTES Y DEL FUTURO DESARROLLO URBANO. LOS SISTEMAS GENERALES</div>
<div class="doc-text">
<p>En una primera aproximación a cualquier hecho urbano se puede identificar la existencia
de una serie de elementos soporte que configuran la forma general de la ciudad. Estos elementos
estructuran la caracterización del sistema de espacios públicos de la misma y constituyen las
piezas esenciales de su sistema dotacional, asumiendo, al tiempo, una funcionalidad básica
como "ligantes urbanos" de las diferentes áreas urbano-territoriales que conforman el modelo
propuesto.</p>

<p>Estos elementos configuradores de la forma general de la ciudad son los que se
corresponden con aquellos que estructuran el hecho urbano, los que conforman las claves de la
ordenación urbana, los que, en definitiva, construyen el espacio público y colectivo de la ciudad.
Se identifican tres categorías principales en estos materiales de construcción urbana y
territorial, y que se desarrollan a continuación.</p>
</div>

<div class="doc-eyebrow">5.1 · LA INFRAESTRUCTURA VERDE URBANA. EL SISTEMA DE ESPACIOS LIBRES</div>
<div class="doc-text">
<p>En la categoría de sistemas generales de espacios libres y zonas verdes se incluyen aquellos
espacios libres que, bien por su escala y significación en la trama urbana, bien por la integración
de valores naturales a preservar, bien por su capacidad de conferir articulación y continuidad
al sistema de espacios libres, conforman un conjunto de piezas de notable incidencia en la
definición morfológica y estructural del hecho urbano.</p>

<p>En el Avance de este PGOM la aproximación a la ordenación del sistema general de
espacios libres y zonas verdes se sustenta en tres principios básicos:</p>

<ul>
<li><strong>Solvencia cuantitativa.</strong> Los espacios libres y zonas verdes deben responder a
necesidades funcionales cuantificables, dando estricto cumplimiento a los estándares mínimos
que establezca la legislación urbanística vigente.</li>
<li><strong>Singularidad posicional.</strong> El sistema general de espacios libres y zonas verdes está
constituido por piezas singulares del sistema urbano-territorial a los que el Avance del Plan
les confía un importante papel en la ordenación estructural del modelo de ciudad. Por tanto,
las pautas de ordenación para situar estas piezas deben ir más allá de un elemental criterio
de oportunidad —haciéndolas coincidir con terrenos vacantes— al actuar como referentes
estructural-paisajísticos del modelo urbano-territorial propuesto. Por ello, tiene una importancia
trascendental que la estrategia de localización de los elementos determinantes del verde urbano
promueva el reconocimiento de los invariantes geográficos y naturales que, en definitiva,
conforman la raíz etimológica del soporte territorial en el que se asienta la ciudad (topografías
relevantes, cursos de agua, zonas forestadas, etc.).</li>
<li><strong>Conectividad ecológica.</strong> El sistema se concibe como una red ecológica destinada a
vertebrar la ciudad y su territorio, generando lazos de continuidad entre lo urbano y lo rural. En
conclusión, se trata de apostar por una nueva condición urbana naturalizada, más verde, más
ecológica y conectiva, en cuyo proyecto tendrán un rol protagonista las estructuras lineales, para
aportar continuidad a los sistemas de la matriz ecológica territorial, en conexión con el medio
urbano.</li>
</ul>

<p>Esta red ecológica, además, juega un papel clave para el bienestar humano que va más
allá de los beneficios tradicionalmente ligados a las zonas verdes entendidas como equipamientos
complementarios a la vivienda (recreación, ocio): mejoran la calidad del aire y del agua,
contribuyen a la salud tanto física como mental de los habitantes, reducen emisiones de CO₂
y pueden actuar como pantallas acústicas, contribuyen a regular el microclima urbano, reducen
el peligro de inundaciones y las necesidades energéticas, ayudando a la adaptación al cambio
climático.</p>

<p>En conclusión, el diseño del sistema general de espacios libres y zonas verdes contemplado
en el Avance del PGOM de ${nombre} tiene como argumento central conseguir una red verde
continua, con la finalidad de vehicular las relaciones entre el medio urbano y el medio rural y, al
tiempo, coadyuvar a construir las conectividades ecológicas.</p>

<p>Los espacios libres deben cumplir la regla 3-30-300 relativa a cómo una ciudad verde ayuda
a vivir mejor: que cada persona pueda ver al menos 3 árboles desde su casa, tener un 30% de
cobertura vegetal en su barrio, y estar a 300 metros de un parque digno.</p>

<p>Para ello, se considera necesario renaturalizar ${nombre}, incorporando más naturaleza
dentro de la ciudad, para que ésta sea no sólo más sostenible, sino también más habitable, de tal
manera que se produzca una convivencia pacífica entre ciudad y naturaleza. Asimismo, ${nombre}
debe aspirar a contar con una ratio de metros cuadrados de sistemas generales de espacios libres
por habitante superior a 10 m²/habitante, estándar recomendado como mínimo por la
Organización Mundial de la Salud.</p>

<p>Esta apuesta por incrementar la cantidad y calidad de las zonas verdes conllevará
innumerables beneficios para el medio ambiente y, en consecuencia, para la salud de los
habitantes. En efecto, las zonas verdes: mejoran las condiciones microclimáticas, ya que
contribuyen a reducir la temperatura de sus alrededores, combatiendo las islas de calor;
contribuyen a mitigar las inundaciones, al incrementarse las superficies de zonas permeables y
la posibilidad de retenerlas; y mejoran la salud, no sólo mental sino cognitiva y física.</p>

<p>En base a estos criterios de ordenación, la propuesta del Avance del PGOM se estructura en
distintos niveles espaciales que desarrollan ciertas especificidades funcionales — desarrollados a
continuación en las áreas recreativas y los parques urbanos concretos de este municipio.</p>
</div>
<div class="src-note">PLANTILLA — marco conceptual común, confirmado idéntico entre Osuna y Lora del Río (salvo una cifra de estándar de superficie que aparecía en ambos documentos referida a una población que no corresponde a ninguno de los dos municipios — se ha quitado en vez de replicar un error conocido). Las áreas recreativas y los parques urbanos concretos van en los apartados siguientes, a rellenar por el técnico.</div>
`.trim();
}
