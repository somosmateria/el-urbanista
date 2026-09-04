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
import {
  crearBloqueTexto,
  guardarTexto,
  eliminarBloqueTexto,
  listTextosDeCapitulo,
  getCapituloIdDeTexto,
} from "@/lib/data/textos";
import { generarCapituloTabla } from "@/lib/motores/tabla";
import { regenerarContenido } from "@/lib/motores/regenerar";
import { verificarCapituloDeEquipo } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { asignarCapitulo } from "@/lib/data/tareas";
import type { CapituloEstado } from "@/lib/supabase/types";

// El semáforo y la propia página del capítulo son rutas distintas —
// revalidar solo la primera dejaba la segunda con datos obsoletos hasta
// un refresco manual (p.ej. un bloque de tabla recién creado que no
// aparecía). Revalidar las dos siempre que se toca un capítulo.
function revalidarCapitulo(municipioId: string, codigo: string) {
  revalidatePath(`/avance/ordenacion/${municipioId}`);
  revalidatePath(`/avance/ordenacion/${municipioId}/${codigo}`);
}

export async function marcarMotivoAction(
  municipioId: string,
  capituloId: string,
  motivo: SinInfoMotivo
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("capitulos")
    .update({ sin_info_motivo: motivo })
    .eq("id", capituloId);
  if (error) throw error;

  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function asignarCapituloAction(
  municipioId: string,
  capituloId: string,
  usuarioId: string | null
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await asignarCapitulo(capituloId, equipo, usuarioId);
  revalidarCapitulo(municipioId, capitulo.codigo);
  revalidatePath("/tareas");
}

export async function crearBloqueTablaAction(
  municipioId: string,
  capituloId: string,
  subepigrafeCodigo: string | null,
  formData: FormData
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const nombre = String(formData.get("nombreBloque") ?? "").trim();
  if (!nombre) return;
  await crearBloqueTabla(capituloId, nombre, subepigrafeCodigo);
  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function eliminarBloqueTablaAction(municipioId: string, tablaId: string) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTabla(tablaId);
  const capitulo = capituloId ? await verificarCapituloDeEquipo(capituloId, equipo) : null;
  if (!capitulo) throw new Error("Tabla no encontrada.");

  await eliminarBloqueTabla(tablaId);
  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function guardarTablaAction(
  municipioId: string,
  tablaId: string,
  columnas: string[],
  filas: Record<string, string>[]
) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTabla(tablaId);
  const capitulo = capituloId ? await verificarCapituloDeEquipo(capituloId, equipo) : null;
  if (!capitulo) throw new Error("Tabla no encontrada.");

  await guardarTabla(tablaId, columnas, filas);
  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function crearBloqueTextoAction(
  municipioId: string,
  capituloId: string,
  subepigrafeCodigo: string | null,
  formData: FormData
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const titulo = String(formData.get("tituloBloque") ?? "").trim();
  if (!titulo) return;
  await crearBloqueTexto(capituloId, titulo, subepigrafeCodigo);
  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function guardarTextoAction(municipioId: string, textoId: string, contenidoHtml: string) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTexto(textoId);
  const capitulo = capituloId ? await verificarCapituloDeEquipo(capituloId, equipo) : null;
  if (!capitulo) throw new Error("Bloque de texto no encontrado.");

  await guardarTexto(textoId, contenidoHtml);
  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function eliminarBloqueTextoAction(municipioId: string, textoId: string) {
  const equipo = await requireEquipoActivo();
  const capituloId = await getCapituloIdDeTexto(textoId);
  const capitulo = capituloId ? await verificarCapituloDeEquipo(capituloId, equipo) : null;
  if (!capitulo) throw new Error("Bloque de texto no encontrado.");

  await eliminarBloqueTexto(textoId);
  revalidarCapitulo(municipioId, capitulo.codigo);
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

  const { contenido: contenidoNuevo, necesitaRevision } = await regenerarContenido(capitulo, equipo);
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
    necesitaRevision,
  };
}

export async function aplicarRegeneracionAction(
  municipioId: string,
  capituloId: string,
  contenidoNuevo: string,
  necesitaRevision: boolean
) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

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

  revalidarCapitulo(municipioId, capitulo.codigo);
}

export async function generarTextoTablaAction(municipioId: string, capituloId: string) {
  const equipo = await requireEquipoActivo();
  const capitulo = await verificarCapituloDeEquipo(capituloId, equipo);
  if (!capitulo) throw new Error("Capítulo no encontrado.");

  const [tablas, textos] = await Promise.all([
    listTablasDeCapitulo(capituloId),
    listTextosDeCapitulo(capituloId),
  ]);
  const contenido = await generarCapituloTabla(tablas, textos);
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

  revalidarCapitulo(municipioId, capitulo.codigo);
}
