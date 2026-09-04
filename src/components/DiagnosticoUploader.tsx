"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Estado = "idle" | "subiendo" | "procesando" | "listo" | "error";

/**
 * supabase-js no expone progreso de subida (usa fetch, sin eventos de
 * upload). Estos PDFs pesan cientos de MB, así que replicamos a mano lo que
 * hace uploadToSignedUrl() por dentro (mismo endpoint, mismo FormData) con
 * XMLHttpRequest para poder leer xhr.upload.onprogress.
 */
function subirConProgreso(
  file: File,
  path: string,
  token: string,
  onProgreso: (pct: number) => void
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const url = new URL(`${supabaseUrl}/storage/v1/object/upload/sign/diagnosticos/${path}`);
  url.searchParams.set("token", token);

  const body = new FormData();
  body.append("cacheControl", "3600");
  body.append("", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url.toString());
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgreso(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Fallo de red al subir el archivo."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`No se pudo subir el archivo (${xhr.status}).`));
    };
    xhr.send(body);
  });
}

const MENSAJES_PROCESANDO = [
  "Leyendo el PDF…",
  "Extrayendo el texto…",
  "Segmentando por epígrafes…",
  "Casi listo…",
];

export function DiagnosticoUploader({
  municipioId,
  nombreArchivoExistente,
}: {
  municipioId: string;
  nombreArchivoExistente: string | null;
}) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [progresoLectura, setProgresoLectura] = useState(0);
  const [mensajeLectura, setMensajeLectura] = useState(MENSAJES_PROCESANDO[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // No hay forma de saber el progreso real de lectura (una sola petición
  // de servidor, sin eventos) — se simula en función del tamaño del
  // archivo, calibrado contra el tiempo real medido con un PDF de 411 MB
  // (~3,6 s), y se deja "colgado" cerca del final hasta que llega la
  // respuesta real, para no prometer un 100% que no ha pasado todavía.
  useEffect(() => {
    if (estado !== "procesando") return;
    let mensajeIdx = 0;

    const inicio = Date.now();
    const intervalo = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      const pct = Math.min(92, Math.round((transcurrido / 4000) * 100));
      setProgresoLectura(pct);
      const nuevoIdx = Math.min(
        MENSAJES_PROCESANDO.length - 1,
        Math.floor(pct / (100 / MENSAJES_PROCESANDO.length))
      );
      if (nuevoIdx !== mensajeIdx) {
        mensajeIdx = nuevoIdx;
        setMensajeLectura(MENSAJES_PROCESANDO[nuevoIdx]);
      }
    }, 150);

    return () => clearInterval(intervalo);
  }, [estado]);

  async function handleFile(file: File) {
    setNombreArchivo(file.name);
    setErrorMsg(null);
    setProgreso(0);
    setEstado("subiendo");

    try {
      const iniciarRes = await fetch("/api/diagnosticos/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ municipioId, nombreArchivo: file.name }),
      });
      if (!iniciarRes.ok) throw new Error("No se pudo iniciar la subida.");
      const { diagnosticoId, path, token } = await iniciarRes.json();

      await subirConProgreso(file, path, token, setProgreso);

      setEstado("procesando");
      setProgresoLectura(0);
      setMensajeLectura(MENSAJES_PROCESANDO[0]);
      const procesarRes = await fetch(`/api/diagnosticos/${diagnosticoId}/procesar`, {
        method: "POST",
      });
      const procesarBody = await procesarRes.json();
      if (!procesarRes.ok) throw new Error(procesarBody?.error ?? "Error al procesar el PDF.");

      setProgresoLectura(100);
      setEstado("listo");
      router.refresh();
    } catch (err) {
      setEstado("error");
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  const nombreMostrado = nombreArchivo ?? nombreArchivoExistente;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={estado === "subiendo" || estado === "procesando"}
        className="pageblock w-full text-left border border-line overflow-hidden hover:border-line-strong disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-4 px-[22px] py-5">
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-[19px] truncate">
              {nombreMostrado ?? "Vincular diagnóstico (PDF)"}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-text-faint mt-1">
              {estado === "idle" && (nombreArchivoExistente ? "Toca para sustituirlo" : "Toca para elegir el archivo · PDF")}
              {estado === "subiendo" && `Subiendo el archivo · ${progreso}%`}
              {estado === "procesando" && `${mensajeLectura} · ${progresoLectura}%`}
              {estado === "listo" && "Procesado correctamente"}
              {estado === "error" && "Hubo un error — toca para reintentar"}
            </div>
          </div>
          {estado === "listo" && (
            <span className="text-[10.5px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-violet text-violet shrink-0">
              Encontrado
            </span>
          )}
          {(estado === "subiendo" || estado === "procesando") && (
            <span className="w-[15px] h-[15px] rounded-full border-[1.5px] border-line-strong border-t-violet animate-spin shrink-0" />
          )}
        </div>
        <div className="h-[2px] bg-line">
          <div
            className="h-full bg-violet transition-[width] duration-150"
            style={{ width: `${estado === "subiendo" ? progreso : estado === "procesando" ? progresoLectura : estado === "listo" ? 100 : 0}%` }}
          />
        </div>
      </button>
      <p className="text-[11.5px] text-text-faint mt-3.5 leading-relaxed">
        PDF de hasta 500 MB. Se lee, se extrae el texto y se segmenta por epígrafes antes de generar nada —
        ese segmentado consulta la IA y tiene un coste de API, evita subirlo varias veces solo para probar.
      </p>

      {errorMsg && <p className="text-[12px] text-coral-ink mt-2">{errorMsg}</p>}
    </div>
  );
}
