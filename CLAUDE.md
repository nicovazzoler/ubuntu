# Ubuntu Estudio

## Comentarios en el código

Regla: el código se explica solo. Un comentario existe solo si dice algo que el código no dice.

Permitido:
- Una línea arriba de una función que no es obvia, diciendo qué hace.
- El porqué de algo que parece un error o una decisión rara.
- Un caso borde que no se ve leyendo.

Prohibido:
- Historia: "antes pasaba X", "se arregló porque", "ahora usamos Y en vez de Z". Eso va en el commit.
- Repetir lo que dice el nombre de la función o la línea de abajo.
- Comentarios de más de 3 líneas. Si hace falta más, la función hace dos cosas: partila.
- Comentar cada paso de una función.

Mal (historia, planes y más de 3 líneas):

```js
// La foto original, pedida por la API oficial. Sirve tal cual se subió, sin
// redimensionar: por eso estado.html avisa si una pesa demasiado. El endpoint
// de miniaturas (lh3.googleusercontent.com) redimensiona, pero no está
// documentado y respondió 403 en las pruebas. Si hace falta achicar fotos, la
// migración prevista es Cloudinary (Plan 1 §3.4).
const imagen = (id) => `${API}/${id}?alt=media&key=${CONFIG.drive.apiKey}`;
```

Bien:

```js
// La original sin redimensionar (estado.html avisa si pesa mucho). El endpoint
// de miniaturas, lh3.googleusercontent.com, no está documentado y da 403.
const imagen = (id) => `${API}/${id}?alt=media&key=${CONFIG.drive.apiKey}`;
```

Mal (repite la línea de abajo):

```js
// Solo cuenta como precio si son puros dígitos.
if (!/^\d+$/.test(cola)) return { nombre: sinOrden, precio: null };
```

Bien: sin comentario. La regex ya lo dice.

Bien (el porqué de algo que no se ve):

```js
await sharp(original).rotate()   // respeta la orientación que guarda el celular
```
