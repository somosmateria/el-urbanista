import "server-only";
import JSZip from "jszip";
// @ts-expect-error -- sin tipos publicados
import HTMLtoDOCX from "html-to-docx";

function escapeHtml(valor: string): string {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * El HTML que guardan los motores lleva anotaciones de uso interno que no
 * son parte del documento entregable:
 * - `.src-note` — nota de procedencia/plantilla para quien revisa en la
 *   app (p.ej. "FUENTE — Diagnóstico · MI.1.7"). Se descarta entera.
 * - `.doc-eyebrow` — normalmente repite el título del capítulo (ya va
 *   como H1 más abajo), pero en el motor de tabla es el nombre real del
 *   bloque (p.ej. "PARQUE PERIURBANO DEL COTO") — no se puede tirar sin
 *   más. Se convierte en un H2 en vez de quedarse como párrafo normal,
 *   así entra en la jerarquía del documento en los dos casos.
 * - `<mark>` — dato citado del diagnóstico que el técnico debe confirmar
 *   antes de cerrar el capítulo (ver el motor RAG y CapituloEditor, que
 *   usa el mismo resaltado). En la app se ve como fondo amarillento; en el
 *   .docx entregable ese fondo no destaca igual (y puede perderse al
 *   imprimir en blanco y negro), así que aquí se convierte en texto en
 *   rojo — la misma señal de "esto lo tiene que revisar un técnico" pero
 *   visible también en el documento exportado.
 *
 * Exportada porque `src/lib/motores/evaluacion` también la necesita: sin
 * esta limpieza, una nota `.src-note` que compara el municipio con Osuna o
 * Lora del Río a efectos de desarrollo (p.ej. "confirmado idéntico entre
 * Osuna y Lora del Río") se leería como una contaminación real entre
 * municipios — falso positivo encontrado verificando esta misma fase
 * contra datos reales.
 */
export function limpiarParaExportar(html: string): string {
  return html
    .replace(/<div class="src-note">[\s\S]*?<\/div>/g, "")
    .replace(/<div class="doc-eyebrow">([\s\S]*?)<\/div>/g, "<h2>$1</h2>")
    .replace(/<mark(?:\s[^>]*)?>/g, '<span style="color: red;">')
    .replace(/<\/mark>/g, "</span>");
}

/**
 * Tags de bloque (los que html-to-docx convierte cada uno en su propio
 * `<w:p>`) que puede llevar el HTML de un capítulo. Importa la lista porque
 * `pintarEnRojo` no puede confiar en la herencia de un `<div>` envolvente:
 * comprobado contra la librería, el color puesto en un contenedor de bloque
 * NO baja a los `<w:r>` de los párrafos que contiene (sí baja dentro de un
 * mismo párrafo, de ahí que el `<span>` de arriba funcione) — hay que
 * ponerlo en cada elemento de bloque por separado.
 */
const TAGS_DE_BLOQUE = ["p", "li", "h2", "h3", "blockquote", "td", "th"];

/**
 * `necesitaRevision` es el estado "revisar" del capítulo (ver CapituloEstado
 * y resolverPlantilla/generarCapitulosIniciales): además de los `<mark>`
 * puntuales de arriba, un capítulo entero puede quedar pendiente de que un
 * técnico lo confirme sin llevar ni un solo `<mark>` — por ejemplo, MO.1/MO.2
 * (banco de texto fijo, siempre a revisar) o cualquier capítulo resuelto
 * contra el Avance de referencia del equipo (contenido de OTRO municipio
 * reutilizado, ver resolverPlantilla). En esos casos no hay nada puntual que
 * resaltar — es el capítulo completo el que hay que confirmar — así que todo
 * su cuerpo sale en rojo, no solo lo que ya viniera en un `<mark>` (ver
 * TAGS_DE_BLOQUE arriba sobre por qué no basta con envolver en un `<div>`).
 */
function pintarEnRojo(html: string): string {
  const patron = new RegExp(`<(${TAGS_DE_BLOQUE.join("|")})((?:\\s+[\\w-]+="[^"]*")*)\\s*>`, "g");
  return html.replace(patron, (_coincidencia, tag: string, attrs: string) => {
    const conEstilo = /\sstyle="([^"]*)"/.exec(attrs);
    if (conEstilo) {
      return `<${tag}${attrs.replace(conEstilo[0], ` style="${conEstilo[1]};color: red;"`)}>`;
    }
    return `<${tag}${attrs} style="color: red;">`;
  });
}

export async function generarDocxCapitulo(
  titulo: string,
  contenidoHtml: string,
  necesitaRevision = false
): Promise<Buffer> {
  const cuerpoLimpio = limpiarParaExportar(contenidoHtml);
  const cuerpo = necesitaRevision ? pintarEnRojo(cuerpoLimpio) : cuerpoLimpio;
  const html = `<!DOCTYPE html><html><body><h1>${escapeHtml(titulo)}</h1>${cuerpo}</body></html>`;
  const buffer = await HTMLtoDOCX(html, null, {
    font: "Georgia",
    // 24 HIP = 12pt — el texto del cuerpo debe leerse como un documento
    // normal, no en el 11pt por defecto de la librería.
    fontSize: 24,
    table: { row: { cantSplit: false } },
  });
  return arreglarEstilos(Buffer.from(buffer));
}

export function nombreArchivoCapitulo(codigo: string): string {
  return `${codigo.replace(/\./g, "_")}.docx`;
}

const MARCADOR_INDICE = "__INDICE_MARCADOR__";

