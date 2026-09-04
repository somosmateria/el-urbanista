import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { crearMunicipioAction } from "./actions";

export default function NuevoMunicipioPage() {
  return (
    <AppShell>
      <BackLink href="/avance/ordenacion" />
      <div className="max-w-[620px]">
        <h1 className="font-serif font-normal text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-3.5">
          Nuevo municipio
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft mb-10">
          La memoria de ordenación se genera a partir del diagnóstico ya redactado de ese
          municipio. En el siguiente paso vinculas el diagnóstico.
        </p>

        <form action={crearMunicipioAction}>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-line py-6">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Nombre del municipio
            </label>
            <div className="flex-1 w-full">
              <input
                name="nombre"
                required
                type="text"
                placeholder="Ej. Écija"
                className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-line py-6">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Plan vigente <span className="text-line-strong normal-case tracking-normal">(opcional)</span>
            </label>
            <div className="flex-1 w-full">
              <input
                name="plan_vigente"
                type="text"
                placeholder="Ej. las Normas Subsidiarias, o el PGOU de 2005"
                className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
              />
              <p className="text-[11.5px] text-text-faint mt-2 leading-relaxed">
                Escríbelo con el artículo incluido — se usa tal cual en la frase &ldquo;Desde la
                aprobación y entrada en vigor de…&rdquo;.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-b border-line py-6 mb-[34px]">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Fecha de aprobación
            </label>
            <div className="flex-1 w-full">
              <input
                name="fecha_plan_vigente"
                type="date"
                className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
              />
              <p className="text-[11.5px] text-text-faint mt-2 leading-relaxed">
                Con el plan vigente y esta fecha, MO.1 se genera solo — sin ellos se queda
                en &ldquo;Sin información&rdquo; hasta que se editen a mano.
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Continuar →
          </button>
        </form>
      </div>
    </AppShell>
  );
}
