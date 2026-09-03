import type { MunicipioRow } from "@/lib/supabase/types";
import { generarMO1 } from "./mo1";

/**
 * Registro de plantillas implementadas por código de capítulo. Un capítulo
 * con motor "plantilla" pero sin entrada aquí todavía se queda en
 * `sin_info`/`falta_dato` — no se genera un texto a medio verificar que
 * parezca terminado (ver docs/01-analisis-diagnostico-a-ordenacion.md).
 */
export const PLANTILLAS: Record<string, (municipio: MunicipioRow) => string | null> = {
  "MO.1": generarMO1,
};
