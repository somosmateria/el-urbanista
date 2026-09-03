"use server";

import { redirect } from "next/navigation";
import { actualizarMunicipio, eliminarMunicipio } from "@/lib/data/municipios";

export async function actualizarMunicipioAction(municipioId: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    throw new Error("El nombre del municipio es obligatorio.");
  }
  const planVigente = String(formData.get("plan_vigente") ?? "").trim() || null;
  const fechaPlanVigente = String(formData.get("fecha_plan_vigente") ?? "").trim() || null;

  await actualizarMunicipio(municipioId, { nombre, planVigente, fechaPlanVigente });

  redirect(`/avance/ordenacion/${municipioId}`);
}

export async function eliminarMunicipioAction(municipioId: string) {
  await eliminarMunicipio(municipioId);
  redirect("/avance/ordenacion");
}
