import "server-only";
// @ts-expect-error -- sin tipos publicados
import HTMLtoDOCX from "html-to-docx";

function escapeHtml(valor: string): string {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function generarDocxCapitulo(titulo: string, contenidoHtml: string): Promise<Buffer> {
  const html = `<!DOCTYPE html><html><body><h1>${escapeHtml(titulo)}</h1>${contenidoHtml}</body></html>`;
  const buffer = await HTMLtoDOCX(html, null, {
    font: "Georgia",
    table: { row: { cantSplit: false } },
  });
  return Buffer.from(buffer);
}

export function nombreArchivoCapitulo(codigo: string): string {
  return `${codigo.replace(/\./g, "_")}.docx`;
}
