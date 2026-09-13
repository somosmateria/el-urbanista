import { describe, expect, it } from "vitest";
import { detectarContaminacion } from "./contaminacion";

describe("detectarContaminacion", () => {
  it("detecta el plan vigente de otro municipio del equipo (caso real: Lora del Río en Los Palacios)", () => {
    const hallazgos = detectarContaminacion(
      "<p>Desde la aprobación y entrada en vigor de PGOU 2005/10 han transcurrido...</p>",
      { nombre: "Los Palacios y Villafranca", plan_vigente: "PGOU 2008" },
      [{ nombre: "Lora del Río", plan_vigente: "PGOU 2005/10" }]
    );
    expect(hallazgos).toHaveLength(1);
    expect(hallazgos[0].fuente).toContain("PGOU 2005/10");
  });

  it("detecta el nombre de otro municipio", () => {
    const hallazgos = detectarContaminacion(
      "<p>El PGOM de Lora del Río se concibe como...</p>",
      { nombre: "Los Palacios y Villafranca", plan_vigente: "PGOU 2008" },
      [{ nombre: "Lora del Río", plan_vigente: null }]
    );
    expect(hallazgos.some((h) => h.fuente.includes("Lora del Río"))).toBe(true);
  });

  it("no marca nada cuando el texto solo habla del propio municipio", () => {
    const hallazgos = detectarContaminacion(
      "<p>El PGOM de Los Palacios y Villafranca, vigente desde PGOU 2008...</p>",
      { nombre: "Los Palacios y Villafranca", plan_vigente: "PGOU 2008" },
      [{ nombre: "Lora del Río", plan_vigente: "PGOU 2005/10" }, { nombre: "Osuna", plan_vigente: "NNSS 1996" }]
    );
    expect(hallazgos).toHaveLength(0);
  });

  it("no marca coincidencias parciales de palabra (evita falsos positivos)", () => {
    const hallazgos = detectarContaminacion(
      "<p>El municipio de Osunilla no tiene relación con esto.</p>",
      { nombre: "Los Palacios y Villafranca", plan_vigente: "PGOU 2008" },
      [{ nombre: "Osuna", plan_vigente: null }]
    );
    expect(hallazgos).toHaveLength(0);
  });

  it("ignora un plan_vigente vacío o demasiado corto para evitar ruido", () => {
    const hallazgos = detectarContaminacion(
      "<p>El texto menciona el año 05 de pasada.</p>",
      { nombre: "Los Palacios y Villafranca", plan_vigente: "PGOU 2008" },
      [{ nombre: "Otro", plan_vigente: "05" }]
    );
    expect(hallazgos).toHaveLength(0);
  });
});
