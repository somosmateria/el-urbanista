import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DiagnosticoUploader } from "@/components/DiagnosticoUploader";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { generarMemoriaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NuevoMunicipioDiagnosticoPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const municipio = await getMunicipio(municipioId);
  if (!municipio) notFound();

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);

  return (
    <AppShell breadcrumb="elurbanista.app / avance / ordenacion / nuevo">
      <BackLink href="/avance/ordenacion/nuevo" />
      <h1 className="font-serif font-medium text-[27px] mb-2">{municipio.nombre}</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        Vincula el diagnóstico ya redactado de este municipio, o continúa sin él — los
        capítulos que dependen de datos del diagnóstico se marcarán para revisar más
        tarde.
      </p>

      <div className="font-mono text-[11px] text-text-faint mb-2">DIAGNÓSTICO DE ORIGEN</div>
      <div className="mb-5">
        <DiagnosticoUploader municipioId={municipioId} yaHayDiagnostico={diagnostico !== null} />
        {diagnostico?.estado === "error" && (
          <p className="text-[12px] text-coral-ink mt-2">
            El último intento falló: {diagnostico.error_mensaje}
          </p>
        )}
      </div>

      <form action={generarMemoriaAction.bind(null, municipioId)}>
        <button
          type="submit"
          className="inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
        >
          Generar memoria de ordenación
        </button>
      </form>
    </AppShell>
  );
}
