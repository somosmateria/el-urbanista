import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DocCard } from "@/components/DocCard";

export default function AvancePage() {
  return (
    <AppShell breadcrumb="elurbanista.app / avance">
      <BackLink href="/" />
      <h1 className="font-serif font-medium text-[27px] mb-2">Avance — ¿qué memoria?</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        El Documento de Avance se compone de tres memorias. Ordenación es la que está
        desarrollada.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <DocCard
          variant="disabled"
          badge={{ label: "Próximamente", tone: "soon" }}
          name="Información"
          desc="Descripción del municipio y su diagnóstico resumido."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <path d="M4 4h16v16H4z" />
              <path d="M8 9h8M8 13h8M8 17h5" />
            </svg>
          }
        />
        <DocCard
          href="/avance/ordenacion"
          variant="hero"
          badge={{ label: "Disponible", tone: "on-cyan" }}
          name="Ordenación"
          desc="Los 12 capítulos que definen el modelo de ordenación propuesto."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <path d="M3 11h18M6 11V4h12v7M4 21h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6Z" />
            </svg>
          }
        />
        <DocCard
          variant="disabled"
          badge={{ label: "Próximamente", tone: "soon" }}
          name="Participación"
          desc="Registro del proceso de participación ciudadana."
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
              <circle cx="9" cy="8" r="3" />
              <circle cx="17" cy="9" r="2.5" />
              <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 15.5c2.2.3 4 1.8 4 3.7V20" />
            </svg>
          }
        />
      </div>
    </AppShell>
  );
}
