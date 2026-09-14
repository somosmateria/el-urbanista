import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { generarDocxCapitulo, generarDocxMunicipio, generarDocxRevisionTecnica, slugificarNombre } from "./docx";

describe("slugificarNombre", () => {
  it("quita acentos, pasa a minúsculas y usa guiones", () => {
    expect(slugificarNombre("Lora del Río")).toBe("lora-del-rio");
    expect(slugificarNombre("Écija")).toBe("ecija");
  });

  it("no deja guiones sueltos al principio o al final", () => {
    expect(slugificarNombre("  Osuna!  ")).toBe("osuna");
  });
});

/**
 * html-to-docx no define un estilo "Normal" explícito, lo que en Pages para
 * Mac puede hacer que todo el texto salga igual de grande y en negrita —
 * ver arreglarEstilos() en docx.ts. Estos tests generan un .docx real
 * (offline, sin coste de API) y comprueban el XML resultante directamente.
 */
describe("generarDocxCapitulo", () => {
  it("el .docx generado define un estilo Normal explícito", async () => {
    const buffer = await generarDocxCapitulo("MO.1 · Prueba", "<div class=\"doc-text\"><p>Cuerpo.</p></div>");
    const zip = await JSZip.loadAsync(buffer);
    const stylesXml = await zip.file("word/styles.xml")?.async("string");
    expect(stylesXml).toContain('w:styleId="Normal"');
  }, 20_000);

  it("los datos resaltados (<mark>, a confirmar por el técnico) salen en rojo", async () => {
    const buffer = await generarDocxCapitulo(
      "MO.11 · Prueba",
      '<div class="doc-text"><p>Limita con <mark>Écija</mark> y <mark>Osuna</mark>.</p></div>'
    );
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml).not.toContain("<w:highlight");
    expect(documentXml?.match(/<w:color w:val="ff0000"\/>/g)?.length).toBe(2);
  }, 20_000);

  it("un capítulo entero a revisar (sin <mark>) también sale en rojo", async () => {
    const buffer = await generarDocxCapitulo(
      "MO.1 · Prueba",
      "<div class=\"doc-text\"><p>Párrafo uno.</p><p>Párrafo dos.</p></div>",
      true
    );
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml?.match(/<w:color w:val="ff0000"\/>/g)?.length).toBe(2);
  }, 20_000);

  it("sin necesitaRevision, el texto no sale en rojo", async () => {
    const buffer = await generarDocxCapitulo("MO.4 · Prueba", "<div class=\"doc-text\"><p>Cuerpo.</p></div>");
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml).not.toContain('w:val="ff0000"');
  }, 20_000);

  it("un subepígrafe pendiente (título + aviso) sale en azul, no en rojo", async () => {
    const buffer = await generarDocxCapitulo(
      "MO.3 · Prueba",
      '<div class="doc-text"><p>Contenido normal.</p></div>' +
        '<div class="doc-eyebrow-pendiente" id="pendiente-MO.3.2">3.2 · TÍTULO PENDIENTE</div>' +
        '<div class="nota-pendiente">PENDIENTE DE COMPLETAR POR EL TÉCNICO</div>'
    );
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml?.match(/<w:color w:val="3d5a75"\/>/g)?.length).toBe(2);
    expect(documentXml).not.toContain('w:val="ff0000"');
  }, 20_000);

  it("un subepígrafe pendiente sigue en azul aunque el capítulo entero esté a revisar", async () => {
    const buffer = await generarDocxCapitulo(
      "MO.3 · Prueba",
      '<div class="doc-text"><p>Contenido normal.</p></div>' +
        '<div class="doc-eyebrow-pendiente">3.2 · TÍTULO PENDIENTE</div>' +
        '<div class="nota-pendiente">PENDIENTE DE COMPLETAR POR EL TÉCNICO</div>',
      true
    );
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml?.match(/<w:color w:val="3d5a75"\/>/g)?.length).toBe(2);
    // El párrafo normal sí debe seguir en rojo por ser "revisar" el capítulo.
    expect(documentXml?.match(/<w:color w:val="ff0000"\/>/g)?.length).toBe(1);
  }, 20_000);
});

