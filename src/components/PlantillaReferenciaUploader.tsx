"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Estado = "idle" | "subiendo" | "procesando" | "listo" | "error";

/**
 * Mismo mecanismo que DiagnosticoUploader (signed upload URL + XHR a mano
 * para poder leer el progreso) pero sin la simulación de progreso de
 * lectura elaborada — un Avance de referencia pesa unos pocos MB, no
 * cientos, así que la subida y el procesado son casi instantáneos.
 */
function subirConProgreso(
  file: File,
  path: string,
  token: string,
  onProgreso: (pct: number) => void
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const url = new URL(`${supabaseUrl}/storage/v1/object/upload/sign/plantillas-referencia/${path}`);
  url.searchParams.set("token", token);

  const body = new FormData();
  body.append("cacheControl", "3600");
  body.append("", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url.toString());
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
    xhr.setRequestHeader("x-upsert", "true");
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

export function PlantillaReferenciaUploader({
  nombreArchivoExistente,
  capitulosIdentificados,
}: {
  nombreArchivoExistente: string | null;
  capitulosIdentificados: number | null;
}) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [capitulos, setCapitulos] = useState<number | null>(capitulosIdentificados);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setNombreArchivo(file.name);
    setErrorMsg(null);
    setProgreso(0);
    setEstado("subiendo");

    try {
      const iniciarRes = await fetch("/api/plantilla-referencia/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreArchivo: file.name }),
      });
      if (!iniciarRes.ok) {
        const body = await iniciarRes.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo iniciar la subida.");
      }
      const { referenciaId, path, token } = await iniciarRes.json();

      await subirConProgreso(file, path, token, setProgreso);

      setEstado("procesando");
      const procesarRes = await fetch(`/api/plantilla-referencia/${referenciaId}/procesar`, {
        method: "POST",
      });
      const procesarBody = await procesarRes.json();
      if (!procesarRes.ok) throw new Error(procesarBody?.error ?? "Error al procesar el PDF.");

      setCapitulos(procesarBody.capitulos);
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
            <div className="font-serif font-semibold text-[17px] truncate">
              {nombreMostrado ?? "Subir Avance de referencia (PDF)"}
            </div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-text-faint mt-1">
              {estado === "idle" &&
                (nombreArchivoExistente ? "Toca para sustituirlo" : "Toca para elegir el archivo · PDF")}
              {estado === "subiendo" && `Subiendo el archivo · ${progreso}%`}
              {estado === "procesando" && "Localizando los capítulos con IA…"}
              {estado === "listo" &&
                (capitulos && capitulos > 0
                  ? `Procesado correctamente · ${capitulos} capítulo${capitulos === 1 ? "" : "s"} identificado${capitulos === 1 ? "" : "s"}`
                  : "Procesado, pero no se identificó ningún capítulo — revisa el PDF")}
              {estado === "error" && "Hubo un error — toca para reintentar"}
            </div>
          </div>
          {(estado === "subiendo" || estado === "procesando") && (
            <span className="w-[15px] h-[15px] rounded-full border-[1.5px] border-line-strong border-t-violet animate-spin shrink-0" />
          )}
        </div>
      </button>
      <p className="text-[11.5px] text-text-faint mt-3.5 leading-relaxed">
        Procesarlo consulta la IA una vez por cada capítulo del documento — tiene un coste de API. Solo hace
        falta subirlo (o sustituirlo) cuando cambie de verdad, no como prueba.
      </p>

      {errorMsg && <p className="text-[12px] text-coral-ink mt-2">{errorMsg}</p>}
    </div>
  );
}
