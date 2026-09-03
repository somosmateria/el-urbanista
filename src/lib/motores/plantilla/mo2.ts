import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.2 · Los criterios y objetivos que se proponen para la definición del
 * modelo de ordenación adoptado.
 *
 * docs/01-analisis-diagnostico-a-ordenacion.md describe esto como un
 * "banco de objetivos reutilizable" con ajuste según los problemas
 * detectados en el diagnóstico (MI.6-8) de cada municipio. Comprobado
 * contra el texto real: el criterio y los 2-3 primeros objetivos de cada
 * uno de los 11 temas son casi siempre compartidos entre Osuna y Lora del
 * Río, pero cada municipio añade o quita objetivos concretos según lo que
 * su propio diagnóstico señala — por ejemplo, en "medio físico" Lora del
 * Río añade objetivos sobre cauces fluviales y suelo agrario que la
 * versión de Osuna no tiene en esa posición. Automatizar esa selección
 * exigiría un motor propio de criterio, no una plantilla.
 *
 * Lo que se genera aquí es la lista completa de criterios y objetivos tal
 * como los redactó el equipo para Osuna, usada como banco de referencia de
 * partida — no como texto ya cerrado. El aviso al final lo deja explícito:
 * cada objetivo debe revisarse y ajustarse contra el diagnóstico real del
 * municipio antes de dar el capítulo por cerrado.
 */
