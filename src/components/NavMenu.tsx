"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/login/actions";

const ENLACES = [
  { href: "/", label: "Inicio" },
  { href: "/avance/ordenacion", label: "Municipios" },
  { href: "/ajustes", label: "Ajustes" },
];

const enlaceClase =
  "text-[10.5px] tracking-[0.16em] uppercase text-text hover:text-violet cursor-pointer";

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
    <>
      <nav className="hidden sm:flex items-center gap-[26px]">
        {ENLACES.map((enlace) => (
          <Link key={enlace.href} href={enlace.href} className={enlaceClase}>
            {enlace.label}
          </Link>
        ))}
      </nav>

      <div ref={ref} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label="Menú"
          className="flex items-center justify-center w-[34px] h-[34px] border border-line rounded cursor-pointer"
        >
          <span className="block w-3.5 h-px bg-text shadow-[0_5px_0_var(--color-text),0_-5px_0_var(--color-text)]" />
        </button>

        {abierto && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-52 border border-line bg-surface-hi shadow-lg overflow-hidden z-20">
            {ENLACES.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setAbierto(false)}
                className="block px-4 py-3 text-[11px] tracking-[0.14em] uppercase text-text border-b border-line last:border-b-0"
              >
                {enlace.label}
              </Link>
            ))}
            <form action={signOutAction}>
              <button
                type="submit"
                className="block w-full text-left px-4 py-3 text-[11px] tracking-[0.14em] uppercase text-text-faint cursor-pointer"
              >
                Salir
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
