-- MO.3.2 pasa de motor "tabla" (100% manual, nunca redactaba nada — el
-- informe comparativo lo marcó a 0%) a "plantilla": el marco legal (art.
-- 14 LISTA, tipos de sistema lineal/no lineal) es idéntico entre Osuna y
-- Lora del Río. La lista real de sistemas generales del municipio (con
-- nombre propio: EDAR, parques, equipamientos…) sí es específica de cada
-- uno y se mueve a un subepígrafe nuevo, MO.3.2.1, que se queda en tabla —
-- mismo patrón que ya existe entre 3.3 (plantilla) y 3.3.1 (tabla).
-- Ver src/lib/motores/plantilla/mo3-2.ts.

update mapeo_capitulos set motor = 'plantilla' where capitulo_codigo = 'MO.3.2';

update mapeo_capitulos set orden = orden + 1 where capitulo_padre = 'MO.3' and orden >= 6;

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.3.2.1', 'MO.3', 'Sistemas generales identificados en el municipio', 'tabla', null, 6, false,
    'Propuesta de diseño del técnico (infraestructurales, equipamientos, espacios libres, con nombre propio) — no viene del diagnóstico. Antes vivía junto al marco legal en MO.3.2; separado en la migración 0016.');
