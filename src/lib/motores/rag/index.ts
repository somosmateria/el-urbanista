import { getSubepigrafes } from "@/lib/data/mapeo";
import { buscarSeccionConReintento } from "@/lib/data/diagnosticos";
import { listTablasDeCapitulo } from "@/lib/data/tablas";
import { listTextosDeCapitulo } from "@/lib/data/textos";
import { sinPrefijoMI } from "@/lib/diagnostico/parser";
import { getAnthropicClient, MODELO_GENERACION } from "@/lib/anthropic";
import { resolverPlantilla } from "@/lib/motores/plantilla";
import { generarCapituloTabla } from "@/lib/motores/tabla";
import type { MapeoCapituloRow, MunicipioRow } from "@/lib/supabase/types";

const SYSTEM_PROMPT = `Eres el motor de "RAG dirigido" de El Urbanista, una herramienta de
redacción de Memorias de Ordenación urbanística (Avance PGOM/PBOM) para un estudio de
urbanismo español.

Tu única función en este motor es reformatear y expandir levemente un fragmento YA
VERIFICADO del Diagnóstico del municipio, adaptándolo al registro y estructura de un
capítulo de Memoria de Ordenación. No es una búsqueda libre: el fragmento que recibes ES
la fuente correcta para este subepígrafe, ya seleccionada de antemano.

Reglas estrictas:
- No añadas ningún dato (cifra, nombre, código, fecha) que no esté literalmente en el
  fragmento del diagnóstico que se te da. Cero invención, cero relleno genérico.
- Envuelve en <mark>...</mark> cada dato citado del diagnóstico que sea clave para el
  subepígrafe (nombres propios, códigos, cifras, superficies, denominaciones oficiales).
  No marques la prosa de transición, solo el dato en sí.
- Devuelve exclusivamente HTML con párrafos <p>...</p> (uno o varios). Nada de markdown,
  nada de encabezados, nada de comentarios, nada de texto antes o después de los <p>.
- Registro: español técnico-administrativo, en tercera persona, como el resto de la
  Memoria de Ordenación. No dirijas la palabra al lector ni menciones que eres una IA.
- Si el fragmento no trae suficiente información para el subepígrafe, redacta con lo que
  hay — no completes con conocimiento general de urbanismo que no esté en el fragmento.`;

function buildUserPrompt(
  tituloSubepigrafe: string,
  secciones: { titulo: string; texto: string }[]
) {
  const fragmentos = secciones
    .map(
      (s, i) => `Fragmento ${i + 1} — sección "${s.titulo}":
"""
${s.texto}
"""`
    )
    .join("\n\n");

  return `Subepígrafe de la Memoria de Ordenación: "${tituloSubepigrafe}"

${secciones.length > 1 ? "Fragmentos del Diagnóstico" : "Fragmento del Diagnóstico"}, fuente(s)
verificada(s) para este subepígrafe:

${fragmentos}

Redacta el contenido de este subepígrafe a partir únicamente de ${secciones.length > 1 ? "esos fragmentos, combinándolos" : "ese fragmento"}.`;
}

/**
 * Sinónimos/palabras clave para el reintento de `buscarSeccionConReintento`
 * cuando el código exacto de `seccion_diagnostico_codigo` no aparece tal
 * cual en el diagnóstico (ver el aviso en `parser.ts` sobre números de
 * nivel superior que a veces quedan separados del título en la
 * maquetación del PDF). Curado a mano por tema, no autogenerado — un panel
 * de administración para esto es deliberadamente excesivo para lo que hace
 * falta hoy (ver docs/02-arquitectura-motores.md, "el mapeo debe ser
 * editable, no fijo en el código" habla del mapeo capítulo→sección, no de
 * estos sinónimos de apoyo). Se completa con las palabras del propio
 * título del subepígrafe, así que un código sin entrada aquí igualmente
 * se beneficia del reintento.
 */
