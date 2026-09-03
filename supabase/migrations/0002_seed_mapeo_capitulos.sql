-- Mapeo capítulo/subepígrafe → motor → sección de origen del diagnóstico.
-- Ver docs/01-analisis-diagnostico-a-ordenacion.md y docs/02-arquitectura-motores.md.
-- Tabla pensada para editarse a mano (vía SQL Editor de Supabase por ahora — ver
-- decisión pendiente #1 en docs/06-decisiones-pendientes.md), no para hardcodear
-- este mapeo en el código de la aplicación.

alter table mapeo_capitulos
  add column notas text;

comment on column mapeo_capitulos.notas is
  'Contexto humano sobre la fuente cuando el diagnóstico no da un código de sección '
  'exacto todavía (ver decisión pendiente #3), o aclaración sobre un motor mixto.';

-- 12 capítulos, nivel superior --------------------------------------------

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.1', null, 'Procedencia/oportunidad del PGOM y alternativas', 'plantilla', null, 1, false, null),
  ('MO.2', null, 'Criterios y objetivos del modelo', 'plantilla', null, 2, false,
    'Banco de objetivos reutilizable por temática + ajuste con síntesis del diagnóstico (MI.6, MI.7, MI.8). Motor mixto plantilla/dato — ver decisión pendiente #3 antes de automatizar el ajuste fino.'),
  ('MO.3', null, 'Clasificación del suelo', 'rag', null, 3, false,
    'Capítulo compuesto — ver subepígrafes MO.3.*. El motor de nivel de capítulo es orientativo.'),
  ('MO.4', null, 'Regulación de usos en suelo rústico/urbano', 'plantilla', 'MI.1.9', 4, false, null),
  ('MO.5', null, 'Sistemas generales: espacios libres, equipamientos, movilidad, redes', 'tabla', null, 5, false, null),
  ('MO.6', null, 'Protección del patrimonio cultural, ambiental y paisaje', 'rag', null, 6, false,
    'Capítulo compuesto — ver subepígrafes MO.6.*. El motor de nivel de capítulo es orientativo.'),
  ('MO.7', null, 'Urbanismo inclusivo: accesibilidad, diversidad, género, seguridad', 'plantilla', 'MI.7.1', 7, false, null),
  ('MO.8', null, 'Programación y estudios económicos', 'plantilla', 'MI.2', 8, false,
    'Motor mixto: marco conceptual en plantilla + tabla de programación económica aportada por el técnico/consultora. La tabla de este capítulo se añade cuando se implemente su motor asistido (fuera del alcance de la v1 inicial).'),
  ('MO.9', null, 'Contenido de las normas urbanísticas', 'plantilla', null, 9, false,
    '100% plantilla, sin variables de municipio.'),
  ('MO.10', null, 'Planificación estratégica del modelo', 'plantilla', 'MI.6', 10, false, null),
  ('MO.11', null, 'Compatibilización con municipios colindantes', 'plantilla', 'MI.1.1', 11, false, null),
  ('MO.12', null, 'Diseño del informe de seguimiento de ejecución', 'plantilla', null, 12, true,
    'Opcional/fusionable: en Lora del Río este contenido va dentro de MO.11 en vez de como capítulo aparte. Es una decisión editorial válida, no una ausencia de información.');

-- MO.3 — subepígrafes (ver detalle en docs/01-analisis-diagnostico-a-ordenacion.md) --

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.3.1.1', 'MO.3', 'Suelo especialmente protegido por legislación sectorial (ZEC, ZEPA, vías pecuarias, patrimonio)', 'rag', 'MI.4', 1, false, null),
  ('MO.3.1.2', 'MO.3', 'Suelo preservado por riesgos (inundación, etc.)', 'rag', null, 2, false,
    'Fuente: apartado de riesgos hidrológicos del diagnóstico. Sin código de sección exacto todavía — rango general MI.1.9–MI.1.12. Precisar antes de automatizar (decisión pendiente #3).'),
  ('MO.3.1.3', 'MO.3', 'Suelo preservado por ordenación territorial (POTA, PEMF)', 'rag', null, 3, false,
    'Fuente: apartado de planificación territorial del diagnóstico. Sin código de sección exacto todavía — precisar (decisión pendiente #3).'),
  ('MO.3.1.4', 'MO.3', 'Suelo rústico común', 'plantilla', null, 4, false,
    'Categoría "resto": casi no depende de datos del diagnóstico.'),
  ('MO.3.2', 'MO.3', 'Sistemas generales en suelo rústico', 'tabla', null, 5, false,
    'Propuesta de diseño del técnico, no viene del diagnóstico.'),
  ('MO.3.3', 'MO.3', 'Infraestructura verde (marco conceptual)', 'plantilla', null, 6, false,
    'Teoría general, igual en todos los municipios.'),
  ('MO.3.3.1', 'MO.3', 'Infraestructura verde aplicada al municipio', 'tabla', null, 7, false,
    'Propuesta con apoyo de datos: combina el inventario ambiental del diagnóstico (MI.4) con una propuesta de diseño del técnico.'),
  ('MO.3.5', 'MO.3', 'Edificaciones irregulares en suelo rústico', 'rag', null, 8, false,
    'Fuente: catálogo de agrupaciones de edificaciones del diagnóstico. Sin código de sección exacto todavía — precisar (decisión pendiente #3).');

-- MO.6 — subepígrafes ------------------------------------------------------

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.6.1.1', 'MO.6', 'Bienes con protección singular (BIC)', 'rag', 'MI.1.7', 1, false,
    'Catálogo de patrimonio histórico: se reutiliza la ficha completa (código, tipo, descripción) casi sin cambios.'),
  ('MO.6.1.2', 'MO.6', 'Niveles de protección', 'rag', 'MI.1.7', 2, false,
    'Mitad plantilla (la escala de niveles es fija), mitad dato (los bienes concretos de cada nivel salen del catálogo de MI.1.7).'),
  ('MO.6.1.3', 'MO.6', 'Bienes sin protección singular en suelo rústico', 'rag', 'MI.4.4', 3, false,
    'Igual que 6.1.1 pero para el patrimonio "menor" (yacimientos no BIC).'),
  ('MO.6.2', 'MO.6', 'Condiciones de protección ambiental, hidrológica, de fauna/flora, paisaje y bienes demaniales', 'plantilla', null, 4, false,
    'Agrupa 5 apartados (6.2.1–6.2.5) de redacción reguladora genérica, prácticamente igual entre municipios.');
