"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  cambiarEquipoActivo,
  crearEquipo,
  invitarAEquipo,
  eliminarMiembroDeEquipo,
  cambiarRolMiembro,
  renombrarEquipo,
  eliminarEquipo,
  listEquiposDeUsuario,
  getUsuarioActual,
  requireEquipoActivo,
} from "@/lib/data/equipos";
import type { EquipoRol } from "@/lib/supabase/types";

export async function cambiarEquipoActivoAction(equipoId: string) {
  await cambiarEquipoActivo(equipoId);
  redirect("/ajustes");
}

export async function crearEquipoAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) throw new Error("El nombre del equipo es obligatorio.");

  const user = await getUsuarioActual();
  if (!user) throw new Error("No autenticado.");

  const equipo = await crearEquipo(nombre, user.id);
  await cambiarEquipoActivo(equipo.id);
  redirect("/ajustes");
}

export async function invitarAction(formData: FormData) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede invitar.");

  const email = String(formData.get("email") ?? "").trim();
  if (!email) throw new Error("Falta el email.");

  await invitarAEquipo(equipo.id, email, equipo.userId);
  revalidatePath("/ajustes");
}

export async function eliminarMiembroAction(miembroId: string) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede quitar miembros.");

  await eliminarMiembroDeEquipo(equipo.id, miembroId);
  revalidatePath("/ajustes");
}

export async function cambiarRolMiembroAction(miembroId: string, rol: EquipoRol) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede cambiar roles.");

  await cambiarRolMiembro(equipo.id, miembroId, rol);
  revalidatePath("/ajustes");
}

export async function renombrarEquipoAction(formData: FormData) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede renombrarlo.");

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) throw new Error("El nombre del equipo es obligatorio.");

  await renombrarEquipo(equipo.id, nombre);
  revalidatePath("/ajustes");
}

/**
 * A diferencia del resto de acciones de esta página, esta no exige que
 * `equipoId` sea el equipo activo — se puede eliminar cualquier equipo
 * del que se sea admin directamente desde la lista, sin tener que
 * cambiarse a él primero.
 */
export async function eliminarEquipoAction(equipoId: string) {
  const user = await getUsuarioActual();
  if (!user) throw new Error("No autenticado.");

  const equipos = await listEquiposDeUsuario(user.id);
  const equipo = equipos.find((e) => e.id === equipoId);
  if (!equipo) throw new Error("Ese equipo no existe o no perteneces a él.");
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede eliminarlo.");
  if (equipos.length <= 1) {
    throw new Error("No puedes eliminar tu único equipo — crea o únete a otro primero.");
  }

  await eliminarEquipo(equipoId);
  // Si era el equipo activo, getEquipoActivo() cae automáticamente al
  // primero que quede (ver su propio comentario) — no hace falta tocar
  // la cookie a mano.
  redirect("/ajustes");
}
