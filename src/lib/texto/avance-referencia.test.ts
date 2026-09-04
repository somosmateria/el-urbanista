import { describe, expect, it } from "vitest";
import { normalizarTituloReferencia, parsearRespuestaReferencia } from "./avance-referencia";

describe("normalizarTituloReferencia", () => {
  it("quita la numeración propia del documento delante del título", () => {
    expect(normalizarTituloReferencia("MO.4 REGULACIÓN DE LOS USOS.")).toBe("Regulación de los usos");
    expect(normalizarTituloReferencia("1.4. Suelo rústico común")).toBe("Suelo rústico común");
    expect(normalizarTituloReferencia("5. Los bienes y espacios con una singular protección.")).toBe(
      "Los bienes y espacios con una singular protección"
    );
  });

  it("pasa un título gritado a frase normal, re-mayusculizando siglas conocidas", () => {
    expect(
      normalizarTituloReferencia(
        "PROCEDENCIA DE LA REVISIÓN DEL PGOU 2005/10 MEDIANTE SU SUSTITUCIÓN POR EL PGOM Y ALTERNATIVAS CONTEMPLADAS."
      )
    ).toBe("Procedencia de la revisión del PGOU 2005/10 mediante su sustitución por el PGOM y alternativas contempladas");
  });

  it("capitaliza tras un punto interno, no solo al principio", () => {
    expect(
      normalizarTituloReferencia(
        "MO.5 ESQUEMA DE LOS ELEMENTOS ESTRUCTURANTES DEL FUTURO DESARROLLO URBANO. LOS SISTEMAS GENERALES"
      )
    ).toBe("Esquema de los elementos estructurantes del futuro desarrollo urbano. Los sistemas generales");
  });

  it("deja intacto un título que ya viene bien formateado", () => {
    expect(normalizarTituloReferencia("Los bienes y espacios con una singular protección.")).toBe(
      "Los bienes y espacios con una singular protección"
    );
  });
});

describe("parsearRespuestaReferencia", () => {
  it("separa título y contenido en el formato esperado", () => {
    expect(parsearRespuestaReferencia("TITULO: Regulación de los usos\n---\n<p>Contenido.</p>")).toEqual({
      titulo: "Regulación de los usos",
      texto: "<p>Contenido.</p>",
    });
  });

  it("devuelve null cuando el modelo responde NO_ENCONTRADO", () => {
    expect(parsearRespuestaReferencia("TITULO: NO_ENCONTRADO\n---\n")).toBeNull();
  });

  it("devuelve null si no hay título", () => {
    expect(parsearRespuestaReferencia("TITULO: \n---\nalgo")).toBeNull();
  });

  it("acepta una respuesta sin separador (título solo, sin contenido pedido)", () => {
    expect(parsearRespuestaReferencia("TITULO: El suelo urbano")).toEqual({
      titulo: "El suelo urbano",
      texto: "",
    });
  });
});
