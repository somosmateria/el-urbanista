"use client";

import { useState } from "react";
import { AccesoMunicipioToggle } from "@/components/AccesoMunicipioToggle";

export function MiembroAccesos({
  userId,
  municipios,
  accesibles,
}: {
  userId: string;
  municipios: { id: string; nombre: string }[];
  accesibles: string[];
}) {
  const [abierto, setAbierto] = useState(false);
  const set = new Set(accesibles);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="text-[10px] tracking-[0.14em] uppercase text-violet cursor-pointer"
      >
        {abierto ? "Ocultar municipios" : "Gestionar acceso a municipios"}
      </button>
      {abierto && (
        <div className="mt-3 flex flex-col gap-2">
          {municipios.length === 0 && (
            <span className="text-[12px] text-text-faint">Este equipo no tiene municipios todavía.</span>
          )}
          {municipios.map((m) => (
            <label key={m.id} className="flex items-center gap-2.5 text-[13.5px] cursor-pointer">
              <AccesoMunicipioToggle municipioId={m.id} userId={userId} checkedInicial={set.has(m.id)} />
              {m.nombre}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
