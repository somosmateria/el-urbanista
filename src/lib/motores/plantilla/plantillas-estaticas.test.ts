import { describe, expect, it } from "vitest";
import type { MunicipioRow } from "@/lib/supabase/types";
import { generarMO3_1 } from "./mo3-1";
import { generarMO3_4 } from "./mo3-4";
import { generarMO3_6 } from "./mo3-6";
import { generarMO4 } from "./mo4";
import { generarMO6_1 } from "./mo6-1";

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

  it("generarMO3_4 interpola el nombre del municipio en las tres menciones", () => {
    const html = generarMO3_4(municipio);
    expect(html).toContain("3.4 ·");
    expect(html.match(/Écija/g)?.length).toBe(3);
    expect(html).not.toContain("undefined");
  });

  it("generarMO3_6 avisa explícitamente de que hay que revisarlo", () => {
    const html = generarMO3_6(municipio);
    expect(html).toContain("3.6 · EL SUELO URBANO");
    expect(html).toContain("Pendiente de revisar");
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
});
