import Link from "next/link";
import { EstadoPill } from "@/components/EstadoPill";
import type { CapituloRow } from "@/lib/supabase/types";

export function ChapterRow({
  municipioId,
  capitulo,
}: {
  municipioId: string;
  capitulo: CapituloRow;
}) {
  const puedeDescargar = capitulo.estado === "listo" || capitulo.estado === "revisar";

  return (
    <div className="flex items-center gap-[18px] border-b border-line last:border-b-0 pl-1.5 hover:bg-surface-hi">
      <Link
        href={`/avance/ordenacion/${municipioId}/${encodeURIComponent(capitulo.codigo)}`}
        className="flex-1 flex items-center gap-[18px] py-[15px] min-w-0 -ml-1.5 pl-1.5"
      >
        <span className="shrink-0 text-[11px] tracking-[0.12em] text-text-faint tabular-nums w-[52px]">
          {capitulo.codigo}
        </span>
        <span className="flex-1 min-w-0 font-serif font-semibold text-[18px] leading-[1.25] truncate">
          {capitulo.titulo}
        </span>
        <EstadoPill estado={capitulo.estado} className="shrink-0" />
      </Link>
      <div className="w-10 pr-3.5 shrink-0 text-right">
        {puedeDescargar ? (
          <a
            href={`/api/capitulos/${capitulo.id}/docx`}
            title={`Descargar ${capitulo.codigo}`}
            className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-surface-hi cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.6}
              className="w-[15px] h-[15px] stroke-text-faint"
            >
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
            </svg>
          </a>
        ) : (
          <button
            disabled
            title="Completa el capítulo primero"
            className="w-7 h-7 rounded-md inline-flex items-center justify-center cursor-not-allowed"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.6}
              className="w-[15px] h-[15px] stroke-text-faint opacity-35"
            >
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
