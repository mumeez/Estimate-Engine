/* ════════════════════════════════════════════════════════════════
   ELDRITCH ESTIMATOR — Application Engine
   ════════════════════════════════════════════════════════════════ */

/* ─── State ─── */
let state = {
  id: null,
  projectName: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
  items: [],
  subcontractors: [],
  equipment: [],
  permits: [],
  markupPercent: 10,
  wastePercent: 10,
  laborHours: 0,
  hourlyRate: 75,
  overheadPercent: 0,
  profitPercent: 20,
  discountPercent: 0,
  taxEnabled: false,
  taxPercent: 7,
  advancedMode: false,
};

let materials = {};       // { category: [{name, price, unit}, ...] }
let materialsFlat = [];   // [{name, price, unit, category}, ...]
let caCodes = [];         // CA building codes
let idCounter = 0;
let editingItemId = null;  // When set, the add form is in "edit" mode

/* ─── DOM References ─── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {};

function cacheDom() {
  dom.projectName = $('#project-name');
  dom.customerName = $('#customer-name');
  dom.customerEmail = $('#customer-email');
  dom.customerPhone = $('#customer-phone');
  dom.customerAddress = $('#customer-address');
  dom.estimateDate = $('#estimate-date');
  dom.estimateNotes = $('#estimate-notes');
  dom.modeSwitch = $('#mode-switch');
  dom.modeLabel = $('#mode-label');
  dom.itemCategory = $('#item-category');
  dom.itemSearch = $('#item-search');
  dom.itemQty = $('#item-qty');
  dom.itemUnitPrice = $('#item-unit-price');
  dom.itemUnit = $('#item-unit');
  dom.itemMarkup = $('#item-markup');
  dom.itemWaste = $('#item-waste');
  dom.itemLaborCat = $('#item-category-labor');
  dom.btnAddItem = $('#btn-add-item');
  dom.itemsTbody = $('#items-tbody');
  dom.tableEmpty = $('#table-empty');
  dom.autocompleteResults = $('#autocomplete-results');
  dom.sumMaterials = $('#sum-materials');
  dom.sumMarkup = $('#sum-markup');
  dom.sumWaste = $('#sum-waste');
  dom.sumMaterialsTotal = $('#sum-materials-total');
  dom.sumLabor = $('#sum-labor');
  dom.sumLaborBreakdown = $('#labor-breakdown-detail');
  dom.sumSubcontractors = $('#sum-subcontractors');
  dom.sumEquipment = $('#sum-equipment');
  dom.sumPermits = $('#sum-permits');
  dom.sumOverhead = $('#sum-overhead');
  dom.sumProfit = $('#sum-profit');
  dom.sumDiscount = $('#sum-discount');
  dom.sumTax = $('#sum-tax');
  dom.sumGrand = $('#sum-grand');
  dom.markupPercent = $('#markup-percent');
  dom.wastePercent = $('#waste-percent');
  dom.laborHours = $('#labor-hours');
  dom.hourlyRateSlider = $('#hourly-rate-slider');
  dom.hourlyRateDisplay = $('#hourly-rate-display');
  dom.overheadPercent = $('#overhead-percent');
  dom.profitPercent = $('#profit-percent');
  dom.discountPercent = $('#discount-percent');
  dom.taxToggle = $('#tax-toggle');
  dom.taxPercent = $('#tax-percent');
  dom.taxToggleText = $('#tax-toggle-text');
  dom.subName = $('#sub-name');
  dom.subCost = $('#sub-cost');
  dom.subLicense = $('#sub-license');
  dom.btnAddSub = $('#btn-add-sub');
  dom.subTbody = $('#sub-tbody');
  dom.equipName = $('#equip-name');
  dom.equipCost = $('#equip-cost');
  dom.btnAddEquip = $('#btn-add-equip');
  dom.equipTbody = $('#equip-tbody');
  dom.permitName = $('#permit-name');
  dom.permitCost = $('#permit-cost');
  dom.btnAddPermit = $('#btn-add-permit');
  dom.permitTbody = $('#permit-tbody');
  dom.btnNew = $('#btn-new');
  dom.btnSave = $('#btn-save');
  dom.btnLoad = $('#btn-load');
  dom.btnExport = $('#btn-export');
  dom.btnSaveQuick = $('#btn-save-quick');
  dom.btnExportQuick = $('#btn-export-quick');
  dom.btnReset = $('#btn-reset');
  dom.modalOverlay = $('#modal-overlay');
  dom.saveModal = $('#save-modal');
  dom.loadModal = $('#load-modal');
  dom.saveName = $('#save-name');
  dom.savedEstimates = $('#saved-estimates');
  dom.loadEstimates = $('#load-estimates');
  dom.modalClose = $('#modal-close');
  dom.modalCancel = $('#modal-cancel');
  dom.modalSaveConfirm = $('#modal-save-confirm');
  dom.loadModalClose = $('#load-modal-close');
  dom.loadModalCancel = $('#load-modal-cancel');
  dom.advProjectFields = $('#adv-project-fields');
  dom.advItemFields = $('#adv-item-fields');
  dom.advOtherCosts = $('#adv-other-costs');
  dom.advLaborBreakdown = $('#adv-labor-breakdown');
  dom.advOtherSummary = $('#adv-other-summary');

  // Code search elements
  dom.codeSearchQuery = $('#code-search-query');
  dom.codeResults = $('#code-results');
  dom.codeSection = $('#code-section');

  // New features
  dom.projectNotes = $('#project-notes');
  dom.projectStatus = $('#project-status');
  dom.crewSize = $('#crew-size');
  dom.projectDuration = $('#project-duration');
  dom.projectStart = $('#project-start');
  dom.crewNotes = $('#crew-notes');
  dom.changeDesc = $('#change-desc');
  dom.changeAmount = $('#change-amount');
  dom.btnAddChange = $('#btn-add-change');
  dom.changeTbody = $('#change-tbody');
  dom.btnExportObsidian = $('#btn-export-obsidian');
}

/* ─── UUID Generator ─── */
function uid() { return Date.now().toString(36) + '-' + (++idCounter).toString(36); }

/* ─── New State Defaults ─── */
const DEFAULT_STATE_EXTRA = {
  projectNotes: '',
  projectStatus: 'estimating',
  crewSize: 1,
  projectDuration: 1,
  projectStart: new Date().toISOString().slice(0, 10),
  crewNotes: '',
  changeOrders: [],
};

/* ══════════════════════════════════════════════════════════════════════════
   PARTICLE BACKGROUND SYSTEM
   ══════════════════════════════════════════════════════════════════════════ */

