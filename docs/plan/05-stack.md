# Plan 5 — Stack

Con qué se escribe la página.

---

## 1. La decisión

**React con Vite, en JavaScript.** Sin Angular, sin Next.js, sin TypeScript
por ahora, sin Tailwind, sin librerías de componentes.

## 2. Por qué React y no Angular

Los dos son frameworks de front-end y los dos sirven para esto, pero como
**primer framework** no se parecen en nada.

| | React | Angular |
|---|---|---|
| Qué tenés que aprender para el día 1 | componentes, props, estado, efectos | componentes, módulos, decoradores, inyección de dependencias, RxJS, TypeScript, plantillas con sintaxis propia |
| Lenguaje | JavaScript o TypeScript, como quieras | TypeScript obligatorio |
| Tamaño mínimo del bundle | ~45 KB | ~120 KB |
| Para qué está pensado | cualquier cosa, desde un widget hasta una app | aplicaciones grandes de empresa, con muchos equipos tocando el mismo código |
| Mercado laboral en Argentina | mucho más grande | existe, concentrado en corporativo |

Angular es un framework **con opiniones sobre todo**: te dice cómo estructurar
las carpetas, cómo manejar los datos asincrónicos (RxJS, que es un mundo
aparte), cómo inyectar servicios. Esas opiniones valen oro cuando sos quince
personas tocando la misma app durante tres años. Acá sos vos y una grilla de
fotos: pagás toda la curva de aprendizaje y no usás nada de lo que la
justifica.

React te da menos: componentes y estado. Para aprender, ese "menos" es
exactamente la ventaja — vas a entender *por qué* existe cada pieza, en vez
de copiar una estructura que alguien decidió por vos.

Y si después querés Angular, saber React te lo hace fácil. Al revés también,
pero arrancar por el más chico duele menos.

## 3. El costo honesto

Hay que decirlo: **esta página no necesita React.**

Es un catálogo de ~30 fotos con un filtro. Con HTML, CSS y unas 100 líneas de
JavaScript quedaría más liviano y cargaría más rápido. React le agrega un
paso de compilación y unos 50 KB de JavaScript a una página cuyo trabajo es
mostrar imágenes.

Dicho eso: **50 KB al lado de 30 fotos no se nota**, y tu objetivo declarado
es aprender el framework. Ese es un motivo perfectamente válido para elegir
una herramienta. Solo conviene tenerlo claro para no confundir "lo usé porque
hacía falta" con "lo usé porque quería aprenderlo" — la diferencia importa
cuando alguien te pregunte por qué en una entrevista.

## 4. Por qué este proyecto es un buen primer React

El catálogo toca, sin forzar nada, las cinco cosas que se hacen todo el
tiempo en React:

1. **Componentes y props** — `<TarjetaProducto producto={...} />`, repetido 30 veces.
2. **Renderizar una lista** — `productos.map(...)`, y entender para qué sirve la `key`.
3. **Estado** — qué categoría está seleccionada.
4. **Efectos y datos remotos** — traer la lista desde Drive cuando la página carga.
5. **Los tres estados de una carga** — cargando, error, datos. Es el patrón que más vas a repetir en tu vida laboral.

No hay routing, ni formularios, ni autenticación, ni estado global. Eso está
bien: son los temas de la segunda vuelta.

## 5. Herramientas

- **Vite** — el que arma el proyecto y levanta el servidor de desarrollo.
  Guardás un archivo y el navegador se actualiza solo.
  `npm create vite@latest`, plantilla *React*.
- **JavaScript, no TypeScript, por ahora.** TypeScript es estándar en la
  industria y lo vas a querer, pero aprender React y TS al mismo tiempo
  duplica los errores y no sabés cuál te frenó. Migrarlo después es un
  ejercicio buenísimo, con el proyecto ya funcionando.
- **CSS a mano, sin Tailwind.** El Plan 4 es 70% decisiones de CSS. Si las
  resolvés con clases de una librería, aprendés la librería y no el CSS. Los
  tokens de color van como variables CSS en `:root`.
- **Sin librería de componentes** (Material, shadcn, Chakra). Traen su propio
  look y este proyecto tiene identidad propia: pelearías contra la librería
  para que se parezca al logo.
- **Sin Next.js.** Agrega renderizado en el servidor, routing por archivos y
  un modelo de componentes que hoy confunde más de lo que ayuda.

## 6. Estructura propuesta

```
src/
├── config.js              <- WhatsApp, Instagram, ID de Drive, mensajes (Plan 3 §5)
├── main.jsx
├── App.jsx
├── estilos/
│   ├── tokens.css         <- variables de color, tipografía y espaciado (Plan 4)
│   └── global.css
├── datos/
│   └── catalogo.js        <- lee Drive y devuelve la lista de productos (Plan 1 §3.6)
└── componentes/
    ├── Encabezado.jsx
    ├── Hero.jsx
    ├── Catalogo.jsx       <- grilla + filtros + estados de carga
    ├── TarjetaProducto.jsx
    ├── SobreNosotros.jsx
    ├── ContanosTuIdea.jsx
    ├── BotonWhatsapp.jsx
    └── Pie.jsx
```

La clave está en `datos/catalogo.js`: **es el único archivo que sabe que
existe Google Drive.** Los componentes reciben la lista ya armada, con la
forma del contrato del Plan 1 §3.6. Si mañana se migra a Sheets, se reescribe
ese archivo y nada más.

## 7. Dónde se publica

Sin cambios respecto de lo planeado: **Cloudflare Pages o Netlify**, plan
gratis. Que ahora haya un paso de compilación no complica nada — se conectan
al repo, detectan Vite solos, corren `npm run build` en cada push y publican.

**Railway sigue sin ser la opción.** Cobra por proceso corriendo; el resultado
de `npm run build` son archivos estáticos que un CDN sirve gratis y más
rápido.

## 8. Orden de trabajo

1. Maquetar la página completa con una lista de productos **fija, escrita a
   mano** en un archivo. Sin Drive, sin red, sin nada asincrónico.
2. Aplicar el Plan 4 hasta que se vea bien en un celular de verdad.
3. Recién ahí conectar Drive, reemplazando la lista fija.
4. Publicar.

Ese orden importa: si conectás Drive el primer día, cada problema de diseño
se mezcla con un problema de red y no sabés cuál estás debuggeando.

---

## Concepto aparte — qué es un "paso de compilación"

Hasta ahora, HTML y CSS los abre el navegador y listo. Con React no: el
navegador **no entiende** la sintaxis que vas a escribir.

Cuando escribís esto en un componente:

```jsx
<h1>Hola {nombre}</h1>
```

eso no es JavaScript válido. Se llama JSX, y es azúcar sintáctico: antes de
llegar al navegador, una herramienta (Vite) lo traduce a llamadas a funciones
comunes, junta todos tus archivos en unos pocos, y los minifica.

De ahí salen dos comandos que vas a usar todo el tiempo:

- `npm run dev` — levanta un servidor local que hace esa traducción al vuelo
  mientras trabajás. Guardás un archivo y el navegador se actualiza solo.
- `npm run build` — hace la traducción final y deja una carpeta `dist/` con
  HTML, CSS y JS comunes. **Eso** es lo que se sube al hosting.

Lo que se publica nunca es tu código tal como lo escribiste. Y es la razón
por la que el hosting tiene que correr un comando antes de publicar, en vez
de simplemente copiar archivos.
