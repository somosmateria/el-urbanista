import { NextResponse } from "next/server";
import {
  getReferenciaPorId,
  descargarReferenciaDesdeStorage,
  guardarSeccionesReferencia,
  marcarReferenciaError,
  marcarReferenciaLista,
} from "@/lib/data/plantilla-referencia";
import { segmentarReferencia } from "@/lib/motores/plantilla/referencia";
import { instalarPolyfillDOMMatrix } from "@/lib/diagnostico/dommatrix-polyfill";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const runtime = "nodejs";
// Nueve llamadas a Claude en paralelo (una por capítulo sustituible), cada
// una con el texto completo del documento (hasta ~1,5M caracteres en un
// Avance real grande) — puede tardar más que el límite por defecto de una
// función serverless. Mismo margen que el procesado de diagnósticos.
export const maxDuration = 300;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: referenciaId } = await params;

  const referencia = await getReferenciaPorId(referenciaId);
  if (!referencia) {
    return NextResponse.json({ error: "Referencia no encontrada" }, { status: 404 });
  }

  const equipo = await requireEquipoActivo();
  if (referencia.equipo_id !== equipo.id || equipo.rol !== "admin") {
    return NextResponse.json({ error: "Referencia no encontrada" }, { status: 404 });
  }

  try {
    instalarPolyfillDOMMatrix();
    const { PDFParse } = await import("pdf-parse");

    const buffer = await descargarReferenciaDesdeStorage(referencia.storage_path);

    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();
    await parser.destroy();

    const secciones = await segmentarReferencia(text);
    // Un documento real de verdad no debería fallar en encontrar NI UNO de
    // los ~26 temas — si pasa, es casi seguro un fallo sistemático (visto
    // en producción: un límite del SDK de Anthropic tiraba las 26 llamadas
    // por igual y esto se marcaba "listo" con 0 filas, sin avisar a nadie).
    // Mejor un error visible que un "listo" que no lo está.
    if (secciones.length === 0) {
      throw new Error(
        "No se identificó ningún capítulo en el PDF — puede que el documento no sea un Avance de Ordenación, o que haya fallado la extracción. Vuelve a intentarlo."
      );
    }

    await guardarSeccionesReferencia(referenciaId, secciones);
    await marcarReferenciaLista(referenciaId);

    return NextResponse.json({ ok: true, capitulos: secciones.length });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido al procesar el PDF";
    await marcarReferenciaError(referenciaId, mensaje);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
