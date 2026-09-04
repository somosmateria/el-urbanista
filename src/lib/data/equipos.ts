import "server-only";
import { cookies, headers } from "next/headers";
import { createServiceClient, createServerAuthClient } from "@/lib/supabase/server";
import { enviarInvitacionEquipo } from "@/lib/email";
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
 * Invita por email a un equipo — ya no da acceso de inmediato: crea una
 * invitación pendiente (o la reactiva si ya existía y se había rechazado)
 * que la persona tiene que aceptar desde la propia app al entrar (ver
 * listInvitacionesPendientes/aceptarInvitacion más abajo). Si la cuenta no
 * existe todavía, el email lleva el enlace de creación de cuenta de
 * Supabase Auth; si ya existe, solo lleva a /login — verá la invitación en
 * cuanto entre.
 */
export async function invitarAEquipo(equipoId: string, email: string, invitadoPor: string) {
  const supabase = createServiceClient();
  const emailNormalizado = email.trim().toLowerCase();

  const origin = (await headers()).get("origin") ?? (await headers()).get("host");
  const base = origin ? (origin.startsWith("http") ? origin : `https://${origin}`) : "";

  let enlace = `${base}/login`;
  let esCuentaNueva = false;

  const { data: generado, error: generarError } = await supabase.auth.admin.generateLink({
    type: "invite",
    email: emailNormalizado,
    options: { redirectTo: `${base}/auth/confirm` },
  });

  if (generado?.properties?.action_link) {
    enlace = generado.properties.action_link;
    esCuentaNueva = true;
  } else if (generarError && !generarError.message.toLowerCase().includes("already been registered")) {
    // Un fallo que no sea "ya existe cuenta" sí es un problema real de verdad.
    throw generarError;
  }

  const { data: equipo, error: equipoError } = await supabase
    .from("equipos")
    .select("nombre")
    .eq("id", equipoId)
    .maybeSingle();
  if (equipoError) throw equipoError;
  if (!equipo) throw new Error("Equipo no encontrado.");

  const { error: invitacionError } = await supabase.from("equipo_invitaciones").upsert(
    {
      equipo_id: equipoId,
      email: emailNormalizado,
      invitado_por: invitadoPor,
      estado: "pendiente",
      resuelta_at: null,
    },
    { onConflict: "equipo_id,email" }
  );
  if (invitacionError) throw invitacionError;

  await enviarInvitacionEquipo({
    email: emailNormalizado,
    equipoNombre: equipo.nombre,
    enlace,
    esCuentaNueva,
  });
}

/**
 * Las invitaciones pendientes de esta persona, con el nombre del equipo —
 * para el aviso que se le muestra al entrar (ver InvitacionBanner).
 */
export async function listInvitacionesPendientes(email: string) {
  const supabase = createServiceClient();
  const { data: invitaciones, error } = await supabase
    .from("equipo_invitaciones")
    .select("id, equipo_id, created_at")
    .eq("email", email.trim().toLowerCase())
    .eq("estado", "pendiente")
    .order("created_at");
  if (error) throw error;
  if (invitaciones.length === 0) return [];

  const { data: equipos, error: equiposError } = await supabase
    .from("equipos")
    .select("id, nombre")
    .in(
      "id",
      invitaciones.map((i) => i.equipo_id)
    );
  if (equiposError) throw equiposError;

  return invitaciones.map((i) => ({
    ...i,
    equipoNombre: equipos.find((e) => e.id === i.equipo_id)?.nombre ?? "(equipo eliminado)",
  }));
}

async function resolverInvitacion(
  invitacionId: string,
  usuario: { id: string; email: string },
  estado: "aceptada" | "rechazada"
) {
  const supabase = createServiceClient();
  const { data: invitacion, error } = await supabase
    .from("equipo_invitaciones")
    .select("*")
    .eq("id", invitacionId)
    .eq("estado", "pendiente")
    .maybeSingle();
  if (error) throw error;
  if (!invitacion || invitacion.email !== usuario.email.trim().toLowerCase()) {
    throw new Error("Invitación no encontrada.");
  }

  if (estado === "aceptada") {
    const { error: miembroError } = await supabase
      .from("equipo_miembros")
      .upsert(
        { equipo_id: invitacion.equipo_id, user_id: usuario.id, rol: "miembro" },
        { onConflict: "equipo_id,user_id" }
      );
    if (miembroError) throw miembroError;
  }

  const { error: updateError } = await supabase
    .from("equipo_invitaciones")
    .update({ estado, resuelta_at: new Date().toISOString() })
    .eq("id", invitacionId);
  if (updateError) throw updateError;

  return invitacion.equipo_id;
}

export async function aceptarInvitacion(invitacionId: string, usuario: { id: string; email: string }) {
  return resolverInvitacion(invitacionId, usuario, "aceptada");
}

export async function rechazarInvitacion(invitacionId: string, usuario: { id: string; email: string }) {
  return resolverInvitacion(invitacionId, usuario, "rechazada");
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

/**
 * Sube o baja el rol de un miembro. Nunca deja el equipo sin ningún
 * admin — si el miembro que se está degradando es el último admin, se
 * rechaza (ver cambiarRolMiembroAction, que además impide que alguien se
 * quite el admin a sí mismo por error sin querer, aunque no fuera el
 * último).
 */
export async function cambiarRolMiembro(equipoId: string, miembroId: string, rol: EquipoRol) {
  const supabase = createServiceClient();
  if (rol === "miembro") {
    const { count, error: countError } = await supabase
      .from("equipo_miembros")
      .select("id", { count: "exact", head: true })
      .eq("equipo_id", equipoId)
      .eq("rol", "admin");
    if (countError) throw countError;

    const { data: actual, error: actualError } = await supabase
      .from("equipo_miembros")
      .select("rol")
      .eq("id", miembroId)
      .eq("equipo_id", equipoId)
      .maybeSingle();
    if (actualError) throw actualError;

    if (actual?.rol === "admin" && (count ?? 0) <= 1) {
      throw new Error("No puedes quitarle el admin al único admin del equipo.");
    }
  }

  const { error } = await supabase
    .from("equipo_miembros")
    .update({ rol })
    .eq("id", miembroId)
    .eq("equipo_id", equipoId);
  if (error) throw error;
}

/** Solo id + nombre — para el selector de municipios al conceder acceso. */
export async function listMunicipiosDeEquipo(equipoId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipios")
    .select("id, nombre")
    .eq("equipo_id", equipoId)
    .order("nombre");
  if (error) throw error;
  return data;
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
