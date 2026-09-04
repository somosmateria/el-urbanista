"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

/**
 * Botón de envío que se desactiva mientras la Server Action del formulario
 * está en marcha — sin esto, un formulario que tarda en refrescar la
 * página (o simplemente parece no responder) invita a hacer doble clic,
 * y cada clic de más crea otra fila (visto en producción: dos bloques de
 * tabla idénticos, un equipo duplicado).
 */
export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={clsx(className, "disabled:opacity-50 disabled:cursor-not-allowed")}>
      {pending ? (pendingLabel ?? "…") : children}
    </button>
  );
}
