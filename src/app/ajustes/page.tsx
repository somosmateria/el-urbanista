import { AppShell } from "@/components/AppShell";
import {
  getUsuarioActual,
  listEquiposDeUsuario,
  requireEquipoActivo,
  listMiembrosDeEquipo,
} from "@/lib/data/equipos";
import { cambiarEquipoActivoAction, crearEquipoAction, invitarAction, eliminarMiembroAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const user = await getUsuarioActual();
  const equipoActivo = await requireEquipoActivo();
  const equipos = await listEquiposDeUsuario(user!.id);
  const miembros = await listMiembrosDeEquipo(equipoActivo.id);
  const esAdmin = equipoActivo.rol === "admin";

  return (
    <AppShell titulo="Ajustes">
      <div className="font-mono text-[11px] text-text-faint mb-2">TU CUENTA</div>
      <div className="rounded-xl border border-line bg-surface p-6 mb-10">
        <p className="text-[14px] text-text">{user?.email}</p>
      </div>

      <div className="font-mono text-[11px] text-text-faint mb-2">TUS EQUIPOS</div>
      <div className="rounded-xl border border-line bg-surface overflow-hidden mb-4">
        {equipos.map((e) => (
          <form key={e.id} action={cambiarEquipoActivoAction.bind(null, e.id)}>
            <button
              type="submit"
              disabled={e.id === equipoActivo.id}
              className={`w-full text-left flex items-center justify-between px-[18px] py-4 border-b border-line last:border-b-0 ${
                e.id === equipoActivo.id ? "bg-violet-wash" : "hover:bg-surface-hi cursor-pointer"
              }`}
            >
              <span className="font-serif text-[15px]">{e.nombre}</span>
              <span className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-text-faint">
                  {e.rol === "admin" ? "ADMIN" : "MIEMBRO"}
                </span>
                {e.id === equipoActivo.id && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet text-white">
                    ACTIVO
                  </span>
                )}
              </span>
            </button>
          </form>
        ))}
      </div>

      <form action={crearEquipoAction} className="flex items-center gap-3 mb-10">
        <input
          name="nombre"
          type="text"
          placeholder="Nombre del equipo nuevo"
          className="flex-1 box-border bg-surface border border-line-strong rounded-lg px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
        />
        <button
          type="submit"
          className="text-[12.5px] px-3.5 py-2 rounded-lg border border-line-strong text-text-soft hover:bg-surface-hi cursor-pointer whitespace-nowrap"
        >
          + Crear equipo
        </button>
      </form>

      <div className="font-mono text-[11px] text-text-faint mb-2">
        MIEMBROS DE {equipoActivo.nombre.toUpperCase()}
      </div>
      <div className="rounded-xl border border-line bg-surface overflow-hidden mb-4">
        {miembros.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-[18px] py-4 border-b border-line last:border-b-0"
          >
            <span className="text-[14px] text-text">{m.email}</span>
            <span className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-text-faint">
                {m.rol === "admin" ? "ADMIN" : "MIEMBRO"}
              </span>
              {esAdmin && m.user_id !== user?.id && (
                <form action={eliminarMiembroAction.bind(null, m.id)}>
                  <button
                    type="submit"
                    className="text-[12px] text-text-faint hover:text-coral-ink cursor-pointer"
                  >
                    Quitar
                  </button>
                </form>
              )}
            </span>
          </div>
        ))}
      </div>

      {esAdmin ? (
        <form action={invitarAction} className="flex items-center gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="email@ejemplo.com"
            className="flex-1 box-border bg-surface border border-line-strong rounded-lg px-3 py-2 text-[13.5px] text-text outline-none focus:border-violet"
          />
          <button
            type="submit"
            className="text-[12.5px] px-3.5 py-2 rounded-lg bg-violet hover:bg-violet-hover text-white cursor-pointer whitespace-nowrap"
          >
            Invitar a {equipoActivo.nombre}
          </button>
        </form>
      ) : (
        <p className="text-[12.5px] text-text-faint">
          Solo un admin de {equipoActivo.nombre} puede invitar a gente nueva.
        </p>
      )}
    </AppShell>
  );
}
