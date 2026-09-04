import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // "server-only" solo tiene su no-op bajo la export condition
      // "react-server" (la que resuelve Next.js) — fuera de eso, en Node
      // puro, su entrada por defecto lanza siempre. Aquí solo probamos
      // lógica pura, así que se sustituye por el no-op real del paquete.
      "server-only": path.resolve(__dirname, "node_modules/server-only/empty.js"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
