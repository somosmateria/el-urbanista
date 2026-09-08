import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.5.2 · Las infraestructuras de comunicaciones y la movilidad
 * sostenible (marco conceptual). Verificado idéntico entre Osuna y Lora
 * del Río salvo el nombre del municipio.
 *
 * El sistema viario (5.2.1) mezcla criterios generales con la relación
 * real de carreteras del municipio en el mismo apartado del documento
 * fuente — no se ha podido separar con la misma fiabilidad que aquí, así
 * que 5.2.1 se deja entero como tabla (motor "tabla", ver
 * 0017_mo5_subepigrafes.sql).
 */
export function generarMO5_2(municipio: MunicipioRow): string {
  return `
<div class="doc-eyebrow">5.2 · LAS INFRAESTRUCTURAS DE COMUNICACIONES Y LA MOVILIDAD SOSTENIBLE</div>
<div class="doc-text">
<p>Las redes de comunicaciones se convierten, por su efecto vertebrador, en un factor claro
de ordenación del espacio. En el caso de ${municipio.nombre}, la propuesta para el Sistema
General de Comunicaciones presenta dos componentes básicos: el sistema viario, y la red básica
para la implementación de modos de transporte no motorizados de carácter territorial, apoyada
en la Infraestructura Verde en el medio rural.</p>
</div>
<div class="src-note">PLANTILLA — confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio. El desarrollo del sistema viario (5.2.1) es contenido concreto del municipio, a rellenar por el técnico.</div>
`.trim();
}
