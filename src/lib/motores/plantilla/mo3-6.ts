import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.6 · El suelo urbano.
 *
 * El marco legal (art. 13 LISTA, definición de malla urbana del art. 19
 * RGLISTA, aclaración sobre colindancia) es idéntico palabra por palabra
 * entre Osuna y Lora del Río (test-data/). La lista de cierre ("para el
 * presente Avance la delimitación del suelo urbano está constituida por…")
 * NO lo es: el punto 2 en Lora del Río cita expresamente "el planeamiento
 * general del 2005" y matiza sectores/sistemas generales recepcionados,
 * mientras que en Osuna es más genérico — es contenido real que depende del
 * planeamiento vigente de cada municipio, no una plantilla fija. Se deja el
 * texto de Osuna como punto de partida (el más generalizable de los dos) y
 * se marca explícitamente a revisar.
 */
export function generarMO3_6(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">3.6 · EL SUELO URBANO</div>
<div class="doc-text">
<p>El artículo 13 de la LISTA establece que conforman el suelo urbano los terrenos que,
estando integrados en la malla urbana constituida por una red de viales, dotaciones y
parcelas propias del núcleo o asentamiento de población del que forme parte, cumplan
alguna de las siguientes condiciones:</p>

<ul>
<li>Haber sido urbanizados en ejecución de los instrumentos de ordenación urbanística o
territorial y de conformidad con sus determinaciones, desde el momento en que se
produzca la recepción de las obras de urbanización conforme a esta ley y a sus normas de
desarrollo.</li>
<li>Estar transformados urbanísticamente por contar con acceso rodado por vía urbana y
conexión en red con los servicios básicos de abastecimiento de agua, saneamiento y
suministro de energía eléctrica.</li>
<li>Estar ocupados por la edificación, al menos, en las dos terceras partes del espacio
apto para ello, de acuerdo con el ámbito que el instrumento de ordenación urbanística
general establezca.</li>
</ul>

<p>El apartado 2 del artículo 19 del RGLISTA define el concepto de malla urbana. En
concreto, dispone que la malla urbana constituye un ámbito continuo, delimitado por
viales interconectados que forman parte de la red viaria del municipio, incluidas las
travesías y tramos urbanos de las carreteras, dotado de los servicios básicos conectados a
las redes públicas de infraestructuras y de las dotaciones propias del suelo urbano.</p>

<p>Además, se aclara que la simple colindancia de un suelo con las redes de
infraestructuras, viarios, carreteras de circunvalación o vías de comunicación
interurbanas no comportará, por sí misma, su consideración como suelo urbano.</p>

<p>Para el presente Avance del PGOM, la delimitación del suelo urbano está constituida
por:</p>
<ol>
<li>Suelo clasificado como urbano por el planeamiento general vigente, urbanizado en
los elementos básicos infraestructurales o/y localizado en áreas integradas en malla
urbana consolidadas por la edificación.</li>
<li>Ámbitos de suelo urbanizado por ejecución de la urbanización del suelo apto para
urbanizar en el planeamiento general vigente que han quedado integrados en la malla
urbana.</li>
<li>Ámbitos del suelo urbano por encontrarse en la malla urbana, contar con elementos
básicos de la urbanización y/o tener consolidación de la edificación autorizada y permitir
homogeneizar la delimitación de suelo urbano o enclaves.</li>
</ol>
<p><em>Pendiente de revisar por el técnico: estos tres criterios de delimitación son un punto
de partida — en el Avance real de Lora del Río, por ejemplo, el punto 2 cita expresamente
el planeamiento general vigente de ese municipio y matiza qué sectores y sistemas
generales quedan incluidos. Ajusta la redacción a la situación real del planeamiento
vigente de este municipio antes de cerrar el capítulo.</em></p>
</div>
<div class="src-note">PLANTILLA (marco legal común) + contenido a revisar — la lista de delimitación concreta del suelo urbano varía según el planeamiento vigente de cada municipio, confírmala contra el diagnóstico antes de cerrar el capítulo.</div>
`.trim();
}
