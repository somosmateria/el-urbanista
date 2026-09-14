import { createServiceClient } from "@/lib/supabase/server";
import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";
import { parsearRespuestaReferencia } from "@/lib/texto/avance-referencia";

/**
 * Códigos que quedan fuera de la SUSTITUCIÓN DE CONTENIDO por Avance de
 * referencia, por dos motivos distintos. Su TÍTULO sí se toma del
 * documento igual que el resto (ver TituloDeReferencia más abajo): calcar
 * los nombres tal cual los usa el equipo no tiene ninguno de estos riesgos.
 *
 * - MO.1 y MO.11: no son banco de texto fijo, extraen datos reales del
 *   diagnóstico de cada municipio (plan vigente, colindantes) — ver
 *   0009_plantilla_referencia.sql.
 * - MO.4, MO.8, MO.9, MO.10, MO.12: al revés que MO.1/MO.11, SÍ son banco
 *   de texto fijo — pero uno ya confirmado palabra por palabra idéntico
 *   entre los dos Avances reales disponibles (ver el aviso en cada
 *   mo*.ts), sin ningún dato de municipio que insertar. Sustituirlos no
 *   aporta nada (no hay nada que personalizar) y sí puede empeorar el
 *   resultado: comprobado en producción con Los Palacios y Villafranca,
 *   la extracción por título del PDF de referencia del equipo devolvió
 *   solo un fragmento de MO.4 (usos globales de suelo urbano), sin las
 *   secciones de usos en suelo rústico ni de actividades incompatibles
 *   que sí trae la plantilla fija — el documento real empaqueta ese
 *   contenido de forma distinta a como lo separa El Urbanista (ver
 *   también la nota de mo9.ts/mo12.ts sobre este mismo desajuste de
 *   empaquetado), así que buscar por título puede cortar a mitad.
 * - MO.2, MO.3.2, MO.3.1.4, MO.5.1, MO.5.2, MO.5.2.2, MO.5.3, MO.5.4,
 *   MO.6.1, MO.7: comprobado al rellenar el Avance de referencia del
 *   equipo (Lora del Río) — su "marco conceptual común" en el documento
 *   real trae intercalado contenido irreducible de ESE municipio: nombres
 *   de parques y monumentos propios (MO.3.2 "Castillo de Lora del Río",
 *   MO.6.1 BIC catalogados con fecha BOJA/BOE), carreteras y códigos de
 *   vía concretos (MO.3.1.4/MO.5.1/MO.5.2, p.ej. "A-457 de Carmona a Lora
 *   del Río", "SE-6102"), equipamientos e inversiones municipales
 *   concretas con nombre propio (MO.5.3 "Polideportivo Municipal de Lora
 *   del Río Antonio Trigo Merlo", MO.5.4 plan de inversiones del agua del
 *   ayuntamiento), y observaciones locales (MO.7: barrios, comunidades
 *   migrantes, actuaciones ya hechas por el ayuntamiento — MO.7 ya lo
 *   documentaba así antes de tener Avance de referencia, ver su propio
 *   archivo). No es sustituible por {{MUNICIPIO}}: aunque se sustituyera
 *   el nombre, el resto del dato (una carretera, un monumento, un
 *   equipamiento, un barrio) sigue siendo de Lora del Río y no de otro
 *   municipio. Se deja fuera en vez de arriesgarse a que se cuele en el
 *   documento de otro municipio.
 *
 * Además de esta lista, `resolverPlantilla` (./index.ts) comprueba en
 * tiempo real que el contenido del Avance de referencia no mencione a
 * ningún otro municipio del equipo antes de usarlo — esta lista deja de
 * ser la única barrera, es la que evita gastar esa comprobación en casos
 * ya sabidos.
 */
export const CODIGOS_NO_SUSTITUIBLES = new Set([
  "MO.1",
  "MO.11",
  "MO.2",
  "MO.4",
  "MO.8",
  "MO.9",
  "MO.10",
  "MO.12",
  "MO.3.1.4",
  "MO.3.2",
  "MO.5.1",
  "MO.5.2",
  "MO.5.2.2",
  "MO.5.3",
  "MO.5.4",
  "MO.6.1",
  "MO.7",
]);

type CodigoObjetivo = { codigo: string; titulo: string; motor: string; sustituible: boolean };

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

/**
 * Todos los capítulos y subepígrafes activos, no solo los "sustituibles"
 * — el título de un capítulo se calca del Avance del equipo
 * independientemente de su motor (rag/tabla/plantilla) o de si su
 * contenido se sustituye o no; lo único que varía por motor es si
 * además se le pide el contenido completo.
 */
