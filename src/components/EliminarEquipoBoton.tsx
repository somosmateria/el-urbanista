"use client";

import { useState, useTransition } from "react";
import { ConfirmModal } from "@/components/ConfirmModal";

/**
 * `action` redirige a "/ajustes" cuando termina bien (ver
 * eliminarEquipoAction) — Next.js implementa ese redirect lanzando un
 * error especial que tiene que propagarse sin que nadie lo atrape, así
 * que aquí no hay try/catch: un fallo real (p.ej. "es tu único equipo")
 * se deja subir tal cual, igual que en EliminarMunicipioBoton.
 */
export function EliminarEquipoBoton({
  nombreEquipo,
  action,
  variant = "boton",
}: {
  nombreEquipo: string;
  action: () => Promise<void>;
  variant?: "boton" | "icono";
}) {
  const [abierto, setAbierto] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      {variant === "icono" ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          title={`Eliminar ${nombreEquipo}`}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-faint hover:bg-coral-wash hover:text-coral-ink cursor-pointer"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="btn btn-secondary whitespace-nowrap hover:border-coral hover:text-coral-ink"
        >
          Eliminar equipo
        </button>
      )}
      <ConfirmModal
        abierto={abierto}
        titulo={`¿Eliminar ${nombreEquipo}?`}
        descripcion="Se eliminan todos sus municipios, capítulos, diagnósticos y el Avance de referencia, y todos los miembros pierden el acceso. No se puede deshacer."
        procesando={pending}
        onConfirmar={() => startTransition(async () => { await action(); })}
        onCancelar={() => setAbierto(false)}
      />
    </>
  );
}
