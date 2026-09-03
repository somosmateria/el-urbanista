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
