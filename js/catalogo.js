import { CONFIG } from './config.js';

// Único archivo que sabe de dónde salen los productos. El resto de la página
// consume la lista que devuelve obtenerProductos() sin preguntar por la fuente:
// cambiar a Sheets es reescribir este archivo y nada más.

const API = 'https://www.googleapis.com/drive/v3/files';
const CARPETA = 'application/vnd.google-apps.folder';
const CACHE_MS = 10 * 60 * 1000;

export async function obtenerProductos() {
  if (!CONFIG.drive.apiKey) return leerCopiaLocal();

  const cacheado = leerCache();
  if (cacheado) return cacheado;

  try {
    const productos = await leerDeDrive();
    guardarCache(productos);
    return productos;
  } catch (error) {
    // Sin internet, cuota agotada o key mal configurada: mejor la copia vieja
    // que una pantalla vacía.
    console.warn('Drive no respondió; se usa la copia local.', error);
    return leerCopiaLocal();
  }
}

/* ---------- Drive ---------- */

async function consultar(condicion) {
  const url = new URL(API);
  url.searchParams.set('q', `(${condicion}) and trashed = false`);
  url.searchParams.set('key', CONFIG.drive.apiKey);
  url.searchParams.set('fields', 'files(id,name,mimeType,parents,size)');
  url.searchParams.set('pageSize', '1000');

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`Drive respondió ${respuesta.status}`);
  const { files = [] } = await respuesta.json();
  return files;
}

// Un pedido por carpeta, todos en paralelo. Un solo pedido con
// "'a' in parents or 'b' in parents" sería más prolijo, pero con API key
// (acceso anónimo) Drive lo rechaza con 403 aunque cada carpeta sola responda.
async function hijosDe(ids) {
  const listas = await Promise.all(ids.map((id) => consultar(`'${id}' in parents`)));
  return listas.flat();
}

async function leerDeDrive() {
  const raiz = CONFIG.drive.carpeta;
  const enRaiz = await consultar(`'${raiz}' in parents`);

  // Cada subcarpeta es una categoría. Lo que quede suelto en la raíz cae en "Otros".
  const categorias = new Map([[raiz, 'Otros']]);
  for (const f of enRaiz) {
    if (f.mimeType === CARPETA && !oculto(f.name)) categorias.set(f.id, f.name);
  }

  const subcarpetas = [...categorias.keys()].filter((id) => id !== raiz);
  const enSubcarpetas = await hijosDe(subcarpetas);

  return [...enRaiz, ...enSubcarpetas]
    .filter((f) => f.mimeType.startsWith('image/') && !oculto(f.name))
    .map((f) => aProducto(f, categorias))
    .sort(porCategoria);
}

function aProducto(archivo, categorias) {
  const { nombre, precio } = parsearNombre(archivo.name);
  return {
    id: archivo.id,
    nombre,
    precio,
    categoria: categorias.get((archivo.parents || [])[0]) || 'Otros',
    imagen: imagen(archivo.id),
    imagenGrande: imagen(archivo.id),
  };
}

// La foto original, pedida por la API oficial. Sirve tal cual se subió, sin
// redimensionar: por eso estado.html avisa si una pesa demasiado. El endpoint
// de miniaturas (lh3.googleusercontent.com) redimensiona, pero no está
// documentado y respondió 403 en las pruebas. Si hace falta achicar fotos, la
// migración prevista es Cloudinary (Plan 1 §3.4).
const imagen = (id) => `${API}/${id}?alt=media&key=${CONFIG.drive.apiKey}`;

const PESO_MAX = 500 * 1024;

const oculto = (nombre) => nombre.startsWith('_');

// En "Todos" los productos salen agrupados por categoría y, dentro de cada
// una, por nombre. Mismo orden que los filtros.
const porCategoria = (a, b) =>
  a.categoria.localeCompare(b.categoria, 'es') || a.nombre.localeCompare(b.nombre, 'es');

/* ---------- Nombre del archivo ---------- */

