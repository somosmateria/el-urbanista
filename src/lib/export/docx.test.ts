import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { generarDocxCapitulo, generarDocxMunicipio, slugificarNombre } from "./docx";

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
});
