import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { ChapterRow } from "@/components/ChapterRow";
import { EliminarMunicipioBoton } from "@/components/EliminarMunicipioBoton";
import { ESTADO_UI } from "@/lib/capitulos/estado-ui";
import { getMunicipio, listCapitulosDeMunicipio } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { eliminarMunicipioAction } from "./editar/actions";

export default async function MunicipioPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo.id);
  if (!municipio) notFound();

  const capitulos = await listCapitulosDeMunicipio(municipioId);
  const contables = capitulos.filter((c) => c.sin_info_motivo !== "no_aplica");
  const cerrados = contables.filter((c) => c.estado === "listo").length;
  const abiertos = contables.length - cerrados;
  const pctCerrados = contables.length > 0 ? Math.round((cerrados / contables.length) * 100) : 0;
  const hayAlgoDescargable = capitulos.some((c) => c.contenido_html);

  const estadosPresentes = Array.from(new Set(capitulos.map((c) => c.estado)));

  return (
    <AppShell>
      <BackLink href="/avance/ordenacion" />
      <div className="flex flex-wrap items-start justify-between gap-7 mb-[30px]">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">
            Avance · Memoria de ordenación
          </div>
          <h1 className="font-serif font-normal text-[38px] sm:text-[46px] leading-[1.02] tracking-[-0.025em] mb-3">
            {municipio.nombre}
          </h1>
          <p className="text-[14px] text-text-soft">
            {capitulos.length} capítulos ·{" "}
            {abiertos === 0
              ? "todos cerrados"
              : `${abiertos} ${abiertos === 1 ? "sigue" : "siguen"} abierto${abiertos === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex gap-2.5 flex-none">
          <EliminarMunicipioBoton
            nombreMunicipio={municipio.nombre}
            action={eliminarMunicipioAction.bind(null, municipio.id)}
          />
          <a href={`/avance/ordenacion/${municipio.id}/editar`} className="btn btn-secondary whitespace-nowrap">
            Editar municipio
          </a>
          {hayAlgoDescargable ? (
            <a href={`/api/municipios/${municipio.id}/docx`} className="btn btn-primary whitespace-nowrap">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v5h6" />
                <path d="M12 11.5v6" />
                <path d="m9 14.5 3 3 3-3" />
              </svg>
              Descargar todo
            </a>
          ) : (
            <button
              disabled
              title="La descarga se activa cuando los capítulos tengan contenido"
              className="btn btn-primary whitespace-nowrap"
            >
              Descargar todo
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-b border-line mb-[38px]">
        <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-text-faint shrink-0">
          Cerrados
        </span>
        <span className="flex-1 h-[2px] bg-line relative">
          <span className="absolute inset-y-0 left-0 bg-violet" style={{ width: `${pctCerrados}%` }} />
        </span>
        <span className="font-serif text-[22px] tabular-nums shrink-0">
          {cerrados}
          <span className="text-text-faint">/{contables.length}</span>
        </span>
        <span className="text-[11.5px] tabular-nums text-text-soft shrink-0">{pctCerrados}%</span>
      </div>

      <div className="border-t border-line">
        {capitulos.map((capitulo) => (
          <ChapterRow key={capitulo.id} municipioId={municipio.id} capitulo={capitulo} />
        ))}
      </div>

      <div className="flex flex-wrap gap-[26px] mt-[34px] pt-[18px] border-t border-line">
        {estadosPresentes.map((estado) => {
          const ui = ESTADO_UI[estado];
          return (
            <span key={estado} className="flex items-center gap-2.5 text-[10px] tracking-[0.14em] uppercase text-text-soft">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full border-[1.5px] ${ui.dotColor}`} />
                <span className={ui.ink}>{ui.label}</span>
              </span>
              <span className="text-text-faint normal-case tracking-normal">{ui.desc}</span>
            </span>
          );
        })}
      </div>
    </AppShell>
  );
}
