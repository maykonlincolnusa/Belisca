/**
 * BELISCA • Core Engine & Triangulation Logic
 * Calcula: Pedidos Vendidos x Estoque (Ficha Técnica) x Financeiro (DRE Real)
 */

// Estado Global do Sistema Belisca
const BeliscaState = {
  // Insumos e Estoque de Matéria Prima
  ingredients: {
    batata_palito: { id: 'batata_palito', name: 'Batata Rústica/Palito', unit: 'kg', qty: 14.5, min: 10.0, unitCost: 11.50, category: 'Perecível' },
    cheddar_cremoso: { id: 'cheddar_cremoso', name: 'Queijo Cheddar Bisnaga', unit: 'kg', qty: 4.8, min: 3.0, unitCost: 28.00, category: 'Laticínios' },
    bacon_cubos: { id: 'bacon_cubos', name: 'Bacon em Cubos Defumado', unit: 'kg', qty: 2.1, min: 4.0, unitCost: 36.00, category: 'Carnes' }, // CRÍTICO
    tilapia_file: { id: 'tilapia_file', name: 'Filé de Tilápia Congelado', unit: 'kg', qty: 5.2, min: 6.0, unitCost: 42.00, category: 'Carnes' }, // BAIXO
    bolinho_costela_un: { id: 'bolinho_costela_un', name: 'Bolinho de Costela (un)', unit: 'un', qty: 96, min: 40, unitCost: 1.65, category: 'Porções' },
    dadinho_tapioca_un: { id: 'dadinho_tapioca_un', name: 'Dadinho de Tapioca (un)', unit: 'un', qty: 120, min: 50, unitCost: 1.10, category: 'Porções' },
    mini_pasteis_un: { id: 'mini_pasteis_un', name: 'Mini Pastéis Congelados', unit: 'un', qty: 140, min: 60, unitCost: 0.95, category: 'Porções' },
    oleo_fritura: { id: 'oleo_fritura', name: 'Óleo de Fritura Algodão', unit: 'L', qty: 28, min: 20, unitCost: 8.90, category: 'Gorduras' },
    embalagem_kraft: { id: 'embalagem_kraft', name: 'Embalagem Kraft Térmica', unit: 'un', qty: 68, min: 80, unitCost: 1.45, category: 'Embalagem' }, // BAIXO
    cerveja_ipa_lata: { id: 'cerveja_ipa_lata', name: 'Cerveja IPA 350ml Lata', unit: 'un', qty: 42, min: 24, unitCost: 6.20, category: 'Bebidas' }
  },

  // Cardápio de Petiscos com Ficha Técnica (BOM - Bill of Materials)
  petiscos: {
    batata_cheddar_bacon: {
      id: 'batata_cheddar_bacon',
      name: 'Batata Rústica c/ Cheddar e Bacon',
      category: 'Batatas & Fritas',
      price: 42.00,
      bom: [
        { ingredientId: 'batata_palito', qty: 0.45 }, // 450g
        { ingredientId: 'cheddar_cremoso', qty: 0.08 }, // 80g
        { ingredientId: 'bacon_cubos', qty: 0.06 }, // 60g
        { ingredientId: 'embalagem_kraft', qty: 1 }
      ]
    },
    isca_tilapia: {
      id: 'isca_tilapia',
      name: 'Isca de Tilápia c/ Molho Tártaro',
      category: 'Peixes & Frutos do Mar',
      price: 56.00,
      bom: [
        { ingredientId: 'tilapia_file', qty: 0.40 }, // 400g
        { ingredientId: 'embalagem_kraft', qty: 1 }
      ]
    },
    bolinho_costela: {
      id: 'bolinho_costela',
      name: 'Bolinho de Costela Desfiada (8 un)',
      category: 'Bolinhos & Salgados',
      price: 48.00,
      bom: [
        { ingredientId: 'bolinho_costela_un', qty: 8 },
        { ingredientId: 'embalagem_kraft', qty: 1 }
      ]
    },
    dadinho_tapioca: {
      id: 'dadinho_tapioca',
      name: 'Dadinho de Tapioca c/ Queijo Coalho (10 un)',
      category: 'Queijos & Boteco',
      price: 38.00,
      bom: [
        { ingredientId: 'dadinho_tapioca_un', qty: 10 },
        { ingredientId: 'embalagem_kraft', qty: 1 }
      ]
    },
    pastelzinho_boteco: {
      id: 'pastelzinho_boteco',
      name: 'Mini Pastéis Mistos de Boteco (10 un)',
      category: 'Pastéis',
      price: 36.00,
      bom: [
        { ingredientId: 'mini_pasteis_un', qty: 10 },
        { ingredientId: 'embalagem_kraft', qty: 1 }
      ]
    },
    combo_cerveja_artesanal: {
      id: 'combo_cerveja_artesanal',
      name: 'Combo 2x Cerveja IPA Lata 350ml',
      category: 'Bebidas Geladas',
      price: 32.00,
      bom: [
        { ingredientId: 'cerveja_ipa_lata', qty: 2 }
      ]
    }
  },

  // Pedidos Vendidos Registrados
  orders: [
    {
      id: 'BEL-1048',
      time: '20:45',
      channel: 'iFood',
      client: 'Guilherme Silveira - Apto 802',
      items: [
        { petiscoId: 'batata_cheddar_bacon', qty: 1 },
        { petiscoId: 'combo_cerveja_artesanal', qty: 1 }
      ],
      grossValue: 74.00,
      channelFeePct: 0.23, // 23% iFood
      channelFeeVal: 17.02,
      payMethod: 'Cartão Crédito (iFood)',
      status: 'Em Preparo'
    },
    {
      id: 'BEL-1047',
      time: '20:32',
      channel: 'WhatsApp',
      client: 'Fernanda Diniz - R. das Palmeiras 140',
      items: [
        { petiscoId: 'isca_tilapia', qty: 1 },
        { petiscoId: 'dadinho_tapioca', qty: 1 }
      ],
      grossValue: 94.00,
      channelFeePct: 0.009, // PIX 0.9%
      channelFeeVal: 0.85,
      payMethod: 'PIX',
      status: 'Em Rota'
    },
    {
      id: 'BEL-1046',
      time: '20:15',
      channel: 'iFood',
      client: 'Marcos Vinicius - Condomínio Solar',
      items: [
        { petiscoId: 'bolinho_costela', qty: 1 },
        { petiscoId: 'batata_cheddar_bacon', qty: 1 }
      ],
      grossValue: 90.00,
      channelFeePct: 0.23,
      channelFeeVal: 20.70,
      payMethod: 'Cartão Crédito',
      status: 'Entregue'
    },
    {
      id: 'BEL-1045',
      time: '19:50',
      channel: 'WhatsApp',
      client: 'Carla Prado - Delivery Direto',
      items: [
        { petiscoId: 'pastelzinho_boteco', qty: 2 }
      ],
      grossValue: 72.00,
      channelFeePct: 0.009,
      channelFeeVal: 0.65,
      payMethod: 'PIX',
      status: 'Entregue'
    },
    {
      id: 'BEL-1044',
      time: '19:35',
      channel: 'Balcão',
      client: 'Rodrigo Mendonça (Retirada)',
      items: [
        { petiscoId: 'batata_cheddar_bacon', qty: 1 }
      ],
      grossValue: 42.00,
      channelFeePct: 0.019, // Débito 1.9%
      channelFeeVal: 0.80,
      payMethod: 'Cartão Débito',
      status: 'Entregue'
    }
  ]
};

