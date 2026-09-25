import { CONFIG } from './config.js';

// wa.me necesita el texto URL-encoded o el mensaje llega cortado.
function link(texto) {
  const cuerpo = CONFIG.sitio ? `${texto}\n\n${CONFIG.sitio}` : texto;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(cuerpo)}`;
}

export const linkGeneral = () => link(CONFIG.mensajes.general);
export const linkIdea = () => link(CONFIG.mensajes.idea);
export const linkProducto = (nombre) => link(CONFIG.mensajes.producto(nombre));
