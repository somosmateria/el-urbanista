import { NextResponse } from "next/server";
import { iniciarSubidaReferencia } from "@/lib/data/plantilla-referencia";
import { requireEquipoActivo } from "@/lib/data/equipos";

export async function POST(request: Request) {
  const equipo = await requireEquipoActivo();
  if (equipo.rol !== "admin") {
    return NextResponse.json({ error: "Solo un admin del equipo puede subir el Avance de referencia." }, { status: 403 });
  }

  const { nombreArchivo } = await request.json();
  const { referenciaId, path, token } = await iniciarSubidaReferencia(equipo.id, nombreArchivo ?? null);

  return NextResponse.json({ referenciaId, path, token });
}
