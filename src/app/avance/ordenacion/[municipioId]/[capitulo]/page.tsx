import { notFound } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DataTableEditor } from "@/components/DataTableEditor";
import { TextoBlockEditor } from "@/components/TextoBlockEditor";
import { RegenerarPanel } from "@/components/RegenerarPanel";
import { EstadoPill } from "@/components/EstadoPill";
import { getMunicipio, getCapituloPorCodigo } from "@/lib/data/municipios";
import { listTablasDeCapitulo } from "@/lib/data/tablas";
import { listTextosDeCapitulo } from "@/lib/data/textos";
import { getSubepigrafes } from "@/lib/data/mapeo";
import { requireEquipoActivo } from "@/lib/data/equipos";
import {
  marcarMotivoAction,
  crearBloqueTablaAction,
  crearBloqueTextoAction,
  generarTextoTablaAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ municipioId: string; capitulo: string }>;
}) {
  const { municipioId, capitulo: codigo } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) notFound();

  const capitulo = await getCapituloPorCodigo(municipioId, codigo);
  if (!capitulo) notFound();

  const tablas = capitulo.motor === "tabla" ? await listTablasDeCapitulo(capitulo.id) : [];
  const textos = capitulo.motor === "tabla" ? await listTextosDeCapitulo(capitulo.id) : [];
  const hayFilas = tablas.some((t) => t.filas.length > 0) || textos.some((t) => t.contenido_html.trim() !== "");
  const MOTOR_LABEL: Record<string, string> = {
    plantilla: "Plantilla",
    rag: "RAG dirigido",
    tabla: "Motor asistido por tabla",
  };

  // Un capítulo mixto (p.ej. MO.3) puede tener subepígrafes de motor
  // "tabla" propios, aparte del motor del capítulo en sí (rag/plantilla).
  const subepigrafesDeTabla =
    capitulo.motor !== "tabla" ? (await getSubepigrafes(capitulo.codigo)).filter((s) => s.motor === "tabla") : [];
  const tablasPorSubepigrafe = await Promise.all(
    subepigrafesDeTabla.map((s) => listTablasDeCapitulo(capitulo.id, s.capitulo_codigo))
  );
  const textosPorSubepigrafe = await Promise.all(
    subepigrafesDeTabla.map((s) => listTextosDeCapitulo(capitulo.id, s.capitulo_codigo))
  );

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipio.id}`} />
      <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-4">
        {municipio.nombre} · {capitulo.codigo}
      </div>
      <h1 className="font-serif font-normal text-[32px] sm:text-[42px] leading-[1.08] tracking-[-0.02em] mb-4 max-w-[780px]">
        {capitulo.titulo}
      </h1>

      <div className="flex flex-wrap items-center gap-[18px] py-3.5 border-t border-b border-line mb-8">
        <EstadoPill estado={capitulo.estado} />
        <span className="text-[10.5px] tracking-[0.14em] uppercase text-text-faint">
          {MOTOR_LABEL[capitulo.motor]}
        </span>
        <span className="flex-1" />
        <span className="flex gap-2.5 flex-wrap">
          {capitulo.motor !== "tabla" && capitulo.contenido_html && (
            <a href={`/api/capitulos/${capitulo.id}/docx`} className="btn btn-secondary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v5h6" />
                <path d="M12 11.5v6" />
                <path d="m9 14.5 3 3 3-3" />
              </svg>
              Descargar .docx
            </a>
          )}
          {capitulo.motor !== "tabla" && capitulo.contenido_html && (
            <Link href={`/avance/ordenacion/${municipioId}/${capitulo.codigo}/editar`} className="btn btn-primary">
              Editar
            </Link>
          )}
        </span>
      </div>

      {capitulo.motor !== "tabla" && capitulo.contenido_html && (
        <p className="text-text-soft text-[13.5px] mb-[26px] max-w-[560px] leading-relaxed">
          {capitulo.estado === "revisar"
            ? "Redactado a partir del diagnóstico. Lo resaltado viene citado de allí — confírmalo antes de cerrar el capítulo."
            : "Listo para entregar. Puedes editarlo igualmente si quieres matizar algo."}
        </p>
      )}

      {capitulo.motor === "tabla" && (
        <>
          <p className="text-text-soft text-[13.5px] mb-[26px] max-w-[560px] leading-relaxed">
            Esta propuesta no está en el diagnóstico. Añade los elementos que definís
            para el municipio.
          </p>

          {capitulo.contenido_html && (
            <div
              className="pageblock border border-line p-7 mb-6"
              dangerouslySetInnerHTML={{ __html: capitulo.contenido_html }}
            />
          )}

          {tablas.map((tabla) => (
            <DataTableEditor key={tabla.id} municipioId={municipioId} tabla={tabla} />
          ))}
          {textos.map((texto) => (
            <TextoBlockEditor key={texto.id} municipioId={municipioId} texto={texto} />
          ))}

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <form action={crearBloqueTablaAction.bind(null, municipioId, capitulo.id, null)} className="flex items-center gap-3">
              <input
                name="nombreBloque"
                type="text"
                placeholder="Ej. Áreas recreativas propuestas"
                className="box-border bg-transparent border border-line rounded px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
              />
              <button type="submit" className="btn btn-secondary whitespace-nowrap">
                + Nueva tabla
              </button>
            </form>
            <form action={crearBloqueTextoAction.bind(null, municipioId, capitulo.id, null)} className="flex items-center gap-3">
              <input
                name="tituloBloque"
                type="text"
                placeholder="Ej. Justificación de la propuesta"
                className="box-border bg-transparent border border-line rounded px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
              />
              <button type="submit" className="btn btn-secondary whitespace-nowrap">
                + Nuevo texto
              </button>
            </form>
          </div>

          {hayFilas && (
            <form action={generarTextoTablaAction.bind(null, municipioId, capitulo.id)}>
              <button type="submit" className="btn btn-primary">
                {capitulo.contenido_html ? "Regenerar texto con los cambios" : "Generar texto"}
              </button>
            </form>
          )}
        </>
      )}

      {capitulo.motor !== "tabla" && capitulo.contenido_html && (
        <>
          <div
            className="pageblock border border-line p-[52px] px-8 sm:px-14"
            dangerouslySetInnerHTML={{ __html: capitulo.contenido_html }}
          />
          <RegenerarPanel municipioId={municipioId} capituloId={capitulo.id} />
        </>
      )}

      {capitulo.motor !== "tabla" && !capitulo.contenido_html && (
        <>
          <p className="text-text-soft text-[13.5px] mb-6 max-w-[540px] leading-relaxed">
            {capitulo.sin_info_motivo === "no_aplica"
              ? "Marcado como decisión editorial: este capítulo no aplica o se fusiona con otro para este municipio."
              : "Todavía no se ha generado. La ingesta del diagnóstico y los motores de generación llegan en las siguientes fases del desarrollo."}
          </p>
          <div className="pageblock border border-line p-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-3">
              Sin información / no aplica
            </div>
            <p className="text-text-faint text-[13.5px] mb-4">
              ¿Cuál es el motivo? Esto no bloquea el resto del proceso.
            </p>
            <div className="flex gap-3">
              <form action={marcarMotivoAction.bind(null, municipioId, capitulo.id, "falta_dato")}>
                <button
                  type="submit"
                  className={clsx(
                    "btn",
                    capitulo.sin_info_motivo === "falta_dato" ? "btn-primary" : "btn-secondary"
                  )}
                >
                  Falta un dato real
                </button>
              </form>
              <form action={marcarMotivoAction.bind(null, municipioId, capitulo.id, "no_aplica")}>
                <button
                  type="submit"
                  className={clsx(
                    "btn",
                    capitulo.sin_info_motivo === "no_aplica" ? "btn-primary" : "btn-secondary"
                  )}
                >
                  No aplica / se fusiona con otro
                </button>
              </form>
            </div>
          </div>
          <RegenerarPanel
            municipioId={municipioId}
            capituloId={capitulo.id}
            etiqueta="Generar desde los datos actuales"
          />
        </>
      )}

      {subepigrafesDeTabla.length > 0 && (
        <div className="mt-10">
          <div className="font-mono text-[11px] text-text-faint mb-1">
            PROPUESTA DEL TÉCNICO (NO VIENE DEL DIAGNÓSTICO)
          </div>
          <p className="text-text-soft text-[14.5px] mb-6 max-w-[540px] leading-relaxed">
            Estos subepígrafes de {capitulo.codigo} son propuesta técnica, no
            reformateo del diagnóstico. Rellena las tablas y luego usa
            &ldquo;Regenerar&rdquo; arriba para incorporarlas al capítulo.
          </p>

          {subepigrafesDeTabla.map((s, i) => (
            <div key={s.capitulo_codigo} className="mb-8">
              <h3 className="font-serif text-[16px] mb-3">
                {s.capitulo_codigo.replace(/^MO\./, "")} · {s.titulo_canonico}
              </h3>

              {tablasPorSubepigrafe[i].map((tabla) => (
                <DataTableEditor key={tabla.id} municipioId={municipioId} tabla={tabla} />
              ))}
              {textosPorSubepigrafe[i].map((texto) => (
                <TextoBlockEditor key={texto.id} municipioId={municipioId} texto={texto} />
              ))}

              <div className="flex flex-wrap items-center gap-3">
                <form
                  action={crearBloqueTablaAction.bind(null, municipioId, capitulo.id, s.capitulo_codigo)}
                  className="flex items-center gap-3"
                >
                  <input
                    name="nombreBloque"
                    type="text"
                    placeholder="Ej. Sistemas generales de espacios libres"
                    className="box-border bg-transparent border border-line rounded px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
                  />
                  <button type="submit" className="btn btn-secondary whitespace-nowrap">
                    + Nueva tabla
                  </button>
                </form>
                <form
                  action={crearBloqueTextoAction.bind(null, municipioId, capitulo.id, s.capitulo_codigo)}
                  className="flex items-center gap-3"
                >
                  <input
                    name="tituloBloque"
                    type="text"
                    placeholder="Ej. Justificación de la propuesta"
                    className="box-border bg-transparent border border-line rounded px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
                  />
                  <button type="submit" className="btn btn-secondary whitespace-nowrap">
                    + Nuevo texto
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
