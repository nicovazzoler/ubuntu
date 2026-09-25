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

  // Fuente del catálogo. Al conectar Drive se cambia acá y en js/catalogo.js.
  catalogo: 'assets/catalogo.json',
};
