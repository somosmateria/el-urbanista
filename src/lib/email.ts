import "server-only";
import { Resend } from "resend";

let cliente: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Falta RESEND_API_KEY en el entorno.");
  }
  if (!cliente) cliente = new Resend(process.env.RESEND_API_KEY);
  return cliente;
}

/**
 * "El Urbanista <hello@elurbanista.es>" solo entrega de verdad una vez el
 * dominio elurbanista.es esté verificado en Resend (panel de Resend →
 * Domains → añadir el dominio y los registros DNS que dé — eso no se puede
 * hacer desde aquí, hace falta acceso al panel de Resend y al DNS del
 * dominio). Hasta entonces Resend rechaza el envío; se captura como
 * cualquier otro fallo de email (ver enviarAvisoAsignacion) y no bloquea
 * nada de la app.
 */
const REMITENTE = process.env.RESEND_FROM_EMAIL ?? "El Urbanista <onboarding@resend.dev>";

/**
 * Aviso por email al asignar un capítulo como tarea a alguien del equipo
 * (ver src/lib/data/tareas.ts). Falla en silencio — un email que no llega
 * no debe impedir que la asignación en sí se guarde; quien llama solo hace
 * console.error si esto lanza.
 */
export async function enviarAvisoAsignacion(params: {
  email: string;
  municipioNombre: string;
  capituloCodigo: string;
  capituloTitulo: string;
  url: string;
}) {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: REMITENTE,
    to: params.email,
    subject: `Te han asignado ${params.capituloCodigo} · ${params.municipioNombre}`,
    html: `
<p>Te han asignado un capítulo en El Urbanista:</p>
<p><strong>${params.capituloCodigo} · ${params.capituloTitulo}</strong><br>
${params.municipioNombre}</p>
<p><a href="${params.url}">Abrir el capítulo</a></p>
`.trim(),
  });
  if (error) throw new Error(error.message);
}
