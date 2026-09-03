-- Permite que una tabla (motor 3) pertenezca a un subepígrafe concreto de
-- un capítulo de motor mixto (p.ej. MO.3.2 o MO.3.3.1 dentro de MO.3), en
-- vez de al capítulo completo como hasta ahora (MO.5). NULL sigue
-- significando "tabla de capítulo completo" — no cambia nada para los
-- capítulos de motor "tabla" puro que ya existían (MO.5).

alter table capitulo_tablas
  add column subepigrafe_codigo text;

-- Antes, "un bloque de tabla por capítulo" bastaba para numerar el orden
-- de aparición; ahora hay que numerar por separado dentro de cada
-- subepígrafe (dos subepígrafes del mismo capítulo pueden tener cada uno
-- su primer bloque en orden 0).
drop index if exists capitulo_tablas_capitulo_id_idx;
create index capitulo_tablas_capitulo_subepigrafe_idx
  on capitulo_tablas(capitulo_id, subepigrafe_codigo);
