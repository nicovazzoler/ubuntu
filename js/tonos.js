// El fondo de la página toma el tono de la sección que cruza el centro de la
// pantalla (data-tono="crema|arena"); la transición la hace el CSS. Aparte, el
// encabezado se oscurece mientras tiene debajo una sección data-tema="oscuro".
export function seguirTonos() {
  const raiz = document.documentElement;

  const porTono = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) raiz.style.setProperty('--fondo', `var(--tono-${e.target.dataset.tono})`);
      }
    },
    // Una franja de 0px en la mitad de la pantalla: activa solo la sección que la cruza.
    { rootMargin: '-50% 0px -50% 0px' }
  );
  document.querySelectorAll('[data-tono]').forEach((s) => porTono.observe(s));

  // Franja de 0px a la altura de la base del encabezado (64px desde arriba).
  const oscurasBajoCabecera = new Set();
  const porCabecera = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) oscurasBajoCabecera.add(e.target);
        else oscurasBajoCabecera.delete(e.target);
      }
      if (oscurasBajoCabecera.size) raiz.dataset.cabecera = 'oscura';
      else delete raiz.dataset.cabecera;
    },
    { rootMargin: `-64px 0px ${-(window.innerHeight - 65)}px 0px` }
  );
  document.querySelectorAll('[data-tema="oscuro"]').forEach((s) => porCabecera.observe(s));
}
