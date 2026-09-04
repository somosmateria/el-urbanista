-- Invitar a un equipo ya no da acceso de inmediato: queda pendiente hasta
-- que la persona invitada la acepta (o la rechaza) desde la propia app —
-- ver src/lib/data/equipos.ts (invitarAEquipo/aceptarInvitacion) y el aviso
-- que se le muestra al entrar (src/components/InvitacionBanner.tsx).

create type invitacion_estado as enum ('pendiente', 'aceptada', 'rechazada');

create table equipo_invitaciones (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null references equipos(id) on delete cascade,
  email text not null,
  invitado_por uuid references auth.users(id) on delete set null,
  estado invitacion_estado not null default 'pendiente',
  created_at timestamptz not null default now(),
  resuelta_at timestamptz,
  unique (equipo_id, email)
);
alter table equipo_invitaciones enable row level security;
create index equipo_invitaciones_email_idx on equipo_invitaciones (lower(email));
