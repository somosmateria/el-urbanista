import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DiagnosticoUploader } from "@/components/DiagnosticoUploader";
import { ReprocesarDiagnosticoBoton } from "@/components/ReprocesarDiagnosticoBoton";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const dynamic = "force-dynamic";

export default async function DiagnosticoPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const [municipio, diagnostico] = await Promise.all([
    getMunicipio(municipioId, equipo),
    getDiagnosticoDeMunicipio(municipioId),
  ]);
  if (!municipio) notFound();

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipioId}`} />
      <div className="max-w-[660px]">
        <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">Diagnóstico</div>
        <h1 className="font-serif font-normal text-[36px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] mb-3.5">
          {municipio.nombre}
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft mb-10">
          Vincula el PDF del diagnóstico de este municipio. Sustituirlo no regenera los
          capítulos por sí solo — hazlo desde &ldquo;Regenerar&rdquo; en cada capítulo que
          dependa de él.
        </p>

        <DiagnosticoUploader municipioId={municipioId} nombreArchivoExistente={diagnostico?.nombre_archivo ?? null} />
        {diagnostico?.estado === "error" && (
          <p className="text-[12px] text-coral-ink mt-2">
            El último intento falló: {diagnostico.error_mensaje}
          </p>
        )}
        {diagnostico?.estado === "listo" && <ReprocesarDiagnosticoBoton diagnosticoId={diagnostico.id} />}
      </div>
    </AppShell>
  );
}
