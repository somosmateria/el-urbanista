import "server-only";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "plantillas-referencia";

// Siglas urbanísticas que se re-mayusculizan tras pasar un título gritado a
// formato normal — de lo contrario "pgou"/"pgom" quedarían en minúscula.
const SIGLAS = ["PGOM", "PGOU", "EAE", "GICA", "LOUA", "POT", "UE", "DIE", "SNU", "SUNC", "SUS"];

function pareceGritado(texto: string): boolean {
  const letras = texto.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  return letras.length > 3 && letras === letras.toUpperCase() && letras !== letras.toLowerCase();
}

function aFraseNormal(texto: string): string {
  const minusculas = texto.toLowerCase();
  const conMayusculas = minusculas.replace(/(^\s*\w|[.:]\s+\w)/g, (m) => m.toUpperCase());
  return conMayusculas.replace(new RegExp(`\\b(${SIGLAS.join("|")})\\b`, "gi"), (m) => m.toUpperCase());
}

/**
 * El título que Claude extrae de un Avance real viene tal cual lo escribió
 * el estudio en su día: a veces en MAYÚSCULAS, a veces con la numeración
 * propia del documento delante ("MO.4 ...", "1.4. ...") que no tiene nada
 * que ver con el código interno de El Urbanista. Aquí se limpia solo para
 * mostrarlo — nunca se reescribe lo que hay guardado en base de datos, así
 * que un ajuste aquí se aplica también a lo ya subido, sin reprocesar (y
 * sin volver a gastar en la API).
 */
export function normalizarTituloReferencia(bruto: string): string {
  let t = bruto.trim();
  t = t.replace(/^(?:MO\.\d+(?:\.\d+)*\.?|\d+(?:\.\d+)*\.)\s+/i, "");
  t = t.replace(/\.+$/, "").trim();
  if (pareceGritado(t)) t = aFraseNormal(t);
  return t;
}

export async function getReferenciaDeEquipo(equipoId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("equipo_plantilla_referencia")
    .select("*")
    .eq("equipo_id", equipoId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getReferenciaPorId(referenciaId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("equipo_plantilla_referencia")
    .select("*")
    .eq("id", referenciaId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Un equipo solo tiene un Avance de referencia: si ya existía uno, se
 * sustituye (misma fila, nuevo archivo) — "poder actualizarlo si hace
 * falta" es un requisito explícito, no una versión más.
 */
export async function iniciarSubidaReferencia(equipoId: string, nombreArchivo: string | null) {
  const supabase = createServiceClient();
  const path = `${equipoId}/${randomUUID()}.pdf`;

  const { data: referencia, error: upsertError } = await supabase
    .from("equipo_plantilla_referencia")
    .upsert(
      { equipo_id: equipoId, storage_path: path, nombre_archivo: nombreArchivo, estado: "procesando", error_mensaje: null },
      { onConflict: "equipo_id" }
    )
    .select("*")
    .single();
  if (upsertError) throw upsertError;

  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path, { upsert: true });
  if (signError) throw signError;

  return {
    referenciaId: referencia.id,
    path: signed.path,
    token: signed.token,
  };
}

export async function marcarReferenciaError(referenciaId: string, mensaje: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("equipo_plantilla_referencia")
    .update({ estado: "error", error_mensaje: mensaje })
    .eq("id", referenciaId);
  if (error) throw error;
}

export async function marcarReferenciaLista(referenciaId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("equipo_plantilla_referencia")
    .update({ estado: "listo", error_mensaje: null })
    .eq("id", referenciaId);
  if (error) throw error;
}

export async function descargarReferenciaDesdeStorage(storagePath: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(storagePath);
  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}

export async function guardarSeccionesReferencia(
  referenciaId: string,
  secciones: { codigo: string; titulo: string; texto: string }[]
) {
  const supabase = createServiceClient();
  // Reprocesar (o volver a subir) sustituye las secciones anteriores, no
  // las acumula — mismo criterio que diagnostico_secciones.
  const { error: deleteError } = await supabase
    .from("equipo_plantilla_secciones")
    .delete()
    .eq("referencia_id", referenciaId);
  if (deleteError) throw deleteError;

  if (secciones.length === 0) return;

  const { error: insertError } = await supabase.from("equipo_plantilla_secciones").insert(
    secciones.map((s) => ({
      referencia_id: referenciaId,
      capitulo_codigo: s.codigo,
      titulo: s.titulo,
      texto_html: s.texto,
    }))
  );
  if (insertError) throw insertError;
}

export async function listSeccionesDeReferencia(referenciaId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("equipo_plantilla_secciones")
    .select("*")
    .eq("referencia_id", referenciaId);
  if (error) throw error;
  return data;
}

/**
 * El único punto que consulta el motor de plantillas en tiempo de
 * generación: la sección de ESTE código para el equipo, si existe y su
 * Avance de referencia está listo. Null si el equipo no tiene referencia,
 * no está lista, o esta sección concreta no se identificó al procesarla.
 */
export async function getSeccionReferenciaDeEquipo(equipoId: string, codigo: string) {
  const referencia = await getReferenciaDeEquipo(equipoId);
  if (!referencia || referencia.estado !== "listo") return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("equipo_plantilla_secciones")
    .select("*")
    .eq("referencia_id", referencia.id)
    .eq("capitulo_codigo", codigo)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Todos los títulos calcados del Avance de referencia del equipo, de
 * golpe — para pintar una lista de capítulos/subepígrafes (semáforo,
 * cabeceras) sin una consulta por cada uno. Mapa vacío si el equipo no
 * tiene referencia lista, no si falla — nunca debe romper una página que
 * solo quiere mostrar títulos.
 */
export async function getTitulosReferenciaDeEquipo(equipoId: string): Promise<Map<string, string>> {
  const referencia = await getReferenciaDeEquipo(equipoId);
  if (!referencia || referencia.estado !== "listo") return new Map();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("equipo_plantilla_secciones")
    .select("capitulo_codigo, titulo")
    .eq("referencia_id", referencia.id);
  if (error) throw error;
  return new Map(
    data
      .filter((s): s is typeof s & { titulo: string } => !!s.titulo)
      .map((s) => [s.capitulo_codigo, normalizarTituloReferencia(s.titulo)])
  );
}
