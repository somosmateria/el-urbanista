import { describe, expect, it } from "vitest";
import { evaluarPlantillaInvariante, CODIGOS_PLANTILLA_INVARIANTE } from "./index";

describe("CODIGOS_PLANTILLA_INVARIANTE", () => {
  it("son exactamente los códigos ya excluidos de sustitución por Avance de referencia por el mismo motivo (menos MO.1/MO.11, que sí extraen datos reales)", () => {
    expect([...CODIGOS_PLANTILLA_INVARIANTE].sort()).toEqual(["MO.10", "MO.12", "MO.4", "MO.8", "MO.9"]);
  });
});

describe("evaluarPlantillaInvariante", () => {
  it("no premia la extensión: cobertura y solidez siempre al máximo, fundamentación siempre 0 por diseño", () => {
    const resultado = evaluarPlantillaInvariante("<p>Texto normativo largo y elaborado…</p>", "listo", "Osuna");
    expect(resultado.desglose.cobertura.puntos).toBe(20);
    expect(resultado.desglose.solidez.puntos).toBe(20);
    expect(resultado.desglose.fundamentacion.puntos).toBe(0);
  });

  it("sube la especificidad si el texto menciona al municipio por nombre", () => {
    const conNombre = evaluarPlantillaInvariante("<p>El PGOM de Osuna se concibe…</p>", "listo", "Osuna");
    const sinNombre = evaluarPlantillaInvariante("<p>Texto genérico sin nombres…</p>", "listo", "Osuna");
    expect(conNombre.desglose.especificidad.puntos).toBeGreaterThan(sinNombre.desglose.especificidad.puntos);
  });

  it("baja la completitud y añade un pendiente cuando el capítulo está en revisar", () => {
    const listo = evaluarPlantillaInvariante("<p>…</p>", "listo", "Osuna");
    const revisar = evaluarPlantillaInvariante("<p>…</p>", "revisar", "Osuna");
    expect(revisar.desglose.completitud.puntos).toBeLessThan(listo.desglose.completitud.puntos);
    expect(listo.pendientePrincipal).toBeNull();
    expect(revisar.pendientePrincipal).not.toBeNull();
  });

  it("siempre explica en problemaPrincipal por qué el ámbar no es un fallo (nunca llega a verde por diseño)", () => {
    const resultado = evaluarPlantillaInvariante("<p>…</p>", "listo", "Osuna");
    expect(resultado.puntuacionTotal).toBeLessThan(80);
    expect(resultado.problemaPrincipal).not.toBeNull();
  });

  it("la puntuación total es la suma de los cinco factores, cada uno entre 0 y 20", () => {
    const resultado = evaluarPlantillaInvariante("<p>…</p>", "listo", "Osuna");
    const suma = Object.values(resultado.desglose).reduce((acc, f) => acc + f.puntos, 0);
    expect(resultado.puntuacionTotal).toBe(suma);
    for (const factor of Object.values(resultado.desglose)) {
      expect(factor.puntos).toBeGreaterThanOrEqual(0);
      expect(factor.puntos).toBeLessThanOrEqual(20);
    }
  });
});
