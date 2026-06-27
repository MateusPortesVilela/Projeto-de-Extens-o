/**
 * Progress Calendar Script
 * Gera um calendário interativo de registro de exercícios
 * Atualiza o progress-card com estatísticas dinâmicas
 * Refatorado com jQuery
 */

function initProgressCalendar() {
  const $calendarGrid = $('#calendar-grid');
  if (!$calendarGrid.length) return;

  let currentDate = new Date();
  const completedDays = [1, 2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26];

  const $calendarTitle = $('.calendar-title');
  const $prevBtn = $('.prev-month');
  const $nextBtn = $('.next-month');

  // Não sobrescreve stats do ORTOAPP (registros de dor)
  const $statElements = $('#counter-last-pain').length
    ? $()
    : $('.stat');

  function updateProgressCard(daysArray, totalDaysInMonth) {
    const longestStreak = calculateLongestStreak(daysArray);
    const activeDays = daysArray.length;
    const improvementPercentage = Math.round((activeDays / totalDaysInMonth) * 100);

    if ($statElements.eq(0).length) {
      $statElements.eq(0).find('.stat-value').text(longestStreak);
      $statElements.eq(0).find('.stat-label').text('Sequência');
    }
    if ($statElements.eq(1).length) {
      $statElements.eq(1).find('.stat-value').text(activeDays);
      $statElements.eq(1).find('.stat-label').text('Dias Ativos');
    }
    if ($statElements.eq(2).length) {
      $statElements.eq(2).find('.stat-value').text(improvementPercentage + '%');
      $statElements.eq(2).find('.stat-label').text('Melhora');
    }
  }

  function updateCalendarStats(daysArray, totalDaysInMonth) {
    const streak = calculateCurrentStreak(daysArray);
    const total = daysArray.length;
    const frequency = totalDaysInMonth > 0
      ? Math.round((total / totalDaysInMonth) * 100)
      : 0;

    $('#cal-streak').text(streak);
    $('#cal-total').text(total);
    $('#cal-frequency').text(frequency + '%');
  }

  function calculateLongestStreak(daysArray) {
    if (daysArray.length === 0) return 0;

    const sorted = [...daysArray].sort((a, b) => a - b);
    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }

  // Calcula a sequência atual (a partir do último dia marcado, de trás pra frente)
  function calculateCurrentStreak(daysArray) {
    if (daysArray.length === 0) return 0;

    const sorted = [...daysArray].sort((a, b) => a - b);
    let streak = 1;

    for (let i = sorted.length - 1; i > 0; i--) {
      if (sorted[i] === sorted[i - 1] + 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function renderCalendar(date) {
    // Limpa o calendário
    $calendarGrid.empty();

    // Atualiza título
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    $calendarTitle.text(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();

    // Adiciona células vazias para os dias anteriores
    for (let i = 0; i < startingDayOfWeek; i++) {
      $('<div>').addClass('calendar-day empty').appendTo($calendarGrid);
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const isToday = (
        day === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );

      const $dayElement = $('<div>')
        .addClass('calendar-day')
        .text(day)
        .toggleClass('today', isToday)
        .toggleClass('active', completedDays.includes(day))
        .on('click', function () {
          toggleDay(day, $(this), completedDays);
          updateProgressCard(completedDays, lastDay.getDate());
          updateCalendarStats(completedDays, lastDay.getDate());
        });

      $calendarGrid.append($dayElement);
    }

    // Atualiza o progress card com as estatísticas do mês
    updateProgressCard(completedDays, lastDay.getDate());
    updateCalendarStats(completedDays, lastDay.getDate());
  }

  function toggleDay(day, $element, daysArray) {
    const index = daysArray.indexOf(day);
    if (index > -1) {
      daysArray.splice(index, 1);
      $element.removeClass('active');
    } else {
      daysArray.push(day);
      daysArray.sort((a, b) => a - b);
      $element.addClass('active');
    }
  }

  // Event listeners para navegação de meses
  $prevBtn.on('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  $nextBtn.on('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Renderiza o calendário inicial
  renderCalendar(currentDate);
}

// Executa quando o DOM estiver pronto
$(document).ready(initProgressCalendar);
