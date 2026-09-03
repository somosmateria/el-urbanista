-- El Urbanista — Memoria de Ordenación
-- Esquema inicial. Ver docs/02-arquitectura-motores.md y docs/04-edicion-y-tablas.md.
--
-- Nota de seguridad: RLS está activado en todas las tablas y, a propósito, no se
-- definen políticas todavía. Sin políticas, solo la service_role (usada exclusivamente
-- en el servidor Next.js) puede leer/escribir — el navegador nunca habla directo con
-- estas tablas. Cuando se añada Auth real (fase 10 del plan), la autorización se sigue
-- resolviendo en el servidor (Server Actions) validando la sesión, no exponiendo estas
-- tablas al cliente vía anon key + políticas RLS.

create extension if not exists pgcrypto;

create type motor_tipo as enum ('plantilla', 'rag', 'tabla');
create type capitulo_estado as enum ('listo', 'revisar', 'tu_aportacion', 'sin_info');
create type sin_info_motivo as enum ('falta_dato', 'no_aplica');
create type diagnostico_estado as enum ('procesando', 'listo', 'error');
create type version_tipo as enum ('generacion_automatica', 'edicion_manual');

-- municipios ------------------------------------------------------------

create table municipios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  plan_vigente text,
  fecha_plan_vigente date,
  created_at timestamptz not null default now()
);

alter table municipios enable row level security;

-- diagnósticos ------------------------------------------------------------

create table diagnosticos (
  id uuid primary key default gen_random_uuid(),
  municipio_id uuid not null references municipios(id) on delete cascade,
  storage_path text not null,
  nombre_archivo text,
  estado diagnostico_estado not null default 'procesando',
  error_mensaje text,
  created_at timestamptz not null default now()
);

alter table diagnosticos enable row level security;

create index diagnosticos_municipio_id_idx on diagnosticos(municipio_id);

-- diagnóstico_secciones — salida del parser, una fila por epígrafe/subepígrafe ----

create table diagnostico_secciones (
  id uuid primary key default gen_random_uuid(),
  diagnostico_id uuid not null references diagnosticos(id) on delete cascade,
  codigo text not null, -- p.ej. "MI.1.7"
  titulo text,
  texto text not null,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  unique (diagnostico_id, codigo)
);

alter table diagnostico_secciones enable row level security;

create index diagnostico_secciones_diagnostico_id_idx on diagnostico_secciones(diagnostico_id);

-- mapeo_capitulos — capítulo/subepígrafe → motor → sección origen, editable -------

create table mapeo_capitulos (
  id uuid primary key default gen_random_uuid(),
  capitulo_codigo text not null unique, -- p.ej. "MO.6.1.1" o "MO.1"
  capitulo_padre text, -- p.ej. "MO.6" en filas de subepígrafe; null en las de nivel capítulo
  titulo_canonico text not null,
  motor motor_tipo not null,
  seccion_diagnostico_codigo text, -- p.ej. "MI.1.7"; null si motor es plantilla/tabla
  orden int not null default 0,
  opcional boolean not null default false,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table mapeo_capitulos enable row level security;

-- capítulos — uno por MO.1..MO.12 y municipio --------------------------------

create table capitulos (
  id uuid primary key default gen_random_uuid(),
  municipio_id uuid not null references municipios(id) on delete cascade,
  codigo text not null, -- "MO.1".."MO.12"
  titulo text not null,
  motor motor_tipo not null,
  estado capitulo_estado not null default 'tu_aportacion',
  sin_info_motivo sin_info_motivo,
  contenido_html text,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (municipio_id, codigo)
);

alter table capitulos enable row level security;

create index capitulos_municipio_id_idx on capitulos(municipio_id);

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger capitulos_set_updated_at
  before update on capitulos
  for each row execute function set_updated_at();

-- historial de versiones de capítulo — append-only, nunca se sobrescribe ------

create table capitulo_versiones (
  id uuid primary key default gen_random_uuid(),
  capitulo_id uuid not null references capitulos(id) on delete cascade,
  contenido_html text not null,
  tipo version_tipo not null,
  created_at timestamptz not null default now()
);

alter table capitulo_versiones enable row level security;

create index capitulo_versiones_capitulo_id_idx on capitulo_versiones(capitulo_id);

-- tablas editables de capítulos de propuesta técnica (motor tabla) -----------

create table capitulo_tablas (
  id uuid primary key default gen_random_uuid(),
  capitulo_id uuid not null references capitulos(id) on delete cascade,
  nombre_bloque text not null, -- p.ej. "Áreas recreativas propuestas"
  columnas jsonb not null default '[]'::jsonb, -- ["Código","Nombre","Superficie (m²)",...]
  filas jsonb not null default '[]'::jsonb, -- [{"Código":"14","Nombre":"Pinaleja Adelfa",...}]
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table capitulo_tablas enable row level security;

create index capitulo_tablas_capitulo_id_idx on capitulo_tablas(capitulo_id);

create trigger capitulo_tablas_set_updated_at
  before update on capitulo_tablas
  for each row execute function set_updated_at();

create table capitulo_tablas_versiones (
  id uuid primary key default gen_random_uuid(),
  capitulo_tabla_id uuid not null references capitulo_tablas(id) on delete cascade,
  columnas jsonb not null,
  filas jsonb not null,
  tipo version_tipo not null,
  created_at timestamptz not null default now()
);

alter table capitulo_tablas_versiones enable row level security;

create index capitulo_tablas_versiones_tabla_id_idx on capitulo_tablas_versiones(capitulo_tabla_id);
