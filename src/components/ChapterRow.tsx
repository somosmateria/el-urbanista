import Link from "next/link";
import clsx from "clsx";
import { ESTADO_UI } from "@/lib/capitulos/estado-ui";
import type { CapituloRow } from "@/lib/supabase/types";

export function ChapterRow({
  municipioId,
  capitulo,
}: {
  municipioId: string;
  capitulo: CapituloRow;
}) {
  const ui = ESTADO_UI[capitulo.estado];
  const puedeDescargar = capitulo.estado === "listo" || capitulo.estado === "revisar";

  return (
    <div className="flex items-center border-b border-line last:border-b-0">
      <Link
        href={`/avance/ordenacion/${municipioId}/${encodeURIComponent(capitulo.codigo)}`}
        className="flex-1 flex items-center gap-3 px-[18px] py-3.5 hover:bg-surface-hi min-w-0"
      >
        <span className={clsx("w-2 h-2 rounded-full shrink-0", ui.dot)} />
        <span className="font-medium text-[13.5px] truncate">
          {capitulo.codigo} — {capitulo.titulo}
        </span>
        <span className="flex-1" />
        <span
          className={clsx(
            "font-mono text-[11px] px-2.5 py-1 rounded-full shrink-0",
            ui.tagBg,
            ui.tagText
          )}
        >
          {ui.label}
        </span>
      </Link>
      <div className="w-10 pr-[14px] shrink-0 text-right">
        {puedeDescargar ? (
          <a
            href={`/api/capitulos/${capitulo.id}/docx`}
            title={`Descargar ${capitulo.codigo}`}
            className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-surface-hi cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.8}
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
              strokeWidth={1.8}
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
