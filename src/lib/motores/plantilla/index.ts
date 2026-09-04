import type { MunicipioRow } from "@/lib/supabase/types";
import { getSeccionReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import { CODIGOS_NO_SUSTITUIBLES } from "./referencia";
import { generarMO1 } from "./mo1";
import { generarMO2 } from "./mo2";
import { generarMO4 } from "./mo4";
import { generarMO7 } from "./mo7";
import { generarMO8 } from "./mo8";
import { generarMO9 } from "./mo9";
import { generarMO10 } from "./mo10";
import { generarMO11 } from "./mo11";
import { generarMO12 } from "./mo12";
import { generarMO3_1_4 } from "./mo3-1-4";
import { generarMO3_3 } from "./mo3-3";

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
  // Subepígrafes de MO.3 (capítulo mixto rag+plantilla+tabla) — el motor
  // RAG los consulta aquí mismo por su código de subepígrafe.
  "MO.3.1.4": generarMO3_1_4,
  "MO.3.3": generarMO3_3,
};

/**
 * MO.2 se genera a partir de un banco de objetivos de referencia, no de un
 * texto ya verificado para este municipio (ver el aviso en mo2.ts) —
 * aterriza en "revisar" en vez de "listo", igual que los capítulos del
 * motor RAG. Cualquier capítulo resuelto contra el Avance de referencia
 * del equipo (ver resolverPlantilla) también aterriza en "revisar" —
 * es contenido de OTRO municipio reutilizado, siempre hay que confirmarlo.
 */
export const PLANTILLAS_QUE_NECESITAN_REVISION = new Set(["MO.2"]);

/**
 * Punto único por el que pasa cualquier capítulo de motor "plantilla" al
 * generarse o regenerarse: si el equipo tiene un Avance de referencia
 * propio y localizó contenido para este código, se usa eso (con
 * {{MUNICIPIO}} sustituido) en vez del banco de texto fijo del código —
 * ver docs de 0009_plantilla_referencia.sql sobre por qué MO.1 y MO.11
 * quedan siempre fuera de esta sustitución.
 */
export async function resolverPlantilla(
  codigo: string,
  municipio: MunicipioRow,
  diagnosticoId: string | null,
  equipoId: string
): Promise<{ contenido: string | null; necesitaRevision: boolean }> {
  if (!CODIGOS_NO_SUSTITUIBLES.has(codigo)) {
    const seccion = await getSeccionReferenciaDeEquipo(equipoId, codigo);
    if (seccion) {
      const cuerpo = seccion.texto_html.replaceAll("{{MUNICIPIO}}", municipio.nombre);
      const contenido = `
<div class="doc-eyebrow">${codigo} · ${(seccion.titulo ?? "").toUpperCase()}</div>
<div class="doc-text">${cuerpo}</div>
<div class="src-note">Basado en el Avance de referencia del equipo — confirma que encaja con el diagnóstico de este municipio antes de cerrar el capítulo.</div>
`.trim();
      return { contenido, necesitaRevision: true };
    }
  }

  const generador = PLANTILLAS[codigo];
  const contenido = generador ? await generador(municipio, diagnosticoId) : null;
  return { contenido, necesitaRevision: PLANTILLAS_QUE_NECESITAN_REVISION.has(codigo) };
}
