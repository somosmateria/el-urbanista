"use client";

import { useState } from "react";

export function EliminarMunicipioForm({
  nombreMunicipio,
  action,
}: {
  nombreMunicipio: string;
  action: () => Promise<void>;
}) {
  const [confirmacion, setConfirmacion] = useState("");
  const habilitado = confirmacion.trim() === nombreMunicipio;

  return (
    <div className="rounded-xl border border-coral/40 bg-coral-wash p-6">
      <div className="font-mono text-[11px] text-coral-ink mb-2">ZONA DE PELIGRO</div>
      <p className="text-[13.5px] text-text-soft mb-4 max-w-[480px] leading-relaxed">
        Elimina el municipio, sus doce capítulos, el historial de versiones y el
        diagnóstico vinculado (incluido el PDF). No se puede deshacer.
      </p>
      <label className="block font-mono text-[11px] text-text-faint mb-2">
        ESCRIBE &ldquo;{nombreMunicipio}&rdquo; PARA CONFIRMAR
      </label>
      <input
        value={confirmacion}
        onChange={(e) => setConfirmacion(e.target.value)}
        type="text"
        className="w-full box-border bg-surface-hi border border-line-strong rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-coral mb-4"
      />
      <form action={action}>
        <button
          type="submit"
          disabled={!habilitado}
          className="bg-coral hover:bg-coral/85 disabled:bg-coral/30 disabled:cursor-not-allowed text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
        >
          Eliminar municipio definitivamente
        </button>
      </form>
    </div>
  );
}
