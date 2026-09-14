import type { MotorTipo } from "@/lib/supabase/types";

/**
 * Cómo se redactó cada capítulo — visible en la lista de la memoria
 * (ChapterRow) y en la cabecera de su propia página, para saber de un
 * vistazo si el texto viene del diagnóstico (RAG), de un banco de texto
 * fijo/extraído por IA (plantilla) o de datos que ha rellenado el propio
 * equipo (tabla).
 */
export const MOTOR_LABEL: Record<MotorTipo, string> = {
  plantilla: "Plantilla",
  rag: "RAG dirigido",
  tabla: "Motor asistido por tabla",
};
