import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackLink } from "@/components/BackLink";
import { DocCard } from "@/components/DocCard";
import { EliminarMunicipioBoton } from "@/components/EliminarMunicipioBoton";
import { getMunicipio, listCapitulosDeMunicipio } from "@/lib/data/municipios";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";
import { requireEquipoActivo } from "@/lib/data/equipos";
import { eliminarMunicipioAction } from "./editar/actions";

const DIAGNOSTICO_DESC: Record<string, string> = {
  procesando: "Subido — procesando todavía.",
  listo: "Vinculado y procesado.",
  error: "Falló el último intento de procesarlo.",
};

export default async function MunicipioHubPage({
  params,
}: {
  params: Promise<{ municipioId: string }>;
}) {
  const { municipioId } = await params;
  const equipo = await requireEquipoActivo();
  const [municipio, capitulos, diagnostico] = await Promise.all([
    getMunicipio(municipioId, equipo),
    listCapitulosDeMunicipio(municipioId, equipo.id),
    getDiagnosticoDeMunicipio(municipioId),
  ]);
  if (!municipio) notFound();

  const contables = capitulos.filter((c) => c.sin_info_motivo !== "no_aplica");
  const cerrados = contables.filter((c) => c.estado === "listo").length;

  return (
    <AppShell>
      <BackLink href="/avance/ordenacion" />
      <div className="flex flex-wrap items-start justify-between gap-7 mb-[34px]">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-violet mb-3.5">Municipio</div>
          <h1 className="font-serif font-normal text-[38px] sm:text-[46px] leading-[1.02] tracking-[-0.025em]">
            {municipio.nombre}
          </h1>
        </div>
        <div className="flex gap-2.5 flex-none">
          <EliminarMunicipioBoton
            nombreMunicipio={municipio.nombre}
            action={eliminarMunicipioAction.bind(null, municipio.id)}
          />
          <a href={`/avance/ordenacion/${municipio.id}/editar`} className="btn btn-secondary whitespace-nowrap">
            Editar municipio
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
        <DocCard
          n="01"
          name="Pre-diagnóstico"
          desc="Primer contacto con el municipio, previo al estudio completo."
          info="Documento breve previo al encargo: sitúa el municipio y decide si procede el estudio completo. Todavía no está desarrollado en la aplicación."
          disponible={false}
        />
        <DocCard
          href={`/avance/ordenacion/${municipio.id}/diagnostico`}
          n="02"
          name="Diagnóstico"
          desc={diagnostico ? DIAGNOSTICO_DESC[diagnostico.estado] : "Todavía no se ha subido ningún PDF."}
          info="El estudio completo del municipio: territorio, población, riesgos. Es la fuente de la que la Memoria de Ordenación extrae sus datos."
          cta={diagnostico ? "Ver diagnóstico →" : "Subir diagnóstico →"}
          disponible
        />
        <DocCard
          href={`/avance/ordenacion/${municipio.id}/memoria`}
          n="03"
          name="Memoria de ordenación"
          desc={
            contables.length > 0
              ? `${cerrados} de ${contables.length} capítulos listos.`
              : "Todavía no se han generado los capítulos."
          }
          info="Primer documento oficial del PGOM que se somete a exposición pública — la parte de Ordenación del Avance."
          cta="Abrir memoria →"
          disponible
        />
        <DocCard
          n="04"
          name="Participación"
          desc="Proceso de participación ciudadana del Avance."
          info="La tercera memoria del Avance, junto a Información y Ordenación. Todavía no está desarrollada en la aplicación."
          disponible={false}
        />
      </div>
    </AppShell>
  );
}
