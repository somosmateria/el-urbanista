import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generarDocxMunicipio, slugificarNombre } from "@/lib/export/docx";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { getTitulosReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * A diferencia de /docx (un .docx por capítulo dentro de un .zip), esta
 * ruta junta todos los capítulos con contenido en un único Word, en su
 * orden, con salto de página entre capítulos — ver generarDocxMunicipio.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) {
    return NextResponse.json({ error: "Municipio no encontrado." }, { status: 404 });
  }

  const supabase = createServiceClient();
  const { data: capitulos, error: capitulosError } = await supabase
    .from("capitulos")
    .select("*")
    .eq("municipio_id", municipioId)
    .order("orden");
  if (capitulosError) throw capitulosError;

  const conContenido = (capitulos ?? []).filter((c) => c.contenido_html);
  if (conContenido.length === 0) {
    return NextResponse.json({ error: "Todavía no hay ningún capítulo con contenido." }, { status: 404 });
  }

  const titulos = await getTitulosReferenciaDeEquipo(equipo.id);

  const buffer = await generarDocxMunicipio(
    municipio.nombre,
    conContenido.map((c) => ({
      titulo: `${c.codigo} · ${titulos.get(c.codigo) ?? c.titulo}`,
      contenidoHtml: c.contenido_html!,
    }))
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="memoria-ordenacion-${slugificarNombre(municipio.nombre)}.docx"`,
    },
  });
}
