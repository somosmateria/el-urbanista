import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { EquipoActivo } from "@/lib/data/equipos";

/**
 * Un admin del equipo ve siempre todos sus municipios. Un miembro solo ve
 * los que se le hayan concedido explícitamente aquí — por defecto, ninguno
 * (decisión explícita: alta en el equipo no implica ver nada todavía).
 */
export async function tieneAccesoAMunicipio(municipioId: string, equipo: EquipoActivo) {
  if (equipo.rol === "admin") return true;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipio_accesos")
    .select("id")
    .eq("municipio_id", municipioId)
    .eq("user_id", equipo.userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function listMunicipioIdsAccesibles(municipioIds: string[], userId: string) {
  if (municipioIds.length === 0) return new Set<string>();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipio_accesos")
    .select("municipio_id")
    .eq("user_id", userId)
    .in("municipio_id", municipioIds);
  if (error) throw error;
  return new Set(data.map((a) => a.municipio_id));
}

/** IDs de usuario con acceso concedido a este municipio (para pintar checkboxes). */
export async function listUserIdsConAcceso(municipioId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipio_accesos")
    .select("user_id")
    .eq("municipio_id", municipioId);
  if (error) throw error;
  return new Set(data.map((a) => a.user_id));
}

export async function concederAcceso(municipioId: string, userId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("municipio_accesos")
    .upsert({ municipio_id: municipioId, user_id: userId }, { onConflict: "municipio_id,user_id" });
  if (error) throw error;
}

export async function revocarAcceso(municipioId: string, userId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("municipio_accesos")
    .delete()
    .eq("municipio_id", municipioId)
    .eq("user_id", userId);
  if (error) throw error;
}
