"use client";

import { useState, useTransition } from "react";
import {
  concederAccesoAction,
  revocarAccesoAction,
} from "@/app/avance/ordenacion/[municipioId]/editar/actions";

export function AccesoMunicipioToggle({
  municipioId,
  userId,
  checkedInicial,
}: {
  municipioId: string;
  userId: string;
  checkedInicial: boolean;
}) {
  const [checked, setChecked] = useState(checkedInicial);
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={pending}
      onChange={(e) => {
        const marcar = e.target.checked;
        setChecked(marcar);
        startTransition(async () => {
          if (marcar) await concederAccesoAction(municipioId, userId);
          else await revocarAccesoAction(municipioId, userId);
        });
      }}
      className="w-[15px] h-[15px] accent-[var(--color-violet)] cursor-pointer disabled:cursor-not-allowed"
    />
  );
}
