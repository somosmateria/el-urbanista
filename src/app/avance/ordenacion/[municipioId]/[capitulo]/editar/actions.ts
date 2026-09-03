"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { guardarEdicionCapitulo, restaurarVersion } from "@/lib/data/versiones";

export async function guardarEdicionAction(
  municipioId: string,
  capituloId: string,
  capituloCodigo: string,
  html: string
) {
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
  await restaurarVersion(capituloId, versionId);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
  revalidatePath(`/avance/ordenacion/${municipioId}/${capituloCodigo}/editar`);
}
