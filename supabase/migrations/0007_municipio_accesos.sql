-- Acceso por municipio: dentro de un mismo equipo, un admin puede dar
-- acceso a un miembro a unos municipios sí y a otros no (por defecto un
-- miembro nuevo no ve ninguno hasta que se le conceda). Los admins del
-- equipo siempre ven todos los municipios del equipo — esta tabla solo
-- entra en juego para el rol "miembro" (ver src/lib/data/municipio-accesos.ts).

create table municipio_accesos (
  id uuid primary key default gen_random_uuid(),
  municipio_id uuid not null references municipios(id) on delete cascade,
  -- FK a auth.users, no a equipo_miembros: si alguien sale del equipo y
  -- vuelve a entrar, no hace falta volver a concederle acceso a mano.
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (municipio_id, user_id)
);
alter table municipio_accesos enable row level security;
create index municipio_accesos_municipio_id_idx on municipio_accesos(municipio_id);
create index municipio_accesos_user_id_idx on municipio_accesos(user_id);
