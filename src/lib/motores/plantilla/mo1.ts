import type { MunicipioRow } from "@/lib/supabase/types";
import { getSeccionPorCodigo } from "@/lib/data/diagnosticos";
import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";

/**
 * MO.1 · 1.1 Conveniencia y oportunidad del PGOM + 2. De las alternativas
 * de ordenación contempladas.
 *
 * La sección 1.1 está validada comparando el texto real de dos Avances
 * distintos (Osuna y Lora del Río, ver test-data/): los párrafos son casi
 * idénticos palabra por palabra salvo el nombre del municipio, el plan
 * vigente citado y los años transcurridos. Solo esos tres datos son
 * variables; el resto (referencias a LS07, TRLS08, Ley 8/2013, TRLSRU 2015,
 * LISTA, POTA, la Estrategia Andaluza de Sostenibilidad Urbana) es literal
 * en ambos.
 *
 * La sección 2 (añadida después, comprobada contra el mismo Avance de Lora
 * del Río) cubre el marco legal y la metodología de evaluación de
 * alternativas que exige el artículo 77 de la LISTA y la Ley 7/2007 (GICA)
 * — genérico y aplicable a cualquier municipio andaluz, no citas a datos
 * concretos del municipio. A propósito NO incluye la descripción de las
 * alternativas concretas (p.ej. "Alternativa 0: asunción del planeamiento
 * vigente…") — esas sí son específicas de cada municipio y de su
 * diagnóstico, y había que inventarlas para poder generarlas aquí; se
 * dejan para que el equipo las añada (ver el aviso al final del bloque).
 *
 * Devuelve null si falta un dato imprescindible (fecha del plan vigente) —
 * no se inventa un número de años.
 */
