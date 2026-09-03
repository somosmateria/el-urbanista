import type { CapituloEstado } from "@/lib/supabase/types";

export const ESTADO_UI: Record<
  CapituloEstado,
  { dot: string; tagBg: string; tagText: string; label: string }
> = {
  listo: {
    dot: "bg-cyan shadow-[0_0_8px_rgba(31,239,203,0.6)]",
    tagBg: "bg-cyan-wash",
    tagText: "text-cyan-ink",
    label: "Listo",
  },
  revisar: {
    dot: "bg-amber shadow-[0_0_8px_rgba(255,176,32,0.6)]",
    tagBg: "bg-amber-wash",
    tagText: "text-amber-ink",
    label: "Revisar",
  },
  tu_aportacion: {
    dot: "bg-violet shadow-[0_0_8px_rgba(184,75,255,0.6)]",
    tagBg: "bg-violet-wash",
    tagText: "text-violet-ink",
    label: "Tu aportación",
  },
  sin_info: {
    dot: "bg-text-faint",
    tagBg: "bg-white/5",
    tagText: "text-text-faint",
    label: "Sin información",
  },
};
