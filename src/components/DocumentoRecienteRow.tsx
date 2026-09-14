import Link from "next/link";
import { EstadoPill } from "@/components/EstadoPill";
import type { CapituloEstado } from "@/lib/supabase/types";

/**
 * Fila de "trabajado recientemente" en el inicio — a diferencia de
 * TownRow (un municipio, con su progreso general), esta lleva directo al
 * documento concreto en el que se trabajó por última vez, no al hub del
 * municipio (ver listCapitulosRecientes).
 */
export function DocumentoRecienteRow({
  href,
  codigo,
  titulo,
  municipioNombre,
  estado,
}: {
  href: string;
  codigo: string;
  titulo: string;
  municipioNombre: string;
  estado: CapituloEstado;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 px-1.5 py-[17px] border-b border-line last:border-b-0 hover:bg-surface-hi"
    >
      <span className="text-[11px] tracking-[0.12em] text-text-faint tabular-nums shrink-0 w-[52px]">{codigo}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-serif font-semibold text-lg leading-[1.15] truncate">{titulo}</span>
        <span className="block text-[10px] tracking-[0.14em] uppercase text-text-faint mt-[3px]">
          {municipioNombre}
        </span>
      </span>
      <EstadoPill estado={estado} className="shrink-0" />
      <span className="text-violet text-[13px]">→</span>
    </Link>
  );
}
