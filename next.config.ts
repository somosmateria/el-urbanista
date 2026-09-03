import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (vía pdfjs-dist) carga un módulo "worker" en tiempo de
  // ejecución; si el bundler lo empaqueta, esa ruta deja de existir y falla
  // con "Setting up fake worker failed". Se deja como paquete externo para
  // que corra tal cual desde node_modules.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  // La localización del worker es una ruta calculada en tiempo de ejecución
  // (no un import estático), así que el rastreador de Vercel no la detecta
  // y el archivo no llega al deploy — hay que forzar su inclusión a mano.
  outputFileTracingIncludes: {
    "/api/diagnosticos/\\[id\\]/procesar": [
      "./node_modules/pdfjs-dist/**/*.mjs",
      "./node_modules/pdf-parse/**/*.mjs",
    ],
  },
};

export default nextConfig;
