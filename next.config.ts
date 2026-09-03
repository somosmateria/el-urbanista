import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (vía pdfjs-dist) carga un módulo "worker" en tiempo de
  // ejecución; si el bundler lo empaqueta, esa ruta deja de existir y falla
  // con "Setting up fake worker failed". Se deja como paquete externo para
  // que corra tal cual desde node_modules.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