class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.glyphs = [];
    this.stars = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.resize();
    this.initParticles();
    this.initStars();
    this.bind();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bind() {
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  initParticles() {
    const count = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.3,
        hue: 120 + Math.random() * 60, // green range
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  initStars() {
    const count = Math.min(100, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      });
    }
  }

  addGlyph(x, y) {
    const glyphs = ['◈', '✦', '◉', '◆', '◇', '✧', '⬟', '△', '◍', '◎'];
    this.glyphs.push({
      char: glyphs[Math.floor(Math.random() * glyphs.length)],
      x, y,
      vy: -0.2 - Math.random() * 0.3,
      opacity: 0.3 + Math.random() * 0.3,
      life: 1,
      size: 12 + Math.random() * 16,
    });
  }

  animate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear with fade (match background color — no more #07070E darkening)
    ctx.fillStyle = 'rgba(94, 95, 120, 0.25)';
    ctx.fillRect(0, 0, w, h);

    // Draw stars
    for (const star of this.stars) {
      star.twinkle += star.speed;
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(star.twinkle));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 150, ${alpha * 0.7})`;
      ctx.fill();
    }

    // Draw particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      // Wrap around
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const pulseAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${pulseAlpha})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${pulseAlpha * 0.12})`;
      ctx.fill();
    }

    // Particle connections (nearby particles form faint lines)
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.strokeStyle = `rgba(51, 255, 102, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw glyphs
    for (let i = this.glyphs.length - 1; i >= 0; i--) {
      const g = this.glyphs[i];
      g.y += g.vy;
      g.life -= 0.003;

      if (g.life <= 0 || g.y < -50) {
        this.glyphs.splice(i, 1);
        continue;
      }

      ctx.font = `${g.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(188, 147, 250, ${g.opacity * g.life * 0.7})`;
      ctx.fillText(g.char, g.x, g.y);
    }

    // Occasionally spawn glyph at mouse
    if (Math.random() < 0.008 && this.mouseX > 0) {
      this.addGlyph(
        this.mouseX + (Math.random() - 0.5) * 60,
        this.mouseY + (Math.random() - 0.5) * 60
      );
    }

    // Occasionally spawn glyphs randomly
    if (Math.random() < 0.003) {
      this.addGlyph(
        Math.random() * w,
        h + 20
      );
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ════════════════════════════════════════════════════════════════
   MATERIALS DATABASE
   ════════════════════════════════════════════════════════════════ */

async function loadMaterials() {
  try {
    const res = await fetch('data/materials.json');
    materials = await res.json();
    materialsFlat = [];
    for (const [cat, items] of Object.entries(materials)) {
      for (const item of items) {
        materialsFlat.push({ ...item, category: cat });
      }
    }
    populateCategoryDropdown();
  } catch (e) {
    console.warn('Failed to load materials DB:', e);
    // Fallback minimal set
    materialsFlat = [
      { name: '2x4x8 SPF Stud', price: 4.98, unit: 'ea', category: 'Lumber' },
      { name: '4x8 1/2" Drywall', price: 15.98, unit: 'sheet', category: 'Drywall' },
    ];
  }
}

function populateCategoryDropdown() {
  const sel = dom.itemCategory;
  sel.innerHTML = '<option value="">All categories...</option>';
  for (const cat of Object.keys(materials).sort()) {
    sel.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  }
}

function getFilteredMaterials(category, query) {
  let list = materialsFlat;
  if (category) {
    list = list.filter(m => m.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q));
  }
  return list.slice(0, 30);
}

/* ════════════════════════════════════════════════════════════════
   CA BUILDING CODES DATABASE
   ════════════════════════════════════════════════════════════════ */

async function loadCaCodes() {
  try {
    const res = await fetch('data/ca-codes.json');
    caCodes = await res.json();
  } catch (e) {
    console.warn('Failed to load CA codes:', e);
    caCodes = [];
  }
}

function searchCodes(query) {
  if (!query || !query.trim()) return caCodes.slice(0, 15);
  const q = query.toLowerCase().trim();
  const results = caCodes.filter(c => {
    return c.section.toLowerCase().includes(q)
      || c.title.toLowerCase().includes(q)
      || c.description.toLowerCase().includes(q)
      || c.keywords.some(k => k.toLowerCase().includes(q))
      || c.code.toLowerCase().includes(q);
  });
  return results.slice(0, 30);
}

/* ════════════════════════════════════════════════════════════════
   AUTOCOMPLETE
   ════════════════════════════════════════════════════════════════ */

function setupAutocomplete() {
  dom.itemSearch.addEventListener('input', () => {
    const query = dom.itemSearch.value.trim();
    const category = dom.itemCategory.value;
    if (query.length < 1) {
      dom.autocompleteResults.classList.remove('active');
      return;
    }
    const results = getFilteredMaterials(category, query);
    renderAutocomplete(results);
  });

  dom.itemSearch.addEventListener('blur', () => {
    setTimeout(() => dom.autocompleteResults.classList.remove('active'), 200);
  });

  dom.itemSearch.addEventListener('focus', () => {
    const query = dom.itemSearch.value.trim();
    if (query.length >= 1) {
      const results = getFilteredMaterials(dom.itemCategory.value, query);
      renderAutocomplete(results);
    }
  });

  dom.itemCategory.addEventListener('change', () => {
    const query = dom.itemSearch.value.trim();
    if (query.length >= 1) {
      const results = getFilteredMaterials(dom.itemCategory.value, query);
      renderAutocomplete(results);
    }
  });
}

function renderAutocomplete(results) {
  const container = dom.autocompleteResults;
  if (results.length === 0) {
    container.classList.remove('active');
    return;
  }
  container.innerHTML = results.map(item => `
    <div class="autocomplete-item" data-name="${escapeAttr(item.name)}" data-price="${item.price}" data-unit="${escapeAttr(item.unit)}" data-category="${escapeAttr(item.category)}">
      <span class="item-name">${escapeHtml(item.name)}</span>
      <span>
        <span class="item-price">$${item.price.toFixed(2)}</span>
        <span class="item-unit">/${item.unit}</span>
      </span>
    </div>
  `).join('');

  container.querySelectorAll('.autocomplete-item').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      dom.itemSearch.value = el.dataset.name;
      dom.itemUnitPrice.value = parseFloat(el.dataset.price);
      dom.itemUnit.value = el.dataset.unit;
      dom.itemCategory.value = el.dataset.category;
      dom.autocompleteResults.classList.remove('active');
      dom.itemQty.focus();
      dom.itemQty.select();
    });
  });

  container.classList.add('active');
}

/* ════════════════════════════════════════════════════════════════
   ADD / REMOVE ITEMS
   ════════════════════════════════════════════════════════════════ */

function addItem(name, category, qty, unitPrice, unit, markup, waste, laborCategory) {
  if (!name || !qty || !unitPrice) {
    showToast('Please enter item name, quantity, and price.', 'warning');
    return;
  }

  if (editingItemId) {
    // ── UPDATE existing item ──
    const idx = state.items.findIndex(i => i.id === editingItemId);
    if (idx !== -1) {
      state.items[idx] = {
        ...state.items[idx],
        category: category || 'Uncategorized',
        name: name.trim(),
        qty: parseFloat(qty) || 1,
        unitPrice: parseFloat(unitPrice) || 0,
        unit: unit || 'ea',
        markup: markup != null ? parseFloat(markup) : parseFloat(dom.itemMarkup.value || 10),
        waste: waste != null ? parseFloat(waste) : parseFloat(dom.itemWaste.value || 10),
        laborCategory: laborCategory || dom.itemLaborCat.value || 'general',
      };
    }
    cancelEdit();
    showToast('Item updated.', 'success');
  } else {
    // ── CREATE new item ──
    const item = {
      id: uid(),
      category: category || 'Uncategorized',
      name: name.trim(),
      qty: parseFloat(qty) || 1,
      unitPrice: parseFloat(unitPrice) || 0,
      unit: unit || 'ea',
      markup: markup != null ? parseFloat(markup) : parseFloat(dom.itemMarkup.value || 10),
      waste: waste != null ? parseFloat(waste) : parseFloat(dom.itemWaste.value || 10),
      laborCategory: laborCategory || dom.itemLaborCat.value || 'general',
    };
    state.items.push(item);
    clearAddForm();
  }

  renderItems();
  updateSummary();
}

function removeItem(id) {
  // If we're editing this item, cancel edit mode first
  if (editingItemId === id) cancelEdit();
  state.items = state.items.filter(i => i.id !== id);
  renderItems();
  updateSummary();
}

function editItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;

  // Populate the form with the item's current values
  dom.itemCategory.value = item.category || '';
  dom.itemSearch.value = item.name;
  dom.itemQty.value = item.qty;
  dom.itemUnitPrice.value = item.unitPrice;
  dom.itemUnit.value = item.unit || 'ea';
  dom.itemMarkup.value = item.markup;
  dom.itemWaste.value = item.waste;
  dom.itemLaborCat.value = item.laborCategory || 'general';

  // Switch button to Update mode
  dom.btnAddItem.textContent = '↻ Update';
  dom.btnAddItem.classList.add('btn-editing');

  // Show the cancel button
  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) cancelBtn.style.display = '';

  // Scroll the form into view and focus
  dom.itemSearch.focus();
  dom.itemSearch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelEdit() {
  editingItemId = null;
  dom.btnAddItem.textContent = '+ Add';
  dom.btnAddItem.classList.remove('btn-editing');

  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) cancelBtn.style.display = 'none';

  clearAddForm();
}

function clearAddForm() {
  dom.itemSearch.value = '';
  dom.itemQty.value = '1';
  dom.itemUnitPrice.value = '0.00';
  dom.itemUnit.value = 'ea';
}

/* ─── Subcontractors, Equipment, Permits ─── */

function addSub() {
  const name = dom.subName.value.trim();
  const cost = parseFloat(dom.subCost.value) || 0;
  const license = (dom.subLicense ? dom.subLicense.value.trim() : '') || '';
  if (!name || cost <= 0) { showToast('Enter a trade name and cost.', 'warning'); return; }
  state.subcontractors.push({ id: uid(), name, cost, license });
  dom.subName.value = '';
  dom.subCost.value = '';
  if (dom.subLicense) dom.subLicense.value = '';
  renderSubs();
  updateSummary();
}

function removeSub(id) {
  state.subcontractors = state.subcontractors.filter(s => s.id !== id);
  renderSubs();
  updateSummary();
}

function addEquip() {
  const name = dom.equipName.value.trim();
  const cost = parseFloat(dom.equipCost.value) || 0;
  if (!name || cost <= 0) { showToast('Enter equipment name and cost.', 'warning'); return; }
  state.equipment.push({ id: uid(), name, cost });
  dom.equipName.value = '';
  dom.equipCost.value = '';
  renderEquip();
  updateSummary();
}

function removeEquip(id) {
  state.equipment = state.equipment.filter(e => e.id !== id);
  renderEquip();
  updateSummary();
}

function addPermit() {
  const name = dom.permitName.value.trim();
  const cost = parseFloat(dom.permitCost.value) || 0;
  if (!name || cost <= 0) { showToast('Enter permit/fee name and amount.', 'warning'); return; }
  state.permits.push({ id: uid(), name, cost });
  dom.permitName.value = '';
  dom.permitCost.value = '';
  renderPermits();
  updateSummary();
}

function removePermit(id) {
  state.permits = state.permits.filter(p => p.id !== id);
  renderPermits();
  updateSummary();
}

/* ════════════════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════════════════ */

function renderItems() {
  const tbody = dom.itemsTbody;
  const empty = dom.tableEmpty;
  if (state.items.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = state.items.map(item => {
    const total = item.qty * item.unitPrice;
    const markupAmt = state.advancedMode ? total * (item.markup / 100) : total * (state.markupPercent / 100);
    const wasteAmt = state.advancedMode ? total * (item.waste / 100) : total * (state.wastePercent / 100);
    const grandTotal = total + markupAmt + wasteAmt;
    return `<tr>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td class="td-center">${item.qty}</td>
      <td class="td-center">${escapeHtml(item.unit)}</td>
      <td class="td-right">$${item.unitPrice.toFixed(2)}</td>
      <td class="td-right td-markup">${state.advancedMode ? item.markup + '%' : state.markupPercent + '%'}</td>
      <td class="td-right"><strong>$${grandTotal.toFixed(2)}</strong></td>
      <td class="td-actions">
        <button class="btn-icon btn-icon-edit" onclick="editItem('${item.id}')" title="Edit">✎</button>
        <button class="btn-icon" onclick="removeItem('${item.id}')" title="Remove">✕</button>
      </td>
    </tr>`;
  }).join('');
}

function renderSubs() {
  dom.subTbody.innerHTML = state.subcontractors.map(s => `
    <tr>
      <td>${escapeHtml(s.name)}</td>
      <td class="td-right">$${s.cost.toFixed(2)}</td>
      <td>${s.license ? escapeHtml(s.license) : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td class="td-actions"><button class="btn-icon" onclick="removeSub('${s.id}')">✕</button></td>
    </tr>
  `).join('');
}

function renderEquip() {
  dom.equipTbody.innerHTML = state.equipment.map(e => `
    <tr>
      <td>${escapeHtml(e.name)}</td>
      <td class="td-right">$${e.cost.toFixed(2)}</td>
      <td class="td-actions"><button class="btn-icon" onclick="removeEquip('${e.id}')">✕</button></td>
    </tr>
  `).join('');
}

function renderPermits() {
  dom.permitTbody.innerHTML = state.permits.map(p => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td class="td-right">$${p.cost.toFixed(2)}</td>
      <td class="td-actions"><button class="btn-icon" onclick="removePermit('${p.id}')">✕</button></td>
    </tr>
  `).join('');
}

