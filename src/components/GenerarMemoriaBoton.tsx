"use client";

import { useEffect, useState, useTransition } from "react";
import { SketchDraw } from "@/components/SketchDraw";

const MENSAJES = [
  "Leyendo el diagnóstico…",
  "Aplicando las plantillas normativas…",
  "Redactando los capítulos con datos del diagnóstico…",
  "Comprobando qué falta por completar…",
  "Esto puede tardar uno o dos minutos…",
];

/**
 * No hay forma de reportar progreso real de esto (una sola petición de
 * servidor que encadena varias llamadas a Claude y termina en un
 * redirect, creando todos los capítulos de golpe al final) — el
 * porcentaje y el estado por capítulo son una estimación por tiempo
 * transcurrido, pensada para que la espera (que puede ser de más de un
 * minuto) se lea como progreso capítulo a capítulo y no como que la
 * página se ha quedado colgada.
 */
const DURACION_ESTIMADA_MS = 70_000;

export function GenerarMemoriaBoton({
  action,
  capitulos,
}: {
  action: () => Promise<void>;
  capitulos: { codigo: string; titulo: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!pending) return;
    const inicio = Date.now();
    const intervalo = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      setPct(Math.min(96, Math.round((transcurrido / DURACION_ESTIMADA_MS) * 100)));
    }, 150);
    return () => clearInterval(intervalo);
  }, [pending]);

  if (pending) {
    const mensajeIdx = Math.min(MENSAJES.length - 1, Math.floor(pct / (100 / MENSAJES.length)));
    const n = capitulos.length || 1;
    return (
      <div className="max-w-[620px]">
        <SketchDraw className="w-full h-auto max-h-[180px] mb-8" />
        <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-6">
          Generando la memoria
        </div>
        <div className="flex items-end gap-3 mb-2.5">
          <span className="font-serif font-normal text-[64px] sm:text-[80px] leading-[0.86] tracking-[-0.04em] tabular-nums">
            {pct}
          </span>
          <span className="font-serif text-[24px] leading-none pb-2 text-text-faint">%</span>
        </div>
        <div className="h-[2px] bg-line mb-3.5">
          <div className="h-full bg-violet transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[14px] text-text-soft mb-10">{MENSAJES[mensajeIdx]}</p>

        <div className="border-t border-line">
          {capitulos.map((c, i) => {
            const umbral = ((i + 1) / n) * 100;
            const hecho = pct >= umbral;
            const enCurso = !hecho && pct >= (i / n) * 100;
            return (
              <div
                key={c.codigo}
                className="flex items-center gap-4 py-3 border-b border-line last:border-b-0"
                style={{ opacity: hecho ? 1 : 0.45 }}
              >
                <span className="text-[11px] tracking-[0.12em] text-text-faint tabular-nums w-[26px] shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[14px] truncate">
                  {c.codigo} — {c.titulo}
                </span>
                <span className="text-[10px] tracking-[0.16em] uppercase text-text-faint shrink-0">
                  {hecho ? "Listo" : enCurso ? "Generando" : "En cola"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => startTransition(() => action())} className="btn btn-primary">
      Generar memoria de ordenación
    </button>
  );
}
