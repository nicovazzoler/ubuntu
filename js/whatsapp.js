import { CONFIG } from './config.js';

// wa.me necesita el texto URL-encoded o el mensaje llega cortado.
function link(texto) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const linkGeneral = () => link(CONFIG.mensajes.general);
export const linkIdea = () => link(CONFIG.mensajes.idea);
// "Velas con sticker - Mafalda". Lo que está suelto en la raíz de Drive cae en
// "Otros", y ahí la categoría no aporta nada: va solo el nombre.
const detalle = (p) => (p.categoria && p.categoria !== 'Otros' ? `${p.categoria} - ${p.nombre}` : p.nombre);

export const linkProducto = (p) => link(CONFIG.mensajes.producto(detalle(p)));
