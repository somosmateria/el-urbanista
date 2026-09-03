"use client";

import { useRef, useState } from "react";
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

export function DiagnosticoUploader({
  municipioId,
  yaHayDiagnostico,
}: {
  municipioId: string;
  yaHayDiagnostico: boolean;
}) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setNombreArchivo(file.name);
    setErrorMsg(null);
    setProgreso(0);
    setEstado("subiendo");

    try {
      const iniciarRes = await fetch("/api/diagnosticos/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ municipioId }),
      });
      if (!iniciarRes.ok) throw new Error("No se pudo iniciar la subida.");
      const { diagnosticoId, path, token } = await iniciarRes.json();

      await subirConProgreso(file, path, token, setProgreso);

      setEstado("procesando");
      const procesarRes = await fetch(`/api/diagnosticos/${diagnosticoId}/procesar`, {
        method: "POST",
      });
      const procesarBody = await procesarRes.json();
      if (!procesarRes.ok) throw new Error(procesarBody?.error ?? "Error al procesar el PDF.");

      setEstado("listo");
      router.refresh();
    } catch (err) {
      setEstado("error");
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

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
        className="w-full text-left rounded-xl border border-line bg-surface overflow-hidden hover:border-line-strong disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between px-[18px] py-4">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-md bg-white/5 flex items-center justify-center shrink-0">
              {estado === "subiendo" || estado === "procesando" ? (
                <span className="inline-block w-[9px] h-[9px] rounded-full border-[1.5px] border-line-strong border-t-violet animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.6}
                  className="w-[19px] h-[19px] stroke-text-soft"
                >
                  <path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M14 3v6h6" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-serif text-[15px]">
                {nombreArchivo ?? (yaHayDiagnostico ? "Sustituir diagnóstico (PDF)" : "Subir diagnóstico (PDF)")}
              </div>
              <div className="text-[12.5px] text-text-faint font-mono">
                {estado === "idle" && (yaHayDiagnostico ? "Ya hay un diagnóstico vinculado" : "Toca para elegir el archivo")}
                {estado === "subiendo" && `Subiendo… ${progreso}%`}
                {estado === "procesando" && "Leyendo y segmentando el diagnóstico…"}
                {estado === "listo" && "Procesado correctamente"}
                {estado === "error" && "Hubo un error — toca para reintentar"}
              </div>
            </div>
          </div>
          {estado === "listo" && (
            <span className="font-mono text-[10.5px] px-2.5 py-1 rounded-full bg-cyan-wash text-cyan-ink border border-cyan/40 shrink-0">
              Encontrado
            </span>
          )}
        </div>
        {estado === "subiendo" && (
          <div className="h-[3px] bg-white/5">
            <div
              className="h-full bg-violet transition-[width] duration-150"
              style={{ width: `${progreso}%` }}
            />
          </div>
        )}
      </button>

      {errorMsg && <p className="text-[12px] text-coral-ink mt-2">{errorMsg}</p>}
    </div>
  );
}
