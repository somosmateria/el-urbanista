"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { actualizarMunicipio, eliminarMunicipio, getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { concederAcceso, revocarAcceso } from "@/lib/data/municipio-accesos";

export async function actualizarMunicipioAction(municipioId: string, formData: FormData) {
  const equipo = await requireEquipoActivo();

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    throw new Error("El nombre del municipio es obligatorio.");
  }
  const planVigente = String(formData.get("plan_vigente") ?? "").trim() || null;
  const fechaPlanVigente = String(formData.get("fecha_plan_vigente") ?? "").trim() || null;

  await actualizarMunicipio(municipioId, equipo, { nombre, planVigente, fechaPlanVigente });

  redirect(`/avance/ordenacion/${municipioId}`);
}

export async function eliminarMunicipioAction(municipioId: string) {
  const equipo = await requireEquipoActivo();
  await eliminarMunicipio(municipioId, equipo);
  redirect("/avance/ordenacion");
}

async function requireAdminConAcceso(municipioId: string) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") throw new Error("Solo un admin del equipo puede gestionar accesos.");
  if (!(await getMunicipio(municipioId, equipo))) throw new Error("Municipio no encontrado.");
}

export async function concederAccesoAction(municipioId: string, userId: string) {
  await requireAdminConAcceso(municipioId);
  await concederAcceso(municipioId, userId);
  revalidatePath(`/avance/ordenacion/${municipioId}/editar`);
  revalidatePath("/ajustes");
}

export async function revocarAccesoAction(municipioId: string, userId: string) {
  await requireAdminConAcceso(municipioId);
  await revocarAcceso(municipioId, userId);
  revalidatePath(`/avance/ordenacion/${municipioId}/editar`);
  revalidatePath("/ajustes");
}
