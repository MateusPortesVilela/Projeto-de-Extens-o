/**
 * ORTOAPP - Interações extras da versão desktop (carrossel, contadores)
 */

function initDesktopExtras() {
  initCarousel();
  initCounters();
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel .slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (!slides.length) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    slides[index].classList.add('active');
  }

  prevBtn?.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  nextBtn?.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
}

function initCounters() {
  const counters = [
    { id: 'counter1', target: 24 },
    { id: 'counter2', target: 7 },
    { id: 'counter3', target: 5 },
    { id: 'counter4', target: 78, suffix: '%' }
  ];

  let animated = false;

  function animateCounters() {
    if (animated) return;
    const progressSection = document.getElementById('progresso');
    if (!progressSection) return;

    const rect = progressSection.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    animated = true;
    counters.forEach(({ id, target, suffix = '' }) => {
      const el = document.getElementById(id);
      if (!el || el.id.startsWith('counter-records') || el.id.startsWith('counter-last')) return;

      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 30);
    });
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDesktopExtras);
} else {
  initDesktopExtras();
}
