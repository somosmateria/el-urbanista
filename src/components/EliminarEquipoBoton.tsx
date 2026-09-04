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
}: {
  nombreEquipo: string;
  action: () => Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="btn btn-secondary whitespace-nowrap hover:border-coral hover:text-coral-ink"
      >
        Eliminar equipo
      </button>
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
