"use server";

import { redirect } from "next/navigation";
import { generarCapitulosIniciales } from "@/lib/data/municipios";

export async function generarMemoriaAction(municipioId: string) {
  await generarCapitulosIniciales(municipioId);
  redirect(`/avance/ordenacion/${municipioId}`);
}
