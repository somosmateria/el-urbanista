-- Avance de referencia por equipo: un admin sube un Avance real que su
-- propio equipo redactó, y los capítulos "plantilla" que hoy usan un
-- banco de texto fijo (extraído a mano de un único ejemplo, igual para
-- todos los equipos — ver src/lib/motores/plantilla/mo2.ts) pasan a
-- basarse en ESE documento en su lugar. Uno por equipo, sustituible
-- (se vuelve a subir cuando haga falta, no se acumulan versiones).
--
-- MO.1 y MO.11 quedan fuera a propósito: no son banco de texto fijo, sino
-- generadores que ya extraen datos reales del diagnóstico de cada
-- municipio (plan vigente, municipios colindantes) — sustituirlos por
-- texto de otro documento sería peor, no mejor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plantillas-referencia', 'plantillas-referencia', false, 52428800, array['application/pdf'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Sin políticas de storage.objects, igual que el bucket de diagnósticos
-- (0003_diagnosticos_bucket.sql): la subida usa una signed upload URL
-- generada con la service role, no acceso directo del cliente.

create table equipo_plantilla_referencia (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null unique references equipos(id) on delete cascade,
  storage_path text not null,
  nombre_archivo text,
  estado diagnostico_estado not null default 'procesando',
  error_mensaje text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table equipo_plantilla_referencia enable row level security;

create trigger equipo_plantilla_referencia_set_updated_at
  before update on equipo_plantilla_referencia
  for each row execute function set_updated_at();

create table equipo_plantilla_secciones (
  id uuid primary key default gen_random_uuid(),
  referencia_id uuid not null references equipo_plantilla_referencia(id) on delete cascade,
  capitulo_codigo text not null,
  titulo text,
  texto_html text not null,
  created_at timestamptz not null default now(),
  unique (referencia_id, capitulo_codigo)
);
alter table equipo_plantilla_secciones enable row level security;
create index equipo_plantilla_secciones_referencia_idx on equipo_plantilla_secciones(referencia_id);