export function generarMO1(municipio: MunicipioRow): string | null {
  if (!municipio.plan_vigente || !municipio.fecha_plan_vigente) return null;

  const anos = calcularAnosTranscurridos(municipio.fecha_plan_vigente);
  if (anos === null) return null;

  return `
<div class="doc-eyebrow">1.1 · CONVENIENCIA Y OPORTUNIDAD DEL PGOM</div>
<div class="doc-text">
<p>Desde la aprobación y entrada en vigor de ${municipio.plan_vigente} han
transcurrido ${anos} años. Y lo cierto es que durante el tiempo transcurrido
desde la aprobación del planeamiento urbanístico general que se quiere
revisar y sustituir ha cambiado el marco jurídico de referencia de las
políticas de ordenación del territorio y urbanismo. Y este marco de
referencia es determinante no sólo de la configuración formal sino del
contenido sustantivo de un Plan General.</p>

<p>Así, en la legislación básica estatal en materia de suelo, el cambio de
orientación acontece con la aprobación de la Ley de Suelo estatal 8/2007
(LS07) y el posterior Decreto Legislativo 2/2008 (TRLS 08). Luego se refuerza
con la aparición de la Ley 8/2013 de, 26 de junio, de rehabilitación,
regeneración y renovación urbanas. Ambas reformas posteriormente han sido
integradas en el RDL 7/2015, de aprobación del Texto Refundido de la Ley del
Suelo y Rehabilitación Urbana (TRLSRU 2015).</p>

<p>Este nuevo bloque de legislación estatal incorpora una serie de mandatos a
la planificación urbanística (y territorial) realizados desde la protección
ambiental y el requerimiento de la sostenibilidad. En especial, impone el
criterio de la limitación del consumo de suelo objeto de transformación
urbanística: sólo se puede ordenar el «suelo preciso para satisfacer las
necesidades que lo justifiquen». Y se señala también que «el suelo, además de
ser un recurso económico, es también un recurso natural, escaso y no
renovable». Desde esta perspectiva, todo el suelo rural tiene un valor digno
de ser ponderado. Además, el cambio de criterio de la legislación estatal en
materia de suelo se produce un año después de la incorporación al
ordenamiento jurídico español y andaluz de Directivas Europeas que insisten
en los principios de sostenibilidad ambiental y social, fomentando el
desarrollo urbano, pero controlando la expansión urbana, de modo que las
distancias sean cortas frente a los tradicionales modelos de crecimiento
horizontal, advirtiendo de los graves inconvenientes de una urbanización
dispersa.</p>

<p>Desde el punto de vista de la legislación autonómica, la aparición de la
Ley 7/2021, de 1 de diciembre, de impulso para la sostenibilidad del
territorio de Andalucía (LISTA) también incorpora criterios para la
ordenación urbanística (artículo 61) que responden a la exigencia de
promover un desarrollo urbano y territorial sostenible y que imponen la
incorporación en el nuevo instrumento de ordenación general de directrices y
estrategias que eviten la dispersión urbana, revitalicen la ciudad existente
y su complejidad funcional.</p>

<p>Por tanto, es conveniente que ${municipio.nombre} pueda disponer de un
planeamiento general, no sólo adaptado, sino completamente formulado desde
las nuevas exigencias a la ordenación urbanística establecidas por la
legislación autonómica y estatal; en definitiva, incorporando los nuevos
postulados sobre desarrollo sostenible desde el primer momento de su
elaboración. Realmente esta nueva legislación obliga a ajustar y redirigir
los criterios respecto a la conformación de la estructura general y orgánica
del territorio y en materia de clasificación del suelo. Y la adopción de
estos nuevos criterios en estas decisiones incide directamente en la
necesidad de la revisión del planeamiento general vigente.</p>

<p>De otra parte, los objetivos fundamentales establecidos en el Plan
vigente precisan de una reconsideración generalizada, si tenemos además en
cuenta que no sólo se ha producido una transformación socioeconómica en el
entorno próximo de ${municipio.nombre}, sino que, además, el escenario
regional y estatal han sufrido una aceleración en las tendencias apuntadas
para el principio del siglo que aconsejan situar en un contexto distinto los
objetivos de la revisión.</p>

<p>En especial, se hace necesaria una revisión para incorporar a la
ordenación del municipio los principios, fines, directrices y criterios
establecidos en las disposiciones y documentos de referencia siguientes:</p>

<p>a) Principios y criterios del TRLSRU (Art. 3 y 20 del RDL 7/2015): el
desarrollo territorial y urbano debe responder al interés general y
orientarse al desarrollo sostenible; la transformación del suelo debe estar
justificada por necesidades reales, garantizando su utilización racional,
preservando el medio ambiente y asegurando dotaciones como la vivienda
protegida.</p>

<p>b) Fines y criterios de la LISTA (Art. 3, 4 y 61 de la Ley 7/2021): la
ordenación urbanística debe integrar objetivos de sostenibilidad social,
ambiental y económica, promoviendo un modelo de ciudad compacta, con
eficiencia energética, equilibrio en el uso de recursos naturales y mejora
paisajística.</p>

<p>c) Criterios de sostenibilidad del Decreto 550/2022 (Art. 79–83): diseño
del espacio público, dotaciones y reservas, integración de vivienda
protegida, calidad ambiental y funcionalidad del entorno urbano.</p>

<p>d) Directrices del POTA (Decreto 206/2006): marco estratégico de
organización del territorio andaluz basado en la cohesión territorial,
sostenibilidad y calidad de vida, con necesidad de actualización para
adecuarse a la LISTA y a los nuevos desafíos territoriales.</p>

<p>e) Estrategia Andaluza de Sostenibilidad Urbana 2030: el desarrollo
sostenible solo es posible con cohesión social y un modelo económico
adecuado, proponiendo áreas estratégicas para fomentar la sostenibilidad
urbana, la economía verde y la inclusión social.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>

<div class="doc-eyebrow">2 · DE LAS ALTERNATIVAS DE ORDENACIÓN CONTEMPLADAS</div>
<div class="doc-text">
<p>El documento de Avance del Plan General de Ordenación Municipal de
${municipio.nombre} se presenta como una herramienta estratégica inicial,
orientada a explorar, proponer y analizar distintas opciones de ordenación
territorial y urbana. No se trata aún de un instrumento normativo, por lo
que no incorpora determinaciones urbanísticas de carácter vinculante.</p>

<p>De acuerdo con lo previsto en el artículo 77 de la Ley 7/2021, de impulso
para la sostenibilidad del territorio de Andalucía (LISTA), el Avance debe
ofrecer una exposición clara y justificada de los siguientes aspectos: los
objetivos que persigue el plan, ya sea su elaboración o revisión; el ámbito
geográfico sobre el que actúa; las principales condicionantes territoriales,
ambientales y sectoriales (infraestructuras, riesgos naturales, elementos
patrimoniales, espacios protegidos, etc.); los criterios generales que
sustentan la propuesta de ordenación; y una serie de alternativas viables,
analizadas desde una perspectiva técnica, ambiental y económica, evitando la
presentación de una única opción. Este planteamiento plural tiene como
finalidad asegurar que la propuesta final responda a criterios de
sostenibilidad, eficiencia y equidad, permitiendo una comparación
fundamentada entre distintas estrategias posibles.</p>

<p>Paralelamente, y en cumplimiento de la Ley 7/2007, de Gestión Integrada
de la Calidad Ambiental (GICA), el documento de Avance —equivalente
ambientalmente al Borrador del Plan— debe someterse al procedimiento de
Evaluación Ambiental Estratégica (EAE) desde las fases iniciales del
proceso. Esta evaluación obliga a considerar el impacto de las distintas
alternativas sobre la conservación o transformación del suelo de valor
ecológico o agrario, la fragmentación del territorio, el uso de recursos
naturales, la biodiversidad y el paisaje, y la coherencia con los objetivos
de desarrollo sostenible. Así, el Avance actúa como un puente entre la
planificación urbanística y la protección ambiental, incorporando una
visión estratégica, integradora y participativa del urbanismo contemporáneo
andaluz: no es un plan normativo, sino un espacio de reflexión técnica,
institucional y social que sienta las bases del modelo territorial y urbano
a desarrollar.</p>

<p>Su nivel de definición es, evidentemente, preliminar: no se establecen
aún derechos urbanísticos, ni se asignan usos detallados, edificabilidades o
densidades. Esta indefinición permite incorporar aportaciones ciudadanas,
interadministrativas y ambientales a lo largo del proceso, y presentar
alternativas de forma abierta, como distintas expresiones dentro de un marco
conceptual y normativo compartido.</p>

<p>El Avance ofrece diversas hipótesis de desarrollo urbano-territorial,
construidas sobre un diagnóstico riguroso de sus condicionantes físicos,
ambientales, sociales y económicos, que buscan responder a desafíos como la
regeneración de áreas consolidadas, la mejora de la conectividad, el uso
eficiente del suelo o el control del crecimiento urbano. No obstante, deben
interpretarse como escenarios orientativos, sin capacidad normativa ni
efectos sobre derechos urbanísticos existentes: no sustituyen al
planeamiento vigente, sino que ofrecen una base estratégica para su revisión
o actualización.</p>

<p>Cada alternativa se somete a una evaluación sistemática y objetiva,
recogida en el Documento Inicial Estratégico (DIE), mediante una matriz de
indicadores que valora, con puntuaciones (+1, 0, -1), su impacto sobre tres
ejes fundamentales: la viabilidad técnica, en relación con su ejecución y
compatibilidad con infraestructuras existentes; la compatibilidad
ambiental, en términos de preservación de recursos, mitigación de impactos
y adaptación al cambio climático; y la sostenibilidad socioeconómica,
considerando la cohesión social, el equilibrio económico y la accesibilidad
a equipamientos. Este análisis comparativo permite identificar la
alternativa más adecuada a los objetivos del municipio y a los marcos
superiores de planificación, como la Estrategia Andaluza de Sostenibilidad
Urbana.</p>

<p>En síntesis, el Avance del PGOM de ${municipio.nombre} constituye un
instrumento esencial para definir el modelo urbanístico futuro del
municipio. Aunque carece de efectos jurídicos vinculantes, representa un
momento clave del proceso de planificación, en el que se anticipan
impactos, se integran perspectivas múltiples y se orienta la toma de
decisiones hacia soluciones más equilibradas, factibles y sostenibles. Las
opciones planteadas podrán ser refinadas en las siguientes fases, a medida
que se incorporen los contenidos técnicos definitivos, las consideraciones
ambientales y la voluntad colectiva del territorio.</p>
</div>
<div class="src-note">PLANTILLA — marco legal y metodología de evaluación de alternativas, comunes a
cualquier municipio. Falta añadir aquí la descripción de las alternativas concretas
manejadas para ${municipio.nombre} (p.ej. "Alternativa 0: asunción del planeamiento
vigente…") — eso sí depende del municipio y no se genera solo; añádelo editando
el capítulo.</div>
`.trim();
}

