/**
 * ORTOAPP - Interações extras da versão desktop (carrossel, contadores)
 * Refatorado com jQuery
 */

function initDesktopExtras() {
  initCarousel();
  initCounters();
}

function initCarousel() {
  const $slides = $('.carousel .slide');
  const $prevBtn = $('#prev');
  const $nextBtn = $('#next');
  if (!$slides.length) return;

  let current = 0;

  function showSlide(index) {
    $slides.removeClass('active').eq(index).addClass('active');
  }

  $prevBtn.on('click', () => {
    current = (current - 1 + $slides.length) % $slides.length;
    showSlide(current);
  });

  $nextBtn.on('click', () => {
    current = (current + 1) % $slides.length;
    showSlide(current);
  });

  setInterval(() => {
    current = (current + 1) % $slides.length;
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
    const $progressSection = $('#progresso');
    if (!$progressSection.length) return;

    const rect = $progressSection[0].getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    animated = true;
    counters.forEach(({ id, target, suffix = '' }) => {
      const $el = $('#' + id);
      if (!$el.length || id.startsWith('counter-records') || id.startsWith('counter-last')) return;

      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        $el.text(current + suffix);
      }, 30);
    });
  }

  $(window).on('scroll', animateCounters);
  animateCounters();
}

$(document).ready(initDesktopExtras);
