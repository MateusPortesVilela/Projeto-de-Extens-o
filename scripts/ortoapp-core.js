/**
 * ORTOAPP - Lógica central (login simulado, registros, histórico, progresso)
 * Integrado com API PHP quando disponível; fallback em localStorage.
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
  const el = document.getElementById('api-status');
  if (!el) return;
  el.textContent = OrtoApp.useApi
    ? 'Conectado ao banco de dados'
    : 'Modo offline (localStorage)';
  el.classList.toggle('api-online', OrtoApp.useApi);
  el.classList.toggle('api-offline', !OrtoApp.useApi);
}

function initOrtoApp() {
  const loginScreen = document.getElementById('login-screen');
  const appContent = document.getElementById('app-content');

  if (!loginScreen || !appContent) return;

  if (OrtoApp.isLoggedIn()) {
    showApp();
  }

  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    if (!email || !password) {
      showToast('Preencha e-mail e senha.');
      return;
    }
    OrtoApp.setSession(email);
    showApp();
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    OrtoApp.clearSession();
    appContent.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginForm?.reset();
  });

  initPainRange();
  initRegisterForm();

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-goto');
      if (typeof window.navigateToSection === 'function') {
        window.navigateToSection(target);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

async function showApp() {
  const loginScreen = document.getElementById('login-screen');
  const appContent = document.getElementById('app-content');
  loginScreen?.classList.add('hidden');
  appContent?.classList.remove('hidden');
  await loadAppData();
  if (typeof window.navigateToSection === 'function') {
    window.navigateToSection('dashboard');
  }
}

function showToast(message) {
  let toast = document.getElementById('ortoapp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ortoapp-toast';
    toast.className = 'ortoapp-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

function initPainRange() {
  const range = document.getElementById('painRange');
  const valueEl = document.getElementById('painValue');
  const feedbackEl = document.getElementById('painFeedback');
  if (!range) return;

  function updatePainUI() {
    const val = parseInt(range.value, 10);
    if (valueEl) valueEl.textContent = val;
    if (feedbackEl) feedbackEl.textContent = OrtoApp.painLabel(val);
  }

  range.addEventListener('input', updatePainUI);
  updatePainUI();
}

function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const painLevel = parseInt(document.getElementById('painRange')?.value || '0', 10);
    const symptoms = document.getElementById('symptoms-input')?.value.trim();
    const notes = document.getElementById('notes-input')?.value.trim();

    if (!symptoms) {
      showToast('Informe pelo menos um sintoma.');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

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

      form.reset();
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
        form.reset();
        initPainRange();
      } catch {
        console.error('[ORTOAPP]', err);
        showToast(err.message || 'Erro ao salvar registro.');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function renderDashboard() {
  const session = OrtoApp.getSession();
  const latest = OrtoApp.getLatestRecord();
  const records = OrtoApp.getRecords();

  const welcomeEl = document.getElementById('welcome-user');
  if (welcomeEl && session) {
    const name = session.email.split('@')[0];
    welcomeEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }

  const painEl = document.getElementById('dashboard-pain');
  if (painEl) painEl.textContent = latest ? latest.painLevel : '—';

  const countEl = document.getElementById('dashboard-count');
  if (countEl) countEl.textContent = records.length;

  const evolutionEl = document.getElementById('dashboard-evolution');
  if (evolutionEl) evolutionEl.textContent = OrtoApp.getEvolutionText();
}

function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  const records = OrtoApp.getRecords();
  if (records.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum registro encontrado ainda.</p>';
    return;
  }

  container.innerHTML = records.map((r) => `
    <article class="history-item">
      <div class="history-item-header">
        <span class="history-date">${OrtoApp.formatDate(r.createdAt)}</span>
        <span class="history-pain">Dor: ${r.painLevel}/10</span>
      </div>
      <p><strong>Sintomas:</strong> ${escapeHtml(r.symptoms)}</p>
      ${r.notes ? `<p><strong>Observações:</strong> ${escapeHtml(r.notes)}</p>` : ''}
    </article>
  `).join('');
}

function renderOrientations() {
  const container = document.getElementById('orientations-list');
  if (!container) return;

  const items = OrtoApp._orientations.length
    ? OrtoApp._orientations.map((o) => ({
        icon: 'fa-book-medical',
        title: o.title,
        text: o.description
      }))
    : OrtoApp.FALLBACK_ORIENTATIONS;

  container.innerHTML = items.map((o) => `
    <div class="info-card">
      <i class="fas ${o.icon}"></i>
      <h3>${escapeHtml(o.title)}</h3>
      <p>${escapeHtml(o.text)}</p>
    </div>
  `).join('');
}

function renderExercises() {
  const container = document.getElementById('exercise-grid');
  if (!container || !OrtoApp._exercises.length) return;

  container.innerHTML = OrtoApp._exercises.map((ex) => `
    <div class="exercise-card">
      <h3>${escapeHtml(ex.title)}</h3>
      ${ex.duration ? `<span>${ex.duration} min</span>` : ''}
      <p>${escapeHtml(ex.level)}${ex.description ? ' — ' + escapeHtml(ex.description) : ''}</p>
      <button class="start-btn" type="button">Iniciar</button>
    </div>
  `).join('');
}

function renderReminders() {
  const container = document.getElementById('reminders-list');
  if (!container) return;

  container.innerHTML = OrtoApp.REMINDERS.map((r) => `
    <div class="reminder-item">
      <div class="reminder-icon"><i class="fas ${r.icon}"></i></div>
      <div class="reminder-content">
        <h3>${r.title}</h3>
        <p>${r.text}</p>
      </div>
    </div>
  `).join('');
}

function renderProgress() {
  const latest = OrtoApp.getLatestRecord();
  const records = OrtoApp.getRecords();

  const evolutionText = document.getElementById('progress-evolution');
  if (evolutionText) evolutionText.textContent = OrtoApp.getEvolutionText();

  const counter2 = document.getElementById('counter-records');
  if (counter2) counter2.textContent = records.length;

  const counter1 = document.getElementById('counter-last-pain');
  if (counter1) counter1.textContent = latest ? latest.painLevel : 0;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrtoApp);
} else {
  initOrtoApp();
}
