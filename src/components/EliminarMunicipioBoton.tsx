"use client";

import { useState, useTransition } from "react";
import { ConfirmModal } from "@/components/ConfirmModal";

export function EliminarMunicipioBoton({
  nombreMunicipio,
  action,
}: {
  nombreMunicipio: string;
  action: () => Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="whitespace-nowrap inline-flex items-center border border-coral text-coral-ink hover:bg-coral-wash text-[13.5px] font-medium px-4 py-2.5 rounded-lg cursor-pointer"
      >
        Eliminar
      </button>
      <ConfirmModal
        abierto={abierto}
        titulo={`¿Eliminar ${nombreMunicipio}?`}
        descripcion="Se eliminan sus doce capítulos, el historial de versiones y el diagnóstico vinculado, incluido el PDF. No se puede deshacer."
        procesando={pending}
        onConfirmar={() => startTransition(async () => { await action(); })}
        onCancelar={() => setAbierto(false)}
      />
    </>
  );
}
