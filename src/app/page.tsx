import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DocCard } from "@/components/DocCard";
import { TownRow } from "@/components/TownRow";
import { listMunicipiosConProgreso } from "@/lib/data/municipios";
import { getEquipoActivo } from "@/lib/data/equipos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const equipo = await getEquipoActivo();
  // Cuenta recién creada sin ningún equipo todavía — Ajustes es donde se
  // pide crear el primero, en vez de reventar aquí.
  if (!equipo) redirect("/ajustes");
  const municipios = await listMunicipiosConProgreso(equipo);
  const recientes = municipios.slice(0, 5);

  return (
    <AppShell>
      <div className="max-w-[600px] mb-11">
        <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-4">
          Estudio · Redacción de planeamiento
        </div>
        <h1 className="font-serif font-normal text-[44px] sm:text-[52px] leading-[1.04] tracking-[-0.02em] mb-4">
          ¿Qué vas a redactar?
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft">
          Elige el tipo de documento. El Avance ya está desarrollado; los otros dos llegan
          más adelante y se dejan a la vista para no rehacer la navegación.
        </p>
      </div>

      <hr className="border-t border-line mb-[34px]" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mb-16">
        <DocCard
          n="01"
          name="Pre-diagnóstico"
          desc="Primer contacto con el municipio, previo al estudio completo."
          info="Documento breve previo al encargo: sitúa el municipio y decide si procede el estudio completo. Todavía no está desarrollado en la aplicación."
          disponible={false}
        />
        <DocCard
          n="02"
          name="Diagnóstico"
          desc="Análisis completo del municipio: territorio, población, riesgos."
          info="El estudio completo del municipio. Es la fuente de la que la Memoria de Ordenación extrae sus datos: aquí solo se vincula su PDF, todavía no se redacta."
          disponible={false}
        />
        <DocCard
          href="/avance"
          n="03"
          name="Avance"
          desc="Documento de Avance de Plan: información, ordenación y participación."
          info="Primer documento oficial del PGOM que se somete a exposición pública. Se compone de tres memorias: Información, Ordenación y Participación."
          cta="Abrir Avance →"
          disponible
        />
      </div>

      <div className="flex items-baseline justify-between mb-[14px]">
        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint">
          Creados recientemente
        </div>
        {municipios.length > 0 && (
          <Link
            href="/avance/ordenacion"
            className="text-[10px] tracking-[0.16em] uppercase text-violet hover:text-violet-hover"
          >
            Ver todos ({municipios.length})
          </Link>
        )}
      </div>

      {recientes.length === 0 ? (
        <div className="pageblock border border-line rounded p-6">
          <p className="text-text-faint text-[13.5px]">
            Todavía no hay ningún municipio. Empieza desde la tarjeta de Avance.
          </p>
        </div>
      ) : (
        <div className="border-t border-line">
          {recientes.map((m) => (
            <TownRow
              key={m.id}
              href={`/avance/ordenacion/${m.id}`}
              nombre={m.nombre}
              pct={m.progreso.total > 0 ? Math.round((m.progreso.listos / m.progreso.total) * 100) : 0}
              meta={`${m.progreso.listos} de ${m.progreso.total} listos`}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
