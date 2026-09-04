-- Completa MO.3 con las dos entidades que faltaban: "3.4 El contenido
-- urbanístico. Derechos y deberes de la propiedad del suelo rústico"
-- (plantilla verificada palabra por palabra entre Osuna y Lora del Río) y
-- "3.6 El suelo urbano" (marco legal común + una lista de delimitación que
-- SÍ varía por municipio, marcada a revisar en el propio texto generado).
-- Ver src/lib/motores/plantilla/mo3-4.ts y mo3-6.ts.

-- Hueco para 3.4 entre 3.3.1 (orden 7) y 3.5 (orden 8 → pasa a 9).
update mapeo_capitulos set orden = 9 where capitulo_codigo = 'MO.3.5';

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.3.4', 'MO.3', 'El contenido urbanístico. Derechos y deberes de la propiedad del suelo rústico', 'plantilla', null, 8, false,
    '100% plantilla, confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.'),
  ('MO.3.6', 'MO.3', 'El suelo urbano', 'plantilla', null, 10, false,
    'Marco legal común (art. 13 LISTA) en plantilla, pero la lista de criterios concretos de delimitación del suelo urbano varía por municipio (confirmado: Lora del Río cita su propio planeamiento vigente) — el texto generado se marca explícitamente a revisar.');
