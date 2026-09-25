# Plan 4 — Diseño

Sistema visual de la página: color, tipografía, espaciado, jerarquía y
comportamiento responsive.

> Actualizado: la paleta sale del logo (`assets/marca/logo.webp`), y las
> tarjetas de producto ya no muestran precio.

---

## 1. Principio rector

**El producto es la foto. El diseño desaparece.**

En un catálogo artesanal, cualquier cosa que compita visualmente con la
imagen del producto está de más: fondos con textura, bordes gruesos, sombras
marcadas, colores saturados. El rol del diseño acá es ser un marco neutro y
consistente que haga que 12 fotos sacadas con distinta luz parezcan la misma
marca.

El logo ya define ese tono: line art fino, crema, mucho aire. La página tiene
que sentirse igual.

## 2. Color

Los tres colores salen directo del archivo del logo:

| | Hex | De dónde |
|---|---|---|
| Crema | `#FCF8F7` | fondo del logo |
| Taupe | `#7F756D` | trazo del dibujo y tipografía "UBUNTU" |
| Salvia | `#CCCEC2` | la mancha verde detrás de la vela |

### 2.1 El problema del taupe

El taupe del logo **no alcanza para texto**. Sobre el crema da un contraste
de **4.27:1**, y el mínimo para texto normal es 4.5:1. Se lee bien en el logo
porque ahí las letras son enormes; en un párrafo de 16px cansa la vista y no
pasa accesibilidad.

Esto pasa siempre que se dice "usemos los colores del logo": el logo es
decorativo, el texto es funcional, y necesitan contrastes distintos.

La solución no es cambiar la marca, es **derivar**: mismo tono, más oscuro.
El resultado se sigue sintiendo Ubuntu, pero se lee.

### 2.2 Tokens

| Token | Valor | Contraste sobre crema | Uso |
|---|---|---|---|
| `--crema` | `#FCF8F7` | — | Fondo de la página |
| `--superficie` | `#FFFFFF` | — | Tarjetas de producto |
| `--tinta` | `#4A423B` | 9.3:1 ✅ | Texto principal |
| `--tinta-suave` | `#6E645B` | 5.5:1 ✅ | Texto secundario, pie |
| `--taupe` | `#7F756D` | 4.3:1 ⚠️ | **Solo** títulos grandes (≥24px), íconos, bordes |
| `--salvia` | `#CCCEC2` | 1.2:1 ❌ | **Solo** fondos y detalles. Nunca texto |
| `--borde` | `#E8E0DA` | — | Divisores y bordes de tarjeta, 1px |
| `--accion` | `#5A5049` | 7.4:1 ✅ | Fondo de botón primario, con texto crema |
| `--accion-hover` | `#423A34` | — | Hover / pressed |
| `--wsp` | `#25D366` | — | Solo botones de WhatsApp |

Reglas:

- **No hay color de acento.** La marca es monocromática cálida: el contraste
  lo hace el peso y el tamaño, no el color. Meter un terracota o un dorado
  "para que resalte" rompe el tono del logo.
- El verde de WhatsApp es la única excepción, porque es un color que la gente
  reconoce sin leer.
- El salvia se usa en **superficies grandes**: la franja de envíos, el bloque
  de "contanos tu idea", el chip de categoría activo. Nunca en tipografía.
- Modo oscuro: **no va en el v1.** Duplica el trabajo de tokens y las fotos de
  producto sobre fondo oscuro se ven peor.

## 3. Tipografía

El logo usa una serif clásica en mayúsculas con mucho espacio entre letras.
Eso se replica:

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Cormorant Garamond** | Lema del hero, títulos de sección |
| Texto | **Inter** | Todo lo demás, incluidos nombres de producto |

Cormorant es la Google Font que más se acerca al logo. Los títulos de sección
van en **mayúsculas con `letter-spacing` de ~0.18em**, igual que "UBUNTU" y
"estudio" en el logo. Ese tracking es la firma visual de la marca y sale
gratis.

El hero es la excepción: "Hecho a mano, pensado para vos" va en caja normal,
no en mayúsculas. Un lema de 30 caracteres en mayúsculas espaciadas ocupa
tres renglones en un celular y se vuelve difícil de leer.

### Escala

Base `1rem = 16px`. Los títulos usan tamaño fluido para no saltar entre
breakpoints.

| Nivel | Tamaño | Fuente | Peso | Interlineado |
|---|---|---|---|---|
| Lema (h1) | 2rem → 3.25rem | Cormorant | 500 | 1.15 |
| Sección (h2) | 1.125rem → 1.375rem | Cormorant, mayúsculas, tracking 0.18em | 500 | 1.2 |
| Producto (h3) | 1rem | Inter | 500 | 1.3 |
| Cuerpo | 1rem | Inter | 400 | 1.6 |
| Chico (pie, franja) | 0.875rem | Inter | 400 | 1.5 |

- Nunca texto de cuerpo por debajo de 16px en móvil: iOS hace zoom solo.
- Ancho de línea máximo **65 caracteres** en párrafos.
- Dos familias, dos pesos cada una. Nada más.

## 4. Espaciado

Escala de 4px. Todos los márgenes y paddings salen de acá:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

