// ================================================================
// SISTEMA DE VENDAS — LojaVendas
// main.js — Lógica de frontend, chamadas AJAX e interatividade
// ================================================================

// Detecta se estamos em pages/ ou na raiz
const isSubpage = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
const BASE_URL  = isSubpage ? '../php/' : 'php/';

// ================================================================
// UTILITÁRIOS
// ================================================================

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const p = dateStr.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function showAlert(targetId, message, type = 'success') {
  const container = typeof targetId === 'string'
    ? document.getElementById(targetId) : targetId;
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `alert alert-${type} animate-in`;
  el.innerHTML = `<span>${icons[type] || ''}</span> <span>${message}</span>`;
  container.prepend(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  }, 5500);
}

function showLoading(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="loading"></span> Processando...`;
  btn.disabled = true;
  return () => { btn.innerHTML = orig; btn.disabled = false; };
}

async function apiGet(endpoint, params = {}) {
  const url = new URL(BASE_URL + endpoint, window.location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res  = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) throw new Error(json.erro || `HTTP ${res.status}`);
  return json;
}

async function apiPost(endpoint, data) {
  const res = await fetch(BASE_URL + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

function loadingRow(cols) {
  return `<tr><td colspan="${cols}" style="text-align:center;padding:32px;color:var(--text-muted)">
    <span class="loading"></span>&nbsp; Carregando...</td></tr>`;
}
function emptyRow(cols, msg) {
  return `<tr><td colspan="${cols}" style="text-align:center;padding:32px;color:var(--text-muted)">${msg}</td></tr>`;
}
function loadingCenter() {
  return `<div class="loading-center"><span class="loading loading-lg"></span><span>Carregando dados...</span></div>`;
}

// ================================================================
// SIDEBAR & DATA
// ================================================================

function updateDateDisplay() {
  const el = document.getElementById('current-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function initSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  const close = () => { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); };
  const open  = () => { sidebar?.classList.add('open');    overlay?.classList.add('active'); };

  toggle?.addEventListener('click', () => sidebar?.classList.contains('open') ? close() : open());
  overlay?.addEventListener('click', close);

  // Marcar item ativo pelo nome do arquivo atual
  const current = window.location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('.nav-item[data-page]').forEach(item =>
    item.classList.toggle('active', item.dataset.page === current)
  );
}

// ================================================================
// DASHBOARD
// ================================================================

async function initDashboard() {
  try {
    const data = await apiGet('vendas.php', { data: todayISO() });
    const qtd  = data.quantidade ?? 0;
    const pct  = (qtd / 50) * 100;

    setEl('stat-vendas',   qtd);
    setEl('stat-total',    formatCurrency(data.total_dia));
    setEl('stat-restante', data.restante ?? 50);
    setEl('pct-label',     `${Math.round(pct)}%`);

    const bar = document.getElementById('limit-bar');
    if (bar) { bar.style.width = `${pct}%`; if (pct >= 80) bar.classList.add('danger'); }

    const tbody = document.getElementById('recent-tbody');
    if (tbody) {
      tbody.innerHTML = data.vendas?.length
        ? data.vendas.slice(0, 8).map(v => `
            <tr class="animate-in">
              <td class="muted">#${v.id_venda}</td>
              <td>${v.cliente}</td>
              <td class="money">${formatCurrency(v.total_venda)}</td>
            </tr>`).join('')
        : emptyRow(3, 'Nenhuma venda hoje.');
    }
  } catch(e) { console.error('Dashboard error:', e); }

  try {
    const devs = await apiGet('devolucoes.php');
    setEl('stat-dev', devs.filter(d => d.devolucoes > 0).length);
  } catch {}

  try {
    const prods = await apiGet('produtos.php');
    setEl('stat-produtos', prods.length);
  } catch {}
}

// ================================================================
// CLIENTES
// ================================================================

async function initClientes() {
  await loadClientes();

  document.getElementById('form-cliente')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = e.target.querySelector('[type=submit]');
    const restore = showLoading(btn);
    const nome    = document.getElementById('nome-cliente').value.trim();

    if (!nome || nome.length < 3) {
      showAlert('alert-area', 'Nome inválido. Mínimo de 3 caracteres.', 'error');
      restore(); return;
    }

    const result = await apiPost('clientes.php', { nome });
    restore();

    if (result.erro) {
      showAlert('alert-area', result.erro, 'error');
    } else {
      showAlert('alert-area', `Cliente "${nome}" cadastrado com sucesso!`, 'success');
      e.target.reset();
      await loadClientes();
    }
  });
}

async function loadClientes() {
  const tbody = document.getElementById('clientes-tbody');
  if (!tbody) return;
  tbody.innerHTML = loadingRow(2);
  try {
    const list = await apiGet('clientes.php');
    if (!list.length) { tbody.innerHTML = emptyRow(2, 'Nenhum cliente cadastrado ainda.'); return; }
    tbody.innerHTML = list.map((c, i) => `
      <tr class="animate-in" style="animation-delay:${i*0.04}s">
        <td class="muted">#${c.id_cliente}</td>
        <td>${c.nome}</td>
      </tr>`).join('');
  } catch(e) { tbody.innerHTML = emptyRow(2, '❌ Erro ao carregar clientes.'); }
}

// ================================================================
// PRODUTOS
// ================================================================

async function initProdutos() {
  await loadProdutos();

  document.getElementById('form-produto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = e.target.querySelector('[type=submit]');
    const restore = showLoading(btn);
    const nome    = document.getElementById('nome-produto').value.trim();
    const preco   = parseFloat(document.getElementById('preco-produto').value);

    if (!nome || nome.length < 2) { showAlert('alert-area', 'Nome inválido (mínimo 2 caracteres).', 'error'); restore(); return; }
    if (isNaN(preco) || preco <= 0) { showAlert('alert-area', 'Informe um preço válido maior que zero.', 'error'); restore(); return; }

    const result = await apiPost('produtos.php', { nome, preco });
    restore();

    if (result.erro) {
      showAlert('alert-area', result.erro, 'error');
    } else {
      showAlert('alert-area', `Produto "${nome}" cadastrado — ${formatCurrency(preco)}`, 'success');
      e.target.reset();
      await loadProdutos();
    }
  });
}

async function loadProdutos() {
  const tbody = document.getElementById('produtos-tbody');
  if (!tbody) return;
  tbody.innerHTML = loadingRow(3);
  try {
    const list = await apiGet('produtos.php');
    if (!list.length) { tbody.innerHTML = emptyRow(3, 'Nenhum produto cadastrado ainda.'); return; }
    tbody.innerHTML = list.map((p, i) => `
      <tr class="animate-in" style="animation-delay:${i*0.04}s">
        <td class="muted">#${p.id_produto}</td>
        <td>${p.nome}</td>
        <td class="money">${formatCurrency(p.preco)}</td>
      </tr>`).join('');
  } catch(e) { tbody.innerHTML = emptyRow(3, '❌ Erro ao carregar produtos.'); }
}

// ================================================================
// VENDAS
// ================================================================

let itensVenda    = [];
let produtosCache = [];

async function initVendas() {
  try {
    const stats    = await apiGet('vendas.php', { data: todayISO() });
    const qtd      = stats.quantidade ?? 0;
    const restante = stats.restante ?? 50;

    setEl('limit-info',    `${qtd} / 50 vendas hoje`);
    setEl('restante-info', `${restante} restante${restante !== 1 ? 's' : ''}`);

    const bar = document.getElementById('day-bar');
    if (bar) { bar.style.width = `${(qtd/50)*100}%`; if (qtd >= 40) bar.classList.add('danger'); }

    if (restante === 0) {
      showAlert('alert-area', '⚠️ Limite de 50 vendas diárias atingido! Novas vendas não podem ser registradas hoje.', 'warning');
      const btn = document.getElementById('btn-submit-venda');
      if (btn) btn.disabled = true;
    }
  } catch(e) { console.warn('Erro ao verificar limite:', e); }

  try {
    const [clientes, produtos] = await Promise.all([apiGet('clientes.php'), apiGet('produtos.php')]);
    produtosCache = produtos;

    const selC = document.getElementById('sel-cliente');
    if (selC) {
      selC.innerHTML = '<option value="">— Selecione um cliente —</option>' +
        clientes.map(c => `<option value="${c.id_cliente}">${c.nome}</option>`).join('');
    }

    const selP = document.getElementById('sel-produto');
    if (selP) {
      selP.innerHTML = '<option value="">— Selecione um produto —</option>' +
        produtos.map(p => `<option value="${p.id_produto}" data-preco="${p.preco}">${p.nome} — ${formatCurrency(p.preco)}</option>`).join('');
      selP.addEventListener('change', () => {
        const opt = selP.selectedOptions[0];
        setEl('preco-unitario', opt?.dataset?.preco ? formatCurrency(opt.dataset.preco) : '—');
      });
    }
  } catch(e) {
    showAlert('alert-area', 'Erro ao carregar dados. Verifique a conexão com o banco de dados.', 'error');
  }

  document.getElementById('btn-add-item')?.addEventListener('click', addItemVenda);
  document.getElementById('form-venda')?.addEventListener('submit', submitVenda);
  renderItensVenda();
}

function addItemVenda() {
  const selP  = document.getElementById('sel-produto');
  const qtdEl = document.getElementById('qtd-item');
  const opt   = selP?.selectedOptions[0];
  const qtd   = parseInt(qtdEl?.value || 0);

  if (!opt?.value)            { showAlert('alert-area', 'Selecione um produto.', 'error'); return; }
  if (isNaN(qtd) || qtd < 1) { showAlert('alert-area', 'Quantidade mínima é 1.', 'error'); return; }

  const id_produto = parseInt(opt.value);
  const preco      = parseFloat(opt.dataset.preco);
  const nome       = opt.text.split(' —')[0];

  const existing = itensVenda.find(i => i.id_produto === id_produto);
  if (existing) {
    existing.quantidade  += qtd;
    existing.valor_total  = parseFloat((existing.preco * existing.quantidade).toFixed(2));
  } else {
    itensVenda.push({ id_produto, nome, preco, quantidade: qtd,
      valor_total: parseFloat((preco * qtd).toFixed(2)) });
  }

  selP.value = '';
  if (qtdEl) qtdEl.value = 1;
  setEl('preco-unitario', '—');
  renderItensVenda();
}

async function submitVenda(e) {
  e.preventDefault();
  const btn     = document.getElementById('btn-submit-venda');
  const restore = showLoading(btn);
  const id_c    = parseInt(document.getElementById('sel-cliente')?.value || 0);

  if (!id_c)            { showAlert('alert-area', 'Selecione um cliente.', 'error'); restore(); return; }
  if (!itensVenda.length) { showAlert('alert-area', 'Adicione pelo menos um item.', 'error'); restore(); return; }

  const result = await apiPost('vendas.php', {
    id_cliente: id_c,
    itens: itensVenda.map(i => ({ id_produto: i.id_produto, quantidade: i.quantidade }))
  });
  restore();

  if (result.erro) {
    showAlert('alert-area', result.erro, 'error');
  } else {
    showAlert('alert-area',
      `🎉 Venda #${result.id_venda} registrada com sucesso! Total: ${formatCurrency(result.total)}`, 'success');
    itensVenda = [];
    document.getElementById('form-venda')?.reset();
    setEl('preco-unitario', '—');
    renderItensVenda();
    initVendas();
  }
}

