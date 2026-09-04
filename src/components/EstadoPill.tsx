import clsx from "clsx";
import { ESTADO_UI } from "@/lib/capitulos/estado-ui";
import type { CapituloEstado } from "@/lib/supabase/types";

export function EstadoPill({ estado, className }: { estado: CapituloEstado; className?: string }) {
  const ui = ESTADO_UI[estado];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 border rounded text-[10px] tracking-[0.14em] uppercase whitespace-nowrap",
        ui.pillClass,
        ui.ink,
        className
      )}
    >
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={ui.icon} />
      </svg>
      {ui.label}
    </span>
  );
}
