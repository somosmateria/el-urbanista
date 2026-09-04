"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  previsualizarRegeneracionAction,
  aplicarRegeneracionAction,
} from "@/app/avance/ordenacion/[municipioId]/[capitulo]/actions";

type Preview = {
  contenidoActual: string | null;
  contenidoNuevo: string;
  hayEdicionesManuales: boolean;
};

export function RegenerarPanel({
  municipioId,
  capituloId,
  etiqueta = "Regenerar desde el diagnóstico",
}: {
  municipioId: string;
  capituloId: string;
  etiqueta?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<Preview | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const router = useRouter();

  function iniciar() {
    setMensaje(null);
    startTransition(async () => {
      const resultado = await previsualizarRegeneracionAction(capituloId);

      if (!resultado.disponible) {
        setMensaje(
          "No se pudo regenerar todavía — falta el diagnóstico procesado para este municipio."
        );
        return;
      }
      if (resultado.sinCambios) {
        setMensaje("Ya está al día: no hay cambios respecto a la versión actual.");
        return;
      }
      if (!resultado.hayEdicionesManuales) {
        // Nadie ha tocado el texto a mano desde la última generación — se
        // aplica directo, sin pedir confirmación (ver docs/03).
        await aplicarRegeneracionAction(municipioId, capituloId, resultado.contenidoNuevo);
        router.refresh();
        setMensaje("Actualizado con los datos actuales del diagnóstico.");
        return;
      }

      setPreview({
        contenidoActual: resultado.contenidoActual,
        contenidoNuevo: resultado.contenidoNuevo,
        hayEdicionesManuales: true,
      });
    });
  }

  function aplicar() {
    if (!preview) return;
    startTransition(async () => {
      await aplicarRegeneracionAction(municipioId, capituloId, preview.contenidoNuevo);
      setPreview(null);
      router.refresh();
    });
  }

  if (preview) {
    return (
      <div className="mt-8">
        <div className="font-mono text-[11px] text-text-faint mb-3">
          COMPARAR CON LA VERSIÓN REGENERADA — este capítulo tiene ediciones manuales;
          elige qué te quedas
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="font-mono text-[11px] text-text-faint mb-2">TU VERSIÓN EDITADA</div>
            <div
              className="font-serif text-[14px] leading-[1.7] [&_mark]:bg-amber/20 [&_mark]:text-amber-ink [&_mark]:px-1 [&_mark]:rounded"
              dangerouslySetInnerHTML={{ __html: preview.contenidoActual ?? "" }}
            />
          </div>
          <div className="rounded-xl border border-violet bg-violet-wash p-5">
            <div className="font-mono text-[11px] text-violet-ink mb-2">VERSIÓN REGENERADA</div>
            <div
              className="font-serif text-[14px] leading-[1.7] [&_mark]:bg-amber/20 [&_mark]:text-amber-ink [&_mark]:px-1 [&_mark]:rounded"
              dangerouslySetInnerHTML={{ __html: preview.contenidoNuevo }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={aplicar} disabled={pending} className="btn btn-primary">
            {pending ? "Aplicando…" : "Aplicar la versión regenerada"}
          </button>
          <button type="button" onClick={() => setPreview(null)} disabled={pending} className="btn btn-secondary">
            Mantener mi versión editada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={iniciar}
        disabled={pending}
        className="text-[13px] text-violet-ink inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-3.5 h-3.5 stroke-violet-ink">
          <path d="M4 4v6h6M20 20v-6h-6" />
          <path d="M4 10a8 8 0 0 1 14.5-4.5M20 14a8 8 0 0 1-14.5 4.5" />
        </svg>
        {pending ? "Comprobando…" : etiqueta}
      </button>
      {mensaje && <p className="text-[12.5px] text-text-faint mt-2">{mensaje}</p>}
    </div>
  );
}
