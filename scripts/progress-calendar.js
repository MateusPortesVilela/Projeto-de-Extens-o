/**
 * Progress Calendar Script
 * Gera um calendário interativo de registro de exercícios
 * Atualiza o progress-card com estatísticas dinâmicas
 */

function initProgressCalendar() {
  let currentDate = new Date();
  
  // Dias marcados como completos (exemplo - pode vir de um backend)
  const completedDays = [1, 2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26];
  
  const calendarGrid = document.getElementById('calendar-grid');
  const calendarTitle = document.querySelector('.calendar-title');
  const prevBtn = document.querySelector('.prev-month');
  const nextBtn = document.querySelector('.next-month');
  
  // Elementos do progress card
  const statElements = document.querySelectorAll('.stat');
  
  function updateProgressCard(daysArray, totalDaysInMonth) {
    // Calcula a maior sequência de dias seguidos
    const longestStreak = calculateLongestStreak(daysArray);
    
    // Conta total de dias ativos
    const activeDays = daysArray.length;
    
    // Calcula porcentagem de melhora
    const improvementPercentage = Math.round((activeDays / totalDaysInMonth) * 100);
    
    // Atualiza os stats
    if (statElements[0]) {
      statElements[0].querySelector('.stat-value').textContent = longestStreak;
      statElements[0].querySelector('.stat-label').textContent = 'Sequência';
    }
    if (statElements[1]) {
      statElements[1].querySelector('.stat-value').textContent = activeDays;
      statElements[1].querySelector('.stat-label').textContent = 'Dias Ativos';
    }
    if (statElements[2]) {
      statElements[2].querySelector('.stat-value').textContent = improvementPercentage + '%';
      statElements[2].querySelector('.stat-label').textContent = 'Melhora';
    }
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
  
  function renderCalendar(date) {
    // Limpa o calendário
    calendarGrid.innerHTML = '';
    
    // Atualiza título
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    calendarTitle.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Pega o primeiro dia do mês
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // Pega o último dia do mês
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Pega o dia da semana do primeiro dia (0 = domingo)
    const startingDayOfWeek = firstDay.getDay();
    
    // Adiciona células vazias para os dias anteriores
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Adiciona os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;
      
      // Verifica se é hoje
      const today = new Date();
      if (
        day === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        dayElement.classList.add('today');
      }
      
      // Verifica se o dia está marcado como completo
      if (completedDays.includes(day)) {
        dayElement.classList.add('active');
      }
      
      // Adiciona event listener para marcar/desmarcar
      dayElement.addEventListener('click', () => {
        toggleDay(day, dayElement, completedDays);
        // Atualiza o progress card após marcar/desmarcar
        updateProgressCard(completedDays, lastDay.getDate());
      });
      
      calendarGrid.appendChild(dayElement);
    }
    
    // Atualiza o progress card com as estatísticas do mês
    updateProgressCard(completedDays, lastDay.getDate());
  }
  
  function toggleDay(day, element, daysArray) {
    const index = daysArray.indexOf(day);
    if (index > -1) {
      // Remove o dia
      daysArray.splice(index, 1);
      element.classList.remove('active');
    } else {
      // Adiciona o dia
      daysArray.push(day);
      daysArray.sort((a, b) => a - b);
      element.classList.add('active');
    }
  }
  
  // Event listeners para navegação de meses
  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });
  
  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });
  
  // Renderiza o calendário inicial
  renderCalendar(currentDate);
}

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProgressCalendar);
} else {
  initProgressCalendar();
}
