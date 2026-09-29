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
- El **orden** es por categoría y, dentro de cada una, alfabético. Para mandar
  algo arriba se le pone un número adelante: `01. Vela de ángel.jpg`.
  **Número, punto, espacio** (sin el espacio no se reconoce). La página corta
  el `01. ` al mostrar, pero ordena con él. Los números se comparan como
  números: `2.` va antes que `10.`. Lo que no tiene número va después, en
  orden alfabético.
- La **portada de cada categoría** (los bloques con foto) es el primer
  producto de esa carpeta. Sin prefijos, el primero alfabético; con `01.`, el
  que ellos elijan.

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

**Las fotos salen del propio sitio, no de Drive**, siempre que el producto esté
en la copia local. Publicada la página, en el celular tardaban demasiado, por
tres motivos medidos:

- Drive responde las fotos con `Cache-Control: private, max-age=0`: el
  navegador no puede guardarlas y las vuelve a bajar en cada visita.
- Las manda en tamaño original: 121 KB y 900x1600 en promedio (2,9 MB las 24)
  para tarjetas de ~170px en el celular.
- La primera consulta a Drive tardó casi un segundo, y nada aparecía antes.

Ahora `js/catalogo.js` usa Drive para el **listado** (nombres, categorías,
precios, productos nuevos) y, para cada producto, busca su foto en la copia
local por categoría + nombre. Si está, usa la versión chica
(`assets/productos/mini/`, 600px webp, 867 KB las 24) en las tarjetas y la
original en el visor, servidas por Cloudflare y con caché (`_headers`). Si no
está (producto nuevo o renombrado), la pide a Drive:

```
https://www.googleapis.com/drive/v3/files/<id>?alt=media&key=<API key>
```

Hasta que se corre `node herramientas/copia-local.mjs` y se publica, ese
producto carga desde Drive, más lento; después, desde el sitio.

### 3.5 Carga instantánea y fallback

- La página muestra **enseguida** lo último conocido: lo que quedó guardado en
  el navegador o, en la primera visita, la copia local. No espera a Drive.
- En paralelo consulta Drive. Si hay cambios (un nombre, un producto nuevo),
  vuelve a dibujar con la lista nueva y la guarda para la próxima visita.
- Si Drive no responde, queda lo que ya se mostró. **Nunca se muestra una
  página vacía.**

Medido con Drive tardando 3 s: la primera tarjeta aparece a los 0,19 s.

**Respaldo por foto** (`js/imagenes.js`). Publicada la página, algunas fotos
de Drive no cargaban: Google corta descargas con 403 de forma intermitente, y
la misma foto baja bien un segundo después. Cada imagen que falla:

1. reintenta una vez, tras una espera al azar de 0,8 a 1,6 s (para que no
   reintenten todas juntas);
2. si vuelve a fallar, usa la foto del mismo producto en la copia local
   (se busca por categoría + nombre);
3. si el producto es nuevo y todavía no está en la copia, muestra el isotipo.

Nunca queda una imagen rota. Por eso importa correr
`node herramientas/copia-local.mjs` cuando cambian los productos: es lo que
hace que el paso 2 tenga de dónde sacar la foto.

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

Copia local de respaldo: `assets/productos/` y `assets/catalogo.json`. La
página la usa si no hay API key o si Drive no responde (§3.5). **Se regenera
desde Drive con un comando**, cada vez que cambian los productos:

```
node herramientas/copia-local.mjs
```

Baja todo a una carpeta temporal y reemplaza la copia vieja recién al final:
si algo falla, la anterior queda intacta. Google frena descargas seguidas con
403 de forma intermitente (el mismo archivo baja bien al reintentar), así que
reintenta hasta 5 veces esperando 1, 2, 4, 8 y 16 segundos.

## 5. Fuera de alcance del v1

Carrito, stock, checkout, pagos, buscador, variantes (color/aroma) como
campo aparte. Todo eso empuja hacia un backend o hacia
Tienda Nube. Si el día de mañana quieren vender con pago online, la
conversación no es "agrandamos esto", es "migramos a una plataforma".
