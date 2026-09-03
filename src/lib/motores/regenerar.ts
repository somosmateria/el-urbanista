import "server-only";
import { generarCapituloRAG } from "@/lib/motores/rag";
import { PLANTILLAS } from "@/lib/motores/plantilla";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import type { CapituloRow } from "@/lib/supabase/types";

/**
 * Vuelve a ejecutar el motor de un capítulo con los datos actuales
 * (diagnóstico y/o municipio), sin persistir nada — la decisión de
 * aplicar o descartar el resultado es de quien llama (ver
 * docs/03-flujo-de-usuario.md, "volver a generar este capítulo"). Los
 * capítulos de motor "tabla" nunca se regeneran automáticamente.
 */
export async function regenerarContenido(capitulo: CapituloRow): Promise<string | null> {
  const municipio = await getMunicipio(capitulo.municipio_id);
  if (!municipio) return null;

  if (capitulo.motor === "rag") {
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    return generarCapituloRAG(capitulo.codigo, diagnosticoId, municipio);
  }

  if (capitulo.motor === "plantilla") {
    const generador = PLANTILLAS[capitulo.codigo];
    if (!generador) return null;
    const diagnostico = await getDiagnosticoDeMunicipio(capitulo.municipio_id);
    const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
    return generador(municipio, diagnosticoId);
  }

  return null;
}
