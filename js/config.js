// Único lugar donde viven los datos de contacto y la fuente del catálogo.
export const CONFIG = {
  marca: 'Ubuntu estudio',
  lema: 'Hecho a mano, pensado para vos',
  zona: 'Morón, Buenos Aires',

  whatsapp: '5491172388119',   // con 54 y el 9 de celular, sin + ni espacios
  instagram: 'Ubuntu.estudio',
  sitio: '',                   // URL pública; se agrega a los mensajes cuando exista

  mensajes: {
    general: 'Hola Ubuntu! Vi la página y quería hacerles una consulta 😊',
    producto: (nombre) => `Hola Ubuntu! Me interesa este producto:\n*${nombre}*\n¿Me pasan precio y disponibilidad?`,
    idea: 'Hola Ubuntu! Tengo una idea para un pedido y quería contarles 😊',
  },

  drive: {
    carpeta: '1WCDLU_cJfaxKQIlLdzfhsQec2gwo1j-Q',
    // Key de navegador, solo lectura, restringida al dominio del sitio. Queda a
    // la vista en el código y está bien: solo sirve para leer una carpeta que
    // ya es pública. Vacía, la página usa la copia local de assets/.
    apiKey: 'AIzaSyBTIRHrcbpOXe1CVppc4lvQiUe-YA5VQH4',
  },

  // Copia de respaldo: se usa si no hay key o si Drive no responde.
  catalogoLocal: 'assets/catalogo.json',
};
