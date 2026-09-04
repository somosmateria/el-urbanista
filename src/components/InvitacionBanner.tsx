"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { aceptarInvitacionAction, rechazarInvitacionAction } from "@/app/invitaciones/actions";

type Invitacion = { id: string; equipoNombre: string };

/**
 * Popup bloqueante al entrar con invitaciones pendientes — una por una
 * (aceptar cambia de equipo activo al nuevo, así que no tiene sentido
 * mostrar varias a la vez). Mismo estilo que ConfirmModal, en violeta en
 * vez de coral porque esto no es destructivo.
 */
export function InvitacionBanner({ invitaciones }: { invitaciones: Invitacion[] }) {
  const [resueltas, setResueltas] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const pendientes = invitaciones.filter((i) => !resueltas.has(i.id));
  if (pendientes.length === 0) return null;
  const actual = pendientes[0];

  function resolver(accion: (id: string) => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await accion(actual.id);
        setResueltas((prev) => new Set(prev).add(actual.id));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo procesar la invitación.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-[420px] bg-surface border-2 border-violet rounded-xl p-6 shadow-2xl">
        <h2 className="text-[16px] font-serif font-semibold text-text mb-2">
          Invitación a {actual.equipoNombre}
        </h2>
        <p className="text-[13.5px] text-text-soft leading-relaxed mb-6">
          Te han invitado a unirte al equipo <strong>{actual.equipoNombre}</strong> en El Urbanista.
          ¿Aceptas?
        </p>
        {error && <p className="text-[12px] text-coral-ink mb-3">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => resolver(rechazarInvitacionAction)}
            disabled={pending}
            className="text-[13px] px-4 py-2 rounded-lg border border-line-strong text-text-soft hover:bg-surface-hi cursor-pointer disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => resolver(aceptarInvitacionAction)}
            disabled={pending}
            autoFocus
            className="text-[13px] px-4 py-2 rounded-lg bg-violet hover:bg-violet-hover disabled:opacity-60 text-bg cursor-pointer"
          >
            {pending ? "Procesando…" : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
