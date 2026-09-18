# Planificación — Catálogo Ubuntu

Velas · Souvenirs · Deco hecho a mano.
Catálogo web con contacto directo por WhatsApp. Sin backend, sin carrito.

## Los planes

| # | Documento | De qué se trata |
|---|---|---|
| 1 | [Catálogo](01-catalogo.md) | De dónde salen los productos y cómo los cargan desde el celular |
| 2 | [Contenido](02-contenido.md) | Qué dice la página y en qué orden |
| 3 | [Redes sociales](03-redes-sociales.md) | WhatsApp con mensaje prearmado, Instagram, previsualización del link |
| 4 | [Diseño](04-diseno.md) | Color, tipografía, espaciado, grilla, estados |

## Stack

HTML, CSS y JavaScript sin frameworks. No hay backend y no hace falta: el
único dato dinámico es la lista de productos, y eso se resuelve leyendo una
carpeta pública de Google Drive desde el navegador.

Sin build step, sin `npm install`. Se abre el `index.html` y funciona.

## Dónde se publica

**Cloudflare Pages o Netlify**, plan gratis. Se conectan al repo de GitHub y
cada push publica solo. HTTPS y dominio propio incluidos.

**No usar Railway acá.** Railway está pensado para procesos que corren
(servidores, bases de datos). Un sitio estático en Railway consume horas de
la suscripción para servir archivos que un CDN sirve gratis y más rápido.
Guardate esa suscripción para cuando haya algo que de verdad necesite un
servidor.

## Orden de trabajo

1. Cerrar los checklists de "qué tiene que estar listo" de cada plan — sobre
   todo el número de WhatsApp y la carpeta de Drive con productos reales.
2. Maquetar con datos de prueba.
3. Conectar Drive.
4. Publicar y probar desde un celular con datos móviles, no con WiFi.
