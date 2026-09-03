import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DiagnosticoUploader } from "@/components/DiagnosticoUploader";
import { EliminarMunicipioBoton } from "@/components/EliminarMunicipioBoton";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { actualizarMunicipioAction, eliminarMunicipioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditarMunicipioPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const municipio = await getMunicipio(municipioId);
  if (!municipio) notFound();

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);

  return (
    <AppShell
      breadcrumb={`elurbanista.app / avance / ordenacion / ${municipio.nombre.toLowerCase()} / editar`}
    >
      <BackLink href={`/avance/ordenacion/${municipioId}`} />
      <h1 className="font-serif font-medium text-[27px] mb-2">Editar {municipio.nombre}</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        Cambia los datos del municipio o sustituye el diagnóstico. Sustituir el
        diagnóstico no regenera los capítulos por sí solo — hazlo desde
        &ldquo;Regenerar&rdquo; en cada capítulo que dependa de él.
      </p>

      <form action={actualizarMunicipioAction.bind(null, municipioId)}>
        <div className="rounded-xl border border-line bg-surface p-6 mb-5">
          <label className="block font-mono text-[11px] text-text-faint mb-3">
            NOMBRE DEL MUNICIPIO
          </label>
          <input
            name="nombre"
            required
            type="text"
            defaultValue={municipio.nombre}
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 mb-5">
          <label className="block font-mono text-[11px] text-text-faint mb-3">
            PLAN VIGENTE (OPCIONAL)
          </label>
          <input
            name="plan_vigente"
            type="text"
            defaultValue={municipio.plan_vigente ?? ""}
            placeholder="Ej. las Normas Subsidiarias, o el PGOU de 2005"
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 mb-5">
          <label className="block font-mono text-[11px] text-text-faint mb-3">
            FECHA DE APROBACIÓN DEL PLAN VIGENTE (OPCIONAL)
          </label>
          <input
            name="fecha_plan_vigente"
            type="date"
            defaultValue={municipio.fecha_plan_vigente ?? ""}
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
        </div>

        <button
          type="submit"
          className="inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
        >
          Guardar cambios
        </button>
      </form>

      <div className="font-mono text-[11px] text-text-faint mt-10 mb-2">DIAGNÓSTICO DE ORIGEN</div>
      <div className="mb-10">
        <DiagnosticoUploader municipioId={municipioId} yaHayDiagnostico={diagnostico !== null} />
        {diagnostico?.estado === "error" && (
          <p className="text-[12px] text-coral-ink mt-2">
            El último intento falló: {diagnostico.error_mensaje}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-coral/40 bg-coral-wash p-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] text-coral-ink mb-1">ZONA DE PELIGRO</div>
          <p className="text-[13px] text-text-soft max-w-[440px] leading-relaxed">
            Elimina el municipio, sus capítulos, historial y diagnóstico. No se puede
            deshacer.
          </p>
        </div>
        <EliminarMunicipioBoton action={eliminarMunicipioAction.bind(null, municipioId)} />
      </div>
    </AppShell>
  );
}
