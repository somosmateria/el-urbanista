"use client";

import { useEffect, useState, useTransition } from "react";

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
 * redirect) — el porcentaje es una estimación por tiempo transcurrido,
 * pensada para que la espera (que puede ser de más de un minuto) se lea
 * como progreso y no como que la página se ha quedado colgada.
 */
const DURACION_ESTIMADA_MS = 70_000;

export function GenerarMemoriaBoton({ action }: { action: () => Promise<void> }) {
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
    return (
      <div className="max-w-[520px]">
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
        <p className="text-[14px] text-text-soft">{MENSAJES[mensajeIdx]}</p>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => startTransition(() => action())} className="btn btn-primary">
      Generar memoria de ordenación
    </button>
  );
}