describe("generarDocxRevisionTecnica", () => {
  it("incluye la puntuación, los avisos sin resolver y las tablas rellenadas", async () => {
    const buffer = await generarDocxRevisionTecnica(
      "Municipio de Prueba",
      [
        {
          codigo: "MO.1",
          titulo: "Uno",
          evaluacion: {
            puntuacionTotal: 64,
            desglose: {
              cobertura: { puntos: 20, motivo: "Completo." },
              fundamentacion: { puntos: 10, motivo: "Cita el diagnóstico en parte." },
              especificidad: { puntos: 14, motivo: "Bastante específico." },
              solidez: { puntos: 20, motivo: "Coherente." },
              completitud: { puntos: 0, motivo: "Falta confirmar." },
            },
            problemaPrincipal: "No cita las alternativas concretas.",
            pendientePrincipal: "Añadir las alternativas estudiadas.",
          },
          avisos: [
            { severidad: "alta", mensaje: "Falta confirmar el plan vigente.", fuente: null, resuelto: false },
            { severidad: "baja", mensaje: "Aviso ya resuelto.", fuente: null, resuelto: true },
          ],
        },
        { codigo: "MO.4", titulo: "Cuatro", evaluacion: null, avisos: [] },
      ],
      [
        {
          capituloCodigo: "MO.5",
          capituloTitulo: "Cinco",
          nombreBloque: "Áreas recreativas propuestas",
          columnas: ["Nombre", "Superficie"],
          filas: [{ Nombre: "Parque del Coto", Superficie: "3,2 ha" }],
        },
      ]
    );
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");

    expect(documentXml).toContain("64");
    expect(documentXml).toContain("Falta confirmar el plan vigente");
    expect(documentXml).not.toContain("Aviso ya resuelto");
    expect(documentXml).toContain("Sin evaluar todav");
    expect(documentXml).toContain("Parque del Coto");
    expect(documentXml).toContain("reas recreativas propuestas");
  }, 20_000);
});

describe("generarDocxMunicipio", () => {
  it("lleva un marcador y un hipervínculo interno por cada capítulo", async () => {
    const capitulos = [
      { titulo: "MO.1 · Uno", contenidoHtml: "<div class=\"doc-text\"><p>Texto 1.</p></div>" },
      { titulo: "MO.2 · Dos", contenidoHtml: "<div class=\"doc-text\"><p>Texto 2.</p></div>" },
      { titulo: "MO.3 · Tres", contenidoHtml: "<div class=\"doc-text\"><p>Texto 3.</p></div>" },
    ];
    const buffer = await generarDocxMunicipio("Municipio de Prueba", capitulos);
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    const stylesXml = await zip.file("word/styles.xml")?.async("string");

    expect(stylesXml).toContain('w:styleId="Normal"');
    expect(documentXml).not.toContain("__INDICE_MARCADOR__");
    expect(documentXml?.match(/w:bookmarkStart/g)?.length).toBe(capitulos.length);
    expect(documentXml?.match(/w:hyperlink w:anchor="cap\d+"/g)?.length).toBe(capitulos.length);
  }, 20_000);

  it("solo los capítulos marcados necesitaRevision salen en rojo", async () => {
    const capitulos = [
      { titulo: "MO.1 · A revisar", contenidoHtml: "<div class=\"doc-text\"><p>Uno.</p></div>", necesitaRevision: true },
      { titulo: "MO.4 · Listo", contenidoHtml: "<div class=\"doc-text\"><p>Dos.</p></div>", necesitaRevision: false },
    ];
    const buffer = await generarDocxMunicipio("Municipio de Prueba", capitulos);
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    expect(documentXml?.match(/<w:color w:val="ff0000"\/>/g)?.length).toBe(1);
  }, 20_000);
});
