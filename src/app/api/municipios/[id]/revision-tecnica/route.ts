import { NextResponse } from "next/server";
import { slugificarNombre } from "@/lib/export/docx";
import { generarDocxRevisionTecnicaDeMunicipio } from "@/lib/export/revision-tecnica";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Documento de trabajo interno (no la Memoria entregable): la puntuación,
 * el desglose y los avisos de cada capítulo (mismo contenido que el panel
 * /revision) más las tablas que el equipo ha ido rellenando. Solo
 * enlazada desde la propia página de Revisión técnica — ver también
 * /api/municipios/[id]/docx, que incluye este mismo documento dentro del
 * .zip "por capítulos".
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) {
    return NextResponse.json({ error: "Municipio no encontrado." }, { status: 404 });
  }

  const buffer = await generarDocxRevisionTecnicaDeMunicipio(municipio, equipo);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="revision-tecnica-${slugificarNombre(municipio.nombre)}.docx"`,
    },
  });
}
