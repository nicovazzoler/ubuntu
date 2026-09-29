import { CONFIG } from './config.js';
import { clave } from './catalogo.js';

// Google corta a veces las descargas de Drive (403 intermitente): la misma foto
// baja bien un segundo después. Cada imagen que falla reintenta una vez y, si
// sigue fallando, usa la foto de la copia local; si el producto es nuevo y no
// está en la copia, muestra el isotipo en vez de la imagen rota.

const REEMPLAZO = 'assets/marca/isotipo.png';
let copiaLocal = null;   // se carga recién con la primera falla

// grande: la original, para el visor; si no, la versión chica de las tarjetas.
function fotoLocal(producto, grande = false) {
  copiaLocal ??= fetch(CONFIG.catalogoLocal)
    .then((r) => (r.ok ? r.json() : []))
    .then((lista) => new Map(lista.map((p) => [clave(p), p])))
    .catch(() => new Map());
  return copiaLocal.then((mapa) => {
    const p = mapa.get(clave(producto));
    return p && (grande ? p.imagen : p.mini || p.imagen);
  });
}

const reemplazar = (img) => { img.src = REEMPLAZO; img.classList.add('foto-reemplazo'); };

export function conRespaldo(img, producto) {
  let paso = 0;
  img.addEventListener('error', async () => {
    // Una foto del propio sitio que falla no mejora reintentando ni en Drive.
    if (!img.src.includes('googleapis.com')) { if (!img.src.endsWith(REEMPLAZO)) reemplazar(img); return; }
    paso++;
    if (paso === 1) {
      // espera al azar entre 0,8 y 1,6 s: si fallaron varias juntas, no reintentan todas a la vez
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 800));
      img.src = `${img.src.split('&r=')[0]}&r=${Date.now()}`;
    } else if (paso === 2) {
      const local = await fotoLocal(producto);
      if (local) img.src = local;
      else { img.src = REEMPLAZO; img.classList.add('foto-reemplazo'); }
    } else if (!img.src.endsWith(REEMPLAZO)) {
      img.src = REEMPLAZO; img.classList.add('foto-reemplazo');
    }
  });
}

// El visor usa una sola <img> para todos los productos: el respaldo tiene que
// saber cuál se está mostrando. Devuelve la función que cambia de producto.
export function visorConRespaldo(img) {
  let actual = null;
  let intento = 0;
  img.addEventListener('error', async () => {
    const p = actual;
    if (!p) return;
    intento++;
    if (intento === 1) {
      const local = await fotoLocal(p, true);
      if (p !== actual) return;   // mientras esperaba, pasaron a otro producto
      if (local) img.src = local;
      else { img.src = REEMPLAZO; img.classList.add('foto-reemplazo'); }
    } else if (!img.src.endsWith(REEMPLAZO)) {
      img.src = REEMPLAZO; img.classList.add('foto-reemplazo');
    }
  });
  return (p) => {
    actual = p;
    intento = 0;
    img.classList.remove('foto-reemplazo');
    img.src = p.imagenGrande;
  };
}
