import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

export async function listTablasDeCapitulo(capituloId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulo_tablas")
    .select("*")
    .eq("capitulo_id", capituloId)
    .order("orden");
  if (error) throw error;
  return data;
}

export async function crearBloqueTabla(capituloId: string, nombreBloque: string) {
  const supabase = createServiceClient();

  const { count, error: countError } = await supabase
    .from("capitulo_tablas")
    .select("id", { count: "exact", head: true })
    .eq("capitulo_id", capituloId);
  if (countError) throw countError;

  const { data, error } = await supabase
    .from("capitulo_tablas")
    .insert({
      capitulo_id: capituloId,
      nombre_bloque: nombreBloque,
      columnas: ["Nombre"],
      filas: [],
      orden: count ?? 0,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Guarda el nuevo estado de una tabla, conservando el estado anterior en el
 * historial — misma regla no negociable que el texto en prosa (ver
 * docs/04-edicion-y-tablas.md).
 */
export async function guardarTabla(
  tablaId: string,
  columnas: string[],
  filas: Record<string, string>[]
) {
  const supabase = createServiceClient();

  const { data: actual, error: getError } = await supabase
    .from("capitulo_tablas")
    .select("*")
    .eq("id", tablaId)
    .single();
  if (getError) throw getError;

  const { error: versionError } = await supabase.from("capitulo_tablas_versiones").insert({
    capitulo_tabla_id: tablaId,
    columnas: actual.columnas,
    filas: actual.filas,
    tipo: "edicion_manual",
  });
  if (versionError) throw versionError;

  const { error: updateError } = await supabase
    .from("capitulo_tablas")
    .update({ columnas, filas })
    .eq("id", tablaId);
  if (updateError) throw updateError;
}
