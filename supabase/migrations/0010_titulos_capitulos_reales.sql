-- Los 12 títulos de capítulo de nivel superior venían de una redacción propia,
-- resumida, hecha al montar el mapeo inicial (ver 0002_seed_mapeo_capitulos.sql).
-- Un Avance real (Osuna) numera sus 12 capítulos 1:1 con los nuestros y trae el
-- título literal de cada uno — se sustituyen aquí por ese título real
-- (genérico, sin el nombre del municipio), para que sea el mismo que produciría
-- calcarlo de un Avance de referencia.

update mapeo_capitulos set titulo_canonico = 'Procedencia de la formulación del PGOM y las alternativas de ordenación consideradas' where capitulo_codigo = 'MO.1';
update mapeo_capitulos set titulo_canonico = 'Los criterios y objetivos que se proponen para la definición del modelo de ordenación adoptado' where capitulo_codigo = 'MO.2';
update mapeo_capitulos set titulo_canonico = 'La propuesta de clasificación del suelo. La delimitación del suelo rústico y del suelo urbano' where capitulo_codigo = 'MO.3';
update mapeo_capitulos set titulo_canonico = 'Regulación de los usos' where capitulo_codigo = 'MO.4';
update mapeo_capitulos set titulo_canonico = 'Esquema de los elementos estructurantes y del futuro desarrollo urbano. Los sistemas generales' where capitulo_codigo = 'MO.5';
update mapeo_capitulos set titulo_canonico = 'Directrices para la protección del patrimonio cultural, medio ambiente, de los recursos naturales y del paisaje' where capitulo_codigo = 'MO.6';
update mapeo_capitulos set titulo_canonico = 'Directrices para un urbanismo inclusivo: accesibilidad, diversidad, género, seguridad y uso equitativo del suelo' where capitulo_codigo = 'MO.7';
update mapeo_capitulos set titulo_canonico = 'De la programación y los estudios económicos del plan' where capitulo_codigo = 'MO.8';
update mapeo_capitulos set titulo_canonico = 'El contenido de las normas urbanísticas' where capitulo_codigo = 'MO.9';
update mapeo_capitulos set titulo_canonico = 'Planificación estratégica de la evolución del modelo general de ordenación' where capitulo_codigo = 'MO.10';
update mapeo_capitulos set titulo_canonico = 'Compatibilización de la propuesta con la ordenación urbanística de los municipios colindantes' where capitulo_codigo = 'MO.11';
update mapeo_capitulos set titulo_canonico = 'Diseño preliminar del informe de seguimiento de la ejecución urbanística: estructura y contenidos clave' where capitulo_codigo = 'MO.12';

-- Backfill de municipios ya creados: solo toca capitulos.titulo cuando todavía
-- vale el título genérico antiguo (no pisa un título ya calcado de un Avance de
-- referencia de equipo, que es distinto y correcto).
update capitulos set titulo = 'De la procedencia de la formulación del PGOM y las alternativas de ordenación consideradas' where codigo = 'MO.1' and titulo = 'Procedencia/oportunidad del PGOM y alternativas';
update capitulos set titulo = 'Los criterios y objetivos que se proponen para la definición del modelo de ordenación adoptado' where codigo = 'MO.2' and titulo = 'Criterios y objetivos del modelo';
update capitulos set titulo = 'La propuesta de clasificación del suelo. La delimitación del suelo rústico y del suelo urbano' where codigo = 'MO.3' and titulo = 'Clasificación del suelo';
update capitulos set titulo = 'Regulación de los usos' where codigo = 'MO.4' and titulo = 'Regulación de usos en suelo rústico/urbano';
update capitulos set titulo = 'Esquema de los elementos estructurantes y del futuro desarrollo urbano. Los sistemas generales' where codigo = 'MO.5' and titulo = 'Sistemas generales: espacios libres, equipamientos, movilidad, redes';
update capitulos set titulo = 'Directrices para la protección del patrimonio cultural, medio ambiente, de los recursos naturales y del paisaje' where codigo = 'MO.6' and titulo = 'Protección del patrimonio cultural, ambiental y paisaje';
update capitulos set titulo = 'Directrices para un urbanismo inclusivo: accesibilidad, diversidad, género, seguridad y uso equitativo del suelo' where codigo = 'MO.7' and titulo = 'Urbanismo inclusivo: accesibilidad, diversidad, género, seguridad';
update capitulos set titulo = 'De la programación y los estudios económicos del plan' where codigo = 'MO.8' and titulo = 'Programación y estudios económicos';
update capitulos set titulo = 'El contenido de las normas urbanísticas' where codigo = 'MO.9' and titulo = 'Contenido de las normas urbanísticas';
update capitulos set titulo = 'Planificación estratégica de la evolución del modelo general de ordenación' where codigo = 'MO.10' and titulo = 'Planificación estratégica del modelo';
update capitulos set titulo = 'Compatibilización de la propuesta con la ordenación urbanística de los municipios colindantes' where codigo = 'MO.11' and titulo = 'Compatibilización con municipios colindantes';
update capitulos set titulo = 'Diseño preliminar del informe de seguimiento de la ejecución urbanística: estructura y contenidos clave' where codigo = 'MO.12' and titulo = 'Diseño del informe de seguimiento de ejecución';
