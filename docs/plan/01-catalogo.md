# Plan 1 — Catálogo

Cómo se cargan, se editan y se muestran los productos, sin backend y
manejable desde el celular por alguien que no programa.

---

## 1. El problema real

No es "mostrar productos". Es que **la persona que fabrica las velas pueda
subir una foto y poner un precio desde el celular, en 30 segundos, sin
llamarte a vos**. Todo lo demás es secundario.

Cada opción se mide con tres preguntas:

1. ¿Cuántos pasos son *agregar un producto nuevo* desde el celu?
2. ¿Cuántos pasos son *cambiar un precio*?
3. Si lo hacen mal, ¿se rompe la página o solo se ve feo?

## 2. Opciones evaluadas

| Opción | Agregar producto | Cambiar precio | Costo | Contra |
|---|---|---|---|---|
| **A. Carpeta de Drive, el precio va en el nombre del archivo** | subir foto + renombrar | renombrar | $0 | sin descripción ni stock, se rompe con typos |
| B. Google Sheets + fotos en Drive | subir foto, copiar link, pegar ID en la fila, escribir nombre y precio | editar celda | $0 | agregar producto desde el celu es tedioso |
| C. Airtable / NocoDB | subir foto dentro del registro | editar campo | $0 hasta cierto uso | otra cuenta más, API key expuesta, plan gratis cambia |
| D. Decap / Tina CMS (git-based) | login GitHub, formulario | formulario | $0 | tus amigos tienen que tener cuenta de GitHub. Descartado |
| E. `catalogo.json` a mano en el repo | te lo piden a vos | te lo piden a vos | $0 | dependen de vos para siempre. Descartado |

## 3. Decisión

**Opción A para el v1.** Una carpeta de Google Drive compartida, donde el
nombre del archivo es el nombre del producto y el precio.

Subir un producto = subir la foto y renombrarla. Un paso. Nada más se
acerca a eso desde un celular.

**Opción B queda documentada como migración**, para cuando hagan falta
descripción, stock, orden manual o categorías que no sean carpetas. La
página se va a escribir contra una función que devuelve una lista de
productos, así que cambiar de fuente toca un archivo y no el resto.

### 3.1 Estructura de la carpeta

```
Catálogo Ubuntu/            <- carpeta compartida "cualquiera con el link puede ver"
├── Velas/
│   ├── Vela de soja lavanda - 4500.jpg
│   ├── Vela mármol grande - 7200.jpg
│   └── Set 3 velas navideñas - 9900.jpg
├── Souvenirs/
│   ├── Souvenir bautismo pack x12 - consultar.jpg
│   └── Jabón artesanal individual - 1200.jpg
├── Deco/
│   └── Portavelas de yeso - 3800.jpg
└── _borradores/            <- la página ignora todo lo que empiece con "_"
    └── prueba.jpg
```

### 3.2 Convención de nombre

```
<nombre del producto> - <precio>.<extensión>
```

Reglas, en orden de importancia:

- El separador es **espacio, guion, espacio** (` - `). Se parsea por el
  **último** ` - ` del nombre, así que "Vela 2 en 1 - edición limitada - 4500.jpg"
  funciona bien: nombre = `Vela 2 en 1 - edición limitada`, precio = `4500`.
- El precio va **solo en números, sin puntos ni signo peso**: `4500`, no
  `$4.500` ni `4.500`. La página lo formatea como `$ 4.500`.
- La palabra **`consultar`** en lugar del número es válida y muestra
  "Precio a consultar". Sirve para souvenirs que se cotizan por cantidad.
- Las **subcarpetas son las categorías** y se muestran como filtros. Las
  fotos sueltas en la raíz caen en "Otros".
- Carpetas o archivos que empiezan con `_` no se muestran. Es la forma de
  despublicar algo sin borrarlo.
- El **orden** es alfabético. Si quieren mandar algo arriba, le ponen un
  prefijo numérico: `01. Vela lavanda - 4500.jpg`. La página corta el
  `01. ` al mostrar.

### 3.3 Qué pasa si escriben mal el nombre

Nada se rompe. El archivo simplemente **no aparece en la página**, y aparece
listado en una página oculta `estado.html` que dice, literal:

> `IMG_20240912.jpg` — falta el precio. Debería ser algo como `Nombre del producto - 4500.jpg`

Esa página es el manual de uso en vivo. Sin eso, el primer typo termina en un
mensaje de WhatsApp a las 11 de la noche preguntando por qué desapareció una
vela.

### 3.4 Cómo se leen los archivos

Google Drive tiene una API pública de solo lectura (`files.list`, API v3) que
funciona desde el navegador con una **API key restringida por dominio**. No
hay login, no hay backend, no hay secreto real: la key solo sirve para leer
una carpeta que ya es pública.

De cada archivo se necesita: `id`, `name`, `mimeType`, `parents`.
La imagen se arma con el `id` y un parámetro de ancho, para no servir la foto
original de 4 MB que salió del celular.

**Punto a validar antes de escribir la página:** Drive sirve bien las
miniaturas, pero no es un CDN de imágenes. Si el catálogo pasa de ~40 fotos o
la página tarda, la migración natural es Cloudinary (plan gratis, resize por
URL, misma idea de carpeta). No lo hacemos ahora, pero por eso la carga de
imágenes también va detrás de una función propia.

### 3.5 Cache y fallback

- Al cargar, la página pide la lista a Drive y la guarda en `localStorage`
  con un TTL corto (~10 min). Segunda visita: instantánea.
- Si la llamada a Drive falla (sin internet, cuota, key mal configurada), la
  página cae a un `catalogo.json` versionado en el repo, que es una copia del
  último estado conocido. **Nunca se muestra una página vacía.**

### 3.6 Contrato de datos

La página no sabe qué es Drive. Consume una lista de objetos así:

| campo | tipo | ejemplo | notas |
|---|---|---|---|
| `id` | string | `1a2B3c...` | id del archivo, sirve de key |
| `nombre` | string | `Vela de soja lavanda` | ya sin el precio ni el prefijo de orden |
| `precio` | number \| null | `4500` | `null` = "a consultar" |
| `categoria` | string | `Velas` | nombre de la subcarpeta, `Otros` si está suelto |
| `imagen` | string (URL) | `https://...=w800` | versión redimensionada |
| `imagenGrande` | string (URL) | `https://...=w1600` | para el detalle / zoom |

Cambiar de Drive a Sheets, a Airtable o a un JSON estático = escribir otra
función que devuelva esta misma lista. El resto de la página no se toca.

## 4. Qué tiene que estar listo antes de codear

- [ ] Crear la carpeta `Catálogo Ubuntu` en el Drive de la marca (no en el tuyo personal).
- [ ] Compartirla como "cualquier persona con el enlace — Lector".
- [ ] Crear las subcarpetas de categorías con los nombres definitivos.
- [ ] Sacar el ID de la carpeta (está en la URL).
- [ ] Crear el proyecto en Google Cloud, habilitar Drive API, generar la API key y restringirla al dominio del sitio.
- [ ] Cargar 8–10 productos reales para probar con contenido de verdad, no con placeholders.

## 5. Fuera de alcance del v1

Carrito, stock, checkout, pagos, buscador, precios por cantidad, variantes
(color/aroma) como campo aparte. Todo eso empuja hacia un backend o hacia
Tienda Nube. Si el día de mañana quieren vender con pago online, la
conversación no es "agrandamos esto", es "migramos a una plataforma".
