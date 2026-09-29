import { formatearPrecio } from './catalogo.js';
import { linkProducto } from './whatsapp.js';
import { visorConRespaldo } from './imagenes.js';

// Foto grande de un producto, con anterior/siguiente dentro de la lista que se
// está mostrando (respeta el filtro de categoría). Usa <dialog> nativo: el
// navegador ya resuelve el foco, la tecla Esc y el fondo oscurecido.

const visor = document.querySelector('#visor');
const foto = visor.querySelector('#visor-foto');
const ponerFoto = visorConRespaldo(foto);
const estado = { lista: [], i: 0 };

export function abrirVisor(lista, i) {
  estado.lista = lista;
  mostrar(i);
  document.documentElement.classList.add('sin-scroll');
  visor.showModal();
}

function mostrar(i) {
  const n = estado.lista.length;
  estado.i = (i + n) % n;   // de la última vuelve a la primera
  const p = estado.lista[estado.i];

  foto.classList.remove('cargada');
  foto.onload = () => foto.classList.add('cargada');
  ponerFoto(p);
  foto.alt = p.nombre;
  visor.querySelector('#visor-nombre').textContent = p.nombre;
  visor.querySelector('#visor-categoria').textContent = p.categoria;
  visor.querySelector('#visor-precio').textContent = p.precio !== null ? formatearPrecio(p.precio) : '';
  visor.querySelector('#visor-consultar').href = linkProducto(p);
  visor.querySelector('#visor-posicion').textContent = `${estado.i + 1} / ${n}`;

  const hayMas = n > 1;
  visor.querySelectorAll('.visor__nav').forEach((b) => (b.hidden = !hayMas));
}

visor.querySelector('.visor__nav--ant').addEventListener('click', () => mostrar(estado.i - 1));
visor.querySelector('.visor__nav--sig').addEventListener('click', () => mostrar(estado.i + 1));
visor.querySelector('.visor__cerrar').addEventListener('click', () => visor.close());
visor.addEventListener('close', () => document.documentElement.classList.remove('sin-scroll'));

// Click en el fondo oscuro (fuera del contenido) cierra.
visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });

visor.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') mostrar(estado.i - 1);
  if (e.key === 'ArrowRight') mostrar(estado.i + 1);
});

// Deslizar con el dedo en el celular. 50px para no confundirlo con un toque.
let inicioX = null;
visor.addEventListener('touchstart', (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
visor.addEventListener('touchend', (e) => {
  if (inicioX === null) return;
  const dx = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(dx) > 50) mostrar(estado.i + (dx < 0 ? 1 : -1));
  inicioX = null;
});
