import { createServiceClient } from "@/lib/supabase/server";
import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";

/**
 * MO.1 y MO.11 quedan fuera de la sustitución por Avance de referencia:
 * no son banco de texto fijo, extraen datos reales del diagnóstico de
 * cada municipio (plan vigente, colindantes) — ver 0009_plantilla_referencia.sql.
 */
export const CODIGOS_NO_SUSTITUIBLES = new Set(["MO.1", "MO.11"]);

/**
 * Límite de seguridad sobre el texto que se manda a Claude por cada
 * capítulo buscado — un Avance real cabe de sobra; esto solo protege
 * contra un PDF anormalmente largo.
 */
const MAX_CARACTERES = 400_000;

async function getCodigosSustituibles(): Promise<{ codigo: string; titulo: string }[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mapeo_capitulos")
    .select("capitulo_codigo, titulo_canonico")
    .eq("motor", "plantilla")
    .eq("activo", true)
    .order("orden");
  if (error) throw error;
  return data
    .filter((c) => !CODIGOS_NO_SUSTITUIBLES.has(c.capitulo_codigo))
    .map((c) => ({ codigo: c.capitulo_codigo, titulo: c.titulo_canonico }));
}

const SYSTEM_PROMPT = `Eres el motor de extracción de "Avance de referencia" de El Urbanista, una
herramienta de redacción de Memorias de Ordenación urbanística para un estudio de
urbanismo español.

Tu única función es localizar, dentro del texto completo de un Avance de Plan ya
redactado por el propio estudio, el contenido de UN capítulo concreto de la Memoria de
Ordenación, y devolverlo tal cual — nunca resumido, reescrito o mejorado. Este texto se
reutilizará como base para redactar el mismo capítulo en otros municipios.

Reglas estrictas:
- Si el documento no contiene un capítulo identificable para el código/título pedido,
  responde exactamente "NO_ENCONTRADO" y nada más.
- Si lo encuentras, transcribe su contenido ORIGINAL tal cual está escrito — cero
  resumen, cero invención, cero corrección de su contenido técnico.
- Devuelve HTML limpio: <p>...</p> para párrafos, <ol>/<li> para listas, <strong>/<em>
  donde el original ya los use. Nada de <h1>-<h6>, nada de markdown, nada de texto
  antes o después del HTML (ni siquiera el propio título del capítulo).
- Dondequiera que el texto mencione el nombre del municipio para el que se redactó
  este Avance originalmente, sustitúyelo por el marcador literal {{MUNICIPIO}} — el
  resto del texto se reutilizará tal cual para otros municipios distintos.`;

async function extraerCapitulo(
  textoCompleto: string,
  codigo: string,
  titulo: string
): Promise<string | null> {
  const anthropic = getAnthropicClient();
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Capítulo a localizar: ${codigo} — "${titulo}"\n\nTexto completo del Avance:\n"""\n${textoCompleto}\n"""`,
      },
    ],
  });

  const texto = respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  if (!texto || texto.includes("NO_ENCONTRADO")) return null;
  return texto;
}

/**
 * Busca, en paralelo, cada capítulo sustituible dentro del texto extraído
 * del Avance de referencia subido. Los que no se encuentran se omiten sin
 * más — el equipo se queda con el banco de texto por defecto para ese
 * capítulo en concreto (ver resolverPlantilla en ./index.ts).
 */
export async function segmentarReferencia(
  textoCompleto: string
): Promise<{ codigo: string; titulo: string; texto: string }[]> {
  const objetivo = await getCodigosSustituibles();
  if (objetivo.length === 0) return [];

  const truncado = textoCompleto.slice(0, MAX_CARACTERES);
  const resultados = await Promise.all(
    objetivo.map(async (o) => {
      const texto = await extraerCapitulo(truncado, o.codigo, o.titulo);
      return texto ? { codigo: o.codigo, titulo: o.titulo, texto } : null;
    })
  );
  return resultados.filter((r): r is { codigo: string; titulo: string; texto: string } => r !== null);
}
