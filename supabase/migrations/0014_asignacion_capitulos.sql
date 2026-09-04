-- Asignación de capítulos como tarea a un miembro del equipo (p.ej. MO.5,
-- que por su propia naturaleza lo tiene que redactar un técnico, o las
-- alternativas concretas de MO.1). Un admin asigna, cualquiera puede ver a
-- quién; sin tabla de perfiles, FK directa a auth.users igual que
-- equipo_miembros (ver 0006_equipos.sql).

alter table capitulos
  add column asignado_a uuid references auth.users(id) on delete set null;

create index capitulos_asignado_a_idx on capitulos(asignado_a);