function renderItensVenda() {
  const container = document.getElementById('itens-container');
  const totalEl   = document.getElementById('grand-total');
  if (!container) return;

  if (!itensVenda.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 20px">
        <div class="empty-icon">🛒</div>
        <p>Adicione produtos à venda</p>
      </div>`;
    if (totalEl) totalEl.textContent = formatCurrency(0);
    return;
  }

  container.innerHTML = `
    <div class="items-list">
      ${itensVenda.map((item, idx) => `
        <div class="item-row">
          <div class="item-name">${item.nome}</div>
          <div class="item-qty">${item.quantidade}×</div>
          <div class="item-price">${formatCurrency(item.valor_total)}</div>
          <button class="btn btn-sm btn-danger" onclick="removeItemVenda(${idx})" title="Remover">✕</button>
        </div>`).join('')}
    </div>`;

  const grand = itensVenda.reduce((s, i) => s + i.valor_total, 0);
  if (totalEl) totalEl.textContent = formatCurrency(grand);
}

function removeItemVenda(idx) {
  itensVenda.splice(idx, 1);
  renderItensVenda();
}

// ================================================================
// DEVOLUÇÕES
// ================================================================

async function initDevolucoes() { await loadDevolucoes(); }

async function loadDevolucoes() {
  const tbody = document.getElementById('dev-tbody');
  if (!tbody) return;
  tbody.innerHTML = loadingRow(7);
  try {
    const list = await apiGet('devolucoes.php');
    if (!list.length) { tbody.innerHTML = emptyRow(7, 'Nenhum item de venda encontrado.'); return; }
    tbody.innerHTML = list.map((item, i) => {
      const bc = item.devolucoes === 0 ? 'green' : item.devolucoes === 1 ? 'orange' : 'red';
      return `
        <tr class="animate-in" style="animation-delay:${i*0.03}s">
          <td class="muted">#${item.id_venda}</td>
          <td>${item.cliente}</td>
          <td>${item.produto}</td>
          <td class="center">${item.quantidade}</td>
          <td>${formatDate(item.data)}</td>
          <td class="center"><span class="badge badge-${bc}">${item.devolucoes}×</span></td>
          <td>
            ${item.taxa_devolucao > 0
              ? `<span class="badge badge-red" style="margin-right:6px">+${formatCurrency(item.taxa_devolucao)}</span>`
              : ''}
            <button class="btn btn-sm btn-danger" onclick="registrarDevolucao(${item.id_item})">
              ↩ Devolver
            </button>
          </td>
        </tr>`;
    }).join('');
  } catch(e) { tbody.innerHTML = emptyRow(7, '❌ Erro ao carregar itens.'); }
}

async function registrarDevolucao(id_item) {
  const result = await apiPost('devolucoes.php', { id_item });
  if (result.erro) {
    showAlert('alert-area', result.erro, 'error');
  } else {
    showAlert('alert-area', result.mensagem, result.taxa_devolucao > 0 ? 'warning' : 'success');
    await loadDevolucoes();
  }
}

// ================================================================
// RELATÓRIO DIÁRIO
// ================================================================

async function initRelatorioDiario() {
  const el = document.getElementById('filter-data');
  if (el) el.value = todayISO();
  await loadRelatorioDiario(todayISO());
  document.getElementById('btn-filtrar')?.addEventListener('click', async () => {
    const d = document.getElementById('filter-data')?.value;
    d ? await loadRelatorioDiario(d) : showAlert('alert-area', 'Selecione uma data.', 'error');
  });
}

async function loadRelatorioDiario(data) {
  const c = document.getElementById('relatorio-content');
  if (!c) return;
  c.innerHTML = loadingCenter();
  try {
    const r = await apiGet('relatorios.php', { tipo: 'diario', data });
    setEl('r-data-label', formatDate(data));
    setEl('r-total-dia',  formatCurrency(r.total_dia));
    setEl('r-qtd-vendas', r.quantidade_vendas ?? 0);

    if (!r.pedidos?.length) {
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div>
        <p>Nenhuma venda registrada em ${formatDate(data)}.</p></div>`;
      return;
    }

    c.innerHTML = r.pedidos.map((p, pi) => `
      <div class="pedido-card animate-in" style="animation-delay:${pi*0.07}s">
        <div class="pedido-card-header">
          <div>
            <div class="pedido-id">Pedido #${p.id_venda}</div>
            <div class="pedido-client">👤 ${p.cliente}</div>
          </div>
          <div class="pedido-total">${formatCurrency(p.total)}</div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Subtotal</th><th>Devoluções</th><th>Taxa</th><th>Total</th></tr></thead>
            <tbody>
              ${p.itens.map(it => `
                <tr>
                  <td>${it.produto}</td>
                  <td class="center">${it.quantidade}</td>
                  <td>${formatCurrency(it.valor_total)}</td>
                  <td class="center">${it.devolucoes > 0
                    ? `<span class="badge badge-orange">${it.devolucoes}×</span>` : '—'}</td>
                  <td>${it.taxa_devolucao > 0
                    ? `<span class="badge badge-red">${formatCurrency(it.taxa_devolucao)}</span>` : '—'}</td>
                  <td class="money">${formatCurrency(it.total_item)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`).join('');
  } catch(e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div>
      <p>Erro ao carregar relatório. Verifique a conexão.</p></div>`;
  }
}

// ================================================================
// RELATÓRIO MENSAL
// ================================================================

async function initRelatorioMensal() {
  const el = document.getElementById('filter-ano');
  if (el) el.value = new Date().getFullYear();
  await loadRelatorioMensal(new Date().getFullYear());
  document.getElementById('btn-filtrar')?.addEventListener('click', async () => {
    const ano = document.getElementById('filter-ano')?.value;
    if (ano) await loadRelatorioMensal(ano);
  });
}

async function loadRelatorioMensal(ano) {
  const c = document.getElementById('relatorio-content');
  if (!c) return;
  c.innerHTML = loadingCenter();
  try {
    const r = await apiGet('relatorios.php', { tipo: 'mensal', ano });
    setEl('r-total-anual', formatCurrency(r.total_anual));
    setEl('r-ano-label',   ano);

    if (!r.meses?.length) {
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div>
        <p>Nenhuma venda encontrada em ${ano}.</p></div>`;
      return;
    }

    const maxVal = Math.max(...r.meses.map(m => m.total_mes || 0));
    c.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead><tr><th>#</th><th>Mês</th><th>Faturamento</th><th>Nº Vendas</th></tr></thead>
          <tbody>
            ${r.meses.map((m, i) => `
              <tr class="animate-in" style="animation-delay:${i*0.06}s">
                <td class="muted">${i+1}</td>
                <td>
                  <strong>${nomeMesPT(m.mes)}</strong>
                  <div class="bar-mini"><div class="bar-mini-fill"
                    style="width:${maxVal ? (m.total_mes/maxVal)*100 : 0}%"></div></div>
                </td>
                <td class="money">${formatCurrency(m.total_mes)}</td>
                <td class="center">${m.quantidade_vendas}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } catch(e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><p>Erro ao carregar relatório.</p></div>`;
  }
}

// ================================================================
// RELATÓRIO ANUAL
// ================================================================

async function initRelatorioAnual() {
  const el = document.getElementById('filter-ano');
  if (el) el.value = new Date().getFullYear();
  await loadRelatorioAnual(new Date().getFullYear());
  document.getElementById('btn-filtrar')?.addEventListener('click', async () => {
    const ano = document.getElementById('filter-ano')?.value;
    if (ano) await loadRelatorioAnual(ano);
  });
}

async function loadRelatorioAnual(ano) {
  const c = document.getElementById('relatorio-content');
  if (!c) return;
  c.innerHTML = loadingCenter();
  try {
    const r = await apiGet('relatorios.php', { tipo: 'anual', ano });
    setEl('r-total-anual', formatCurrency(r.total_anual));
    setEl('r-ano-label',   ano);

    if (!r.meses?.length) {
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">📈</div>
        <p>Nenhuma venda encontrada em ${ano}.</p></div>`;
      return;
    }

    const maxVal = Math.max(...r.meses.map(m => m.total_mes || 0));
    const medals = ['🥇','🥈','🥉'];

    c.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Rank</th><th>Mês</th><th>Faturamento</th><th>Nº Vendas</th></tr></thead>
          <tbody>
            ${r.meses.map((m, i) => `
              <tr class="animate-in" style="animation-delay:${i*0.06}s">
                <td style="font-size:${i<3?22:15}px;font-weight:700">
                  ${medals[i] !== undefined ? medals[i] : `#${i+1}`}
                </td>
                <td>
                  <strong>${nomeMesPT(m.mes)}</strong>
                  <div class="bar-mini"><div class="bar-mini-fill"
                    style="width:${maxVal ? (m.total_mes/maxVal)*100 : 0}%"></div></div>
                </td>
                <td class="money">${formatCurrency(m.total_mes)}</td>
                <td class="center">${m.quantidade_vendas}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } catch(e) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><p>Erro ao carregar relatório.</p></div>`;
  }
}

// ================================================================
// HELPER — Nome do mês em português
// ================================================================

function nomeMesPT(num) {
  return ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
          'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][parseInt(num)-1] || num;
}

// ================================================================
// INICIALIZAÇÃO GLOBAL
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  updateDateDisplay();
  initSidebar();
});
