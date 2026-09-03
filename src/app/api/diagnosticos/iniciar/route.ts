import { NextResponse } from "next/server";
import { iniciarSubidaDiagnostico } from "@/lib/data/diagnosticos";

export async function POST(request: Request) {
  const body = await request.json();
  const municipioId = String(body?.municipioId ?? "");
  if (!municipioId) {
    return NextResponse.json({ error: "Falta municipioId" }, { status: 400 });
  }

  const resultado = await iniciarSubidaDiagnostico(municipioId);
  return NextResponse.json(resultado);
}
