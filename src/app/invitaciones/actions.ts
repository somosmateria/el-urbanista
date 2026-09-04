"use server";

import { revalidatePath } from "next/cache";
import {
  getUsuarioActual,
  aceptarInvitacion,
  rechazarInvitacion,
  cambiarEquipoActivo,
} from "@/lib/data/equipos";

async function usuarioActualOFallo() {
  const user = await getUsuarioActual();
  if (!user || !user.email) throw new Error("No autenticado.");
  return { id: user.id, email: user.email };
}

export async function aceptarInvitacionAction(invitacionId: string) {
  const usuario = await usuarioActualOFallo();
  const equipoId = await aceptarInvitacion(invitacionId, usuario);
  // Que quien acepta pase a trabajar en ese equipo de inmediato, no en el
  // que tuviera activo antes (si tenía alguno).
  await cambiarEquipoActivo(equipoId);
  revalidatePath("/");
}

export async function rechazarInvitacionAction(invitacionId: string) {
  const usuario = await usuarioActualOFallo();
  await rechazarInvitacion(invitacionId, usuario);
  revalidatePath("/");
}
