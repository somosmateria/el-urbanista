-- Equipos: varios equipos aislados entre sí, cada uno con sus propios
-- municipios. Una persona puede pertenecer a varios equipos (necesita
-- elegir cuál tiene activo — ver el selector de equipo en la app). Solo
-- los admins de un equipo pueden invitar a gente nueva a él.

create type equipo_rol as enum ('admin', 'miembro');

create table equipos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz not null default now()
);
alter table equipos enable row level security;

create table equipo_miembros (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null references equipos(id) on delete cascade,
  -- FK a auth.users, no a una tabla propia — no hay tabla de perfiles.
  user_id uuid not null references auth.users(id) on delete cascade,
  rol equipo_rol not null default 'miembro',
  created_at timestamptz not null default now(),
  unique (equipo_id, user_id)
);
alter table equipo_miembros enable row level security;
create index equipo_miembros_user_id_idx on equipo_miembros(user_id);
create index equipo_miembros_equipo_id_idx on equipo_miembros(equipo_id);

-- Arranque limpio (decisión explícita del usuario): fuera los municipios
-- de prueba antes de exigir equipo_id — cascada ya se encarga de
-- capítulos/versiones/tablas/diagnósticos.
truncate table municipios cascade;

alter table municipios add column equipo_id uuid references equipos(id) on delete cascade;

-- Equipo por defecto para la única cuenta real que existe hoy, como admin,
-- para no dejar a nadie fuera al activar equipos.
insert into equipos (nombre)
values ('Somos Materia');

insert into equipo_miembros (equipo_id, user_id, rol)
select e.id, u.id, 'admin'
from equipos e, auth.users u
where e.nombre = 'Somos Materia';

alter table municipios alter column equipo_id set not null;
create index municipios_equipo_id_idx on municipios(equipo_id);
