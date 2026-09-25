# Plan 3 — Redes sociales y contacto

WhatsApp es el checkout de esta página. Instagram es de dónde viene la gente.

> Actualizado con los datos reales y con la decisión de no publicar precios.

---

## 1. Datos

| Dato | Valor |
|---|---|
| WhatsApp (como lo escribe una persona) | 11 7238-8119 |
| WhatsApp (formato para el link) | `5491172388119` |
| Instagram | `@Ubuntu.estudio` |
| Zona | Morón, Buenos Aires |

El número del link va **sin `+`, sin espacios, sin guiones**, con código de
país (`54`) y el `9` de celular de Argentina adelante. Si falta el `9`, en
muchos teléfonos el link abre un chat vacío con un número que no existe.

## 2. WhatsApp

### 2.1 Cómo funciona

No hace falta API ni cuenta Business. Un link `wa.me` con el número y el
texto ya escrito abre la app (o WhatsApp Web en escritorio) con el mensaje
cargado, listo para enviar:

```
https://wa.me/5491172388119?text=<mensaje codificado>
```

El texto va URL-encoded: los espacios, acentos, `¿`, `?` y los saltos de
línea se codifican, o el mensaje llega cortado. Lo hace la página sola; no se
escribe el link a mano.

### 2.2 Los tres mensajes

**a) Genérico — botón del hero y del encabezado**

> Hola Ubuntu! Vi la página y quería hacerles una consulta 😊

**b) Por producto — el botón de cada tarjeta del catálogo**

> Hola Ubuntu! Me interesa este producto:
> *Vela de soja lavanda*
> ¿Me pasan precio y disponibilidad?
>
> https://ubuntu-estudio.pages.dev

**c) Idea / personalizado — botón de cierre de la página**

> Hola Ubuntu! Tengo una idea para un pedido y quería contarles 😊

### 2.3 Sobre el botón por producto

Vos proponías un link por categoría ("velas", "productos") en vez de uno por
producto, porque sin precios el mensaje por producto pierde sentido.

**Mi opinión es la contraria: sin precios el botón por producto vale más, no
menos.** Si el precio estuviera publicado, la persona ya sabe cuánto sale y
escribe para comprar. Como no está, el *único* motivo por el que escribe es
preguntar el precio — y ahí la diferencia entre estos dos mensajes es toda la
conversación:

| Llega esto | O llega esto |
|---|---|
| "hola, cuánto sale la vela?" | "Me interesa este producto: *Vela de soja lavanda*. ¿Me pasan precio y disponibilidad?" |
| Hay que preguntar cuál, mandar fotos, esperar | Se contesta con un número y listo |

Con 20 productos parecidos, el primero es tres mensajes de ida y vuelta antes
de poder cotizar. El segundo se contesta desde el colectivo.

Además cuesta lo mismo: el nombre del producto ya está en la tarjeta, meterlo
en el link es una línea.

El botón por categoría no lo agregaría: duplica el de producto sin agregar
información, y llena la página de botones verdes. Si igual lo querés, se hace
en cinco minutos y lo vemos funcionando antes de decidir.

### 2.4 Botón flotante

Ícono de WhatsApp fijo abajo a la derecha, con el mensaje genérico.

- No aparece en la primera pantalla: entra cuando el usuario ya scrolleó.
  Si está desde el segundo cero, tapa el hero y molesta.
- La página lleva espacio extra al final para que no tape el último producto.
- Área de toque mínima 48×48 px.

### 2.5 Qué no hacer

- Poner el número como texto plano para que lo copien a mano. Nadie lo hace.
- Un `mailto:` como contacto principal. En este rubro el mail no se contesta.
- Formularios de contacto. Necesitan backend y la respuesta tarda.

## 3. Instagram

Un botón que abre el perfil `@Ubuntu.estudio`. Nada más.

- Va en el encabezado (ícono) y en el pie (ícono + `@Ubuntu.estudio` escrito).
- Abre en pestaña nueva.
- El usuario escrito al menos una vez: mucha gente prefiere buscarlo a mano
  antes que tocar un link.

**No** se embebe el feed de Instagram: los widgets que lo hacen son pesados,
se rompen cada vez que Meta cambia algo, y meten tracking de terceros.

## 4. Compartir la página — qué es y por qué importa

Esto es lo que no se entendía. Es puramente visual.

Cuando alguien manda el link de la página por WhatsApp, WhatsApp intenta
mostrar una previsualización. **Si la página no la tiene configurada**, se ve
así:

```
┌──────────────────────────────────┐
│  ubuntu-estudio.pages.dev        │   <- caja gris, sin imagen
└──────────────────────────────────┘
https://ubuntu-estudio.pages.dev
```

Un rectángulo gris con la URL. Parece un link de spam, y la gente no lo toca.

**Configurada**, se ve así:

```
┌──────────────────────────────────┐
│  ██████████████████████████████  │
│  ███  (foto de una vela)    ███  │
│  ██████████████████████████████  │
│                                  │
│  Ubuntu estudio                  │
│  Hecho a mano, pensado para vos  │
│  ubuntu-estudio.pages.dev        │
└──────────────────────────────────┘
```

Es la tarjetita con foto que ves cuando alguien te manda un link de un diario
o de Mercado Libre. Eso mismo, pero con el logo y el lema de Ubuntu.

Importa porque el 90% del tráfico de esta página va a llegar así: alguien
manda el link por WhatsApp, o lo ponen en la bio de Instagram. Es la primera
impresión de la marca, y son tres líneas de configuración.

Se hace con etiquetas en el `<head>` de la página (Open Graph), definidas una
sola vez:

| etiqueta | valor |
|---|---|
| `og:title` | Ubuntu estudio |
| `og:description` | Hecho a mano, pensado para vos |
| `og:image` | Imagen fija de 1200×630, guardada en el repo |
| `og:url` | URL final del sitio |
| `og:type` | `website` |

La imagen tiene que ser una URL fija y estable, por eso **no** se usa una foto
del catálogo: las de Drive cambian. Hay que armar una: el logo sobre el fondo
crema, o el logo al lado de una foto de producto.

## 5. Configuración centralizada

Todo esto vive en un solo archivo de configuración, para que cambiar el
teléfono sea una línea:

- número de WhatsApp
- usuario de Instagram
- los tres mensajes predefinidos
- URL pública del sitio
- ID de la carpeta de Drive (Plan 1)

## 6. Qué falta

- [x] Número, Instagram, zona.
- [ ] Imagen 1200×630 para la previsualización.
- [ ] Dominio final (define `og:url` y la restricción de la API key de Drive).
