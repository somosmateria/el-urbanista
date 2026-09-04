import { AppShell } from "@/components/AppShell";
import { MiembroAccesos } from "@/components/MiembroAccesos";
import { RolSelector } from "@/components/RolSelector";
import { PlantillaReferenciaUploader } from "@/components/PlantillaReferenciaUploader";
import { SubmitButton } from "@/components/SubmitButton";
import { EliminarEquipoBoton } from "@/components/EliminarEquipoBoton";
import {
  getUsuarioActual,
  listEquiposDeUsuario,
  getEquipoActivo,
  listMiembrosDeEquipo,
  listMunicipiosDeEquipo,
} from "@/lib/data/equipos";
import { listAccesosPorMiembro } from "@/lib/data/municipio-accesos";
import { getReferenciaDeEquipo, listSeccionesDeReferencia } from "@/lib/data/plantilla-referencia";
import {
  cambiarEquipoActivoAction,
  crearEquipoAction,
  invitarAction,
  eliminarMiembroAction,
  renombrarEquipoAction,
  eliminarEquipoAction,
} from "./actions";

export const dynamic = "force-dynamic";

function IconoEditar() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
    </svg>
  );
}

export default async function AjustesPage() {
  const user = await getUsuarioActual();
  const equipoActivo = await getEquipoActivo();
  const equipos = user ? await listEquiposDeUsuario(user.id) : [];

  // Cuenta recién creada, sin ningún equipo todavía: en vez de reventar
  // (todas las demás páginas dan por hecho que hay un equipo activo), se
  // pide crear el primero aquí mismo.
  if (!equipoActivo) {
    return (
      <AppShell>
        <div className="max-w-[520px]">
          <h1 className="font-serif font-normal text-[40px] leading-[1.05] tracking-[-0.02em] mb-3.5">
            Crea tu primer equipo
          </h1>
          <p className="text-[15px] leading-[1.7] text-text-soft mb-8">
            Todavía no perteneces a ningún equipo. Los municipios y documentos que generes
            viven dentro de un equipo — crea el tuyo para empezar.
          </p>
          <form action={crearEquipoAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              name="nombre"
              type="text"
              required
              autoFocus
              placeholder="Nombre del equipo"
              className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
            />
            <SubmitButton className="btn btn-primary shrink-0">Crear equipo</SubmitButton>
          </form>
        </div>
      </AppShell>
    );
  }

  const esAdmin = equipoActivo.rol === "admin";

  // Solo un admin gestiona accesos, y solo necesita ver los municipios del
  // equipo cuando hay miembros no-admin a los que gestionárselos. Las tres
  // son independientes entre sí, así que van en paralelo.
  const [miembros, municipios, referencia] = await Promise.all([
    listMiembrosDeEquipo(equipoActivo.id),
    esAdmin ? listMunicipiosDeEquipo(equipoActivo.id) : Promise.resolve([]),
    esAdmin ? getReferenciaDeEquipo(equipoActivo.id) : Promise.resolve(null),
  ]);

  const [accesosPorMiembro, seccionesReferencia] = await Promise.all([
    esAdmin ? listAccesosPorMiembro(municipios.map((mu) => mu.id)) : Promise.resolve(new Map<string, Set<string>>()),
    referencia?.estado === "listo" ? listSeccionesDeReferencia(referencia.id) : Promise.resolve(null),
  ]);
  const capitulosIdentificados = seccionesReferencia ? seccionesReferencia.length : null;

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
            <div key={e.id} className="flex items-center gap-3 px-1 py-[13px] border-b border-line last:border-b-0">
              <form action={cambiarEquipoActivoAction.bind(null, e.id)} className="flex-1 min-w-0">
                <button
                  type="submit"
                  disabled={e.id === equipoActivo.id}
                  className="w-full text-left flex items-center gap-4 hover:text-violet disabled:hover:text-text cursor-pointer disabled:cursor-default"
                >
                  <span className="font-serif font-semibold text-lg flex-1 truncate">{e.nombre}</span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-text-faint shrink-0">
                    {e.rol === "admin" ? "Admin" : "Miembro"}
                  </span>
                  {e.id === equipoActivo.id && (
                    <span className="text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-violet text-violet shrink-0">
                      Activo
                    </span>
                  )}
                </button>
              </form>
              {e.rol === "admin" && (
                <span className="flex items-center gap-1 shrink-0">
                  <form action={cambiarEquipoActivoAction.bind(null, e.id)}>
                    <button
                      type="submit"
                      title={`Gestionar ${e.nombre}`}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-text-faint hover:bg-surface-hi hover:text-violet cursor-pointer"
                    >
                      <IconoEditar />
                    </button>
                  </form>
                  <EliminarEquipoBoton
                    variant="icono"
                    nombreEquipo={e.nombre}
                    action={eliminarEquipoAction.bind(null, e.id)}
                  />
                </span>
              )}
            </div>
          ))}
        </div>

        <form action={crearEquipoAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-11">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre del equipo nuevo"
            className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
          />
          <SubmitButton className="btn btn-secondary shrink-0">+ Crear equipo</SubmitButton>
        </form>

        {esAdmin && (
          <>
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">
              Renombrar {equipoActivo.nombre}
            </div>
            <form action={renombrarEquipoAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-11">
              <input
                name="nombre"
                type="text"
                required
                defaultValue={equipoActivo.nombre}
                className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
              />
              <SubmitButton className="btn btn-secondary shrink-0">Renombrar</SubmitButton>
            </form>
          </>
        )}

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">
          Miembros de {equipoActivo.nombre}
        </div>
        <div className="border-t border-line mb-5">
          {miembros.map((m) => (
            <div key={m.id} className="px-1 py-[15px] border-b border-line last:border-b-0">
              <div className="flex items-center gap-4">
                <span className="flex-1 text-[14.5px] truncate">{m.email}</span>
                {esAdmin && m.user_id !== user?.id ? (
                  <RolSelector miembroId={m.id} rolInicial={m.rol} />
                ) : (
                  <span className="text-[10px] tracking-[0.14em] uppercase text-text-faint">
                    {m.rol === "admin" ? "Admin" : "Miembro"}
                  </span>
                )}
                {esAdmin && m.user_id !== user?.id && (
                  <form action={eliminarMiembroAction.bind(null, m.id)}>
                    <SubmitButton
                      pendingLabel="Quitando…"
                      className="text-[10px] tracking-[0.14em] uppercase text-text-faint hover:text-coral-ink cursor-pointer"
                    >
                      Quitar
                    </SubmitButton>
                  </form>
                )}
              </div>
              {esAdmin && m.rol === "miembro" && (
                <div className="mt-3">
                  <MiembroAccesos
                    userId={m.user_id}
                    municipios={municipios}
                    accesibles={Array.from(accesosPorMiembro.get(m.user_id) ?? [])}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {esAdmin ? (
          <form action={invitarAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-14">
            <input
              name="email"
              type="email"
              required
              placeholder="email@ejemplo.com"
              className="flex-1 box-border bg-transparent border border-line rounded px-3 py-2.5 text-[13.5px] text-text outline-none focus:border-violet"
            />
            <SubmitButton className="btn btn-primary shrink-0" pendingLabel="Invitando…">
              Invitar al equipo
            </SubmitButton>
          </form>
        ) : (
          <p className="text-[12.5px] text-text-faint mb-14">
            Solo un admin de {equipoActivo.nombre} puede invitar a gente nueva.
          </p>
        )}

        {esAdmin && (
          <>
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">
              Avance de referencia de {equipoActivo.nombre}
            </div>
            <p className="text-[12.5px] text-text-faint mb-4 leading-relaxed max-w-[560px]">
              Sube un Avance real que vuestro equipo haya redactado. Los capítulos de
              plantilla (los que no dependen del diagnóstico de cada municipio) pasan a
              basarse en el vuestro en vez del ejemplo por defecto, para todos los
              municipios que generéis a partir de ahora — puedes volver a subirlo cuando
              queráis para actualizarlo. MO.1 y MO.11 quedan siempre fuera: extraen datos
              reales del diagnóstico de cada municipio, no texto de referencia.
            </p>
            <PlantillaReferenciaUploader
              nombreArchivoExistente={referencia?.nombre_archivo ?? null}
              capitulosIdentificados={capitulosIdentificados}
            />
            {referencia?.estado === "error" && (
              <p className="text-[12px] text-coral-ink mt-2">
                El último intento falló: {referencia.error_mensaje}
              </p>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