// "Vela lavanda.jpg"            -> { nombre: 'Vela lavanda', precio: null }
// "Vela lavanda - 4500.jpg"     -> { nombre: 'Vela lavanda', precio: 4500 }
// "Set 3 velas - navideñas.jpg" -> { nombre: 'Set 3 velas - navideñas', precio: null }
export function parsearNombre(archivo) {
  const sinExtension = archivo.replace(/\.[^.]+$/, '');
  const sinOrden = sinExtension.replace(/^\d+\.\s+/, '');   // "01. Vela" -> "Vela"

  const corte = sinOrden.lastIndexOf(' - ');
  if (corte === -1) return { nombre: sinOrden, precio: null };

  // Solo cuenta como precio si son puros dígitos.
  const cola = sinOrden.slice(corte + 3);
  if (!/^\d+$/.test(cola)) return { nombre: sinOrden, precio: null };

  return { nombre: sinOrden.slice(0, corte), precio: Number(cola) };
}

/* ---------- Copia local ---------- */

async function leerCopiaLocal() {
  const respuesta = await fetch(CONFIG.catalogoLocal);
  if (!respuesta.ok) throw new Error(`No se pudo leer el catálogo (${respuesta.status})`);
  const crudo = await respuesta.json();
  return crudo.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    precio: typeof item.precio === 'number' ? item.precio : null,
    categoria: item.categoria || 'Otros',
    imagen: item.imagen,
    imagenGrande: item.imagenGrande || item.imagen,
  })).sort(porCategoria);
}

/* ---------- Cache ---------- */

const clave = () => `ubuntu:catalogo:${CONFIG.drive.carpeta}`;

function leerCache() {
  try {
    const crudo = localStorage.getItem(clave());
    if (!crudo) return null;
    const { ts, productos } = JSON.parse(crudo);
    return Date.now() - ts > CACHE_MS ? null : productos;
  } catch {
    return null;   // incógnito, storage bloqueado o JSON viejo
  }
}

function guardarCache(productos) {
  try {
    localStorage.setItem(clave(), JSON.stringify({ ts: Date.now(), productos }));
  } catch {
    /* sin cache se sigue igual, solo más lento */
  }
}

/* ---------- Para estado.html ---------- */

// Mira la carpeta cruda y devuelve qué archivo va a andar y cuál no.
export async function revisar() {
  const raiz = CONFIG.drive.carpeta;
  const enRaiz = await consultar(`'${raiz}' in parents`);

  const categorias = new Map();
  for (const f of enRaiz) if (f.mimeType === CARPETA) categorias.set(f.id, f.name);

  const visibles = [...categorias].filter(([, n]) => !oculto(n)).map(([id]) => id);
  const enSubcarpetas = await hijosDe(visibles);

  return [...enRaiz, ...enSubcarpetas]
    .filter((f) => f.mimeType !== CARPETA)
    .map((f) => diagnosticar(f, categorias))
    .sort((a, b) => a.archivo.localeCompare(b.archivo, 'es'));
}

function diagnosticar(archivo, categorias) {
  const padre = (archivo.parents || [])[0];
  const carpeta = categorias.get(padre) || '(raíz)';
  const base = { archivo: archivo.name, carpeta };

  if (oculto(archivo.name) || oculto(carpeta)) {
    return { ...base, nivel: 'oculto', detalle: 'Empieza con "_": no se muestra. Si fue a propósito, está bien.' };
  }
  if (!archivo.mimeType.startsWith('image/')) {
    return { ...base, nivel: 'error', detalle: 'No es una imagen, así que no se muestra.' };
  }
  if (!categorias.has(padre)) {
    return { ...base, nivel: 'aviso', detalle: 'Está suelto en la raíz: va a aparecer en la categoría "Otros".' };
  }

  const { nombre, precio } = parsearNombre(archivo.name);
  const kb = Math.round(Number(archivo.size) / 1024);
  if (Number(archivo.size) > PESO_MAX) {
    return {
      ...base, nivel: 'aviso', nombre,
      detalle: `Pesa ${kb} KB y se descarga entera en cada visita. Conviene achicarla antes de subirla (menos de 500 KB).`,
    };
  }
  const cola = nombre.split(' - ').pop();
  if (precio === null && /[\d$]/.test(cola) && cola !== nombre) {
    return {
      ...base, nivel: 'aviso', nombre,
      detalle: `El final "${cola}" parece un precio pero no son solo números. Se muestra como parte del nombre. Para que sea precio: " - 4500", sin $ ni puntos.`,
    };
  }
  return {
    ...base, nivel: 'ok', nombre,
    detalle: precio === null ? 'Sin precio.' : `Precio: ${formatearPrecio(precio)}.`,
  };
}

/* ---------- Utilidades ---------- */

export function categoriasDe(productos) {
  return [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
}

const formato = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
});

export const formatearPrecio = (precio) => formato.format(precio);
