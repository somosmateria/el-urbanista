import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generarDocxCapitulo, nombreArchivoCapitulo } from "@/lib/export/docx";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: capitulo, error } = await supabase
    .from("capitulos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;

  if (!capitulo || !capitulo.contenido_html) {
    return NextResponse.json({ error: "Este capítulo todavía no tiene contenido." }, { status: 404 });
  }

  const buffer = await generarDocxCapitulo(`${capitulo.codigo} — ${capitulo.titulo}`, capitulo.contenido_html);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${nombreArchivoCapitulo(capitulo.codigo)}"`,
    },
  });
}
