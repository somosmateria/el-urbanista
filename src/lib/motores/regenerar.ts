import "server-only";
import { generarCapituloRAG } from "@/lib/motores/rag";
import { PLANTILLAS } from "@/lib/motores/plantilla";
import { getMunicipio, asegurarPlanVigente } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import type { CapituloRow } from "@/lib/supabase/types";

/**
 * Vuelve a ejecutar el motor de un capítulo con los datos actuales
 * (diagnóstico y/o municipio), sin persistir nada — la decisión de
 * aplicar o descartar el resultado es de quien llama (ver
 * docs/03-flujo-de-usuario.md, "volver a generar este capítulo"). Los
 * capítulos de motor "tabla" nunca se regeneran automáticamente.
 */
export async function regenerarContenido(
  capitulo: CapituloRow,
  equipoId: string
): Promise<string | null> {
  let municipio = await getMunicipio(capitulo.municipio_id, equipoId);
  if (!municipio) return null;

  if (capitulo.motor === "rag") {
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    return generarCapituloRAG(capitulo.codigo, diagnosticoId, municipio, capitulo.id);
  }

  if (capitulo.motor === "plantilla") {
    const generador = PLANTILLAS[capitulo.codigo];
    if (!generador) return null;
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    // Municipios ya existentes de antes de que esto se extrajera solos
    // (ver asegurarPlanVigente) también se benefician al darle a
    // "Regenerar" en MO.1.
    municipio = await asegurarPlanVigente(municipio, diagnosticoId);
    return generador(municipio, diagnosticoId);
  }

  return null;
}
