import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.5.4 · Las redes y espacios técnicos de infraestructuras para el
 * desarrollo sostenible (marco conceptual). 100% plantilla: confirmado
 * idéntico entre Osuna y Lora del Río (test-data/) salvo el nombre del
 * municipio en la frase de cierre.
 *
 * El desarrollo de cada red (agua, electricidad, alumbrado,
 * telecomunicaciones, residuos — 5.4.1 a 5.4.5) describe el estado actual
 * concreto de cada municipio, así que se queda en motor tabla.
 */
export function generarMO5_4(municipio: MunicipioRow): string {
  return `
<div class="doc-eyebrow">5.4 · LAS REDES Y ESPACIOS TÉCNICOS DE INFRAESTRUCTURAS PARA EL DESARROLLO SOSTENIBLE</div>
<div class="doc-text">
<p>Hay que destacar el cambio de apreciación del término "desarrollo" en las últimas décadas.
Se ha pasado de una visión "economicista" —que lo asociaba sólo a la creación de plusvalor y
del crecimiento por el crecimiento— a un concepto más integrado y completo: en efecto, hay hoy
otras variables sociales y ambientales que asociamos al "desarrollo sostenible", que tenga en
cuenta también los costes indirectos sobre el medio ambiente que no se contabilizaban en el
balance de la producción; por tanto, que sea compatible con el marco natural, que nos asegure
un menor consumo energético y baja contaminación y, sobre todo, que lo sea a largo plazo.
Porque será sostenible si el desarrollo que generamos puede satisfacer las necesidades de las
generaciones futuras, sin hipotecas diferidas en el tiempo. Aunque sea simple, esto explica la
importancia que esta discusión tiene sobre los factores de producción de ciudad (residencia,
actividad económica, etc.), teniendo en cuenta tanto los factores ambientales como la cuestión
de los recursos que son irreproducibles. Pone, por tanto, en duda la naturaleza "sólo" económica
y fundamentalmente basada en el corto plazo, que había guiado el desarrollo urbanístico
recientemente.</p>

<p>Por esto, la aportación de la ecología y de las ingenierías especializadas nos permite
entender cuáles son los soportes de la ciudad y su evolución a medio plazo y, por tanto, se deben
considerar en el marco del nuevo planeamiento general, y sobre todo en su desarrollo. No
olvidemos que son la forma de la ciudad y los patrones de su uso cotidiano los que influyen de
una manera sustancial en la creación o no de condiciones sostenibles en el funcionamiento de
los medios urbanizados.</p>

<p>Y por ello, las redes y espacios técnicos que conforman las infraestructuras básicas deben
integrarse en el proceso planificador tomando en consideración los condicionantes que
comportan, coordinando el proceso de decisiones en el que intervienen diferentes niveles
competenciales. Ello implica coordinar y optimizar los recursos disponibles, procurando la
unificación de sus reservas y servidumbres, fomentando la coordinación de las infraestructuras
básicas entre sí, y con la planificación territorial y urbanística. Una planificación integrada,
coherente con la capacidad sustentadora del territorio y del medio ambiente, requiere la
consideración de los servicios auxiliares imprescindibles para el funcionamiento de la ciudad
existente y de los nuevos crecimientos futuros.</p>

<p>El desarrollo de las redes y espacios técnicos de infraestructuras básicas requiere una
tipología diversificada, tanto en cuanto a requerimientos de localización como a las
características de los soportes físicos. Dada la importancia de las determinaciones urbanísticas
en el funcionamiento y calidad de estos servicios, el Avance del nuevo planeamiento general
establece criterios para su óptima localización teniendo en cuenta los diferentes requerimientos
de los diferentes sistemas y tipología de infraestructuras, pretendiendo, en coordinación con
otras administraciones competentes, caminar hacia un desarrollo sostenible.</p>

<p>A continuación, se presentan las propuestas de actuaciones para las diferentes redes,
espacios técnicos y servicios básicos del municipio de ${municipio.nombre}, analizando los
siguientes aspectos: abastecimiento y saneamiento de agua, energía eléctrica, gas natural,
telecomunicaciones, alumbrado público y residuos urbanos.</p>
</div>
<div class="src-note">PLANTILLA — confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio. El desarrollo de cada red concreta va en los apartados siguientes, a rellenar por el técnico.</div>
`.trim();
}
