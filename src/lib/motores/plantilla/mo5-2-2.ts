import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.5.2.2 · La red básica para la implementación de modos de transporte
 * no motorizados de carácter territorial.
 *
 * 100% plantilla: confirmado idéntico entre Osuna y Lora del Río
 * (test-data/) salvo el nombre del municipio.
 */
export function generarMO5_2_2(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">5.2.2 · LA RED BÁSICA PARA LA IMPLEMENTACIÓN DE MODOS DE TRANSPORTE NO MOTORIZADOS DE CARÁCTER TERRITORIAL</div>
<div class="doc-text">
<p>Se incorporan al Avance del Plan, dentro de los componentes del modelo de infraestructura
de comunicaciones, la red de caminos rurales públicos principales existentes, por constituir en
el término municipal de ${nombre} un elemento estructural de comunicación, esencial para el
desarrollo actual y futuro del medio rural, así como por lo que puede suponer como base de
apoyo al sector turístico, a la vez que habilita un mejor contacto de los ciudadanos con la
naturaleza.</p>

<p>En efecto, el notable esfuerzo de modernización que está experimentando la actividad
agraria en sus fases de producción, transformación y comercialización necesita de una red viaria
de comunicaciones adecuada al tránsito de personas y mercancías que el ritmo del proceso va
introduciendo. Del mismo modo, es imprescindible disponer de una estructura viaria
especialmente diseñada para el desarrollo de las nuevas actividades económicas que comienzan
a surgir en el medio rural en torno y como complemento de las actividades convencionales de la
agricultura y ganadería, entre las que cabe destacar el prometedor desenvolvimiento del turismo
rural y de las pequeñas empresas de valorización de productos endógenos de calidad.</p>

<p>Los objetivos que se propone el Avance del PGOM respecto a la red de caminos rurales
públicos son:</p>
<ul>
<li>La adecuación de su régimen a las necesidades actuales del transporte, mejorando la
seguridad y comodidad de sus usuarios.</li>
<li>La defensa del patrimonio público y sus elementos funcionales como patrimonio al servicio
de la comunidad.</li>
<li>La adecuación de las mejoras y los usos de la red de caminos al entorno medioambiental del
medio rural en el que están insertos.</li>
</ul>

<p>Por otra parte, esta red de itinerarios rurales, principales y secundarios está llamada a
garantizar el fomento de otros medios de transporte alternativos a los modos motorizados, y
permite articular una red de paseos de ocio-naturaleza estableciendo una relación de continuidad
Ciudad-Naturaleza, que podría ampliarse también a otros municipios colindantes, desde el
reconocimiento de la concepción del territorio supramunicipal como una entidad funcional real.</p>
</div>
<div class="src-note">PLANTILLA — confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.</div>
`.trim();
}
