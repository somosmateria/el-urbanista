import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { CapituloEstado, MotorTipo, MunicipioRow } from "@/lib/supabase/types";
import type { EquipoActivo } from "@/lib/data/equipos";
import { tieneAccesoAMunicipio, listMunicipioIdsAccesibles, concederAcceso } from "@/lib/data/municipio-accesos";
import { resolverPlantilla } from "@/lib/motores/plantilla";
import { extraerPlanVigente } from "@/lib/motores/plantilla/mo1";
import { generarCapituloRAG } from "@/lib/motores/rag";
import { getDiagnosticoDeMunicipio } from "@/lib/data/diagnosticos";

export async function listMunicipiosConProgreso(equipo: EquipoActivo) {
  const supabase = createServiceClient();
  const { data: todos, error } = await supabase
    .from("municipios")
    .select("*")
    .eq("equipo_id", equipo.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (todos.length === 0) return [];

  // Un admin ve todos los municipios del equipo; un miembro solo los que
  // tenga concedidos explícitamente — ver src/lib/data/municipio-accesos.ts.
  const accesibles =
    equipo.rol === "admin"
      ? null
      : await listMunicipioIdsAccesibles(
          todos.map((m) => m.id),
          equipo.userId
        );
  const visibles = accesibles ? todos.filter((m) => accesibles.has(m.id)) : todos;
  if (visibles.length === 0) return [];

  const { data: capitulos, error: capError } = await supabase
    .from("capitulos")
    .select("municipio_id, estado, sin_info_motivo")
    .in(
      "municipio_id",
      visibles.map((m) => m.id)
    );
  if (capError) throw capError;

  return visibles.map((municipio) => {
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

/**
 * `equipo` no es opcional: es la frontera de autorización, en dos pasos —
 * primero que el municipio pertenezca al equipo activo (evita que
 * cualquier miembro de CUALQUIER equipo adivine/copie un UUID ajeno) y
 * luego, si quien pregunta no es admin, que tenga acceso concedido a ESE
 * municipio en concreto. Nunca te fíes de un municipioId de la URL o de
 * un formulario sin pasar por aquí.
 */
export async function getMunicipio(id: string, equipo: EquipoActivo) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("municipios")
    .select("*")
    .eq("id", id)
    .eq("equipo_id", equipo.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (!(await tieneAccesoAMunicipio(id, equipo))) return null;
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

/**
 * Igual que `getMunicipio`, pero partiendo de un capituloId — para
 * Server Actions que reciben directamente un capituloId/tablaId (no un
 * municipioId) y necesitan comprobar que pertenece al equipo activo antes
 * de tocar nada. Devuelve el capítulo si (y solo si) su municipio
 * pertenece al equipo y hay acceso a él — ver `getMunicipio`.
 */
export async function verificarCapituloDeEquipo(capituloId: string, equipo: EquipoActivo) {
  const supabase = createServiceClient();
  const { data: capitulo, error } = await supabase
    .from("capitulos")
    .select("*")
    .eq("id", capituloId)
    .maybeSingle();
  if (error) throw error;
  if (!capitulo) return null;

  const municipio = await getMunicipio(capitulo.municipio_id, equipo);
  return municipio ? capitulo : null;
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

export async function crearMunicipio(
  input: {
    nombre: string;
    planVigente?: string | null;
    fechaPlanVigente?: string | null;
  },
  equipo: EquipoActivo
) {
  const supabase = createServiceClient();
  const { data: municipio, error } = await supabase
    .from("municipios")
    .insert({
      equipo_id: equipo.id,
      nombre: input.nombre,
      plan_vigente: input.planVigente ?? null,
      fecha_plan_vigente: input.fechaPlanVigente ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;

  // Quien lo crea tiene acceso a lo que acaba de crear — para un admin es
  // redundante (siempre ve todo), pero para un miembro es lo que evita
  // que se quede sin ver su propio municipio nada más crearlo.
  await concederAcceso(municipio.id, equipo.userId);

  return municipio;
}

export async function actualizarMunicipio(
  id: string,
  equipo: EquipoActivo,
  input: { nombre: string; planVigente?: string | null; fechaPlanVigente?: string | null }
) {
  if (!(await getMunicipio(id, equipo))) throw new Error("Municipio no encontrado.");
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("municipios")
    .update({
      nombre: input.nombre,
      plan_vigente: input.planVigente ?? null,
      fecha_plan_vigente: input.fechaPlanVigente ?? null,
    })
    .eq("id", id)
    .eq("equipo_id", equipo.id);
  if (error) throw error;
}

export async function eliminarMunicipio(id: string, equipo: EquipoActivo) {
  if (!(await getMunicipio(id, equipo))) throw new Error("Municipio no encontrado.");
  const supabase = createServiceClient();

  // El borrado del municipio arrastra en cascada (FK on delete cascade)
  // capítulos, versiones, tablas, diagnósticos y accesos — pero no los PDF
  // en Storage, que hay que borrar aparte.
  const { data: archivos } = await supabase.storage.from("diagnosticos").list(id);
  if (archivos && archivos.length > 0) {
    await supabase.storage.from("diagnosticos").remove(archivos.map((a) => `${id}/${a.name}`));
  }

  const { error } = await supabase.from("municipios").delete().eq("id", id).eq("equipo_id", equipo.id);
  if (error) throw error;
}

/**
 * Si al municipio le faltan plan_vigente/fecha_plan_vigente (los datos que
 * MO.1 necesita) y ya hay diagnóstico, intenta rellenarlos extrayéndolos
 * de él y los persiste — así quedan visibles y corregibles en "Editar
 * municipio" en vez de vivir solo dentro de la generación de MO.1. Nunca
 * pisa un valor que el técnico ya haya escrito a mano.
 */
export async function asegurarPlanVigente(
  municipio: MunicipioRow,
  diagnosticoId: string | null
): Promise<MunicipioRow> {
  if (municipio.plan_vigente && municipio.fecha_plan_vigente) return municipio;
  if (!diagnosticoId) return municipio;

  const extraido = await extraerPlanVigente(diagnosticoId);
  if (!extraido) return municipio;

  const supabase = createServiceClient();
  const { data: actualizado, error } = await supabase
    .from("municipios")
    .update({ plan_vigente: extraido.planVigente, fecha_plan_vigente: extraido.fechaPlanVigente })
    .eq("id", municipio.id)
    .select("*")
    .single();
  if (error) throw error;
  return actualizado;
}

export async function generarCapitulosIniciales(municipioId: string, equipo: EquipoActivo) {
  const supabase = createServiceClient();

  const { data: yaExisten, error: existenError } = await supabase
    .from("capitulos")
    .select("id")
    .eq("municipio_id", municipioId)
    .limit(1);
  if (existenError) throw existenError;
  if (yaExisten.length > 0) return;

  let municipio = await getMunicipio(municipioId, equipo);
  if (!municipio) throw new Error("Municipio no encontrado");

  const diagnostico = await getDiagnosticoDeMunicipio(municipioId);
  const diagnosticoId = diagnostico?.estado === "listo" ? diagnostico.id : null;
  municipio = await asegurarPlanVigente(municipio, diagnosticoId);

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
        // ya verificado del diagnóstico (ver src/lib/motores/rag). Un
        // capítulo mixto como MO.3 puede tener también subepígrafes de
        // motor "plantilla" que no necesitan diagnóstico — por eso se
        // llama igual aunque diagnosticoId sea null.
        const contenido = await generarCapituloRAG(entrada.capitulo_codigo, diagnosticoId, municipio, equipo.id);

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
      const { contenido, necesitaRevision } = await resolverPlantilla(
        entrada.capitulo_codigo,
        municipio,
        diagnosticoId,
        equipo.id
      );

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
