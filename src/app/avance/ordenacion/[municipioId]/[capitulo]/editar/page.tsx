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
  const municipio = await getMunicipio(municipioId, equipo.id);
  if (!municipio) notFound();

  const capitulo = await getCapituloPorCodigo(municipioId, codigo);
  if (!capitulo || capitulo.motor === "tabla" || !capitulo.contenido_html) notFound();

  const versiones = await listVersionesDeCapitulo(capitulo.id);

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipioId}/${capitulo.codigo}`}>
        Volver sin guardar
      </BackLink>
      <h1 className="font-serif font-medium text-[27px] mb-2">
        {capitulo.codigo} — {capitulo.titulo}
      </h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        Cada vez que guardas, la versión anterior se conserva en el historial.
      </p>

      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
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