/* ════════════════════════════════════════════════════════════════
   CALCULATIONS & SUMMARY
   ════════════════════════════════════════════════════════════════ */

function calcItemTotal(item) {
  const base = item.qty * item.unitPrice;
  const markupPct = state.advancedMode ? item.markup : state.markupPercent;
  const wastePct = state.advancedMode ? item.waste : state.wastePercent;
  const markup = base * (markupPct / 100);
  const waste = base * (wastePct / 100);
  return { base, markup, waste, total: base + markup + waste };
}

function updateSummary() {
  // Materials
  let materialsBase = 0;
  let materialsMarkup = 0;
  let materialsWaste = 0;
  const laborByCategory = {};

  for (const item of state.items) {
    const calc = calcItemTotal(item);
    materialsBase += calc.base;
    materialsMarkup += calc.markup;
    materialsWaste += calc.waste;

    if (state.advancedMode) {
      const lc = item.laborCategory || 'general';
      if (!laborByCategory[lc]) laborByCategory[lc] = { hours: 0, cost: 0 };
      // Estimate labor based on item complexity (simplified: assume labor hours scale with item cost)
      const estLaborHours = calc.base * 0.02; // rough: 2% of base cost = hours
      laborByCategory[lc].hours += estLaborHours;
    }
  }

  const materialsTotal = materialsBase + materialsMarkup + materialsWaste;

  // Labor
  const laborCost = state.laborHours * state.hourlyRate;

  // Advanced costs
  const subTotal = state.subcontractors.reduce((s, c) => s + c.cost, 0);
  const equipTotal = state.equipment.reduce((s, c) => s + c.cost, 0);
  const permitTotal = state.permits.reduce((s, c) => s + c.cost, 0);
  const otherCosts = subTotal + equipTotal + permitTotal;

  // Overhead (applied to materials + labor + other)
  const subtotalBeforeOverhead = materialsTotal + laborCost + otherCosts;
  const overheadAmt = subtotalBeforeOverhead * (state.overheadPercent / 100);

  // Profit margin (applied to everything so far)
  const subtotalBeforeProfit = subtotalBeforeOverhead + overheadAmt;
  const profitAmt = subtotalBeforeProfit * (state.profitPercent / 100);

  // Discount
  const subtotalBeforeDiscount = subtotalBeforeProfit + profitAmt;
  const discountAmt = subtotalBeforeDiscount * (state.discountPercent / 100);

  // Tax (on materials + markup + waste only)
  const taxBase = materialsTotal;
  const taxAmt = state.taxEnabled ? taxBase * (state.taxPercent / 100) : 0;

  // Grand total
  const grandTotal = subtotalBeforeDiscount - discountAmt + taxAmt;

  // Update DOM
  dom.sumMaterials.textContent = '$' + materialsBase.toFixed(2);
  dom.sumMarkup.textContent = '$' + materialsMarkup.toFixed(2);
  dom.sumWaste.textContent = '$' + materialsWaste.toFixed(2);
  dom.sumMaterialsTotal.textContent = '$' + materialsTotal.toFixed(2);
  dom.sumLabor.textContent = '$' + laborCost.toFixed(2);
  dom.sumSubcontractors.textContent = '$' + subTotal.toFixed(2);
  dom.sumEquipment.textContent = '$' + equipTotal.toFixed(2);
  dom.sumPermits.textContent = '$' + permitTotal.toFixed(2);
  dom.sumOverhead.textContent = '$' + overheadAmt.toFixed(2);
  dom.sumProfit.textContent = '$' + profitAmt.toFixed(2);
  dom.sumDiscount.textContent = '-$' + discountAmt.toFixed(2);
  dom.sumTax.textContent = '$' + taxAmt.toFixed(2);
  dom.sumGrand.textContent = '$' + grandTotal.toFixed(2);

  // Labor breakdown
  if (state.advancedMode && Object.keys(laborByCategory).length > 0) {
    dom.sumLaborBreakdown.innerHTML = Object.entries(laborByCategory).map(([cat, data]) => {
      const cost = data.hours * state.hourlyRate;
      return `<div class="labor-breakdown-item">
        <span class="lb-category">${escapeHtml(cat)}</span>
        <span class="lb-hours">${data.hours.toFixed(1)} hrs</span>
        <span class="lb-cost">$${cost.toFixed(2)}</span>
      </div>`;
    }).join('');
  } else {
    dom.sumLaborBreakdown.innerHTML = '<div class="labor-breakdown-item" style="color:var(--text-muted)">Add items to see labor estimates</div>';
  }
}

