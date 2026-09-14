import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

export async function listVersionesDeCapitulo(capituloId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulo_versiones")
    .select("*")
    .eq("capitulo_id", capituloId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * El `tipo` de la versión MÁS RECIENTE de cada capítulo, de golpe — para
 * decidir en una regeneración masiva (ver regenerarMemoriaAction) qué
 * capítulos tienen una edición manual sin sobrescribir sin preguntar, sin
 * una consulta por capítulo. Un capítulo sin ninguna versión (nunca se
 * llegó a generar) no aparece en el mapa devuelto.
 */
export async function listUltimoTipoVersionPorCapitulo(capituloIds: string[]): Promise<Map<string, string>> {
  if (capituloIds.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulo_versiones")
    .select("capitulo_id, tipo, created_at")
    .in("capitulo_id", capituloIds)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const ultimoPorCapitulo = new Map<string, string>();
  for (const version of data) {
    if (!ultimoPorCapitulo.has(version.capitulo_id)) {
      ultimoPorCapitulo.set(version.capitulo_id, version.tipo);
    }
  }
  return ultimoPorCapitulo;
}

/**
 * Guarda una edición manual: la versión anterior ya está en el historial
 * (se insertó cuando se generó o se editó por última vez), así que aquí solo
 * hace falta añadir la nueva como versión y como contenido activo del
 * capítulo — nunca se sobrescribe ni se pierde la anterior (ver
 * docs/04-edicion-y-tablas.md, regla no negociable).
 */
export async function guardarEdicionCapitulo(capituloId: string, contenidoHtml: string) {
  const supabase = createServiceClient();

  const { error: versionError } = await supabase.from("capitulo_versiones").insert({
    capitulo_id: capituloId,
    contenido_html: contenidoHtml,
    tipo: "edicion_manual",
  });
  if (versionError) throw versionError;

  const { error: updateError } = await supabase
    .from("capitulos")
    .update({ contenido_html: contenidoHtml })
    .eq("id", capituloId);
  if (updateError) throw updateError;
}

export async function restaurarVersion(capituloId: string, versionId: string) {
  const supabase = createServiceClient();
  const { data: version, error: getError } = await supabase
    .from("capitulo_versiones")
    .select("contenido_html")
    .eq("id", versionId)
    .single();
  if (getError) throw getError;

  await guardarEdicionCapitulo(capituloId, version.contenido_html);
}