async function getTodosLosCodigos(): Promise<CodigoObjetivo[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mapeo_capitulos")
    .select("capitulo_codigo, titulo_canonico, motor")
    .eq("activo", true)
    .order("orden");
  if (error) throw error;
  return data.map((c) => ({
    codigo: c.capitulo_codigo,
    titulo: c.titulo_canonico,
    motor: c.motor,
    sustituible: c.motor === "plantilla" && !CODIGOS_NO_SUSTITUIBLES.has(c.capitulo_codigo),
  }));
}

/**
 * Comprobado contra un caso real (Lora del Río): si se le pasa a Claude el
 * código "MO.X" tal cual junto al título, tiende a dejarse guiar por que
 * el DOCUMENTO use ese mismo código para otra cosa — el Avance real de
 * Lora del Río numera sus propios capítulos con un desfase respecto al
 * de El Urbanista a partir del 9 (su "MO.10" es la compatibilización con
 * colindantes, que aquí es "MO.11"), y pedir "MO.10" devolvió por error
 * el contenido de colindantes. Por eso ni el código ni la palabra "MO."
 * se le pasan al modelo — se busca solo por título/tema, y se le avisa
 * explícitamente de que el documento puede numerar distinto o no numerar
 * en absoluto.
 */
function systemPrompt(todosLosTitulos: string[]): string {
  const listado = todosLosTitulos.map((t) => `- ${t}`).join("\n");
  return `Eres el motor de extracción de "Avance de referencia" de El Urbanista, una
herramienta de redacción de Memorias de Ordenación urbanística para un estudio de
urbanismo español.

Tu función es localizar, dentro del texto completo de un Avance de Plan ya
redactado por el propio estudio, UN tema concreto de la Memoria de Ordenación, y
devolver (a) el título EXACTO que ese tema tiene en el documento — tal cual está
escrito, con su numeración propia si la tiene, por muy largo que sea, sin
resumirlo ni acortarlo — y, si se te pide, (b) su contenido completo tal cual,
nunca resumido, reescrito o mejorado. Este título y este contenido se reutilizarán
como base para redactar el mismo capítulo en otros municipios.

En cada petición se te pide un tema por su título de referencia (el que usa
El Urbanista internamente). Identifica la sección correspondiente en el documento
SOLO por su contenido/tema — el documento puede numerar sus propios capítulos de
forma distinta a como los agrupa El Urbanista (un mismo número puede corresponder
a un tema distinto, o el documento puede no usar numeración "MO." en absoluto). No
te dejes guiar por ninguna numeración que encuentres en el documento: lee de qué
trata cada sección y compáralo con el tema pedido.

Estos son TODOS los temas que se pueden llegar a pedir por separado, uno por
petición — te sirven para no confundir un tema con el de al lado (p.ej. no mezcles
"compatibilización con municipios colindantes" con "planificación estratégica del
modelo", son dos temas distintos aunque estén cerca en el documento):
${listado}

Formato de respuesta — EXACTAMENTE así, nada antes ni después:
TITULO: <título tal cual aparece en el documento para esa sección, o NO_ENCONTRADO
si el documento no trae una sección identificable para el tema pedido>
---
<aquí el contenido si se pidió; vacío si no se pidió, o si no se encontró>

Reglas estrictas:
- El título va SIEMPRE tal cual lo escribió el documento — nunca el título de
  referencia que se te dio en la petición (ese es solo para que sepas qué buscar).
- Si se te pide el contenido y lo encuentras, transcríbelo ORIGINAL tal cual está
  escrito — cero resumen, cero invención, cero corrección de su contenido técnico.
  Incluye la sección completa, no solo su inicio.
- El contenido, si se pide, va en HTML limpio: <p>...</p> para párrafos, <ol>/<li>
  para listas, <strong>/<em> donde el original ya los use. Nada de <h1>-<h6>, nada
  de markdown, y nunca repitas el título dentro del contenido.
- Ignora cabeceras/pies de página repetidos, numeración de página suelta ("-- 12 of
  340 --") y marcas de firma digital — no son parte del título ni del contenido.
- Dondequiera que el título o el contenido mencionen el nombre del municipio para
  el que se redactó este Avance originalmente, sustitúyelo por el marcador literal
  {{MUNICIPIO}} — se reutilizará tal cual para otros municipios distintos.`;
}

