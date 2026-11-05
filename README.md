# Ubuntu Estudio

Catálogo web de Ubuntu Estudio: velas, souvenirs y deco artesanal en Morón,
Buenos Aires. No hay carrito: cada producto tiene un botón que abre WhatsApp
con la consulta ya escrita.

**Sitio:** https://ubuntu-estudio.pages.dev

## Cómo funciona

```
Google Drive  ──(cada hora, GitHub Actions)──►  assets/  ──(push a main)──►  Cloudflare Pages
     │                                                                              │
     └──────────────── el navegador consulta Drive por detrás ──────────────────────┘
```

- **Los productos salen de una carpeta pública de Google Drive.** Ubuntu los
  carga desde el celular: cada foto es un producto y cada subcarpeta, una
  categoría.
- **Copia local:** una vez por hora, un workflow de GitHub Actions baja las
  fotos y genera miniaturas webp en `assets/productos/` y la lista en
  `assets/catalogo.json`. Si algo cambió, commitea en `main` y Cloudflare
  publica solo.
- **En el navegador** la página muestra al instante lo último conocido y
  consulta Drive por detrás. Un producto nuevo aparece enseguida, con la foto
  servida desde Drive hasta la copia de la hora siguiente.

Sin framework, sin paso de compilación y sin backend: HTML, CSS y JavaScript
(módulos ES) servidos como archivos estáticos.

## Cargar productos (para Ubuntu)

En la carpeta de Drive, el nombre del archivo es el nombre del producto:

| Archivo | Se ve como |
|---|---|
| `Vela de soja lavanda.jpg` | Vela de soja lavanda, sin precio |
| `Vela de soja lavanda - 4500.jpg` | Con precio $ 4.500 (solo números, sin `$` ni puntos) |
| `01. Set comunión.jpg` | Primero en su categoría y foto de portada |
| `_Borrador.jpg` | No se muestra |

- Una subcarpeta es una categoría. Si empieza con `_`, se oculta entera.
- Una foto suelta en la raíz va a la categoría "Otros".
- Los filtros y los bloques de categorías aparecen recién con 15 productos o más.
- [`estado.html`](https://ubuntu-estudio.pages.dev/estado.html) revisa la
  carpeta y avisa qué archivo tiene un problema: nombre mal escrito, foto muy
  pesada o algo que no es una imagen.

## Correr en local

```bash
python3 -m http.server 8000      # en Windows: py -m http.server 8000
```

Abrir http://localhost:8000. **Tiene que ser el puerto 8000**: la API key solo
acepta pedidos desde `localhost:8000` y desde el sitio publicado.

Para regenerar la copia local a mano (normalmente lo hace Actions):

```bash
npm install --prefix herramientas    # una vez, instala sharp
node herramientas/copia-local.mjs
```

## Estructura

```
index.html                 la página
estado.html                revisión de la carpeta de Drive
_headers                   caché de Cloudflare Pages
css/
  tokens.css               colores, espaciado y ritmo vertical
  estilos.css              componentes
  fuentes.css              tipografías auto-hospedadas
js/
  config.js                WhatsApp, Instagram, mensajes, carpeta y API key
  catalogo.js              lectura de Drive y de la copia local
  ui.js                    arma la página (punto de entrada)
  imagenes.js              respaldo cuando una foto no carga
  visor.js                 foto grande con anterior/siguiente
  whatsapp.js              links wa.me con el mensaje armado
  tonos.js, aparecer.js    tono de fondo por sección y fundido al scrollear
assets/
  catalogo.json            copia local de la lista (la escribe el bot)
  productos/               fotos originales y mini/ en webp (las escribe el bot)
  marca/                   logo, isotipo e imagen para compartir el link
  fuentes/                 woff2
herramientas/
  copia-local.mjs          baja Drive y genera la copia local
.github/workflows/
  copia-local.yml          corre copia-local.mjs cada hora
docs/plan/                 planificación y decisiones de diseño
```

## Ramas

- `main` es lo publicado. El bot `copia-local[bot]` también commitea ahí.
- Se trabaja en `pruebas` y se pasa a `main` con un PR.
- Antes de trabajar, traer lo del bot: `git pull origin main`.

## API key de Google

Está a la vista en `js/config.js` y es a propósito: solo lee una carpeta que
ya es pública. Está restringida a la **Google Drive API** y a los referrers
`http://localhost:8000/*` y `https://ubuntu-estudio.pages.dev/*`. El proyecto
de Google Cloud no tiene facturación.

- Si se agrega un dominio propio, hay que sumarlo a las restricciones de la key.
- Para rotarla: crear la nueva, cambiarla en `config.js`, publicar y recién
  después borrar la vieja.
- El repo es público: credenciales de cuenta de servicio o archivos `.env`
  nunca se commitean (ya están en `.gitignore`).

## Más

- [`docs/plan/`](docs/plan/README.md): por qué se decidió cada cosa (catálogo,
  contenido, redes, diseño, stack, v2).
- [`CLAUDE.md`](CLAUDE.md): reglas para los comentarios en el código.
