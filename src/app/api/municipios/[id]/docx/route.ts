import { NextResponse } from "next/server";
import JSZip from "jszip";
import { createServiceClient } from "@/lib/supabase/server";
import { generarDocxCapitulo, nombreArchivoCapitulo } from "@/lib/export/docx";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

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

  const zip = new JSZip();
  for (const capitulo of conContenido) {
    const buffer = await generarDocxCapitulo(
      `${capitulo.codigo} — ${capitulo.titulo}`,
      capitulo.contenido_html!
    );
    zip.file(nombreArchivoCapitulo(capitulo.codigo), buffer);
  }
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  const nombreArchivo = `memoria-ordenacion-${municipio.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.zip`;

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