const SINONIMOS_POR_TEMA: Record<string, string[]> = {
  patrimonio: [
    "BIC",
    "patrimonio",
    "Catálogo General",
    "CGPHA",
    "IAPH",
    "bienes protegidos",
    "catálogo",
    "protección integral",
    "protección estructural",
    "yacimientos",
    "patrimonio arqueológico",
  ],
  montes: ["monte público", "utilidad pública", "Catálogo de Montes"],
  "vías pecuarias": ["vía pecuaria", "cañada", "cordel", "vereda", "colada"],
  renpa: ["RENPA", "espacio natural protegido", "ZEC", "ZEPA", "Red Natura"],
};

function sinonimosParaSubepigrafe(subepigrafe: MapeoCapituloRow): string[] {
  const delTitulo = subepigrafe.titulo_canonico
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((palabra) => palabra.length >= 5);

  const delTema = Object.entries(SINONIMOS_POR_TEMA)
    .filter(([tema]) => subepigrafe.titulo_canonico.toLowerCase().includes(tema) || (subepigrafe.notas ?? "").toLowerCase().includes(tema))
    .flatMap(([, sinonimos]) => sinonimos);

  return [...new Set([...delTema, ...delTitulo])];
}

/**
 * `seccion_diagnostico_codigo` admite varios códigos separados por comas
 * cuando un subepígrafe de la Memoria agrupa temas que en el Diagnóstico
 * están repartidos en varias secciones (p.ej. MO.3.1.1 combina RENPA,
 * montes públicos, vías pecuarias y patrimonio — cuatro secciones
 * distintas del Diagnóstico, MI.4.1 a MI.4.4).
 */
async function generarBloqueSubepigrafe(
  subepigrafe: MapeoCapituloRow,
  diagnosticoId: string
): Promise<string | null> {
  if (!subepigrafe.seccion_diagnostico_codigo) return null;

  const codigos = subepigrafe.seccion_diagnostico_codigo
    .split(",")
    .map((c) => sinPrefijoMI(c.trim()))
    .filter(Boolean);

  // Primero el código exacto (rápido, sin ambigüedad); solo si eso falla se
  // reintenta por palabras clave sobre todo el diagnóstico — ver
  // buscarSeccionConReintento y docs/06-decisiones-pendientes.md #2.
  const { secciones, motivo } = await buscarSeccionConReintento(
    diagnosticoId,
    codigos,
    sinonimosParaSubepigrafe(subepigrafe)
  );

  if (motivo !== "encontrado") return null; // no encontrado o insuficiente: no se fabrica contenido

  const anthropic = getAnthropicClient();
  const respuesta = await anthropic.messages.create({
    model: MODELO_GENERACION,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(
          subepigrafe.titulo_canonico,
          secciones.map((s) => ({ titulo: s.titulo ?? s.codigo, texto: s.texto }))
        ),
      },
    ],
  });

  const textoGenerado = respuesta.content
    .filter((bloque) => bloque.type === "text")
    .map((bloque) => bloque.text)
    .join("\n")
    .trim();

  if (!textoGenerado) return null;

  const numeroSubepigrafe = subepigrafe.capitulo_codigo.replace(/^MO\./, "");
  const fuentes = secciones.map((s) => `${s.titulo ?? ""} · MI.${s.codigo}`).join(" · ");
  return `
<div class="doc-eyebrow">${numeroSubepigrafe} · ${subepigrafe.titulo_canonico.toUpperCase()}</div>
<div class="doc-text">${textoGenerado}</div>
<div class="src-note">FUENTE — Diagnóstico · ${fuentes}</div>
`.trim();
}

