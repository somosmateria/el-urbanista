"use server";

import { redirect } from "next/navigation";
import { crearMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

export async function crearMunicipioAction(formData: FormData) {
  const equipo = await requireEquipoActivo();

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    throw new Error("El nombre del municipio es obligatorio.");
  }
  const planVigente = String(formData.get("plan_vigente") ?? "").trim() || null;
  const fechaPlanVigente = String(formData.get("fecha_plan_vigente") ?? "").trim() || null;

  const municipio = await crearMunicipio({ nombre, planVigente, fechaPlanVigente }, equipo);

  redirect(`/avance/ordenacion/nuevo/${municipio.id}`);
}
