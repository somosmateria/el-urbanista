"use client";

import { useState, useTransition } from "react";
import { cambiarRolMiembroAction } from "@/app/ajustes/actions";
import type { EquipoRol } from "@/lib/supabase/types";

export function RolSelector({ miembroId, rolInicial }: { miembroId: string; rolInicial: EquipoRol }) {
  const [rol, setRol] = useState(rolInicial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="flex flex-col items-end gap-1">
      <select
        value={rol}
        disabled={pending}
        onChange={(e) => {
          const nuevo = e.target.value as EquipoRol;
          const anterior = rol;
          setRol(nuevo);
          setError(null);
          startTransition(async () => {
            try {
              await cambiarRolMiembroAction(miembroId, nuevo);
            } catch (err) {
              setRol(anterior);
              setError(err instanceof Error ? err.message : "No se pudo cambiar el rol.");
            }
          });
        }}
        className="text-[10px] tracking-[0.14em] uppercase bg-transparent border border-line rounded px-2 py-1 outline-none focus:border-violet cursor-pointer disabled:opacity-50"
      >
        <option value="admin">Admin</option>
        <option value="miembro">Miembro</option>
      </select>
      {error && <span className="text-[11px] text-coral-ink normal-case tracking-normal">{error}</span>}
    </span>
  );
}
