import "server-only";
// @ts-expect-error -- sin tipos publicados
import HTMLtoDOCX from "html-to-docx";

function escapeHtml(valor: string): string {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * El HTML que guardan los motores lleva anotaciones de uso interno que no
 * son parte del documento entregable:
 * - `.src-note` — nota de procedencia/plantilla para quien revisa en la
 *   app (p.ej. "FUENTE — Diagnóstico · MI.1.7"). Se descarta entera.
 * - `.doc-eyebrow` — normalmente repite el título del capítulo (ya va
 *   como H1 más abajo), pero en el motor de tabla es el nombre real del
 *   bloque (p.ej. "PARQUE PERIURBANO DEL COTO") — no se puede tirar sin
 *   más. Se convierte en un H2 en vez de quedarse como párrafo normal,
 *   así entra en la jerarquía del documento en los dos casos.
 */
function limpiarParaExportar(html: string): string {
  return html
    .replace(/<div class="src-note">[\s\S]*?<\/div>/g, "")
    .replace(/<div class="doc-eyebrow">([\s\S]*?)<\/div>/g, "<h2>$1</h2>");
}

export async function generarDocxCapitulo(titulo: string, contenidoHtml: string): Promise<Buffer> {
  const cuerpo = limpiarParaExportar(contenidoHtml);
  const html = `<!DOCTYPE html><html><body><h1>${escapeHtml(titulo)}</h1>${cuerpo}</body></html>`;
  const buffer = await HTMLtoDOCX(html, null, {
    font: "Georgia",
    // 24 HIP = 12pt — el texto del cuerpo debe leerse como un documento
    // normal, no en el 11pt por defecto de la librería.
    fontSize: 24,
    table: { row: { cantSplit: false } },
  });
  return Buffer.from(buffer);
}

export function nombreArchivoCapitulo(codigo: string): string {
  return `${codigo.replace(/\./g, "_")}.docx`;
}
