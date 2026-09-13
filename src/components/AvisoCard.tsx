import clsx from "clsx";
import { SubmitButton } from "@/components/SubmitButton";
import { AVISO_SEVERIDAD_UI, AVISO_TIPO_LABEL } from "@/lib/capitulos/aviso-ui";
import { resolverAvisoAction } from "@/app/avance/ordenacion/[municipioId]/[capitulo]/actions";
import type { CapituloAvisoRow } from "@/lib/supabase/types";

/**
 * Tarjeta de un aviso técnico (ver src/lib/motores/evaluacion) — nunca se
 * mezcla con `dangerouslySetInnerHTML` del contenido del capítulo: los
 * avisos viven en su propia tabla (`capitulo_avisos`) precisamente para que
 * no puedan filtrarse al .docx exportado.
 */
export function AvisoCard({
  municipioId,
  capituloId,
  aviso,
}: {
  municipioId: string;
  capituloId: string;
  aviso: CapituloAvisoRow;
}) {
  const ui = AVISO_SEVERIDAD_UI[aviso.severidad];
  return (
    <div className={clsx("rounded-lg border px-4 py-3 mb-2.5 flex items-start gap-3", ui.pillClass)}>
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx("shrink-0 mt-0.5", ui.ink)}
      >
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={clsx("text-[10px] tracking-[0.12em] uppercase font-semibold", ui.ink)}>
            {AVISO_TIPO_LABEL[aviso.tipo]}
          </span>
          {aviso.subepigrafe_codigo && (
            <span className="text-[10.5px] text-text-faint">{aviso.subepigrafe_codigo}</span>
          )}
        </div>
        <p className="text-[13px] text-text leading-relaxed">{aviso.mensaje}</p>
        {aviso.fuente && <p className="text-[11px] text-text-faint mt-1">Fuente: {aviso.fuente}</p>}
      </div>
      <form action={resolverAvisoAction.bind(null, municipioId, capituloId, aviso.id, true)}>
        <SubmitButton
          className="text-[11px] text-violet-ink whitespace-nowrap cursor-pointer hover:underline"
          pendingLabel="…"
        >
          Marcar como resuelto
        </SubmitButton>
      </form>
    </div>
  );
}
