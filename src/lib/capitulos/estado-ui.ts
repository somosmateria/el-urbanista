import type { CapituloEstado } from "@/lib/supabase/types";

export const ESTADO_UI: Record<
  CapituloEstado,
  {
    /** Punto relleno (estado con contenido) u hueco (a la espera de algo). */
    dotFilled: boolean;
    dotColor: string;
    ink: string;
    meterColor: string;
    pct: number;
    label: string;
    desc: string;
    /** Clases Tailwind para el pill de texto usado en listas compactas. */
    tagBg: string;
    tagText: string;
  }
> = {
  listo: {
    dotFilled: true,
    dotColor: "bg-text border-text",
    ink: "text-text",
    meterColor: "bg-text",
    pct: 100,
    label: "Listo",
    desc: "cerrado, se puede entregar",
    tagBg: "bg-cyan-wash",
    tagText: "text-cyan-ink",
  },
  revisar: {
    dotFilled: true,
    dotColor: "bg-amber border-amber",
    ink: "text-violet",
    meterColor: "bg-amber",
    pct: 70,
    label: "Revisar",
    desc: "confirma los datos del diagnóstico",
    tagBg: "bg-amber-wash",
    tagText: "text-amber-ink",
  },
  tu_aportacion: {
    dotFilled: false,
    dotColor: "bg-transparent border-text",
    ink: "text-text",
    meterColor: "bg-text",
    pct: 0,
    label: "Tu aportación",
    desc: "espera una tabla tuya",
    tagBg: "bg-violet-wash",
    tagText: "text-violet-ink",
  },
  sin_info: {
    dotFilled: false,
    dotColor: "bg-transparent border-line-strong",
    ink: "text-text-faint",
    meterColor: "bg-text-faint",
    pct: 0,
    label: "Sin información",
    desc: "falta un dato del diagnóstico",
    tagBg: "bg-transparent",
    tagText: "text-text-faint",
  },
};
