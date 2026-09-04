"use client";

import { useState, useTransition } from "react";
import { asignarCapituloAction } from "@/app/avance/ordenacion/[municipioId]/[capitulo]/actions";

type Miembro = { id: string; email: string };

export function AsignarCapitulo({
  municipioId,
  capituloId,
  miembros,
  asignadoInicial,
}: {
  municipioId: string;
  capituloId: string;
  miembros: Miembro[];
  asignadoInicial: string | null;
}) {
  const [asignado, setAsignado] = useState(asignadoInicial ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-2">
      <label className="text-[10.5px] tracking-[0.14em] uppercase text-text-faint">Asignado a</label>
      <select
        value={asignado}
        disabled={pending}
        onChange={(e) => {
          const nuevo = e.target.value;
          const anterior = asignado;
          setAsignado(nuevo);
          setError(null);
          startTransition(async () => {
            try {
              await asignarCapituloAction(municipioId, capituloId, nuevo || null);
            } catch (err) {
              setAsignado(anterior);
              setError(err instanceof Error ? err.message : "No se pudo asignar.");
            }
          });
        }}
        className="select-line text-[11px] bg-transparent border border-line rounded px-2 py-1 outline-none focus:border-violet cursor-pointer disabled:opacity-50 max-w-[180px]"
      >
        <option value="">Sin asignar</option>
        {miembros.map((m) => (
          <option key={m.id} value={m.id}>
            {m.email}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-coral-ink">{error}</span>}
    </span>
  );
}
