import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";
import { getSubepigrafes } from "@/lib/data/mapeo";
import { getSeccionReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import { guardarEvaluacion, reemplazarAvisosAutomaticos } from "@/lib/data/evaluacion";
import { limpiarParaExportar } from "@/lib/export/docx";
import { detectarContaminacion } from "./contaminacion";
import type { AvisoTipo, AvisoSeveridad, CapituloEstado, CapituloRow, DesgloseEvaluacion, MunicipioRow } from "@/lib/supabase/types";

export type AvisoPendiente = {
  subepigrafeCodigo: string | null;
  tipo: AvisoTipo;
  severidad: AvisoSeveridad;
  mensaje: string;
  fuente: string | null;
};

export type ResultadoEvaluacion = {
  puntuacionTotal: number;
  desglose: DesgloseEvaluacion;
  problemaPrincipal: string | null;
  pendientePrincipal: string | null;
  modelo: string | null;
  avisos: AvisoPendiente[];
};

/**
 * Capítulos de plantilla ya confirmados palabra por palabra idénticos
 * entre los Avances reales disponibles, sin ningún dato de municipio que
 * insertar (ver el aviso en cada mo*.ts y `CODIGOS_NO_SUSTITUIBLES` en
 * motores/plantilla/referencia.ts, que excluye estos mismos códigos de la
 * sustitución por el Avance de referencia por el mismo motivo). Evaluarlos
 * con Claude no aportaría nada — la puntuación es una consecuencia directa
 * de ser texto normativo fijo, no algo que haya que "leer y opinar" cada
 * vez — así que se calcula con una regla fija, sin coste de API.
 */
export const CODIGOS_PLANTILLA_INVARIANTE = new Set(["MO.4", "MO.8", "MO.9", "MO.10", "MO.12"]);

/**
 * Punto único de entrada: evalúa un capítulo YA GENERADO (nunca genera ni
 * corrige contenido) y devuelve la puntuación 0-100 con su desglose, el
 * problema/pendiente principal, y los avisos deterministas que se
 * desprenden de comparar lo generado contra lo que se esperaba generar
 * (subepígrafes ausentes de un capítulo mixto). La detección de
 * contaminación entre municipios vive aparte, en `./contaminacion.ts` —
 * necesita datos de otros municipios que esta función no conoce.
 *
 * Devuelve `null` si el capítulo no tiene contenido (nada que evaluar).
 */
export async function evaluarCapitulo(
  capitulo: Pick<CapituloRow, "id" | "codigo" | "motor" | "estado" | "contenido_html">,
  municipio: Pick<MunicipioRow, "nombre">,
  equipoId: string
): Promise<ResultadoEvaluacion | null> {
  if (!capitulo.contenido_html) return null;
  // Se evalúa el texto tal como quedaría en el documento entregado, no el
  // HTML crudo guardado — sin esto, una nota `.src-note` de desarrollo que
  // compara el municipio con Osuna/Lora del Río a efectos de verificación
  // se leería como una contaminación real entre municipios (falso positivo
  // encontrado verificando esto mismo contra datos reales).
  const contenido = limpiarParaExportar(capitulo.contenido_html);

  const avisosSubepigrafesFaltantes = await detectarSubepigrafesFaltantes(capitulo.codigo, contenido);

  if (CODIGOS_PLANTILLA_INVARIANTE.has(capitulo.codigo)) {
    return {
      ...evaluarPlantillaInvariante(contenido, capitulo.estado, municipio.nombre),
      avisos: avisosSubepigrafesFaltantes,
    };
  }

  const referencia = await recopilarReferenciaDelEquipo(capitulo.codigo, equipoId);
  const viaClaude = await evaluarConClaude(capitulo.codigo, contenido, municipio.nombre, referencia);
  if (!viaClaude) return null;

  return { ...viaClaude, avisos: [...avisosSubepigrafesFaltantes, ...viaClaude.avisos] };
}

/**
 * Reúne, si existe, el texto que el propio equipo ya tiene confirmado como
 * válido para este código en su Avance de referencia (y en los de sus
 * subepígrafes, si es un capítulo mixto) — para que la puntuación de
 * "especificidad"/"fundamentación" no la decida Claude por su cuenta desde
 * cero, sino comparando contra lo que el equipo ya ha dado por bueno en un
 * documento real: si el capítulo generado es tan genérico como el propio
 * texto de referencia del equipo, eso es correcto, no un fallo (ver el
 * mecanismo ya existente `CODIGOS_PLANTILLA_INVARIANTE`, que hace lo mismo
 * pero fijado a mano en el código para un puñado de capítulos).
 *
 * Hoy cada equipo solo puede tener un Avance de referencia subido (ver
 * `equipo_plantilla_referencia`) — si en el futuro se admite más de uno,
 * este es el punto por el que habría que agregarlos.
 */
async function recopilarReferenciaDelEquipo(capituloCodigo: string, equipoId: string): Promise<string | null> {
  const codigosARevisar = [capituloCodigo, ...(await getSubepigrafes(capituloCodigo)).map((s) => s.capitulo_codigo)];
  const secciones = (
    await Promise.all(codigosARevisar.map((codigo) => getSeccionReferenciaDeEquipo(equipoId, codigo)))
  ).filter((s): s is NonNullable<typeof s> => s !== null && s.texto_html.trim() !== "");
  if (secciones.length === 0) return null;
  return secciones.map((s) => `[${s.titulo ?? "sin título"}]\n${s.texto_html}`).join("\n\n");
}

export function evaluarPlantillaInvariante(
  contenidoHtml: string,
  estado: CapituloEstado,
  nombreMunicipio: string
): Omit<ResultadoEvaluacion, "avisos"> {
  const mencionaMunicipio = contenidoHtml.includes(nombreMunicipio);
  const desglose: DesgloseEvaluacion = {
    cobertura: { puntos: 20, motivo: "Plantilla normativa fija, completa tal como está confirmada contra los Avances reales disponibles." },
    fundamentacion: {
      puntos: 0,
      motivo: "Por diseño no cita datos del diagnóstico de este municipio: es texto normativo común aplicable a cualquiera.",
    },
    especificidad: {
      puntos: mencionaMunicipio ? 10 : 4,
      motivo: mencionaMunicipio
        ? "Nombra al municipio, pero el resto del contenido es idéntico al de cualquier otro."
        : "Texto genérico sin ninguna mención al municipio — normal en esta plantilla, no un fallo de generación.",
    },
    solidez: { puntos: 20, motivo: "Texto legal/normativo ya verificado, prudente y coherente con el nivel de un Avance." },
    completitud: {
      puntos: estado === "listo" ? 20 : 12,
      motivo: estado === "listo" ? "No queda nada pendiente de confirmar." : "El equipo aún no ha confirmado que encaje con este municipio.",
    },
  };
  const puntuacionTotal = Object.values(desglose).reduce((suma, f) => suma + f.puntos, 0);
  return {
    puntuacionTotal,
    desglose,
    // Con fundamentación a 0 puntos por diseño (ver arriba), este capítulo
    // nunca llega a los 80 puntos de "verde" — sin este mensaje, el ámbar
    // se lee como "algo va mal" aunque aquí no hay nada que arreglar: es
    // el mismo texto normativo, idéntico en cualquier municipio.
    problemaPrincipal:
      "No es un problema real: es una plantilla normativa fija e idéntica en todos los municipios, sin dato propio que citar — el ámbar es de diseño, no un fallo de este capítulo.",
    pendientePrincipal: estado === "revisar" ? "Confirmar que este texto normativo común encaja con el municipio antes de cerrar el capítulo." : null,
    modelo: null,
  };
}

/**
 * Compara los subepígrafes activos de un capítulo mixto (MO.3, MO.5, MO.6…)
 * contra lo que de verdad aparece en su `contenido_html` — cada generador
 * de subepígrafe escribe su propio `<div class="doc-eyebrow">num · TÍTULO
 * EN MAYÚSCULAS</div>` (ver src/lib/motores/plantilla/mo3-*.ts y
 * similares), así que su ausencia es una señal fiable de que ese
 * subepígrafe no llegó a generarse — exactamente el hueco que esta sesión
 * encontró a mano en Lora del Río (MO.3.2/3.4/3.6, MO.6.2 ausentes sin que
 * nadie lo supiera). Determinista, sin coste de API.
 *
 * Se comprueba el NÚMERO del epígrafe (p.ej. "6.2 ·") además del título:
 * `titulo_canonico` es la etiqueta corta de `mapeo_capitulos`, pensada para
 * listas de navegación de la propia app, y en algún generador no coincide
 * palabra por palabra con el título largo que de verdad lleva el
 * `doc-eyebrow` del documento (p.ej. MO.3.3/MO.6.2 — falso positivo real
 * encontrado en producción). El número sí es siempre fiable: todos los
 * generadores lo escriben igual, tanto los de plantilla como el motor RAG
 * (`generarBloqueSubepigrafe`).
 */
async function detectarSubepigrafesFaltantes(capituloCodigo: string, contenidoHtml: string): Promise<AvisoPendiente[]> {
  const subepigrafes = await getSubepigrafes(capituloCodigo);
  if (subepigrafes.length === 0) return [];

  const contenidoEnMayusculas = contenidoHtml.toUpperCase();
  const aparece = (s: (typeof subepigrafes)[number]) => {
    const numero = s.capitulo_codigo.replace(/^MO\./, "");
    return (
      contenidoEnMayusculas.includes(`${numero.toUpperCase()} ·`) ||
      contenidoEnMayusculas.includes(s.titulo_canonico.toUpperCase())
    );
  };

  return subepigrafes
    // Motor "tabla": propuesta técnica que rellena el equipo a mano, nunca
    // se genera sola — que no aparezca en contenido_html es lo esperado,
    // no un hueco de generación.
    .filter((s) => s.motor !== "tabla")
    .filter((s) => !aparece(s))
    .map((s) => ({
      subepigrafeCodigo: s.capitulo_codigo,
      tipo: "informacion_no_localizada" as const,
      severidad: "alta" as const,
      mensaje: `El subepígrafe "${s.titulo_canonico}" (${s.capitulo_codigo}) no aparece en el capítulo generado.`,
      fuente: null,
    }));
}

const SYSTEM_PROMPT_EVALUACION = `Eres un evaluador técnico independiente de Memorias de Ordenación
urbanística (Avance PGOM/PBOM) en España. Te dan un capítulo YA REDACTADO por otro motor y
tu única función es puntuarlo con honestidad — nunca reescribirlo ni completarlo.

No premies la extensión ni la fluidez de la prosa. Premia que el contenido sea útil de
verdad como punto de partida para un técnico urbanista real. Un capítulo breve pero bien
fundamentado en el diagnóstico del municipio debe puntuar mejor que uno largo y genérico
que serviría casi igual para cualquier otro municipio.

Si se te da un "CONTENIDO DE REFERENCIA DEL EQUIPO" (extraído del Avance real que el
propio estudio ya ha redactado y confirmado como válido), tu criterio de especificidad y
fundamentación se mide CONTRA ESE TEXTO, no contra tu propia idea general de qué es
"suficientemente específico". Si el capítulo evaluado es del mismo tipo de contenido
(genérico/normativo o concreto/con datos) que ya usó el equipo en su documento real, eso
es correcto — no lo penalices por "genérico" solo porque no cite datos del municipio; el
equipo ya decidió que ese punto es así de general en la práctica. Solo baja
ESPECIFICIDAD/FUNDAMENTACION por debajo de lo que refleja la referencia cuando el
capítulo evaluado se aparte de ella (menos desarrollado, con menos datos concretos de los
que el propio equipo sí incluyó, o con afirmaciones que la referencia no respalda). Si no
se te da contenido de referencia, evalúa con tu propio criterio como hasta ahora.

Puntúa estos cinco factores, cada uno de 0 a 20:
- COBERTURA: ¿se han desarrollado los contenidos esperados de este capítulo, o hay huecos
  evidentes (secciones a medias, frases cortadas, apartados anunciados pero no escritos)?
- FUNDAMENTACION: ¿el contenido está respaldado por información específica de ESTE
  municipio (datos, cifras, nombres propios citados del diagnóstico), o es solo marco
  legal/conceptual sin ningún dato concreto? Compáralo contra el contenido de referencia
  del equipo si te lo han dado (ver arriba).
- ESPECIFICIDAD: ¿el texto habla realmente de este municipio, o podría usarse casi igual
  en cualquier otro con solo cambiar el nombre? Mismo criterio: compáralo contra la
  referencia del equipo si la tienes.
- SOLIDEZ: ¿las afirmaciones son prudentes y coherentes con el nivel de definición de un
  Avance (no un documento completo), sin inventar determinaciones que no le corresponden
  a este motor?
- COMPLETITUD: ¿cuánto trabajo queda de verdad por hacer a un técnico antes de poder
  cerrar este capítulo?

Responde EXACTAMENTE en este formato, una línea por factor, sin nada más:
COBERTURA: <0-20> | <motivo en una frase>
FUNDAMENTACION: <0-20> | <motivo en una frase>
ESPECIFICIDAD: <0-20> | <motivo en una frase>
SOLIDEZ: <0-20> | <motivo en una frase>
COMPLETITUD: <0-20> | <motivo en una frase>
PROBLEMA_PRINCIPAL: <el problema más importante del capítulo en una frase, o NINGUNO>
PENDIENTE_PRINCIPAL: <qué le falta hacer al técnico en una frase, o NINGUNO>

Si detectas que el texto menciona un municipio, plan urbanístico o topónimo DISTINTO del
que se te indica como municipio de este capítulo, añade una línea más:
CONTAMINACION: <la frase exacta sospechosa>`;

async function evaluarConClaude(
  capituloCodigo: string,
  contenidoHtml: string,
  nombreMunicipio: string,
  referenciaDelEquipo: string | null
): Promise<Omit<ResultadoEvaluacion, "avisos"> & { avisos: AvisoPendiente[] } | null> {
  const anthropic = getAnthropicClient();
  const bloqueReferencia = referenciaDelEquipo
    ? `\n\n--- CONTENIDO DE REFERENCIA DEL EQUIPO (de su propio Avance real, ya confirmado como válido) ---\n${referenciaDelEquipo}`
    : "";
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    // Comprobado contra un capítulo real de ~44.000 caracteres (MO.3): con
    // 1024 el modelo agota todo el presupuesto en razonamiento interno y no
    // llega a escribir ni una línea de la respuesta (stop_reason
    // "max_tokens", 0 texto visible) — la tarea de evaluar un capítulo
    // largo con una rúbrica de 5 factores induce bastante más razonamiento
    // que las extracciones puntuales del resto de motores (extraerPlanVigente,
    // extraerColindantes), que sí les basta con unos pocos cientos.
    max_tokens: 8192,
    system: SYSTEM_PROMPT_EVALUACION,
    messages: [
      {
        role: "user",
        content: `Municipio: ${nombreMunicipio}
Capítulo: ${capituloCodigo}

--- Contenido a evaluar ---
${contenidoHtml}${bloqueReferencia}`,
      },
    ],
  });

  const texto = respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const factor = (nombre: string) => {
    const m = texto.match(new RegExp(`${nombre}:\\s*(\\d{1,2})\\s*\\|\\s*(.+)`));
    if (!m) return null;
    return { puntos: Math.min(20, Math.max(0, Number(m[1]))), motivo: m[2].trim() };
  };
  const cobertura = factor("COBERTURA");
  const fundamentacion = factor("FUNDAMENTACION");
  const especificidad = factor("ESPECIFICIDAD");
  const solidez = factor("SOLIDEZ");
  const completitud = factor("COMPLETITUD");
  if (!cobertura || !fundamentacion || !especificidad || !solidez || !completitud) return null;

  const desglose: DesgloseEvaluacion = { cobertura, fundamentacion, especificidad, solidez, completitud };
  const puntuacionTotal = Object.values(desglose).reduce((suma, f) => suma + f.puntos, 0);

  const linea = (nombre: string) => {
    const m = texto.match(new RegExp(`${nombre}:\\s*(.+)`));
    if (!m) return null;
    const valor = m[1].trim();
    return valor === "" || valor.toUpperCase() === "NINGUNO" ? null : valor;
  };

  const avisos: AvisoPendiente[] = [];
  const contaminacion = linea("CONTAMINACION");
  if (contaminacion) {
    avisos.push({
      subepigrafeCodigo: null,
      tipo: "posible_contaminacion",
      severidad: "alta",
      mensaje: `Posible referencia a otro municipio/plan: "${contaminacion}"`,
      fuente: null,
    });
  }

  return {
    puntuacionTotal,
    desglose,
    problemaPrincipal: linea("PROBLEMA_PRINCIPAL"),
    pendientePrincipal: linea("PENDIENTE_PRINCIPAL"),
    modelo: MODELO_GENERACION,
    avisos,
  };
}

