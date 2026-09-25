import { CONFIG } from './config.js';

// Único archivo que sabe de dónde salen los productos. El resto de la página
// consume la lista que devuelve obtenerProductos() sin preguntar por la fuente:
// cambiar a Drive o a Sheets es reescribir esta función y nada más.

export async function obtenerProductos() {
  const respuesta = await fetch(CONFIG.catalogo);
  if (!respuesta.ok) throw new Error(`No se pudo leer el catálogo (${respuesta.status})`);
  const crudo = await respuesta.json();
  return crudo.map(normalizar);
}

function normalizar(item) {
  return {
    id: item.id,
    nombre: item.nombre,
    precio: typeof item.precio === 'number' ? item.precio : null,
    categoria: item.categoria || 'Otros',
    imagen: item.imagen,
    imagenGrande: item.imagenGrande || item.imagen,
  };
}

export function categoriasDe(productos) {
  return [...new Set(productos.map((p) => p.categoria))].sort((a, b) =>
    a.localeCompare(b, 'es')
  );
}

const formato = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const formatearPrecio = (precio) => formato.format(precio);
