import type { AvisoSeveridad, AvisoTipo } from "@/lib/supabase/types";

// Misma paleta semáforo que ESTADO_UI (ver estado-ui.ts) — coral/ámbar/cian
// para alta/media/baja, coherente con el resto de la app.
export const AVISO_SEVERIDAD_UI: Record<AvisoSeveridad, { ink: string; pillClass: string; label: string }> = {
  alta: { ink: "text-coral-ink", pillClass: "bg-coral-wash border-coral", label: "Alta" },
  media: { ink: "text-amber-ink", pillClass: "bg-amber-wash border-amber", label: "Media" },
  baja: { ink: "text-cyan-ink", pillClass: "bg-cyan-wash border-cyan", label: "Baja" },
};

export const AVISO_TIPO_LABEL: Record<AvisoTipo, string> = {
  revision_tecnica: "Revisión técnica",
  informacion_no_localizada: "Información no localizada",
  decision_equipo: "Decisión del equipo redactor",
  posible_contaminacion: "Posible dato de otro municipio",
  contenido_generico: "Contenido genérico",
};

export type BucketValoracion = "verde" | "ambar" | "rojo";

export const BUCKET_UI: Record<BucketValoracion, { ink: string; pillClass: string; icono: string }> = {
  verde: { ink: "text-cyan-ink", pillClass: "bg-cyan-wash border-cyan", icono: "🟢" },
  ambar: { ink: "text-amber-ink", pillClass: "bg-amber-wash border-amber", icono: "🟠" },
  rojo: { ink: "text-coral-ink", pillClass: "bg-coral-wash border-coral", icono: "🔴" },
};

/**
 * Un capítulo con puntuación alta pero con un aviso de severidad alta sin
 * resolver (p.ej. una decisión cartográfica pendiente, o contaminación
 * entre municipios) no puede leerse como "bien resuelto" solo porque el
 * texto en sí esté bien redactado — el aviso manda sobre la puntuación.
 */
export function calcularBucket(puntuacionTotal: number, tieneAvisoAltaSinResolver: boolean): BucketValoracion {
  if (tieneAvisoAltaSinResolver) return "rojo";
  if (puntuacionTotal >= 80) return "verde";
  if (puntuacionTotal >= 50) return "ambar";
  return "rojo";
}
