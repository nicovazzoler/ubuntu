# Plan 4 — Diseño

Sistema visual de la página: color, tipografía, espaciado, jerarquía y
comportamiento responsive.

---

## 1. Principio rector

**El producto es la foto. El diseño desaparece.**

En un catálogo artesanal, cualquier cosa que compita visualmente con la
imagen del producto está de más: fondos con textura, bordes gruesos,
sombras marcadas, colores saturados. El rol del diseño acá es ser un marco
neutro y consistente que haga que 12 fotos sacadas con distinta luz parezcan
la misma marca.

## 2. Color

Paleta cálida y desaturada, que es el código visual del rubro (vela de soja,
yeso, madera, lino). Propuesta, para ajustar cuando definan identidad:

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#FAF7F2` | Fondo de la página. Crema, no blanco puro |
| `--superficie` | `#FFFFFF` | Tarjetas de producto |
| `--texto` | `#2B2622` | Texto principal. Marrón muy oscuro, no negro |
| `--texto-suave` | `#6F6660` | Texto secundario, categorías, FAQ |
| `--borde` | `#E8E0D6` | Divisores y bordes de tarjeta, 1px |
| `--acento` | `#B4654A` | Terracota. Botones, links, precio |
| `--acento-oscuro` | `#8F4E37` | Hover / pressed del acento |
| `--wsp` | `#25D366` | Solo el botón de WhatsApp, verde oficial |

Reglas:

- **Un solo acento.** El terracota se usa para lo que se toca y para el
  precio. Nada más. En cuanto hay dos colores de acento, deja de haber
  jerarquía.
- El verde de WhatsApp es la única excepción, porque es un color que la gente
  reconoce sin leer.
- **Contraste mínimo 4.5:1** entre texto y su fondo. Terracota sobre crema
  pasa; terracota sobre blanco para texto chico hay que verificarlo.
- Modo oscuro: **no va en el v1.** Duplica el trabajo de tokens y las fotos
  de productos sobre fondo oscuro se ven peor.

## 3. Tipografía

Dos familias, no más:

| Rol | Fuente | Uso |
|---|---|---|
| Display | Una serif (ej. *Fraunces*, *Playfair Display*) | Nombre de la marca, titular del hero, títulos de sección |
| Texto | Una sans neutra (ej. *Inter*, *Work Sans*) | Todo lo demás, incluidos nombres de producto y precios |

La serif aporta el tono artesanal; la sans mantiene legible lo funcional. Al
revés (todo serif) se vuelve ilegible en el celular.

### Escala

Basada en `1rem = 16px`. Los títulos usan tamaño fluido para no saltar entre
breakpoints.

| Nivel | Tamaño | Peso | Interlineado |
|---|---|---|---|
| Hero (h1) | 2rem → 3.5rem | 600 | 1.1 |
| Sección (h2) | 1.5rem → 2rem | 600 | 1.2 |
| Producto (h3) | 1rem | 500 | 1.3 |
| Cuerpo | 1rem | 400 | 1.6 |
| Precio | 1.125rem | 600 | 1.2 |
| Chico (categoría, pie) | 0.875rem | 400 | 1.5 |

- Nunca texto de cuerpo por debajo de 16px en móvil: iOS hace zoom solo.
- Ancho de línea máximo **65 caracteres** en párrafos. Un texto que cruza
  toda una pantalla de escritorio no se lee.

## 4. Espaciado

Escala de 4px. Todos los márgenes y paddings salen de acá:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

Uso típico:

| Dónde | Móvil | Escritorio |
|---|---|---|
| Margen lateral de la página | 16px | auto, con ancho máximo 1200px |
| Separación entre secciones | 48px | 96px |
| Separación título → contenido | 24px | 32px |
| Padding interno de tarjeta | 12px | 16px |
| Gap de la grilla | 12px | 24px |

El error más frecuente: poner el mismo espacio entre todo. **El espacio
arriba de un título tiene que ser claramente mayor que el de abajo**, o el
título parece pertenecer al bloque anterior.

## 5. Grilla del catálogo

