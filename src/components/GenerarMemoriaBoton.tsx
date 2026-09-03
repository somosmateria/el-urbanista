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
 * redirect) — se muestra una animación con mensajes rotativos en vez de
 * un porcentaje inventado, para que la espera (que puede ser de más de
 * un minuto) no parezca que la página se ha quedado colgada.
 */
export function GenerarMemoriaBoton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  const [mensajeIdx, setMensajeIdx] = useState(0);

  useEffect(() => {
    if (!pending) return;
    const intervalo = setInterval(() => {
      setMensajeIdx((i) => Math.min(i + 1, MENSAJES.length - 1));
    }, 3500);
    return () => clearInterval(intervalo);
  }, [pending]);

  if (pending) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 max-w-[420px]">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-line-strong border-t-violet animate-spin shrink-0" />
          <span className="text-[13.5px] text-text">{MENSAJES[mensajeIdx]}</span>
        </div>
        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-violet rounded-full animate-[deslizar_1.4s_ease-in-out_infinite]" />
        </div>
        <style>{`
          @keyframes deslizar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => startTransition(() => action())}
      className="inline-block bg-violet hover:bg-violet-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
    >
      Generar memoria de ordenación
    </button>
  );
}
