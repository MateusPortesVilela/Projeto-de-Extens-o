/**
 * App Navigation Script
 * Gerencia a navegação entre abas no app mobile
 */

function initAppNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.app-section');
  const navigationButtons = document.querySelectorAll('[data-section]');

  function navigateToSection(sectionId) {
    // Remove classe active de todos os itens
    navItems.forEach(nav => nav.classList.remove('active'));
    
    // Esconde todas as seções
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Encontra e ativa o nav item correspondente
    const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNav && activeNav.classList.contains('nav-item')) {
      activeNav.classList.add('active');
    }
    
    // Mostra a seção correspondente
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  // Navegação via navbar
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      navigateToSection(sectionId);
    });
  });

  // Navegação via buttons com data-section
  navigationButtons.forEach(button => {
    if (!button.classList.contains('nav-item')) {
      button.addEventListener('click', (e) => {
        const sectionId = button.getAttribute('data-section');
        navigateToSection(sectionId);
      });
    }
  });

  // Seleciona o primeiro item como padrão
  if (navItems.length > 0) {
    navItems[0].click();
  }
}

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppNavigation);
} else {
  initAppNavigation();
}
