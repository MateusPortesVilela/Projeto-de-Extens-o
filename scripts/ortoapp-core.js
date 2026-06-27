/**
 * ORTOAPP - Lógica central (login simulado, registros, histórico, progresso)
 * Integrado com API PHP quando disponível; fallback em localStorage.
 * Refatorado com jQuery
 */

const OrtoApp = {
  RECORDS_KEY: 'ortoapp_records',
  SESSION_KEY: 'ortoapp_session',
  _records: [],
  _exercises: [],
  _orientations: [],
  useApi: false,

  getLocalRecords() {
    try {
      return JSON.parse(localStorage.getItem(this.RECORDS_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveLocalRecord(record) {
    const records = this.getLocalRecords();
    records.unshift(record);
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    this._records = records;
  },

  getRecords() {
    return this._records;
  },

  setRecords(records) {
    this._records = records;
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY));
    } catch {
      return null;
    }
  },

  setSession(email) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  getLatestRecord() {
    const records = this.getRecords();
    return records.length ? records[0] : null;
  },

  getEvolutionText() {
    const records = this.getRecords();
    if (records.length === 0) return 'Nenhum registro ainda.';
    if (records.length === 1) return 'Primeiro registro realizado.';
    const current = records[0].painLevel;
    const previous = records[1].painLevel;
    if (current < previous) return 'Dor menor que o último registro.';
    if (current > previous) return 'Dor maior que o último registro.';
    return 'Dor estável.';
  },

  formatDate(isoString) {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  painLabel(level) {
    const labels = [
      'Sem dor', 'Dor leve', 'Dor leve', 'Dor leve',
      'Dor moderada', 'Dor moderada', 'Dor moderada',
      'Dor intensa', 'Dor intensa', 'Dor intensa', 'Dor máxima'
    ];
    return labels[level] || '—';
  },

  REMINDERS: [
    { icon: 'fa-dumbbell', title: 'Exercícios leves', text: 'Realize os exercícios indicados pelo profissional.' },
    { icon: 'fa-pills', title: 'Medicamento', text: 'Tomar medicamento, se indicado pelo profissional.' },
    { icon: 'fa-user-doctor', title: 'Retorno médico', text: 'Consulta de acompanhamento em 15 dias.' },
    { icon: 'fa-person-walking', title: 'Alongamento', text: 'Alongamento suave por 10 minutos.' },
    { icon: 'fa-heart-pulse', title: 'Registrar dor do dia', text: 'Registre como você se sente hoje.' }
  ],

  FALLBACK_ORIENTATIONS: [
    { icon: 'fa-dumbbell', title: 'Exercícios profissionais', text: 'Siga os exercícios indicados por um profissional de saúde.' },
    { icon: 'fa-ban', title: 'Evite esforço excessivo', text: 'Respeite seus limites e não force movimentos dolorosos.' },
    { icon: 'fa-bed', title: 'Repouso quando recomendado', text: 'Mantenha repouso quando orientado pelo profissional.' },
    { icon: 'fa-eye', title: 'Observe sinais de piora', text: 'Fique atento a sintomas que aumentem ou persistam.' },
    { icon: 'fa-hospital', title: 'Procure atendimento', text: 'Em caso de dor intensa ou sintomas graves, busque atendimento médico.' }
  ]
};

async function loadAppData() {
  if (typeof OrtoAppApi === 'undefined') {
    OrtoApp.useApi = false;
    OrtoApp.setRecords(OrtoApp.getLocalRecords());
    refreshAllViews();
    return;
  }

  try {
    const records = await OrtoAppApi.getPainRecords();
    const { exercises, orientations } = await OrtoAppApi.getExercises();
    OrtoApp.setRecords(records);
    OrtoApp._exercises = exercises;
    OrtoApp._orientations = orientations;
    OrtoApp.useApi = true;
  } catch (err) {
    OrtoApp.useApi = false;
    OrtoApp.setRecords(OrtoApp.getLocalRecords());
    console.warn('[ORTOAPP] Usando localStorage — banco indisponível:', err.message);
  }

  refreshAllViews();
}

function refreshAllViews() {
  renderDashboard();
  renderHistory();
  renderOrientations();
  renderExercises();
  renderReminders();
  renderProgress();
  updateApiStatus();
}

function updateApiStatus() {
  const $el = $('#api-status');
  if (!$el.length) return;
  $el.text(OrtoApp.useApi ? 'Conectado ao banco de dados' : 'Modo offline (localStorage)');
  $el.toggleClass('api-online', OrtoApp.useApi);
  $el.toggleClass('api-offline', !OrtoApp.useApi);
}

function initOrtoApp() {
  const $loginScreen = $('#login-screen');
  const $appContent = $('#app-content');

  if (!$loginScreen.length || !$appContent.length) return;

  if (OrtoApp.isLoggedIn()) {
    showApp();
  }

  // Submissão do formulário de login
  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const email = $('#login-email').val().trim();
    const password = $('#login-password').val();
    if (!email || !password) {
      showToast('Preencha e-mail e senha.');
      return;
    }
    OrtoApp.setSession(email);
    showApp();
  });

  // Botão de logout
  $('#logout-btn').on('click', function () {
    OrtoApp.clearSession();
    $appContent.addClass('hidden');
    $loginScreen.removeClass('hidden');
    $('#login-form')[0].reset();
  });

  initPainRange();
  initRegisterForm();

  // Navegação via data-goto
  $('[data-goto]').on('click', function () {
    const target = $(this).data('goto');
    if (typeof window.navigateToSection === 'function') {
      window.navigateToSection(target);
    } else {
      const $el = $('#' + target);
      if ($el.length) {
        $('html, body').animate({ scrollTop: $el.offset().top }, 'smooth');
      }
    }
  });
}

