import { describe, expect, it } from "vitest";
import { elegirPorSinonimos } from "./diagnosticos";
import type { DiagnosticoSeccionRow } from "@/lib/supabase/types";

function seccion(overrides: Partial<DiagnosticoSeccionRow>): DiagnosticoSeccionRow {
  return {
    id: "id",
    diagnostico_id: "diag",
    codigo: "9.9",
    titulo: null,
    texto: "",
    orden: 0,
    created_at: "",
    ...overrides,
  };
}

describe("elegirPorSinonimos", () => {
  it("no_localizado cuando ningún sinónimo aparece en ninguna sección", () => {
    const resultado = elegirPorSinonimos(
      [seccion({ titulo: "Movilidad", texto: "Texto sobre tráfico y viario." })],
      ["BIC", "patrimonio", "yacimientos"]
    );
    expect(resultado.motivo).toBe("no_localizado");
    expect(resultado.secciones).toHaveLength(0);
  });

  it("encontrado cuando un sinónimo aparece en una sección con contenido suficiente", () => {
    const textoLargo = "Se cataloga como BIC el conjunto histórico del patrimonio local. ".repeat(5);
    const resultado = elegirPorSinonimos(
      [seccion({ codigo: "1.9", titulo: "Cuestiones varias", texto: textoLargo })],
      ["BIC", "patrimonio"]
    );
    expect(resultado.motivo).toBe("encontrado");
    expect(resultado.secciones).toHaveLength(1);
  });

  it("informacion_insuficiente cuando el sinónimo aparece pero la sección es muy corta", () => {
    const resultado = elegirPorSinonimos(
      [seccion({ codigo: "1.9", titulo: "Otros", texto: "Se menciona un BIC de pasada." })],
      ["BIC"]
    );
    expect(resultado.motivo).toBe("informacion_insuficiente");
    expect(resultado.secciones).toHaveLength(1);
  });

  it("busca también en el título, no solo en el texto", () => {
    const textoLargo = "Contenido genérico sin la palabra clave en el cuerpo del epígrafe. ".repeat(5);
    const resultado = elegirPorSinonimos(
      [seccion({ codigo: "1.7", titulo: "Patrimonio histórico y catálogo", texto: textoLargo })],
      ["patrimonio"]
    );
    expect(resultado.motivo).toBe("encontrado");
  });
});