export function generarMO2(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">MO.2 · CRITERIOS Y OBJETIVOS DEL MODELO</div>
<div class="doc-text">
<p>La nueva ordenación urbanística general que propone este documento de Avance de
Plan General de Ordenación Municipal de ${nombre} está orientada por un conjunto de
principios, fines y directrices que aseguran el interés general del proyecto
urbano-territorial propuesto, deducidos de las principales disposiciones normativas y
documentos de referencia adoptados por las Administraciones para definir las políticas
públicas de ordenación del suelo y del territorio desde los requerimientos de la
sostenibilidad: los principios de desarrollo territorial y urbano sostenible del artículo 3 y
los criterios básicos de utilización del suelo del artículo 20 del Real Decreto Legislativo
7/2015 (TRLSRU); los fines, principios generales y criterios de ordenación urbanística de
los artículos 3, 4 y 61 de la Ley 7/2021, de impulso para la sostenibilidad del territorio de
Andalucía (LISTA); los criterios de sostenibilidad de los artículos 79 a 83 del Decreto
550/2022 (RGLISTA); las directrices vigentes del Plan de Ordenación del Territorio de
Andalucía (Decreto 206/2006); y la Estrategia Andaluza de Sostenibilidad Urbana 2030.</p>

<p>Para definir los Criterios y Objetivos principales del PGOM de ${nombre} se consideran,
además, cuatro referentes estratégicos y conceptuales que aseguran que el Plan no se
diseñe de manera aislada o arbitraria, sino alineado con estrategias y objetivos
superiores: los Objetivos de Desarrollo Sostenible (ODS) de la Agenda 2030 de Naciones
Unidas; la Agenda Urbana Española 2019, reconocida como acción palanca en el Plan de
Acción de la Agenda 2030 del Gobierno de España; la Agenda Urbana de Andalucía 2030;
y el Plan Andaluz de Acción por el Clima (PAAC 2021–2030), instrumento estratégico y
vinculante de la Junta de Andalucía frente al cambio climático. Estos referentes
justifican las decisiones del plan, favorecen su coherencia y legitimidad técnica y
política, permiten integrar la planificación municipal con políticas de escala superior, y
sirven de base para los criterios de evaluación y seguimiento del plan.</p>

<p>Asumiendo estos principios, directrices, fines y referentes, el modelo urbano y
territorial que se propone en este Avance del Plan General de Ordenación Municipal de
${nombre} se asienta en los siguientes criterios y objetivos, organizados por ámbito
temático.</p>

<p><strong>2.1. Medio físico e infraestructura verde.</strong></p>
<p><em>Criterio:</em> la consideración de las nuevas determinaciones normativas de la LISTA
en la ordenación del suelo rústico, tanto en lo que se refiere a su zonificación como a los
condicionantes superpuestos.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Definir criterios para la ordenación del suelo rústico mediante el establecimiento de
categorías de ordenación de acuerdo con el artículo 14 de la LISTA, homogeneizando las
denominaciones para su calificación y las directrices para la regulación de usos ordinarios
y extraordinarios en cada categoría.</li>
<li>Establecimiento de una red de infraestructura verde interconectada que funcione y
repare la segmentación y segregación actual de sus unidades paisajísticas, constituyéndose
en factor clave para el diseño del modelo territorial.</li>
<li>Asegurar un correcto funcionamiento de los ecosistemas de la red de infraestructura
verde, garantizando los servicios ecosistémicos derivados de estos espacios.</li>
</ol>

<p><strong>2.2. Patrimonio natural y paisaje.</strong></p>
<p><em>Criterio:</em> valorar los bienes y servicios ambientales que proporciona el patrimonio
natural a los habitantes del municipio, en su componente biótica y abiótica, como
oportunidad para mejorar su bienestar; y entender el paisaje como referencia básica en
las propuestas de ordenación, clave para que la implantación de usos y actividades no
menoscabe sus valores ambientales, paisajísticos y culturales.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Integrar las variables biodiversidad y geodiversidad en la ordenación urbanística.</li>
<li>Promover que en las propuestas de urbanización se apliquen soluciones basadas en la
naturaleza, que mejoran el funcionamiento de los ecosistemas, incrementan la
biodiversidad y mejoran la resiliencia y el bienestar de la población.</li>
<li>Valorar el paisaje desde un punto de vista integral —rural y urbano, de calidad y
degradado— con medidas de protección de los primeros y restauración de los segundos.</li>
<li>Evitar los impactos paisajísticos negativos, integrando en el paisaje los elementos y
actividades que se desarrollan en el territorio, en especial infraestructuras y áreas de
actividad económica.</li>
<li>Procurar la máxima compatibilización del desarrollo de las energías renovables con la
preservación del patrimonio paisajístico.</li>
<li>Desarrollar las potencialidades turísticas del municipio a partir de su patrimonio
natural y paisaje de calidad, compatibilizando su disfrute con la protección y mejora que
aseguren su preservación para las generaciones futuras.</li>
</ol>

<p><strong>2.3. Patrimonio cultural.</strong></p>
<p><em>Criterio:</em> concebir el patrimonio cultural como un activo que contribuye a fortalecer
la identidad de los pueblos, mejorar la calidad de vida, fortalecer la cohesión social,
diversificar la actividad económica y avanzar en un modelo integral de desarrollo
sostenible.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Contribuir a inventariar y proteger los bienes de valor artístico, histórico,
arqueológico, paleontológico, etnológico, antropológico, lingüístico, científico, industrial,
paisajístico, arquitectónico o de cualquier otra naturaleza cultural que merezcan
reconocimiento y transmisión intergeneracional.</li>
<li>Asegurar que la ejecución de las previsiones de ordenación se realice en armonía con
los valores de protección del patrimonio histórico y cultural, fomentando su conservación
y rehabilitación.</li>
</ol>

<p><strong>2.4. Cambio climático.</strong></p>
<p><em>Criterio:</em> el cambio climático es uno de los mayores retos a los que la humanidad ha
de enfrentarse, y debe hacerlo de forma coordinada: reduciendo las emisiones de gases
de efecto invernadero que aceleran el calentamiento global, y anticipándose a los
cambios para mitigar o reducir los riesgos asociados.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Identificación de las zonas más afectadas por riesgos derivados del cambio climático.</li>
<li>Contribuir, a través de las propuestas de ordenación, a reducir el balance neto de
emisiones de gases de efecto invernadero y a mejorar la resiliencia.</li>
<li>Asumir la infraestructura verde y asegurar que una parte se incorpore a la red del
sistema general de espacios libres.</li>
<li>Permeabilización y vegetación de los espacios públicos, fomentando infraestructuras
verdes y azules y soluciones basadas en la naturaleza en ámbitos susceptibles de
inundación y estrés térmico, en particular el efecto isla de calor.</li>
<li>Posibilitar la instalación de dispositivos bioclimáticos en fachadas o cubiertas de
edificios existentes y promover la construcción de cubiertas vegetales.</li>
<li>Incorporar en la normativa un estándar de arbolado por metro cuadrado de nueva
construcción.</li>
<li>Promover espacios públicos de bajo coste de mantenimiento, priorizando la flora
local y estrategias de ahorro en riego y mantenimiento.</li>
<li>Incorporar normas para que las construcciones de nueva planta con zonas verdes o
comunes almacenen las aguas pluviales recogidas para su uso como agua no potable.</li>
</ol>

<p><strong>2.5. Movilidad y accesibilidad universal.</strong></p>
<p><em>Criterio:</em> invertir la escala de prioridades tradicional de los espacios públicos
urbanos y las políticas de movilidad, atendiendo a criterios de eficiencia energética,
equidad social, vulnerabilidad, siniestralidad y calidad de vida urbana, favoreciendo los
modos no motorizados y el transporte público, e interiorizando la accesibilidad
universal y el diseño para todas las personas en la planificación urbanística.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Reducir las necesidades de movilidad mediante una relación más adecuada entre
espacios de residencia, trabajo, cuidado, ocio y equipamientos.</li>
<li>Lograr una densidad adecuada que facilite un transporte público multimodal y
energéticamente eficiente, que reduzca las emisiones de CO2 y tenga en cuenta la
movilidad del cuidado.</li>
<li>Promover la movilidad peatonal y ciclista como transporte cotidiano, con criterios de
seguridad, comodidad y conectividad.</li>
<li>Promover sendas urbanas peatonales que pongan en valor el paisaje, incluyendo
sendas de aproximación a los grandes atractores de personas (centros de salud, colegios,
entre otros).</li>
<li>Promover la adaptación del espacio público y los equipamientos a la accesibilidad
universal y a la amigabilidad con las personas mayores.</li>
</ol>

<p><strong>2.6. Metabolismo urbano. Agua.</strong></p>
<p><em>Criterio:</em> garantizar la disponibilidad de agua, su gestión sostenible y el
saneamiento para todos son elementos fundamentales para el cumplimiento de los
Objetivos de Desarrollo Sostenible.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Completar las infraestructuras de depuración y saneamiento, reduciendo alivios en
tiempos de lluvia y potenciando la reutilización de aguas residuales.</li>
<li>Atender la demanda de agua con garantía de suministro y calidad adecuadas,
propiciando el ahorro y la eficiencia mediante la renovación o ampliación de depósitos y
de redes de distribución con pérdidas.</li>
</ol>

<p><strong>2.7. Metabolismo urbano. Energía.</strong></p>
<p><em>Criterio:</em> asumir que la eficiencia energética y las energías renovables, los dos ejes
de la Estrategia Energética de Andalucía 2030, son requisitos para la sostenibilidad
territorial, la competitividad y la lucha contra el cambio climático, siendo necesario el
aumento de la eficacia energética, la descarbonización y el progreso hacia la
autosuficiencia energética.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Reducción del consumo de fuentes no renovables.</li>
<li>Propiciar los mejores sistemas de autosuficiencia energética, la mejora de la
eficiencia energética de edificaciones y espacios urbanizados existentes, y el alumbrado
público energéticamente eficiente.</li>
<li>Establecer criterios bioclimáticos para la planificación, proyecto y ejecución de
edificaciones y espacios públicos, en orientación, diseño, materiales y sistemas pasivos y
activos que minimicen el consumo energético.</li>
<li>Propiciar la utilización de vegetación en edificios y espacios públicos como
aislamiento y regulador del confort climático a lo largo del año.</li>
</ol>

<p><strong>2.8. Metabolismo urbano. Residuos.</strong></p>
<p><em>Criterio:</em> la transición hacia un modelo de economía circular, donde los productos y
recursos se mantengan en el flujo económico el mayor tiempo posible y se reduzca al
mínimo la generación de residuos, constituye una prioridad básica para el desarrollo
sostenible.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Incentivar la recogida selectiva de residuos, favoreciendo su recuperación,
reutilización y reciclaje, y reduciendo su depósito en vertederos.</li>
<li>Fomentar, a través de las ordenanzas municipales de edificación y urbanización, la
utilización de materiales durables, reciclables y de origen biológico que minimicen los
impactos de su diseño, producción y reciclado.</li>
</ol>

<p><strong>2.9. Salud.</strong></p>
<p><em>Criterio:</em> reconocer que las decisiones de planificación urbana cambian los entornos,
afectan a los lugares donde se vive y se trabaja, a la forma de desplazarse y al tiempo de
ocio, siendo por tanto factores determinantes de la salud de la población — de ahí la
necesidad de considerarla desde las etapas más tempranas del planeamiento.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Promover desarrollos urbanos compactos con uso mixto del suelo, calles accesibles
bien conectadas y densidad adecuada, integrando los nuevos desarrollos en los
existentes.</li>
<li>Crear espacios confortables, seguros y universalmente accesibles que favorezcan el
bienestar y la cohesión social.</li>
<li>Procurar la accesibilidad equitativa a las redes de equipamientos mediante una
distribución equilibrada.</li>
<li>Propiciar espacios verdes y áreas naturales conectados entre sí y con el medio urbano
mediante corredores peatonales, red ciclista o transporte público.</li>
<li>Disminuir la concentración de agentes contaminantes fomentando el transporte
público.</li>
<li>Garantizar viviendas de calidad, salubres, accesibles y energéticamente eficientes,
con criterios bioclimáticos, fomentando la mezcla e integración tipológica de viviendas
asequibles para los diversos grupos de población.</li>
</ol>

<p><strong>2.10. Perspectiva de género.</strong></p>
<p><em>Criterio:</em> dado que hombres y mujeres tienen distintas necesidades y aspiraciones en
relación con el territorio y el espacio urbano y rural, derivadas de los roles de género que
asumen en su vida cotidiana, la inclusión de la perspectiva de género en la ordenación
urbanística puede favorecer que accedan a todos los recursos en igualdad de
condiciones.</p>
<p><em>Objetivos:</em></p>
<ol>
<li>Asegurar que los espacios libres públicos sean de calidad, seguros e inclusivos,
promoviendo la convivencia en el diseño de parques y jardines y una iluminación
adecuada, en especial en calles secundarias, pasos subterráneos y zonas despobladas.</li>
<li>Fomentar la multifuncionalidad y complementariedad de los equipamientos,
favoreciendo la combinación de servicios de cuidado para diferentes grupos sociales,
proponiendo la calificación de Equipamiento Multifuncional de Barrio.</li>
<li>Identificar las zonas, itinerarios y puntos de riesgo para las mujeres, y elaborar
programas para mejorar la percepción y apropiación del espacio público por las mujeres.</li>
<li>Posibilitar el desarrollo de una diversidad de tipologías de vivienda, con flexibilidad
en su configuración para adaptarse a las diferentes etapas de una familia.</li>
</ol>

<p><strong>2.11. Gobernanza.</strong></p>
<p><em>Criterio:</em> un proceso de participación eficiente debe trascender su connotación como
mero requerimiento legal para transformarse en un criterio metodológico de primera
magnitud, y su alcance temporal limitado para constituirse, durante la vigencia del Plan,
en un mecanismo de control de la ejecución y fiscalización de la fidelidad de las
actuaciones con los objetivos, criterios y fundamentos que las inspiraron.</p>
<p><em>Objetivos — concebir la participación ciudadana:</em></p>
<ol>
<li>Como parte sustancial del cuerpo metodológico de la revisión del planeamiento, que
actúe como argumento de priorización de demandas y como instrumento de validación
del proyecto urbanístico y territorial.</li>
<li>Como instrumento de aprendizaje social: proceso de retroalimentación entre el
conocimiento experto (técnico-científico) y el conocimiento no experto (la experiencia del
ciudadano).</li>
<li>Como instrumento de identificación de tendencias que permita deducir el interés
general a partir de las solicitudes emitidas por los diferentes actores urbanos.</li>
<li>Como instrumento de evaluación de la idoneidad de la revisión del planeamiento
frente a dichas solicitudes.</li>
<li>Como instrumento de comprobación de la correcta ejecución de las previsiones,
actuaciones y propuestas de la revisión del planeamiento.</li>
</ol>
</div>
<div class="src-note">PLANTILLA — banco de objetivos de referencia (tomado de un Avance real). Revisa y ajusta cada criterio y objetivo contra el diagnóstico propio de este municipio antes de cerrar el capítulo — a diferencia del resto de plantillas, este contenido no se genera ya verificado.</div>
`.trim();
}
