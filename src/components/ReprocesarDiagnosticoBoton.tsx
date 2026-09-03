"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Vuelve a lanzar la extracción/segmentación del PDF ya subido, sin
 * necesidad de volver a subirlo — útil para probar cambios en el parser o
 * en las extracciones puntuales (plan vigente, colindantes...) contra un
 * diagnóstico real sin esperar a re-subir un PDF de cientos de MB cada vez.
 */
export function ReprocesarDiagnosticoBoton({ diagnosticoId }: { diagnosticoId: string }) {
  const [estado, setEstado] = useState<"idle" | "procesando" | "error">("idle");
  const router = useRouter();

  async function reprocesar() {
    setEstado("procesando");
    try {
      const res = await fetch(`/api/diagnosticos/${diagnosticoId}/procesar`, { method: "POST" });
      if (!res.ok) throw new Error("fallo al reprocesar");
      setEstado("idle");
      router.refresh();
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        type="button"
        onClick={reprocesar}
        disabled={estado === "procesando"}
        className="text-[12px] px-3 py-1.5 rounded-lg border border-line-strong text-text-faint hover:bg-surface-hi disabled:opacity-60 cursor-pointer whitespace-nowrap"
      >
        {estado === "procesando" ? "Reprocesando…" : "↻ Reprocesar diagnóstico (sin volver a subir)"}
      </button>
      {estado === "error" && <span className="text-[12px] text-coral-ink">Falló, prueba otra vez</span>}
    </div>
  );
}
