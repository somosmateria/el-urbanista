"use client";

import { useState } from "react";
import { SketchDraw } from "@/components/SketchDraw";

/**
 * Splash de bienvenida al entrar en Inicio — se dibuja el boceto y luego se
 * desvanece. Se repite en cada carga de la página (decisión explícita del
 * usuario), no solo la primera vez de la sesión.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [saliendo, setSaliendo] = useState(false);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-bg flex items-center justify-center transition-opacity duration-700 ${
        saliendo ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onTransitionEnd={() => {
        if (saliendo) setVisible(false);
      }}
    >
      <div className="w-full max-w-[560px] px-10">
        <SketchDraw
          className="w-full h-auto"
          onDone={() => setTimeout(() => setSaliendo(true), 500)}
        />
      </div>
    </div>
  );
}
