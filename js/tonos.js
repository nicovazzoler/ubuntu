// El fondo de la página toma el tono de la sección que cruza el centro de la
// pantalla. Cada sección lo declara con data-tono="crema|arena|salvia|lino";
// la transición la hace el CSS (transition en body).
export function seguirTonos() {
  const raiz = document.documentElement;
  const secciones = document.querySelectorAll('[data-tono]');

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) raiz.style.setProperty('--fondo', `var(--tono-${e.target.dataset.tono})`);
      }
    },
    // Una franja de 0px en la mitad de la pantalla: activa solo la sección que la cruza.
    { rootMargin: '-50% 0px -50% 0px' }
  );
  secciones.forEach((s) => observador.observe(s));
}