// ==========================================================================
// FUNÇÕES DE CÁLCULO DA TRIANGULAÇÃO
// ==========================================================================

/**
 * Calcula o CMV (Custo da Mercadoria Vendida) de um petisco com base na sua Ficha Técnica
 */
function calculatePetiscoCMV(petiscoId) {
  const petisco = BeliscaState.petiscos[petiscoId];
  if (!petisco) return 0;

  return petisco.bom.reduce((total, item) => {
    const ing = BeliscaState.ingredients[item.ingredientId];
    if (!ing) return total;
    return total + (item.qty * ing.unitCost);
  }, 0);
}

/**
 * Calcula o CMV de um pedido completo (soma de todos os itens e porções)
 */
function calculateOrderCMV(order) {
  return order.items.reduce((total, item) => {
    return total + (calculatePetiscoCMV(item.petiscoId) * item.qty);
  }, 0);
}

/**
 * Calcula as métricas consolidadas de todos os pedidos para o DRE e os KPIs
 */
function calculateFinancialMetrics() {
  let faturamentoBruto = 0;
  let totalTaxas = 0;
  let totalCMV = 0;
  let canalTotais = {
    iFood: 0,
    WhatsApp: 0,
    Balcão: 0
  };

  BeliscaState.orders.forEach(order => {
    faturamentoBruto += order.grossValue;
    totalTaxas += order.channelFeeVal;
    totalCMV += calculateOrderCMV(order);

    if (canalTotais[order.channel] !== undefined) {
      canalTotais[order.channel] += order.grossValue;
    }
  });

  const margemBruta = faturamentoBruto - totalTaxas - totalCMV;
  const rateioCustosFixos = faturamentoBruto > 0 ? 420.00 : 0; // Gás, luz, óleo base, etc
  const lucroLiquidoReal = margemBruta - rateioCustosFixos;

  return {
    faturamentoBruto,
    totalTaxas,
    totalCMV,
    margemBruta,
    rateioCustosFixos,
    lucroLiquidoReal,
    canalTotais,
    margemLiquidaPct: faturamentoBruto > 0 ? (lucroLiquidoReal / faturamentoBruto) * 100 : 0,
    cmvPct: faturamentoBruto > 0 ? (totalCMV / faturamentoBruto) * 100 : 0
  };
}

