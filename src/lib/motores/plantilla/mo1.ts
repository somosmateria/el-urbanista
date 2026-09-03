import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.1 · 1.1 Conveniencia y oportunidad del PGOM.
 *
 * Plantilla validada comparando el texto real de dos Avances distintos
 * (Osuna y Lora del Río, ver test-data/): los párrafos son casi idénticos
 * palabra por palabra salvo el nombre del municipio, el plan vigente citado
 * y los años transcurridos. Solo esos tres datos son variables; el resto
 * (referencias a LS07, TRLS08, Ley 8/2013, TRLSRU 2015, LISTA, POTA, la
 * Estrategia Andaluza de Sostenibilidad Urbana) es literal en ambos.
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
`.trim();
}

function calcularAnosTranscurridos(fechaPlanVigente: string): number | null {
  const fecha = new Date(fechaPlanVigente);
  if (Number.isNaN(fecha.getTime())) return null;
  const anos = new Date().getFullYear() - fecha.getFullYear();
  return anos > 0 ? anos : null;
}
