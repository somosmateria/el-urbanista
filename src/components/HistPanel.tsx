import clsx from "clsx";
import type { CapituloVersionRow } from "@/lib/supabase/types";
import { restaurarVersionAction } from "@/app/avance/ordenacion/[municipioId]/[capitulo]/editar/actions";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistPanel({
  municipioId,
  capituloId,
  capituloCodigo,
  versiones,
}: {
  municipioId: string;
  capituloId: string;
  capituloCodigo: string;
  versiones: CapituloVersionRow[];
}) {
  return (
    <div>
      <div className="font-mono text-[11px] text-text-faint mb-2.5">HISTORIAL DE VERSIONES</div>
      <div className="flex flex-col gap-0.5">
        <div className="p-3.5 rounded-[9px] border border-violet bg-violet-wash mb-2">
          <div className="text-[13px] font-medium text-violet-ink">Versión actual</div>
          <div className="text-[11.5px] text-text-faint font-mono mt-0.5">editando ahora</div>
        </div>
        {versiones.map((version, i) => (
          <div
            key={version.id}
            className={clsx(
              "p-3.5 rounded-[9px] border border-line mb-2",
              i === 0 && "border-violet/40"
            )}
          >
            <div className="text-[13px] font-medium">
              {i === 0 ? "Última versión guardada" : formatFecha(version.created_at)}
            </div>
            <div className="text-[11.5px] text-text-faint font-mono mt-0.5">
              {version.tipo === "generacion_automatica" ? "generado automáticamente" : "editado a mano"}
            </div>
            <form
              action={restaurarVersionAction.bind(
                null,
                municipioId,
                capituloId,
                capituloCodigo,
                version.id
              )}
            >
              <button
                type="submit"
                className="text-[11.5px] text-cyan-ink cursor-pointer mt-2 inline-block"
              >
                Restaurar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
