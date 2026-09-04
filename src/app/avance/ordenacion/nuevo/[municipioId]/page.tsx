import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DiagnosticoUploader } from "@/components/DiagnosticoUploader";
import { GenerarMemoriaBoton } from "@/components/GenerarMemoriaBoton";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { generarMemoriaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NuevoMunicipioDiagnosticoPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) notFound();

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);

  return (
    <AppShell>
      <BackLink href="/avance/ordenacion/nuevo" />
      <div className="max-w-[660px]">
        <h1 className="font-serif font-normal text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-3.5">
          {municipio.nombre}
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft mb-10">
          Vincula el diagnóstico ya redactado de este municipio, o continúa sin él — los
          capítulos que dependen de sus datos quedarán marcados para revisar más tarde.
        </p>

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-3">
          Diagnóstico de origen
        </div>
        <div className="mb-10">
          <DiagnosticoUploader municipioId={municipioId} nombreArchivoExistente={diagnostico?.nombre_archivo ?? null} />
          {diagnostico?.estado === "error" && (
            <p className="text-[12px] text-coral-ink mt-2">
              El último intento falló: {diagnostico.error_mensaje}
            </p>
          )}
        </div>

        <GenerarMemoriaBoton action={generarMemoriaAction.bind(null, municipioId)} />
      </div>
    </AppShell>
  );
}
