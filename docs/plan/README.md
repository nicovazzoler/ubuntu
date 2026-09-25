# Planificación — Ubuntu estudio

*Hecho a mano, pensado para vos.*
Velas, souvenirs y deco artesanal. Morón, Buenos Aires.

Catálogo web con contacto directo por WhatsApp. Sin precios publicados, sin
carrito, sin backend.

## Los planes

| # | Documento | De qué se trata |
|---|---|---|
| 0 | [Preguntas](00-preguntas.md) | Lo que había que definir. **Respondido**, salvo categorías |
| 1 | [Catálogo](01-catalogo.md) | De dónde salen los productos y cómo se cargan desde el celular |
| 2 | [Contenido](02-contenido.md) | Qué dice la página y en qué orden |
| 3 | [Redes sociales](03-redes-sociales.md) | WhatsApp con mensaje prearmado, Instagram, previsualización del link |
| 4 | [Diseño](04-diseno.md) | Paleta del logo, tipografía, espaciado, grilla |
| 5 | [Stack](05-stack.md) | React + Vite, y por qué no Angular |

## Datos de la marca

| | |
|---|---|
| Lema | Hecho a mano, pensado para vos |
| WhatsApp | 11 7238-8119 (`5491172388119`) |
| Instagram | `@Ubuntu.estudio` |
| Zona | Morón, Buenos Aires · envíos a todo el país |
| Logo | `assets/marca/logo.webp` |
| Drive | `1WCDLU_cJfaxKQIlLdzfhsQec2gwo1j-Q` |

## Stack

React + Vite en JavaScript. CSS a mano, sin librerías de UI. El catálogo sale
de una carpeta pública de Google Drive leída desde el navegador: no hay
backend y no hace falta.

Se publica en Cloudflare Pages o Netlify, plan gratis. **Railway no**: cobra
por proceso corriendo y esto son archivos estáticos.

## Qué falta para arrancar

1. **Fotos de productos en el Drive**, renombradas (Plan 1 §3.2).
2. **Categorías** — se definen cuando se vea cuántos productos hay de cada
   cosa. Con menos de ~15 productos, arrancamos sin filtros.
3. Logo en PNG con fondo transparente y una versión horizontal (Plan 4 §10).
4. Imagen 1200×630 para la previsualización del link (Plan 3 §4).

Nada de eso frena el paso 1 del Plan 5: maquetar con productos de mentira.
