import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { RevisionResumenTabla } from "@/components/RevisionResumenTabla";
import { BUCKET_UI, calcularBucket } from "@/lib/capitulos/aviso-ui";
import { getMunicipio, listCapitulosDeMunicipio } from "@/lib/data/municipios";
import { listEvaluacionesDeMunicipio, listAvisosDeMunicipio } from "@/lib/data/evaluacion";
import { requireEquipoActivo } from "@/lib/data/equipos";

export const dynamic = "force-dynamic";

export default async function RevisionTecnicaPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();

  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) notFound();

  const capitulos = await listCapitulosDeMunicipio(municipioId, equipo.id);
  const capituloIds = capitulos.map((c) => c.id);
  const [evaluaciones, avisos] = await Promise.all([
    listEvaluacionesDeMunicipio(capituloIds),
    listAvisosDeMunicipio(capituloIds),
  ]);
  const evaluacionPorCapitulo = new Map(evaluaciones.map((e) => [e.capitulo_id, e]));
  const avisosPorCapitulo = new Map<string, typeof avisos>();
  for (const aviso of avisos) {
    avisosPorCapitulo.set(aviso.capitulo_id, [...(avisosPorCapitulo.get(aviso.capitulo_id) ?? []), aviso]);
  }

  const filas = capitulos.map((capitulo) => ({
    capitulo,
    evaluacion: evaluacionPorCapitulo.get(capitulo.id) ?? null,
    avisos: avisosPorCapitulo.get(capitulo.id) ?? [],
  }));

  const evaluados = filas.filter((f) => f.evaluacion !== null);
  const valoracionGlobal =
    evaluados.length > 0
      ? Math.round(evaluados.reduce((suma, f) => suma + f.evaluacion!.puntuacion_total, 0) / evaluados.length)
      : null;

  const buckets = evaluados.reduce(
    (contador, f) => {
      const tieneAvisoAlta = f.avisos.some((a) => !a.resuelto && a.severidad === "alta");
      const bucket = calcularBucket(f.evaluacion!.puntuacion_total, tieneAvisoAlta);
      contador[bucket] += 1;
      return contador;
    },
    { verde: 0, ambar: 0, rojo: 0 }
  );

  const tareasPendientes = filas
    .flatMap((f) => f.avisos.filter((a) => !a.resuelto && a.severidad === "alta").map((a) => ({ capitulo: f.capitulo, aviso: a })))
    .sort((a, b) => a.capitulo.orden - b.capitulo.orden);

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipio.id}/memoria`} />
      <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">
        {municipio.nombre} · Revisión técnica
      </div>
      <h1 className="font-serif font-normal text-[38px] sm:text-[46px] leading-[1.02] tracking-[-0.025em] mb-8">
        Revisión técnica
      </h1>

      <div className="flex flex-wrap items-center gap-8 py-5 border-t border-b border-line mb-10">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5">Valoración global</div>
          <div className="font-serif text-[40px] tabular-nums leading-none">
            {valoracionGlobal === null ? "—" : `${valoracionGlobal}%`}
          </div>
        </div>
        <div className="flex gap-6">
          {(["verde", "ambar", "rojo"] as const).map((bucket) => (
            <div key={bucket} className="flex items-center gap-2">
              <span className="text-[15px]">{BUCKET_UI[bucket].icono}</span>
              <span className="font-serif text-[20px] tabular-nums">{buckets[bucket]}</span>
              <span className="text-[11px] text-text-faint">capítulo{buckets[bucket] === 1 ? "" : "s"}</span>
            </div>
          ))}
        </div>
        {evaluados.length < filas.filter((f) => f.capitulo.contenido_html).length && (
          <p className="text-[11.5px] text-text-faint max-w-[280px]">
            Algunos capítulos con contenido todavía no tienen evaluación — se genera al crearlos o regenerarlos.
          </p>
        )}
      </div>

      {tareasPendientes.length > 0 && (
        <div className="mb-10">
          <div className="font-mono text-[11px] text-text-faint mb-3">PRINCIPALES TAREAS PENDIENTES</div>
          <ol className="space-y-2">
            {tareasPendientes.map(({ capitulo, aviso }, i) => (
              <li key={aviso.id} className="flex items-start gap-3 text-[13.5px]">
                <span className="text-text-faint tabular-nums shrink-0">{i + 1}.</span>
                <span className="flex-1">{aviso.mensaje}</span>
                <Link
                  href={`/avance/ordenacion/${municipioId}/${encodeURIComponent(capitulo.codigo)}`}
                  className="shrink-0 text-violet-ink hover:underline whitespace-nowrap"
                >
                  {capitulo.codigo} →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="font-mono text-[11px] text-text-faint mb-1">CAPÍTULOS</div>
      <RevisionResumenTabla municipioId={municipioId} filas={filas} />
    </AppShell>
  );
}