async function showApp() {
  $('#login-screen').addClass('hidden');
  $('#app-content').removeClass('hidden');
  await loadAppData();
  if (typeof window.navigateToSection === 'function') {
    window.navigateToSection('dashboard');
  }
}

function showToast(message) {
  let $toast = $('#ortoapp-toast');
  if (!$toast.length) {
    $toast = $('<div>', { id: 'ortoapp-toast', class: 'ortoapp-toast' }).appendTo('body');
  }
  $toast.text(message).addClass('visible');
  setTimeout(() => $toast.removeClass('visible'), 2500);
}

function initPainRange() {
  const $range = $('#painRange');
  const $valueEl = $('#painValue');
  const $feedbackEl = $('#painFeedback');
  if (!$range.length) return;

  function updatePainUI() {
    const val = parseInt($range.val(), 10);
    $valueEl.text(val);
    $feedbackEl.text(OrtoApp.painLabel(val));
  }

  $range.on('input', updatePainUI);
  updatePainUI();
}

function initRegisterForm() {
  const $form = $('#register-form');
  if (!$form.length) return;

  $form.on('submit', async function (e) {
    e.preventDefault();
    const painLevel = parseInt($('#painRange').val() || '0', 10);
    const symptoms = $('#symptoms-input').val().trim();
    const notes = $('#notes-input').val().trim();

    if (!symptoms) {
      showToast('Informe pelo menos um sintoma.');
      return;
    }

    const $submitBtn = $form.find('[type="submit"]');
    $submitBtn.prop('disabled', true);

    try {
      if (typeof OrtoAppApi !== 'undefined') {
        await OrtoAppApi.createPainRecord({ pain_level: painLevel, symptoms, notes });
        await loadAppData();
        showToast('Registro salvo no banco de dados!');
      } else {
        OrtoApp.saveLocalRecord({
          id: Date.now(),
          painLevel,
          symptoms,
          notes,
          createdAt: new Date().toISOString()
        });
        refreshAllViews();
        showToast('Registro salvo localmente.');
      }

      $form[0].reset();
      initPainRange();
    } catch (err) {
      try {
        OrtoApp.saveLocalRecord({
          id: Date.now(),
          painLevel,
          symptoms,
          notes,
          createdAt: new Date().toISOString()
        });
        refreshAllViews();
        showToast('Registro salvo localmente (banco offline).');
        $form[0].reset();
        initPainRange();
      } catch {
        console.error('[ORTOAPP]', err);
        showToast(err.message || 'Erro ao salvar registro.');
      }
    } finally {
      $submitBtn.prop('disabled', false);
    }
  });
}

