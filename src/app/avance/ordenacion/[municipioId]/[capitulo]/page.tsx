import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DataTableEditor } from "@/components/DataTableEditor";
import { getMunicipio, getCapituloPorCodigo } from "@/lib/data/municipios";
import { listTablasDeCapitulo } from "@/lib/data/tablas";
import { marcarMotivoAction, crearBloqueTablaAction, generarTextoTablaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ municipioId: string; capitulo: string }>;
}) {
  const { municipioId, capitulo: codigo } = await params;
  const municipio = await getMunicipio(municipioId);
  if (!municipio) notFound();

  const capitulo = await getCapituloPorCodigo(municipioId, codigo);
  if (!capitulo) notFound();

  const tablas = capitulo.motor === "tabla" ? await listTablasDeCapitulo(capitulo.id) : [];
  const hayFilas = tablas.some((t) => t.filas.length > 0);

  return (
    <AppShell
      breadcrumb={`elurbanista.app / avance / ordenacion / ${municipio.nombre.toLowerCase()} / ${capitulo.codigo.toLowerCase()}`}
    >
      <BackLink href={`/avance/ordenacion/${municipio.id}`} />
      <h1 className="font-serif font-medium text-[27px] mb-2">
        {capitulo.codigo} — {capitulo.titulo}
      </h1>

      {capitulo.motor === "tabla" && (
        <>
          <p className="text-text-soft text-[14.5px] mb-6 max-w-[540px] leading-relaxed">
            Esta propuesta no está en el diagnóstico. Añade los elementos que definís
            para el municipio.
          </p>

          {capitulo.contenido_html && (
            <div
              className="rounded-xl border border-line bg-surface p-7 mb-6"
              dangerouslySetInnerHTML={{ __html: capitulo.contenido_html }}
            />
          )}

          {tablas.map((tabla) => (
            <DataTableEditor key={tabla.id} municipioId={municipioId} tabla={tabla} />
          ))}

          <form
            action={crearBloqueTablaAction.bind(null, municipioId, capitulo.id)}
            className="flex items-center gap-3 mb-6"
          >
            <input
              name="nombreBloque"
              type="text"
              placeholder="Ej. Áreas recreativas propuestas"
              className="flex-1 box-border bg-surface border border-line-strong rounded-lg px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
            />
            <button
              type="submit"
              className="text-[12.5px] px-3.5 py-2 rounded-lg border border-line-strong text-text-soft hover:bg-surface-hi cursor-pointer whitespace-nowrap"
            >
              + Nuevo bloque de tabla
            </button>
          </form>

          {hayFilas && (
            <form action={generarTextoTablaAction.bind(null, municipioId, capitulo.id)}>
              <button
                type="submit"
                className="inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
              >
                {capitulo.contenido_html ? "Regenerar texto con los cambios" : "Generar texto"}
              </button>
            </form>
          )}
        </>
      )}

      {capitulo.motor !== "tabla" && capitulo.contenido_html && (
        <div
          className="rounded-xl border border-line bg-surface p-7"
          dangerouslySetInnerHTML={{ __html: capitulo.contenido_html }}
        />
      )}

      {capitulo.motor !== "tabla" && !capitulo.contenido_html && (
        <>
          <p className="text-text-soft text-[14.5px] mb-6 max-w-[540px] leading-relaxed">
            {capitulo.sin_info_motivo === "no_aplica"
              ? "Marcado como decisión editorial: este capítulo no aplica o se fusiona con otro para este municipio."
              : "Todavía no se ha generado. La ingesta del diagnóstico y los motores de generación llegan en las siguientes fases del desarrollo."}
          </p>
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="font-mono text-[11px] text-text-faint mb-3">
              SIN INFORMACIÓN / NO APLICA
            </div>
            <p className="text-text-faint text-[13.5px] mb-4">
              ¿Cuál es el motivo? Esto no bloquea el resto del proceso.
            </p>
            <div className="flex gap-3">
              <form action={marcarMotivoAction.bind(null, municipioId, capitulo.id, "falta_dato")}>
                <button
                  type="submit"
                  className={`text-[12.5px] px-3.5 py-2 rounded-lg border ${
                    capitulo.sin_info_motivo === "falta_dato"
                      ? "border-violet bg-violet-wash text-violet-ink"
                      : "border-line-strong text-text-soft hover:bg-surface-hi"
                  }`}
                >
                  Falta un dato real
                </button>
              </form>
              <form action={marcarMotivoAction.bind(null, municipioId, capitulo.id, "no_aplica")}>
                <button
                  type="submit"
                  className={`text-[12.5px] px-3.5 py-2 rounded-lg border ${
                    capitulo.sin_info_motivo === "no_aplica"
                      ? "border-violet bg-violet-wash text-violet-ink"
                      : "border-line-strong text-text-soft hover:bg-surface-hi"
                  }`}
                >
                  No aplica / se fusiona con otro
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