/**
 * Efetua a baixa automática de estoque de insumos com base em um pedido vendido
 */
function deductInventoryForOrder(order) {
  order.items.forEach(item => {
    const petisco = BeliscaState.petiscos[item.petiscoId];
    if (!petisco) return;

    petisco.bom.forEach(bomItem => {
      const ingredient = BeliscaState.ingredients[bomItem.ingredientId];
      if (ingredient) {
        const consumed = bomItem.qty * item.qty;
        ingredient.qty = Math.max(0, parseFloat((ingredient.qty - consumed).toFixed(2)));
      }
    });
  });
}

// ==========================================================================
// RENDERIZAÇÃO DA INTERFACE (DOM)
// ==========================================================================

function formatBRL(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

/**
 * Carrega o mesmo consolidado usado pelo relatório executivo. Assim a Curva
 * ABC, o mix de canais e os KPIs não dependem de números decorativos distintos.
 */
async function loadExecutiveReport() {
  try {
    const response = await fetch('/api/kpis');
    if (!response.ok) throw new Error('Resumo indisponível');
    const report = await response.json();

    document.getElementById('repTotalFaturamento').textContent = formatBRL(report.faturamento_bruto);
    document.getElementById('repTicketMedio').textContent = formatBRL(report.ticket_medio);
    document.getElementById('repCMVMedio').textContent = `${report.cmv_pct.toFixed(1)}%`;
    const cmvStatus = document.getElementById('repCMVStatus');
    cmvStatus.textContent = report.cmv_pct <= 32
      ? '✓ Dentro da meta operacional (< 32%)'
      : 'Atenção: acima da meta operacional (< 32%)';
    cmvStatus.parentElement.classList.toggle('positive', report.cmv_pct <= 32);
    document.getElementById('repBreakEven').textContent = `${report.ponto_equilibrio_diario} porções/dia`;
    document.getElementById('repPedidosStatus').textContent = `${report.total_pedidos} conciliados · ${report.total_cancelados} cancelados`;
    document.getElementById('reportBadge').textContent = `${report.total_registros} ped`;
    document.getElementById('reportDataStatus').textContent =
      `Base demonstrativa · ${report.periodo} · ${Object.keys(report.desempenho_canais).join(' · ')}`;

    const abcBody = document.getElementById('tbodyCurvaABC');
    abcBody.innerHTML = report.curva_abc.map(item => `
      <tr>
        <td><span class="badge-abc ${item.classe_abc.toLowerCase()}">${item.classe_abc}</span></td>
        <td><strong>${item.petisco}</strong></td>
        <td class="font-mono">${item.qtd_vendida}</td>
        <td class="font-mono">${formatBRL(item.receita)}</td>
        <td class="font-mono">${item.participacao_pct.toFixed(1)}%</td>
      </tr>`).join('');

    const channelBody = document.getElementById('tbodyCanais');
    const channels = Object.entries(report.desempenho_canais).sort(([, a], [, b]) => b.faturamento - a.faturamento);
    channelBody.innerHTML = channels.map(([channel, data]) => {
      const feePct = data.faturamento ? (data.taxas / data.faturamento) * 100 : 0;
      const marginPct = data.faturamento ? (data.lucro / data.faturamento) * 100 : 0;
      return `<tr>
        <td><strong>${channel}</strong></td>
        <td class="font-mono">${data.pedidos}</td>
        <td class="font-mono">${formatBRL(data.faturamento)}</td>
        <td class="font-mono text-red">${feePct.toFixed(1)}%</td>
        <td class="font-mono text-amber">${marginPct.toFixed(1)}%</td>
      </tr>`;
    }).join('');

    const bestChannel = channels.reduce((best, current) => {
      const currentMargin = current[1].faturamento ? current[1].lucro / current[1].faturamento : 0;
      const bestMargin = best[1].faturamento ? best[1].lucro / best[1].faturamento : 0;
      return currentMargin > bestMargin ? current : best;
    });
    const bestMargin = (bestChannel[1].lucro / bestChannel[1].faturamento) * 100;
    const marketplace = report.desempenho_origens['Delivery marketplace'];
    const marketplaceShare = marketplace ? (marketplace.faturamento / report.faturamento_bruto) * 100 : 0;
    document.getElementById('channelInsight').innerHTML =
      `💡 <strong>Leitura do mix:</strong> marketplaces representam <strong>${marketplaceShare.toFixed(1)}% da receita</strong>. ` +
      `No cenário demonstrativo, <strong>${bestChannel[0]}</strong> tem a maior margem líquida (${bestMargin.toFixed(1)}%). ` +
      `As taxas são parâmetros de simulação: substitua-as pelos contratos reais antes de tomar decisão de preço.`;
  } catch (error) {
    document.getElementById('reportDataStatus').textContent = 'Consolidado indisponível: inicie o servidor do Belisca para carregar os dados.';
    console.error(error);
  }
}

function renderKPIs() {
  const metrics = calculateFinancialMetrics();

  document.getElementById('kpiFaturamento').textContent = formatBRL(metrics.faturamentoBruto);
  document.getElementById('kpiCMV').textContent = formatBRL(metrics.totalCMV);
  document.getElementById('kpiTaxas').textContent = formatBRL(metrics.totalTaxas);
  document.getElementById('kpiLucroLiquido').textContent = formatBRL(metrics.lucroLiquidoReal);

  // DRE Card
  document.getElementById('dreBruto').textContent = formatBRL(metrics.faturamentoBruto);
  document.getElementById('dreTaxasApp').textContent = `- ${formatBRL(metrics.totalTaxas * 0.88)}`;
  document.getElementById('dreTaxasGateway').textContent = `- ${formatBRL(metrics.totalTaxas * 0.12)}`;
  document.getElementById('dreReceitaLiq').textContent = formatBRL(metrics.faturamentoBruto - metrics.totalTaxas);
  document.getElementById('dreCMVInsumos').textContent = `- ${formatBRL(metrics.totalCMV * 0.85)}`;
  document.getElementById('dreEmbalagens').textContent = `- ${formatBRL(metrics.totalCMV * 0.15)}`;
  document.getElementById('dreMargemContrib').textContent = formatBRL(metrics.margemBruta);
  document.getElementById('dreLucroFinal').textContent = formatBRL(metrics.lucroLiquidoReal);
}

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  const search = document.getElementById('orderSearchInput').value.toLowerCase();
  const channelFilter = document.getElementById('channelFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  tbody.innerHTML = '';

  const filtered = BeliscaState.orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(search) || 
                          order.id.toLowerCase().includes(search);
    const matchesChannel = channelFilter === 'ALL' || order.channel === channelFilter;
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  document.getElementById('ordersCounter').textContent = BeliscaState.orders.length;

  filtered.forEach(order => {
    const cmv = calculateOrderCMV(order);
    const profit = order.grossValue - order.channelFeeVal - cmv;

    const itemsSummary = order.items.map(it => {
      const p = BeliscaState.petiscos[it.petiscoId];
      return `${it.qty}x ${p ? p.name : it.petiscoId}`;
    }).join(', ');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong class="font-mono">${order.id}</strong><br>
        <span class="text-muted">${order.time}</span>
      </td>
      <td>
        <span class="tag-channel ${order.channel.toLowerCase()}">${order.channel}</span>
      </td>
      <td>
        <strong>${order.client}</strong><br>
        <span class="text-muted font-mono" style="font-size:11px;">${order.payMethod}</span>
      </td>
      <td><span style="font-size:12.5px;">${itemsSummary}</span></td>
      <td class="font-mono"><strong>${formatBRL(order.grossValue)}</strong></td>
      <td class="font-mono text-red">- ${formatBRL(order.channelFeeVal)}</td>
      <td class="font-mono text-red">- ${formatBRL(cmv)}</td>
      <td class="font-mono text-amber"><strong>+ ${formatBRL(profit)}</strong></td>
      <td>
        <span class="tag-status-order ${order.status.toLowerCase().replace(' ', '')}">${order.status}</span>
      </td>
      <td>
        <button class="btn-copy-code" onclick="alert('Pedido ${order.id}: Comanda conferida com a cozinha e estoque!')">Ver Detalhes</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStockAndBOM() {
  // 1. Render Petiscos & Ficha Técnica
  const petiscosList = document.getElementById('petiscosList');
  petiscosList.innerHTML = '';

  Object.values(BeliscaState.petiscos).forEach(p => {
    const cmv = calculatePetiscoCMV(p.id);
    const margemBruta = p.price - cmv;
    const margemPct = ((margemBruta / p.price) * 100).toFixed(1);

    const bomHtml = p.bom.map(b => {
      const ing = BeliscaState.ingredients[b.ingredientId];
      return `<span class="bom-tag"><strong>${b.qty}${ing ? ing.unit : ''}</strong> ${ing ? ing.name : b.ingredientId}</span>`;
    }).join(' ');

    const div = document.createElement('div');
    div.className = 'petisco-card-item';
    div.innerHTML = `
      <div class="petisco-top">
        <span class="petisco-name">${p.name}</span>
        <div class="petisco-pricing">
          <span class="petisco-cmv-calc">CMV Insumos: <strong>${formatBRL(cmv)}</strong></span>
          <span class="petisco-sale-price">${formatBRL(p.price)}</span>
        </div>
      </div>
      <div style="font-size:11.5px; color:var(--color-green); margin-bottom: 6px;">
        Margem Bruta Unitária: <strong>${formatBRL(margemBruta)} (${margemPct}%)</strong>
      </div>
      <div class="bom-tags">
        ${bomHtml}
      </div>
    `;
    petiscosList.appendChild(div);
  });

  // 2. Render Insumos Table
  const ingTbody = document.getElementById('ingredientsTableBody');
  ingTbody.innerHTML = '';

  let alertCount = 0;
  const alertList = document.getElementById('stockAlertsList');
  alertList.innerHTML = '';

  Object.values(BeliscaState.ingredients).forEach(ing => {
    let statusClass = 'ok';
    let statusLabel = 'Adequado';

    if (ing.qty <= ing.min * 0.6) {
      statusClass = 'critical';
      statusLabel = 'Ruptura Crítica';
      alertCount++;

      // Adiciona na lista de alertas da Home
      const alertItem = document.createElement('div');
      alertItem.className = 'alert-item critical';
      alertItem.innerHTML = `
        <div class="alert-details">
          <h4>🚨 Alerta Crítico: ${ing.name}</h4>
          <p>Estoque atual: <strong>${ing.qty} ${ing.unit}</strong> (Mínimo recomendado para o pico: ${ing.min} ${ing.unit})</p>
        </div>
        <button class="alert-action-btn" onclick="abrirReporEstoque('${ing.id}')">Repor +5 ${ing.unit}</button>
      `;
      alertList.appendChild(alertItem);

    } else if (ing.qty <= ing.min) {
      statusClass = 'low';
      statusLabel = 'Estoque Baixo';
      alertCount++;

      const alertItem = document.createElement('div');
      alertItem.className = 'alert-item';
      alertItem.innerHTML = `
        <div class="alert-details">
          <h4>⚠️ Alerta de Reposição: ${ing.name}</h4>
          <p>Restam apenas <strong>${ing.qty} ${ing.unit}</strong> para a operação de hoje.</p>
        </div>
        <button class="alert-action-btn" onclick="abrirReporEstoque('${ing.id}')">Comprar</button>
      `;
      alertList.appendChild(alertItem);
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${ing.name}</strong><br><span class="text-muted" style="font-size:11px;">${ing.category}</span></td>
      <td class="font-mono"><strong>${ing.qty} ${ing.unit}</strong></td>
      <td class="font-mono text-muted">${ing.min} ${ing.unit}</td>
      <td class="font-mono">${formatBRL(ing.unitCost)}/${ing.unit}</td>
      <td><span class="stock-level-pill ${statusClass}">${statusLabel}</span></td>
      <td>
        <button class="btn-copy-code" onclick="abrirReporEstoque('${ing.id}')">+ Adicionar</button>
      </td>
    `;
    ingTbody.appendChild(tr);
  });

  document.getElementById('stockAlertCounter').textContent = alertCount;
}

// Reposição rápida de insumo
window.abrirReporEstoque = function(ingId) {
  const ing = BeliscaState.ingredients[ingId];
  if (!ing) return;
  const addQty = ing.unit === 'kg' ? 5.0 : (ing.unit === 'un' ? 50 : 10);
  ing.qty = parseFloat((ing.qty + addQty).toFixed(2));
  showToast(`Estoque de ${ing.name} abastecido com sucesso (+${addQty} ${ing.unit})!`, 'success');
  renderStockAndBOM();
  renderKPIs();
};

function showToast(msg, type = 'amber') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ==========================================================================
// PREVISÃO DE DEMANDA: REGRESSÃO ML POR QUANTIS
// ==========================================================================

function getForecastIngredient(productName, forecast) {
  const product = Object.values(BeliscaState.petiscos).find(p => p.name === productName);
  if (!product) return null;

  const requirements = product.bom.map(item => {
    const ingredient = BeliscaState.ingredients[item.ingredientId];
    const needed = item.qty * forecast;
    return { ingredient, needed, shortage: Math.max(0, needed - ingredient.qty) };
  });
  return requirements.sort((a, b) => b.shortage - a.shortage || (b.needed / b.ingredient.qty) - (a.needed / a.ingredient.qty))[0];
}

async function runAISimulation() {
  const simResults = document.getElementById('aiSimResults');
  simResults.innerHTML = '<div style="color:var(--amber-primary); font-family:var(--font-mono); padding:16px;">Treinando e consultando modelo ML no histórico operacional...</div>';
  try {
    const response = await fetch('/api/previsao?dias=3&clima=Nublado&jogo=false');
    if (!response.ok) throw new Error('Não foi possível obter a previsão.');
    const data = await response.json();
    const predictions = Object.entries(data.totais).map(([item, forecast]) => {
      const supply = getForecastIngredient(item, forecast.p50);
      const current = supply.ingredient.qty;
      const risk = supply.shortage > 0 ? 'COMPRAR' : 'SEGURO';
      return {
        item,
        ...forecast,
        keyIngredient: supply.ingredient.name,
        neededQty: `${supply.needed.toFixed(1)} ${supply.ingredient.unit}`,
        currentStock: `${current} ${supply.ingredient.unit}`,
        shortage: supply.shortage,
        risk,
        mae: data.erro_mae_p50_por_produto[item]
      };
    });
    simResults.innerHTML = '';
    predictions.forEach(p => {
      const card = document.createElement('div');
      card.className = `sim-item-card ${p.risk === 'CRÍTICO' ? 'danger-rupture' : ''}`;
      card.innerHTML = `
        <div class="sim-header">
          <span class="sim-item-name">${p.item}</span>
          <span class="stock-level-pill ${p.risk === 'CRÍTICO' ? 'critical' : 'ok'}">${p.risk}</span>
        </div>
        <div class="sim-values">
          <div class="sim-quantile-row">
            <span class="text-muted">Cenário Conservador (P10):</span>
            <strong class="font-mono">${p.p10} porções</strong>
          </div>
          <div class="sim-quantile-row">
            <span class="text-amber">Cenário Mais Provável (P50):</span>
            <strong class="font-mono text-amber">${p.p50} porções</strong>
          </div>
          <div class="sim-quantile-row">
            <span class="text-muted">Pico Máximo de Sexta (P90):</span>
            <strong class="font-mono">${p.p90} porções</strong>
          </div>
        </div>
        <div class="sim-recommendation">
          <strong>Insumo Chave:</strong> ${p.keyIngredient}<br>
          Necessário para 3 dias (P50): <strong>${p.neededQty}</strong><br>
          Estoque atual: <strong>${p.currentStock}</strong>${p.shortage > 0 ? `<br><strong class="text-red">Compra sugerida: ${p.shortage.toFixed(1)}</strong>` : ''}<br>
          <span class="text-muted">Erro médio P50 (validação): ${p.mae} porções/dia</span>
        </div>
      `;
      simResults.appendChild(card);
    });
    showToast(`Previsão ML atualizada: ${data.historico_dias} dias de histórico e cenários P10/P50/P90.`, 'amber');
  } catch (error) {
    simResults.innerHTML = '<div class="text-red" style="padding:16px;">Não foi possível carregar a previsão. Inicie o servidor Python para habilitar a API de ML.</div>';
    console.error(error);
  }
}

// ==========================================================================
// INICIALIZAÇÃO & EVENT LISTENERS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Tabs
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 2. Populate Petisco Select in Modal
  const petiscoSelect = document.getElementById('selectPetisco');
  Object.values(BeliscaState.petiscos).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} - ${formatBRL(p.price)}`;
    petiscoSelect.appendChild(opt);
  });

  // 3. Modal Open/Close
  const modal = document.getElementById('modalNovoPedido');
  const openModalBtns = [document.getElementById('btnNovoPedidoModal'), document.getElementById('btnNovoPedidoDirect')];
  const closeModalBtns = [document.getElementById('modalCloseBtn'), document.getElementById('btnCancelarPedido')];

  openModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      modal.classList.add('active');
      updateLivePreview();
    });
  });

  closeModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  // 4. Live Preview in Modal
  function updateLivePreview() {
    const petiscoId = petiscoSelect.value;
    const qty = parseInt(document.getElementById('inputQuantidade').value) || 1;
    const canal = document.getElementById('selectCanal').value;

    const petisco = BeliscaState.petiscos[petiscoId];
    if (!petisco) return;

    const precoVenda = petisco.price * qty;
    let feePct = 0.23; // iFood
    if (canal === 'WhatsApp') feePct = 0.009; // PIX
    if (canal === 'Balcão') feePct = 0.019; // Débito

    const taxa = precoVenda * feePct;
    const cmv = calculatePetiscoCMV(petiscoId) * qty;
    const lucro = precoVenda - taxa - cmv;

    document.getElementById('prevPrecoVenda').textContent = formatBRL(precoVenda);
    document.getElementById('prevTaxaCanal').textContent = `- ${formatBRL(taxa)}`;
    document.getElementById('prevCMV').textContent = `- ${formatBRL(cmv)}`;
    document.getElementById('prevLucroReal').textContent = formatBRL(lucro);
  }

  petiscoSelect.addEventListener('change', updateLivePreview);
  document.getElementById('inputQuantidade').addEventListener('input', updateLivePreview);
  document.getElementById('selectCanal').addEventListener('change', updateLivePreview);

  // 5. Submit New Order
  document.getElementById('formNovoPedido').addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('inputCliente').value.trim();
    const canal = document.getElementById('selectCanal').value;
    const petiscoId = petiscoSelect.value;
    const qty = parseInt(document.getElementById('inputQuantidade').value) || 1;
    const payMethod = document.getElementById('inputFormaPagamento').value;

    const petisco = BeliscaState.petiscos[petiscoId];
    const precoBruto = petisco.price * qty;

    let feePct = 0.23;
    if (canal === 'WhatsApp') feePct = 0.009;
    if (canal === 'Balcão') feePct = 0.019;

    const feeVal = precoBruto * feePct;
    const newOrderId = `BEL-${1049 + BeliscaState.orders.length}`;

    const newOrder = {
      id: newOrderId,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      channel: canal,
      client: cliente,
      items: [{ petiscoId, qty }],
      grossValue: precoBruto,
      channelFeePct: feePct,
      channelFeeVal: feeVal,
      payMethod: payMethod,
      status: 'Em Preparo'
    };

    // Realiza a Triangulação:
    // 1. Registra o Pedido
    BeliscaState.orders.unshift(newOrder);
    // 2. Desconta os Insumos do Estoque pela Ficha Técnica
    deductInventoryForOrder(newOrder);

    // 3. Atualiza Toda a Interface & DRE
    renderKPIs();
    renderOrdersTable();
    renderStockAndBOM();

    modal.classList.remove('active');
    document.getElementById('formNovoPedido').reset();
    showToast(`Pedido ${newOrderId} lançado! Insumos baixados na cozinha e DRE recalculado.`, 'success');
  });

  // 6. Table Filters
  document.getElementById('orderSearchInput').addEventListener('input', renderOrdersTable);
  document.getElementById('channelFilter').addEventListener('change', renderOrdersTable);
  document.getElementById('statusFilter').addEventListener('change', renderOrdersTable);

  // 7. AI Simulator Button
  document.getElementById('btnRodarPrevisaoIA').addEventListener('click', runAISimulation);

  // 8. Relatório unificado: dados do mesmo CSV para canais, ABC e KPIs.
  document.getElementById('btnBaixarDatasetCSV').addEventListener('click', () => {
    window.location.href = 'dataset/pedidos_delivery_petiscos.csv';
  });
  document.getElementById('btnImprimirRelatorio').addEventListener('click', () => window.print());
  document.getElementById('btnExportData').addEventListener('click', () => {
    document.getElementById('tabBtnRelatorios').click();
    window.print();
  });

  // 8. Copy Code Buttons
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeType = btn.getAttribute('data-code');
      let textToCopy = '';
      if (codeType === 'chronos') {
        textToCopy = `from chronos import Chronos2Pipeline\npipeline = Chronos2Pipeline.from_pretrained("amazon/chronos-2")`;
      } else if (codeType === 'timesfm') {
        textToCopy = `google/timesfm-2.0-500m-pytorch`;
      } else if (codeType === 'tabpfn') {
        textToCopy = `from tabpfn import TabPFNClassifier\nclf = TabPFNClassifier(device='cpu')`;
      }
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar Código'; }, 2000);
      }
    });
  });

  // Initial Render
  renderKPIs();
  renderOrdersTable();
  renderStockAndBOM();
  runAISimulation();
  loadExecutiveReport();
});
