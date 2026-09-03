import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.7 · Directrices para un urbanismo inclusivo: accesibilidad, diversidad,
 * género, seguridad y uso equitativo del suelo.
 *
 * A diferencia de MO.4/MO.9/MO.12, el texto real de Osuna SÍ incluye
 * observaciones concretas del municipio intercaladas en el marco genérico
 * (calles y barrios nombrados, comunidades migrantes presentes, zonas
 * percibidas como inseguras, actuaciones ya realizadas por el
 * ayuntamiento...). Esas frases no se pueden generalizar a otro municipio
 * sin inventarlas — no están en el diagnóstico de forma estructurada y son
 * fruto de participación/conocimiento local real. Esta plantilla reproduce
 * el marco conceptual (que sí es genérico y reutilizable, confirmado contra
 * Lora del Río) y usa el nombre del municipio donde el texto se dirige a él
 * de forma genérica, pero omite deliberadamente esas observaciones locales
 * — quedan como huecos que el técnico completa a mano, no como texto
 * inventado que parezca terminado.
 */
export function generarMO7(municipio: MunicipioRow): string {
  const nombre = municipio.nombre;
  return `
<div class="doc-eyebrow">MO.7 · DIRECTRICES PARA UN URBANISMO INCLUSIVO</div>
<div class="doc-text">
<p>El urbanismo inclusivo es una forma de pensar y planificar la ciudad que pone en el
centro a las personas. Su objetivo es que todas y todos podamos vivir, movernos y
disfrutar del espacio urbano con igualdad de derechos, sin importar la edad, el
género, el origen o las capacidades. Parte de una idea fundamental: las ciudades no
son neutras. Durante mucho tiempo se diseñaron pensando en un único modelo de
habitante —adulto, trabajador, autónomo—, dejando fuera a muchas realidades y
trayectorias.</p>

<p>El urbanismo inclusivo va más allá de calles y edificios. Abarca políticas públicas
justas, que eliminen barreras y garanticen derechos; procesos participativos reales,
donde todas las voces cuenten; y prácticas comunitarias, que refuercen la
convivencia y el cuidado mutuo. Sus principios básicos son reconocer y valorar la
diversidad, asegurar la equidad en el acceso a servicios y recursos, fomentar la
participación ciudadana, eliminar todo tipo de barreras físicas y sociales, y entender
la ciudad desde una mirada interseccional que tenga en cuenta diferentes formas de
desigualdad. En resumen, el urbanismo inclusivo busca una ciudad democrática,
sostenible y humana, donde la planificación sirva para construir justicia y no
exclusión.</p>

<p><strong>7.1. Accesibilidad universal.</strong></p>

<p>En Andalucía, la accesibilidad universal está regulada principalmente por la Ley
4/2017, de 25 de septiembre, de los Derechos y la Atención a las Personas con
Discapacidad en Andalucía, que reconoce la accesibilidad universal y el diseño para
todas las personas como principios fundamentales de las políticas públicas; y por el
Decreto 293/2009, de 7 de julio, que establece las normas de accesibilidad en
infraestructuras, urbanismo, edificación y transporte, incluyendo fichas técnicas
obligatorias para su aplicación.</p>

<p>La accesibilidad universal es uno de los pilares del urbanismo inclusivo. Se basa en
el diseño universal, una filosofía que promueve la creación de entornos, productos y
servicios utilizables por cualquier persona, sin necesidad de adaptaciones
posteriores. Llevar la accesibilidad al espacio urbano significa integrarla desde la fase
inicial del diseño, considerando las distintas formas de moverse, percibir y
comprender el entorno.</p>

<p>El diseño universal se apoya en siete principios básicos: uso equitativo, flexibilidad
en el uso, simplicidad e intuición, información perceptible, tolerancia al error, bajo
esfuerzo físico, y espacio suficiente para el acceso y uso. Incorporar estos principios
al planeamiento y a la gestión urbana significa avanzar hacia entornos más justos,
seguros y habitables.</p>

<p>Una ciudad accesible identifica y elimina activamente todas aquellas barreras que
impiden el uso pleno y autónomo del espacio: barreras físicas, que dificultan el
desplazamiento y la movilidad; sensoriales, que afectan la orientación, la interacción
o la comprensión del entorno; y cognitivas, que complican la interpretación de
espacios complejos o de información no clara. La permanencia de estas barreras
refleja un modelo urbano excluyente; su eliminación no es una mejora voluntaria,
sino una obligación ética, social y legal, directamente relacionada con el derecho a la
ciudad. La accesibilidad debe estar garantizada en el transporte público, en el
mobiliario urbano, en los edificios de uso público y privado colectivo, y en los
espacios públicos abiertos. En definitiva, la accesibilidad universal no puede tratarse
como una corrección puntual o un añadido técnico: debe ser una condición
estructural del planeamiento urbano.</p>

<p><strong>7.2. Diversidad e interculturalidad.</strong></p>

<p>El urbanismo inclusivo parte del reconocimiento de que la ciudad no es un espacio
uniforme ni neutral, sino un territorio diverso, habitado por personas con distintas
realidades sociales, culturales, generacionales y funcionales. Esta pluralidad obliga a
superar el modelo urbano tradicional, que históricamente ha priorizado a un sujeto
normativo —hombre, adulto, sano, productivo, autónomo—, invisibilizando a
muchos otros colectivos.</p>

<p>En Andalucía, las principales normas que respaldan este enfoque son la Ley
8/2017, de 28 de diciembre, que garantiza los derechos de las personas LGTBI y
establece medidas contra la discriminación por orientación sexual, identidad o
expresión de género; la Ley 17/2007, de 10 de diciembre, de Educación de Andalucía,
que promueve la igualdad de oportunidades, la inclusión y la atención a la diversidad
en el ámbito educativo; y los Decretos 147/2002 y 167/2003, que regulan la atención al
alumnado con necesidades educativas especiales.</p>

<p>La diversidad adopta muchas formas. La diversidad de edades exige maneras
distintas de vivir y relacionarse con el entorno urbano en cada etapa de la vida, por lo
que el diseño debe fomentar la convivencia intergeneracional. La diversidad cultural y
étnica recuerda que las ciudades son producto de procesos migratorios y
convivencias históricas que han conformado un mosaico de identidades, lenguas y
costumbres, que deben estar representadas y tener espacio en lo urbano. La
diversidad funcional y cognitiva exige garantizar que la accesibilidad sea una
condición estructural del espacio, no un añadido, para las personas con discapacidad
visible o invisible que han sido sistemáticamente excluidas del diseño urbano. Y la
diversidad socioeconómica obliga a repensar la ciudad como un entorno habitable
para todas las clases sociales, evitando dinámicas que expulsen a la población más
vulnerable.</p>

<p>El planeamiento intercultural y multigeneracional es clave para avanzar en este
sentido: supone adoptar una mirada interseccional que reconozca cómo diferentes
identidades (edad, género, origen, etnia, clase social, capacidad, lengua) se cruzan y
producen formas específicas de inclusión o exclusión en el espacio urbano. En este
marco, la participación comunitaria se entiende como un derecho sustantivo y no
como un trámite simbólico, y debe tener carácter vinculante, de manera que las
aportaciones ciudadanas influyan efectivamente en las decisiones de planeamiento y
gestión urbana.</p>

<p><strong>7.3. Perspectiva de género en el urbanismo.</strong></p>

<p>La Ley 12/2007, de 26 de noviembre, para la Promoción de la Igualdad de Género en
Andalucía, es la norma autonómica de referencia para avanzar hacia la igualdad real y
efectiva entre mujeres y hombres, aplicable también al diseño, gestión y planificación
del entorno urbano.</p>

<p>El urbanismo con perspectiva de género nace de la crítica al modelo tradicional de
ciudad, diseñado históricamente desde una visión androcéntrica y productivista que
ha priorizado los desplazamientos lineales —del hogar al trabajo— asociados al varón
adulto económicamente activo, ignorando las trayectorias múltiples, fragmentadas y
ligadas al cuidado que realizan mayoritariamente las mujeres y otras disidencias de
género.</p>

<p>Estas desigualdades de género se manifiestan en distintos niveles: en el acceso,
muchas mujeres y personas LGTBIQ+ condicionan sus desplazamientos por miedo al
acoso o la violencia; en el uso, la sobrecarga de cuidados restringe su movilidad y
tiempo disponible; y en la apropiación, persiste una escasa visibilidad simbólica y
política. Ante este escenario, el urbanismo feminista propone construir entornos
cuidados, accesibles y seguros desde la prevención y la corresponsabilidad: calles y
plazas bien iluminadas y sin puntos ciegos, barrios interconectados, caminables y con
usos mixtos, y equipamientos de apoyo como baños públicos, lactarios, áreas de
descanso y zonas infantiles.</p>

<p>Un elemento clave de este enfoque es la centralidad de los cuidados en el
territorio: reorganizar la ciudad en torno a la proximidad, los ritmos vitales y las redes
de apoyo, promoviendo barrios multifuncionales donde la vida diaria pueda
desarrollarse cerca del hogar, con infraestructuras comunitarias como escuelas
infantiles, centros de día, comedores sociales o lavanderías colectivas. Es
imprescindible, además, transformar los procesos de decisión, incorporando
activamente a mujeres y disidencias en los equipos técnicos, la participación
ciudadana y la gobernanza urbana. En definitiva, aplicar una perspectiva de género en
el urbanismo supone pasar de una ciudad funcional y productivista a una ciudad
cuidadora, equitativa y democrática.</p>

<p><strong>7.4. Seguridad urbana inclusiva.</strong></p>

<p>En muchas ciudades, las políticas de seguridad se han basado en una lógica
punitiva y de control —vigilancia tecnológica, presencia policial constante, diseño
defensivo del espacio público—, que suele generar entornos fragmentados y hostiles
y tiende a criminalizar a determinados colectivos: jóvenes, personas migrantes,
comunidades racializadas, trabajadoras sexuales, personas sin hogar o disidencias
sexo-genéricas.</p>

<p>Frente a este enfoque limitado, el urbanismo inclusivo propone entender la
seguridad como un derecho colectivo, inseparable del derecho a la ciudad, que
garantice que todas las personas puedan habitar, circular y apropiarse del espacio
urbano sin miedo, discriminación ni violencia, reconociendo que los riesgos no son
iguales para todos: para muchas mujeres y personas LGTBIQ+ se manifiestan como
acoso callejero y violencia de género; para personas migrantes o racializadas, como
discriminación o control policial selectivo; y para quienes habitan barrios populares,
como falta de servicios y abandono institucional.</p>

<p>Con esta perspectiva, la seguridad deja de ser una competencia exclusivamente
policial para convertirse en una condición básica de vida digna, lo que requiere
diseñar entornos accesibles, habitables y cuidados; fomentar la presencia diversa y
continua de personas en el espacio público; promover procesos participativos para
identificar zonas percibidas como inseguras; e impulsar una cultura urbana basada
en el respeto y la convivencia.</p>

<p>El diseño urbano influye directamente en la percepción de seguridad: visibilidad,
sin puntos ciegos ni muros opacos; iluminación adecuada, homogénea y continua;
usos mixtos que eviten zonas vacías en determinados horarios; y presencia activa y
diversa que fortalezca la apropiación del espacio. Frente al acoso callejero, una de las
formas más comunes de violencia urbana, se necesita una estrategia integral basada
en campañas de sensibilización, canales de denuncia accesibles, infraestructura de
respuesta rápida y participación directa de colectivos vulnerables en la identificación
de zonas de riesgo mediante mapeos participativos. Una seguridad urbana inclusiva
exige, en definitiva, diseñar con justicia espacial, asignando más recursos donde más
se necesitan.</p>

<p><strong>7.5. Uso equitativo de la ciudad.</strong></p>

<p>En Andalucía, el uso equitativo del suelo y del espacio público se articula a través de
la normativa urbanística y de planificación territorial, que promueve principios de
accesibilidad, equilibrio de usos, sostenibilidad e inclusión: provisión de espacios
verdes y zonas públicas bien distribuidas, garantía de vivienda pública o asequible,
adaptabilidad de los estándares dotacionales, e impulso a la movilidad sostenible.</p>

<p>Desde el enfoque del urbanismo inclusivo, el acceso a los bienes urbanos no debe
depender de la renta, el barrio o la posición social. La equidad urbana exige una
distribución justa de recursos —equipamientos básicos accesibles y bien conectados,
espacios públicos de calidad bien distribuidos, e infraestructura verde y azul
disponible en todos los barrios—, evitando la segregación socioespacial y la
gentrificación, que desplaza a comunidades históricas encareciendo la vivienda y
transformando la identidad barrial. Un urbanismo orientado a la equidad propone
regular el precio del suelo y de la vivienda, garantizar vivienda asequible en todos los
barrios, y proteger la permanencia de las comunidades en los procesos de
regeneración urbana.</p>

<p>Un uso verdaderamente equitativo del espacio implica además reconocer formas
diversas de vivir y estar en la ciudad: permanecer y descansar sin consumir; habitar
en sentido amplio, reconociendo también las prácticas comunitarias y las economías
informales; y disfrutar sin discriminación del acceso a la cultura, la naturaleza y el
ocio urbano. Lograr una ciudad equitativa requiere herramientas como la
zonificación inclusiva, los presupuestos participativos, los mapeos de brechas
urbanas y los planes de regeneración urbana con enfoque social.</p>

<p><strong>7.6. Conclusión.</strong></p>

<p>El urbanismo inclusivo parte de una premisa básica pero urgente: la ciudad no es
igual para todas las personas. Frente a modelos de planificación que han
reproducido desigualdades, exclusiones y violencias en el espacio urbano, esta
perspectiva propone repensar y rediseñar la ciudad desde la diversidad humana, con
un enfoque interseccional y de derechos, a través de seis criterios interrelacionados:
accesibilidad universal, diversidad e interculturalidad, perspectiva de género,
seguridad urbana no punitiva, uso equitativo del espacio, y equidad territorial.</p>

<p>Avanzar hacia un modelo de ciudad más inclusivo implica enfrentar retos
estructurales —la persistencia de modelos urbanos excluyentes, la inercia
institucional y las crisis múltiples que agudizan las desigualdades— pero también
aprovechar señales de cambio: la creciente movilización ciudadana por el derecho a
la ciudad, la existencia de marcos normativos progresivos, y el desarrollo de
herramientas participativas y datos abiertos que permiten una planificación más
sensible, eficaz y democrática.</p>

<p>Para que el urbanismo inclusivo deje de ser una aspiración y se convierta en una
práctica habitual en ${nombre}, se proponen las siguientes líneas de acción: incorporar
de forma transversal la perspectiva de género, diversidad y accesibilidad en todos los
niveles del planeamiento; garantizar procesos de participación efectivos y
vinculantes, con representación real de colectivos diversos y vulnerabilizados;
desarrollar instrumentos técnicos con sensibilidad social; invertir de forma
prioritaria en espacio público de calidad, infraestructura de cuidados y vivienda
asequible; y promover la formación técnica y profesional con enfoque interseccional.</p>

<p>El urbanismo inclusivo no es solo un conjunto de herramientas técnicas ni una
moda académica. Es, sobre todo, una propuesta ética y política para reconfigurar la
ciudad como un espacio común, democrático y habitable para todas las personas. El
municipio de ${nombre}, como cualquier otro municipio, puede liderar este cambio
desde su escala local, impulsando una nueva cultura urbana centrada en el
bienestar, la justicia y la diversidad.</p>
</div>
<div class="src-note">PLANTILLA — marco conceptual común. Las observaciones locales concretas (calles, barrios, colectivos identificados) se han omitido a propósito — añádelas a mano desde el diagnóstico o la participación ciudadana de este municipio.</div>
`.trim();
}
