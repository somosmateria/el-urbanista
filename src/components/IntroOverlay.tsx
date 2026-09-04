"use client";

import { useEffect, useState } from "react";
import { SketchDraw } from "@/components/SketchDraw";

const CLAVE_SESION = "elurbanista_intro_visto";

/**
 * Splash de bienvenida al entrar en la app — solo la primera vez de la
 * sesión del navegador (sessionStorage). Se renderiza visible por defecto
 * (para que el SSR y la primera pintura del cliente coincidan sin parpadeo)
 * y el propio efecto lo retira al instante si ya se vio antes.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(CLAVE_SESION)) return;
    // sessionStorage solo se puede leer en el cliente — se parte de
    // "visible" (coincide con el primer pintado del servidor) y aquí se
    // retira, ya fuera del render, si esta sesión ya lo vio.
    queueMicrotask(() => setVisible(false));
  }, []);

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
          onDone={() => {
            sessionStorage.setItem(CLAVE_SESION, "1");
            setTimeout(() => setSaliendo(true), 500);
          }}
        />
      </div>
    </div>
  );
}