| Ancho de pantalla | Columnas |
|---|---|
| < 480px | 2 |
| 480–768px | 2 |
| 768–1100px | 3 |
| > 1100px | 4 |

**Dos columnas en el celular, no una.** Con una columna hay que scrollear
media hora para ver 15 productos. Con dos, se ve el catálogo como catálogo.

La grilla es fluida: columnas de ancho mínimo fijo que se acomodan solas, en
vez de tres breakpoints escritos a mano.

### Tarjeta de producto

Contenido, en orden:

1. Imagen, **relación de aspecto fija 1:1**, recortada al centro.
2. Nombre del producto (máx. 2 renglones, con puntos suspensivos si se pasa).
3. Precio, en color acento.
4. Botón de WhatsApp.

Detalles:

- **La relación de aspecto se reserva antes de que cargue la imagen.** Si no,
  la página salta mientras cargan las fotos y el usuario toca lo que no
  quería. Es el problema más visible de un catálogo con imágenes remotas.
- Recorte cuadrado forzado: las fotos van a venir en formatos distintos y sin
  eso la grilla queda dentada.
- Fondo neutro visible mientras carga la imagen (no gris azulado; crema).
- `loading="lazy"` en todas las imágenes salvo las primeras 4.
- Bordes redondeados suaves (8–12px) y borde de 1px en vez de sombra.
- Toda la tarjeta es tocable, no solo el botón.

### Filtros de categoría

Fila de "chips" horizontal arriba de la grilla: `Todos · Velas · Souvenirs ·
Deco`. En móvil scrollean horizontalmente. El activo se marca con fondo
acento. Si hay una sola categoría, la fila no se muestra.

## 6. Botones

| Tipo | Aspecto | Uso |
|---|---|---|
| Primario | Fondo acento, texto crema | "Ver catálogo", CTA del hero |
| Secundario | Fondo transparente, borde 1px acento | Acciones alternativas |
| WhatsApp | Fondo verde WhatsApp + ícono | Consultar producto, botón flotante |

- Altura mínima **44px** (48 en el flotante). Es el mínimo tocable con el
  pulgar.
- Estados obligatorios: normal, hover, **focus visible** (un contorno claro:
  hace falta para teclado y lectores de pantalla), pressed.
- Sin transiciones largas. 150ms, y nada de animaciones de entrada por scroll:
  en una grilla de productos marean.

## 7. Estados de la página

Hay que diseñar los tres, no solo el feliz:

- **Cargando**: esqueletos grises con la forma de la tarjeta, misma cantidad
  que columnas × 2. No un spinner centrado.
- **Vacío** (categoría sin productos): un texto corto y un botón "Ver todo".
- **Error** (Drive no responde y no hay cache): mensaje breve + botón de
  WhatsApp. Nunca una pantalla en blanco: si no se puede mostrar el catálogo,
  al menos que puedan escribir.

## 8. Accesibilidad — mínimos no negociables

- Toda imagen con `alt` = nombre del producto.
- Jerarquía real de encabezados: un solo `<h1>`, secciones en `<h2>`,
  productos en `<h3>`. Sin saltos.
- Navegable con teclado, con foco visible.
- El color nunca es la única señal (el filtro activo también cambia peso o
  lleva un ícono).

## 9. Performance

En este proyecto, performance **es** diseño: el catálogo son fotos y se abre
desde un celular con datos móviles.

- Imágenes servidas ya redimensionadas al ancho que se muestra (Plan 1),
  nunca la foto original del celular.
- Como máximo dos fuentes, dos pesos cada una, con `font-display: swap`.
- Sin librerías de UI, sin frameworks CSS, sin jQuery. HTML + CSS + JS a mano.
- Objetivo: **primera pantalla usable en menos de 2s en 4G**.

## 10. Qué tiene que estar listo antes de codear

- [ ] ¿Hay logo? ¿Hay colores de marca ya usados en Instagram? Si sí, la
      paleta de arriba se ajusta a esos.
- [ ] Elegir las dos fuentes.
- [ ] Confirmar recorte cuadrado de las fotos (afecta cómo sacan las fotos de
      los productos de acá en adelante).
