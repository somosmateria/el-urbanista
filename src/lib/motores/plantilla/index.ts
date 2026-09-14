import type { MunicipioRow } from "@/lib/supabase/types";
import { createServiceClient } from "@/lib/supabase/server";
import { getSeccionReferenciaDeEquipo, getReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import { detectarContaminacion } from "@/lib/motores/evaluacion/contaminacion";
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
import { generarMO3_1 } from "./mo3-1";
import { generarMO3_2 } from "./mo3-2";
import { generarMO3_1_4 } from "./mo3-1-4";
import { generarMO3_3 } from "./mo3-3";
import { generarMO3_4 } from "./mo3-4";
import { generarMO3_6 } from "./mo3-6";
import { generarMO5_1 } from "./mo5-1";
import { generarMO5_2 } from "./mo5-2";
import { generarMO5_2_2 } from "./mo5-2-2";
import { generarMO5_3 } from "./mo5-3";
import { generarMO5_4 } from "./mo5-4";
import { generarMO6_1 } from "./mo6-1";
import { generarMO6_2 } from "./mo6-2";

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
  "MO.3.1": generarMO3_1,
  "MO.3.2": generarMO3_2,
  "MO.3.1.4": generarMO3_1_4,
  "MO.3.3": generarMO3_3,
  "MO.3.4": generarMO3_4,
  "MO.3.6": generarMO3_6,
  "MO.5.1": generarMO5_1,
  "MO.5.2": generarMO5_2,
  "MO.5.2.2": generarMO5_2_2,
  "MO.5.3": generarMO5_3,
  "MO.5.4": generarMO5_4,
  "MO.6.1": generarMO6_1,
  "MO.6.2": generarMO6_2,
};

/**
 * MO.2 se genera a partir de un banco de objetivos de referencia, no de un
 * texto ya verificado para este municipio (ver el aviso en mo2.ts) —
 * aterriza en "revisar" en vez de "listo", igual que los capítulos del
 * motor RAG. MO.1 también: su sección "2 · De las alternativas..." cubre
 * el marco legal y la metodología, pero deja a propósito sin rellenar la
 * descripción de las alternativas concretas del municipio (ver el aviso
 * en mo1.ts) — no está terminado hasta que alguien las añada a mano.
 * Cualquier capítulo resuelto contra el Avance de referencia del equipo
 * (ver resolverPlantilla) también aterriza en "revisar" — es contenido de
 * OTRO municipio reutilizado, siempre hay que confirmarlo.
 */
export const PLANTILLAS_QUE_NECESITAN_REVISION = new Set(["MO.1", "MO.2"]);

/**
 * Igual que `listOtrosMunicipiosDelEquipo` de `@/lib/data/municipios`, pero
 * duplicada aquí (no importada) porque ese archivo ya importa
 * `resolverPlantilla` — importarla de vuelta crearía un ciclo. Consulta
 * mínima, no hace falta compartirla.
 */
async function otrosMunicipiosDelEquipo(equipoId: string, municipioIdActual: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipios")
    .select("nombre, plan_vigente")
    .eq("equipo_id", equipoId)
    .neq("id", municipioIdActual);
  if (error) throw error;
  return data;
}

/**
 * Punto único por el que pasa cualquier capítulo de motor "plantilla" al
 * generarse o regenerarse: si el equipo tiene un Avance de referencia
 * propio y localizó contenido para este código, se usa eso (con
 * {{MUNICIPIO}} sustituido) en vez del banco de texto fijo del código —
 * ver docs de 0009_plantilla_referencia.sql sobre por qué MO.1 y MO.11
 * quedan siempre fuera de esta sustitución.
 *
 * Antes de usar ese contenido se comprueba que no mencione a NINGÚN otro
 * municipio (nombre o plan vigente) — la misma comprobación que ya hace
 * `detectarContaminacion` en la evaluación técnica, pero aplicada ANTES de
 * guardar nada, no después. Motivo: aunque un código se marque "sustituible"
 * hoy, el documento real del que sale el Avance de referencia puede traer
 * datos irreducibles de SU municipio de origen (ver el caso real
 * documentado en CODIGOS_NO_SUSTITUIBLES) — esta comprobación es la
 * garantía estructural de que eso nunca llega a aparecer en la Memoria de
 * otro municipio, en vez de depender solo de mantener esa lista al día a
 * mano. Si salta, se descarta la sustitución y se cae a la plantilla fija.
 *
 * La lista de "otros municipios" a comprobar incluye tanto los que el
 * equipo tiene dados de alta como, si se conoce, el municipio para el que
 * se redactó ORIGINALMENTE el Avance de referencia (`municipio_origen`) —
 * este último es el caso más probable de fuga y no depende de que ese
 * municipio exista como fila en la aplicación (ver
 * detectarMunicipioOrigen).
 */
export async function resolverPlantilla(
  codigo: string,
  municipio: MunicipioRow,
  diagnosticoId: string | null,
  equipoId: string
): Promise<{ contenido: string | null; necesitaRevision: boolean }> {
  if (!CODIGOS_NO_SUSTITUIBLES.has(codigo)) {
    const seccion = await getSeccionReferenciaDeEquipo(equipoId, codigo);
    // La sección puede existir en el Avance de referencia del equipo con el
    // cuerpo vacío (el segmentado por título encontró el epígrafe pero sin
    // texto propio, p.ej. porque en el documento real ese contenido es solo
    // una tabla) — comprobado en producción con MO.3.2 de Los Palacios: sin
    // esta comprobación se sustituía por un bloque vacío en vez de caer en
    // la plantilla fija de abajo, que sí tiene contenido real.
    const cuerpo = seccion?.texto_html.replaceAll("{{MUNICIPIO}}", municipio.nombre).trim();
    if (cuerpo) {
      const [otros, referencia] = await Promise.all([
        otrosMunicipiosDelEquipo(equipoId, municipio.id),
        getReferenciaDeEquipo(equipoId),
      ]);
      const origen = referencia?.municipio_origen?.trim();
      const otrosConOrigen =
        origen && origen.toLowerCase() !== municipio.nombre.trim().toLowerCase()
          ? [...otros, { nombre: origen, plan_vigente: null }]
          : otros;
      const hallazgos = detectarContaminacion(cuerpo, municipio, otrosConOrigen);
      if (hallazgos.length === 0) {
        const contenido = `
<div class="doc-text">${cuerpo}</div>
<div class="src-note">Basado en el Avance de referencia del equipo — confirma que encaja con el diagnóstico de este municipio antes de cerrar el capítulo.</div>
`.trim();
        return { contenido, necesitaRevision: true };
      }
      console.error(
        `[plantilla] ${codigo}: el Avance de referencia del equipo menciona a otro municipio, se descarta la sustitución —`,
        hallazgos.map((h) => h.fuente).join("; ")
      );
    }
  }

  const generador = PLANTILLAS[codigo];
  const contenido = generador ? await generador(municipio, diagnosticoId) : null;
  return { contenido, necesitaRevision: PLANTILLAS_QUE_NECESITAN_REVISION.has(codigo) };
}
