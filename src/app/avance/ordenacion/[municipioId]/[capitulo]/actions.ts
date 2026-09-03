"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { SinInfoMotivo } from "@/lib/supabase/types";
import { crearBloqueTabla, guardarTabla, listTablasDeCapitulo } from "@/lib/data/tablas";
import { generarCapituloTabla } from "@/lib/motores/tabla";

export async function marcarMotivoAction(
  municipioId: string,
  capituloId: string,
  motivo: SinInfoMotivo
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("capitulos")
    .update({ sin_info_motivo: motivo })
    .eq("id", capituloId);
  if (error) throw error;

  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function crearBloqueTablaAction(
  municipioId: string,
  capituloId: string,
  formData: FormData
) {
  const nombre = String(formData.get("nombreBloque") ?? "").trim();
  if (!nombre) return;
  await crearBloqueTabla(capituloId, nombre);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function guardarTablaAction(
  municipioId: string,
  tablaId: string,
  columnas: string[],
  filas: Record<string, string>[]
) {
  await guardarTabla(tablaId, columnas, filas);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function generarTextoTablaAction(municipioId: string, capituloId: string) {
  const tablas = await listTablasDeCapitulo(capituloId);
  const contenido = await generarCapituloTabla(tablas);
  if (!contenido) return;

  const supabase = createServiceClient();
  const { error: updateError } = await supabase
    .from("capitulos")
    .update({ estado: "listo", contenido_html: contenido })
    .eq("id", capituloId);
  if (updateError) throw updateError;

  const { error: versionError } = await supabase.from("capitulo_versiones").insert({
    capitulo_id: capituloId,
    contenido_html: contenido,
    tipo: "generacion_automatica",
  });
  if (versionError) throw versionError;

  revalidatePath(`/avance/ordenacion/${municipioId}`);
}
