/**
 * App Navigation Script
 * Gerencia a navegação entre abas no app mobile
 * Refatorado com jQuery
 */

function initAppNavigation() {
  const $navItems = $('.nav-item');
  const $sections = $('.app-section');
  const $navigationButtons = $('[data-section]');

  if (!$navItems.length) return;

  function navigateToSection(sectionId) {
    // Remove classe active de todos os itens de navegação
    $navItems.removeClass('active');

    // Esconde todas as seções
    $sections.hide();

    // Ativa o nav item correspondente
    $(`[data-section="${sectionId}"].nav-item`).addClass('active');

    // Mostra a seção correspondente e rola para o topo
    const $target = $('#' + sectionId);
    if ($target.length) {
      $target.show();
      window.scrollTo(0, 0);
    }
  }

  window.navigateToSection = navigateToSection;

  // Navegação via navbar
  $navItems.on('click', function () {
    navigateToSection($(this).data('section'));
  });

  // Navegação via botões com data-section (que não são nav-item)
  $navigationButtons.each(function () {
    const $btn = $(this);
    if (!$btn.hasClass('nav-item')) {
      $btn.on('click', function () {
        navigateToSection($btn.data('section'));
      });
    }
  });

  // Só inicia navegação se o app estiver visível (logado)
  if ($navItems.length > 0 && !$('#login-screen').hasClass('hidden')) {
    return;
  }

  if ($navItems.length > 0) {
    $navItems.first().trigger('click');
  }
}

// Executa quando o DOM estiver pronto
$(document).ready(initAppNavigation);
