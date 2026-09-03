import { NextResponse } from "next/server";
import { iniciarSubidaDiagnostico } from "@/lib/data/diagnosticos";
import { getMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

export async function POST(request: Request) {
  const body = await request.json();
  const municipioId = String(body?.municipioId ?? "");
  if (!municipioId) {
    return NextResponse.json({ error: "Falta municipioId" }, { status: 400 });
  }

  const equipo = await requireEquipoActivo();
  if (!(await getMunicipio(municipioId, equipo.id))) {
    return NextResponse.json({ error: "Municipio no encontrado" }, { status: 404 });
  }

  const resultado = await iniciarSubidaDiagnostico(municipioId);
  return NextResponse.json(resultado);
}
