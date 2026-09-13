import Link from "next/link";
import clsx from "clsx";
import { AvisoCard } from "@/components/AvisoCard";
import { BUCKET_UI, calcularBucket } from "@/lib/capitulos/aviso-ui";
import type { CapituloAvisoRow, CapituloEvaluacionRow, CapituloRow } from "@/lib/supabase/types";

type Fila = {
  capitulo: CapituloRow;
  evaluacion: CapituloEvaluacionRow | null;
  avisos: CapituloAvisoRow[];
};

/**
 * Tabla resumen del panel "Revisión técnica" — una fila por capítulo con
 * contenido evaluado. Un capítulo sin evaluación (motor tabla vacío, o
 * "sin información") no tiene nada que puntuar, se omite de la tabla y ya
 * se ve en el semáforo normal de la Memoria (ver memoria/page.tsx).
 */
export function RevisionResumenTabla({ municipioId, filas }: { municipioId: string; filas: Fila[] }) {
  return (
    <div className="border-t border-line">
      {filas.map(({ capitulo, evaluacion, avisos }) => {
        if (!evaluacion) return null;
        const avisosSinResolver = avisos.filter((a) => !a.resuelto);
        const tieneAvisoAlta = avisosSinResolver.some((a) => a.severidad === "alta");
        const bucket = BUCKET_UI[calcularBucket(evaluacion.puntuacion_total, tieneAvisoAlta)];

        return (
          <details key={capitulo.id} className="group border-b border-line last:border-b-0">
            <summary className="flex items-center gap-4 py-3.5 cursor-pointer list-none hover:bg-surface-hi px-1.5 -mx-1.5">
              <span className="shrink-0 text-[11px] tracking-[0.12em] text-text-faint tabular-nums w-[52px]">
                {capitulo.codigo}
              </span>
              <span className="w-[76px] shrink-0 font-serif text-[18px] tabular-nums">
                {evaluacion.puntuacion_total}%
              </span>
              <span className={clsx("shrink-0 inline-flex items-center justify-center w-6 h-6 rounded border text-[11px]", bucket.pillClass)}>
                {bucket.icono}
              </span>
              <span className="flex-1 min-w-0 text-[13.5px] text-text-soft truncate">
                {evaluacion.problema_principal ?? "Sin problema destacable."}
              </span>
              {avisosSinResolver.length > 0 && (
                <span className="shrink-0 text-[10.5px] text-text-faint tabular-nums">
                  {avisosSinResolver.length} aviso{avisosSinResolver.length === 1 ? "" : "s"}
                </span>
              )}
              <Link
                href={`/avance/ordenacion/${municipioId}/${encodeURIComponent(capitulo.codigo)}`}
                className="shrink-0 text-[12px] text-violet-ink hover:underline"
              >
                Abrir →
              </Link>
            </summary>

            <div className="pb-4 pl-[68px] pr-1.5">
              {evaluacion.pendiente_principal && (
                <p className="text-[13px] text-text-soft mb-3">
                  <span className="text-text-faint">Pendiente: </span>
                  {evaluacion.pendiente_principal}
                </p>
              )}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {Object.entries(evaluacion.desglose).map(([factor, { puntos, motivo }]) => (
                  <div key={factor} className="rounded border border-line px-2.5 py-2">
                    <div className="text-[9.5px] tracking-[0.1em] uppercase text-text-faint mb-1">{factor}</div>
                    <div className="font-serif text-[15px] mb-1">{puntos}/20</div>
                    <div className="text-[11px] text-text-soft leading-snug">{motivo}</div>
                  </div>
                ))}
              </div>
              {avisosSinResolver.map((aviso) => (
                <AvisoCard key={aviso.id} municipioId={municipioId} capituloId={capitulo.id} aviso={aviso} />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
