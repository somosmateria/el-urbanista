"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getMunicipio, listCapitulosDeMunicipio, listOtrosMunicipiosDelEquipo } from "@/lib/data/municipios";
import { listUltimoTipoVersionPorCapitulo } from "@/lib/data/versiones";
import { listTablasDeCapitulo } from "@/lib/data/tablas";
import { listTextosDeCapitulo } from "@/lib/data/textos";
import { regenerarContenido } from "@/lib/motores/regenerar";
import { generarCapituloTabla } from "@/lib/motores/tabla";
import { evaluarYGuardar } from "@/lib/motores/evaluacion";
import { requireEquipoActivo } from "@/lib/data/equipos";
import type { CapituloEstado } from "@/lib/supabase/types";

// El maxDuration para esta Server Action va en memoria/page.tsx, no aquí:
// un archivo "use server" solo puede exportar funciones async — cualquier
// otro export (una constante, un tipo en tiempo de ejecución) rompe el
// build de Next.js.

export type ResultadoRegeneracionMemoria = {
  actualizados: string[];
  sinCambios: string[];
  omitidosPorEdicionManual: string[];
  sinDatos: string[];
};

/**
 * Regenera de golpe todos los capítulos de la memoria con los datos
 * actuales (diagnóstico, Avance de referencia del equipo, tablas/textos
 * del técnico), en vez de tener que entrar capítulo a capítulo — mismo
 * motor que "Regenerar" en cada capítulo (ver regenerarContenido y
 * generarTextoTablaAction en .../[capitulo]/actions.ts), aplicado en
 * cadena a todos los capítulos del municipio.
 *
 * Secuencial, no en paralelo: cada capítulo puede llamar a Claude y una
 * tanda en paralelo de ~12 capítulos dispararía otras tantas llamadas a la
 * vez sin beneficio de caché (ver el aviso sobre esto en
 * motores/plantilla/referencia.ts).
 *
 * Un capítulo con una edición manual como su última versión NUNCA se
 * sobrescribe aquí sin más — se omite y se reporta en
 * `omitidosPorEdicionManual`, igual que RegenerarPanel pide confirmación
 * explícita capítulo a capítulo antes de pisar una edición manual. Una
 * regeneración masiva no es el sitio para pedir esa confirmación una a
 * una, así que por defecto protege el trabajo ya hecho a mano en vez de
 * arriesgarse a perderlo.
 */
export async function regenerarMemoriaAction(municipioId: string): Promise<ResultadoRegeneracionMemoria> {
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) throw new Error("Municipio no encontrado.");

  const capitulos = await listCapitulosDeMunicipio(municipioId, equipo.id);
  const tiposUltimaVersion = await listUltimoTipoVersionPorCapitulo(capitulos.map((c) => c.id));
  const otrosMunicipios = await listOtrosMunicipiosDelEquipo(equipo.id, municipioId);
  const supabase = createServiceClient();

  const resultado: ResultadoRegeneracionMemoria = {
    actualizados: [],
    sinCambios: [],
    omitidosPorEdicionManual: [],
    sinDatos: [],
  };

  for (const capitulo of capitulos) {
    let contenidoNuevo: string | null;
    let necesitaRevision: boolean;
    let estadoTrasGenerar: CapituloEstado;

    if (capitulo.motor === "tabla") {
      const [tablas, textos] = await Promise.all([
        listTablasDeCapitulo(capitulo.id),
        listTextosDeCapitulo(capitulo.id),
      ]);
      const hayFilas = tablas.some((t) => t.filas.length > 0) || textos.some((t) => t.contenido_html.trim() !== "");
      if (!hayFilas) {
        resultado.sinDatos.push(capitulo.codigo);
        continue;
      }
      contenidoNuevo = await generarCapituloTabla(tablas, textos);
      necesitaRevision = false;
      estadoTrasGenerar = "listo";
    } else {
      const regeneracion = await regenerarContenido(capitulo, equipo);
      contenidoNuevo = regeneracion.contenido;
      necesitaRevision = regeneracion.necesitaRevision;
      estadoTrasGenerar = necesitaRevision ? "revisar" : "listo";
    }

    if (!contenidoNuevo) {
      resultado.sinDatos.push(capitulo.codigo);
      continue;
    }
    if (contenidoNuevo.trim() === (capitulo.contenido_html ?? "").trim()) {
      resultado.sinCambios.push(capitulo.codigo);
      continue;
    }
    if (tiposUltimaVersion.get(capitulo.id) === "edicion_manual") {
      resultado.omitidosPorEdicionManual.push(capitulo.codigo);
      continue;
    }

    const { error: updateError } = await supabase
      .from("capitulos")
      .update({ contenido_html: contenidoNuevo, estado: estadoTrasGenerar, sin_info_motivo: null })
      .eq("id", capitulo.id);
    if (updateError) throw updateError;

    const { error: versionError } = await supabase.from("capitulo_versiones").insert({
      capitulo_id: capitulo.id,
      contenido_html: contenidoNuevo,
      tipo: "generacion_automatica",
    });
    if (versionError) throw versionError;

    await evaluarYGuardar(
      { id: capitulo.id, codigo: capitulo.codigo, motor: capitulo.motor, estado: estadoTrasGenerar, contenido_html: contenidoNuevo },
      municipio,
      otrosMunicipios,
      equipo.id
    ).catch((err: unknown) => console.error(`Evaluación técnica de ${capitulo.codigo} falló:`, err));

    resultado.actualizados.push(capitulo.codigo);
  }

  revalidatePath(`/avance/ordenacion/${municipioId}`);
  revalidatePath(`/avance/ordenacion/${municipioId}/memoria`);
  revalidatePath(`/avance/ordenacion/${municipioId}/revision`);
  for (const capitulo of capitulos) {
    revalidatePath(`/avance/ordenacion/${municipioId}/${capitulo.codigo}`);
  }

  return resultado;
}
