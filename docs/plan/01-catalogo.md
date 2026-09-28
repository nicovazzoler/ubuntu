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
│   ├── Vela de soja lavanda.jpg
│   ├── Vela mármol grande.jpg
│   └── Set 3 velas navideñas.jpg
├── Souvenirs/
│   ├── Souvenir bautismo.jpg
│   └── Jabón artesanal.jpg
├── Deco/
│   └── Portavelas de yeso - 3800.jpg     <- este sí muestra precio
└── _borradores/            <- la página ignora todo lo que empiece con "_"
    └── prueba.jpg
```

### 3.2 Convención de nombre

```
<nombre del producto>.<extensión>
<nombre del producto> - <precio>.<extensión>
```

**El precio es opcional.** Hoy no se publican precios, así que alcanza con
que el archivo se llame como el producto:

```
Vela de soja lavanda.jpg
Portavelas de yeso.jpg
```

El día que quieran publicar el precio de algo, le agregan ` - ` y el número
al final del nombre, y aparece solo. No hay que tocar la página:

```
Vela de soja lavanda - 4500.jpg
```

Reglas:

- Algo cuenta como precio **solo si lo que viene después del último ` - `
  son puros dígitos**. Por eso `Set 3 velas - navideñas.jpg` no se rompe: no
  es un número, así que el nombre queda entero y el producto va sin precio.
- El separador es **espacio, guion, espacio** (` - `).
- El precio va **solo en números**: `4500`, no `$4.500`. La página lo
  formatea como `$ 4.500`.
- Las **subcarpetas son las categorías** y se muestran como filtros. Las
  fotos sueltas en la raíz caen en "Otros".
- Carpetas o archivos que empiezan con `_` no se muestran. Es la forma de
  despublicar algo sin borrarlo.
- El **orden** es por categoría y, dentro de cada una, alfabético. Si quieren mandar algo arriba, le ponen un
  prefijo numérico: `01. Vela lavanda.jpg`. La página corta el `01. ` al
  mostrar.

No existe un valor "a consultar". Un producto sin precio simplemente no
muestra precio: muestra el botón de consulta.

### 3.3 Qué pasa si escriben mal el nombre

La página `estado.html` está implementada y avisa, archivo por archivo, qué
se muestra y qué no.

Con el precio opcional, casi nada rompe. Lo único que queda feo es un
archivo que sigue con el nombre que le puso la cámara. Esos no se muestran, y
aparecen listados en una página oculta `estado.html` que dice, literal:

> `IMG_20240912.jpg` — el nombre del archivo es el nombre del producto.
> Renombralo a algo como `Vela de soja lavanda.jpg`

Esa página es el manual de uso en vivo. Sin eso, el primer typo termina en un
mensaje de WhatsApp a las 11 de la noche preguntando por qué desapareció una
vela.

### 3.4 Cómo se leen los archivos

Google Drive tiene una API pública de solo lectura (`files.list`, API v3) que
funciona desde el navegador con una **API key restringida por dominio**. No
hay login, no hay backend, no hay secreto real: la key solo sirve para leer
una carpeta que ya es pública.

Primero un pedido a la carpeta raíz, que devuelve las subcarpetas (las
categorías) y lo que haya suelto. Después **un pedido por subcarpeta, todos
en paralelo**: con cinco categorías son 1 + 5 pedidos, pero el tiempo de
espera es el de dos.

Lo lógico sería un solo pedido con `'a' in parents or 'b' in parents`, y así
estaba escrito al principio. Probado contra la carpeta real, **Drive lo
rechaza con 403** cuando el acceso es anónimo con API key, aunque cada
carpeta por separado responda bien. La prueba con datos simulados no lo podía
detectar: el simulador aceptaba cualquier consulta.

De cada archivo se usan `id`, `name`, `mimeType` y `parents`. Se descarta lo
que no sea imagen, y lo que empiece con `_`.

La imagen se pide por la misma API, con el id:

```
https://www.googleapis.com/drive/v3/files/<id>?alt=media&key=<API key>
```

Eso sirve **la foto original, sin redimensionar**. Con las fotos actuales
(60–175 KB cada una) está bien. El riesgo es que alguien suba una foto de 4 MB
directo del celular: por eso `estado.html` avisa cuando un archivo pasa los
500 KB.

La idea original era el endpoint de miniaturas
(`lh3.googleusercontent.com/d/<id>=w800`), que redimensiona solo. Probado
contra la carpeta real respondió 403, y no está documentado por Google. Si
más adelante el peso de las fotos se vuelve un problema, la migración
prevista es Cloudinary, que redimensiona por URL.

Cada foto vista es un pedido a la API y cuenta para la cuota del proyecto.
La cuota gratuita de Drive API está muy por encima de lo que usa un catálogo
de este tamaño.

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
| `precio` | number \| null | `4500` | `null` = no se muestra precio |
| `categoria` | string | `Velas` | nombre de la subcarpeta, `Otros` si está suelto |
| `imagen` | string (URL) | `https://...=w800` | versión redimensionada |
| `imagenGrande` | string (URL) | `https://...=w1600` | para el detalle / zoom |

Cambiar de Drive a Sheets, a Airtable o a un JSON estático = escribir otra
función que devuelva esta misma lista. El resto de la página no se toca.

## 4. Estado

Carpeta ya creada por Nico (después se migra a una cuenta del emprendimiento;
es cambiar un ID):

```
https://drive.google.com/drive/folders/1WCDLU_cJfaxKQIlLdzfhsQec2gwo1j-Q
ID: 1WCDLU_cJfaxKQIlLdzfhsQec2gwo1j-Q
```

- [x] Carpeta creada y compartida por link.
- [x] Subcarpetas de categorías creadas: `Velas` (12), `Velas en frasco de
      vidrio con sticker` (4), `Comunión` (4), `Souvenirs` (2), `Deco` (2).
- [x] 24 productos cargados, **todos con el nombre correcto**. No hay nada
      que renombrar: los nombres ya son el nombre del producto, sin precio.
- [ ] Acortar `Velas en frasco de vidrio con sticker` → `Velas con sticker`
      (como chip de filtro el nombre largo no entra, Plan 4 §5.2).
- [ ] Mover `Comunión/Set comunión.webp` a `_borradores/`: es una placa de
      Instagram, no una foto de producto.
- [ ] **Proyecto en Google Cloud, Drive API habilitada, API key restringida
      al dominio del sitio.** Es lo único que falta: el código ya está
      escrito y probado contra una respuesta simulada de Drive. Se pega la
      key en `js/config.js` (`drive.apiKey`) y la página deja de usar la
      copia local.

Copia local para maquetar sin depender de la red: `assets/productos/` y
`assets/catalogo.json`, generados desde un export de la carpeta. Sirven
también de fallback (§3.5).

## 5. Fuera de alcance del v1

Carrito, stock, checkout, pagos, buscador, variantes (color/aroma) como
campo aparte. Todo eso empuja hacia un backend o hacia
Tienda Nube. Si el día de mañana quieren vender con pago online, la
conversación no es "agrandamos esto", es "migramos a una plataforma".
