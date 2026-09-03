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
        municipio.
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
            placeholder="Ej. Normas Subsidiarias de 1986"
            className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
          />
        </div>

        <div className="font-mono text-[11px] text-text-faint mb-2">
          DIAGNÓSTICO DE ORIGEN
        </div>
        <div className="rounded-xl border border-line bg-surface overflow-hidden opacity-50">
          <div className="flex items-center justify-between px-[18px] py-4">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-md bg-white/5 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.6}
                  className="w-[19px] h-[19px] stroke-text-soft"
                >
                  <path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M14 3v6h6" />
                </svg>
              </div>
              <div>
                <div className="font-serif text-[15px]">Subir diagnóstico (PDF)</div>
                <div className="text-[12.5px] text-text-faint font-mono">
                  Próximamente en esta versión
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-[30px] inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
        >
          Generar memoria de ordenación
        </button>
      </form>
    </AppShell>
  );
}
