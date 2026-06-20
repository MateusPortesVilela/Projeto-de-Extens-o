/**
 * Home Scroll Effect Script
 * Cria efeito de scroll parallax com background verde e textos aparecendo
 */

function initHomeScrollEffect() {
  const homeSection = document.getElementById('home');
  const scrollTexts = document.querySelectorAll('.scroll-text');
  
  if (!homeSection) return;

  function handleScroll() {
    // Pega a posição da home section
    const homeRect = homeSection.getBoundingClientRect();
    const homeSectionTop = homeSection.offsetTop;
    const homeSectionHeight = homeSection.offsetHeight;
    
    // Calcula quanto foi feito scroll dentro da seção home
    const scrollPosition = window.scrollY - homeSectionTop;
    const maxScroll = homeSectionHeight * 0.7; // 70% da altura
    
    if (scrollPosition > 0 && scrollPosition < homeSectionHeight) {
      // Calcula o progresso do scroll (0 a 1)
      const scrollProgress = Math.min(scrollPosition / maxScroll, 1);
      
      // Atualiza background color para verde translucido
      const greenValue = Math.floor(16 + (184 * scrollProgress)); // 10B981
      const alpha = Math.min(scrollProgress * 0.6, 0.6);
      homeSection.style.backgroundColor = `rgba(16, 185, 129, ${alpha})`;
      
      // Mostra os textos progressivamente
      scrollTexts.forEach((text, index) => {
        // Cada texto aparece em um ponto diferente do scroll
        const textTrigger = (index + 1) * (maxScroll / scrollTexts.length);
        
        if (scrollPosition >= textTrigger * 0.7) {
          text.classList.add('visible');
        } else {
          text.classList.remove('visible');
        }
      });
    } else if (scrollPosition >= homeSectionHeight) {
      // Reseta quando sair da seção
      homeSection.style.backgroundColor = 'transparent';
      scrollTexts.forEach(text => text.classList.remove('visible'));
    }
  }

  // Listener para scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomeScrollEffect);
} else {
  initHomeScrollEffect();
}
