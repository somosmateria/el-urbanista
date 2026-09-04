/**
 * Lógica de texto pura del Avance de referencia — parseo de la respuesta de
 * Claude y normalización de títulos para mostrar. Deliberadamente sin
 * ninguna dependencia de Supabase/Next/Anthropic: así se puede probar sin
 * arrastrar toda la cadena de imports de servidor (ver vitest.config.ts).
 */

// Siglas urbanísticas que se re-mayusculizan tras pasar un título gritado a
// formato normal — de lo contrario "pgou"/"pgom" quedarían en minúscula.
const SIGLAS = ["PGOM", "PGOU", "EAE", "GICA", "LOUA", "POT", "UE", "DIE", "SNU", "SUNC", "SUS"];

function pareceGritado(texto: string): boolean {
  const letras = texto.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  return letras.length > 3 && letras === letras.toUpperCase() && letras !== letras.toLowerCase();
}

function aFraseNormal(texto: string): string {
  const minusculas = texto.toLowerCase();
  const conMayusculas = minusculas.replace(/(^\s*\w|[.:]\s+\w)/g, (m) => m.toUpperCase());
  return conMayusculas.replace(new RegExp(`\\b(${SIGLAS.join("|")})\\b`, "gi"), (m) => m.toUpperCase());
}

/**
 * El título que Claude extrae de un Avance real viene tal cual lo escribió
 * el estudio en su día: a veces en MAYÚSCULAS, a veces con la numeración
 * propia del documento delante ("MO.4 ...", "1.4. ...") que no tiene nada
 * que ver con el código interno de El Urbanista. Aquí se limpia solo para
 * mostrarlo — nunca se reescribe lo que hay guardado en base de datos, así
 * que un ajuste aquí se aplica también a lo ya subido, sin reprocesar (y
 * sin volver a gastar en la API).
 */
export function normalizarTituloReferencia(bruto: string): string {
  let t = bruto.trim();
  t = t.replace(/^(?:MO\.\d+(?:\.\d+)*\.?|\d+(?:\.\d+)*\.)\s+/i, "");
  t = t.replace(/\.+$/, "").trim();
  if (pareceGritado(t)) t = aFraseNormal(t);
  return t;
}

/**
 * Parsea el formato de respuesta fijo que le pide el system prompt a Claude
 * en referencia.ts: "TITULO: <...>\n---\n<contenido>". Null cuando el
 * modelo responde NO_ENCONTRADO o no trae título — ese capítulo se omite,
 * no se guarda un título vacío.
 */
export function parsearRespuestaReferencia(bruto: string): { titulo: string; texto: string } | null {
  const separador = bruto.indexOf("\n---");
  const cabecera = (separador === -1 ? bruto : bruto.slice(0, separador)).trim();
  const cuerpo = separador === -1 ? "" : bruto.slice(separador + 4).replace(/^\n/, "").trim();

  const titulo = cabecera.replace(/^TITULO:\s*/i, "").trim();
  if (!titulo || titulo.includes("NO_ENCONTRADO")) return null;
  return { titulo, texto: cuerpo };
}
