import { AppShell } from "@/components/AppShell";
import { MiembroAccesos } from "@/components/MiembroAccesos";
import {
  getUsuarioActual,
  listEquiposDeUsuario,
  requireEquipoActivo,
  listMiembrosDeEquipo,
} from "@/lib/data/equipos";
import { listMunicipiosConProgreso } from "@/lib/data/municipios";
import { listMunicipioIdsAccesibles } from "@/lib/data/municipio-accesos";
import { cambiarEquipoActivoAction, crearEquipoAction, invitarAction, eliminarMiembroAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const user = await getUsuarioActual();
  const equipoActivo = await requireEquipoActivo();
  const equipos = await listEquiposDeUsuario(user!.id);
  const miembros = await listMiembrosDeEquipo(equipoActivo.id);
  const esAdmin = equipoActivo.rol === "admin";

  // Solo un admin gestiona accesos, y solo necesita ver los municipios del
  // equipo cuando hay miembros no-admin a los que gestionárselos.
  const municipios = esAdmin ? await listMunicipiosConProgreso(equipoActivo) : [];
  const accesosPorMiembro = esAdmin
    ? Object.fromEntries(
        await Promise.all(
          miembros
            .filter((m) => m.rol === "miembro")
            .map(async (m) => [
              m.user_id,
              Array.from(await listMunicipioIdsAccesibles(municipios.map((mu) => mu.id), m.user_id)),
            ])
        )
      )
    : {};

  return (
    <AppShell>
      <div className="max-w-[720px]">
        <h1 className="font-serif font-normal text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] mb-[34px]">
          Ajustes
        </h1>

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">Tu cuenta</div>
        <div className="pageblock border border-line px-[22px] py-[18px] text-[15px] mb-11">
          {user?.email}
        </div>

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">Tus equipos</div>
        <div className="border-t border-line mb-5">
          {equipos.map((e) => (
            <form key={e.id} action={cambiarEquipoActivoAction.bind(null, e.id)}>
              <button
                type="submit"
                disabled={e.id === equipoActivo.id}
                className="w-full text-left flex items-center gap-4 px-1 py-[15px] border-b border-line last:border-b-0 hover:bg-surface-hi disabled:cursor-default"
              >
                <span className="font-serif font-semibold text-lg flex-1">{e.nombre}</span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-text-faint">
                  {e.rol === "admin" ? "Admin" : "Miembro"}
                </span>
                {e.id === equipoActivo.id && (
                  <span className="text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-violet text-violet">
                    Activo
                  </span>
                )}
              </button>
            </form>
          ))}
        </div>

        <form action={crearEquipoAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-11">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre del equipo nuevo"
            className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
          />
          <button type="submit" className="btn btn-secondary shrink-0">
            + Crear equipo
          </button>
        </form>

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">
          Miembros de {equipoActivo.nombre}
        </div>
        <div className="border-t border-line mb-5">
          {miembros.map((m) => (
            <div key={m.id} className="px-1 py-[15px] border-b border-line last:border-b-0">
              <div className="flex items-center gap-4">
                <span className="flex-1 text-[14.5px]">{m.email}</span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-text-faint">
                  {m.rol === "admin" ? "Admin" : "Miembro"}
                </span>
                {esAdmin && m.user_id !== user?.id && (
                  <form action={eliminarMiembroAction.bind(null, m.id)}>
                    <button
                      type="submit"
                      className="text-[10px] tracking-[0.14em] uppercase text-text-faint hover:text-text cursor-pointer"
                    >
                      Quitar
                    </button>
                  </form>
                )}
              </div>
              {esAdmin && m.rol === "miembro" && (
                <div className="mt-3">
                  <MiembroAccesos
                    userId={m.user_id}
                    municipios={municipios.map((mu) => ({ id: mu.id, nombre: mu.nombre }))}
                    accesibles={accesosPorMiembro[m.user_id] ?? []}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {esAdmin ? (
          <form action={invitarAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="email@ejemplo.com"
              className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Invitar al equipo
            </button>
          </form>
        ) : (
          <p className="text-[12.5px] text-text-faint">
            Solo un admin de {equipoActivo.nombre} puede invitar a gente nueva.
          </p>
        )}
      </div>
    </AppShell>
  );
}
