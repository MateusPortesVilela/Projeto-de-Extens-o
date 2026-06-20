/**
 * Mobile Redirect Script
 * Detecta dispositivos mobile (≤ 480px) e redireciona automaticamente
 * Funciona em qualquer página (index.html -> mobile.html)
 */

function checkAndRedirectMobile() {
  const MOBILE_BREAKPOINT = 480;
  const currentUrl = window.location.pathname;
  
  // Verifica se está em mobile
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  
  // Verifica se está em index.html (desktop) ou mobile.html
  const isDesktopPage = currentUrl.includes('index.html') || currentUrl === '/';
  const isMobilePage = currentUrl.includes('mobile.html');
  
  // Se estiver em mobile e na página desktop, redireciona para mobile
  if (isMobile && isDesktopPage) {
    window.location.href = '/mobile.html';
  }
  
  // Se estiver em desktop (> 480px) e na página mobile, redireciona para desktop
  if (!isMobile && isMobilePage) {
    window.location.href = '/index.html';
  }
}

// Executa imediatamente (antes de renderizar)
checkAndRedirectMobile();

// Também detecta mudanças de tamanho de tela (responsivo)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    checkAndRedirectMobile();
  }, 250);
});