| Dónde | Móvil | Escritorio |
|---|---|---|
| Margen lateral de la página | 16px | auto, ancho máximo 1200px |
| Separación entre secciones | 48px | 96px |
| Separación título → contenido | 24px | 32px |
| Padding interno de tarjeta | 12px | 16px |
| Gap de la grilla | 12px | 24px |

El error más frecuente: poner el mismo espacio entre todo. **El espacio
arriba de un título tiene que ser claramente mayor que el de abajo**, o el
título parece pertenecer al bloque anterior.

Esta marca pide **más aire del que parece necesario**. El logo tiene el
dibujo flotando en medio de un campo de crema vacío; si la página apretuja
los bloques, deja de parecerse a sí misma.

## 5. Grilla del catálogo

| Ancho de pantalla | Columnas |
|---|---|
| < 768px | 2 |
| 768–1100px | 3 |
| > 1100px | 4 |

**Dos columnas en el celular, no una.** Con una columna hay que scrollear
media hora para ver 15 productos.

La grilla es fluida: columnas de ancho mínimo fijo que se acomodan solas, en
vez de tres breakpoints escritos a mano.

### 5.1 Tarjeta de producto

Sin precio, la tarjeta tiene tres cosas:

1. **Imagen**, relación de aspecto fija 1:1, recortada al centro.
2. **Nombre** del producto (máx. 2 renglones, con puntos suspensivos si se pasa).
3. **Botón de consulta** de WhatsApp.

Cuando un producto sí tiene precio en el nombre del archivo (Plan 1 §3.2), se
muestra entre el nombre y el botón, en `--tinta`, peso 600. La tarjeta tiene
que verse bien con y sin esa línea: si el precio cambia la altura, la grilla
queda dentada. Se resuelve reservando el lugar o alineando el botón abajo.

Detalles que importan:

- **La relación de aspecto se reserva antes de que cargue la imagen.** Si no,
  la página salta mientras cargan las fotos y el usuario toca lo que no
  quería. Es el problema más visible de un catálogo con imágenes remotas.
- Recorte cuadrado forzado: las fotos van a venir en formatos distintos.
- Mientras carga, el hueco va en crema, no en gris.
- `loading="lazy"` en todas las imágenes salvo las primeras 4.
- Bordes redondeados suaves (8–12px) y borde de 1px en vez de sombra.
- Toda la tarjeta es tocable, no solo el botón.

### 5.2 Filtros de categoría

Pendiente de si van a existir (Plan 2 §5). Si hay menos de ~15 productos, no
se muestran.

Si van: fila de chips arriba de la grilla, `Todos · Velas · Souvenirs · Deco`.
En móvil scrollean horizontalmente. El activo lleva fondo `--accion` con texto
crema; los inactivos, borde de 1px y `--tinta-suave`.

## 6. Botones

| Tipo | Aspecto | Uso |
|---|---|---|
| Primario | Fondo `--accion`, texto crema | "Ver catálogo" |
| Secundario | Transparente, borde 1px `--taupe` | Acciones alternativas |
| WhatsApp | Fondo `--wsp` + ícono | Consulta de producto, cierre, flotante |

- Altura mínima **44px** (48 en el flotante).
- Estados obligatorios: normal, hover, **focus visible**, pressed.
- Transiciones de 150ms. Nada de animaciones de entrada por scroll: en una
  grilla de productos marean.

## 7. Estados de la página

Hay que diseñar los tres, no solo el feliz:

- **Cargando**: esqueletos en crema con la forma de la tarjeta, misma cantidad
  que columnas × 2. No un spinner centrado.
- **Vacío**: texto corto y botón "Ver todo".
- **Error** (Drive no responde y no hay cache): mensaje breve + botón de
  WhatsApp. Nunca una pantalla en blanco: si no se puede mostrar el catálogo,
  al menos que puedan escribir.

## 8. Accesibilidad — mínimos no negociables

- Toda imagen con `alt` = nombre del producto.
- Un solo `<h1>`, secciones en `<h2>`, productos en `<h3>`. Sin saltos.
- Navegable con teclado, con foco visible.
- El color nunca es la única señal (el chip activo también cambia peso).
- Respetar los contrastes de la tabla de §2.2. El taupe y el salvia son las
  dos trampas.

## 9. Performance

En este proyecto, performance **es** diseño: el catálogo son fotos y se abre
desde un celular con datos móviles.

- Imágenes servidas ya redimensionadas al ancho que se muestra (Plan 1),
  nunca la foto original del celular.
- Dos fuentes, dos pesos cada una, con `font-display: swap`.
- Sin librerías de UI ni frameworks CSS.
- Objetivo: **primera pantalla usable en menos de 2s en 4G**.

## 10. Qué falta

- [x] Logo (`assets/marca/logo.webp`) y paleta derivada.
- [ ] Versión del logo en PNG con fondo transparente, para el encabezado. El
      archivo actual tiene el fondo crema pegado, así que solo sirve si el
      encabezado va exactamente de ese color.
- [ ] Versión horizontal del logo (dibujo al lado del texto), para el
      encabezado en escritorio. La vertical ocupa demasiado alto.
- [ ] Referencias visuales: quedó en que las buscamos nosotros.
