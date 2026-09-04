"use client";

import { useState, useTransition } from "react";
import {
  concederAccesoAction,
  revocarAccesoAction,
} from "@/app/avance/ordenacion/[municipioId]/editar/actions";

function IconoMas() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

function IconoX() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function Chip({
  nombre,
  onQuitar,
  pending,
}: {
  nombre: string;
  onQuitar: () => void;
  pending: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 border border-line rounded-full text-[12.5px]">
      {nombre}
      <button
        type="button"
        onClick={onQuitar}
        disabled={pending}
        title={`Quitar acceso a ${nombre}`}
        className="w-4 h-4 rounded-full flex items-center justify-center text-text-faint hover:bg-coral-wash hover:text-coral-ink cursor-pointer disabled:opacity-40"
      >
        <IconoX />
      </button>
    </span>
  );
}

export function MiembroAccesos({
  userId,
  municipios,
  accesibles,
}: {
  userId: string;
  municipios: { id: string; nombre: string }[];
  accesibles: string[];
}) {
  const [set, setSet] = useState(new Set(accesibles));
  const [anadiendo, setAnadiendo] = useState(false);
  const [pending, startTransition] = useTransition();

  const concedidos = municipios.filter((m) => set.has(m.id));
  const disponibles = municipios.filter((m) => !set.has(m.id));

  function quitar(municipioId: string) {
    setSet((prev) => {
      const next = new Set(prev);
      next.delete(municipioId);
      return next;
    });
    startTransition(async () => {
      await revocarAccesoAction(municipioId, userId);
    });
  }

  function anadir(municipioId: string) {
    setSet((prev) => new Set(prev).add(municipioId));
    setAnadiendo(false);
    startTransition(async () => {
      await concederAccesoAction(municipioId, userId);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {concedidos.length === 0 && !anadiendo && (
        <span className="text-[12px] text-text-faint">Sin acceso a ningún municipio todavía.</span>
      )}
      {concedidos.map((m) => (
        <Chip key={m.id} nombre={m.nombre} pending={pending} onQuitar={() => quitar(m.id)} />
      ))}

      {anadiendo ? (
        disponibles.length === 0 ? (
          <span className="text-[12px] text-text-faint">Ya tiene acceso a todos.</span>
        ) : (
          <select
            autoFocus
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) anadir(e.target.value);
            }}
            onBlur={() => setAnadiendo(false)}
            className="text-[12.5px] bg-transparent border border-line rounded-full px-2.5 py-1 outline-none focus:border-violet"
          >
            <option value="" disabled>
              Elige un municipio…
            </option>
            {disponibles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        )
      ) : (
        <button
          type="button"
          onClick={() => setAnadiendo(true)}
          title="Dar acceso a un municipio"
          className="w-6 h-6 rounded-full border border-line-strong flex items-center justify-center text-text-faint hover:border-violet hover:text-violet cursor-pointer"
        >
          <IconoMas />
        </button>
      )}
    </div>
  );
}
