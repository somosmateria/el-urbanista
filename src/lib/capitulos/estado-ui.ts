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
    label: string;
    desc: string;
    icon: string;
    /** Clases Tailwind del recuadro (fondo + borde) usado por EstadoPill. */
    pillClass: string;
  }
> = {
  // Semáforo real (verde/ámbar/rojo) pero apagado, dentro de la paleta
  // tierra — no un verde/rojo saturado que desentone del resto.
  listo: {
    ink: "text-cyan-ink",
    label: "Listo",
    desc: "cerrado, se puede entregar",
    icon: ICONO.check,
    pillClass: "bg-cyan-wash border-cyan",
  },
  revisar: {
    ink: "text-amber-ink",
    label: "Revisar",
    desc: "confirma los datos del diagnóstico",
    icon: ICONO.aviso,
    pillClass: "bg-amber-wash border-amber",
  },
  tu_aportacion: {
    ink: "text-coral-ink",
    label: "Tu aportación",
    desc: "espera una tabla tuya",
    icon: ICONO.mas,
    pillClass: "bg-coral-wash border-coral border-dashed",
  },
  sin_info: {
    ink: "text-text-faint",
    label: "Sin información",
    desc: "falta un dato del diagnóstico",
    icon: ICONO.raya,
    pillClass: "bg-transparent border-line-strong",
  },
};
