import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { crearMunicipioAction } from "./actions";

export default function NuevoMunicipioPage() {
  return (
    <AppShell breadcrumb="elurbanista.app / avance / ordenacion / nuevo">
      <BackLink href="/avance/ordenacion" />
      <h1 className="font-serif font-medium text-[27px] mb-2">Nuevo municipio</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        La memoria de ordenación se genera a partir del diagnóstico ya redactado de ese
        municipio. En el siguiente paso vinculas el diagnóstico.
      </p>

      <form action={crearMunicipioAction}>
        <div className="rounded-xl border border-line bg-surface p-6 mb-5">
          <label className="block font-mono text-[11px] text-text-faint mb-3">
            NOMBRE DEL MUNICIPIO
          </label>
          <input
            name="nombre"
            required
            type="text"
            placeholder="Ej. Écija"
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
            placeholder="Ej. las Normas Subsidiarias, o el PGOU de 2005"
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
          <p className="text-[11.5px] text-text-faint mt-2">
            Escríbelo con el artículo incluido — se usa tal cual en la frase "Desde la
            aprobación y entrada en vigor de…".
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 mb-5">
          <label className="block font-mono text-[11px] text-text-faint mb-3">
            FECHA DE APROBACIÓN DEL PLAN VIGENTE (OPCIONAL)
          </label>
          <input
            name="fecha_plan_vigente"
            type="date"
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
          <p className="text-[11.5px] text-text-faint mt-2">
            Con el plan vigente y esta fecha, MO.1 se genera solo — sin ellos se queda
            en "Sin información" hasta que se editen a mano.
          </p>
        </div>

        <button
          type="submit"
          className="inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
        >
          Continuar
        </button>
      </form>
    </AppShell>
  );
}