/* ════════════════════════════════════════════════════════════════
   MODE TOGGLE
   ════════════════════════════════════════════════════════════════ */

function toggleMode(advanced) {
  state.advancedMode = advanced;
  dom.modeSwitch.checked = advanced;
  dom.modeLabel.textContent = advanced ? 'Advanced' : 'Simple';

  // Toggle ALL advanced-fields elements
  document.querySelectorAll('.advanced-fields').forEach(el => {
    el.classList.toggle('visible', advanced);
  });

  // Show/hide markup column in items table
  document.querySelectorAll('.th-markup, .td-markup').forEach(el => {
    el.style.display = advanced ? '' : 'none';
  });

  renderItems();
  updateSummary();
}

/* ════════════════════════════════════════════════════════════════
   SAVE / LOAD
   ════════════════════════════════════════════════════════════════ */

function saveEstimate(name) {
  const data = {
    ...state,
    id: uid(),
    savedName: name || state.projectName || 'Untitled Estimate',
    savedAt: new Date().toISOString(),
  };
  const saved = getSavedEstimates();
  saved.unshift(data);
  localStorage.setItem('eldritch-estimates', JSON.stringify(saved));
  showToast(`Saved: "${data.savedName}"`, 'success');
}

function getSavedEstimates() {
  try {
    return JSON.parse(localStorage.getItem('eldritch-estimates') || '[]');
  } catch {
    return [];
  }
}

function loadEstimate(id) {
  // Cancel any in-progress edit first
  if (editingItemId) cancelEdit();
  
  const saved = getSavedEstimates();
  const data = saved.find(s => s.id === id);
  if (!data) { showToast('Estimate not found.', 'danger'); return; }
  // Restore state fields but keep our methods
  const fields = ['projectName', 'customerName', 'customerEmail', 'customerPhone', 'customerAddress',
    'date', 'notes', 'items', 'subcontractors', 'equipment', 'permits',
    'markupPercent', 'wastePercent', 'laborHours', 'hourlyRate',
    'overheadPercent', 'profitPercent', 'discountPercent',
    'taxEnabled', 'taxPercent', 'advancedMode',
    'projectNotes', 'projectStatus', 'crewSize', 'projectDuration', 'projectStart', 'crewNotes',
    'changeOrders'];
  for (const f of fields) {
    if (data[f] !== undefined) state[f] = data[f];
  }
  state.id = data.id;
  syncStateToUI();
  showToast(`Loaded: "${data.savedName}"`, 'success');
}

function deleteSavedEstimate(id) {
  let saved = getSavedEstimates();
  saved = saved.filter(s => s.id !== id);
  localStorage.setItem('eldritch-estimates', JSON.stringify(saved));
  renderSavedList();
}

function syncStateToUI() {
  dom.projectName.value = state.projectName;
  dom.customerName.value = state.customerName;
  dom.customerEmail.value = state.customerEmail;
  dom.customerPhone.value = state.customerPhone;
  dom.customerAddress.value = state.customerAddress;
  dom.estimateDate.value = state.date;
  dom.estimateNotes.value = state.notes;
  dom.markupPercent.value = state.markupPercent;
  dom.wastePercent.value = state.wastePercent;
  dom.laborHours.value = state.laborHours;
  dom.hourlyRateSlider.value = state.hourlyRate;
  dom.hourlyRateDisplay.textContent = '$' + state.hourlyRate;
  // New fields
  if (dom.projectNotes) dom.projectNotes.value = state.projectNotes || '';
  if (dom.projectStatus) dom.projectStatus.value = state.projectStatus || 'estimating';
  if (dom.crewSize) dom.crewSize.value = state.crewSize || 1;
  if (dom.projectDuration) dom.projectDuration.value = state.projectDuration || 1;
  if (dom.projectStart) dom.projectStart.value = state.projectStart || new Date().toISOString().slice(0, 10);
  if (dom.crewNotes) dom.crewNotes.value = state.crewNotes || '';
  dom.overheadPercent.value = state.overheadPercent;
  dom.profitPercent.value = state.profitPercent;
  dom.discountPercent.value = state.discountPercent;
  dom.taxToggle.checked = state.taxEnabled;
  dom.taxPercent.value = state.taxPercent;
  dom.taxPercent.disabled = !state.taxEnabled;
  dom.taxToggleText.textContent = state.taxEnabled ? 'On' : 'Off';
  toggleMode(state.advancedMode);
  renderItems();
  renderSubs();
  renderEquip();
  renderPermits();
  renderChangeOrders();
  updateSummary();
}

/* ════════════════════════════════════════════════════════════════
   MODAL
   ════════════════════════════════════════════════════════════════ */

function showModal(type) {
  dom.modalOverlay.classList.remove('modal-hidden');
  dom.saveModal.style.display = type === 'save' ? 'flex' : 'none';
  dom.loadModal.style.display = type === 'load' ? 'flex' : 'none';
  dom.calcModal.style.display = 'none';  // ensure calc modal doesn't leak through
  if (type === 'save') {
    dom.saveName.value = state.projectName || 'Untitled Estimate';
    renderSavedList();
    dom.saveName.focus();
  }
  if (type === 'load') {
    renderLoadList();
  }
}

function hideModal() {
  dom.modalOverlay.classList.add('modal-hidden');
  dom.saveModal.style.display = 'none';
  dom.loadModal.style.display = 'none';
  dom.calcModal.style.display = 'none';
}

function renderSavedList() {
  const saved = getSavedEstimates();
  if (saved.length === 0) {
    dom.savedEstimates.innerHTML = '<div class="code-empty">No saved estimates yet.</div>';
    return;
  }
  dom.savedEstimates.innerHTML = saved.map(s => {
    const date = new Date(s.savedAt);
    return `<div class="saved-item">
      <div>
        <div class="saved-item-name">${escapeHtml(s.savedName)}</div>
        <div class="saved-item-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
      <div class="saved-item-actions">
        <button class="btn btn-sm btn-accent" onclick="event.stopPropagation(); loadEstimate('${s.id}'); hideModal();">Load</button>
        <button class="btn btn-sm" onclick="event.stopPropagation(); deleteSavedEstimate('${s.id}')">Delete</button>
      </div>
    </div>`;
  }).join('');
}

