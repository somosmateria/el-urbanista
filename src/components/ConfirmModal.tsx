"use client";

import { useEffect } from "react";

/**
 * Popup bloqueante para confirmaciones destructivas — a propósito no es un
 * banner inline: para un borrado, el usuario debe pararse a leerlo, no
 * poder seguir haciendo clic por encima sin darse cuenta.
 */
export function ConfirmModal({
  abierto,
  titulo,
  descripcion,
  procesando,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Eliminar",
}: {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  procesando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  textoConfirmar?: string;
}) {
  useEffect(() => {
    if (!abierto) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancelar}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-[420px] bg-surface border border-line-strong rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-medium text-text mb-2">{titulo}</h2>
        <p className="text-[13.5px] text-text-soft leading-relaxed mb-6">{descripcion}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            className="text-[13px] px-4 py-2 rounded-lg border border-line-strong text-text-soft hover:bg-surface-hi cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            autoFocus
            className="text-[13px] px-4 py-2 rounded-lg bg-coral hover:bg-coral/85 disabled:opacity-60 text-white cursor-pointer"
          >
            {procesando ? "Eliminando…" : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
