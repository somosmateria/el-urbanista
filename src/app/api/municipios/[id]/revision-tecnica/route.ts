import { NextResponse } from "next/server";
import { generarDocxRevisionTecnica, slugificarNombre } from "@/lib/export/docx";
import { getMunicipio, listCapitulosDeMunicipio } from "@/lib/data/municipios";
import { listEvaluacionesDeMunicipio, listAvisosDeMunicipio } from "@/lib/data/evaluacion";
import { listTablasDeMunicipio } from "@/lib/data/tablas";
import { getTitulosReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Documento de trabajo interno (no la Memoria entregable): la puntuación,
 * el desglose y los avisos de cada capítulo (mismo contenido que el panel
 * /revision) más las tablas que el equipo ha ido rellenando — reunido en
 * un solo Word en vez de tener que mirarlo capítulo a capítulo o copiar a
 * mano. Ver generarDocxRevisionTecnica.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) {
    return NextResponse.json({ error: "Municipio no encontrado." }, { status: 404 });
  }

  const capitulos = await listCapitulosDeMunicipio(municipioId, equipo.id);
  const capituloIds = capitulos.map((c) => c.id);

  const [evaluaciones, avisos, tablas, titulosReferencia] = await Promise.all([
    listEvaluacionesDeMunicipio(capituloIds),
    listAvisosDeMunicipio(capituloIds),
    listTablasDeMunicipio(capituloIds),
    getTitulosReferenciaDeEquipo(equipo.id),
  ]);

  const evaluacionPorCapitulo = new Map(evaluaciones.map((e) => [e.capitulo_id, e]));
  const avisosPorCapitulo = new Map<string, typeof avisos>();
  for (const aviso of avisos) {
    avisosPorCapitulo.set(aviso.capitulo_id, [...(avisosPorCapitulo.get(aviso.capitulo_id) ?? []), aviso]);
  }
  const capituloPorId = new Map(capitulos.map((c) => [c.id, c]));

  const filas = capitulos.map((capitulo) => {
    const evaluacion = evaluacionPorCapitulo.get(capitulo.id);
    return {
      codigo: capitulo.codigo,
      titulo: titulosReferencia.get(capitulo.codigo) ?? capitulo.titulo,
      evaluacion: evaluacion
        ? {
            puntuacionTotal: evaluacion.puntuacion_total,
            desglose: evaluacion.desglose,
            problemaPrincipal: evaluacion.problema_principal,
            pendientePrincipal: evaluacion.pendiente_principal,
          }
        : null,
      avisos: (avisosPorCapitulo.get(capitulo.id) ?? []).map((a) => ({
        severidad: a.severidad,
        mensaje: a.mensaje,
        fuente: a.fuente,
        resuelto: a.resuelto,
      })),
    };
  });

  const tablasParaDocx = tablas.map((tabla) => {
    const capitulo = capituloPorId.get(tabla.capitulo_id);
    return {
      capituloCodigo: capitulo?.codigo ?? "?",
      capituloTitulo: capitulo ? (titulosReferencia.get(capitulo.codigo) ?? capitulo.titulo) : "",
      nombreBloque: tabla.nombre_bloque,
      columnas: tabla.columnas,
      filas: tabla.filas,
    };
  });

  const buffer = await generarDocxRevisionTecnica(municipio.nombre, filas, tablasParaDocx);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="revision-tecnica-${slugificarNombre(municipio.nombre)}.docx"`,
    },
  });
}
