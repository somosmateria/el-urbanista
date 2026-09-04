import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { verificarCapituloDeEquipo } from "@/lib/data/municipios";
import { concederAcceso } from "@/lib/data/municipio-accesos";
import type { EquipoActivo } from "@/lib/data/equipos";

/**
 * Asigna (o quita, con usuarioId null) un capítulo a un miembro del equipo
 * — pensado para capítulos que por su naturaleza los tiene que redactar un
 * técnico (MO.5, las alternativas concretas de MO.1) en vez de generarse
 * solos. Solo un admin puede asignar. Si se asigna a alguien que no sea
 * admin y todavía no tuviera acceso a ese municipio, se le concede de paso
 * — de lo contrario recibiría una tarea que no puede ni abrir (ver
 * src/lib/data/municipio-accesos.ts: un miembro no ve nada hasta que se le
 * concede acceso explícito).
 */
export async function asignarCapitulo(
  capituloId: string,
  equipo: EquipoActivo,
  usuarioId: string | null
) {
  if (equipo.rol !== "admin") throw new Error("Solo un admin puede asignar capítulos.");

  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("capitulos")
    .update({ asignado_a: usuarioId })
    .eq("id", capituloId);
  if (error) throw error;

  if (usuarioId) {
    await concederAcceso(capitulo.municipio_id, usuarioId);
  }

  return capitulo;
}

/**
 * Los capítulos asignados a esta persona, de cualquiera de sus equipos —
 * la asignación ya solo puede venir de un admin del equipo al que
 * pertenece el capítulo, así que no hace falta volver a filtrar por equipo
 * aquí (ver asignarCapitulo).
 */
export async function listMisTareas(userId: string) {
  const supabase = createServiceClient();
  const { data: capitulos, error } = await supabase
    .from("capitulos")
    .select("id, municipio_id, codigo, titulo, estado")
    .eq("asignado_a", userId)
    .order("codigo");
  if (error) throw error;
  if (capitulos.length === 0) return [];

  const { data: municipios, error: municipiosError } = await supabase
    .from("municipios")
    .select("id, nombre")
    .in(
      "id",
      capitulos.map((c) => c.municipio_id)
    );
  if (municipiosError) throw municipiosError;

  return capitulos.map((c) => ({
    ...c,
    municipioNombre: municipios.find((m) => m.id === c.municipio_id)?.nombre ?? "(municipio eliminado)",
  }));
}
