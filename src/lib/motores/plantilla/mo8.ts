import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.8 · De la programación y los estudios económicos del plan.
 *
 * docs/01-analisis-diagnostico-a-ordenacion.md estima esta plantilla como
 * "~75% A (marco conceptual y normativo), 25% B/C (cifras de inversión,
 * plazos)". En la práctica, comparando el texto real íntegro de Osuna y
 * Lora del Río (test-data/) — los 7 epígrafes (8.1 a 8.7) — no hay ninguna
 * cifra de inversión ni plazo concreto de programación económica en
 * ninguno de los dos Avances: en esta fase (Avance, no documento completo)
 * el capítulo es análisis conceptual y normativo sobre CÓMO se hará esa
 * programación económica más adelante, no la programación en sí. Es, en la
 * práctica, tan invariante como MO.4/9/10/12.
 *
 * Nota de calidad: el texto real de Osuna menciona "Chiclana" dos veces en
 * mitad de párrafos por lo demás idénticos a los de Lora del Río — un
 * resto de una plantilla previa de la propia consultora que no se
 * actualizó al redactar el Avance de Osuna. Aquí se corrige a
 * {municipio.nombre} en vez de reproducir el error o fijarlo a "Osuna".
 */
export function generarMO8(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">MO.8 · DE LA PROGRAMACIÓN Y LOS ESTUDIOS ECONÓMICOS DEL PLAN</div>
<div class="doc-text">
<p><strong>8.1. Características del Programa de Actuación del Plan General de Ordenación
Municipal en el marco de la LISTA.</strong></p>

<p>En general, se entiende por planificación la adopción anticipada de decisiones que han
de ser ejecutadas posteriormente según una secuencia determinada. La idea de
planificación entronca con la de programación, constituyendo el programa el medio de
ejecutar mejor y más rápidamente los objetivos perseguidos en el plan. Un programa ha
de derivarse de un plan: no cabe hablar de programa sin objetivos finales concretados en
la ordenación que se persigue y sin una estrategia global de ejecución sobre la que basar
las prioridades con las que ordenar en el tiempo las decisiones ya tomadas.</p>

<p>La programación urbanística derivada del planeamiento encierra una condición doble:
la ordenación en el tiempo —y no solo en el espacio— de la inversión directa en la ciudad
por parte de los organismos públicos con capacidad y responsabilidad de hacerlo; y una
contribución a la racionalización de la inversión pública tanto del Ayuntamiento como de
otros organismos (comunidades autónomas y administración central) que, en la actual
estructura de inversión pública en España, realizan la mayor cuantía de inversión en el
territorio. La programación urbanística, como guía de actuación, constituye el puente
entre esas dos prácticas, tantas veces autónomas cuando no contrapuestas.</p>

<p>La función propia de un Programa de Actuación es estructurar y organizar
secuencialmente en el tiempo las actuaciones y acciones de inversión que el planeamiento
urbanístico proponga para alcanzar los objetivos globales de ordenación, estimar los
recursos previsibles, justificar la verosimilitud de la asignación económica programada y
mostrar la cuantificación y viabilidad del Programa, que será a su vez objeto del Estudio
Económico-Financiero del Plan.</p>

<p>Ahora bien, en el marco de la Ley 7/2021, de 1 de diciembre, de impulso para la
sostenibilidad del territorio de Andalucía (LISTA), el alcance del Programa se diluye en la
misma medida en que se difuminan los contenidos concretos del Plan General que
acompaña, que pasa a tener carácter de plan maestro de la ciudad (definidor del modelo
general) y de planificación estratégica de su evolución a largo plazo, reduciendo su
carácter tradicional de plan de ordenación estructural y de ordenación detallada
completa del suelo urbano. La ordenación urbanística general tiene, según el artículo 74
del Decreto 550/2022 (RGLISTA), tres grandes objetos: la definición del modelo general
de ordenación, la planificación estratégica de su evolución a medio y largo plazo, y las
determinaciones que complementan la definición del modelo general.</p>

<p>De la regulación del RGLISTA (en particular los artículos 77.5, 85.2 y 86.3) puede
deducirse que el Programa de Actuación se configura como determinación
complementaria de la ordenación urbanística general a establecer por el PGOM, si bien
determinados contenidos clásicos del Programa quedan ahora incorporados formalmente
en otros documentos del PGOM. Conforme al apartado 8 del artículo 77 RGLISTA, el
PGOM solo puede incorporar propuestas de delimitación de actuaciones de
transformación en suelo rústico que estime convenientes o necesarias para su desarrollo
a corto plazo; en ese caso debe programar el plazo de aprobación del Plan Parcial
correspondiente (máximo 2 años para la aprobación inicial, conforme al artículo 44.2
RGLISTA) e incorporar un Anexo con las bases de ejecución de la actuación: carácter
público o privado de la iniciativa, modalidad de gestión, plazos estimados y estimación
de costes de urbanización y criterios de reparto de cargas. Si el documento completo del
PGOM de ${nombre} no incorporara nuevas propuestas de actuaciones de transformación
urbanística de nueva urbanización, no sería necesario establecer ese plazo ni incorporar
ese Anexo.</p>

<p>También tiene naturaleza propia de Programa de Actuación el establecimiento del
orden de prioridades para la delimitación de actuaciones de nueva urbanización de
medio y largo plazo, así como los criterios de priorización de las actuaciones destinadas a
completar la malla urbana existente antes que la habilitación de nueva urbanización
(artículo 79.3.a RGLISTA). En este sentido, dada la importancia cuantitativa y cualitativa
que va a tener en ${nombre} el suelo urbano, parece razonable que sea el documento
definitivo del POU el que detalle la consideración temporal de cada actuación de
transformación, correspondiendo al Programa del PGOM la graduación temporal de los
nuevos elementos estructuradores del modelo urbano-territorial. Por tanto, los
contenidos propios de un Programa de Actuación quedan hoy distribuidos entre los
diversos componentes del PGOM.</p>

<p><strong>8.2. El Programa de Actuación base de las políticas inversoras municipales.</strong></p>

<p>El Plan General debe seguir siendo, en el ámbito local, un instrumento principal de la
política municipal, y su programa una herramienta para acometer a corto, medio y largo
plazo los elementos estructurantes que la ciudad precise para su mejora y cohesión. Su
validez reside en integrar secuencialmente los proyectos que los Ayuntamientos suelen
acometer aisladamente dentro de las grandes líneas de desarrollo de la ciudad que
diseña el PGOM, sincronizando presupuestos e inversiones públicas y privadas a corto,
medio y largo plazo.</p>

<p>La programación puede aportar a los Ayuntamientos una guía de actuación útil para:
constituir el marco de los presupuestos municipales, en especial el de inversiones; servir
de instrumento válido para los presupuestos autonómicos en sus programas sectoriales;
constituir una referencia para los presupuestos de inversión del Estado; permitir redactar
proyectos con antelación suficiente; reducir costes financieros de créditos de utilización
no inmediata; buscar con antelación fuentes de financiación pública y privada;
aprovechar más intensivamente las inversiones ya realizadas; anticipar y reducir cuellos
de botella entre actuaciones interdependientes; y gestionar con antelación la
participación coordinada de otros niveles administrativos.</p>

<p><strong>8.3. Plazo de programación y priorización en el desarrollo y ejecución de los
elementos definidores del modelo.</strong></p>

<p>La programación ordinaria para la ejecución de los nuevos elementos estructurantes
que establezca el PGOM se dispondrá en cuatro cuatrienios (16 años en total), si bien de
forma justificada el documento completo podrá establecer hasta 20 años. La función de
programación del PGOM alcanza: el establecimiento de plazos para la formulación y
aprobación del planeamiento de ordenación detallada (en especial el POU); el
establecimiento de un orden de prioridades de ejecución de los nuevos sistemas
generales; la decisión sobre qué actuaciones de sistemas generales (artículo 24.2 LISTA),
aun sin programación concreta, son de ejecución necesaria previa o simultánea para
habilitar actuaciones de transformación; y la identificación de actuaciones de sistemas
generales que quedan sin programación por depender de una Administración sectorial o
de un acuerdo de colaboración interadministrativo.</p>

<p>A efectos de programación se diferencian actuaciones programadas y no programadas.
Dentro de las programadas, se considera prioridad alta la que debe desarrollarse en el I
Cuatrienio de vigencia del PGOM, prioridad media la del II y III Cuatrienio, y prioridad baja
la del IV Cuatrienio. El documento completo del PGOM debería asignar prioridad alta a
las actuaciones de mejora urbana y reforma interior no sujetas a revisión de su
instrumento de ordenación detallada, a la formulación del POU y de los Planes Especiales
identificados como de redacción necesaria, y a la ejecución de los sistemas generales que
reduzcan déficits actuales de cohesión social de la ciudad existente. Igualmente
identificará las actuaciones sin programación cierta, diferenciando entre los elementos
estructuradores de ejecución previa o simultánea necesarios para habilitar actuaciones
de transformación, y las intervenciones estructurantes necesarias que dependen de la
asunción de su ejecución por una Administración supramunicipal o de acuerdos de
colaboración interadministrativa.</p>

<p><strong>8.4. Incorporación de medidas de seguimiento de la ejecución y ajuste de la
programación.</strong></p>

<p>El Ayuntamiento debe elaborar, preferentemente de forma bianual y en todo caso cada
cuatro años, un Informe de Evaluación y Seguimiento de la sostenibilidad del desarrollo
urbano de su competencia, considerando al menos la sostenibilidad ambiental y
económica de las actuaciones sobre el medio urbano y rústico, incluyendo un análisis de
la suficiencia hídrica y disponibilidad de agua para los desarrollos pendientes de
ejecución. En su vertiente ambiental, el informe evaluará la actividad de ejecución
conforme a los indicadores que mejor reflejen la actividad urbanística, incluyendo las
determinaciones del Plan de Vigilancia Ambiental. En su vertiente económica, analizará
el impacto en la hacienda municipal de las actuaciones realizadas y las previstas en los
dos años siguientes.</p>

<p>Este informe será conocido por el Pleno del Ayuntamiento y remitido a las
administraciones supramunicipales competentes en ordenación del territorio y medio
ambiente, sirviendo de criterio para iniciar, en su caso, el procedimiento de ajuste de las
determinaciones de programación y gestión urbanística. La actualización de la
programación de las actuaciones de transformación incluidas en el POU o Plan Parcial se
realizará con una periodicidad mínima de cuatro años.</p>

<p><strong>8.5. El estudio económico-financiero del PGOM.</strong></p>

<p>El artículo 85 (apartado 1.4º) del RGLISTA exige que la Memoria de todo instrumento de
ordenación urbanística incluya una Memoria Económica con los criterios de evaluación y
seguimiento del instrumento y, cuando proceda, un estudio económico-financiero (EEF)
de las propuestas, un informe de sostenibilidad económica de las actuaciones de
transformación urbanística propuestas y una memoria de viabilidad económica de las
actuaciones sobre el medio urbano. Aunque una interpretación literal del artículo 85.1.4º
podría sugerir que el EEF solo es exigible en el Plan Parcial, esta lectura no se integra
pacíficamente con la exigencia universal del artículo 62 LISTA para todos los
instrumentos; y dado que el PGOM propone nuevos elementos estructurantes y
delimitaciones de actuaciones de transformación en suelo rústico, resulta necesario
incorporar a nivel básico un Estudio Económico-Financiero que exprese, al menos: el
coste de las inversiones vinculadas a los nuevos elementos estructurantes (sistemas
generales dotacionales e infraestructurales, incluida la movilidad); el cálculo de los costes
de implantación de las actuaciones de transformación de nueva urbanización
delimitadas; el coste de las medidas de mejora del medio rural, ambientales y
paisajísticas; y el coste de redacción de los instrumentos de desarrollo de iniciativa
pública previstos.</p>

<p>El Estudio Económico-Financiero del Plan General debe concebirse como un
documento instrumental y de apoyo a las propuestas y estrategias del PGOM, adaptado
al grado de concreción de estas, y puede incorporar criterios para la conformación de los
EEF más precisos que deban acompañar a los instrumentos de ordenación detallada. La
ejecución de las acciones con programación concreta tiene como pilar principal al propio
Ayuntamiento o a los agentes que promuevan las actuaciones de transformación, sin
perjuicio de que la aportación económica del Estado y las Comunidades Autónomas en el
desarrollo urbanístico del municipio de ${nombre} será muy importante, dado que gestionan
la mayor parte del gasto público en España; para estos organismos, el EEF constituye una
guía sobre las actuaciones que se les asignan con criterios realistas y fundamentados. La
intervención del sector privado, por su parte, se vincula especialmente a las actuaciones
de transformación urbanística y a los estudios económico-financieros y de viabilidad de
los instrumentos que las delimiten y ordenen.</p>

<p><strong>8.6. Criterios para la elaboración del estudio económico-financiero por el
documento completo del PGOM.</strong></p>

<p>Con carácter general, debe asegurarse una vinculación del Programa y del EEF del POU
que clarifique qué acciones de ejecución de elementos estructuradores son necesarias
con carácter previo o simultáneo para habilitar actuaciones de transformación,
identificando responsable, coste y plazo de ejecución; los costes de los sistemas
generales atribuibles se repartirán entre las unidades de aprovechamiento, resultando
un importe unitario que garantiza la construcción de los sistemas infraestructurales y
dotacionales de la ciudad. Igualmente debe valorarse la ejecución de los elementos
estructurantes necesarios para la mejora de la ciudad existente que no estén vinculados
a nuevas actuaciones de transformación, identificando en particular los que, situados en
suelo rural, quedan fuera del ámbito territorial del POU.</p>

<p>Como criterios generales de diseño y ordenación orientados a la sostenibilidad de los
costes de urbanización se proponen: que las explanaciones y rasantes se acomoden en lo
posible a la configuración primitiva del terreno, procurando un saldo de movimiento de
tierras próximo a cero; canalización subterránea de todas las redes de servicios urbanos,
en particular energía eléctrica y telecomunicaciones; integración y adecuación
medioambiental de los elementos proyectados, minimizando las cargas de conservación
de zonas ajardinadas y pavimentaciones; elección de especies de jardinería adaptadas al
clima de Andalucía; e inclusión del mobiliario público y equipamiento de zonas verdes
necesario. El diseño del nuevo viario principal debe recuperar el concepto de «avenida
urbana», reservando espacio para transporte colectivo, mejorando las condiciones para
la bicicleta y el desplazamiento peatonal, e incorporando arbolado y criterios
paisajísticos en todas sus secciones.</p>

<p>En cuanto a la asignación de agentes, los operadores se agrupan clásicamente en
públicos (administración central, autonómica y local, según su ámbito competencial) y
privados (titulares de aprovechamientos lucrativos). Como criterios de asignación: las
competencias municipales en infraestructuras y equipamientos urbanísticos no suelen
ser exclusivas y pueden compartirse con otras Administraciones; corresponde al
Gobierno autonómico y a la Administración General del Estado la mayor parte de las
intervenciones en elementos estructuradores de competencia supramunicipal
(integración urbana de infraestructuras, redes de transporte de movilidad sostenible,
equipamientos educativos y sanitarios, red de carreteras interurbanas); la participación
de administraciones no municipales se realiza a menudo vía subvenciones a inversiones
municipales de carácter supramunicipal; las inversiones públicas en adquisición de suelo
para nuevos espacios públicos se asignan, en general, al Ayuntamiento (mayoritariamente
obtenido mediante cesión); y las actuaciones urbanísticas privadas en nueva urbanización
que benefician directamente a los titulares de las parcelas resultantes se asignan
íntegramente a los inversores privados, conforme a la legislación vigente —el deber
urbanístico está vinculado a quien asuma la responsabilidad de la ejecución, no a la
propiedad del suelo, y es en el procedimiento de ejecución o delimitación de la actuación
cuando se determina finalmente el responsable y se exige la acreditación de su
capacidad financiera.</p>

<p><strong>8.7. El informe de sostenibilidad económica en el PGOM.</strong></p>

<p>El RGLISTA únicamente exige de forma expresa la Memoria o Informe de Sostenibilidad
Económica (ISE) para los instrumentos que establecen la ordenación urbanística
detallada, sin previsión específica para el PGOM. No obstante, desde una interpretación
sistemática del ordenamiento jurídico —en especial el artículo 22.4 del TRLSRU 2015—
debe considerarse que cualquier instrumento que posibilite actuaciones de urbanización,
directa o indirectamente, debe contar con el oportuno ISE, si bien un instrumento de
ordenación general como este PGOM, que no establece la delimitación y ordenación
detallada de las actuaciones de transformación, requiere un ISE adaptado a esa función
más diluida, sin necesidad de abordar el análisis detallado que exige el artículo 85.3.a).1º
RGLISTA para la ordenación detallada. En todo caso, corresponde al PGOM justificar la
suficiencia y adecuación del suelo destinado a usos productivos, estableciendo las
directrices que guíen la delimitación de las actuaciones de transformación y la
orientación de su ordenación detallada.</p>