/**
 * Envoltorio que usan tanto la generación inicial (`generarCapitulosIniciales`)
 * como la regeneración (`aplicarRegeneracionAction`) justo después de
 * persistir el `contenido_html` de un capítulo: evalúa, detecta
 * contaminación entre municipios y guarda ambos resultados. No lanza si la
 * evaluación por Claude falla — el capítulo ya está guardado igualmente,
 * simplemente se queda sin puntuación hasta la próxima regeneración.
 */
export async function evaluarYGuardar(
  capitulo: Pick<CapituloRow, "id" | "codigo" | "motor" | "estado" | "contenido_html">,
  municipio: Pick<MunicipioRow, "nombre" | "plan_vigente">,
  otrosMunicipiosDelEquipo: Pick<MunicipioRow, "nombre" | "plan_vigente">[],
  equipoId: string
): Promise<void> {
  if (!capitulo.contenido_html) return;

  const resultado = await evaluarCapitulo(capitulo, municipio, equipoId);

  const avisosContaminacion: AvisoPendiente[] = detectarContaminacion(
    limpiarParaExportar(capitulo.contenido_html),
    municipio,
    otrosMunicipiosDelEquipo
  ).map((h) => ({
    subepigrafeCodigo: null,
    tipo: "posible_contaminacion",
    severidad: "alta",
    mensaje: `Se ha detectado en el texto: ${h.fuente}.`,
    fuente: h.fuente,
  }));

  await reemplazarAvisosAutomaticos(capitulo.id, [...(resultado?.avisos ?? []), ...avisosContaminacion]);

  if (resultado) {
    await guardarEvaluacion(capitulo.id, {
      puntuacionTotal: resultado.puntuacionTotal,
      desglose: resultado.desglose,
      problemaPrincipal: resultado.problemaPrincipal,
      pendientePrincipal: resultado.pendientePrincipal,
      modelo: resultado.modelo,
    });
  }
}