function renderLoadList() {
  const saved = getSavedEstimates();
  if (saved.length === 0) {
    dom.loadEstimates.innerHTML = '<div class="code-empty">No saved estimates yet.</div>';
    return;
  }
  dom.loadEstimates.innerHTML = saved.map(s => {
    const date = new Date(s.savedAt);
    return `<div class="saved-item" onclick="loadEstimate('${s.id}'); hideModal();">
      <div>
        <div class="saved-item-name">${escapeHtml(s.savedName)}</div>
        <div class="saved-item-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    </div>`;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════
   EXPORT / PRINT
   ════════════════════════════════════════════════════════════════ */

function exportPDF() {
  updateSummary();
  // Open print view
  window.print();
}

/* ════════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ════════════════════════════════════════════════════════════════ */

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  const colors = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    info: 'var(--text-secondary)',
  };
  const bgColors = {
    success: 'var(--success-bg)',
    warning: 'var(--warning-bg)',
    danger: 'var(--danger-bg)',
    info: 'transparent',
  };
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    padding: 10px 22px; border-radius: 8px;
    background: var(--bg-elevated); border: 1px solid ${colors[type] || 'var(--border)'};
    color: ${colors[type] || 'var(--text-primary)'};
    font-family: var(--font-ui); font-size: 0.85rem; z-index: 2000;
    box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    transition: opacity 0.3s ease; opacity: 0;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ════════════════════════════════════════════════════════════════
   HOME DEPOT SEARCH (mock / placeholder)
   ════════════════════════════════════════════════════════════════ */

// We include a function that can be wired to a real API later.
// For now, it searches the local materials database with a "via Home Depot" indicator.
async function searchHomeDepot(query) {
  // This would call an external API - for now use local data
  // Replace this with actual API call when you have credentials
  return materialsFlat.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}

/* ════════════════════════════════════════════════════════════════
   CODE SEARCH UI
   ════════════════════════════════════════════════════════════════ */

function setupCodeSearch() {
  // Inject code search UI into the advanced section
  const codeCard = document.createElement('div');
  codeCard.className = 'card advanced-fields';
  codeCard.id = 'code-card';
  codeCard.innerHTML = `
    <div class="card-header">
      <span class="card-icon">◉</span>
      <h2>CA Building Code Reference</h2>
    </div>
    <div class="card-body">
      <div class="form-row">
        <div class="form-group">
          <label for="code-search-query">Search California Codes</label>
          <input type="text" id="code-search-query" placeholder="e.g. egress, fire, GFCI, termite, sprinkler..." />
        </div>
      </div>
      <div class="code-results" id="code-results">
        <div class="code-empty">Type a keyword above to search California building codes (CRC, CBC, CALGreen, CEBC, CPC, CMC, CEC)</div>
      </div>
      <div class="form-row" style="margin-top:8px;">
        <div class="form-group">
          <label for="code-section">Attach Code to Notes</label>
          <textarea id="code-section" rows="2" placeholder="Selected code reference will appear here. Copy/paste into notes." readonly></textarea>
        </div>
      </div>
    </div>
  `;
  dom.advOtherCosts.parentNode.insertBefore(codeCard, dom.advOtherCosts.nextSibling);

  dom.codeSearchQuery = $('#code-search-query');
  dom.codeResults = $('#code-results');
  dom.codeSection = $('#code-section');

  dom.codeSearchQuery.addEventListener('input', () => {
    const query = dom.codeSearchQuery.value.trim();
    if (query.length < 2) {
      dom.codeResults.innerHTML = '<div class="code-empty">Type a keyword above to search California building codes</div>';
      return;
    }
    const results = searchCodes(query);
    renderCodeResults(results);
  });

  // Also auto-populate into the notes area
  dom.codeResults.addEventListener('click', (e) => {
    const item = e.target.closest('.code-result-item');
    if (!item) return;
    const ref = item.dataset.ref;
    const title = item.dataset.title;
    const desc = item.dataset.desc;
    const code = item.dataset.code;
    const text = `[${code} ${ref}] ${title}\n${desc}`;
    dom.codeSection.value = text;
    // Also append to notes
    if (dom.estimateNotes) {
      const current = dom.estimateNotes.value;
      dom.estimateNotes.value = current
        ? current + '\n\n--- Code Ref ---\n' + text
        : '--- Code Ref ---\n' + text;
      showToast(`Attached: ${code} ${ref}`, 'success');
    }
  });
}

function renderCodeResults(results) {
  if (results.length === 0) {
    dom.codeResults.innerHTML = '<div class="code-empty">No matching codes found. Try different keywords.</div>';
    return;
  }
  dom.codeResults.innerHTML = results.map(c => {
    const badgeClass = `code-badge-${c.code.toLowerCase()}`;
    const keywords = c.keywords.slice(0, 6);
    return `<div class="code-result-item"
      data-ref="${escapeAttr(c.section)}"
      data-title="${escapeAttr(c.title)}"
      data-desc="${escapeAttr(c.description)}"
      data-code="${escapeAttr(c.code)}">
      <div>
        <span class="code-result-ref">${escapeHtml(c.code)} ${escapeHtml(c.section)}</span>
        <span class="code-badge ${badgeClass}">${escapeHtml(c.code)}</span>
      </div>
      <div class="code-result-title">${escapeHtml(c.title)}</div>
      <div class="code-result-desc">${escapeHtml(c.description)}</div>
      <div class="code-result-keywords">
        ${keywords.map(k => `<span>${escapeHtml(k)}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════
   EVENT BINDING
   ════════════════════════════════════════════════════════════════ */

function bindEvents() {
  // Add item
  dom.btnAddItem.addEventListener('click', () => {
    const name = dom.itemSearch.value.trim();
    const category = dom.itemCategory.value;
    const qty = dom.itemQty.value;
    const price = dom.itemUnitPrice.value;
    const unit = dom.itemUnit.value.trim() || 'ea';
    addItem(name, category, qty, price, unit);
  });

  // Cancel edit
  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelEdit);
  }

  // Enter key on search field
  dom.itemSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Check if autocomplete is open and has selected item
      const active = dom.autocompleteResults.querySelector('.autocomplete-item.active');
      if (active) {
        active.click();
      } else {
        dom.btnAddItem.click();
      }
    }
  });

  // Arrow keys for autocomplete navigation & Escape to cancel edit
  dom.itemSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editingItemId) {
      e.preventDefault();
      cancelEdit();
      return;
    }
    const items = dom.autocompleteResults.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;
    let idx = Array.from(items).findIndex(el => el.classList.contains('active'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items.forEach(el => el.classList.remove('active'));
      idx = Math.min(idx + 1, items.length - 1);
      items[idx].classList.add('active');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items.forEach(el => el.classList.remove('active'));
      idx = Math.max(idx - 1, 0);
      items[idx].classList.add('active');
    }
  });

  // Quantity enter
  dom.itemQty.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dom.btnAddItem.click();
  });

  // Summary input changes
  dom.markupPercent.addEventListener('input', () => { state.markupPercent = parseFloat(dom.markupPercent.value) || 0; renderItems(); updateSummary(); });
  dom.wastePercent.addEventListener('input', () => { state.wastePercent = parseFloat(dom.wastePercent.value) || 0; renderItems(); updateSummary(); });
  dom.laborHours.addEventListener('input', () => { state.laborHours = parseFloat(dom.laborHours.value) || 0; updateSummary(); });
  dom.hourlyRateSlider.addEventListener('input', () => {
    state.hourlyRate = parseInt(dom.hourlyRateSlider.value);
    dom.hourlyRateDisplay.textContent = '$' + state.hourlyRate;
    updateSummary();
  });
  dom.overheadPercent.addEventListener('input', () => { state.overheadPercent = parseFloat(dom.overheadPercent.value) || 0; updateSummary(); });
  dom.profitPercent.addEventListener('input', () => { state.profitPercent = parseFloat(dom.profitPercent.value) || 0; updateSummary(); });
  dom.discountPercent.addEventListener('input', () => { state.discountPercent = parseFloat(dom.discountPercent.value) || 0; updateSummary(); });
  dom.taxToggle.addEventListener('change', () => {
    state.taxEnabled = dom.taxToggle.checked;
    dom.taxPercent.disabled = !state.taxEnabled;
    dom.taxToggleText.textContent = state.taxEnabled ? 'On' : 'Off';
    updateSummary();
  });
  dom.taxPercent.addEventListener('input', () => { state.taxPercent = parseFloat(dom.taxPercent.value) || 0; updateSummary(); });

  // Project info changes (auto-save to state)
  dom.projectName.addEventListener('input', () => { state.projectName = dom.projectName.value; });
  dom.customerName.addEventListener('input', () => { state.customerName = dom.customerName.value; });
  dom.customerEmail.addEventListener('input', () => { state.customerEmail = dom.customerEmail.value; });
  dom.customerPhone.addEventListener('input', () => { state.customerPhone = dom.customerPhone.value; });
  dom.customerAddress.addEventListener('input', () => { state.customerAddress = dom.customerAddress.value; });
  dom.estimateDate.addEventListener('input', () => { state.date = dom.estimateDate.value; });
  dom.estimateNotes.addEventListener('input', () => { state.notes = dom.estimateNotes.value; });

  // Mode toggle
  dom.modeSwitch.addEventListener('change', () => {
    toggleMode(dom.modeSwitch.checked);
  });

  // Subcontractor
  dom.btnAddSub.addEventListener('click', addSub);
  dom.subName.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSub(); });
  dom.subCost.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSub(); });

  // Equipment
  dom.btnAddEquip.addEventListener('click', addEquip);
  dom.equipName.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEquip(); });
  dom.equipCost.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEquip(); });

  // Permits
  dom.btnAddPermit.addEventListener('click', addPermit);
  dom.permitName.addEventListener('keydown', (e) => { if (e.key === 'Enter') addPermit(); });
  dom.permitCost.addEventListener('keydown', (e) => { if (e.key === 'Enter') addPermit(); });

  // Header actions
  dom.btnNew.addEventListener('click', newEstimate);
  dom.btnReset.addEventListener('click', newEstimate);
  dom.btnSave.addEventListener('click', () => showModal('save'));
  dom.btnSaveQuick.addEventListener('click', () => showModal('save'));
  dom.btnLoad.addEventListener('click', () => showModal('load'));
  dom.btnExport.addEventListener('click', exportPDF);
  dom.btnExportQuick.addEventListener('click', exportPDF);

  // Modal
  dom.modalClose.addEventListener('click', hideModal);
  dom.modalCancel.addEventListener('click', hideModal);
  dom.loadModalClose.addEventListener('click', hideModal);
  dom.loadModalCancel.addEventListener('click', hideModal);
  dom.modalOverlay.addEventListener('click', (e) => {
    if (e.target === dom.modalOverlay) hideModal();
  });
  dom.modalSaveConfirm.addEventListener('click', () => {
    const name = dom.saveName.value.trim() || 'Untitled Estimate';
    saveEstimate(name);
    hideModal();
  });
  dom.saveName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dom.modalSaveConfirm.click();
  });

  // ─── New Feature Bindings ───

  // Project notes
  if (dom.projectNotes) {
    dom.projectNotes.addEventListener('input', () => { state.projectNotes = dom.projectNotes.value; });
  }
  if (dom.projectStatus) {
    dom.projectStatus.addEventListener('change', () => { state.projectStatus = dom.projectStatus.value; });
  }

  // Crew & Timeline
  if (dom.crewSize) {
    dom.crewSize.addEventListener('input', () => { state.crewSize = parseInt(dom.crewSize.value) || 1; });
  }
  if (dom.projectDuration) {
    dom.projectDuration.addEventListener('input', () => { state.projectDuration = parseFloat(dom.projectDuration.value) || 0; });
  }
  if (dom.projectStart) {
    dom.projectStart.addEventListener('input', () => { state.projectStart = dom.projectStart.value; });
  }
  if (dom.crewNotes) {
    dom.crewNotes.addEventListener('input', () => { state.crewNotes = dom.crewNotes.value; });
  }

  // Change Orders
  if (dom.btnAddChange) {
    dom.btnAddChange.addEventListener('click', addChangeOrder);
  }
  if (dom.changeDesc) {
    dom.changeDesc.addEventListener('keydown', (e) => { if (e.key === 'Enter') addChangeOrder(); });
  }
  if (dom.changeAmount) {
    dom.changeAmount.addEventListener('keydown', (e) => { if (e.key === 'Enter') addChangeOrder(); });
  }

  // Obsidian Export
  if (dom.btnExportObsidian) {
    dom.btnExportObsidian.addEventListener('click', exportToObsidian);
  }

  // Calculator tabs & basic calculator
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchCalcTab(tab.dataset.calc);
    });
  });

  // Calculator inputs (update on change)
  document.querySelectorAll('.calc-pane input, .calc-pane select').forEach(el => {
    el.addEventListener('input', () => {
      const pane = el.closest('.calc-pane');
      if (pane) {
        const id = pane.id.replace('calc-', '');
        updateCalc(id);
      }
    });
    el.addEventListener('change', () => {
      const pane = el.closest('.calc-pane');
      if (pane) {
        const id = pane.id.replace('calc-', '');
        updateCalc(id);
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   CHANGE ORDERS
   ════════════════════════════════════════════════════════════════ */

function addChangeOrder() {
  const desc = dom.changeDesc.value.trim();
  const amount = parseFloat(dom.changeAmount.value) || 0;
  if (!desc || amount <= 0) { showToast('Enter a description and amount.', 'warning'); return; }
  state.changeOrders.push({
    id: uid(),
    description: desc,
    amount: amount,
    status: 'pending',
    date: new Date().toISOString().slice(0, 10),
  });
  dom.changeDesc.value = '';
  dom.changeAmount.value = '';
  renderChangeOrders();
  updateSummary();
  showToast(`Change order added: ${desc}`, 'success');
}

function removeChangeOrder(id) {
  state.changeOrders = state.changeOrders.filter(c => c.id !== id);
  renderChangeOrders();
  updateSummary();
}

function toggleChangeStatus(id) {
  const co = state.changeOrders.find(c => c.id === id);
  if (!co) return;
  const statuses = ['pending', 'approved', 'rejected'];
  const idx = statuses.indexOf(co.status);
  co.status = statuses[(idx + 1) % statuses.length];
  renderChangeOrders();
}

function renderChangeOrders() {
  dom.changeTbody.innerHTML = state.changeOrders.map(c => {
    const cls = `co-status-${c.status}`;
    const label = c.status.charAt(0).toUpperCase() + c.status.slice(1);
    return `<tr>
      <td>${escapeHtml(c.description)} <span style="color:var(--text-muted);font-size:0.7rem;">(${c.date})</span></td>
      <td class="td-right" style="font-family:var(--font-mono);color:${c.status === 'approved' ? 'var(--success)' : 'var(--text-secondary)'}">$${c.amount.toFixed(2)}</td>
      <td><span class="co-status ${cls}" onclick="toggleChangeStatus('${c.id}')" style="cursor:pointer;">${label}</span></td>
      <td class="td-actions"><button class="btn-icon" onclick="removeChangeOrder('${c.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════
   OBSIDIAN EXPORT
   ════════════════════════════════════════════════════════════════ */

function exportToObsidian() {
  updateSummary();
  const date = new Date().toISOString().slice(0, 10);
  const projName = state.projectName || 'Untitled Project';
  const client = state.customerName || 'Client Name';
  const estRef = state.id || Date.now().toString(36);

  // Build materials table
  let materialsMd = '';
  let matTotal = 0;
  for (const item of state.items) {
    const total = item.qty * item.unitPrice;
    matTotal += total;
    materialsMd += `| | ${escapeMd(item.name)} | ${item.qty} | ${escapeMd(item.unit)} | $${item.unitPrice.toFixed(2)} | $${total.toFixed(2)} | Home Depot |\n`;
  }

  // Build labor section
  const laborCost = state.laborHours * state.hourlyRate;

  // Build subcontractors
  let subMd = '';
  let subTotal = 0;
  for (const s of state.subcontractors) {
    subMd += `| ${escapeMd(s.name)} | $${s.cost.toFixed(2)} | |\n`;
    subTotal += s.cost;
  }

  // Build change orders
  let coMd = '';
  let coTotal = 0;
  for (const c of state.changeOrders) {
    coMd += `| ${c.date} | ${escapeMd(c.description)} | $${c.amount.toFixed(2)} | ${c.status} |\n`;
    if (c.status === 'approved') coTotal += c.amount;
  }

  // Build code references
  let codeMd = '';
  const codeText = dom.codeSection ? dom.codeSection.value : '';
  if (codeText) {
    codeMd = `| ${codeText.replace(/\n/g, ' | ')} |\n`;
  }

  // Calculate totals
  const markupAmt = matTotal * (state.markupPercent / 100);
  const totalMaterials = matTotal + markupAmt;
  const grandTotal = totalMaterials + laborCost + subTotal + (state.taxEnabled ? totalMaterials * (state.taxPercent / 100) : 0);

  const template = `---
type: construction-project
status: ${state.projectStatus || 'estimating'}
created: ${date}
modified: ${date}
client: "${escapeMd(client)}"
project: "${escapeMd(projName)}"
estimate-ref: "${estRef}"
timeline-start: ${state.projectStart || ''}
timeline-end: 
crew-size: ${state.crewSize || 1}
budget-estimate: ${grandTotal.toFixed(2)}
budget-actual: 
tags:
  - construction
  - estimate
  - active
---

# ${escapeMd(projName)}

> **Client:** ${escapeMd(client)}  
> **Estimate Ref:** ${estRef}  
> **Status:** ${state.projectStatus || 'estimating'}  
> **Date:** ${date}

---

## 📋 Scope of Work

${state.projectNotes || '*No scope description provided.*'}

---

## 📦 Materials List

| # | Item | Qty | Unit | Unit Price | Total | Supplier |
|---|------|-----|------|-----------|-------|----------|
${materialsMd || '| | *No items* | | | | | |'}

**Materials Subtotal:** $${matTotal.toFixed(2)}
**Markup (${state.markupPercent}%):** $${markupAmt.toFixed(2)}
**Total Materials:** $${totalMaterials.toFixed(2)}

---

## 👷 Labor

| Role | Hours | Rate | Total | Workers |
|------|-------|------|-------|---------|
| General Labor | ${state.laborHours} | $${state.hourlyRate}/hr | $${laborCost.toFixed(2)} | ${state.crewSize || 1} |

**Total Labor Hours:** ${state.laborHours}
**Total Labor Cost:** $${laborCost.toFixed(2)}

---

## ⏱ Timeline

- **Start Date:** ${state.projectStart || date}
- **Duration:** ${state.projectDuration || 0} days
- **Crew Size:** ${state.crewSize || 1} workers
- **Notes:** ${state.crewNotes || ''}

---

## 💰 Budget Summary

| Category | Estimated |
|----------|-----------|
| Materials | $${totalMaterials.toFixed(2)} |
| Labor | $${laborCost.toFixed(2)} |
| Subcontractors | $${subTotal.toFixed(2)} |
| **Grand Total** | **$${grandTotal.toFixed(2)}** |

${state.taxEnabled ? `| Tax (${state.taxPercent}%) | $${((totalMaterials) * (state.taxPercent / 100)).toFixed(2)} |\n` : ''}
${state.discountPercent > 0 ? `| Discount (${state.discountPercent}%) | -$${((totalMaterials + laborCost + subTotal) * (state.discountPercent / 100)).toFixed(2)} |\n` : ''}

---

## 📐 Code References

${codeMd || '*No code references attached.*'}

---

## 🔄 Change Orders

| Date | Description | Amount | Status |
|------|-------------|--------|--------|
${coMd || '| | *No change orders* | | |'}

---

## 👥 Subcontractors

| Trade | Amount | License |
|-------|--------|---------|
${subMd || '| *None listed* | | |'}

---

## 📝 Notes

*Exported from Estimate Engine on ${new Date().toLocaleString()}*

`;

  // Create download
  const blob = new Blob([template], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projName.replace(/[^a-zA-Z0-9]/g, '_')}_estimate.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Exported to Obsidian: ${a.download}`, 'success');
}

function escapeMd(str) {
  if (str == null) return '';
  return str.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/* ════════════════════════════════════════════════════════════════
   CALCULATORS (inline in right panel)
   ════════════════════════════════════════════════════════════════ */

/* ── Basic Arithmetic Calculator ── */

let basicCalc = {
  display: '0',
  previousValue: null,
  operation: null,
  resetOnNextDigit: false,
  justEvaluated: false,
};

function basicCalcInput(action) {
  const display = document.getElementById('basic-calc-display');

  if (action === 'ac') {
    basicCalc = {
      display: '0',
      previousValue: null,
      operation: null,
      resetOnNextDigit: false,
      justEvaluated: false,
    };
    display.textContent = '0';
    return;
  }

  if (action === 'c') {
    basicCalc.display = '0';
    basicCalc.resetOnNextDigit = false;
    display.textContent = '0';
    return;
  }

  // Digit or decimal
  if (action === 'decimal' || /^\d$/.test(action)) {
    if (basicCalc.resetOnNextDigit) {
      basicCalc.display = action === 'decimal' ? '0.' : action;
      basicCalc.resetOnNextDigit = false;
    } else {
      if (action === 'decimal') {
        if (basicCalc.display.includes('.')) return;
        basicCalc.display += '.';
      } else {
        if (basicCalc.display === '0') {
          basicCalc.display = action;
        } else {
          basicCalc.display += action;
        }
      }
    }
    basicCalc.justEvaluated = false;
    display.textContent = basicCalc.display;
    return;
  }

  // Negate
  if (action === 'negate') {
    if (basicCalc.display !== '0') {
      basicCalc.display = basicCalc.display.startsWith('-')
        ? basicCalc.display.slice(1)
        : '-' + basicCalc.display;
      display.textContent = basicCalc.display;
    }
    return;
  }

  // Percent
  if (action === 'percent') {
    const val = parseFloat(basicCalc.display) / 100;
    basicCalc.display = String(val);
    basicCalc.resetOnNextDigit = true;
    display.textContent = val.toLocaleString(undefined, {maximumFractionDigits: 10});
    return;
  }

  // Operation (+, -, ×, ÷)
  if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
    const current = parseFloat(basicCalc.display);
    if (basicCalc.operation && !basicCalc.resetOnNextDigit && !basicCalc.justEvaluated) {
      // Chain calculation
      basicCalc.display = String(performCalc(basicCalc.previousValue, current, basicCalc.operation));
      display.textContent = basicCalc.display;
    }
    basicCalc.previousValue = parseFloat(basicCalc.display);
    basicCalc.operation = action;
    basicCalc.resetOnNextDigit = true;
    basicCalc.justEvaluated = false;
    return;
  }

  // Equals
  if (action === 'equals') {
    const current = parseFloat(basicCalc.display);
    if (basicCalc.operation && basicCalc.previousValue !== null) {
      const result = performCalc(basicCalc.previousValue, current, basicCalc.operation);
      basicCalc.display = String(result);
      basicCalc.resetOnNextDigit = true;
      basicCalc.justEvaluated = true;
      display.textContent = result.toLocaleString(undefined, {maximumFractionDigits: 10});
    }
    return;
  }
}

function performCalc(a, b, op) {
  switch (op) {
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return b !== 0 ? a / b : 0;
    default: return b;
  }
}

function initBasicCalc() {
  document.querySelectorAll('.basic-calc-buttons .calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      basicCalcInput(btn.dataset.action);
    });
  });
}

/* ── Tab Switching ── */

function switchCalcTab(name) {
  document.querySelectorAll('.calc-pane').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  const pane = document.getElementById(`calc-${name}`);
  if (pane) pane.style.display = 'block';
  const tab = document.querySelector(`.calc-tab[data-calc="${name}"]`);
  if (tab) tab.classList.add('active');
  if (name !== 'basic') updateCalc(name);
}

/* ── Quick Construction Calculators ── */

function updateCalc(type) {
  switch (type) {
    case 'drywall': {
      const w = parseFloat(document.getElementById('calc-dw-width').value) || 0;
      const l = parseFloat(document.getElementById('calc-dw-length').value) || 0;
      const h = parseFloat(document.getElementById('calc-dw-height').value) || 0;
      const sheetSize = parseFloat(document.getElementById('calc-dw-sheet').value) || 32;
      const waste = parseFloat(document.getElementById('calc-dw-waste').value) || 10;
      const doors = parseFloat(document.getElementById('calc-dw-doors').value) || 0;

      const wallArea = 2 * (w + l) * h;
      const ceilingArea = w * l;
      const openings = doors * 20;
      const totalArea = (wallArea + ceilingArea - openings) * (1 + waste / 100);
      const sheets = Math.ceil(totalArea / sheetSize);
      const cost = sheets * 15.98;

      document.getElementById('calc-dw-result').innerHTML =
        `Sheets needed: <strong>${sheets}</strong> | Total cost: <strong>$${cost.toFixed(2)}</strong>`;
      break;
    }
    case 'concrete': {
      const cl = parseFloat(document.getElementById('calc-con-length').value) || 0;
      const cw = parseFloat(document.getElementById('calc-con-width').value) || 0;
      const cd = parseFloat(document.getElementById('calc-con-depth').value) || 0;
      const cubicFeet = cl * cw * (cd / 12);
      const cubicYards = cubicFeet / 27;
      const bags80 = Math.ceil(cubicYards * 45);
      const cost = cubicYards * 150;

      document.getElementById('calc-con-result').innerHTML =
        `Cubic yards: <strong>${cubicYards.toFixed(2)}</strong> | 80lb bags: <strong>${bags80}</strong> | Total: <strong>$${cost.toFixed(2)}</strong>`;
      break;
    }
    case 'lumber': {
      const ll = parseFloat(document.getElementById('calc-lum-length').value) || 0;
      const spacing = parseInt(document.getElementById('calc-lum-spacing').value) || 16;
      const walls = parseInt(document.getElementById('calc-lum-walls').value) || 1;
      const studs = Math.ceil((ll * 12 / spacing) + 1) * walls;
      const plates = Math.ceil((ll * 3 / 8) * walls);
      const cost = (studs + plates) * 4.98;

      document.getElementById('calc-lum-result').innerHTML =
        `Studs: <strong>${studs}</strong> | Plates: <strong>${plates}</strong> | Total cost: <strong>$${cost.toFixed(2)}</strong>`;
      break;
    }
    case 'paint': {
      const pw = parseFloat(document.getElementById('calc-pt-width').value) || 0;
      const pl = parseFloat(document.getElementById('calc-pt-length').value) || 0;
      const ph = parseFloat(document.getElementById('calc-pt-height').value) || 0;
      const windows = parseFloat(document.getElementById('calc-pt-windows').value) || 0;
      const doors = parseFloat(document.getElementById('calc-pt-doors').value) || 0;
      const coats = parseInt(document.getElementById('calc-pt-coats').value) || 2;

      const wallArea = 2 * (pw + pl) * ph;
      const ceilingArea = pw * pl;
      const subtract = (windows * 15) + (doors * 20);
      const totalArea = (wallArea + ceilingArea - subtract) * coats;
      const gallons = Math.ceil(totalArea / 350);
      const cost = gallons * 32.98;

      document.getElementById('calc-pt-result').innerHTML =
        `Gallons needed: <strong>${gallons}</strong> | Total cost: <strong>$${cost.toFixed(2)}</strong>`;
      break;
    }
    case 'flooring': {
      const fw = parseFloat(document.getElementById('calc-fl-width').value) || 0;
      const fl = parseFloat(document.getElementById('calc-fl-length').value) || 0;
      const fwaste = parseFloat(document.getElementById('calc-fl-waste').value) || 10;
      const fprice = parseFloat(document.getElementById('calc-fl-price').value) || 0;

      const sqft = fw * fl * (1 + fwaste / 100);
      const cost = sqft * fprice;

      document.getElementById('calc-fl-result').innerHTML =
        `Total sq ft: <strong>${sqft.toFixed(1)}</strong> | Material cost: <strong>$${cost.toFixed(2)}</strong>`;
      break;
    }
  }
}

function addCalcResultToEstimate(type) {
  switch (type) {
    case 'drywall': {
      const sheets = parseInt(document.getElementById('calc-dw-result').textContent.match(/[\d.]+/)[0]);
      addItem('Drywall Sheets (calc)', 'Sheathing & Panels', sheets, 15.98, 'sheet');
      break;
    }
    case 'concrete': {
      const match = document.getElementById('calc-con-result').textContent.match(/([\d.]+)/g);
      if (match) {
        const yards = parseFloat(match[0]);
        addItem('Concrete (calc)', 'Concrete & Masonry', yards, 150, 'cu yd');
      }
      break;
    }
    case 'lumber': {
      const match = document.getElementById('calc-lum-result').textContent.match(/([\d.]+)/g);
      if (match) {
        const studs = parseInt(match[0]);
        addItem('2x4x8 Studs (calc)', 'Lumber & Framing', studs, 4.98, 'ea');
      }
      break;
    }
    case 'paint': {
      const match = document.getElementById('calc-pt-result').textContent.match(/([\d.]+)/g);
      if (match) {
        const gallons = parseInt(match[0]);
        addItem('Interior Paint (calc)', 'Paint & Finishes', gallons, 32.98, 'gal');
      }
      break;
    }
    case 'flooring': {
      const match = document.getElementById('calc-fl-result').textContent.match(/([\d.]+)/g);
      const name = document.getElementById('calc-fl-name').value.trim() || 'Flooring Material';
      const price = parseFloat(document.getElementById('calc-fl-price').value) || 3.99;
      if (match) {
        const sqft = parseFloat(match[0]);
        addItem(`${name} (calc)`, 'Flooring', sqft, price, 'sqft');
      }
      break;
    }
  }
}

/* ════════════════════════════════════════════════════════════════
   NEW ESTIMATE
   ════════════════════════════════════════════════════════════════ */

function newEstimate() {
  if (editingItemId) cancelEdit();
  if (state.items.length > 0 || state.subcontractors.length > 0) {
    if (!confirm('Start a new estimate? Unsaved changes will be lost.')) return;
  }
  state = {
    id: null,
    projectName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    items: [],
    subcontractors: [],
    equipment: [],
    permits: [],
    markupPercent: 10,
    wastePercent: 10,
    laborHours: 0,
    hourlyRate: 75,
    overheadPercent: 0,
    profitPercent: 20,
    discountPercent: 0,
    taxEnabled: false,
    taxPercent: 7,
    advancedMode: state.advancedMode,
    ...DEFAULT_STATE_EXTRA,
    changeOrders: [],
  };
  syncStateToUI();
  showToast('New estimate started.', 'info');
}

/* ════════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escapeAttr(str) {
  if (str == null) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ════════════════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════════════════ */

async function init() {
  cacheDom();
  await Promise.all([loadMaterials(), loadCaCodes()]);
  setupAutocomplete();
  setupCodeSearch();
  bindEvents();
  syncStateToUI();
  initBasicCalc();
  // Run initial calc updates so tabs show values right away
  updateCalc('drywall');
  updateCalc('concrete');
  updateCalc('lumber');
  updateCalc('paint');
  updateCalc('flooring');
  // Start particle background
  const bg = new ParticleBackground('bg-canvas');
  showToast('◈ Estimate Engine ready', 'info');
}

document.addEventListener('DOMContentLoaded', init);
