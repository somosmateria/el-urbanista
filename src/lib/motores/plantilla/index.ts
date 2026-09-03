import type { MunicipioRow } from "@/lib/supabase/types";
import { generarMO1 } from "./mo1";
import { generarMO2 } from "./mo2";
import { generarMO4 } from "./mo4";
import { generarMO7 } from "./mo7";
import { generarMO8 } from "./mo8";
import { generarMO9 } from "./mo9";
import { generarMO10 } from "./mo10";
import { generarMO11 } from "./mo11";
import { generarMO12 } from "./mo12";

/**
 * Registro de plantillas implementadas por código de capítulo. Un capítulo
 * con motor "plantilla" pero sin entrada aquí todavía se queda en
 * `sin_info`/`falta_dato` — no se genera un texto a medio verificar que
 * parezca terminado (ver docs/01-analisis-diagnostico-a-ordenacion.md).
 *
 * `diagnosticoId` llega como null cuando el municipio no tiene diagnóstico
 * procesado — la mayoría de plantillas lo ignoran (no lo necesitan), pero
 * MO.11 sí lo usa para extraer la lista real de municipios colindantes.
 */
export const PLANTILLAS: Record<
  string,
  (municipio: MunicipioRow, diagnosticoId: string | null) => Promise<string | null> | string | null
> = {
  "MO.1": generarMO1,
  "MO.2": generarMO2,
  "MO.4": generarMO4,
  "MO.7": generarMO7,
  "MO.8": generarMO8,
  "MO.9": generarMO9,
  "MO.10": generarMO10,
  "MO.11": generarMO11,
  "MO.12": generarMO12,
};

/**
 * MO.2 se genera a partir de un banco de objetivos de referencia, no de un
 * texto ya verificado para este municipio (ver el aviso en mo2.ts) —
 * aterriza en "revisar" en vez de "listo", igual que los capítulos del
 * motor RAG.
 */
export const PLANTILLAS_QUE_NECESITAN_REVISION = new Set(["MO.2"]);
