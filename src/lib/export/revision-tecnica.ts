import "server-only";
import { generarDocxRevisionTecnica, type FilaRevisionParaDocx, type TablaParaDocx } from "@/lib/export/docx";
import { listCapitulosDeMunicipio } from "@/lib/data/municipios";
import { listEvaluacionesDeMunicipio, listAvisosDeMunicipio } from "@/lib/data/evaluacion";
import { listTablasDeMunicipio } from "@/lib/data/tablas";
import { getTitulosReferenciaDeEquipo } from "@/lib/data/plantilla-referencia";
import type { MunicipioRow } from "@/lib/supabase/types";
import type { EquipoActivo } from "@/lib/data/equipos";

/**
 * Reúne los datos de la Revisión técnica de un municipio (puntuaciones,
 * avisos, tablas rellenadas) y los convierte en el .docx de trabajo
 * interno — usado tanto por la descarga individual
 * (/api/municipios/[id]/revision-tecnica) como por el .zip "por capítulos"
 * (/api/municipios/[id]/docx), que lo incluye como un archivo más. Ver
 * generarDocxRevisionTecnica en docx.ts.
 */
export async function generarDocxRevisionTecnicaDeMunicipio(
  municipio: MunicipioRow,
  equipo: EquipoActivo
): Promise<Buffer> {
  const capitulos = await listCapitulosDeMunicipio(municipio.id, equipo.id);
  const capituloIds = capitulos.map((c) => c.id);

  const [evaluaciones, avisos, tablas, titulosReferencia] = await Promise.all([
    listEvaluacionesDeMunicipio(capituloIds),
    listAvisosDeMunicipio(capituloIds),
    listTablasDeMunicipio(capituloIds),
    getTitulosReferenciaDeEquipo(equipo.id),
  ]);

  const evaluacionPorCapitulo = new Map(evaluaciones.map((e) => [e.capitulo_id, e]));
  const avisosPorCapitulo = new Map<string, typeof avisos>();
  for (const aviso of avisos) {
    avisosPorCapitulo.set(aviso.capitulo_id, [...(avisosPorCapitulo.get(aviso.capitulo_id) ?? []), aviso]);
  }
  const capituloPorId = new Map(capitulos.map((c) => [c.id, c]));

  const filas: FilaRevisionParaDocx[] = capitulos.map((capitulo) => {
    const evaluacion = evaluacionPorCapitulo.get(capitulo.id);
    return {
      codigo: capitulo.codigo,
      titulo: titulosReferencia.get(capitulo.codigo) ?? capitulo.titulo,
      evaluacion: evaluacion
        ? {
            puntuacionTotal: evaluacion.puntuacion_total,
            desglose: evaluacion.desglose,
            problemaPrincipal: evaluacion.problema_principal,
            pendientePrincipal: evaluacion.pendiente_principal,
          }
        : null,
      avisos: (avisosPorCapitulo.get(capitulo.id) ?? []).map((a) => ({
        severidad: a.severidad,
        mensaje: a.mensaje,
        fuente: a.fuente,
        resuelto: a.resuelto,
      })),
    };
  });

  const tablasParaDocx: TablaParaDocx[] = tablas.map((tabla) => {
    const capitulo = capituloPorId.get(tabla.capitulo_id);
    return {
      capituloCodigo: capitulo?.codigo ?? "?",
      capituloTitulo: capitulo ? (titulosReferencia.get(capitulo.codigo) ?? capitulo.titulo) : "",
      nombreBloque: tabla.nombre_bloque,
      columnas: tabla.columnas,
      filas: tabla.filas,
    };
  });

  return generarDocxRevisionTecnica(municipio.nombre, filas, tablasParaDocx);
}
