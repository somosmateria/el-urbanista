import "server-only";

/**
 * pdf-parse (via pdfjs-dist) usa DOMMatrix para las transformaciones de
 * texto incluso al extraer solo texto (sin renderizar nada). DOMMatrix es
 * una API de navegador — no existe en Node — y pdf-parse solo la polyfilla
 * sola si logra cargar @napi-rs/canvas, cuyo binario nativo es específico
 * de cada plataforma (funciona en local/macOS pero no siempre en el
 * runtime de Vercel). En vez de depender de ese binario, implementamos
 * aquí el subconjunto de la especificación DOMMatrix 2D que pdf-parse
 * realmente usa (ver dist/pdf-parse/cjs/{index.cjs,pdf.worker.mjs}):
 * constructor, a/b/c/d/e/f, translate(Self), scale(Self), rotate, multiply
 * (Self), preMultiplySelf, invertSelf.
 */
class DOMMatrixPolyfill {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  constructor(init?: ArrayLike<number> | DOMMatrixPolyfill) {
    if (!init) return;
    if (init instanceof DOMMatrixPolyfill) {
      this.a = init.a;
      this.b = init.b;
      this.c = init.c;
      this.d = init.d;
      this.e = init.e;
      this.f = init.f;
      return;
    }
    this.a = init[0];
    this.b = init[1];
    this.c = init[2];
    this.d = init[3];
    this.e = init[4];
    this.f = init[5];
  }

  private multiplyMatrices(m1: DOMMatrixPolyfill, m2: DOMMatrixPolyfill) {
    // Producto this·other de dos matrices afines 2D (3x3 con última fila
    // implícita 0 0 1), en la misma convención que usa la especificación.
    return {
      a: m1.a * m2.a + m1.c * m2.b,
      b: m1.b * m2.a + m1.d * m2.b,
      c: m1.a * m2.c + m1.c * m2.d,
      d: m1.b * m2.c + m1.d * m2.d,
      e: m1.a * m2.e + m1.c * m2.f + m1.e,
      f: m1.b * m2.e + m1.d * m2.f + m1.f,
    };
  }

  multiply(other: DOMMatrixPolyfill) {
    return Object.assign(new DOMMatrixPolyfill(), this.multiplyMatrices(this, other));
  }

  multiplySelf(other: DOMMatrixPolyfill) {
    return Object.assign(this, this.multiplyMatrices(this, other));
  }

  preMultiplySelf(other: DOMMatrixPolyfill) {
    return Object.assign(this, this.multiplyMatrices(other, this));
  }

  translate(tx: number, ty = 0) {
    return this.multiply(Object.assign(new DOMMatrixPolyfill(), { a: 1, b: 0, c: 0, d: 1, e: tx, f: ty }));
  }

  translateSelf(tx: number, ty = 0) {
    return this.multiplySelf(Object.assign(new DOMMatrixPolyfill(), { a: 1, b: 0, c: 0, d: 1, e: tx, f: ty }));
  }

  scale(sx: number, sy = sx) {
    return this.multiply(Object.assign(new DOMMatrixPolyfill(), { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 }));
  }

  scaleSelf(sx: number, sy = sx) {
    return this.multiplySelf(Object.assign(new DOMMatrixPolyfill(), { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 }));
  }

  rotate(angleDegrees: number) {
    const rad = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return this.multiply(
      Object.assign(new DOMMatrixPolyfill(), { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 })
    );
  }

  invertSelf() {
    const { a, b, c, d, e, f } = this;
    const det = a * d - b * c;
    if (det === 0) {
      Object.assign(this, { a: NaN, b: NaN, c: NaN, d: NaN, e: NaN, f: NaN });
      return this;
    }
    return Object.assign(this, {
      a: d / det,
      b: -b / det,
      c: -c / det,
      d: a / det,
      e: (c * f - d * e) / det,
      f: (b * e - a * f) / det,
    });
  }
}

export function instalarPolyfillDOMMatrix() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    // @ts-expect-error -- polyfill deliberadamente incompleto, ver comentario arriba
    globalThis.DOMMatrix = DOMMatrixPolyfill;
  }
}
