import "server-only";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "plantillas-referencia";

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
