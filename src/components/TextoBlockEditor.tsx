"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "@/components/EditorToolbar";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { CapituloTextoRow } from "@/lib/supabase/types";
import {
  guardarTextoAction,
  eliminarBloqueTextoAction,
} from "@/app/avance/ordenacion/[municipioId]/[capitulo]/actions";

export function TextoBlockEditor({
  municipioId,
  texto,
}: {
  municipioId: string;
  texto: CapituloTextoRow;
}) {
  const [pending, startTransition] = useTransition();
  const [guardado, setGuardado] = useState(true);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, startEliminando] = useTransition();
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: texto.contenido_html,
    immediatelyRender: false,
    onUpdate: () => setGuardado(false),
    editorProps: {
      attributes: {
        class: "doc-text outline-none min-h-[140px]",
      },
    },
  });

  function guardar() {
    if (!editor) return;
    startTransition(async () => {
      await guardarTextoAction(municipioId, texto.id, editor.getHTML());
      setGuardado(true);
    });
  }

  function eliminarBloque() {
    startEliminando(async () => {
      await eliminarBloqueTextoAction(municipioId, texto.id);
      router.refresh();
    });
  }

  if (!editor) return null;

  return (
    <div className="pageblock border border-line p-6 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint">{texto.titulo}</div>
        <button
          type="button"
          onClick={() => setConfirmandoEliminar(true)}
          className="text-[11.5px] text-text-faint hover:text-coral-ink cursor-pointer"
        >
          Eliminar bloque
        </button>
      </div>
      <ConfirmModal
        abierto={confirmandoEliminar}
        titulo={`¿Eliminar "${texto.titulo}"?`}
        descripcion="Se elimina este bloque de texto entero. No se puede deshacer."
        procesando={eliminando}
        onConfirmar={eliminarBloque}
        onCancelar={() => setConfirmandoEliminar(false)}
      />

      <EditorToolbar editor={editor} />
      <div className="border border-line border-t-0 px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          type="button"
          onClick={guardar}
          disabled={guardado || pending}
          className="btn btn-primary"
        >
          {pending ? "Guardando…" : guardado ? "Guardado" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
