"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { regenerarMemoriaAction, type ResultadoRegeneracionMemoria } from "@/app/avance/ordenacion/[municipioId]/memoria/actions";

/**
 * Regenerar los ~12 capítulos uno a uno desde su propia página es lento —
 * este botón hace lo mismo de golpe (ver regenerarMemoriaAction). Pide
 * confirmación inline (no un `confirm()` nativo, para no romper el estilo
 * del resto de la app) porque puede tardar varios minutos y consumir
 * créditos de la API — no es algo para lanzar sin querer con un solo clic.
 */
export function RegenerarMemoriaButton({ municipioId }: { municipioId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirmando, setConfirmando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoRegeneracionMemoria | null>(null);
  const router = useRouter();

  function regenerar() {
    setConfirmando(false);
    startTransition(async () => {
      const resultado = await regenerarMemoriaAction(municipioId);
      setResultado(resultado);
      router.refresh();
    });
  }

  if (resultado) {
    return (
      <div className="w-full rounded-lg border border-line bg-surface p-4 text-[13px] text-text-soft">
        <div className="font-mono text-[11px] text-text-faint mb-2">MEMORIA REGENERADA</div>
        {resultado.actualizados.length > 0 && (
          <p>Actualizados: {resultado.actualizados.join(", ")}</p>
        )}
        {resultado.sinCambios.length > 0 && (
          <p>Ya al día: {resultado.sinCambios.join(", ")}</p>
        )}
        {resultado.omitidosPorEdicionManual.length > 0 && (
          <p>
            Con ediciones manuales, no tocados: {resultado.omitidosPorEdicionManual.join(", ")} — entra en cada
            uno si quieres regenerarlos igualmente.
          </p>
        )}
        {resultado.sinDatos.length > 0 && <p>Sin datos suficientes para regenerar: {resultado.sinDatos.join(", ")}</p>}
        <button type="button" onClick={() => setResultado(null)} className="btn btn-secondary mt-3">
          Cerrar
        </button>
      </div>
    );
  }

  if (confirmando) {
    return (
      <div className="w-full rounded-lg border border-amber bg-amber-wash p-4 text-[13px] text-amber-ink">
        <p className="mb-3">
          Va a regenerar todos los capítulos con los datos actuales — puede tardar varios minutos y usar créditos
          de la API. Los capítulos con una edición manual no se tocan.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={regenerar} className="btn btn-primary">
            Sí, regenerar toda la memoria
          </button>
          <button type="button" onClick={() => setConfirmando(false)} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      disabled={pending}
      className="btn btn-marron whitespace-nowrap"
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-3.5 h-3.5 stroke-current">
        <path d="M4 4v6h6M20 20v-6h-6" />
        <path d="M4 10a8 8 0 0 1 14.5-4.5M20 14a8 8 0 0 1-14.5 4.5" />
      </svg>
      {pending ? "Regenerando… (puede tardar)" : "Regenerar toda la memoria"}
    </button>
  );
}
