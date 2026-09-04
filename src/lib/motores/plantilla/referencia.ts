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
 * capítulo buscado. Un Avance real completo (Memoria de Información +
 * Memoria de Ordenación en un solo PDF, cientos de páginas) puede rondar
 * el millón de caracteres — comprobado contra un caso real (Lora del
 * Río, ~1,11M caracteres extraídos, la Memoria de Ordenación empieza
 * pasado el 55% del documento). Este límite solo protege contra un PDF
 * anormalmente largo, no recorta casos reales.
 */
const MAX_CARACTERES = 1_500_000;

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

/**
 * Comprobado contra un caso real (Lora del Río): si se le pasa a Claude el
 * código "MO.X" tal cual junto al título, tiende a dejarse guiar por que
 * el DOCUMENTO use ese mismo código para otra cosa — el Avance real de
 * Lora del Río numera sus propios capítulos con un desfase respecto al
 * de El Urbanista a partir del 9 (su "MO.10" es la compatibilización con
 * colindantes, que aquí es "MO.11"), y pedir "MO.10" devolvió por error
 * el contenido de colindantes. Por eso ni el código ni la palabra "MO."
 * se le pasan al modelo — se busca solo por título, y se le avisa
 * explícitamente de que el documento puede numerar distinto o no numerar
 * en absoluto.
 */
function systemPrompt(todosLosTitulos: string[]): string {
  const listado = todosLosTitulos.map((t) => `- ${t}`).join("\n");
  return `Eres el motor de extracción de "Avance de referencia" de El Urbanista, una
herramienta de redacción de Memorias de Ordenación urbanística para un estudio de
urbanismo español.

Tu única función es localizar, dentro del texto completo de un Avance de Plan ya
redactado por el propio estudio, el contenido correspondiente a UN tema concreto de
la Memoria de Ordenación, y devolverlo tal cual — nunca resumido, reescrito o
mejorado. Este texto se reutilizará como base para redactar el mismo capítulo en
otros municipios.

En cada petición se te pide un tema por su título. Identifícalo SOLO por su
contenido — el documento puede numerar sus propios capítulos de forma distinta a
como los agrupa El Urbanista (un mismo número puede corresponder a un tema
distinto, o el documento puede no usar numeración "MO." en absoluto). No te dejes
guiar por ninguna numeración que encuentres en el documento: lee de qué trata cada
sección y compáralo con el título pedido.

Estos son TODOS los temas que se pueden llegar a pedir por separado, uno por
petición — te sirven para no confundir un tema con el de al lado (p.ej. no mezcles
"compatibilización con municipios colindantes" con "planificación estratégica del
modelo", son dos temas distintos aunque estén cerca en el documento):
${listado}

Reglas estrictas:
- Si el documento no contiene una sección identificable por su tema para el título
  pedido, responde exactamente "NO_ENCONTRADO" y nada más.
- Si la encuentras, transcribe su contenido ORIGINAL tal cual está escrito — cero
  resumen, cero invención, cero corrección de su contenido técnico. Incluye la
  sección completa, no solo su inicio.
- Devuelve HTML limpio: <p>...</p> para párrafos, <ol>/<li> para listas, <strong>/<em>
  donde el original ya los use. Nada de <h1>-<h6>, nada de markdown, nada de texto
  antes o después del HTML (ni siquiera el propio título o número del capítulo).
- Ignora cabeceras/pies de página repetidos, numeración de página suelta ("-- 12 of
  340 --") y marcas de firma digital — no son parte del contenido.
- Dondequiera que el texto mencione el nombre del municipio para el que se redactó
  este Avance originalmente, sustitúyelo por el marcador literal {{MUNICIPIO}} — el
  resto del texto se reutilizará tal cual para otros municipios distintos.`;
}

/**
 * Un capítulo real y extenso puede necesitar bastante más que unos pocos
 * párrafos — comprobado contra un caso real (Lora del Río) donde dos de
 * diez capítulos agotaron 16.000 tokens sin llegar al final. Sigue
 * habiendo un límite duro: un capítulo excepcionalmente largo puede
 * quedar cortado a mitad de frase — riesgo residual conocido, no
 * resuelto del todo (haría falta extracción por continuación en varias
 * llamadas, fuera de alcance por ahora).
 */
const MAX_TOKENS_RESPUESTA = 24_000;

async function extraerCapitulo(
  textoCompleto: string,
  titulo: string,
  system: string
): Promise<string | null> {
  try {
    const anthropic = getAnthropicClient();
    const respuesta = await anthropic.messages.create({
      model: MODELO_GENERACION,
      max_tokens: MAX_TOKENS_RESPUESTA,
      // Sin esto, con un documento de cientos de miles de tokens el modelo
      // puede gastarse todo max_tokens "pensando" sin llegar a escribir la
      // respuesta (comprobado: 16000/16000 tokens de thinking, cero texto,
      // en un capítulo real) — esta es una tarea de localizar y
      // transcribir, no de razonar, así que no le hace falta.
      thinking: { type: "disabled" },
      system,
      messages: [
        {
          role: "user",
          content: [
            {
              // El texto completo del documento es idéntico en las N llamadas
              // en paralelo (una por tema buscado) — marcado como bloque
              // cacheable para que solo la primera lo pague entero.
              type: "text",
              text: `Texto completo del Avance:\n"""\n${textoCompleto}\n"""`,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: `Tema a localizar en el texto de arriba: "${titulo}"`,
            },
          ],
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
  } catch (error) {
    // Un capítulo que falla (límite de contexto, timeout puntual...) no
    // debe tirar abajo el procesado de los demás — se omite como si no se
    // hubiera encontrado, igual que el resto de "no localizado" en este
    // motor (ver el resto del archivo y src/lib/motores/rag/index.ts).
    console.error(`[plantilla-referencia] Fallo al extraer "${titulo}":`, error);
    return null;
  }
}

/**
 * Busca, en paralelo, cada capítulo sustituible dentro del texto extraído
 * del Avance de referencia subido. Los que no se encuentran (o fallan) se
 * omiten sin más — el equipo se queda con el banco de texto por defecto
 * para ese capítulo en concreto (ver resolverPlantilla en ./index.ts).
 */
export async function segmentarReferencia(
  textoCompleto: string
): Promise<{ codigo: string; titulo: string; texto: string }[]> {
  const objetivo = await getCodigosSustituibles();
  if (objetivo.length === 0) return [];

  const system = systemPrompt(objetivo.map((o) => o.titulo));
  const truncado = textoCompleto.slice(0, MAX_CARACTERES);
  const resultados = await Promise.all(
    objetivo.map(async (o) => {
      const texto = await extraerCapitulo(truncado, o.titulo, system);
      return texto ? { codigo: o.codigo, titulo: o.titulo, texto } : null;
    })
  );
  return resultados.filter((r): r is { codigo: string; titulo: string; texto: string } => r !== null);
}
