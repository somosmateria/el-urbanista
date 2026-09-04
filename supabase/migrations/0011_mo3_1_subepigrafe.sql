-- Antes de MO.3.1.1-MO.3.1.4 falta la entidad "3.1 El suelo rústico.
-- Categorías y zonas" en sí (el encabezado del marco legal común, art. 14
-- LISTA) — sin ella la lista saltaba directo a "3.1.1". Motor "plantilla":
-- generarMO3_1() en src/lib/motores/plantilla/mo3-1.ts, verificado palabra
-- por palabra contra Osuna y Lora del Río (test-data/).

insert into mapeo_capitulos
  (capitulo_codigo, capitulo_padre, titulo_canonico, motor, seccion_diagnostico_codigo, orden, opcional, notas)
values
  ('MO.3.1', 'MO.3', 'El suelo rústico. Categorías y zonas', 'plantilla', null, 0, false,
    '100% plantilla (art. 14 LISTA), confirmado idéntico entre Osuna y Lora del Río salvo el nombre del municipio.');
