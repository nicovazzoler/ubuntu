# Planificación — Ubuntu Estudio

*Hecho a mano, pensado para vos.*
Velas, souvenirs y deco artesanal. Morón, Buenos Aires.

Catálogo web con contacto directo por WhatsApp. Sin precios publicados, sin
carrito, sin backend. **Publicado** en https://ubuntu-estudio.pages.dev.

Esta carpeta guarda por qué se decidió cada cosa. Cómo levantar el proyecto,
la estructura del código y la carga de productos están en el
[README del repo](../../README.md).

## Los planes

| # | Documento | De qué se trata |
|---|---|---|
| 0 | [Preguntas](00-preguntas.md) | Lo que había que definir con el equipo. **Respondido** |
| 1 | [Catálogo](01-catalogo.md) | Productos desde Drive, nombres de archivo, copia local automática |
| 2 | [Contenido](02-contenido.md) | Qué dice la página y en qué orden |
| 3 | [Redes sociales](03-redes-sociales.md) | WhatsApp con mensaje prearmado, Instagram, vista previa del link |
| 4 | [Diseño](04-diseno.md) | Paleta del logo, contraste, tipografía, espaciado, fotos |
| 5 | [Stack](05-stack.md) | HTML, CSS y JS a mano. Sin framework, sin build |
| 6 | [Versión 2](06-v2.md) | Intro animada, escritorio, tonos por sección, visor de fotos |
| 7 | [Versión 3](07-v3.md) | Rediseño oscuro: arcos, naranja de vela, pensado para el celular |

## Datos de la marca

| | |
|---|---|
| Lema | Hecho a mano, pensado para vos |
| WhatsApp | 11 7238-8119 (`5491172388119`) |
| Instagram | `@Ubuntu.Estudio` |
| Zona | Morón, Buenos Aires |
| Logo | `assets/marca/logo.webp` (isotipo transparente: `isotipo.png`) |
| Drive | `1WCDLU_cJfaxKQIlLdzfhsQec2gwo1j-Q` |
| Sitio | https://ubuntu-estudio.pages.dev (se publica desde `main`) |

## Stack

HTML, CSS y JavaScript a mano. Sin framework y sin paso de compilación.

- **Catálogo:** carpeta pública de Google Drive. Cada subcarpeta es una
  categoría: Velas (12), Velas con sticker (4), Comunión (4), Souvenirs (2) y
  Deco (2).
- **Copia local:** GitHub Actions baja Drive cada hora y, si algo cambió,
  commitea las fotos y miniaturas en `main`. La página muestra esa copia al
  instante y consulta Drive por detrás.
- **Hosting:** Cloudflare Pages, plan gratis. Se publica solo con cada commit
  en `main`, también los del bot.

Railway no: cobra por proceso corriendo y esto son archivos estáticos.

## Estado

Hecho:

- [x] Respuestas del equipo, datos de contacto y categorías.
- [x] 24 productos cargados en Drive con el nombre correcto.
- [x] Isotipo con fondo transparente e imagen 1200×630 para la vista previa.
- [x] API key restringida a la Drive API y al dominio, sin facturación.
- [x] Sitio publicado en Cloudflare Pages.
- [x] Copia local automática cada hora.
- [x] Versión 2: escritorio, tonos por sección, visor e intro animada.
- [x] Versión 3: rediseño oscuro a partir de dos referencias de Dribbble.

Pendiente:

- [ ] **Fotos con luz de día.** Es lo que más sube la calidad y no depende del
      código (Plan 4 §10). Las fotos editadas con IA se probaron y se
      descartaron: se siguen usando las originales.
- [ ] **Dominio propio** (`.com.ar` en nic.ar), si lo deciden. Implica
      cambiar la dirección en `index.html` y sumarla a la API key (Plan 3 §6).
