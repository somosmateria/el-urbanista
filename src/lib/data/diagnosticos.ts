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

export async function iniciarSubidaDiagnostico(municipioId: string, nombreArchivo: string | null) {
  const supabase = createServiceClient();
  const path = `${municipioId}/${randomUUID()}.pdf`;

  const { data: diagnostico, error: insertError } = await supabase
    .from("diagnosticos")
    .insert({
      municipio_id: municipioId,
      storage_path: path,
      nombre_archivo: nombreArchivo,
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

export async function getSeccionPorCodigo(diagnosticoId: string, codigo: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("diagnostico_secciones")
    .select("*")
    .eq("diagnostico_id", diagnosticoId)
    .eq("codigo", codigo)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listSeccionesDeDiagnostico(diagnosticoId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("diagnostico_secciones")
    .select("*")
    .eq("diagnostico_id", diagnosticoId)
    .order("orden");
  if (error) throw error;
  return data;
}

export type ResultadoBusquedaSeccion = {
  secciones: Awaited<ReturnType<typeof listSeccionesDeDiagnostico>>;
  motivo: "encontrado" | "no_localizado" | "informacion_insuficiente";
};

/**
 * `getSeccionPorCodigo` es un lookup exacto por código de epígrafe — si el
 * parser (`src/lib/diagnostico/parser.ts`) no detectó ese código tal cual
 * (limitación conocida y documentada ahí: números de nivel superior a
 * veces quedan separados del título en la maquetación del PDF), el bloque
 * se daba por "sin información" sin más. Esta función añade un segundo
 * intento antes de rendirse: busca por palabras clave/sinónimos sobre el
 * texto YA trceado de todo el diagnóstico (nada de embeddings/vectores —
 * el diagnóstico entero cabe de sobra en memoria como texto plano).
 *
 * Devuelve `no_localizado` (nunca "no existe": eso requeriría que el propio
 * texto lo niegue expresamente, algo que esta función no evalúa) cuando ni
 * el código ni ningún sinónimo aparece en absoluto, e
 * `informacion_insuficiente` cuando el reintento sí encuentra algo pero es
 * corto o solo menciona el tema de pasada — ver
 * docs/06-decisiones-pendientes.md #2.
 */
export async function buscarSeccionConReintento(
  diagnosticoId: string,
  codigosPrincipales: string[],
  sinonimos: string[] = []
): Promise<ResultadoBusquedaSeccion> {
  const directas = (
    await Promise.all(codigosPrincipales.map((codigo) => getSeccionPorCodigo(diagnosticoId, codigo)))
  ).filter((s): s is NonNullable<typeof s> => s !== null);
  if (directas.length > 0) return { secciones: directas, motivo: "encontrado" };

  if (sinonimos.length === 0) return { secciones: [], motivo: "no_localizado" };

  const todas = await listSeccionesDeDiagnostico(diagnosticoId);
  return elegirPorSinonimos(todas, sinonimos);
}

/**
 * Parte pura del reintento (sin acceso a datos) — separada para poder
 * probarla sin depender de Supabase. Umbral de suficiencia: una sección
 * encontrada por sinónimo pero muy corta, o que solo trae el término de
 * pasada sin desarrollarlo, no basta para redactar un apartado — mejor
 * marcarlo para que el técnico lo mire que fabricar contenido a partir de
 * una mención de una línea.
 */
const UMBRAL_CARACTERES_SUFICIENTES = 200;

export function elegirPorSinonimos(
  todas: Awaited<ReturnType<typeof listSeccionesDeDiagnostico>>,
  sinonimos: string[]
): ResultadoBusquedaSeccion {
  const patrones = sinonimos.map((s) => new RegExp(escaparRegex(s), "iu"));
  const candidatas = todas.filter((s) => patrones.some((p) => p.test(s.titulo ?? "") || p.test(s.texto)));
  if (candidatas.length === 0) return { secciones: [], motivo: "no_localizado" };

  const suficientes = candidatas.filter((s) => s.texto.length >= UMBRAL_CARACTERES_SUFICIENTES);
  if (suficientes.length === 0) return { secciones: candidatas, motivo: "informacion_insuficiente" };

  return { secciones: suficientes, motivo: "encontrado" };
}

function escaparRegex(termino: string): string {
  return termino.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