function renderDashboard() {
  const session = OrtoApp.getSession();
  const latest = OrtoApp.getLatestRecord();
  const records = OrtoApp.getRecords();

  const $welcomeEl = $('#welcome-user');
  if ($welcomeEl.length && session) {
    const name = session.email.split('@')[0];
    $welcomeEl.text(name.charAt(0).toUpperCase() + name.slice(1));
  }

  const $painEl = $('#dashboard-pain');
  $painEl.text(latest ? latest.painLevel : '—');

  $('#dashboard-count').text(records.length);
  $('#dashboard-evolution').text(OrtoApp.getEvolutionText());
}

function renderHistory() {
  const $container = $('#history-list');
  if (!$container.length) return;

  const records = OrtoApp.getRecords();
  if (records.length === 0) {
    $container.html('<p class="empty-state">Nenhum registro encontrado ainda.</p>');
    return;
  }

  $container.html(records.map((r) => `
    <article class="history-item">
      <div class="history-item-header">
        <span class="history-date">${OrtoApp.formatDate(r.createdAt)}</span>
        <span class="history-pain">Dor: ${r.painLevel}/10</span>
      </div>
      <p><strong>Sintomas:</strong> ${escapeHtml(r.symptoms)}</p>
      ${r.notes ? `<p><strong>Observações:</strong> ${escapeHtml(r.notes)}</p>` : ''}
    </article>
  `).join(''));
}

function renderOrientations() {
  const $container = $('#orientations-list');
  if (!$container.length) return;

  const items = OrtoApp._orientations.length
    ? OrtoApp._orientations.map((o) => ({
        icon: 'fa-book-medical',
        title: o.title,
        text: o.description
      }))
    : OrtoApp.FALLBACK_ORIENTATIONS;

  $container.html(items.map((o) => `
    <div class="info-card">
      <i class="fas ${o.icon}"></i>
      <h3>${escapeHtml(o.title)}</h3>
      <p>${escapeHtml(o.text)}</p>
    </div>
  `).join(''));
}

function renderExercises() {
  const $container = $('#exercise-grid');
  if (!$container.length || !OrtoApp._exercises.length) return;

  $container.html(OrtoApp._exercises.map((ex) => `
    <div class="exercise-card">
      <h3>${escapeHtml(ex.title)}</h3>
      ${ex.duration ? `<span>${ex.duration} min</span>` : ''}
      <p>${escapeHtml(ex.level)}${ex.description ? ' — ' + escapeHtml(ex.description) : ''}</p>
      <button class="start-btn" type="button">Iniciar</button>
    </div>
  `).join(''));
}

function renderReminders() {
  const $container = $('#reminders-list');
  if (!$container.length) return;

  $container.html(OrtoApp.REMINDERS.map((r) => `
    <div class="reminder-item">
      <div class="reminder-icon"><i class="fas ${r.icon}"></i></div>
      <div class="reminder-content">
        <h3>${r.title}</h3>
        <p>${r.text}</p>
      </div>
    </div>
  `).join(''));
}

function renderProgress() {
  const latest = OrtoApp.getLatestRecord();
  const records = OrtoApp.getRecords();

  $('#progress-evolution').text(OrtoApp.getEvolutionText());
  $('#counter-records').text(records.length);
  $('#counter-last-pain').text(latest ? latest.painLevel : 0);
}

function escapeHtml(text) {
  return $('<div>').text(text).html();
}

// Executa quando o DOM estiver pronto
$(document).ready(initOrtoApp);
