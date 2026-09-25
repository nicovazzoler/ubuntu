import { obtenerProductos, categoriasDe, formatearPrecio } from './catalogo.js';
import { linkProducto, linkGeneral, linkIdea } from './whatsapp.js';
import { CONFIG } from './config.js';

const ICONO_WSP = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.7 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>`;

const grilla = document.querySelector('#grilla');
const filtros = document.querySelector('#filtros');
const estado = { productos: [], categoria: 'Todos' };

function tarjeta(p) {
  const li = document.createElement('li');
  const precio = p.precio !== null
    ? `<p class="tarjeta__precio">${formatearPrecio(p.precio)}</p>`
    : '';

  // Toda la tarjeta es un link: un solo elemento interactivo, todo el área tocable.
  li.innerHTML = `
    <a class="tarjeta" href="${linkProducto(p.nombre)}" target="_blank" rel="noopener noreferrer">
      <img class="tarjeta__foto" src="${p.imagen}" alt="${p.nombre}" loading="lazy" decoding="async">
      <div class="tarjeta__cuerpo">
        <h3 class="tarjeta__nombre">${p.nombre}</h3>
        ${precio}
        <span class="tarjeta__accion">${ICONO_WSP} Consultar</span>
      </div>
    </a>`;
  return li;
}

function dibujarProductos() {
  const visibles = estado.categoria === 'Todos'
    ? estado.productos
    : estado.productos.filter((p) => p.categoria === estado.categoria);

  grilla.replaceChildren();

  if (!visibles.length) {
    grilla.innerHTML = `<li class="aviso"><p>No hay productos en esta categoría.</p></li>`;
    return;
  }

  // Las primeras 4 sin lazy: son las que se ven al entrar.
  visibles.forEach((p, i) => {
    const li = tarjeta(p);
    if (i < 4) li.querySelector('img').loading = 'eager';
    grilla.append(li);
  });
}

function dibujarFiltros(categorias) {
  filtros.replaceChildren();
  ['Todos', ...categorias].forEach((cat) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'filtro';
    boton.textContent = cat;
    boton.setAttribute('aria-pressed', String(cat === estado.categoria));
    boton.addEventListener('click', () => {
      estado.categoria = cat;
      filtros.querySelectorAll('.filtro').forEach((b) =>
        b.setAttribute('aria-pressed', String(b.textContent === cat))
      );
      dibujarProductos();
    });
    filtros.append(boton);
  });
}

function dibujarEsqueletos(cantidad = 8) {
  grilla.replaceChildren();
  for (let i = 0; i < cantidad; i++) {
    const li = document.createElement('li');
    li.className = 'esqueleto';
    li.innerHTML = `<div class="esqueleto__foto"></div>
      <div class="esqueleto__linea"></div>
      <div class="esqueleto__linea esqueleto__linea--corta"></div>`;
    grilla.append(li);
  }
}

function dibujarError() {
  filtros.replaceChildren();
  grilla.innerHTML = `<li class="aviso">
      <p>No pudimos cargar el catálogo en este momento.<br>Escribinos y te mostramos todo por WhatsApp.</p>
      <a class="boton boton--wsp" href="${linkGeneral()}" target="_blank" rel="noopener noreferrer">${ICONO_WSP} Escribinos</a>
    </li>`;
}

async function iniciar() {
  dibujarEsqueletos();
  try {
    estado.productos = await obtenerProductos();
    const categorias = categoriasDe(estado.productos);
    // Con pocos productos los filtros son ruido.
    if (estado.productos.length >= 15 && categorias.length > 1) dibujarFiltros(categorias);
    dibujarProductos();
  } catch (error) {
    console.error(error);
    dibujarError();
  }
}

// El flotante entra recién cuando el hero salió de pantalla.
function botonFlotante() {
  const flotante = document.querySelector('#flotante');
  const hero = document.querySelector('#hero');
  new IntersectionObserver(
    ([entrada]) => flotante.setAttribute('data-visible', String(!entrada.isIntersecting)),
    { rootMargin: '-120px 0px 0px 0px' }
  ).observe(hero);
}

function bordeEncabezado() {
  const encabezado = document.querySelector('#encabezado');
  const marca = document.createElement('div');
  marca.style.cssText = 'position:absolute;top:1px;height:1px;width:1px';
  document.body.prepend(marca);
  new IntersectionObserver(
    ([entrada]) => encabezado.setAttribute('data-scrolleado', String(!entrada.isIntersecting))
  ).observe(marca);
}

// Los links de contacto salen de config.js, no del HTML.
function enlazarContacto() {
  document.querySelectorAll('[data-wsp]').forEach((el) => {
    el.href = el.dataset.wsp === 'idea' ? linkIdea() : linkGeneral();
  });
  document.querySelectorAll('[data-ig]').forEach((el) => {
    el.href = `https://instagram.com/${CONFIG.instagram}`;
  });
}

enlazarContacto();
iniciar();
botonFlotante();
bordeEncabezado();
