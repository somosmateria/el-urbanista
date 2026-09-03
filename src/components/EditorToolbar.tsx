"use client";

import type { Editor } from "@tiptap/react";
import clsx from "clsx";

function ToolButton({
  editor,
  onClick,
  active,
  title,
  children,
}: {
  editor: Editor;
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}) {
  void editor;
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        "w-[30px] h-[30px] rounded-md inline-flex items-center justify-center cursor-pointer",
        active ? "bg-surface-hi" : "hover:bg-surface-hi"
      )}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5 bg-surface border border-line border-b-0 rounded-t-[10px] p-2">
      <ToolButton
        editor={editor}
        title="Negrita"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[15px] h-[15px] stroke-text-soft">
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
        </svg>
      </ToolButton>
      <ToolButton
        editor={editor}
        title="Cursiva"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[15px] h-[15px] stroke-text-soft">
          <path d="M11 5h6M7 19h6M14 5L10 19" />
        </svg>
      </ToolButton>
      <ToolButton
        editor={editor}
        title="Subrayado"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[15px] h-[15px] stroke-text-soft">
          <path d="M6 4v7a6 6 0 0 0 12 0V4M5 20h14" />
        </svg>
      </ToolButton>
      <span className="w-px h-[18px] bg-line-strong mx-1.5" />
      <ToolButton
        editor={editor}
        title="Lista"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[15px] h-[15px] stroke-text-soft">
          <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      </ToolButton>
      <ToolButton
        editor={editor}
        title="Cita"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[15px] h-[15px] stroke-text-soft">
          <path d="M7 8a3 3 0 0 0-3 3v2h4v-5Zm10 0a3 3 0 0 0-3 3v2h4v-5Z" />
        </svg>
      </ToolButton>
    </div>
  );
}
