import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { TownRow, NewTownRow } from "@/components/TownRow";
import { listMunicipiosConProgreso } from "@/lib/data/municipios";
import { requireEquipoActivo } from "@/lib/data/equipos";

// La lista de municipios cambia con cada alta/generación — nunca debe
// congelarse como página estática en build-time.
export const dynamic = "force-dynamic";

export default async function OrdenacionPage() {
  const equipo = await requireEquipoActivo();
  const municipios = await listMunicipiosConProgreso(equipo);

  return (
    <AppShell>
      <BackLink href="/avance" />
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-serif font-normal text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-3">
            Municipios
          </h1>
          <p className="text-[15px] text-text-soft">Memoria de ordenación en curso o terminada.</p>
        </div>
        <Link href="/avance/ordenacion/nuevo" className="btn btn-primary">
          + Nuevo municipio
        </Link>
      </div>

      <div className="border-t border-line">
        {municipios.map((m, i) => (
          <TownRow
            key={m.id}
            href={`/avance/ordenacion/${m.id}`}
            n={String(i + 1).padStart(2, "0")}
            nombre={m.nombre}
            pct={m.progreso.total > 0 ? Math.round((m.progreso.listos / m.progreso.total) * 100) : 0}
            meta={`${m.progreso.listos} / ${m.progreso.total} capítulos`}
          />
        ))}
        <NewTownRow href="/avance/ordenacion/nuevo" />
      </div>
    </AppShell>
  );
}
