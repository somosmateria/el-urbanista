import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.5.3 · El sistema de equipamientos comunitarios (marco conceptual y
 * directrices). 100% plantilla: confirmado idéntico entre Osuna y Lora
 * del Río (test-data/), sin ningún dato de municipio.
 *
 * La relación real de equipamientos del municipio (con nombre propio,
 * superficies, existente/propuesto) va en MO.5.3.1, motor tabla — mismo
 * patrón que 3.3/3.3.1.
 */
export function generarMO5_3(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">5.3 · EL SISTEMA DE EQUIPAMIENTOS COMUNITARIOS</div>
<div class="doc-text">
<p>Pensar sobre los niveles de equipo de una ciudad, hoy en día, precisa de una reconsideración
profunda que vincule los equipamientos con el concepto de calidad de vida, entendiendo por tal
la medida compuesta de bienestar físico, social, mental y de felicidad, satisfacción y recompensa.
El concepto de calidad de vida se refiere a una diversidad de circunstancias que incluyen, además
de la satisfacción de las necesidades básicas, el ámbito de relaciones sociales del individuo, la
posibilidad de acceso a bienes culturales o la provisión de un entorno ecológico-ambiental que
facilite la salud física y psíquica de los ciudadanos y los usuarios. Los equipamientos colectivos
forman, por tanto, el sistema básico de cohesión, cumpliendo dos funciones fundamentales en
el proceso de vertebración de la comunidad: como salario social indirecto y como espacio de
consumo colectivo. Pero, además, los equipamientos, o al menos determinadas categorías de
equipamientos, deben asumir una función representativa en la configuración del sistema de
espacios públicos urbanos.</p>

<p>La ordenación estructural del sistema de equipamientos debe armarse sobre las siguientes
directrices:</p>

<ol>
<li>Una de las dimensiones clave en la construcción de territorios integrados es la disposición
y articulación de los equipamientos de forma que todos los ámbitos queden servidos y que
todos ellos contengan servicios de interés para el resto de los ciudadanos. Los equipamientos
no sólo deben cumplir una función de satisfacción de necesidades locales, sino que deben
tener la misión de cualificadores de los espacios urbanos menos valorados, para equipararlos
a los más privilegiados del área urbana en la que están insertos.</li>
<li>Vincular la localización de las piezas dotacionales con los sistemas viario y de espacios
libres, con la finalidad de singularizar la escena urbana introduciendo un nuevo sistema
de signos que garantice la legibilidad del espacio urbano. Con carácter general, se debe
fomentar la compatibilidad funcional con el sistema de espacios libres propuesto, permitiendo
el desarrollo de actividades dotacionales complementarias. La calidad del uso de un
equipamiento viene dada, entre otras consideraciones, por la dignidad de su posición en la
trama urbana y la calidad del espacio público sobre el que se sitúa. La vinculación posicional
de los equipamientos con espacios públicos formalmente significativos reforzará su capacidad
simbólica.</li>
<li>Adecuar la oferta dotacional a las nuevas demandas previsibles. Los cuatro pilares básicos
serán el ocio, la práctica deportiva, las actividades culturales y los servicios asistenciales,
sanitarios y administrativos.</li>
<li>Procurar que la distribución de los equipamientos sea multiescalar, garantizando la
accesibilidad desde las distintas áreas urbanas, resultando fundamental la articulación de la
red de equipamientos de mayor rango con la red de transporte público.</li>
</ol>
</div>
<div class="src-note">PLANTILLA — marco conceptual común, confirmado idéntico entre Osuna y Lora del Río. La relación real de equipamientos de este municipio va en el apartado siguiente, a rellenar por el técnico.</div>
`.trim();
}
