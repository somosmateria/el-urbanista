import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.3.1.4 · Suelo rústico común.
 *
 * La doctrina general (qué es el suelo rústico común, régimen de
 * actuaciones ordinarias/extraordinarias, distinción entre ámbitos con y
 * sin delimitación de actuaciones de transformación) es idéntica palabra
 * por palabra entre Osuna y Lora del Río (test-data/) — solo cambia, en
 * cada municipio, la relación concreta de sectores/ámbitos delimitados
 * (ATU/NU-D con nombre propio, situación de ejecución), que no viene del
 * diagnóstico sino del trabajo cartográfico del técnico. Esa relación no
 * se genera aquí — queda para completar a mano en el editor.
 */
export function generarMO3_1_4(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">3.1.4 · SUELO RÚSTICO COMÚN</div>
<div class="doc-text">
<p>Como se ha expuesto, en el nuevo régimen jurídico-urbanístico autonómico que
implanta la LISTA, el suelo rústico común es una categorización residual en el que se
integran el resto de suelo rústico que no queda adscrito al suelo especialmente
protegido o al suelo preservado (y que tampoco se corresponde con el Hábitat Rural
Diseminado).</p>

<p>En el suelo rústico común, además de poder autorizarse actuaciones ordinarias
(artículo 21 LISTA) y extraordinarias (artículo 22 LISTA), se caracteriza, especialmente,
por ser los ámbitos susceptibles de ser delimitados para el desarrollo de actuaciones
de transformación urbanística de nueva urbanización.</p>

<p>Por tanto, son aquellos ámbitos de suelo rústico que, por desarrollo de previsiones
del propio PGOM, pueden terminar perdiendo el carácter y clasificación de suelo
rústico por la ejecución de la actuación de transformación. Evidentemente cualquier
propuesta de transformación de los terrenos del suelo rústico común deberá
realizarse conforme a las estrategias y directrices que establecerá el documento
completo del PGOM (concretando los criterios establecidos en este Avance) y
conforme a la Evaluación Ambiental Estratégica.</p>

<p><strong>Suelo rústico común sin delimitación de actuaciones de transformación</strong>
(inidóneas para actuaciones de transformación): en las condiciones que se
establezcan se habilitarán todas las actuaciones y edificaciones ligadas a los usos
ordinarios. Igualmente, y también en las condiciones particulares que se establezcan,
se habilitarán todas las actuaciones y edificaciones ligadas a las actividades
extraordinarias en suelo rústico. Dentro de este suelo quedan protegidos los pinos,
encinas y alcornoques que se encuentren, así como el arbolado situado a la orilla de
los caminos, que se protegerá y exigirá su repoblación como recurso paisajístico y
como protección de los vientos dominantes. Las actuales zonas de cultivos arbóreos
se deberán mantener como tales, permitiéndose únicamente el cambio de especie. La
parcelación rústica de terrenos deberá garantizar que cada una de las subdivisiones
que resulten de la misma asegure la rentabilidad de la explotación.</p>

<p><strong>Suelo rústico común con delimitación de actuaciones de transformación</strong>: la
disposición transitoria primera de la LISTA, relativa a la aplicación de la Ley tras su
entrada en vigor, establece en su apartado a) 3ª, la regla de que los ámbitos de suelo
urbanizable ordenado o sectorizado del planeamiento general vigente (el que se
revisa) tendrá el régimen que se establece para la promoción de las actuaciones de
transformación urbanística de nueva urbanización, considerando que las mismas se
encuentran delimitadas. En ese sentido, en este Avance se discriminan aquellos
ámbitos que, no habiendo alcanzado el nivel para ser considerados como suelo
urbano, se encuentran en distintas fases de ejecución de los que no han tenido ningún
desarrollo.</p>

<p><em>Pendiente de completar por el técnico: la relación concreta de sectores/ámbitos de
este municipio (nombre, situación de ejecución, uso global), tal como aparece en el
Plano de Ordenación — no procede del diagnóstico.</em></p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico. Relación de sectores concretos pendiente de completar.</div>
`.trim();
}
