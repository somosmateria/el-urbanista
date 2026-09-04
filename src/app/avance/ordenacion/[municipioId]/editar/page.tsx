import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DiagnosticoUploader } from "@/components/DiagnosticoUploader";
import { ReprocesarDiagnosticoBoton } from "@/components/ReprocesarDiagnosticoBoton";
import { EliminarMunicipioBoton } from "@/components/EliminarMunicipioBoton";
import { AccesoMunicipioToggle } from "@/components/AccesoMunicipioToggle";
import { getMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { requireEquipoActivo, listMiembrosDeEquipo } from "@/lib/data/equipos";
import { listUserIdsConAcceso } from "@/lib/data/municipio-accesos";
import { actualizarMunicipioAction, eliminarMunicipioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditarMunicipioPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) notFound();

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);
  const miembros = equipo.rol === "admin" ? await listMiembrosDeEquipo(equipo.id) : [];
  const conAcceso = equipo.rol === "admin" ? await listUserIdsConAcceso(municipioId) : new Set<string>();

  return (
    <AppShell>
      <BackLink href={`/avance/ordenacion/${municipioId}`} />
      <div className="max-w-[660px]">
        <h1 className="font-serif font-normal text-[36px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] mb-3.5">
          Editar {municipio.nombre}
        </h1>
        <p className="text-[15px] leading-[1.7] text-text-soft mb-10">
          Cambia los datos del municipio o sustituye el diagnóstico. Sustituir el
          diagnóstico no regenera los capítulos por sí solo — hazlo desde
          &ldquo;Regenerar&rdquo; en cada capítulo que dependa de él.
        </p>

        <form action={actualizarMunicipioAction.bind(null, municipioId)}>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-line py-6">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Nombre del municipio
            </label>
            <input
              name="nombre"
              required
              type="text"
              defaultValue={municipio.nombre}
              className="flex-1 w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-line py-6">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Plan vigente <span className="text-line-strong normal-case tracking-normal">(opcional)</span>
            </label>
            <div className="flex-1 w-full">
              <input
                name="plan_vigente"
                type="text"
                defaultValue={municipio.plan_vigente ?? ""}
                placeholder="Ej. las Normas Subsidiarias, o el PGOU de 2005"
                className="w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
              />
              <p className="text-[11.5px] text-text-faint mt-2 leading-relaxed">
                Se intenta extraer del diagnóstico si lo dejas en blanco.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-t border-b border-line py-6 mb-[34px]">
            <label className="w-[220px] shrink-0 text-[10px] tracking-[0.16em] uppercase text-text-faint pt-2.5">
              Fecha de aprobación del plan vigente
            </label>
            <input
              name="fecha_plan_vigente"
              type="date"
              defaultValue={municipio.fecha_plan_vigente ?? ""}
              className="flex-1 w-full box-border bg-transparent border border-line rounded px-3 py-2.5 text-[14px] text-text outline-none focus:border-violet"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar cambios
          </button>
        </form>

        <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mt-14 mb-3">
          Diagnóstico de origen
        </div>
        <div className="mb-10">
          <DiagnosticoUploader municipioId={municipioId} nombreArchivoExistente={diagnostico?.nombre_archivo ?? null} />
          {diagnostico?.estado === "error" && (
            <p className="text-[12px] text-coral-ink mt-2">
              El último intento falló: {diagnostico.error_mensaje}
            </p>
          )}
          {diagnostico?.estado === "listo" && <ReprocesarDiagnosticoBoton diagnosticoId={diagnostico.id} />}
        </div>

        {equipo.rol === "admin" && (
          <>
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-faint mb-2.5">
              Acceso a este municipio
            </div>
            <p className="text-[12.5px] text-text-faint mb-4 leading-relaxed">
              Los admins del equipo siempre ven todos los municipios. Marca a qué miembros
              les das acceso a {municipio.nombre} en concreto.
            </p>
            <div className="border-t border-line mb-14">
              {miembros
                .filter((m) => m.rol === "miembro")
                .map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-4 px-1 py-[13px] border-b border-line last:border-b-0 cursor-pointer"
                  >
                    <AccesoMunicipioToggle
                      municipioId={municipioId}
                      userId={m.user_id}
                      checkedInicial={conAcceso.has(m.user_id)}
                    />
                    <span className="text-[14px]">{m.email}</span>
                  </label>
                ))}
              {miembros.filter((m) => m.rol === "miembro").length === 0 && (
                <p className="text-[12.5px] text-text-faint py-3">
                  Todavía no hay ningún miembro (aparte de admins) en este equipo.
                </p>
              )}
            </div>
          </>
        )}

        <div className="border border-coral/40 rounded p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-coral-ink mb-1.5">Zona de peligro</div>
            <p className="text-[13px] text-text-soft max-w-[440px] leading-relaxed">
              Elimina el municipio, sus capítulos, historial y diagnóstico. No se puede
              deshacer.
            </p>
          </div>
          <EliminarMunicipioBoton
            nombreMunicipio={municipio.nombre}
            action={eliminarMunicipioAction.bind(null, municipioId)}
          />
        </div>
      </div>
    </AppShell>
  );
}
