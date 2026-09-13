import { describe, expect, it } from "vitest";
import type { MunicipioRow } from "@/lib/supabase/types";
import { limpiarParaExportar } from "@/lib/export/docx";
import { generarMO3_1 } from "./mo3-1";
import { generarMO3_2 } from "./mo3-2";
import { generarMO3_4 } from "./mo3-4";
import { generarMO3_6 } from "./mo3-6";
import { generarMO4 } from "./mo4";
import { generarMO5_1 } from "./mo5-1";
import { generarMO5_2 } from "./mo5-2";
import { generarMO5_2_2 } from "./mo5-2-2";
import { generarMO5_3 } from "./mo5-3";
import { generarMO5_4 } from "./mo5-4";
import { generarMO6_1 } from "./mo6-1";
import { generarMO6_2 } from "./mo6-2";

/**
 * Cubre solo los generadores 100% plantilla (sin llamada a Claude) — el
 * objetivo es pillar una regresión de formato (interpolación rota, HTML sin
 * cerrar, eyebrow con el número equivocado) sin gastar un solo token.
 */

const municipio = { id: "m1", nombre: "Écija" } as MunicipioRow;

describe("generadores de plantilla estáticos", () => {
  it("generarMO3_1 interpola el nombre del municipio y no deja placeholders", () => {
    const html = generarMO3_1(municipio);
    expect(html).toContain("3.1 · EL SUELO RÚSTICO. CATEGORÍAS Y ZONAS");
    expect(html).toContain("PGOM de Écija");
    expect(html).not.toContain("{{MUNICIPIO}}");
    expect(html).not.toContain("undefined");
  });

  it("generarMO3_2 solo trae el marco legal, no la lista concreta de sistemas", () => {
    const html = generarMO3_2(municipio);
    expect(html).toContain("3.2 · SISTEMAS GENERALES EN SUELO RÚSTICO");
    expect(html).toContain("artículo 14 de la LISTA");
    expect(html).not.toContain("undefined");
  });

  it("generarMO3_4 interpola el nombre del municipio en las tres menciones", () => {
    const html = generarMO3_4(municipio);
    expect(html).toContain("3.4 ·");
    expect(html.match(/Écija/g)?.length).toBe(3);
    expect(html).not.toContain("undefined");
  });

  it("generarMO3_6 avisa explícitamente de que hay que revisarlo", () => {
    const html = generarMO3_6(municipio);
    expect(html).toContain("3.6 · EL SUELO URBANO");
    expect(html).toContain("contenido a revisar");
    // El aviso debe quedarse en la nota interna (.src-note, se descarta al
    // exportar), nunca como párrafo normal del cuerpo del capítulo — ver
    // el mismo fallo ya corregido en mo3-1-4.ts.
    expect(html).not.toContain("<p><em>Pendiente de revisar");
  });

  it("generarMO4 no depende del municipio y cubre 4.1, 4.2 y 4.3", () => {
    const html = generarMO4(municipio);
    expect(html).toContain("4.1. Usos y actividades en suelo rústico");
    expect(html).toContain("4.2. Usos globales propuestos");
    expect(html).toContain("4.3. Actividades incompatibles");
  });

  it("generarMO6_1 se marca como banco de referencia a revisar, no como plantilla cerrada", () => {
    const html = generarMO6_1(municipio);
    expect(html).toContain("6.1 · PROPUESTA PARA LA PROTECCIÓN DE PATRIMONIO ARQUEOLÓGICO Y ARQUITECTÓNICO");
    expect(html).toContain("BANCO DE REFERENCIA");
  });

  it("generarMO5_1 interpola el municipio y no arrastra la cifra de estándar errónea", () => {
    const html = generarMO5_1(municipio);
    expect(html).toContain("5.1 · LA INFRAESTRUCTURA VERDE URBANA");
    expect(html).toContain("renaturalizar Écija");
    expect(html).not.toContain("256.800");
    expect(html).not.toContain("undefined");
  });

  it("generarMO5_2 y MO5_2_2 interpolan el municipio", () => {
    expect(generarMO5_2(municipio)).toContain("caso de Écija");
    expect(generarMO5_2_2(municipio)).toContain("término municipal de Écija");
  });

  it("generarMO5_3 no depende del municipio y trae las 4 directrices", () => {
    const html = generarMO5_3(municipio);
    expect(html).toContain("5.3 · EL SISTEMA DE EQUIPAMIENTOS COMUNITARIOS");
    expect(html.match(/<li>/g)?.length).toBe(4);
  });

  it("generarMO5_4 interpola el municipio en la frase de cierre", () => {
    expect(generarMO5_4(municipio)).toContain("municipio de Écija");
  });

  it("generarMO6_2 cubre los cinco subapartados (6.2.1 a 6.2.5)", () => {
    const html = generarMO6_2(municipio);
    expect(html).toContain("6.2 · PROPUESTA PARA LA PROTECCIÓN MEDIAMBIENTAL");
    for (const sub of ["6.2.1.", "6.2.2.", "6.2.3.", "6.2.4.", "6.2.5."]) {
      expect(html).toContain(sub);
    }
  });

  // Fallo real encontrado en producción (MO.3.1.4 y MO.3.6): un aviso para
  // el técnico escrito como párrafo normal (`<p><em>...</em></p>`) en vez
  // de dentro de `.src-note` sobrevive a `limpiarParaExportar` y acaba
  // colándose en el .docx entregado — en el caso de MO.3.6, incluso citando
  // "Lora del Río" por su nombre en un documento real de OTRO municipio.
  // Esta prueba cubre todos los generadores estáticos de golpe para que no
  // vuelva a pasar en un capítulo nuevo.
  it("ningún generador estático menciona Osuna/Lora del Río fuera de .src-note", () => {
    const generadores: Record<string, () => string> = {
      MO3_1: () => generarMO3_1(municipio),
      MO3_2: () => generarMO3_2(municipio),
      MO3_4: () => generarMO3_4(municipio),
      MO3_6: () => generarMO3_6(municipio),
      MO4: () => generarMO4(municipio),
      MO5_1: () => generarMO5_1(municipio),
      MO5_2: () => generarMO5_2(municipio),
      MO5_2_2: () => generarMO5_2_2(municipio),
      MO5_3: () => generarMO5_3(municipio),
      MO5_4: () => generarMO5_4(municipio),
      MO6_1: () => generarMO6_1(municipio),
      MO6_2: () => generarMO6_2(municipio),
    };
    for (const [nombre, generar] of Object.entries(generadores)) {
      const entregable = limpiarParaExportar(generar());
      expect(entregable, `${nombre} menciona un municipio de referencia fuera de .src-note`).not.toMatch(
        /Osuna|Lora del Río/
      );
    }
  });
});
