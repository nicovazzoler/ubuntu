// Fundido corto la primera vez que un bloque de sección entra en pantalla.
// Las tarjetas de la grilla no: 24 cosas moviéndose a la vez marean.

const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observador = reducir ? null : new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visible');
      observador.unobserve(e.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' }
);

if (observador) document.documentElement.classList.add('anima');

// escalonado: separación en ms entre elementos del mismo grupo
export function aparecer(selector, escalonado = 0) {
  if (!observador) return;
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.setProperty('--retraso', `${i * escalonado}ms`);
    el.setAttribute('data-aparecer', '');
    observador.observe(el);
  });
}
