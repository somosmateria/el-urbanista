import "server-only";
import { cookies } from "next/headers";
import { createServiceClient, createServerAuthClient } from "@/lib/supabase/server";
import type { EquipoRol } from "@/lib/supabase/types";

const COOKIE_EQUIPO_ACTIVO = "equipo_activo";

export type EquipoActivo = { id: string; nombre: string; rol: EquipoRol; userId: string };

export async function getUsuarioActual() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Los equipos de una persona, en el mismo orden en que se unió a ellos —
 * sin tabla de relaciones en el tipado (mismo estilo que el resto del
 * proyecto), se resuelve con dos consultas y se cruza en JS.
 */
export async function listEquiposDeUsuario(userId: string): Promise<EquipoActivo[]> {
  const supabase = createServiceClient();
  const { data: miembros, error } = await supabase
    .from("equipo_miembros")
    .select("equipo_id, rol")
    .eq("user_id", userId)
    .order("created_at");
  if (error) throw error;
  if (miembros.length === 0) return [];

  const { data: equipos, error: equiposError } = await supabase
    .from("equipos")
    .select("*")
    .in(
      "id",
      miembros.map((m) => m.equipo_id)
    );
  if (equiposError) throw equiposError;

  return miembros
    .map((m) => {
      const equipo = equipos.find((e) => e.id === m.equipo_id);
      return equipo ? { id: equipo.id, nombre: equipo.nombre, rol: m.rol, userId } : null;
    })
    .filter((e): e is EquipoActivo => e !== null);
}

/**
 * El equipo con el que se trabaja ahora mismo — de una cookie propia, no
 * de la sesión de Supabase (una persona puede estar en varios equipos).
 * Si la cookie no existe o apunta a un equipo del que ya no se es
 * miembro, cae al primero sin persistirlo (una Server Component no puede
 * escribir cookies) — se persiste de verdad solo cuando alguien cambia de
 * equipo a propósito, ver `cambiarEquipoActivo`.
 */
export async function getEquipoActivo(): Promise<EquipoActivo | null> {
  const user = await getUsuarioActual();
  if (!user) return null;

  const equipos = await listEquiposDeUsuario(user.id);
  if (equipos.length === 0) return null;

  const cookieStore = await cookies();
  const activoId = cookieStore.get(COOKIE_EQUIPO_ACTIVO)?.value;
  return equipos.find((e) => e.id === activoId) ?? equipos[0];
}

export async function requireEquipoActivo(): Promise<EquipoActivo> {
  const equipo = await getEquipoActivo();
  if (!equipo) throw new Error("Tu cuenta no pertenece a ningún equipo todavía.");
  return equipo;
}

export async function cambiarEquipoActivo(equipoId: string) {
  const user = await getUsuarioActual();
  if (!user) throw new Error("No autenticado.");

  const equipos = await listEquiposDeUsuario(user.id);
  if (!equipos.some((e) => e.id === equipoId)) throw new Error("No perteneces a ese equipo.");

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_EQUIPO_ACTIVO, equipoId, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function crearEquipo(nombre: string, userId: string) {
  const supabase = createServiceClient();
  const { data: equipo, error } = await supabase.from("equipos").insert({ nombre }).select("*").single();
  if (error) throw error;

  const { error: miembroError } = await supabase
    .from("equipo_miembros")
    .insert({ equipo_id: equipo.id, user_id: userId, rol: "admin" });
  if (miembroError) throw miembroError;

  return equipo;
}

export async function listMiembrosDeEquipo(equipoId: string) {
  const supabase = createServiceClient();
  const { data: miembros, error } = await supabase
    .from("equipo_miembros")
    .select("*")
    .eq("equipo_id", equipoId)
    .order("created_at");
  if (error) throw error;

  // No hay tabla de perfiles — el email de cada miembro sale de la propia
  // Auth de Supabase, una llamada por miembro (equipos pequeños).
  return Promise.all(
    miembros.map(async (m) => {
      const { data } = await supabase.auth.admin.getUserById(m.user_id);
      return { ...m, email: data.user?.email ?? "(cuenta eliminada)" };
    })
  );
}

/**
 * Invita por email a un equipo. Si la persona ya tiene cuenta (porque es
 * miembro de otro equipo, p.ej.), no se le reenvía invitación — se le
 * añade directamente al equipo nuevo.
 */
export async function invitarAEquipo(equipoId: string, email: string) {
  const supabase = createServiceClient();

  let userId: string;
  const { data: invitado, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);

  if (invitado?.user) {
    userId = invitado.user.id;
  } else {
    // Ya registrado en otro equipo — buscarlo por email en vez de re-invitar.
    const { data: lista, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;
    const existente = lista.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!existente) throw inviteError ?? new Error("No se pudo invitar.");
    userId = existente.id;
  }

  const { data: yaMiembro } = await supabase
    .from("equipo_miembros")
    .select("id")
    .eq("equipo_id", equipoId)
    .eq("user_id", userId)
    .maybeSingle();
  if (yaMiembro) return; // ya estaba en el equipo, nada que hacer

  const { error: miembroError } = await supabase
    .from("equipo_miembros")
    .insert({ equipo_id: equipoId, user_id: userId, rol: "miembro" });
  if (miembroError) throw miembroError;
}

export async function eliminarMiembroDeEquipo(equipoId: string, miembroId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("equipo_miembros")
    .delete()
    .eq("id", miembroId)
    .eq("equipo_id", equipoId);
  if (error) throw error;
}

export async function renombrarEquipo(equipoId: string, nombre: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("equipos").update({ nombre }).eq("id", equipoId);
  if (error) throw error;
}

/**
 * Borra el equipo entero — municipios, capítulos, tablas, textos,
 * diagnósticos, accesos y miembros caen en cascada (FK on delete cascade,
 * ver 0006/0009_*.sql), pero los ficheros en Storage (PDFs de diagnóstico
 * de cada municipio y el Avance de referencia del equipo) no se borran
 * solos — hay que hacerlo aparte, igual que en `eliminarMunicipio`.
 */
export async function eliminarEquipo(equipoId: string) {
  const supabase = createServiceClient();

  const { data: municipios, error: municipiosError } = await supabase
    .from("municipios")
    .select("id")
    .eq("equipo_id", equipoId);
  if (municipiosError) throw municipiosError;

  for (const municipio of municipios ?? []) {
    const { data: archivos } = await supabase.storage.from("diagnosticos").list(municipio.id);
    if (archivos && archivos.length > 0) {
      await supabase.storage.from("diagnosticos").remove(archivos.map((a) => `${municipio.id}/${a.name}`));
    }
  }

  const { data: archivosReferencia } = await supabase.storage.from("plantillas-referencia").list(equipoId);
  if (archivosReferencia && archivosReferencia.length > 0) {
    await supabase.storage
      .from("plantillas-referencia")
      .remove(archivosReferencia.map((a) => `${equipoId}/${a.name}`));
  }

  const { error } = await supabase.from("equipos").delete().eq("id", equipoId);
  if (error) throw error;
}
