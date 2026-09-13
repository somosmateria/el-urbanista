import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * Detección determinista (sin llamar a Claude) de contenido "contaminado"
 * con datos de OTRO municipio del mismo equipo — el caso real que motivó
 * esto: el MO.4 de Los Palacios y Villafranca (PGOU 2008) se sustituyó por
 * el Avance de referencia del equipo, tomado del documento real de Lora del
 * Río, y el `plan_vigente` de Lora ("pgou 2005") podría colarse tal cual en
 * cualquier capítulo de cualquier otro municipio que reutilice ese mismo
 * Avance de referencia.
 *
 * Deliberadamente simple: un `includes` case-insensitive sobre el texto ya
 * sin etiquetas HTML. No hace falta IA para esto — es justo el tipo de
 * comprobación que una llamada a Claude podría pasar por alto por estar
 * "redactado con fluidez", y que un match de texto exacto no.
 */
export function detectarContaminacion(
  contenidoHtml: string,
  municipioActual: Pick<MunicipioRow, "nombre" | "plan_vigente">,
  otrosMunicipiosDelEquipo: Pick<MunicipioRow, "nombre" | "plan_vigente">[]
): { fuente: string }[] {
  const textoPlano = contenidoHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!textoPlano) return [];

  const hallazgos: { fuente: string }[] = [];
  for (const otro of otrosMunicipiosDelEquipo) {
    if (otro.nombre === municipioActual.nombre) continue;

    if (contieneComoTermino(textoPlano, otro.nombre)) {
      hallazgos.push({ fuente: `Nombre de otro municipio del equipo: "${otro.nombre}"` });
    }

    // Un plan_vigente muy corto (p.ej. un solo número) daría demasiados
    // falsos positivos — solo se comprueban valores con contenido real, y
    // solo si además no coincide con el propio plan del municipio actual
    // (mismo tipo de instrumento en dos municipios distintos no es
    // contaminación).
    if (
      otro.plan_vigente &&
      otro.plan_vigente.trim().length >= 4 &&
      otro.plan_vigente.trim().toLowerCase() !== (municipioActual.plan_vigente ?? "").trim().toLowerCase() &&
      contieneComoTermino(textoPlano, otro.plan_vigente)
    ) {
      hallazgos.push({ fuente: `Plan vigente de otro municipio del equipo: "${otro.plan_vigente}"` });
    }
  }
  return hallazgos;
}

function contieneComoTermino(textoPlano: string, termino: string): boolean {
  const escapado = termino.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escapado) return false;
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapado}(?![\\p{L}\\p{N}])`, "iu").test(textoPlano);
}
