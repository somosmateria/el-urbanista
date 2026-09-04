import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Mismo patrón que tablas.ts: `subepigrafeCodigo` en null trae los bloques
 * del capítulo completo (p.ej. MO.5); con un código, solo los de ese
 * subepígrafe dentro de un capítulo mixto (p.ej. "MO.3.2").
 */
export async function listTextosDeCapitulo(capituloId: string, subepigrafeCodigo: string | null = null) {
  const supabase = createServiceClient();
  let query = supabase.from("capitulo_textos").select("*").eq("capitulo_id", capituloId);
  query = subepigrafeCodigo ? query.eq("subepigrafe_codigo", subepigrafeCodigo) : query.is("subepigrafe_codigo", null);
  const { data, error } = await query.order("orden");
  if (error) throw error;
  return data;
}

export async function crearBloqueTexto(
  capituloId: string,
  titulo: string,
  subepigrafeCodigo: string | null = null
) {
  const supabase = createServiceClient();

  let countQuery = supabase
    .from("capitulo_textos")
    .select("id", { count: "exact", head: true })
    .eq("capitulo_id", capituloId);
  countQuery = subepigrafeCodigo
    ? countQuery.eq("subepigrafe_codigo", subepigrafeCodigo)
    : countQuery.is("subepigrafe_codigo", null);
  const { count, error: countError } = await countQuery;
  if (countError) throw countError;

  const { data, error } = await supabase
    .from("capitulo_textos")
    .insert({
      capitulo_id: capituloId,
      subepigrafe_codigo: subepigrafeCodigo,
      titulo,
      contenido_html: "",
      orden: count ?? 0,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function guardarTexto(textoId: string, contenidoHtml: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("capitulo_textos")
    .update({ contenido_html: contenidoHtml })
    .eq("id", textoId);
  if (error) throw error;
}

export async function getCapituloIdDeTexto(textoId: string): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("capitulo_textos").select("capitulo_id").eq("id", textoId).maybeSingle();
  return data?.capitulo_id ?? null;
}

export async function eliminarBloqueTexto(textoId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("capitulo_textos").delete().eq("id", textoId);
  if (error) throw error;
}
