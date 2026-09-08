import { describe, expect, it } from "vitest";
import { slugificarNombre } from "./docx";

describe("slugificarNombre", () => {
  it("quita acentos, pasa a minúsculas y usa guiones", () => {
    expect(slugificarNombre("Lora del Río")).toBe("lora-del-rio");
    expect(slugificarNombre("Écija")).toBe("ecija");
  });

  it("no deja guiones sueltos al principio o al final", () => {
    expect(slugificarNombre("  Osuna!  ")).toBe("osuna");
  });
});
