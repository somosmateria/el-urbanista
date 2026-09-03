# Sistema de diseño

Identidad visual acordada para esta funcionalidad. Ver `prototipo.html` para la
implementación de referencia — estas reglas están extraídas de ahí.

## Nombre

La aplicación se llama **El Urbanista**.

## Principios

- **Formato web/app**, no documento — interfaz de producto real, no una maqueta de papel.
- **Sin degradados en ningún elemento** — ni de fondo, ni de texto, ni de botones. Todo
  color es sólido. Esto incluye evitar `linear-gradient`, `radial-gradient` y trucos como
  `background-clip: text` con degradado para texto de marca.
- **Colores vibrantes sobre fondo oscuro** — base negra o morada muy oscura, con acentos
  de color saturado (no colores apagados/pastel) para estados y elementos interactivos.
- Tema oscuro como base de toda la interfaz, no un modo alternativo.

## Paleta (valores de referencia usados en el prototipo)

| Uso | Color | Valor |
|---|---|---|
| Fondo base | negro con base morada | `#100C18` |
| Fondo del riel/chrome | negro | `#0B0812` |
| Superficie de tarjeta | morado muy oscuro | `#1B1526` |
| Superficie de tarjeta (hover/activa) | morado oscuro | `#241D33` |
| Borde | morado grisáceo | `#2E2740` |
| Texto principal | blanco cálido | `#F3F0FA` |
| Texto secundario | lila apagado | `#B3A8C9` |
| Texto tenue | lila muy apagado | `#6E6485` |
| **Acento primario** — violeta vibrante | | `#B84BFF` |
| Acento primario, hover | | `#A233F0` |
| Acento primario, texto sobre fondo oscuro del acento | | `#EBD4FF` |
| **Acento secundario / éxito** — cian vibrante | | `#1FEFCB` |
| **Estado "revisar"** — ámbar | | `#FFB020` |
| **Estado alerta/error** — coral | | `#FF5C7A` |

El acento violeta se usa para la acción principal (botones CTA, tarjeta seleccionada,
elemento activo). El cian se reserva para estados de "correcto/disponible". El ámbar y el
coral son semánticos (revisar, alerta) y no deben usarse como decoración.

## Tipografía

Dos familias claramente distintas, no una sola por defecto:

- **Fraunces** (serif) para títulos y para el propio texto del documento generado — le da
  carácter de "documento oficial" al contenido real de los capítulos.
- **IBM Plex Sans** para toda la interfaz (botones, etiquetas, navegación, cuerpo de
  interfaz que no es el documento en sí).
- **IBM Plex Mono** para elementos técnicos: breadcrumbs, etiquetas de estado, notas de
  fuente ("FUENTE — Diagnóstico · Patrimonio histórico · MI.1.7"), metadatos.

## Componentes reutilizables (nombrados como en el prototipo)

- **Tarjeta de selección** (`doc-card`) — usada en Inicio y en "Dentro de avance" para
  elegir tipo de documento / tipo de memoria. Estado normal, estado desactivado
  (opacidad reducida + badge "Próximamente"), estado destacado/seleccionado (borde de
  color de acento + fondo ligeramente teñido).
- **Fila de lista clicable** (`town-row`, filas de tabla `ch`) — usada en el panel de
  municipios y en el semáforo de capítulos.
- **Indicador de estado** (`st`, punto de color) — verde/cian = listo, ámbar = revisar,
  violeta = tu aportación, gris = sin información/no aplica. Siempre acompañado de una
  etiqueta de texto (`ch-tag`), nunca solo el color, para no depender del color como
  único portador de significado.
- **Bloque de documento** (`doc-block`) — el contenedor donde se muestra o edita el texto
  de un capítulo, con su nota de fuente al pie cuando aplica.
- **Resaltado de dato citado** (`mark` dentro de `doc-text`) — para marcar los fragmentos
  que provienen literalmente del diagnóstico dentro de un capítulo 🟡.
- **Panel de historial de versiones** (`hist-panel`) — lista de entradas con etiqueta,
  metadato de fecha/tipo de edición, y enlace de "Restaurar" en las que no son la actual.
- **Barra de herramientas de editor** (`editor-toolbar`) — iconos de formato básico sobre
  el bloque de documento en modo edición.
- **Tabla de datos editable** (`table.data`) — inputs inline por celda, botón de añadir
  fila y botón de añadir columna.

## Qué no es parte de este sistema de diseño

El prototipo HTML incluía, durante su desarrollo, un menú lateral para saltar entre
pantallas al revisarlo. **Ese menú era una herramienta de trabajo del prototipo, no forma
parte del diseño de la aplicación real** y ya se ha retirado del archivo `prototipo.html`
final de esta carpeta. La navegación real de la aplicación es la que ocurre dentro de cada
pantalla: tarjetas en las que se hace clic, filas de tabla clicables, botones "Volver".
