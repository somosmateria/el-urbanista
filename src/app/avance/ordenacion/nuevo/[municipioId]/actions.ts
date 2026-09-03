"use server";

import { redirect } from "next/navigation";
import { generarCapitulosIniciales, getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

export async function generarMemoriaAction(municipioId: string) {
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo.id);
  if (!municipio) throw new Error("Municipio no encontrado.");

  await generarCapitulosIniciales(municipioId, equipo.id);
  redirect(`/avance/ordenacion/${municipioId}`);
}