/**
 * Un capítulo real y extenso puede necesitar bastante más que unos pocos
 * párrafos — comprobado contra un caso real (Lora del Río) donde dos de
 * diez capítulos agotaron 16.000 tokens sin llegar al final. Sigue
 * habiendo un límite duro: un capítulo excepcionalmente largo puede
 * quedar cortado a mitad de frase — riesgo residual conocido, no
 * resuelto del todo (haría falta extracción por continuación en varias
 * llamadas, fuera de alcance por ahora).
 *
 * IMPORTANTE: por encima de ~21.333 (128000 × 10/60), el propio SDK de
 * Anthropic rechaza la llamada sin streaming con "Streaming is required
 * for operations that may take longer than 10 minutes" — pasó
 * desapercibido en pruebas con pocos temas a la vez y reventó los 26 en
 * producción (0 capítulos encontrados, sin marcar error). Por eso la
 * llamada de abajo usa `.stream().finalMessage()` en vez de `.create()`
 * — mismo resultado, sin ese límite de 10 minutos.
 */
const MAX_TOKENS_RESPUESTA = 24_000;

async function extraerCapitulo(
  textoCompleto: string,
  objetivo: CodigoObjetivo,
  system: string
): Promise<{ titulo: string; texto: string } | null> {
  try {
    const anthropic = getAnthropicClient();
    const peticion = objetivo.sustituible
      ? `Tema a localizar en el texto de arriba: "${objetivo.titulo}". Devuelve su título exacto Y su contenido completo.`
      : `Tema a localizar en el texto de arriba: "${objetivo.titulo}". Devuelve SOLO su título exacto — dentro del formato pedido, deja el contenido después de "---" vacío, no hace falta transcribirlo.`;

    const stream = anthropic.messages.stream({
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
            { type: "text", text: peticion },
          ],
        },
      ],
    });
    const respuesta = await stream.finalMessage();
    // Coste real por llamada — la caché de `textoCompleto` solo ahorra si
    // esta llamada de verdad llega después de que la primera ya haya
    // escrito la caché (con varias llamadas en paralelo no está
    // garantizado, ver el comentario de más arriba); este log deja verlo.
    console.log(
      `[plantilla-referencia] "${objetivo.codigo}" — input:${respuesta.usage.input_tokens} cache_write:${respuesta.usage.cache_creation_input_tokens ?? 0} cache_read:${respuesta.usage.cache_read_input_tokens ?? 0} output:${respuesta.usage.output_tokens}`
    );

    const bruto = respuesta.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return bruto ? parsearRespuestaReferencia(bruto) : null;
  } catch (error) {
    // Un capítulo que falla (límite de contexto, timeout puntual...) no
    // debe tirar abajo el procesado de los demás — se omite como si no se
    // hubiera encontrado, igual que el resto de "no localizado" en este
    // motor (ver el resto del archivo y src/lib/motores/rag/index.ts).
    console.error(`[plantilla-referencia] Fallo al extraer "${objetivo.titulo}":`, error);
    return null;
  }
}

/**
 * Busca, en paralelo, cada capítulo y subepígrafe activo dentro del
 * texto extraído del Avance de referencia subido — título siempre,
 * contenido completo solo para los sustituibles (ver
 * CODIGOS_NO_SUSTITUIBLES y resolverPlantilla en ./index.ts). Los que no
 * se encuentran (o fallan) se omiten sin más: el equipo se queda con el
 * título/banco de texto por defecto para ese capítulo en concreto.
 */
export async function segmentarReferencia(
  textoCompleto: string
): Promise<{ codigo: string; titulo: string; texto: string }[]> {
  return segmentarReferenciaParcial(textoCompleto, null);
}

/**
 * Igual que `segmentarReferencia`, pero puede acotarse a un subconjunto de
 * códigos (`soloCodigos`) en vez de volver a pedir los ~30 de golpe —
 * pensado para rellenar solo los que faltan o cambiaron de "sustituible"
 * desde el último procesado (ver mapeo_capitulos y CODIGOS_NO_SUSTITUIBLES),
 * sin gastar de nuevo en los que ya están bien. La lista de títulos que ve
 * el modelo para no confundir temas cercanos sigue siendo la completa,
 * aunque solo se pidan unos pocos — mismo contexto, menos llamadas.
 */
export async function segmentarReferenciaParcial(
  textoCompleto: string,
  soloCodigos: string[] | null
): Promise<{ codigo: string; titulo: string; texto: string }[]> {
  const todos = await getTodosLosCodigos();
  if (todos.length === 0) return [];

  const objetivo = soloCodigos ? todos.filter((o) => soloCodigos.includes(o.codigo)) : todos;
  if (objetivo.length === 0) return [];

  const system = systemPrompt(todos.map((o) => o.titulo));
  const truncado = textoCompleto.slice(0, MAX_CARACTERES);
  const resultados = await Promise.all(
    objetivo.map(async (o) => {
      const encontrado = await extraerCapitulo(truncado, o, system);
      return encontrado ? { codigo: o.codigo, titulo: encontrado.titulo, texto: encontrado.texto } : null;
    })
  );
  return resultados.filter((r): r is { codigo: string; titulo: string; texto: string } => r !== null);
}
