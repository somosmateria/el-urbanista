import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { getMunicipio, getCapituloPorCodigo } from "@/lib/data/municipios";
import { marcarMotivoAction } from "./actions";

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
          <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
            Esta propuesta no está en el diagnóstico. Añade los elementos que definís
            para el municipio.
          </p>
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="font-mono text-[11px] text-text-faint mb-3">
              TABLA DE PROPUESTA TÉCNICA
            </div>
            <p className="text-text-faint text-[13.5px]">
              El editor de tabla (añadir filas/columnas y bloques) llega en la siguiente
              fase del desarrollo. Por ahora este capítulo se queda en “Tu aportación”
              hasta entonces.
            </p>
          </div>
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
