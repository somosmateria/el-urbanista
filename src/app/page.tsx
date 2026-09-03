import { AppShell } from "@/components/AppShell";
import { DocCard } from "@/components/DocCard";

export default function Home() {
  return (
    <AppShell breadcrumb="elurbanista.app / nuevo">
      <h1 className="font-serif font-medium text-[27px] mb-2">¿Qué vas a redactar?</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        Elige el tipo de documento. Avance ya está desarrollado; el resto llega más
        adelante.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <DocCard
          variant="disabled"
          badge={{ label: "Próximamente", tone: "soon" }}
          name="Pre-diagnóstico"
          desc="Primer contacto con el municipio, previo al estudio completo."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
              <path d="M14 3v6h6" />
            </svg>
          }
        />
        <DocCard
          variant="disabled"
          badge={{ label: "Próximamente", tone: "soon" }}
          name="Diagnóstico"
          desc="Análisis completo del municipio: territorio, población, riesgos."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <path d="M9 3v18M4 8h5M4 16h5M15 3v18M15 8h5M15 16h5" />
            </svg>
          }
        />
        <DocCard
          href="/avance"
          variant="hero"
          badge={{ label: "Disponible", tone: "on" }}
          name="Avance"
          desc="Documento de Avance de Plan: información, ordenación y participación."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          }
        />
      </div>
    </AppShell>
  );
}