/**
 * Documento único con todos los capítulos con contenido, en su orden —
 * salto de página entre uno y el siguiente (soportado por html-to-docx vía
 * un div con la clase "page-break", ver su README). Aparte de "descargar
 * todo" como un .docx por capítulo (ver la ruta /docx), esta es la opción
 * de un solo Word con la memoria completa.
 *
 * Lleva además un índice al principio con enlaces internos reales (marcador
 * + hipervínculo de Word) a cada capítulo — html-to-docx no soporta nada de
 * esto (ni marcadores ni tabla de contenidos), así que se genera el .docx
 * normal y se le inyectan a mano, editando el XML interno ya generado (ver
 * postProcesarDocx más abajo).
 */
export async function generarDocxMunicipio(
  municipioNombre: string,
  capitulos: { titulo: string; contenidoHtml: string; necesitaRevision?: boolean }[]
): Promise<Buffer> {
  const cuerpo = capitulos
    .map((c, i) => {
      const cuerpoLimpio = limpiarParaExportar(c.contenidoHtml);
      const cuerpoCapitulo = c.necesitaRevision ? pintarEnRojo(cuerpoLimpio) : cuerpoLimpio;
      return `
${i > 0 ? '<div class="page-break" style="page-break-after: always;"></div>' : ""}
<h1>${escapeHtml(c.titulo)}</h1>
${cuerpoCapitulo}
`;
    })
    .join("\n");

  const html = `<!DOCTYPE html><html><body><h1>${escapeHtml(
    `Memoria de Ordenación — ${municipioNombre}`
  )}</h1><p>${MARCADOR_INDICE}</p><div class="page-break" style="page-break-after: always;"></div>${cuerpo}</body></html>`;

  const buffer = await HTMLtoDOCX(html, null, {
    font: "Georgia",
    fontSize: 24,
    table: { row: { cantSplit: false } },
  });
  return postProcesarDocx(
    Buffer.from(buffer),
    capitulos.map((c) => c.titulo)
  );
}

/**
 * html-to-docx no define un estilo "Normal" explícito (solo los valores por
 * defecto del documento) — Word lo tolera, pero Word para Mac/Pages a veces
 * no, y styleId="Normal" es justo lo que usan como base el resto de estilos
 * (Heading1, Heading2…): sin él, Pages puede mostrar todo el texto igual de
 * grande y en negrita, sin distinguir títulos de cuerpo. Se añade uno
 * mínimo justo tras docDefaults, sin pisar la fuente/tamaño que ya vienen
 * de ahí. Se aplica a cualquier .docx que se genere, de uno o varios
 * capítulos.
 */
async function arreglarEstilos(buffer: Buffer): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buffer);
  const stylesXml = zip.file("word/styles.xml");
  if (!stylesXml) return buffer;

  const xml = await stylesXml.async("string");
  if (xml.includes('w:styleId="Normal"')) return buffer;

  const estiloNormal =
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>';
  zip.file("word/styles.xml", xml.replace(/(<\/w:docDefaults>)/, `$1${estiloNormal}`));
  return zip.generateAsync({ type: "nodebuffer" });
}

/**
 * Pone un marcador (bookmark) de Word en cada capítulo y sustituye el
 * párrafo marcador (ver MARCADOR_INDICE) por un índice de verdad: un
 * epígrafe "Índice" seguido de un hipervínculo interno por capítulo —
 * clicar en el título salta directamente a su página, como en cualquier
 * .docx con tabla de contenidos con enlaces.
 *
 * Localiza los capítulos por posición, no por texto: el primer párrafo con
 * estilo Heading1 es el título general del documento (no lleva marcador);
 * cada uno de los siguientes es, en el mismo orden que `titulos`, el inicio
 * de un capítulo.
 */
async function postProcesarDocx(buffer: Buffer, titulos: string[]): Promise<Buffer> {
  const conEstilos = await arreglarEstilos(buffer);

  const zip = await JSZip.loadAsync(conEstilos);
  const documentXml = zip.file("word/document.xml");
  if (!documentXml) return conEstilos; // no debería pasar — por si acaso, se devuelve tal cual

  let xml = await documentXml.async("string");

  const anclas: string[] = [];
  let indiceCapitulo = 0;
  xml = xml.replace(
    /<w:p(?:\s[^>]*)?>(?:(?!<\/w:p>)[\s\S])*?<w:pStyle w:val="Heading1"\/>[\s\S]*?<\/w:p>/g,
    (parrafo) => {
      indiceCapitulo += 1;
      if (indiceCapitulo === 1) return parrafo; // título general del documento
      const ancla = `cap${indiceCapitulo - 1}`;
      anclas.push(ancla);
      const id = 900 + indiceCapitulo;
      return parrafo
        .replace(/(<w:p(?:\s[^>]*)?>)/, `$1<w:bookmarkStart w:id="${id}" w:name="${ancla}"/>`)
        .replace(/(<\/w:p>)$/, `<w:bookmarkEnd w:id="${id}"/>$1`);
    }
  );

  const indiceXml = `
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t xml:space="preserve">Índice</w:t></w:r></w:p>
${titulos
  .map(
    (titulo, i) => `
<w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:hyperlink w:anchor="${anclas[i]}" w:history="1"><w:r><w:rPr><w:rStyle w:val="Hyperlink"/></w:rPr><w:t xml:space="preserve">${escapeHtml(titulo)}</w:t></w:r></w:hyperlink></w:p>`
  )
  .join("")}
`.trim();

  xml = xml.replace(
    new RegExp(`<w:p(?:\\s[^>]*)?>(?:(?!<\\/w:p>)[\\s\\S])*?${MARCADOR_INDICE}[\\s\\S]*?<\\/w:p>`),
    indiceXml
  );

  zip.file("word/document.xml", xml);

  return zip.generateAsync({ type: "nodebuffer" });
}

export function slugificarNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
