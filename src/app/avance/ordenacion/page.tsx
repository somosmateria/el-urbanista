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
  const municipios = await listMunicipiosConProgreso(equipo.id);

  return (
    <AppShell>
      <BackLink href="/avance" />
      <h1 className="font-serif font-medium text-[27px] mb-2">Municipios</h1>
      <p className="text-text-soft text-[14.5px] mb-8 max-w-[540px] leading-relaxed">
        Memoria de ordenación en curso o terminada.
      </p>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {municipios.map((m) => (
          <TownRow
            key={m.id}
            href={`/avance/ordenacion/${m.id}`}
            nombre={m.nombre}
            meta={`${m.progreso.listos} / ${m.progreso.total} capítulos listos`}
          />
        ))}
        <NewTownRow href="/avance/ordenacion/nuevo" />
      </div>
    </AppShell>
  );
}
