-- Mismo hueco que tenía MO.3 antes de la migración 0011: falta la entidad
-- "6.1 Propuesta para la protección de patrimonio arqueológico y
-- arquitectónico" en sí, antes de 6.1.1-6.1.3. Motor "plantilla":
-- generarMO6_1() en src/lib/motores/plantilla/mo6-1.ts — a diferencia de
-- MO.3.1, este NO está confirmado idéntico entre Osuna y Lora del Río (cada
-- Avance lo redacta con sus propias palabras), así que va como banco de
-- referencia, no como plantilla cerrada.

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.6.1', 'MO.6', 'Propuesta para la protección de patrimonio arqueológico y arquitectónico', 'plantilla', null, 0, false,
    'Banco de referencia (redacción de Osuna) — el fondo legal es común pero cada Avance lo reescribe con sus propias palabras, confirma que encaja con el resto del capítulo antes de cerrarlo.');