/**
 * MO.1 se queda en "sin_info" siempre que falten `plan_vigente` o
 * `fecha_plan_vigente` del municipio — pero esos dos datos casi siempre
 * están ya en el propio diagnóstico (el nombre/año del planeamiento
 * vigente sale al hablar de sus modificaciones, "2.1"; la fecha exacta de
 * aprobación definitiva suele salir de pasada al hablar del catálogo de
 * patrimonio del planeamiento vigente, "4.4.2"). En vez de exigir que el
 * técnico los teclee a mano antes de poder generar nada, se extraen con
 * una llamada a Claude acotada a devolver solo esos dos datos — mismo
 * mecanismo puntual que MO.11 usa para los municipios colindantes, no
 * Motor 2 completo.
 *
 * Devuelve null si no se encuentra el dato con confianza — nunca inventa
 * una fecha.
 */
export async function extraerPlanVigente(
  diagnosticoId: string
): Promise<{ planVigente: string; fechaPlanVigente: string } | null> {
  const [modificaciones, catalogoPatrimonio] = await Promise.all([
    getSeccionPorCodigo(diagnosticoId, "2.1"),
    getSeccionPorCodigo(diagnosticoId, "4.4.2"),
  ]);
  const fragmentos = [modificaciones, catalogoPatrimonio].filter(
    (s): s is NonNullable<typeof s> => s !== null
  );
  if (fragmentos.length === 0) return null;

  const anthropic = getAnthropicClient();
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    max_tokens: 150,
    system: `Extraes datos puntuales de fragmentos de un Diagnóstico urbanístico, nunca
redactas ni interpretas.

Busca el nombre/referencia del planeamiento general actualmente vigente en el
municipio (p.ej. "PGOU de 2005", "Normas Subsidiarias de 1998") y su fecha de
APROBACIÓN DEFINITIVA original — no la de modificaciones puntuales
posteriores.

Responde EXACTAMENTE en este formato de dos líneas, sin nada más:
PLAN: <cómo debería citarse en una frase, con artículo, p.ej. "el PGOU de 2005" o "las Normas Subsidiarias de 1998">
FECHA: <YYYY-MM-DD>

Si no encuentras el dato con confianza en el fragmento, responde exactamente: NINGUNO`,
    messages: [
      {
        role: "user",
        content: fragmentos.map((s) => `--- Sección "${s.titulo}" ---\n${s.texto}`).join("\n\n"),
      },
    ],
  });

  const texto = respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const match = texto.match(/PLAN:\s*(.+)\s*\nFECHA:\s*(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  return { planVigente: match[1].trim(), fechaPlanVigente: match[2] };
}

function calcularAnosTranscurridos(fechaPlanVigente: string): number | null {
  const fecha = new Date(fechaPlanVigente);
  if (Number.isNaN(fecha.getTime())) return null;
  const anos = new Date().getFullYear() - fecha.getFullYear();
  return anos > 0 ? anos : null;
}
