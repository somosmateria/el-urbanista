-- MO.5 era motor "tabla" entero (100% manual, sin ningún generador) desde
-- el seed inicial — el informe comparativo contra un Avance real (Lora
-- del Río, sept. 2026) lo marcó a 0% de cobertura. Pasa a motor "rag"
-- (capítulo compuesto, como MO.3 y MO.6) con subepígrafes reales: el
-- marco conceptual de cada bloque (5.1, 5.2, 5.2.2, 5.3, 5.4) se genera
-- con plantilla verificada contra Osuna y Lora del Río; la propuesta
-- concreta de cada municipio (áreas recreativas, parques, viario,
-- equipamientos, redes con datos reales) se queda en tabla, mejor
-- organizada que como un único bloque manual.
-- Ver src/lib/motores/plantilla/mo5-*.ts.

update mapeo_capitulos set motor = 'rag' where capitulo_codigo = 'MO.5';

-- capitulos.motor es una copia tomada al crear el municipio, no se resuelve
-- en vivo contra mapeo_capitulos (a diferencia del motor de un
-- subepígrafe) — hay que ponerla al día a mano para los municipios que ya
-- existían. Solo se toca si nadie ha tocado ya manualmente su MO.5 (sin
-- contenido, sin tablas ni textos propios) — si alguien ya empezó a
-- rellenarlo a mano, se deja tal cual para no perder su trabajo.
update capitulos set motor = 'rag', estado = 'sin_info', sin_info_motivo = 'falta_dato'
where codigo = 'MO.5'
  and contenido_html is null
  and not exists (select 1 from capitulo_tablas where capitulo_id = capitulos.id)
  and not exists (select 1 from capitulo_textos where capitulo_id = capitulos.id);

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.5.1', 'MO.5', 'La infraestructura verde urbana. El sistema de espacios libres', 'plantilla', null, 1, false,
    'Incluye la intro general de MO.5 completo, que en el documento real precede a 5.1 sin epígrafe propio. Confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio y una cifra de estándar (9,18 m2/hab. para "256.800 habitantes") que aparecía igual en ambos documentos pese a no corresponder a la población de ninguno de los dos — se ha excluido en vez de replicar un error conocido.'),
  ('MO.5.1.1', 'MO.5', 'Las áreas recreativas', 'tabla', null, 2, false,
    'Propuesta de diseño del técnico (código, nombre, superficie, clasificación del suelo, existente/propuesto) — no viene del diagnóstico.'),
  ('MO.5.1.2', 'MO.5', 'Los parques urbanos', 'tabla', null, 3, false,
    'Propuesta de diseño del técnico — no viene del diagnóstico.'),
  ('MO.5.2', 'MO.5', 'Las infraestructuras de comunicaciones y la movilidad sostenible', 'plantilla', null, 4, false,
    'Confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.'),
  ('MO.5.2.1', 'MO.5', 'El sistema viario', 'tabla', null, 5, false,
    'El documento fuente mezcla criterios generales con la relación real de carreteras del municipio en el mismo apartado — no se ha podido separar con fiabilidad, se deja entero como propuesta del técnico.'),
  ('MO.5.2.2', 'MO.5', 'La red básica para la implementación de modos de transporte no motorizados', 'plantilla', null, 6, false,
    'Confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.'),
  ('MO.5.3', 'MO.5', 'El sistema de equipamientos comunitarios', 'plantilla', null, 7, false,
    'Marco conceptual y directrices, confirmado idéntico entre Osuna y Lora del Río.'),
  ('MO.5.3.1', 'MO.5', 'Equipamientos comunitarios identificados en el municipio', 'tabla', null, 8, false,
    'Propuesta de diseño del técnico (código, nombre, superficie, existente/propuesto) — no viene del diagnóstico.'),
  ('MO.5.4', 'MO.5', 'Las redes y espacios técnicos de infraestructuras para el desarrollo sostenible', 'plantilla', null, 9, false,
    'Marco conceptual, confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.'),
  ('MO.5.4.1', 'MO.5', 'Propuestas para el ciclo integral del agua', 'tabla', null, 10, false,
    'Estado actual y propuesta concretos del municipio — no viene del diagnóstico con un código de sección fiable todavía.'),
  ('MO.5.4.2', 'MO.5', 'Red eléctrica', 'tabla', null, 11, false, 'Estado actual y propuesta concretos del municipio.'),
  ('MO.5.4.3', 'MO.5', 'Eficiencia para las instalaciones de alumbrado público', 'tabla', null, 12, false, 'Estado actual y propuesta concretos del municipio.'),
  ('MO.5.4.4', 'MO.5', 'Redes de telecomunicaciones', 'tabla', null, 13, false, 'Estado actual y propuesta concretos del municipio.'),
  ('MO.5.4.5', 'MO.5', 'Residuos sólidos urbanos', 'tabla', null, 14, false, 'Estado actual y propuesta concretos del municipio.');
