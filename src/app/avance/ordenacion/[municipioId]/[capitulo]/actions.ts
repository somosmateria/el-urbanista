"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { SinInfoMotivo } from "@/lib/supabase/types";
import {
  crearBloqueTabla,
  guardarTabla,
  eliminarBloqueTabla,
  listTablasDeCapitulo,
  getCapituloIdDeTabla,
} from "@/lib/data/tablas";
import { generarCapituloTabla } from "@/lib/motores/tabla";
import { regenerarContenido } from "@/lib/motores/regenerar";
import { PLANTILLAS_QUE_NECESITAN_REVISION } from "@/lib/motores/plantilla";
import { verificarCapituloDeEquipo } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import type { CapituloEstado } from "@/lib/supabase/types";

export async function marcarMotivoAction(
  municipioId: string,
  capituloId: string,
  motivo: SinInfoMotivo
) {
  const equipo = await requireEquipoActivo();
  if (!(await verificarCapituloDeEquipo(capituloId, equipo))) {
    throw new Error("Capítulo no encontrado.");
  }

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
  subepigrafeCodigo: string | null,
  formData: FormData
) {
  const equipo = await requireEquipoActivo();
  if (!(await verificarCapituloDeEquipo(capituloId, equipo))) {
    throw new Error("Capítulo no encontrado.");
  }

  const nombre = String(formData.get("nombreBloque") ?? "").trim();
  if (!nombre) return;
  await crearBloqueTabla(capituloId, nombre, subepigrafeCodigo);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function eliminarBloqueTablaAction(municipioId: string, tablaId: string) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTabla(tablaId);
  if (!capituloId || !(await verificarCapituloDeEquipo(capituloId, equipo))) {
    throw new Error("Tabla no encontrada.");
  }

  await eliminarBloqueTabla(tablaId);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function guardarTablaAction(
  municipioId: string,
  tablaId: string,
  columnas: string[],
  filas: Record<string, string>[]
) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTabla(tablaId);
  if (!capituloId || !(await verificarCapituloDeEquipo(capituloId, equipo))) {
    throw new Error("Tabla no encontrada.");
  }

  await guardarTabla(tablaId, columnas, filas);
  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

/**
 * Calcula qué produciría el motor de este capítulo ahora mismo, sin guardar
 * nada — quien llama decide si aplicarlo o descartarlo (ver
 * docs/03-flujo-de-usuario.md, "Regenerar desde el origen").
 */
export async function previsualizarRegeneracionAction(capituloId: string) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const contenidoNuevo = await regenerarContenido(capitulo, equipo);
  if (!contenidoNuevo) {
    return { disponible: false as const };
  }

  if (contenidoNuevo.trim() === (capitulo.contenido_html ?? "").trim()) {
    return { disponible: true as const, sinCambios: true as const };
  }

  const supabase = createServiceClient();
  const { data: ultimaVersion, error: versionError } = await supabase
    .from("capitulo_versiones")
    .select("tipo")
    .eq("capitulo_id", capituloId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (versionError) throw versionError;

  return {
    disponible: true as const,
    sinCambios: false as const,
    hayEdicionesManuales: ultimaVersion?.tipo === "edicion_manual",
    contenidoActual: capitulo.contenido_html,
    contenidoNuevo,
  };
}

export async function aplicarRegeneracionAction(
  municipioId: string,
  capituloId: string,
  contenidoNuevo: string
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const necesitaRevision =
    capitulo.motor === "rag" || PLANTILLAS_QUE_NECESITAN_REVISION.has(capitulo.codigo);
  const estado: CapituloEstado = necesitaRevision ? "revisar" : "listo";

  const supabase = createServiceClient();
  const { error: updateError } = await supabase
    .from("capitulos")
    .update({ contenido_html: contenidoNuevo, estado, sin_info_motivo: null })
    .eq("id", capituloId);
  if (updateError) throw updateError;

  const { error: versionError } = await supabase.from("capitulo_versiones").insert({
    capitulo_id: capituloId,
    contenido_html: contenidoNuevo,
    tipo: "generacion_automatica",
  });
  if (versionError) throw versionError;

  revalidatePath(`/avance/ordenacion/${municipioId}`);
}

export async function generarTextoTablaAction(municipioId: string, capituloId: string) {
  const equipo = await requireEquipoActivo();
  if (!(await verificarCapituloDeEquipo(capituloId, equipo))) {
    throw new Error("Capítulo no encontrado.");
  }

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
