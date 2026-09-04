import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";
import type { CapituloTablaRow, CapituloTextoRow } from "@/lib/supabase/types";

const SYSTEM_PROMPT = `Eres el motor "asistido por tabla" de El Urbanista, una herramienta
de redacción de Memorias de Ordenación urbanística para un estudio de urbanismo español.

Tu única función es redactar el párrafo introductorio de un bloque de propuesta técnica
que el equipo redactor ya ha rellenado en una tabla (por ejemplo: áreas recreativas
propuestas, equipamientos, viario). La tabla que recibes es la única fuente de verdad
sobre qué se propone.

Reglas estrictas:
- No inventes, completes ni modifiques ninguna fila ni ningún dato de la tabla. Tu texto
  solo presenta y contextualiza lo que ya está en la tabla, nunca añade elementos nuevos.
- No repitas la tabla en tu respuesta — se renderiza aparte. Escribe solo el párrafo de
  introducción/contexto.
- Devuelve exclusivamente un único <p>...</p>. Nada de markdown, nada de listas, nada de
  texto antes o después.
- Registro: español técnico-administrativo, en tercera persona, como el resto de la
  Memoria de Ordenación.`;

function escapeHtml(valor: string): string {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Un bloque de texto libre no pasa por Claude — es lo que el técnico
 * escribió tal cual en el editor enriquecido (ver TextoBlockEditor.tsx),
 * solo se envuelve con la misma cabecera que un bloque de tabla para que
 * ambos se lean como parte del mismo documento.
 */
function renderBloqueTexto(texto: CapituloTextoRow): { html: string; createdAt: string } {
  return {
    createdAt: texto.updated_at,
    html: `
<div class="doc-eyebrow">${escapeHtml(texto.titulo.toUpperCase())}</div>
<div class="doc-text">${texto.contenido_html}</div>
`.trim(),
  };
}

function renderFilaTexto(tabla: CapituloTablaRow): string {
  return tabla.filas
    .map((fila) => tabla.columnas.map((col) => `${col}: ${fila[col] ?? ""}`).join(", "))
    .join("\n");
}

async function generarIntroBloque(tabla: CapituloTablaRow): Promise<string> {
  const anthropic = getAnthropicClient();
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Bloque: "${tabla.nombre_bloque}"\nColumnas: ${tabla.columnas.join(", ")}\nFilas:\n${renderFilaTexto(tabla)}\n\nRedacta el párrafo introductorio de este bloque.`,
      },
    ],
  });
  return respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function renderTablaHTML(tabla: CapituloTablaRow): string {
  const encabezado = tabla.columnas.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const filas = tabla.filas
    .map(
      (fila) =>
        `<tr>${tabla.columnas.map((c) => `<td>${escapeHtml(fila[c] ?? "")}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table class="data"><thead><tr>${encabezado}</tr></thead><tbody>${filas}</tbody></table>`;
}

/**
 * Motor 3 — asistido por tabla. Genera el texto envolvente de cada bloque de
 * tabla que ya tenga al menos una fila (acompañado de la tabla renderizada
 * tal cual la rellenó el usuario) y vuelca tal cual cada bloque de texto
 * libre — la única "aportación" que no pasa por Claude es la del propio
 * texto libre, que ya viene redactado. Los bloques de tabla todavía vacíos
 * se ignoran — "mientras la tabla esté vacía, el capítulo no se genera"
 * (ver docs/02-arquitectura-motores.md, Motor 3). Los bloques se
 * intercalan por la fecha en que se guardaron por última vez, para
 * respetar el orden en que el técnico los fue añadiendo/editando.
 *
 * Devuelve null si no hay ni una tabla con filas ni un bloque de texto.
 */
export async function generarCapituloTabla(
  tablas: CapituloTablaRow[],
  textos: CapituloTextoRow[] = []
): Promise<string | null> {
  const conFilas = tablas.filter((t) => t.filas.length > 0);
  const conTexto = textos.filter((t) => t.contenido_html.trim() !== "");
  if (conFilas.length === 0 && conTexto.length === 0) return null;

  const bloquesTabla = await Promise.all(
    conFilas.map(async (tabla) => ({
      createdAt: tabla.updated_at,
      html: `
<div class="doc-eyebrow">${escapeHtml(tabla.nombre_bloque.toUpperCase())}</div>
<div class="doc-text">${await generarIntroBloque(tabla)}</div>
${renderTablaHTML(tabla)}
`.trim(),
    }))
  );
  const bloquesTexto = conTexto.map(renderBloqueTexto);

  return [...bloquesTabla, ...bloquesTexto]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((b) => b.html)
    .join("\n\n");
}
