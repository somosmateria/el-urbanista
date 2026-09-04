import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DocCard } from "@/components/DocCard";

export default function AvancePage() {
  return (
    <AppShell>
      <BackLink href="/" />
      <div className="max-w-[620px] mb-10">
        <h1 className="font-serif font-normal text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-3.5">
          Documento de Avance
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft">
          Se compone de tres memorias. Ordenación es la que está desarrollada.
        </p>
      </div>

      <hr className="border-t border-line mb-[34px]" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px]">
        <DocCard
          n="01"
          name="Información"
          desc="Descripción del municipio y su diagnóstico resumido."
          info="Resume el diagnóstico dentro del Avance: territorio, población y planeamiento vigente. Pendiente de desarrollo."
          disponible={false}
        />
        <DocCard
          href="/avance/ordenacion"
          n="02"
          name="Ordenación"
          desc="Los doce capítulos que definen el modelo de ordenación propuesto."
          info="La propuesta: qué se clasifica cómo, qué usos se regulan y qué sistemas generales se proponen. Doce capítulos, cada uno con su forma de generarse."
          cta="Abrir Ordenación →"
          disponible
        />
        <DocCard
          n="03"
          name="Participación"
          desc="Registro del proceso de participación ciudadana."
          info="Deja constancia del proceso de participación: sesiones, aportaciones y respuesta a las mismas. Pendiente de desarrollo."
          disponible={false}
        />
      </div>
    </AppShell>
  );
}
