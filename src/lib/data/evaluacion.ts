import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { AvisoTipo, AvisoSeveridad, DesgloseEvaluacion } from "@/lib/supabase/types";

export async function getEvaluacionDeCapitulo(capituloId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulo_evaluaciones")
    .select("*")
    .eq("capitulo_id", capituloId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listEvaluacionesDeMunicipio(capituloIds: string[]) {
  const supabase = createServiceClient();
  if (capituloIds.length === 0) return [];
  const { data, error } = await supabase.from("capitulo_evaluaciones").select("*").in("capitulo_id", capituloIds);
  if (error) throw error;
  return data;
}

/**
 * Reemplaza la evaluación anterior del capítulo (si la había) por la nueva —
 * no se acumula histórico de evaluaciones, cada regeneración deja la
 * puntuación al día. `capitulo_id` es `unique` en la tabla.
 */
export async function guardarEvaluacion(
  capituloId: string,
  evaluacion: {
    puntuacionTotal: number;
    desglose: DesgloseEvaluacion;
    problemaPrincipal: string | null;
    pendientePrincipal: string | null;
    modelo: string | null;
  }
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("capitulo_evaluaciones").upsert(
    {
      capitulo_id: capituloId,
      puntuacion_total: evaluacion.puntuacionTotal,
      desglose: evaluacion.desglose,
      problema_principal: evaluacion.problemaPrincipal,
      pendiente_principal: evaluacion.pendientePrincipal,
      modelo: evaluacion.modelo,
      generado_en: new Date().toISOString(),
    },
    { onConflict: "capitulo_id" }
  );
  if (error) throw error;
}

export async function listAvisosDeCapitulo(capituloId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("capitulo_avisos")
    .select("*")
    .eq("capitulo_id", capituloId)
    .order("created_at");
  if (error) throw error;
  return data;
}

export async function listAvisosDeMunicipio(capituloIds: string[]) {
  const supabase = createServiceClient();
  if (capituloIds.length === 0) return [];
  const { data, error } = await supabase
    .from("capitulo_avisos")
    .select("*")
    .in("capitulo_id", capituloIds)
    .order("created_at");
  if (error) throw error;
  return data;
}

/**
 * Sustituye los avisos SIN RESOLVER generados automáticamente por una
 * generación/regeneración anterior por los nuevos que produce esta pasada —
 * si el técnico ya marcó uno como resuelto, se conserva tal cual (no se
 * reabre solo porque se ha vuelto a generar el capítulo). Un aviso resuelto
 * que ya no aplica (p.ej. el hueco que señalaba ya se rellenó) simplemente
 * deja de generarse en la próxima pasada; no hace falta borrarlo a mano.
 */
export async function reemplazarAvisosAutomaticos(
  capituloId: string,
  avisos: { subepigrafeCodigo: string | null; tipo: AvisoTipo; severidad: AvisoSeveridad; mensaje: string; fuente: string | null }[]
) {
  const supabase = createServiceClient();
  const { error: deleteError } = await supabase
    .from("capitulo_avisos")
    .delete()
    .eq("capitulo_id", capituloId)
    .eq("resuelto", false);
  if (deleteError) throw deleteError;

  if (avisos.length === 0) return;

  const { error: insertError } = await supabase.from("capitulo_avisos").insert(
    avisos.map((a) => ({
      capitulo_id: capituloId,
      subepigrafe_codigo: a.subepigrafeCodigo,
      tipo: a.tipo,
      severidad: a.severidad,
      mensaje: a.mensaje,
      fuente: a.fuente,
    }))
  );
  if (insertError) throw insertError;
}

export async function resolverAviso(avisoId: string, resuelto: boolean) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("capitulo_avisos")
    .update({ resuelto, resuelto_en: resuelto ? new Date().toISOString() : null })
    .eq("id", avisoId);
  if (error) throw error;
}
