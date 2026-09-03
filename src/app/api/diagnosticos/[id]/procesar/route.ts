import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import {
  descargarDiagnosticoDesdeStorage,
  getDiagnosticoPorId,
  guardarSeccionesDiagnostico,
  marcarDiagnosticoError,
  marcarDiagnosticoListo,
} from "@/lib/data/diagnosticos";
import { parseDiagnostico } from "@/lib/diagnostico/parser";

export const runtime = "nodejs";
// Los diagnósticos reales pesan cientos de MB (sobre todo cartografía); la
// extracción de texto de un PDF así de grande puede tardar más que el límite
// por defecto de una función serverless.
export const maxDuration = 300;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: diagnosticoId } = await params;

  const diagnostico = await getDiagnosticoPorId(diagnosticoId);
  if (!diagnostico) {
    return NextResponse.json({ error: "Diagnóstico no encontrado" }, { status: 404 });
  }

  try {
    const buffer = await descargarDiagnosticoDesdeStorage(diagnostico.storage_path);

    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();
    await parser.destroy();

    const secciones = parseDiagnostico(text);
    await guardarSeccionesDiagnostico(diagnosticoId, secciones);
    await marcarDiagnosticoListo(diagnosticoId);

    return NextResponse.json({ ok: true, secciones: secciones.length });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido al procesar el PDF";
    await marcarDiagnosticoError(diagnosticoId, mensaje);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
