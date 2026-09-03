/**
 * Segmenta el texto extraído de un PDF de Diagnóstico en secciones por
 * epígrafe/subepígrafe.
 *
 * Hallazgo importante (comprobado contra el diagnóstico real de Osuna): el
 * diagnóstico NO usa el prefijo "MI." en sus propios títulos — esa etiqueta
 * ("Memoria de Información") solo aparece en la Memoria de Ordenación como
 * referencia cruzada. Los títulos reales del diagnóstico son numéricos
 * llanos: "1.7.  PATRIMONIO HISTÓRICO...", "4.4. VÍNCULOS DE PATRIMONIO...",
 * "1.1.1. Encuadre territorial". Por eso `mapeo_capitulos.seccion_diagnostico_codigo`
 * (p.ej. "MI.1.7") se compara aquí sin el prefijo — ver `sinPrefijoMI`.
 *
 * Limitación conocida: en algunos diagnósticos, el número de los capítulos
 * de nivel superior (p.ej. "4.") queda separado del título en la maquetación
 * del PDF (número y título en bloques de texto distintos), así que códigos
 * de un solo nivel ("2", "4", "6") pueden no encontrarse aunque el capítulo
 * exista. Los subepígrafes (p.ej. "1.7", "4.4", "1.1.1") sí se detectan bien.
 * Esto es exactamente el caso "sección no encontrada" que ya contempla el
 * producto (ver docs/02-arquitectura-motores.md) — no bloquea el resto.
 */

export type SeccionExtraida = {
  codigo: string;
  titulo: string;
  texto: string;
  orden: number;
};

const HEADING_RE = /^(\d{1,2}(?:\.\d{1,2}){0,3})\.[ \t]+(.{3,140})$/gm;

const NOISE_LINE_RE = /^(--\s*\d+\s*(de|of)\s*\d+\s*--|Índice|ÍNDICE)\s*$/;

export function sinPrefijoMI(codigoConPrefijo: string): string {
  return codigoConPrefijo.replace(/^MI\./i, "");
}

function nivel(codigo: string): number {
  return codigo.split(".").length;
}

function esMayusculas(titulo: string): boolean {
  const letras = titulo.replace(/[^\p{L}]/gu, "");
  return letras.length > 0 && letras === letras.toLocaleUpperCase("es");
}

export function parseDiagnostico(textoCompleto: string): SeccionExtraida[] {
  type Match = { codigo: string; titulo: string; index: number };
  const matches: Match[] = [];

  let m: RegExpExecArray | null;
  HEADING_RE.lastIndex = 0;
  while ((m = HEADING_RE.exec(textoCompleto)) !== null) {
    const codigo = m[1];
    const titulo = m[2].trim().replace(/\s+/g, " ");
    // Descarta líneas de índice/tabla de contenidos: llevan puntos-guía y un
    // número de página al final ("....... 145") en vez de prosa.
    if (/\.{3,}\s*\d+\s*$/.test(m[0]) || /\.{3,}\s*$/.test(titulo)) continue;
    // Los epígrafes de nivel 1-2 del diagnóstico van siempre en mayúsculas
    // ("PATRIMONIO HISTÓRICO...", "VÍNCULOS DE PATRIMONIO HISTÓRICO"). Un
    // código de 1-2 tramos con título en frase normal es casi siempre un
    // "1." o "4." de una lista enumerada dentro de un párrafo, no un
    // encabezado real — lo descartamos para no confundirlos.
    if (nivel(codigo) <= 2 && !esMayusculas(titulo)) continue;
    matches.push({ codigo, titulo, index: m.index });
  }

  // Un mismo código puede aparecer más de una vez si el patrón coincide por
  // casualidad; nos quedamos con la última aparición (la más probable de ser
  // el encabezado real seguido de contenido, no una mención de paso).
  const porCodigo = new Map<string, Match>();
  for (const match of matches) {
    porCodigo.set(match.codigo, match);
  }
  const ordenadas = [...porCodigo.values()].sort((a, b) => a.index - b.index);

  const secciones: SeccionExtraida[] = [];
  for (let i = 0; i < ordenadas.length; i++) {
    const actual = ordenadas[i];
    const nivelActual = nivel(actual.codigo);
    let fin = textoCompleto.length;
    for (let j = i + 1; j < ordenadas.length; j++) {
      if (nivel(ordenadas[j].codigo) <= nivelActual) {
        fin = ordenadas[j].index;
        break;
      }
    }
    const bruto = textoCompleto.slice(actual.index, fin);
    const texto = limpiarTexto(bruto);
    if (texto.length < 20) continue; // encabezado sin contenido propio (solo agrupa hijos)

    secciones.push({
      codigo: actual.codigo,
      titulo: actual.titulo,
      texto,
      orden: actual.index,
    });
  }

  return secciones;
}

function limpiarTexto(bruto: string): string {
  return bruto
    .split("\n")
    .filter((linea) => !NOISE_LINE_RE.test(linea.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
