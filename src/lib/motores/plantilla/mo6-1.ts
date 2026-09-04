import type { MunicipioRow } from "@/lib/supabase/types";

/**
 * MO.6.1 · Propuesta para la protección de patrimonio arqueológico y
 * arquitectónico — la entidad que faltaba antes de 6.1.1-6.1.3, mismo hueco
 * que tenía MO.3 con "3.1" antes de arreglarlo.
 *
 * A diferencia de 3.1/3.4/3.6/MO.4, este pasaje NO está confirmado idéntico
 * entre Osuna y Lora del Río (test-data/): el fondo legal es el mismo
 * (art. 63.1.d y 75.5 LISTA, art. 77.6 RGLISTA, régimen del Catálogo de
 * Bienes Protegidos) pero cada Avance lo redacta con sus propias palabras —
 * el estudio lo reescribe por proyecto, no lo copia de un banco fijo. Se usa
 * aquí la redacción de Osuna como banco de referencia (igual criterio que
 * MO.2), marcado a revisar en vez de como plantilla cerrada.
 */
export function generarMO6_1(_municipio: MunicipioRow): string {
  void _municipio;
  return `
<div class="doc-eyebrow">6.1 · PROPUESTA PARA LA PROTECCIÓN DE PATRIMONIO ARQUEOLÓGICO Y ARQUITECTÓNICO</div>
<div class="doc-text">
<p>El Plan General de Ordenación Municipal debe identificar y delimitar:</p>

<ul>
<li>De acuerdo con el artículo 63.1.d) de la LISTA y del artículo 75.5 del Reglamento
General de la LISTA, los bienes que deban contar con una singular protección por su
valor histórico, cultural, urbanístico o arquitectónico.</li>
<li>De acuerdo con el artículo 77.6 del Reglamento General de la LISTA, los bienes en
suelo rústico que, no siendo de singular protección, deban ser protegidos por su valor
histórico, cultural, urbanístico o arquitectónico.</li>
</ul>

<p>Por tanto, el PGOM se acompañará de un Catálogo de Bienes Protegidos, que tendrá
por objeto complementar las determinaciones del Plan General relativas a la
conservación, protección, puesta en valor y mejora de los bienes y espacios protegidos
identificados en este instrumento.</p>

<p>Los inmuebles incluidos en el Catálogo de Bienes Protegidos del Plan General estarán
sujetos a un régimen jurídico específico que establece los derechos y deberes de sus
propietarios con el fin de garantizar la conservación del patrimonio urbano. En primer
lugar, estos propietarios tienen la obligación general de conservar, mantener y custodiar
los bienes de modo que se asegure la salvaguarda de sus valores culturales, históricos y
arquitectónicos. Esta obligación se extiende a la ejecución de todas aquellas obras
necesarias para adaptar dichos inmuebles a las condiciones estéticas, ambientales, de
seguridad, salubridad y ornato público exigidas por el Plan General y por los
instrumentos normativos que lo desarrollen o complementen.</p>

<p>Además, estos inmuebles están también sujetos a las normas sobre rehabilitación
urbana que se definan. Las obras derivadas de estas obligaciones serán sufragadas por
los propietarios siempre que se mantengan dentro del límite del deber normal de
conservación. En caso de que superen dicho límite, pero respondan a una mejora de
interés general, podrán ser financiadas con fondos públicos.</p>

<p>Cuando la Administración ordene la realización de obras de conservación o
rehabilitación que excedan el contenido económico normal del deber de conservar, los
propietarios tendrán derecho a una ayuda económica equivalente al exceso, salvo que la
Administración opte por la expropiación o la sustitución del propietario por
incumplimiento. Finalmente, los propietarios y poseedores están obligados a permitir la
ejecución de las obras de conservación y rehabilitación que, en su defecto, asuma
subsidiariamente la Administración pública competente. Este régimen busca asegurar
que el patrimonio protegido se mantenga en condiciones óptimas, sin que su valor
histórico, artístico o arquitectónico se vea comprometido.</p>
</div>
<div class="src-note">BANCO DE REFERENCIA — el fondo legal (LISTA/RGLISTA) es común, pero el estudio
reescribe esta introducción por proyecto (confirmado: Osuna y Lora del Río lo dicen con
palabras distintas). Revisa que el tono y la redacción encajen con el resto del capítulo
de este municipio antes de cerrarlo.</div>
`.trim();
}
