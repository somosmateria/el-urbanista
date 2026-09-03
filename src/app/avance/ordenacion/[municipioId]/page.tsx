import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { ChapterRow } from "@/components/ChapterRow";
import { getMunicipio, listCapitulosDeMunicipio } from "@/lib/data/municipios";

export default async function MunicipioPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const municipio = await getMunicipio(municipioId);
  if (!municipio) notFound();

  const capitulos = await listCapitulosDeMunicipio(municipioId);
  const contables = capitulos.filter((c) => c.sin_info_motivo !== "no_aplica");
  const abiertos = contables.filter((c) => c.estado !== "listo").length;

  return (
    <AppShell
      breadcrumb={`elurbanista.app / avance / ordenacion / ${municipio.nombre.toLowerCase()}`}
    >
      <BackLink href="/avance/ordenacion" />
      <div className="flex items-start justify-between gap-5 mb-8">
        <div>
          <h1 className="font-serif font-medium text-[27px] mb-2">
            {municipio.nombre} — Memoria de ordenación
          </h1>
          <p className="text-text-soft text-[14.5px] max-w-[540px] leading-relaxed">
            Doce capítulos.{" "}
            {abiertos === 0
              ? "Todos cerrados."
              : `${abiertos} ${abiertos === 1 ? "sigue" : "siguen"} abierto${abiertos === 1 ? "" : "s"}.`}
          </p>
        </div>
        <button
          disabled
          title="La descarga se activa cuando los capítulos tengan contenido"
          className="whitespace-nowrap inline-flex items-center bg-violet/40 text-white/70 text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            className="w-3.5 h-3.5 stroke-white mr-1.5"
          >
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
          </svg>
          Descargar todo
        </button>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {capitulos.map((capitulo) => (
          <ChapterRow key={capitulo.id} municipioId={municipio.id} capitulo={capitulo} />
        ))}
      </div>
    </AppShell>
  );
}
