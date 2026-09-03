"use client";

import { useState, useTransition } from "react";
import type { CapituloTablaRow } from "@/lib/supabase/types";
import { guardarTablaAction } from "@/app/avance/ordenacion/[municipioId]/[capitulo]/actions";

export function DataTableEditor({
  municipioId,
  tabla,
}: {
  municipioId: string;
  tabla: CapituloTablaRow;
}) {
  const [columnas, setColumnas] = useState<string[]>(tabla.columnas);
  const [filas, setFilas] = useState<Record<string, string>[]>(tabla.filas);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [guardado, setGuardado] = useState(false);
  const [anadiendoColumna, setAnadiendoColumna] = useState(false);
  const [nombreColumna, setNombreColumna] = useState("");

  function actualizarCelda(filaIdx: number, columna: string, valor: string) {
    setFilas((prev) =>
      prev.map((fila, i) => (i === filaIdx ? { ...fila, [columna]: valor } : fila))
    );
    setDirty(true);
    setGuardado(false);
  }

  function anadirFila() {
    const nuevaFila = Object.fromEntries(columnas.map((c) => [c, ""]));
    setFilas((prev) => [...prev, nuevaFila]);
    setDirty(true);
    setGuardado(false);
  }

  function eliminarFila(filaIdx: number) {
    setFilas((prev) => prev.filter((_, i) => i !== filaIdx));
    setDirty(true);
    setGuardado(false);
  }

  function confirmarNuevaColumna() {
    const col = nombreColumna.trim();
    if (!col || columnas.includes(col)) {
      setAnadiendoColumna(false);
      setNombreColumna("");
      return;
    }
    setColumnas((prev) => [...prev, col]);
    setFilas((prev) => prev.map((fila) => ({ ...fila, [col]: "" })));
    setDirty(true);
    setGuardado(false);
    setAnadiendoColumna(false);
    setNombreColumna("");
  }

  function guardar() {
    startTransition(async () => {
      await guardarTablaAction(municipioId, tabla.id, columnas, filas);
      setDirty(false);
      setGuardado(true);
    });
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6 mb-5">
      <div className="font-mono text-[11px] text-text-faint mb-3">
        {tabla.nombre_bloque.toUpperCase()}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {columnas.map((col) => (
                <th
                  key={col}
                  className="text-left font-mono font-normal text-[11px] text-text-faint px-2.5 py-1.5 border-b border-line-strong whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="border-b border-line-strong" />
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, filaIdx) => (
              <tr key={filaIdx}>
                {columnas.map((col) => (
                  <td key={col} className="px-2.5 py-1 border-b border-line">
                    <input
                      value={fila[col] ?? ""}
                      onChange={(e) => actualizarCelda(filaIdx, col, e.target.value)}
                      className="w-full bg-transparent outline-none border-b border-transparent focus:border-violet text-text text-[13.5px]"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 border-b border-line text-right">
                  <button
                    type="button"
                    onClick={() => eliminarFila(filaIdx)}
                    title="Quitar fila"
                    className="text-text-faint hover:text-coral-ink text-[12px] cursor-pointer"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td
                  colSpan={columnas.length + 1}
                  className="px-2.5 py-3 text-text-faint text-[12.5px]"
                >
                  Sin filas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-5 mt-4">
        <button
          type="button"
          onClick={anadirFila}
          className="text-[13px] text-violet-ink inline-flex items-center gap-1.5 cursor-pointer"
        >
          + Añadir fila
        </button>
        {anadiendoColumna ? (
          <span className="inline-flex items-center gap-2">
            <input
              autoFocus
              value={nombreColumna}
              onChange={(e) => setNombreColumna(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmarNuevaColumna();
                if (e.key === "Escape") {
                  setAnadiendoColumna(false);
                  setNombreColumna("");
                }
              }}
              placeholder="Nombre de la columna"
              className="bg-surface-hi border border-line-strong rounded-md px-2 py-1 text-[12.5px] text-text outline-none focus:border-violet w-40"
            />
            <button
              type="button"
              onClick={confirmarNuevaColumna}
              className="text-[12.5px] text-violet-ink cursor-pointer"
            >
              Añadir
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setAnadiendoColumna(true)}
            className="text-[13px] text-violet-ink inline-flex items-center gap-1.5 cursor-pointer"
          >
            + Añadir columna
          </button>
        )}
        <span className="flex-1" />
        <button
          type="button"
          onClick={guardar}
          disabled={!dirty || pending}
          className="text-[12.5px] px-3.5 py-1.5 rounded-lg bg-violet hover:bg-violet-hover disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
        >
          {pending ? "Guardando…" : guardado ? "Guardado" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
