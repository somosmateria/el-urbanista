import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EstadoPill } from "@/components/EstadoPill";
import { requireEquipoActivo, getUsuarioActual } from "@/lib/data/equipos";
import { listMisTareas } from "@/lib/data/tareas";

export default async function TareasPage() {
  await requireEquipoActivo();
  const usuario = await getUsuarioActual();
  const tareas = usuario ? await listMisTareas(usuario.id) : [];

  return (
    <AppShell>
      <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">Avance</div>
      <h1 className="font-serif font-normal text-[38px] sm:text-[46px] leading-[1.02] tracking-[-0.025em] mb-3">
        Mis tareas
      </h1>
      <p className="text-[14px] text-text-soft mb-[30px]">
        {tareas.length === 0
          ? "No tienes ningún capítulo asignado."
          : `${tareas.length} capítulo${tareas.length === 1 ? "" : "s"} asignado${tareas.length === 1 ? "" : "s"}.`}
      </p>

      {tareas.length > 0 && (
        <div className="border-t border-line">
          {tareas.map((t) => (
            <Link
              key={t.id}
              href={`/avance/ordenacion/${t.municipio_id}/${encodeURIComponent(t.codigo)}`}
              className="flex items-center gap-[18px] py-[15px] border-b border-line hover:bg-surface-hi min-w-0"
            >
              <span className="shrink-0 text-[11px] tracking-[0.12em] text-text-faint tabular-nums w-[52px]">
                {t.codigo}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-serif font-semibold text-[17px] leading-[1.25] truncate">
                  {t.titulo}
                </span>
                <span className="block text-[12px] text-text-faint">{t.municipioNombre}</span>
              </span>
              <EstadoPill estado={t.estado} className="shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
