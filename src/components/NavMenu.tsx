"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ENLACES = [
  { href: "/", label: "Inicio" },
  { href: "/avance/ordenacion", label: "Municipios" },
  { href: "/ajustes", label: "Ajustes" },
];

export function NavMenu() {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label="Menú"
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-surface-hi cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="w-4.5 h-4.5 stroke-text-soft">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute left-0 top-[calc(100%+6px)] w-56 rounded-xl border border-line bg-surface shadow-lg overflow-hidden z-20">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setAbierto(false)}
              className="block px-4 py-2.5 text-[13.5px] text-text-soft hover:bg-surface-hi hover:text-text"
            >
              {enlace.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
