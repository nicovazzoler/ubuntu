// Regenera la copia local de respaldo (assets/productos + assets/catalogo.json)
// con lo que hay hoy en la carpeta de Drive. La página la usa si Drive no
// responde, así que conviene correrlo cada vez que cambian los productos.
//
//   node herramientas/copia-local.mjs
//
// La API key está restringida por dominio: el pedido se hace con el Referer de
// localhost:8000, que es uno de los permitidos.

import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { CONFIG } from '../js/config.js';
import { parsearNombre } from '../js/catalogo.js';

const API = 'https://www.googleapis.com/drive/v3/files';
const CARPETA = 'application/vnd.google-apps.folder';
const REFERER = { Referer: 'http://localhost:8000/' };
const DESTINO = 'assets/productos';
const TEMPORAL = 'assets/.productos-nuevo';
const EXTENSION = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' };

const oculto = (nombre) => nombre.startsWith('_');
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Google corta descargas seguidas con 403 de forma intermitente: el mismo
// archivo baja bien al reintentar. Hasta 5 reintentos, esperando 1, 2, 4, 8 y 16 s.
async function bajar(id, nombre) {
  for (let intento = 0; ; intento++) {
    const r = await fetch(`${API}/${id}?alt=media&key=${CONFIG.drive.apiKey}`, { headers: REFERER });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if (intento === 5 || ![403, 429, 500, 503].includes(r.status)) {
      throw new Error(`No se pudo bajar "${nombre}" (${r.status}) después de ${intento + 1} intentos`);
    }
    await esperar(1000 * 2 ** intento);
  }
}
const slug = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

async function hijosDe(id) {
  const url = new URL(API);
  url.searchParams.set('q', `'${id}' in parents and trashed = false`);
  url.searchParams.set('fields', 'files(id,name,mimeType,size)');
  url.searchParams.set('pageSize', '1000');
  url.searchParams.set('key', CONFIG.drive.apiKey);
  const r = await fetch(url, { headers: REFERER });
  if (!r.ok) throw new Error(`Drive respondió ${r.status} al listar ${id}`);
  return (await r.json()).files ?? [];
}

const raiz = await hijosDe(CONFIG.drive.carpeta);
const carpetas = raiz.filter((f) => f.mimeType === CARPETA && !oculto(f.name));
const sueltos = raiz.filter((f) => f.mimeType !== CARPETA).map((f) => ({ ...f, categoria: 'Otros' }));
const porCarpeta = await Promise.all(
  carpetas.map(async (c) => (await hijosDe(c.id)).map((f) => ({ ...f, categoria: c.name })))
);

const archivos = [...sueltos, ...porCarpeta.flat()]
  .filter((f) => EXTENSION[f.mimeType] && !oculto(f.name));

// Todo se baja a una carpeta aparte; la copia vieja se reemplaza recién al final.
await rm(TEMPORAL, { recursive: true, force: true });
await mkdir(TEMPORAL, { recursive: true });

const productos = [];
for (const f of archivos) {
  const { nombre, precio } = parsearNombre(f.name);
  const archivo = `${slug(f.categoria)}--${slug(nombre)}.${EXTENSION[f.mimeType]}`;
  await writeFile(`${TEMPORAL}/${archivo}`, await bajar(f.id, f.name));
  process.stdout.write('.');
  productos.push({
    id: `${slug(f.categoria)}--${slug(nombre)}`,
    nombre,
    orden: f.name,
    precio,
    categoria: f.categoria,
    imagen: `${DESTINO}/${archivo}`,
  });
}

await rm(DESTINO, { recursive: true, force: true });
await rename(TEMPORAL, DESTINO);
console.log();

productos.sort((a, b) => a.categoria.localeCompare(b.categoria, 'es') ||
  a.orden.localeCompare(b.orden, 'es', { numeric: true }));
await writeFile('assets/catalogo.json', JSON.stringify(productos, null, 2) + '\n');

const porCategoria = {};
for (const p of productos) porCategoria[p.categoria] = (porCategoria[p.categoria] ?? 0) + 1;
console.log(`${productos.length} productos`, porCategoria);
console.log(`${(await readdir(DESTINO)).length} archivos en ${DESTINO}`);
