import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { CapituloEstado, MotorTipo } from "@/lib/supabase/types";

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

export async function generarCapitulosIniciales(municipioId: string) {
  const supabase = createServiceClient();

  const { data: yaExisten, error: existenError } = await supabase
    .from("capitulos")
    .select("id")
    .eq("municipio_id", municipioId)
    .limit(1);
  if (existenError) throw existenError;
  if (yaExisten.length > 0) return;

  const { data: mapeo, error: mapeoError } = await supabase
    .from("mapeo_capitulos")
    .select("*")
    .is("capitulo_padre", null)
    .eq("activo", true)
    .order("orden");
  if (mapeoError) throw mapeoError;

  const capitulosAInsertar = mapeo.map((entrada) => {
    const motor = entrada.motor as MotorTipo;
    const estado: CapituloEstado = motor === "tabla" ? "tu_aportacion" : "sin_info";
    return {
      municipio_id: municipioId,
      codigo: entrada.capitulo_codigo,
      titulo: entrada.titulo_canonico,
      motor,
      estado,
      sin_info_motivo: estado === "sin_info" ? ("falta_dato" as const) : null,
      contenido_html: null,
      orden: entrada.orden,
    };
  });

  const { error: capitulosError } = await supabase
    .from("capitulos")
    .insert(capitulosAInsertar);
  if (capitulosError) throw capitulosError;
}
