import { notFound } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DataTableEditor } from "@/components/DataTableEditor";
import { TextoBlockEditor } from "@/components/TextoBlockEditor";
import { RegenerarPanel } from "@/components/RegenerarPanel";
import { EstadoPill } from "@/components/EstadoPill";
import { SubmitButton } from "@/components/SubmitButton";
import { AvisoCard } from "@/components/AvisoCard";
import { getMunicipio, getCapituloPorCodigo } from "@/lib/data/municipios";
import { listTablasDeCapitulo } from "@/lib/data/tablas";
import { listTextosDeCapitulo } from "@/lib/data/textos";
import { listAvisosDeCapitulo } from "@/lib/data/evaluacion";
import { getSubepigrafes } from "@/lib/data/mapeo";
import { getTitulosReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import { requireEquipoActivo, listMiembrosDeEquipo } from "@/lib/data/equipos";
import { AsignarCapitulo } from "@/components/AsignarCapitulo";
import {
  marcarMotivoAction,
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

  const [municipio, capitulo, titulosReferencia, miembros] = await Promise.all([
    getMunicipio(municipioId, equipo),
    getCapituloPorCodigo(municipioId, codigo, equipo.id),
    getTitulosReferenciaDeEquipo(equipo.id),
    listMiembrosDeEquipo(equipo.id),
  ]);
  if (!municipio) notFound();
  if (!capitulo) notFound();
  const asignado = miembros.find((m) => m.user_id === capitulo.asignado_a);
  const avisos = (await listAvisosDeCapitulo(capitulo.id)).filter((a) => !a.resuelto);
  // Subepígrafes que el motor RAG no pudo generar (ver bloquePendiente en
  // motores/rag/index.ts) — quedan marcados así en vez de sin_info_motivo
  // porque el capítulo en sí sí tiene contenido, solo les falta ese trozo.
  const avisosSubepigrafeFaltante = avisos.filter(
    (a) => a.tipo === "informacion_no_localizada" && a.subepigrafe_codigo
  );

  const [tablas, textos] = capitulo.motor === "tabla"
    ? await Promise.all([listTablasDeCapitulo(capitulo.id), listTextosDeCapitulo(capitulo.id)])
    : [[], []];
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
  const [tablasPorSubepigrafe, textosPorSubepigrafe] = await Promise.all([
    Promise.all(subepigrafesDeTabla.map((s) => listTablasDeCapitulo(capitulo.id, s.capitulo_codigo))),
    Promise.all(subepigrafesDeTabla.map((s) => listTextosDeCapitulo(capitulo.id, s.capitulo_codigo))),
  ]);
  // Subepígrafes de propuesta técnica que siguen sin ninguna tabla/párrafo
  // relleno — junto con avisosSubepigrafeFaltante, arriba, son "lo
  // pendiente" al que lleva el botón de la cabecera (ver más abajo).
  const subepigrafesTablaPendientes = subepigrafesDeTabla.filter(
    (s, i) =>
      tablasPorSubepigrafe[i].every((t) => t.filas.length === 0) &&
      textosPorSubepigrafe[i].every((t) => t.contenido_html.trim() === "")
  );
  const totalPendientes = avisosSubepigrafeFaltante.length + subepigrafesTablaPendientes.length;
  // Prioriza el ancla puesta en el propio contenido (ver bloquePendiente en
  // motores/rag/index.ts); si lo pendiente es solo una propuesta técnica sin
  // rellenar, no hay ancla propia — se apunta a la sección de propuestas de
  // más abajo en su lugar (ver id="propuesta-tecnico").
  const anclaPendiente = avisosSubepigrafeFaltante[0]
    ? `pendiente-${avisosSubepigrafeFaltante[0].subepigrafe_codigo}`
    : subepigrafesTablaPendientes.length > 0
      ? "propuesta-tecnico"
      : null;

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipio.id}/memoria`} />
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
        {equipo.rol === "admin" ? (
          <AsignarCapitulo
            municipioId={municipioId}
            capituloId={capitulo.id}
            miembros={miembros.map((m) => ({ id: m.user_id, email: m.email }))}
            asignadoInicial={capitulo.asignado_a}
          />
        ) : (
          asignado && (
            <span className="text-[10.5px] tracking-[0.14em] uppercase text-text-faint">
              Asignado a {asignado.email}
            </span>
          )
        )}
        <span className="flex-1" />
        <span className="flex gap-2.5 flex-wrap">
          {anclaPendiente && (
            <a href={`#${anclaPendiente}`} className="btn btn-secondary">
              Ir a lo pendiente{totalPendientes > 1 ? ` (${totalPendientes})` : ""}
            </a>
          )}
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

      {avisos.length > 0 && (
        <div className="mb-8">
          <div className="font-mono text-[11px] text-text-faint mb-2">
            AVISOS DE REVISIÓN TÉCNICA ({avisos.length})
          </div>
          {avisos.map((aviso) => (
            <AvisoCard key={aviso.id} municipioId={municipioId} capituloId={capitulo.id} aviso={aviso} />
          ))}
        </div>
      )}

      {capitulo.motor !== "tabla" && capitulo.contenido_html && (
        <p className="text-text-soft text-[13.5px] mb-[26px] max-w-[560px] leading-relaxed">
          {capitulo.estado === "revisar"
            ? capitulo.contenido_html.includes("<mark")
              ? "Redactado a partir del diagnóstico. Lo resaltado viene citado de allí — confírmalo antes de cerrar el capítulo."
              : "Necesita confirmación antes de cerrarse — revisa la nota al final del texto para ver qué falta o hay que verificar."
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
            <form action={crearBloqueTextoAction.bind(null, municipioId, capitulo.id, null)} className="flex items-center gap-3">
              <input
                name="tituloBloque"
                type="text"
                placeholder="Ej. Justificación de la propuesta"
                className="box-border bg-transparent border border-line rounded px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
              />
              <SubmitButton className="btn btn-secondary whitespace-nowrap">+ Añadir párrafo</SubmitButton>
            </form>
          </div>

          {hayFilas && (
            <form action={generarTextoTablaAction.bind(null, municipioId, capitulo.id)}>
              <SubmitButton className="btn btn-primary" pendingLabel="Generando…">
                {capitulo.contenido_html ? "Regenerar texto con los cambios" : "Generar texto"}
              </SubmitButton>
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
        <div className="mt-10" id="propuesta-tecnico">
          <div className="font-mono text-[11px] text-text-faint mb-1">
            PROPUESTA DEL TÉCNICO (NO VIENE DEL DIAGNÓSTICO)
          </div>
          <p className="text-text-soft text-[14.5px] mb-6 max-w-[540px] leading-relaxed">
            Estos subepígrafes de {capitulo.codigo} son propuesta técnica, no
            reformateo del diagnóstico. Suele bastar con un párrafo — añade una
            tabla solo si el dato es de verdad tabular. Luego usa
            &ldquo;Regenerar&rdquo; arriba para incorporarlas al capítulo.
          </p>

          {subepigrafesDeTabla.map((s, i) => (
            <div key={s.capitulo_codigo} className="mb-8">
              <h3 className="font-serif text-[16px] mb-3">
                {s.capitulo_codigo.replace(/^MO\./, "")} · {titulosReferencia.get(s.capitulo_codigo) ?? s.titulo_canonico}
              </h3>

              {tablasPorSubepigrafe[i].map((tabla) => (
                <DataTableEditor key={tabla.id} municipioId={municipioId} tabla={tabla} />
              ))}
              {textosPorSubepigrafe[i].map((texto) => (
                <TextoBlockEditor key={texto.id} municipioId={municipioId} texto={texto} />
              ))}

              <div className="flex flex-wrap items-center gap-3">
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
                  <SubmitButton className="btn btn-secondary whitespace-nowrap">+ Añadir párrafo</SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
