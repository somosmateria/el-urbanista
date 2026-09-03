"use client";

import { useState, useTransition } from "react";

export function EliminarMunicipioBoton({ action }: { action: () => Promise<void> }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirmando) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[13px] text-coral-ink whitespace-nowrap">¿Eliminar definitivamente?</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => action())}
          className="whitespace-nowrap bg-coral hover:bg-coral/85 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium px-3.5 py-2.5 rounded-lg cursor-pointer"
        >
          {pending ? "Eliminando…" : "Sí, eliminar"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirmando(false)}
          className="whitespace-nowrap text-text-faint hover:text-text-soft text-[13px] px-2 py-2.5 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className="whitespace-nowrap inline-flex items-center border border-line-strong hover:border-coral hover:text-coral-ink text-text-soft text-[13.5px] font-medium px-4 py-2.5 rounded-lg cursor-pointer"
    >
      Eliminar
    </button>
  );
}
