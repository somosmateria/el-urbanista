-- Bloques de texto libre: además de tablas, el motor 3 ("tu aportación")
-- ahora también admite párrafos escritos a mano por el técnico, sin pasar
-- por Claude — igual que capitulo_tablas, pero el contenido ya es HTML
-- final (viene del mismo editor enriquecido que "Editar capítulo"), no
-- datos en bruto que haya que redactar. subepigrafe_codigo NULL significa
-- "bloque del capítulo completo" (p.ej. MO.5); con código, pertenece a un
-- subepígrafe de motor "tabla" dentro de un capítulo mixto (p.ej. MO.3.2).

create table capitulo_textos (
  id uuid primary key default gen_random_uuid(),
  capitulo_id uuid not null references capitulos(id) on delete cascade,
  subepigrafe_codigo text,
  titulo text not null,
  contenido_html text not null default '',
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table capitulo_textos enable row level security;

create index capitulo_textos_capitulo_subepigrafe_idx
  on capitulo_textos(capitulo_id, subepigrafe_codigo);

create trigger capitulo_textos_set_updated_at
  before update on capitulo_textos
  for each row execute function set_updated_at();
