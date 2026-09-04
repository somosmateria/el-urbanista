import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { CapituloEditor } from "@/components/CapituloEditor";
import { HistPanel } from "@/components/HistPanel";
import { getMunicipio, getCapituloPorCodigo } from "@/lib/data/municipios";
import { listVersionesDeCapitulo } from "@/lib/data/versiones";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const dynamic = "force-dynamic";

export default async function EditarCapituloPage({
  params,
}: {
  params: Promise<{ municipioId: string; capitulo: string }>;
}) {
  const { municipioId, capitulo: codigo } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) notFound();

  const capitulo = await getCapituloPorCodigo(municipioId, codigo);
  if (!capitulo || capitulo.motor === "tabla" || !capitulo.contenido_html) notFound();

  const versiones = await listVersionesDeCapitulo(capitulo.id);

  return (
    <AppShell ancho="amplio">
      <BackLink href={`/avance/ordenacion/${municipioId}/${capitulo.codigo}`}>
        Volver sin guardar
      </BackLink>
      <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">
        Editando · {capitulo.codigo}
      </div>
      <h1 className="font-serif font-normal text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.02em] mb-8">
        {capitulo.titulo}
      </h1>

      <div className="flex flex-col sm:flex-row gap-11 items-start">
        <div className="flex-1 min-w-0 w-full">
          <CapituloEditor
            municipioId={municipioId}
            capituloId={capitulo.id}
            capituloCodigo={capitulo.codigo}
            contenidoInicial={capitulo.contenido_html}
          />
        </div>
        <div className="w-[230px] shrink-0">
          <HistPanel
            municipioId={municipioId}
            capituloId={capitulo.id}
            capituloCodigo={capitulo.codigo}
            versiones={versiones}
          />
        </div>
      </div>
    </AppShell>
  );
}
