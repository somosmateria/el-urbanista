"use server";

import { redirect } from "next/navigation";
import { crearMunicipio } from "@/lib/data/municipios";

export async function crearMunicipioAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    throw new Error("El nombre del municipio es obligatorio.");
  }
  const planVigente = String(formData.get("plan_vigente") ?? "").trim() || null;

  const municipio = await crearMunicipio({ nombre, planVigente });

  redirect(`/avance/ordenacion/nuevo/${municipio.id}`);
}
