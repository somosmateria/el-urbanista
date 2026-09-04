import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

export async function getSubepigrafes(capituloPadre: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mapeo_capitulos")
    .select("*")
    .eq("capitulo_padre", capituloPadre)
    .eq("activo", true)
    .order("orden");
  if (error) throw error;
  return data;
}

/**
 * Los doce capítulos de nivel superior de la memoria, tal como están
 * configurados hoy — para pintar la lista en la pantalla de "generando"
 * ANTES de que existan filas de `capitulos` (se crean todas de golpe al
 * final de `generarCapitulosIniciales`), así la lista no aparece vacía
 * mientras se genera.
 */
export async function listCapitulosPrincipales() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mapeo_capitulos")
    .select("capitulo_codigo, titulo_canonico")
    .is("capitulo_padre", null)
    .eq("activo", true)
    .order("orden");
  if (error) throw error;
  return data;
}
