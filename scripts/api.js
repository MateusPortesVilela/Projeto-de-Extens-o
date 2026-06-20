/**
 * ORTOAPP - Comunicação com endpoints PHP
 */

const OrtoAppApi = {
  BASE: '/php',
  TEST_PATIENT_ID: '11111111-1111-1111-1111-111111111111',
  available: null,

  async request(path, options = {}) {
    const url = `${this.BASE}/${path}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Resposta inválida do servidor.');
    }

    if (!response.ok || data.ok === false) {
      throw new Error(data.erro || `Erro HTTP ${response.status}`);
    }

    this.available = true;
    return data;
  },

  async getPainRecords(patientId = this.TEST_PATIENT_ID) {
    const data = await this.request(
      `pain-records-list.php?patient_id=${encodeURIComponent(patientId)}`
    );
    return (data.records || []).map(normalizeRecord);
  },

  async createPainRecord(payload) {
    const data = await this.request('pain-records-create.php', {
      method: 'POST',
      body: JSON.stringify({
        patient_id: payload.patient_id || this.TEST_PATIENT_ID,
        pain_level: payload.pain_level,
        symptoms: payload.symptoms,
        notes: payload.notes || '',
      }),
    });
    return data;
  },

  async getExercises() {
    const data = await this.request('exercises-list.php');
    return {
      exercises: data.exercises || [],
      orientations: data.orientations || [],
    };
  },

  async checkConnection() {
    try {
      await this.getPainRecords();
      this.available = true;
      return true;
    } catch (err) {
      this.available = false;
      console.warn('[ORTOAPP] API indisponível:', err.message);
      return false;
    }
  },
};

function normalizeRecord(row) {
  return {
    id: row.id,
    painLevel: row.pain_level,
    symptoms: row.symptoms || '',
    notes: row.notes || '',
    createdAt: row.created_at,
  };
}

window.OrtoAppApi = OrtoAppApi;

async function createPainRecord(data) {
  return OrtoAppApi.createPainRecord(data);
}

async function getPainRecords() {
  return OrtoAppApi.getPainRecords();
}

async function getExercises() {
  return OrtoAppApi.getExercises();
}

window.createPainRecord = createPainRecord;
window.getPainRecords = getPainRecords;
window.getExercises = getExercises;
