"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  cambiarEquipoActivo,
  crearEquipo,
  invitarAEquipo,
  eliminarMiembroDeEquipo,
  renombrarEquipo,
  eliminarEquipo,
  listEquiposDeUsuario,
  getUsuarioActual,
  requireEquipoActivo,
} from "@/lib/data/equipos";

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

  await invitarAEquipo(equipo.id, email);
  revalidatePath("/ajustes");
}

export async function eliminarMiembroAction(miembroId: string) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede quitar miembros.");

  await eliminarMiembroDeEquipo(equipo.id, miembroId);
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

export async function eliminarEquipoAction() {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede eliminarlo.");

  const user = await getUsuarioActual();
  if (!user) throw new Error("No autenticado.");
  const equipos = await listEquiposDeUsuario(user.id);
  if (equipos.length <= 1) {
    throw new Error("No puedes eliminar tu único equipo — crea o únete a otro primero.");
  }

  await eliminarEquipo(equipo.id);
  // El equipo activo ya no existe: getEquipoActivo() cae automáticamente
  // al primero que quede (ver su propio comentario), no hace falta tocar
  // la cookie a mano.
  redirect("/ajustes");
}
