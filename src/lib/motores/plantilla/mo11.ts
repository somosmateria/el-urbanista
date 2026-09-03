import type { MunicipioRow } from "@/lib/supabase/types";
import { getSeccionPorCodigo } from "@/lib/data/diagnosticos";
import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";

/**
 * MO.11 · Compatibilización de la propuesta con la ordenación urbanística de
 * los municipios colindantes.
 *
 * El marco legal es 100% invariante (confirmado contra Osuna y Lora del
 * Río), pero el propio párrafo central del capítulo necesita la lista real
 * de municipios limítrofes — un dato, no una plantilla. docs/01 la ubica en
 * MI.1.1 (encuadre territorial). En vez de exigir que el técnico la teclee
 * a mano, se extrae automáticamente de la sección "1.1" ya parseada del
 * diagnóstico con una llamada a Claude acotada estrictamente a devolver esa
 * lista — no es Motor 2 completo (no reformatea prosa), es una extracción
 * puntual del mismo tipo de dato.
 *
 * Sin diagnóstico procesado, o si no se puede extraer la lista con
 * confianza, devuelve null — nunca inventa municipios colindantes.
 */
export async function generarMO11(
  municipio: MunicipioRow,
  diagnosticoId: string | null
): Promise<string | null> {
  if (!diagnosticoId) return null;

  const seccionEncuadre = await getSeccionPorCodigo(diagnosticoId, "1.1");
  if (!seccionEncuadre) return null;

  const colindantes = await extraerColindantes(seccionEncuadre.texto);
  if (!colindantes) return null;

  return `
<div class="doc-eyebrow">MO.11 · COMPATIBILIZACIÓN CON LOS MUNICIPIOS COLINDANTES</div>
<div class="doc-text">
<p>En el proceso de revisión del Plan General de Ordenación Municipal (PGOM) de
${municipio.nombre}, se ha llevado a cabo un análisis específico sobre la coherencia y
compatibilidad de la propuesta de ordenación estructural del municipio con la
planificación urbanística vigente en los términos municipales colindantes. Este
análisis se considera esencial para garantizar la integración del modelo territorial de
${municipio.nombre} en su contexto supramunicipal inmediato.</p>

<p>El término municipal de ${municipio.nombre} limita con los siguientes municipios:
<mark>${colindantes}</mark>. En este sentido, se ha procedido a revisar la documentación
urbanística disponible de cada uno de estos municipios, considerando los
instrumentos de planeamiento actualmente vigentes.</p>

<p>De forma general, la propuesta de ordenación del PGOM de ${municipio.nombre}
respeta los límites jurisdiccionales oficiales, definidos por el Instituto Geográfico
Nacional (IGN) y contenidos en la cartografía oficial de la Junta de Andalucía,
conforme a lo dispuesto en el artículo 18 del Decreto 550/2022, de 29 de noviembre,
por el que se aprueba el Reglamento General de la Ley 7/2021, de impulso para la
sostenibilidad del territorio de Andalucía (LISTA).</p>

<p>Asimismo, se ha garantizado la coherencia con la ordenación estructural de los
municipios limítrofes, revisando los usos del suelo propuestos en sus respectivos
planes generales o normas subsidiarias, asegurando la continuidad funcional,
paisajística y ambiental a lo largo de los límites administrativos compartidos. Se han
aplicado los principios de coordinación interadministrativa y coherencia territorial
establecidos en la LISTA, especialmente en lo relativo a evitar las discontinuidades,
contradicciones normativas o solapamientos de usos; la creación de franjas de
transición que garanticen la continuidad paisajística y la conectividad ecológica; y el
respeto a los sistemas generales existentes o previstos en la planificación
colindante.</p>

<p>En aquellas zonas donde se detecten diferencias entre la cartografía urbanística de
los municipios colindantes y la línea oficial del término municipal de ${municipio.nombre},
la propuesta de ordenación que se elabore en el Documento completo del PGOM
conforme a la delimitación oficial tendrá que tener en cuenta la coordinación
interadministrativa. Con ello, se garantizará que la propuesta de ordenación
estructural del PGOM de ${municipio.nombre} es compatible, en términos generales, con
los instrumentos de planificación urbanística de los municipios colindantes,
asegurando una integración territorial coherente, funcional y sostenible.</p>
</div>
<div class="src-note">FUENTE — Diagnóstico · lista de municipios colindantes · MI.1.1 (resto: plantilla normativa)</div>
`.trim();
}

async function extraerColindantes(textoEncuadre: string): Promise<string | null> {
  const anthropic = getAnthropicClient();
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    max_tokens: 200,
    system:
      "Extraes datos puntuales de un texto, nunca redactas ni interpretas. " +
      "Del fragmento que se te da, devuelve ÚNICAMENTE los nombres de los " +
      "municipios colindantes/limítrofes mencionados, separados por comas, " +
      "en el mismo orden del texto, sin numerarlos ni añadir nada más. Si el " +
      "fragmento no menciona ningún municipio colindante, responde " +
      "exactamente: NINGUNO",
    messages: [{ role: "user", content: textoEncuadre }],
  });

  const texto = respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  if (!texto || texto.toUpperCase() === "NINGUNO") return null;
  return texto;
}