/**
 * Bloque de aviso para un subepígrafe que no se pudo generar — antes se
 * omitía sin más (título incluido), y ese hueco pasaba desapercibido hasta
 * comparar el .docx a mano (ver detectarSubepigrafesFaltantes en
 * motores/evaluacion). Ahora el título se conserva (id de ancla para poder
 * enlazarlo desde la cabecera del capítulo, ver la página del capítulo) y
 * se marca con una clase propia — `limpiarParaExportar`/`pintarEnRojo` en
 * src/lib/export/docx.ts la pintan en azul, distinta del rojo de "esto hay
 * que confirmarlo" (`<mark>`/capítulo en revisar): aquí no hay nada que
 * confirmar, es contenido que falta por completo.
 */
function bloquePendiente(subepigrafe: MapeoCapituloRow): string {
  const numero = subepigrafe.capitulo_codigo.replace(/^MO\./, "");
  return `
<div class="doc-eyebrow-pendiente" id="pendiente-${subepigrafe.capitulo_codigo}">${numero} · ${subepigrafe.titulo_canonico.toUpperCase()}</div>
<div class="nota-pendiente">PENDIENTE DE COMPLETAR POR EL TÉCNICO</div>
`.trim();
}

/**
 * Motor 2 — RAG dirigido. Genera el contenido de un capítulo compuesto por
 * subepígrafes (hoy: MO.3 y MO.6), en el orden configurado en
 * mapeo_capitulos. Cada subepígrafe se resuelve según su propio motor:
 * "rag" vuelca el fragmento del diagnóstico ya mapeado; "plantilla" busca
 * un generador en el registro de `motores/plantilla` (mismo mecanismo que
 * los capítulos plantilla de nivel superior, solo que aquí se indexa por
 * código de subepígrafe, p.ej. "MO.3.1.4"); "tabla" reutiliza el motor 3
 * tal cual, pero acotado a las `capitulo_tablas` de ese subepígrafe
 * concreto (`subepigrafe_codigo`), no a las del capítulo entero — solo
 * disponible cuando ya existe un `capituloId` real (en la generación
 * inicial el capítulo todavía no tiene fila propia, así que sus
 * subepígrafes de tabla se omiten sin más: no hay tablas que mostrar
 * todavía). Un subepígrafe sin generador, "rag" cuya sección no se
 * encuentra en el diagnóstico, o "tabla" sin ninguna fila rellenada, no
 * bloquea el resto ni se rellena con texto inventado — pero SÍ deja su
 * título con un aviso de pendiente en vez de desaparecer del todo (ver
 * bloquePendiente arriba y docs/02-arquitectura-motores.md).
 *
 * Devuelve null solo si NINGÚN subepígrafe pudo generarse (el capítulo se
 * queda en "sin_info", igual que antes) — con al menos uno generado, el
 * capítulo sí se crea, y los que faltan se marcan como pendientes dentro de
 * él en vez de quedar en "sin_info" sin más pista de qué falta.
 */
export async function generarCapituloRAG(
  capituloCodigo: string,
  diagnosticoId: string | null,
  municipio: MunicipioRow,
  equipoId: string,
  capituloId?: string
): Promise<string | null> {
  const subepigrafes = await getSubepigrafes(capituloCodigo);

  const bloques = await Promise.all(
    subepigrafes.map(async (s) => {
      if (s.motor === "rag") return diagnosticoId ? generarBloqueSubepigrafe(s, diagnosticoId) : null;
      if (s.motor === "plantilla") {
        const { contenido } = await resolverPlantilla(s.capitulo_codigo, municipio, diagnosticoId, equipoId);
        return contenido;
      }
      if (s.motor === "tabla") {
        if (!capituloId) return null;
        const [tablas, textos] = await Promise.all([
          listTablasDeCapitulo(capituloId, s.capitulo_codigo),
          listTextosDeCapitulo(capituloId, s.capitulo_codigo),
        ]);
        return generarCapituloTabla(tablas, textos);
      }
      return null;
    })
  );

  if (bloques.every((b) => b === null)) return null;

  return bloques.map((b, i) => b ?? bloquePendiente(subepigrafes[i])).join("\n\n");
}
