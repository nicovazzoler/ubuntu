# Plan 5 — Stack

Con qué se escribe la página.

---

## 1. La decisión

**HTML, CSS y JavaScript a mano.** Sin framework, sin paso de compilación,
sin `npm install`. Se abre `index.html` en el navegador y funciona.

React quedó descartado por decisión tuya, para otro proyecto. Es también la
decisión técnicamente correcta para esta página: es un catálogo de ~30 fotos
con un filtro, y eso son unas 150 líneas de JavaScript. Un framework acá
agrega un paso de compilación y ~50 KB de JS a una página cuyo trabajo es
mostrar imágenes.

## 2. Qué se usa

| | |
|---|---|
| Estructura | HTML5 |
| Estilos | CSS a mano, con variables (`:root`) para los tokens del Plan 4 |
| Lógica | JavaScript moderno, en módulos ES |
| Dependencias | ninguna |
| Build | ninguno |

Sin Tailwind, sin librerías de componentes, sin jQuery. El Plan 4 es 70%
decisiones de CSS: si las resolvés con clases de una librería, aprendés la
librería en vez del CSS.

## 3. Estructura

```
index.html              <- la página entera
estado.html             <- validador de nombres de archivo (Plan 1 §3.3)
assets/
└── marca/
    ├── logo.webp
    └── og.png          <- imagen 1200×630 para compartir (Plan 3 §4)
css/
├── tokens.css          <- variables de color, tipografía y espaciado (Plan 4)
└── estilos.css
js/
├── config.js           <- WhatsApp, Instagram, ID de Drive, mensajes (Plan 3 §5)
├── catalogo.js         <- lee Drive y devuelve la lista de productos
├── whatsapp.js         <- arma los links wa.me
└── ui.js               <- dibuja la grilla y maneja los filtros
```

La clave está en `catalogo.js`: **es el único archivo que sabe que existe
Google Drive.** Devuelve una lista con la forma del contrato del Plan 1 §3.6,
y `ui.js` la dibuja sin preguntar de dónde salió. Si mañana se migra a
Sheets, se reescribe ese archivo y nada más.

Los archivos JS se cargan como módulos (`<script type="module">`), que es lo
que permite separarlos sin necesitar un bundler.

## 4. Dónde se publica

**Cloudflare Pages o Netlify**, plan gratis. Se conectan al repo, y como no
hay nada que compilar, simplemente copian los archivos y publican. Cada push
a la rama actualiza el sitio. HTTPS y dominio propio incluidos.

**Railway no.** Cobra por proceso corriendo; esto son archivos estáticos que
un CDN sirve gratis y más rápido.

## 5. Orden de trabajo

1. Maquetar la página completa con una lista de productos **fija, escrita a
   mano** en un archivo. Sin Drive, sin red, sin nada asincrónico.
2. Aplicar el Plan 4 hasta que se vea bien en un celular de verdad.
3. Recién ahí conectar Drive, reemplazando la lista fija.
4. `estado.html`.
5. Publicar.

Ese orden importa: si conectás Drive el primer día, cada problema de diseño se
mezcla con un problema de red y no sabés cuál estás debuggeando.

## 6. Para cuando quieras React

Este mismo catálogo es un segundo proyecto ideal para aprenderlo, justamente
porque ya vas a conocer el problema: mismo diseño, mismos datos, misma
funcionalidad, resuelto con componentes. Ahí la comparación es directa y
entendés *qué te da* el framework, en vez de aprenderlo sobre un problema que
no conocés.

Toca las cinco cosas que se hacen todo el tiempo en React: componentes y
props, renderizar listas, estado, efectos con datos remotos, y el patrón
cargando / error / datos.

---

## Concepto aparte — módulos ES

Antes, separar el JavaScript en varios archivos significaba o poner un
`<script>` por archivo y rezar que el orden fuera correcto, o usar una
herramienta que los juntara (un bundler, como Webpack o Vite).

Hoy el navegador lo hace solo. Un archivo declara qué expone:

```js
// whatsapp.js
export function linkProducto(nombre) { ... }
```

y otro declara qué necesita:

```js
// ui.js
import { linkProducto } from './whatsapp.js'
```

El navegador resuelve las dependencias y carga los archivos en el orden que
haga falta. Solo hay que marcar el punto de entrada como módulo:

```html
<script type="module" src="js/ui.js"></script>
```

Dos consecuencias prácticas:

- Podés partir el código en archivos chicos sin instalar nada. Es lo que hace
  viable un proyecto sin build.
- Los módulos **no funcionan abriendo el archivo con doble clic**
  (`file://...`): el navegador los bloquea por seguridad. Hay que servir la
  carpeta con un servidor local. Cualquiera sirve —
  `python3 -m http.server`, o la extensión *Live Server* de VS Code.

Ese segundo punto es la sorpresa típica: abrís el `index.html`, la página se
ve pero no carga ningún producto, y la consola dice algo sobre CORS. No está
roto, le falta el servidor.
