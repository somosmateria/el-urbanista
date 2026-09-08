import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.2 · Sistemas generales en suelo rústico (marco conceptual y legal).
 *
 * El informe comparativo contra un Avance real (Lora del Río, sept. 2026)
 * marcó este subepígrafe a 0%: estaba dado de alta como motor "tabla"
 * (100% manual) sin ningún generador, así que nunca se redactaba nada.
 * Mismo patrón que ya existe entre 3.3 (marco conceptual, plantilla) y
 * 3.3.1 (componentes concretos del municipio, tabla): aquí se separa el
 * marco legal de la lista real de sistemas generales del municipio, que
 * pasa a MO.3.2.1 (motor tabla — ver 0016_mo3_2_subepigrafe.sql).
 *
 * 100% plantilla: confirmado idéntico entre Osuna y Lora del Río
 * (test-data/) — el párrafo de definición (tipos lineal/no lineal) y el
 * de adscripción a la categoría de suelo rústico preservado (art. 14
 * LISTA) coinciden palabra por palabra. La lista de sistemas generales
 * concretos de cada municipio (EDAR, parques, equipamientos con nombre
 * propio…) es justo lo que difiere, y por eso no va aquí.
 */
export function generarMO3_2(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">3.2 · SISTEMAS GENERALES EN SUELO RÚSTICO</div>
<div class="doc-text">
<p>Se reconocen también en el Avance del PGOM un conjunto de sistemas generales en suelo
rústico, para los que los objetivos que se proponen son reservar y optimizar la función concreta
asignada a cada uno de ellos. Son, básicamente, de dos tipos:</p>

<ul>
<li>De carácter lineal, tales como viarios, ya sea para modos motorizados o no motorizados, y
las instalaciones complementarias asociadas a ambos. Así como: líneas de tendido aéreo
(redes de transporte o distribución de energía eléctrica y otras líneas de tendido aéreo
de distinta finalidad, junto a los soportes e instalaciones complementarias a la red); y
líneas subterráneas (redes de transporte o distribución de gas, petróleo y productos
derivados; agua, saneamiento, telecomunicaciones y otras redes infraestructurales
subterráneas, así como las instalaciones complementarias).</li>
<li>De carácter no lineal, tales como: embalses o grandes depósitos de agua; centrales;
estaciones transformadoras de superficie superior a 100 metros cuadrados; plantas
depuradoras y de tratamiento de residuos sólidos y cualesquiera otras instalaciones de
utilidad pública y similar impacto sobre el medio físico.</li>
</ul>

<p>A los efectos de la adscripción formal de estos sistemas generales a la categorización de
suelo rústico del artículo 14 de la LISTA, los mismos deben asimilarse a la categoría de suelo
rústico preservado por la ordenación territorial o urbanística, por contar con funciones análogas
a los terrenos reservados a usos de interés general (a los que alude el artículo 14.1.c) inciso final
de la LISTA). En todo caso, el régimen jurídico propio del sistema general específico que en cada
caso le atribuya el PGOM se impone al régimen jurídico ordinario del suelo rústico preservado.</p>
</div>
<div class="src-note">PLANTILLA — marco legal común (art. 14 LISTA), confirmado idéntico entre Osuna y Lora del Río. La relación concreta de sistemas generales de este municipio (infraestructurales, equipamientos, espacios libres, con su nombre propio) va en el apartado siguiente, a rellenar por el técnico.</div>
`.trim();
}
