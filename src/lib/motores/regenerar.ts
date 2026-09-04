import "server-only";
import { generarCapituloRAG } from "@/lib/motores/rag";
import { resolverPlantilla } from "@/lib/motores/plantilla";
import { getMunicipio, asegurarPlanVigente } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import type { CapituloRow } from "@/lib/supabase/types";
import type { EquipoActivo } from "@/lib/data/equipos";

export type Regeneracion = { contenido: string | null; necesitaRevision: boolean };

/**
 * Vuelve a ejecutar el motor de un capítulo con los datos actuales
 * (diagnóstico y/o municipio), sin persistir nada — la decisión de
 * aplicar o descartar el resultado es de quien llama (ver
 * docs/03-flujo-de-usuario.md, "volver a generar este capítulo"). Los
 * capítulos de motor "tabla" nunca se regeneran automáticamente.
 */
export async function regenerarContenido(capitulo: CapituloRow, equipo: EquipoActivo): Promise<Regeneracion> {
  let municipio = await getMunicipio(capitulo.municipio_id, equipo);
  if (!municipio) return { contenido: null, necesitaRevision: false };

  if (capitulo.motor === "rag") {
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    const contenido = await generarCapituloRAG(capitulo.codigo, diagnosticoId, municipio, equipo.id, capitulo.id);
    return { contenido, necesitaRevision: true };
  }

  if (capitulo.motor === "plantilla") {
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    // Municipios ya existentes de antes de que esto se extrajera solos
    // (ver asegurarPlanVigente) también se benefician al darle a
    // "Regenerar" en MO.1.
    municipio = await asegurarPlanVigente(municipio, diagnosticoId);
    return resolverPlantilla(capitulo.codigo, municipio, diagnosticoId, equipo.id);
  }

  return { contenido: null, necesitaRevision: false };
}
