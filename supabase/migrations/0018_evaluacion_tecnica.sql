-- Revisión técnica de la Memoria de Ordenación (fase 1) — ver el análisis y
-- diseño completo en el hilo de la sesión que introdujo esto. Objetivo:
-- explicar qué tan sustentado está cada capítulo generado y qué le queda
-- por hacer al técnico, sin tocar cómo se genera el contenido en sí.
--
-- Los avisos (capitulo_avisos) viven en su PROPIA tabla, nunca dentro de
-- contenido_html — así es estructuralmente imposible que un aviso de
-- trabajo interno acabe filtrándose al .docx entregado (ver el bug de
-- MO.3.1.4 arreglado esta misma sesión, causado justo por mezclar una nota
-- interna con el texto oficial de un capítulo).

-- Distingue "el sistema no encontró nada pese a reintentar" (no_localizado)
-- de "falta un dato real" (falta_dato, ya existía) y de "no aplica"
-- (no_aplica, ya existía) — ver docs/06-decisiones-pendientes.md #2.
alter type sin_info_motivo add value 'no_localizado';

create table capitulo_evaluaciones (
  id uuid primary key default gen_random_uuid(),
  capitulo_id uuid not null references capitulos(id) on delete cascade unique,
  puntuacion_total int not null check (puntuacion_total between 0 and 100),
  desglose jsonb not null,
  problema_principal text,
  pendiente_principal text,
  generado_en timestamptz not null default now(),
  modelo text
);

alter table capitulo_evaluaciones enable row level security;

create table capitulo_avisos (
  id uuid primary key default gen_random_uuid(),
  capitulo_id uuid not null references capitulos(id) on delete cascade,
  subepigrafe_codigo text,
  tipo text not null,
  severidad text not null,
  mensaje text not null,
  fuente text,
  resuelto boolean not null default false,
  resuelto_en timestamptz,
  created_at timestamptz not null default now()
);

alter table capitulo_avisos enable row level security;

create index capitulo_avisos_capitulo_idx on capitulo_avisos(capitulo_id, resuelto);

-- mapeo_capitulos.notas existe desde 0002_seed_mapeo_capitulos.sql pero
-- nunca se reflejó en src/lib/supabase/types.ts (MapeoCapituloRow) — se
-- corrige junto con este cambio de esquema para no arrastrar el desajuste.
