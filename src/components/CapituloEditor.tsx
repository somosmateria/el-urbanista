"use client";

import { useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { EditorToolbar } from "./EditorToolbar";
import { guardarEdicionAction } from "@/app/avance/ordenacion/[municipioId]/[capitulo]/editar/actions";

export function CapituloEditor({
  municipioId,
  capituloId,
  capituloCodigo,
  contenidoInicial,
}: {
  municipioId: string;
  capituloId: string;
  capituloCodigo: string;
  contenidoInicial: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ HTMLAttributes: {} }),
    ],
    content: contenidoInicial,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "doc-block editable rounded-b-[10px] border border-line p-7 outline-none min-h-[240px] font-serif text-[16.5px] leading-[1.8] focus:border-violet",
      },
    },
  });

  function guardar() {
    if (!editor) return;
    const html = editor.getHTML();
    setError(null);
    startTransition(async () => {
      try {
        await guardarEdicionAction(municipioId, capituloId, capituloCodigo, html);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar.");
      }
    });
  }

  if (!editor) return null;

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <button
        type="button"
        onClick={guardar}
        disabled={pending}
        className="mt-[18px] inline-block bg-violet hover:bg-violet-hover disabled:opacity-50 text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg cursor-pointer"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
      {error && <p className="text-[12px] text-coral-ink mt-2">{error}</p>}
    </div>
  );
}
