import "server-only";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "diagnosticos";

export async function getDiagnosticoPorId(diagnosticoId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("diagnosticos")
    .select("*")
    .eq("id", diagnosticoId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getDiagnosticoDeMunicipio(municipioId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("diagnosticos")
    .select("*")
    .eq("municipio_id", municipioId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function iniciarSubidaDiagnostico(municipioId: string) {
  const supabase = createServiceClient();
  const path = `${municipioId}/${randomUUID()}.pdf`;

  const { data: diagnostico, error: insertError } = await supabase
    .from("diagnosticos")
    .insert({
      municipio_id: municipioId,
      storage_path: path,
      nombre_archivo: null,
      estado: "procesando",
    })
    .select("*")
    .single();
  if (insertError) throw insertError;

  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (signError) throw signError;

  return {
    diagnosticoId: diagnostico.id,
    path: signed.path,
    token: signed.token,
  };
}

export async function marcarDiagnosticoError(diagnosticoId: string, mensaje: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("diagnosticos")
    .update({ estado: "error", error_mensaje: mensaje })
    .eq("id", diagnosticoId);
  if (error) throw error;
}

export async function marcarDiagnosticoListo(diagnosticoId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("diagnosticos")
    .update({ estado: "listo", error_mensaje: null })
    .eq("id", diagnosticoId);
  if (error) throw error;
}

export async function descargarDiagnosticoDesdeStorage(storagePath: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(storagePath);
  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}

export async function guardarSeccionesDiagnostico(
  diagnosticoId: string,
  secciones: { codigo: string; titulo: string; texto: string; orden: number }[]
) {
  const supabase = createServiceClient();
  // Un municipio puede volver a subir/regenerar el diagnóstico: se sustituyen
  // las secciones anteriores de este diagnóstico, no se acumulan duplicadas.
  const { error: deleteError } = await supabase
    .from("diagnostico_secciones")
    .delete()
    .eq("diagnostico_id", diagnosticoId);
  if (deleteError) throw deleteError;

  if (secciones.length === 0) return;

  const { error: insertError } = await supabase.from("diagnostico_secciones").insert(
    secciones.map((s) => ({
      diagnostico_id: diagnosticoId,
      codigo: s.codigo,
      titulo: s.titulo,
      texto: s.texto,
      orden: s.orden,
    }))
  );
  if (insertError) throw insertError;
}