<p>Para la redacción del Informe de Sostenibilidad Económica se recomienda adoptar los
criterios de la Guía Metodológica para la Redacción de Informes de Sostenibilidad
Económica del Ministerio de Fomento (2012), que estructura el informe en: estimación de
la inversión pública de implantación de los nuevos elementos configuradores del modelo
e incremento patrimonial, coincidente con el cálculo asignado a la Administración Local
en el estudio económico-financiero; estimación de los gastos que supondrá para la
administración local el mantenimiento de los nuevos servicios implantados (conservación
de infraestructuras viarias, de abastecimiento, de la red de saneamiento y depuración, del
suministro y alumbrado eléctrico, de zonas verdes y mobiliario urbano, y funcionamiento
del transporte público), incluyendo los gastos de personal correspondientes a los
servicios públicos urbanos que deberá prever el Ayuntamiento de ${nombre} como
consecuencia del incremento de población derivado de las actuaciones propuestas;
estimación de los ingresos para la hacienda municipal, tanto los procedentes de tributos
relacionados con la actividad inmobiliaria (IBI, ICIO, IIVTNU) como los no vinculados a ella
y estimados en función de la población prevista (IVTM, impuesto de actividades
económicas, tasas de vados, basuras, abastecimiento de agua, alcantarillado y
depuración); y análisis de resultados, determinando la sostenibilidad de la propuesta
conforme al Balance Fiscal Municipal, equivalente al ahorro bruto: <em>Balance fiscal =
Ahorro bruto = Ingresos corrientes − Gastos de funcionamiento de los servicios</em>, que
establece la capacidad de financiación que el municipio puede destinar a inversiones
reales sin recurrir a financiación externa.</p>

<p>Los costes se determinarán aplicando los presupuestos de gastos de mantenimiento y
funcionamiento actuales, como estimaciones directas en unidades monetarias reales del
año del Informe; los ingresos se estimarán aplicando a las bases imponibles los tipos de
gravamen de las Ordenanzas Fiscales vigentes, partiendo del último Presupuesto
municipal liquidado (salvo ejercicios de coyuntura muy marcada). Por último, en cuanto a
la justificación de suelo suficiente para usos productivos —aquel susceptible de generar
actividad económica: industrial en sus distintas categorías, terciario, turístico, etc.—, el
artículo 20.1.b del Texto Refundido de la Ley de Suelo obliga a las administraciones a
garantizar el destino de suelo adecuado y suficiente para estos usos, determinación que
el PGOM debe abordar, conforme al artículo 76 RGLISTA, dentro de las estrategias para el
mantenimiento y mejora de la ciudad existente y para la ordenación de futuros
desarrollos en suelo rústico, en coherencia con los criterios territoriales del Plan de
Ordenación del Territorio de Andalucía.</p>
</div>
<div class="src-note">PLANTILLA — texto normativo común, sin datos del diagnóstico</div>
`.trim();
}
