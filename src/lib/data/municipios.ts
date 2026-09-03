import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { CapituloEstado, MotorTipo } from "@/lib/supabase/types";
import { PLANTILLAS, PLANTILLAS_QUE_NECESITAN_REVISION } from "@/lib/motores/plantilla";
import { generarCapituloRAG } from "@/lib/motores/rag";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";

export async function listMunicipiosConProgreso() {
  const supabase = createServiceClient();
  const { data: municipios, error } = await supabase
    .from("municipios")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (municipios.length === 0) return [];

  const { data: capitulos, error: capError } = await supabase
    .from("capitulos")
    .select("municipio_id, estado, sin_info_motivo")
    .in(
      "municipio_id",
      municipios.map((m) => m.id)
    );
  if (capError) throw capError;

  return municipios.map((municipio) => {
    // Los capítulos marcados "no aplica" (decisión editorial de fusión, no un
    // hueco real) no cuentan ni en el numerador ni en el denominador — ver
    // docs/03-flujo-de-usuario.md, panel de municipios.
    const propios = capitulos.filter(
      (c) => c.municipio_id === municipio.id && c.sin_info_motivo !== "no_aplica"
    );
    const listos = propios.filter((c) => c.estado === "listo").length;
    return {
      ...municipio,
      progreso: { total: propios.length, listos },
    };
  });
}

export async function getMunicipio(id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCapitulosDeMunicipio(municipioId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulos")
    .select("*")
    .eq("municipio_id", municipioId)
    .order("orden");
  if (error) throw error;
  return data;
}

export async function getCapituloPorCodigo(municipioId: string, codigo: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulos")
    .select("*")
    .eq("municipio_id", municipioId)
    .eq("codigo", codigo)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function crearMunicipio(input: {
  nombre: string;
  planVigente?: string | null;
  fechaPlanVigente?: string | null;
}) {
  const supabase = createServiceClient();
  const { data: municipio, error } = await supabase
    .from("municipios")
    .insert({
      nombre: input.nombre,
      plan_vigente: input.planVigente ?? null,
      fecha_plan_vigente: input.fechaPlanVigente ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return municipio;
}

export async function actualizarMunicipio(
  id: string,
  input: { nombre: string; planVigente?: string | null; fechaPlanVigente?: string | null }
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("municipios")
    .update({
      nombre: input.nombre,
      plan_vigente: input.planVigente ?? null,
      fecha_plan_vigente: input.fechaPlanVigente ?? null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function eliminarMunicipio(id: string) {
  const supabase = createServiceClient();

  // El borrado del municipio arrastra en cascada (FK on delete cascade)
  // capítulos, versiones, tablas y diagnósticos — pero no los PDF en
  // Storage, que hay que borrar aparte.
  const { data: archivos } = await supabase.storage.from("diagnosticos").list(id);
  if (archivos && archivos.length > 0) {
    await supabase.storage.from("diagnosticos").remove(archivos.map((a) => `${id}/${a.name}`));
  }

  const { error } = await supabase.from("municipios").delete().eq("id", id);
  if (error) throw error;
}

export async function generarCapitulosIniciales(municipioId: string) {
  const supabase = createServiceClient();

  const { data: yaExisten, error: existenError } = await supabase
    .from("capitulos")
    .select("id")
    .eq("municipio_id", municipioId)
    .limit(1);
  if (existenError) throw existenError;
  if (yaExisten.length > 0) return;

  const municipio = await getMunicipio(municipioId);
  if (!municipio) throw new Error("Municipio no encontrado");

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);
  const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;

  const { data: mapeo, error: mapeoError } = await supabase
    .from("mapeo_capitulos")
    .select("*")
    .is("capitulo_padre", null)
    .eq("activo", true)
    .order("orden");
  if (mapeoError) throw mapeoError;

  const capitulosAInsertar = await Promise.all(
    mapeo.map(async (entrada) => {
      const motor = entrada.motor as MotorTipo;

      if (motor === "tabla") {
        return {
          municipio_id: municipioId,
          codigo: entrada.capitulo_codigo,
          titulo: entrada.titulo_canonico,
          motor,
          estado: "tu_aportacion" as CapituloEstado,
          sin_info_motivo: null,
          contenido_html: null,
          orden: entrada.orden,
        };
      }

      if (motor === "rag") {
        // Motor RAG dirigido: reformatea subepígrafe a subepígrafe el texto
        // ya verificado del diagnóstico (ver src/lib/motores/rag). Sin
        // diagnóstico procesado, no hay nada que reformatear.
        const contenido = diagnosticoId
          ? await generarCapituloRAG(entrada.capitulo_codigo, diagnosticoId)
          : null;

        return {
          municipio_id: municipioId,
          codigo: entrada.capitulo_codigo,
          titulo: entrada.titulo_canonico,
          motor,
          estado: (contenido ? "revisar" : "sin_info") as CapituloEstado,
          sin_info_motivo: contenido ? null : ("falta_dato" as const),
          contenido_html: contenido,
          orden: entrada.orden,
        };
      }

      // Motor plantilla: si ya hay una plantilla implementada para este
      // capítulo, se genera de inmediato — la mayoría no necesita
      // diagnóstico ni Claude, salvo MO.11 (lista de colindantes). Si no
      // hay plantilla o le faltan datos, se deja en "sin información" en
      // vez de fabricar un texto a medias (ver src/lib/motores/plantilla/index.ts).
      const generador = PLANTILLAS[entrada.capitulo_codigo];
      const contenido = generador ? await generador(municipio, diagnosticoId) : null;
      const necesitaRevision = PLANTILLAS_QUE_NECESITAN_REVISION.has(entrada.capitulo_codigo);

      return {
        municipio_id: municipioId,
        codigo: entrada.capitulo_codigo,
        titulo: entrada.titulo_canonico,
        motor,
        estado: (contenido
          ? necesitaRevision
            ? "revisar"
            : "listo"
          : "sin_info") as CapituloEstado,
        sin_info_motivo: contenido ? null : ("falta_dato" as const),
        contenido_html: contenido,
        orden: entrada.orden,
      };
    })
  );

  const { data: capitulosCreados, error: capitulosError } = await supabase
    .from("capitulos")
    .insert(capitulosAInsertar)
    .select("id, contenido_html");
  if (capitulosError) throw capitulosError;

  const versionesIniciales = capitulosCreados
    .filter((c) => c.contenido_html)
    .map((c) => ({
      capitulo_id: c.id,
      contenido_html: c.contenido_html as string,
      tipo: "generacion_automatica" as const,
    }));

  if (versionesIniciales.length > 0) {
    const { error: versionesError } = await supabase
      .from("capitulo_versiones")
      .insert(versionesIniciales);
    if (versionesError) throw versionesError;
  }
}
