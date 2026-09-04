import type { CapituloEstado } from "@/lib/supabase/types";

// Iconos del recuadro de estado — mismos glifos que el mockup (check,
// aviso, más, raya), para que el estado se identifique de un vistazo sin
// tener que leer la etiqueta.
const ICONO = {
  check: "m5 13 4 4L19 7",
  aviso: "M12 7.5v5.5M12 16.5h.01",
  mas: "M12 6v12M6 12h12",
  raya: "M6 12h12",
};

export const ESTADO_UI: Record<
  CapituloEstado,
  {
    ink: string;
    meterColor: string;
    pct: number;
    label: string;
    desc: string;
    icon: string;
    /** Clases Tailwind del recuadro (fondo + borde) usado por EstadoPill. */
    pillClass: string;
  }
> = {
  listo: {
    ink: "text-text",
    meterColor: "bg-text",
    pct: 100,
    label: "Listo",
    desc: "cerrado, se puede entregar",
    icon: ICONO.check,
    pillClass: "bg-cyan-wash border-text",
  },
  revisar: {
    ink: "text-violet",
    meterColor: "bg-amber",
    pct: 70,
    label: "Revisar",
    desc: "confirma los datos del diagnóstico",
    icon: ICONO.aviso,
    pillClass: "bg-transparent border-amber",
  },
  tu_aportacion: {
    ink: "text-text",
    meterColor: "bg-text",
    pct: 0,
    label: "Tu aportación",
    desc: "espera una tabla tuya",
    icon: ICONO.mas,
    pillClass: "bg-transparent border-text border-dashed",
  },
  sin_info: {
    ink: "text-text-faint",
    meterColor: "bg-text-faint",
    pct: 0,
    label: "Sin información",
    desc: "falta un dato del diagnóstico",
    icon: ICONO.raya,
    pillClass: "bg-transparent border-line-strong",
  },
};
