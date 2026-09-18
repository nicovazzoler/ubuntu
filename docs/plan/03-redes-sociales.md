# Plan 3 — Redes sociales y contacto

WhatsApp es el checkout de esta página. Instagram es de dónde viene la gente.
Nada más.

---

## 1. WhatsApp

### 1.1 Cómo funciona

No hace falta ninguna API ni cuenta Business. Un link `wa.me` con el número y
el texto ya escrito abre la app (o WhatsApp Web en escritorio) con el mensaje
cargado, listo para enviar:

```
https://wa.me/<numero>?text=<mensaje codificado>
```

- El número va **sin `+`, sin espacios, sin guiones**, con código de país y
  el `9` de Argentina: `5491122334455`.
- El texto va **URL-encoded**. Los espacios, acentos, `$`, `?` y los saltos
  de línea tienen que codificarse, o el mensaje llega cortado. Esto lo hace
  la página sola; no se escribe el link a mano.
- El número se guarda en **un solo lugar** (un archivo de configuración), no
  repetido en cada botón.

### 1.2 Los tres botones de WhatsApp

**a) Botón del hero — genérico**

> Hola! Vi la página de Ubuntu y quería hacer una consulta 😊

**b) Botón por producto — el importante**

Cada tarjeta del catálogo tiene su propio botón, con el producto ya escrito:

> Hola! Me interesa este producto:
> *Vela de soja lavanda* — $ 4.500
> ¿Sigue disponible?

Esto es lo que hace que la página sirva. Sin esto llega "hola, cuánto sale la
de lavanda?" y hay que preguntar cuál. Con esto llega el pedido identificado.

Detalles que importan:
- El nombre del producto va entre asteriscos: WhatsApp lo muestra en negrita.
- Si el precio es "a consultar", el mensaje cambia a
  *"¿Me pasás precio por cantidad?"*. No mandar "$ null".
- **Incluir el link de la página al final** del mensaje. Cuando la persona
  reenvía la conversación a una amiga, el link viaja solo.

**c) Botón flotante — siempre visible**

Ícono de WhatsApp fijo abajo a la derecha, en todas las pantallas. Mismo
mensaje que el genérico.

- No aparece en la primera pantalla: entra cuando el usuario ya scrolleó un
  poco. Si está desde el segundo cero tapa el hero y molesta.
- Tiene que quedar **por encima** de todo pero **sin tapar** el último
  producto de la grilla: la página lleva un espacio extra al final.
- Área de toque mínima 48×48 px.

### 1.3 Errores a evitar

- Poner el número como texto plano para que lo copien a mano. Nadie lo hace.
- Un `mailto:` como contacto principal. En este rubro, el mail no se contesta.
- Formularios de contacto. Necesitan backend o un servicio externo, y la
  respuesta tarda. WhatsApp es instantáneo y ya lo tienen abierto.

## 2. Instagram

Un botón que abre el perfil. Nada más, como pediste.

- Va en el encabezado (ícono) y repetido en el pie (ícono + `@usuario`).
- Abre en **pestaña nueva** (`target="_blank"` + `rel="noopener noreferrer"`).
- Poner el `@usuario` visible al menos una vez: mucha gente prefiere buscarlo
  a mano antes que tocar un link.

**No** se embebe el feed de Instagram. Los widgets que lo hacen son pesados,
se rompen cada vez que Meta cambia algo, y meten tracking de terceros.

## 3. Compartir la página

Cuando alguien manda el link por WhatsApp o lo pone en la bio de Instagram,
se genera una previsualización. Si no está configurada, se ve una caja gris
con la URL cruda y parece spam.

Se resuelve con etiquetas en el `<head>` (Open Graph), definidas una vez:

| etiqueta | valor |
|---|---|
| `og:title` | Ubuntu — Velas, souvenirs y deco hecho a mano |
| `og:description` | Una línea del hero |
| `og:image` | Imagen fija de 1200×630, en el repo. **No** una foto de Drive |
| `og:url` | URL final del sitio |
| `og:type` | `website` |

La imagen tiene que ser una URL absoluta y estable. Por eso no se usa una
del catálogo: cambia.

## 4. Configuración centralizada

Todos estos datos viven juntos en un solo archivo de configuración, para que
cambiar el número de teléfono sea una línea y no una búsqueda por todo el
proyecto:

- número de WhatsApp
- usuario de Instagram
- mensajes predefinidos (genérico, por producto, por producto sin precio)
- URL pública del sitio
- ID de la carpeta de Drive (Plan 1)

## 5. Qué tiene que estar listo antes de codear

- [ ] Número de WhatsApp definitivo (¿el personal de alguien o uno aparte para el emprendimiento?).
- [ ] Usuario de Instagram.
- [ ] Redacción final de los mensajes predefinidos.
- [ ] Imagen 1200×630 para la previsualización.
