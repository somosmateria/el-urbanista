"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Boceto de plano urbano, estilo el que usa el estudio para presentar
 * avances — se "dibuja" con un stroke-dashoffset por trazo (truco
 * `pathLength="1"`, normaliza cualquier trazo a longitud 1 sin tener que
 * calcular su longitud real). Puramente decorativo: inicio de sesión y
 * pantallas de espera, ver src/app/page.tsx y RegenerarPanel/GenerandoScreen.
 */
type Trazo =
  | { tag: "path"; d: string; gap?: number }
  | { tag: "line"; x1: number; y1: number; x2: number; y2: number; gap?: number }
  | { tag: "circle"; cx: number; cy: number; r: number; gap?: number }
  | { tag: "rect"; x: number; y: number; w: number; h: number; gap?: number };

function rect(x: number, y: number, w: number, h: number, gap = 0.018): Trazo {
  return { tag: "rect", x, y, w, h, gap };
}
function line(x1: number, y1: number, x2: number, y2: number, gap = 0.02): Trazo {
  return { tag: "line", x1, y1, x2, y2, gap };
}

const CUADRICULA: Trazo[] = [
  ...[0, 1, 2, 3, 4].map((i) => line(40, 60 + i * 32, 430, 40 + i * 30, 0.02)),
  ...[0, 1, 2, 3].map((i) => line(90 + i * 90, 40, 60 + i * 95, 230, 0.02)),
];

const MANZANAS: Trazo[] = [
  [55, 72, 60, 10],
  [125, 68, 55, 10],
  [190, 64, 55, 10],
  [255, 60, 55, 10],
  [320, 56, 55, 10],
  [50, 105, 60, 10],
  [120, 100, 55, 10],
  [185, 96, 55, 10],
  [250, 92, 55, 10],
  [315, 88, 55, 10],
  [48, 140, 58, 10],
  [115, 135, 55, 10],
  [180, 131, 55, 10],
  [245, 127, 55, 10],
].map(([x, y, w, h]) => rect(x, y, w, h, 0.014));

const IGLESIA: Trazo[] = [
  { tag: "path", d: "M 470 40 L 478 10 L 486 40", gap: 0.14 },
  { tag: "line", x1: 478, y1: 10, x2: 478, y2: 45, gap: 0.08 },
  { tag: "path", d: "M 560 55 L 566 32 L 572 55", gap: 0.1 },
];

const AVENIDA: Trazo[] = [
  { tag: "path", d: "M 430 150 C 520 165, 560 190, 610 230", gap: 0.35 },
  { tag: "circle", cx: 645, cy: 255, r: 26, gap: 0.18 },
  { tag: "circle", cx: 645, cy: 255, r: 3, gap: 0.06 },
  { tag: "path", d: "M 671 255 C 760 300, 850 340, 970 430", gap: 0.4 },
];

const ARBOLES: Trazo[] = [
  [560, 215],
  [590, 235],
  [625, 285],
  [660, 300],
  [700, 310],
  [740, 325],
  [780, 345],
  [820, 360],
  [860, 380],
  [900, 400],
].map(([cx, cy]) => ({ tag: "circle" as const, cx, cy, r: 7, gap: 0.02 }));

const NAVES: Trazo[] = [
  [730, 150, 60, 45],
  [795, 140, 45, 55],
  [845, 155, 70, 40],
  [720, 205, 50, 30],
  [780, 205, 55, 35],
  [845, 205, 60, 45],
  [915, 150, 55, 90],
].map(([x, y, w, h]) => rect(x, y, w, h, 0.045));

const DEPORTIVO: Trazo[] = [
  rect(60, 430, 230, 90, 0.3),
  line(175, 430, 175, 520, 0.1),
  { tag: "circle", cx: 175, cy: 475, r: 28, gap: 0.14 },
  rect(320, 455, 60, 45, 0.07),
  rect(320, 505, 60, 45, 0.07),
];

function campo(): Trazo[] {
  const trazos: Trazo[] = [];
  for (let x = 400; x < 980; x += 42) trazos.push(line(x, 470, x + 60, 560, 0.008));
  for (let x = 380; x < 950; x += 55) trazos.push(line(x, 330, x + 70, 420, 0.008));
  return trazos;
}

const LOMAS: Trazo[] = [
  { tag: "path", d: "M 20 90 C 200 40, 400 20, 600 15 C 750 12, 900 25, 990 45", gap: 0.3 },
];

const ESCENA: Trazo[] = [
  ...CUADRICULA,
  ...MANZANAS,
  ...IGLESIA,
  ...AVENIDA,
  ...ARBOLES,
  ...NAVES,
  ...DEPORTIVO,
  ...campo(),
  ...LOMAS,
];

export function SketchDraw({ className, onDone }: { className?: string; onDone?: () => void }) {
  const trazosConRetardo = useMemo(() => {
    return ESCENA.reduce<{ t: Trazo; delay: number }[]>((acumulados, t) => {
      const anterior = acumulados[acumulados.length - 1];
      const delay = anterior ? anterior.delay + (anterior.t.gap ?? 0.02) : 0;
      return [...acumulados, { t, delay }];
    }, []);
  }, []);

  const duracionTotal = trazosConRetardo.length
    ? trazosConRetardo[trazosConRetardo.length - 1].delay + 1
    : 0;

  const [listo, setListo] = useState(false);
  useEffect(() => {
    if (!onDone) return;
    const id = setTimeout(() => {
      setListo(true);
      onDone();
    }, duracionTotal * 1000);
    return () => clearTimeout(id);
  }, [duracionTotal, onDone]);
  void listo;

  return (
    <svg
      viewBox="0 0 1000 600"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="sketch-ink">
        {trazosConRetardo.map(({ t, delay }, i) => {
          const style = { animationDelay: `${delay.toFixed(3)}s` };
          const key = i;
          if (t.tag === "path") return <path key={key} d={t.d} pathLength={1} style={style} />;
          if (t.tag === "line")
            return <line key={key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} pathLength={1} style={style} />;
          if (t.tag === "circle")
            return <circle key={key} cx={t.cx} cy={t.cy} r={t.r} pathLength={1} style={style} />;
          return <rect key={key} x={t.x} y={t.y} width={t.w} height={t.h} pathLength={1} style={style} />;
        })}
      </g>
    </svg>
  );
}
