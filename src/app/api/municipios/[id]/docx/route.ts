import { NextResponse } from "next/server";
import JSZip from "jszip";
import { createServiceClient } from "@/lib/supabase/server";
import { generarDocxCapitulo, nombreArchivoCapitulo, slugificarNombre } from "@/lib/export/docx";
import { generarDocxRevisionTecnicaDeMunicipio } from "@/lib/export/revision-tecnica";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { getTitulosReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";

export const runtime = "nodejs";
export const maxDuration = 120;

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

  const zip = new JSZip();
  for (const capitulo of conContenido) {
    const buffer = await generarDocxCapitulo(
      `${capitulo.codigo} — ${titulos.get(capitulo.codigo) ?? capitulo.titulo}`,
      capitulo.contenido_html!,
      capitulo.estado === "revisar"
    );
    zip.file(nombreArchivoCapitulo(capitulo.codigo), buffer);
  }

  // Documento de trabajo interno con la puntuación/avisos de cada capítulo
  // y las tablas rellenadas por el equipo — mismo contenido que la
  // descarga suelta desde /revision, incluido aquí también para no tener
  // que volver a la app a por él (ver generarDocxRevisionTecnicaDeMunicipio).
  const bufferRevision = await generarDocxRevisionTecnicaDeMunicipio(municipio, equipo);
  zip.file("revision-tecnica.docx", bufferRevision);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  const nombreArchivo = `memoria-ordenacion-${slugificarNombre(municipio.nombre)}.zip`;

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
