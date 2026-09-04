"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { guardarEdicionCapitulo, restaurarVersion } from "@/lib/data/versiones";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

export async function guardarEdicionAction(
  municipioId: string,
  capituloId: string,
  capituloCodigo: string,
  html: string
) {
  const equipo = await requireEquipoActivo();
  if (!(await getMunicipio(municipioId, equipo))) throw new Error("Municipio no encontrado.");

  await guardarEdicionCapitulo(capituloId, html);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
  redirect(`/avance/ordenacion/${municipioId}/${capituloCodigo}`);
}

export async function restaurarVersionAction(
  municipioId: string,
  capituloId: string,
  capituloCodigo: string,
  versionId: string
) {
  const equipo = await requireEquipoActivo();
  if (!(await getMunicipio(municipioId, equipo))) throw new Error("Municipio no encontrado.");

  await restaurarVersion(capituloId, versionId);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
  revalidatePath(`/avance/ordenacion/${municipioId}/${capituloCodigo}/editar`);
}
