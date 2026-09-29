// Los bloques entran con un fundido corto la primera vez que aparecen en
// pantalla. Solo bloques de sección: las tarjetas de la grilla quedan quietas,
// porque 24 cosas moviéndose a la vez marean (Plan 4 §6).

const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observador = reducir ? null : new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visible');
      observador.unobserve(e.target);   // una sola vez
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
