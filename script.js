'use strict';

/* ============================
   SOUND
   ============================ */

let audioCtx = null;
let soundOn = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPop() {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(580, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.start(t);
  osc.stop(t + 0.12);
}

function playDing() {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523, t);
  osc.frequency.setValueAtTime(659, t + 0.08);
  osc.frequency.setValueAtTime(784, t + 0.16);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.start(t);
  osc.stop(t + 0.35);
}

function playComplete() {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime;
  [523, 659, 784, 1047].forEach(function (freq, i) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + i * 0.08);
    gain.gain.setValueAtTime(0.15, t + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.2);
  });
}

function playError() {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.start(t);
  osc.stop(t + 0.2);
}

function toggleSound() {
  soundOn = !soundOn;
  const btn = document.getElementById('soundBtn');
  btn.textContent = soundOn ? '\uD83D\uDD0A' : '\uD83D\uDD07';
  btn.classList.toggle('muted', !soundOn);
  localStorage.setItem('coffeeSound', soundOn ? 'on' : 'off');
}

/* ============================
   INGREDIENTS & ORDERS
   ============================ */

const INGREDIENTS = [
  { id: 'coffee', name: 'Coffee', icon: '\u2615', color: '#6a3a1e' },
  { id: 'sugar', name: 'Sugar', icon: '\uD83C\uDF5A', color: '#e8d8b8' },
  { id: 'milk', name: 'Milk', icon: '\uD83E\uDD5B', color: '#f0ece4', minRating: 0.25 },
  { id: 'cream', name: 'Cream', icon: '\uD83C\uDF66', color: '#fdf2e3', minRating: 0.40 },
  { id: 'choco', name: 'Choco', icon: '\uD83C\uDF6B', color: '#4a2810', minRating: 0.55 },
  { id: 'syrup', name: 'Syrup', icon: '\uD83C\uDF41', color: '#c87840', minRating: 0.70 },
  { id: 'cinnamon', name: 'Cinnamon', icon: '\uD83C\uDF3F', color: '#a06030', minRating: 0.80 },
  { id: 'vanilla', name: 'Vanilla', icon: '\uD83C\uDF3C', color: '#f0e0c0', minRating: 0.90 },
  { id: 'honey', name: 'Honey', icon: '\uD83C\uDF6F', color: '#e0a020', minRating: 0.95 },
];

const ORDER_TEMPLATES = [
  { name: 'Black Coffee',     ings: { coffee: 1 },                  time: 16 },
  { name: 'Espresso',         ings: { coffee: 2, sugar: 1 },        time: 14 },
  { name: 'Latte',            ings: { coffee: 1, milk: 1 },         time: 16 },
  { name: 'Cappuccino',       ings: { coffee: 1, milk: 1, cream: 1 },  time: 18 },
  { name: 'Mocha',            ings: { coffee: 1, milk: 1, choco: 1 },  time: 18 },
  { name: 'Macchiato',        ings: { coffee: 2, milk: 1 },         time: 14 },
  { name: 'Affogato',         ings: { coffee: 1, cream: 1, choco: 1 },  time: 16 },
  { name: 'Irish Coffee',     ings: { coffee: 1, sugar: 1, cream: 1 },  time: 16 },
  { name: 'Cold Brew',        ings: { coffee: 1, milk: 1, sugar: 1 },   time: 14 },
  { name: 'Americano',        ings: { coffee: 2 },                  time: 13 },
  { name: 'Flat White',       ings: { coffee: 1, milk: 2 },         time: 14 },
  { name: 'Con Panna',        ings: { coffee: 1, cream: 2 },        time: 13 },
  { name: 'Ristretto',        ings: { coffee: 1 },                  time: 11 },
  { name: 'Cortado',          ings: { coffee: 1, milk: 1 },         time: 13 },
  { name: 'Red Eye',          ings: { coffee: 2 },                  time: 11 },
  { name: 'Vienna',           ings: { coffee: 1, cream: 2 },        time: 14 },
  { name: 'Frapp\u00e9',     ings: { coffee: 1, milk: 1, cream: 1 },  time: 16 },
  { name: 'Latte Macchiato',  ings: { coffee: 1, milk: 2 },         time: 14 },
  { name: 'Caf\u00e9 au Lait', ings: { coffee: 1, milk: 1, sugar: 1 },  time: 14 },
  { name: 'Caf\u00e9 Bomb\u00f3n', ings: { coffee: 1, milk: 1, choco: 1, sugar: 1 }, time: 18 },
  { name: 'Egg Coffee',       ings: { coffee: 1, milk: 1, sugar: 1, cream: 1 }, time: 18 },
  { name: 'Galao',            ings: { coffee: 1, milk: 2, sugar: 1 },    time: 14 },
  { name: 'Maple Latte',      ings: { coffee: 1, milk: 1, syrup: 1 },       time: 16, minRating: 0.70 },
  { name: 'Syrup Americano',  ings: { coffee: 2, syrup: 1 },                time: 13, minRating: 0.70 },
  { name: 'Cinnamon Cappuccino', ings: { coffee: 1, milk: 1, cinnamon: 1, cream: 1 }, time: 18, minRating: 0.80 },
  { name: 'Cinnamon Mocha',   ings: { coffee: 1, choco: 1, cinnamon: 1, milk: 1 }, time: 18, minRating: 0.80 },
  { name: 'Vanilla Dream',    ings: { coffee: 1, milk: 1, vanilla: 1, sugar: 1 },  time: 16, minRating: 0.90 },
  { name: 'Vanilla Macchiato', ings: { coffee: 2, milk: 1, vanilla: 1 },             time: 16, minRating: 0.90 },
  { name: 'Honey Bliss',      ings: { coffee: 1, milk: 1, honey: 1, cream: 1 },     time: 18, minRating: 0.95 },
  { name: 'Spiced Honey',     ings: { coffee: 1, cinnamon: 1, honey: 1 },            time: 14, minRating: 0.95 },
];

/* ============================
   CONVEYOR SETUP
   ============================ */

const VISIBLE = 2;
const DESIGNS = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }];

const CUP_CENTER_X = 220;
const CUP_CENTER_Y = 140;
const CUP_OFFSCREEN_X = -120;

let cups = [];
let money = 0;
let served = 0;
let missed = 0;
let missStreak = 0;
let totalStars = 1;
let maxStars = 10;
let activeIdx = 0;
let queue = [];
let busy = false;
let paused = false;

const row = document.getElementById('cupsRow');
function pushHint(msg) {
  var log = document.getElementById('hintLog');
  if (!log) return;
  var entry = document.createElement('div');
  entry.className = 'hint-entry';
  entry.innerHTML = msg;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 3) {
    log.removeChild(log.firstChild);
  }
  // entries persist
}
const servedDisplay = document.getElementById('servedDisplay');
const ratingDisplay = document.getElementById('ratingDisplay');

const orderName = document.getElementById('orderName');
const timerArc = document.getElementById('timerArc');
const timerText = document.getElementById('timerText');
const orderChecklist = document.getElementById('orderChecklist');
const TIMER_CIRCUM = 2 * Math.PI * 17;

function randDesign() { return DESIGNS[Math.floor(Math.random() * DESIGNS.length)]; }
function randOrder(rating) {
  var eligible = ORDER_TEMPLATES.filter(function (t) {
    if (t.minRating && rating < t.minRating) return false;
    for (var _i2 = 0; _i2 < INGREDIENTS.length; _i2++) {
      var ing = INGREDIENTS[_i2];
      if (t.ings[ing.id] && ing.minRating !== undefined && rating < ing.minRating) return false;
    }
    return true;
  });
  if (eligible.length === 0) return ORDER_TEMPLATES[0];
  return eligible[Math.floor(Math.random() * eligible.length)];
}

function getRating() {
  return maxStars === 0 ? 0 : totalStars / maxStars;
}

function generateOrder(rating) {
  const template = randOrder(rating);
  const efficiency = Math.min(1, rating);
  const timeMult = Math.max(0.3, 1.0 - efficiency * 0.7);
  const time = Math.max(5, Math.round(template.time * timeMult));
  const ings = {};
  for (const [id, count] of Object.entries(template.ings)) {
    ings[id] = count;
  }
  var bonusCap = 3 + (state.upgrades['counter'] ? 1 : 0);
  const bonus = Math.floor(efficiency * bonusCap);
  for (let i = 0; i < bonus; i++) {
    const keys = Object.keys(ings);
    const pick = keys[Math.floor(Math.random() * keys.length)];
    ings[pick] = (ings[pick] || 0) + 1;
  }
  var decorTime = 0;
  if (state.upgrades['plant']) decorTime += 2;
  if (state.upgrades['window']) decorTime += 3;
  if (state.upgrades['lighting']) decorTime += 2;
  if (state.upgrades['music']) decorTime += 4;
  if (state.upgrades['layout']) decorTime *= 2;
  return { name: template.name, ings: ings, time: time + decorTime };
}

function applyAutoFill(a) {
  if (!a || a.full) return;
  if (!state.upgrades['barista']) return;
  var missing = [];
  for (var _i = 0; _i < INGREDIENTS.length; _i++) {
    var ing = INGREDIENTS[_i];
    var need = a.order.ings[ing.id] || 0;
    if (need > 0 && (a.added[ing.id] || 0) < need) missing.push(ing.id);
  }
  if (missing.length === 0) return;
  var pick = missing[Math.floor(Math.random() * missing.length)];
  a.added[pick] = Math.min((a.added[pick] || 0) + 1, a.order.ings[pick] || 0);
  updateCupFill(a);
  updateOrderUI();
}

function getStarThresholds(rating) {
  return {
    five: Math.min(0.92, 0.78 + rating * 0.14),
    four: Math.min(0.78, 0.58 + rating * 0.20),
    three: Math.min(0.62, 0.38 + rating * 0.24),
    two: Math.min(0.40, 0.18 + rating * 0.22),
  };
}

function cupPos(index) {
  return { x: index === 0 ? CUP_CENTER_X : CUP_OFFSCREEN_X, y: CUP_CENTER_Y };
}

function makeCup(design) {
  const w = document.createElement('div');
  w.className = 'cup-wrap d-' + design.id;
  const badge = document.createElement('div');
  badge.className = 'cup-badge';
  badge.textContent = '\u2014';
  w.innerHTML =
    '<div class="cup-inner">' +
      '<div class="steam-group"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="cup-handle"></div>' +
      '<div class="cup-rim"></div>' +
      '<div class="cup-body"><div class="cup-fill"></div><div class="cup-shine"></div></div>' +
    '</div>';
  w.appendChild(badge);
  return w;
}

function spawn() {
  const d = randDesign();
  const order = generateOrder(getRating());
  const el = makeCup(d);
  const added = {};
  for (const ing of INGREDIENTS) added[ing.id] = 0;
  const total = order.time;
  return {
    el, design: d,
    order: order,
    added: added,
    full: false,
    ruined: false,
    timer: total,
    totalTime: total,
    fillEl: el.querySelector('.cup-fill'),
    steam: el.querySelector('.steam-group'),
  };
}

function updateBadges() {
  cups.forEach(function (c, i) {
    const badge = c.el.querySelector('.cup-badge');
    if (i === activeIdx) {
      badge.textContent = '\u25C0 ' + c.order.name + ' \u25B6';
    } else {
      badge.textContent = c.order.name;
    }
  });
}

function reposition(animate) {
  cups.forEach(function (c, i) {
    const pos = cupPos(i);
    const el = c.el;
    el.style.left = (pos.x - 28) + 'px';
    el.style.top = (pos.y - 32) + 'px';
    el.style.transition = animate ? 'all 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)' : 'none';
    el.className = 'cup-wrap d-' + c.design.id;
    el.classList.toggle('active', i === activeIdx);
    el.style.zIndex = 4 + i;
  });
  updateBadges();
}

function initCups() {
  row.innerHTML = '';
  cups = []; queue = [];
  for (let i = 0; i < VISIBLE + 6; i++) queue.push(spawn());
  for (let i = 0; i < VISIBLE; i++) {
    const c = queue.shift();
    row.appendChild(c.el);
    cups.push(c);
  }
  activeIdx = 0;
  reposition(false);
  updateOrderUI();
}

/* ============================
   ORDER UI
   ============================ */

function updateTimerArc(a) {
  if (!a || a.full) {
    timerArc.setAttribute('stroke', '#60b060');
    timerArc.setAttribute('stroke-dashoffset', '0');
    timerText.textContent = a && a.full ? '\u2713' : '\u2014';
    return;
  }
  const t = Math.ceil(a.timer);
  timerText.textContent = t + 's';
  const pct = a.totalTime > 0 ? a.timer / a.totalTime : 0;
  const offset = TIMER_CIRCUM * (1 - pct);
  timerArc.setAttribute('stroke-dashoffset', offset);
  let color = '#60b060';
  if (pct < 0.33) color = '#e85040';
  else if (pct < 0.66) color = '#e0a030';
  timerArc.setAttribute('stroke', color);
}

function updateOrderUI() {
  const a = cups[activeIdx];
  if (!a) {
    orderName.textContent = '\u2014';
    timerArc.setAttribute('stroke-dashoffset', '0');
    timerText.textContent = '\u2014';
    orderChecklist.innerHTML = '';
    return;
  }

  var totalIngs = 0;
  for (var _i in a.order.ings) totalIngs += a.order.ings[_i];
  var baseTime = 0;
  for (var _t = 0; _t < ORDER_TEMPLATES.length; _t++) {
    if (ORDER_TEMPLATES[_t].name === a.order.name) { baseTime = ORDER_TEMPLATES[_t].time; break; }
  }
  var baseCost = Math.floor(totalIngs * (baseTime / 8));
  orderName.textContent = a.order.name + ' ($' + baseCost + ')';
  updateTimerArc(a);

  // Checklist
  orderChecklist.innerHTML = '';
  for (const ing of INGREDIENTS) {
    const need = a.order.ings[ing.id] || 0;
    if (need === 0) continue;
    const have = a.added[ing.id] || 0;
    const done = have >= need;
    const item = document.createElement('div');
    item.className = 'order-item' + (done ? ' done' : '');
    item.innerHTML =
      '<span class="check">' + (done ? '\u2713' : '') + '</span>' +
      '<span class="ing-icon">' + ing.icon + '</span>' +
      '<span>' + have + '/' + need + '</span>';
    orderChecklist.appendChild(item);
  }
}

function updateRating() {
  const pct = maxStars === 0 ? 100 : Math.round(totalStars / maxStars * 100);
  let stars = '';
  const filled = Math.round(pct / 100 * 5);
  for (let i = 0; i < 5; i++) {
    stars += i < filled ? '\u2605' : '\u2606';
  }
  ratingDisplay.textContent = pct + '% ' + stars;
  ratingDisplay.title = totalStars + ' stars / ' + maxStars + ' max \u00d7 100 = ' + pct + '%';
  renderIngredientButtons();
}

/* ============================
   INGREDIENT ACTIONS
   ============================ */

function addIngredient(ingId) {
  initAudio();
  if (busy || paused) return;
  const a = cups[activeIdx];
  if (!a || a.full) return;
  if (a.timer <= 0) return;

  const need = a.order.ings[ingId] || 0;
  if (need === 0) {
    const rect = a.el.querySelector('.cup-inner').getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'pop';
      p.style.background = '#ff4444';
      p.style.left = (rect.left + Math.random() * rect.width) + 'px';
      p.style.top = (rect.top + Math.random() * rect.height) + 'px';
      p.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
      p.style.setProperty('--dy', (Math.random() * -30 - 10) + 'px');
      document.body.appendChild(p);
      setTimeout(function (pp) { pp.remove(); }, 500);
    }
    playError();
    pushHint('\u274C Wrong! Try again...');
    a.el.classList.add('ruined');
    setTimeout(function () {
      a.el.classList.remove('ruined');
      for (const ing of INGREDIENTS) a.added[ing.id] = 0;
      a.fillEl.style.height = '0%';
      a.steam.classList.remove('active');
      a.full = false;
      a.ruined = false;
      updateOrderUI();
      updateBadges();
      var orderName = a.order.name;
      pushHint('\u2615 New Order: ' + orderName + '!');
    }, 600);
    return;
  }
  if ((a.added[ingId] || 0) >= need) {
    playError();
    pushHint('\u2705 ' + ingId + ' already full!');
    return;
  }

  var power = 1;
  if (state.upgrades['milkfrother'] && (ingId === 'milk' || ingId === 'cream')) power += 1;
  if (state.upgrades['syrups'] && (ingId === 'syrup' || ingId === 'cinnamon' || ingId === 'vanilla' || ingId === 'honey')) power += 1;
  power = Math.min(power, need - (a.added[ingId] || 0));
  a.added[ingId] = (a.added[ingId] || 0) + power;
  playPop();

  // Steam on cup
  a.steam.classList.add('active');

  // Cup flash
  var cupInner = a.el.querySelector('.cup-inner');
  cupInner.classList.add('ing-flash');

  // Particles
  const rect = cupInner.getBoundingClientRect();
  const cx = rect.left + rect.width * 0.5;
  const cy = rect.top + rect.height * 0.4;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'pop';
    const ing = INGREDIENTS.find(function (x) { return x.id === ingId; });
    p.style.background = ing ? ing.color : '#fff';
    p.style.width = (4 + Math.random() * 6) + 'px';
    p.style.height = p.style.width;
    p.style.left = (cx + (Math.random() - 0.5) * 40) + 'px';
    p.style.top = (cy + (Math.random() - 0.5) * 20) + 'px';
    p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    p.style.setProperty('--dy', (Math.random() * -60 - 10) + 'px');
    document.body.appendChild(p);
    setTimeout(function (pp) { pp.remove(); }, 500);
  }

  // Update fill %
  updateCupFill(a);
  updateOrderUI();

  // Check if complete
  if (isOrderComplete(a)) {
    a.full = true;
    served++;
    servedDisplay.textContent = served;
    const ratio = a.totalTime > 0 ? a.timer / a.totalTime : 0;
    const thresholds = getStarThresholds(getRating());
    var invOffset = state.upgrades['inventory'] ? 0.06 : 0;
    var effectiveFive = thresholds.five - invOffset;
    var effectiveFour = thresholds.four - invOffset;
    var effectiveThree = thresholds.three - invOffset;
    var effectiveTwo = thresholds.two - invOffset;
    let stars = 0;
    if (ratio >= effectiveFive) stars = 5;
    else if (ratio >= effectiveFour) stars = 4;
    else if (ratio >= effectiveThree) stars = 3;
    else if (ratio >= effectiveTwo) stars = 2;
    else if (ratio > 0) stars = 1;
    totalStars += stars;
    maxStars += 5;
    missStreak = 0;

    var totalIngs = 0;
    for (var _ii in a.order.ings) totalIngs += a.order.ings[_ii];
    var baseTime = 0;
    for (var _t = 0; _t < ORDER_TEMPLATES.length; _t++) {
      if (ORDER_TEMPLATES[_t].name === a.order.name) { baseTime = ORDER_TEMPLATES[_t].time; break; }
    }
    var starMoney = [0, 0.5, 0.8, 1.1, 1.4, 1.8];
    var moneyEarned = Math.floor(totalIngs * (baseTime / 8) * starMoney[stars]);
    if (state.upgrades['wallart']) moneyEarned = Math.floor(moneyEarned * 1.15);
    if (state.upgrades['outdoor']) moneyEarned = Math.floor(moneyEarned * 1.20);
    if (state.upgrades['beans']) moneyEarned = Math.floor(moneyEarned * 1.5);
    if (state.upgrades['lighting']) moneyEarned = Math.floor(moneyEarned * (1 + 0.1 * stars));
    money += moneyEarned;
    document.getElementById('moneyDisplay').textContent = '$' + money;
    document.getElementById('shopMoneyDisplay').textContent = '$' + money;
    renderUpgrades();

    var baseCost = Math.floor(totalIngs * (baseTime / 8));
    var tip = moneyEarned - baseCost;
    updateRating();
    showFloatingStars(stars, '', a.el);
    showFloatingMoney(baseCost, a.el);
    if (tip > 0) showFloatingTip(tip, a.el);
    var hintTxt = '\u2705 ' + stars + '\u2605 +$' + baseCost;
    if (tip > 0) hintTxt += ' + <span style="color:#e67e22">tip $' +  tip + '</span>';
    pushHint(hintTxt);
    playComplete();

    // Full particles
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'pop';
      const colors = ['#d09050','#e0a060','#f0c860','#f5e0c0','#c07040'];
      p.style.width = (5 + Math.random() * 5) + 'px';
      p.style.height = p.style.width;
      p.style.background = colors[i % 5];
      p.style.left = (rect.left + Math.random() * rect.width) + 'px';
      p.style.top = (rect.top + Math.random() * rect.height * 0.5) + 'px';
      p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      p.style.setProperty('--dy', (Math.random() * -50 - 20) + 'px');
      document.body.appendChild(p);
      setTimeout(function (pp) { pp.remove(); }, 500);
    }

    if (state.upgrades['supervisor']) {
      advance();
    } else {
      setTimeout(advance, 450);
    }
  }
}

function showFloatingStars(stars, text, cupEl) {
  if (!cupEl) return;
  var rect = cupEl.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top;
  var wrap = document.createElement('div');
  wrap.className = 'float-arc';
  var el = document.createElement('div');
  el.className = 'float-star-inner';
  var s = '';
  for (var i = 0; i < stars; i++) s += '\u2605';
  el.textContent = s;
  var spread = (Math.random() - 0.5) * 0.8;
  var finalX = Math.sin(spread) * (80 + Math.random() * 40);
  var finalY = -(40 + Math.random() * 40);
  wrap.style.setProperty('--dx', finalX + 'px');
  el.style.setProperty('--dy', finalY + 'px');
  wrap.style.left = (cx - 30) + 'px';
  wrap.style.top = (cy - 12) + 'px';
  wrap.appendChild(el);
  document.body.appendChild(wrap);
  setTimeout(makeRemover(wrap), 1200);
}

function makeRemover(el) {
  return function () { el.remove(); };
}

function showFloatingMoney(amount, cupEl) {
  if (!cupEl) return;
  var rect = cupEl.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top;
  var wrap = document.createElement('div');
  wrap.className = 'float-arc';
  var el = document.createElement('div');
  el.className = 'float-money-inner';
  el.textContent = '+$' + amount;
  var finalX = 70 + Math.random() * 60;
  var finalY = -(30 + Math.random() * 40);
  wrap.style.setProperty('--dx', finalX + 'px');
  el.style.setProperty('--dy', finalY + 'px');
  wrap.style.left = (cx - 20) + 'px';
  wrap.style.top = (cy - 10) + 'px';
  wrap.appendChild(el);
  document.body.appendChild(wrap);
  setTimeout(makeRemover(wrap), 1200);
}

function showFloatingTip(amount, cupEl) {
  if (!cupEl) return;
  var rect = cupEl.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top;
  var wrap = document.createElement('div');
  wrap.className = 'float-arc';
  var el = document.createElement('div');
  el.className = 'float-tip-inner';
  el.textContent = 'Tip $' + amount + '!';
  var finalX = -(70 + Math.random() * 60);
  var finalY = -(30 + Math.random() * 40);
  wrap.style.setProperty('--dx', finalX + 'px');
  el.style.setProperty('--dy', finalY + 'px');
  wrap.style.left = (cx - 40) + 'px';
  wrap.style.top = (cy - 20) + 'px';
  wrap.appendChild(el);
  document.body.appendChild(wrap);
  setTimeout(makeRemover(wrap), 1200);
}

function updateCupFill(a) {
  // Calculate total ingredients needed
  let totalNeed = 0;
  let totalHave = 0;
  for (const ing of INGREDIENTS) {
    const need = a.order.ings[ing.id] || 0;
    if (need > 0) {
      totalNeed += need;
      totalHave += Math.min(a.added[ing.id] || 0, need);
    }
  }
  const pct = totalNeed > 0 ? (totalHave / totalNeed) * 100 : 0;
  a.fillEl.style.height = pct + '%';
}

function isOrderComplete(a) {
  for (const ing of INGREDIENTS) {
    const need = a.order.ings[ing.id] || 0;
    if (need > 0 && (a.added[ing.id] || 0) < need) return false;
  }
  return true;
}

/* ============================
   TIMER
   ============================ */

function updateTimer(dt) {
  const a = cups[activeIdx];
  if (!a || a.full) return;
  if (a.timer <= 0) return;

  var slowdown = state.upgrades['brewer'] ? 0.75 : 1;
  a.timer -= dt * Math.max(0.1, slowdown);
  updateOrderUI();

  if (a.timer <= 0) {
    a.timer = 0;
    a.full = true;
    missed++;
    missStreak++;
    document.getElementById('missedDisplay').textContent = missed;
    totalStars += 0;
    var missPenalty = 5 + Math.max(0, Math.floor(missStreak * 2) - (state.upgrades['cashier'] ? 2 : 0));
    maxStars += missPenalty;
    updateRating();
    updateOrderUI();
    showFloatingStars(0, '', a.el);
    pushHint('\u23F0 Time\'s up! (-' + missPenalty + '\u2605) Streak: ' + missStreak);
    playError();

    const rect = a.el.querySelector('.cup-inner').getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'pop';
      p.style.background = '#ff4444';
      p.style.left = (rect.left + Math.random() * rect.width) + 'px';
      p.style.top = (rect.top + Math.random() * rect.height) + 'px';
      p.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      p.style.setProperty('--dy', (Math.random() * -20 - 10) + 'px');
      document.body.appendChild(p);
      setTimeout(function (pp) { pp.remove(); }, 500);
    }

    setTimeout(advance, 600);
  }
}

/* ============================
   ADVANCE
   ============================ */

function advance() {
  if (busy) return;
  const a = cups[activeIdx];
  if (!a || !a.full) return;
  busy = true;

  a.el.querySelector('.cup-inner').style.animation = 'none';
  void a.el.offsetWidth;
  a.el.classList.add('exiting');

  setTimeout(function () {
    const removed = cups.shift();
    removed.el.remove();

    let next = queue.shift();
    if (!next) next = spawn();
    cups.push(next);
    row.appendChild(next.el);

    const newEl = next.el;
    newEl.style.transition = 'none';
    newEl.querySelector('.cup-inner').style.animation = 'none';
    void newEl.offsetWidth;
    reposition(true);
    newEl.classList.add('entering');

    setTimeout(function () {
      newEl.classList.remove('entering');
      busy = false;
      updateOrderUI();
      applyAutoFill(cups[activeIdx]);
      pushHint('\u2615 New Order: ' + cups[activeIdx].order.name + '!');
    }, 500);
  }, 400);
}

/* ============================
   STATE & UPGRADES
   ============================ */

const state = {
  upgrades: {},
};

const UPGRADE_CATEGORIES = [
  {
    name: '\uD83C\uDFF0 Decor',
    upgrades: [
      { id: 'plant', name: 'Potted Plant', desc: '+2s per order', icon: '\uD83C\uDF3F', cost: 30 },
      { id: 'wallart', name: 'Wall Art', desc: '+15% money per order', icon: '\uD83D\uDDBC\uFE0F', cost: 80 },
      { id: 'counter', name: 'New Counter', desc: '+1 bonus ingredient capacity', icon: '\uD83E\uDE9A', cost: 180 },
      { id: 'window', name: 'Window Display', desc: '+3s per order', icon: '\uD83C\uDFE1', cost: 400 },
      { id: 'lighting', name: 'Ambient Lighting', desc: '+2s, star money bonus', icon: '\uD83D\uDCA1', cost: 800 },
      { id: 'outdoor', name: 'Outdoor Seating', desc: '+20% money per order', icon: '\uD83C\uDFD5\uFE0F', cost: 1600 },
      { id: 'music', name: 'Music System', desc: '+4s per order', icon: '\uD83C\uDFB5', cost: 3200 },
      { id: 'layout', name: 'Premium Layout', desc: '2\u00d7 all decor time bonuses', icon: '\u2728', cost: 6500 },
    ]
  },
  {
    name: '\uD83D\uDC77 Employees',
    upgrades: [
      { id: 'barista', name: 'Part-time Barista', desc: 'Auto-fill 1 ingredient per order', icon: '\uD83D\uDC68\u200D\uD83C\uDF73', cost: 12000 },
      { id: 'cashier', name: 'Cashier', desc: 'Reduce miss streak penalty by 2', icon: '\uD83D\uDCCB', cost: 24000 },
      { id: 'inventory', name: 'Inventory Manager', desc: 'Loosen star thresholds', icon: '\uD83D\uDCCA', cost: 48000 },
      { id: 'supervisor', name: 'Shift Supervisor', desc: 'Auto-advance on order complete', icon: '\uD83C\uDFC6', cost: 96000 },
    ]
  },
  {
    name: '\u2699\uFE0F Equipment',
    upgrades: [
      { id: 'beans', name: 'Premium Beans', desc: '1.5\u00d7 money per order', icon: '\uD83C\uDF4E', cost: 180000 },
      { id: 'milkfrother', name: 'Milk Frother', desc: '+1 tap for milk & cream', icon: '\uD83E\uDD5B', cost: 350000 },
      { id: 'syrups', name: 'Syrup Dispenser', desc: '+1 tap for syrup/spices', icon: '\uD83C\uDF41', cost: 700000 },
      { id: 'brewer', name: 'Master Brewer', desc: 'Timer 25% slower', icon: '\uD83C\uDFAF', cost: 1400000 },
    ]
  }
];

/* ============================
   DOM REFS
   ============================ */

const upgradesEl = document.getElementById('upgrades');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const soundBtn = document.getElementById('soundBtn');
const resetBtn = document.getElementById('resetBtn');

/* ============================
   PARTICLES
   ============================ */

const particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= p.decay * dt;
    p.alpha = p.life * 0.8;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function renderParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

/* ============================
   GAME LOGIC
   ============================ */

/* ============================
   UI
   ============================ */

var prevIngs = [];

function regenerateLockedOrders(locked) {
  if (locked.length === 0) return;
  var rating = getRating();
  var allCups = cups.concat(queue);
  for (var c = 0; c < allCups.length; c++) {
    var cup = allCups[c];
    if (!cup) continue;
    var hasLocked = false;
    for (var ingId in cup.order.ings) {
      if (locked.indexOf(ingId) !== -1) { hasLocked = true; break; }
    }
    if (!hasLocked) continue;
    var newOrder = generateOrder(rating);
    cup.order = newOrder;
    for (var _i = 0; _i < INGREDIENTS.length; _i++) {
      cup.added[INGREDIENTS[_i].id] = 0;
    }
    if (cup.fillEl) cup.fillEl.style.height = '0%';
    if (cup.steam) cup.steam.classList.remove('active');
    if (cups.indexOf(cup) === activeIdx) {
      cup.timer = Math.max(5, cup.timer);
      cup.full = false;
    }
  }
  updateOrderUI();
  updateBadges();
}

function renderIngredientButtons() {
  var bar = document.getElementById('ingredientBar');
  if (!bar) return;
  var rating = getRating();
  var curIngs = [];
  for (var i = 0; i < INGREDIENTS.length; i++) {
    var ing = INGREDIENTS[i];
    if (ing.minRating !== undefined && rating < ing.minRating) continue;
    curIngs.push(ing.id);
  }

  var unlocked = curIngs.filter(function (id) { return prevIngs.indexOf(id) === -1; });
  var locked = prevIngs.filter(function (id) { return curIngs.indexOf(id) === -1; });

  bar.innerHTML = '';
  for (var j = 0; j < curIngs.length; j++) {
    var ingData = null;
    for (var m = 0; m < INGREDIENTS.length; m++) {
      if (INGREDIENTS[m].id === curIngs[j]) { ingData = INGREDIENTS[m]; break; }
    }
    if (!ingData) continue;
    var btn = document.createElement('button');
    btn.className = 'ing-btn';
    if (unlocked.indexOf(ingData.id) !== -1) {
      btn.classList.add('ing-btn-enter');
    }
    btn.dataset.ing = ingData.id;
    btn.textContent = ingData.icon + ' ' + ingData.name;
    bar.appendChild(btn);
  }

  if (locked.length > 0) {
    var gp = document.getElementById('gamePanel');
    if (gp) {
      gp.classList.remove('lock-pulse');
      void gp.offsetWidth;
      gp.classList.add('lock-pulse');
    }
    regenerateLockedOrders(locked);
  }

  prevIngs = curIngs;
}

function updateUI() {
  renderIngredientButtons();
}

function renderUpgrades() {
  upgradesEl.innerHTML = '';
  for (var c = 0; c < UPGRADE_CATEGORIES.length; c++) {
    var cat = UPGRADE_CATEGORIES[c];
    var heading = document.createElement('div');
    heading.className = 'upgrade-category-heading';
    heading.textContent = cat.name;
    upgradesEl.appendChild(heading);

    for (var i = 0; i < cat.upgrades.length; i++) {
      var upg = cat.upgrades[i];
      var owned = !!state.upgrades[upg.id];
      var canAfford = money >= upg.cost;
      var card = document.createElement('div');
      card.className = 'upgrade-card';
      if (owned) {
        card.classList.add('owned');
      } else if (canAfford) {
        card.classList.add('affordable');
        card.addEventListener('click', function (id, cost) { return function () { buyUpgrade(id, cost); }; }(upg.id, upg.cost));
      } else {
        card.classList.add('locked');
      }
      var costStr = owned ? '\u2713' : '$' + Math.floor(upg.cost);
      card.innerHTML =
        '<span class="upgrade-icon">' + upg.icon + '</span>' +
        '<div class="upgrade-info">' +
          '<div class="upgrade-name">' + upg.name + '</div>' +
          '<div class="upgrade-desc">' + upg.desc + '</div>' +
        '</div>' +
        '<div class="upgrade-cost">' + costStr + '</div>';
      upgradesEl.appendChild(card);
    }
  }
}

function buyUpgrade(id, cost) {
  initAudio();
  if (money < cost || state.upgrades[id]) {
    playError();
    return;
  }
  money -= cost;
  state.upgrades[id] = true;
  document.getElementById('moneyDisplay').textContent = '$' + money;
  document.getElementById('shopMoneyDisplay').textContent = '$' + money;
  playDing();
  var shop = document.getElementById('shop');
  shop.classList.add('flash');
  setTimeout(function () { shop.classList.remove('flash'); }, 400);
  renderUpgrades();
  updateUI();
}

/* ============================
   PERSISTENCE
   ============================ */

function saveGame() {
  const data = {
    served: served,
    missed: missed,
    money: money,
    totalStars: totalStars,
    maxStars: maxStars,
    upgrades: state.upgrades,
  };
  localStorage.setItem('coffeeConveyor', JSON.stringify(data));
}

function loadGame() {
  const saved = localStorage.getItem('coffeeConveyor');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      served = data.served || 0;
      missed = data.missed || 0;
      money = data.money || 0;
      totalStars = data.totalStars !== undefined ? data.totalStars : 1;
      maxStars = data.maxStars !== undefined ? data.maxStars : 10;
      state.upgrades = data.upgrades || {};
    } catch (e) {}
  }
  const soundSetting = localStorage.getItem('coffeeSound');
  if (soundSetting === 'off') {
    soundOn = false;
    soundBtn.textContent = '\uD83D\uDD07';
    soundBtn.classList.add('muted');
  }
}

function resetGame() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    localStorage.removeItem('coffeeConveyor');
    served = 0;
    missed = 0;
    missStreak = 0;
    money = 0;
    totalStars = 1;
    maxStars = 10;
    state.upgrades = {};
    initCups();
    renderUpgrades();
    updateUI();
    servedDisplay.textContent = '0';
    document.getElementById('missedDisplay').textContent = '0';
    document.getElementById('moneyDisplay').textContent = '$0';
    document.getElementById('shopMoneyDisplay').textContent = '$0';
    updateRating();
    orderName.textContent = '\u2014';
    timerText.textContent = '\u2014';
    timerArc.setAttribute('stroke-dashoffset', '0');
    pushHint('\u2615 Complete the order!');
  }
}

function togglePause() {
  paused = !paused;
  const btn = document.getElementById('pauseBtn');
  btn.textContent = paused ? '\u25B6' : '\u23F8';
  document.getElementById('app').classList.toggle('paused', paused);
}

/* ============================
   ANIMATION LOOP
   ============================ */

let lastTime = 0;

function animate(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  if (!paused) {
    updateTimer(dt);
  }
  updateParticles(dt);
  renderParticles();
  requestAnimationFrame(animate);
}

/* ============================
   INIT
   ============================ */

function init() {
  loadGame();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  initCups();
  renderUpgrades();
  updateUI();
  servedDisplay.textContent = served;
  document.getElementById('missedDisplay').textContent = missed;
  document.getElementById('moneyDisplay').textContent = '$' + money;
  document.getElementById('shopMoneyDisplay').textContent = '$' + money;
  updateRating();
  pushHint('\u2615 Coffee Conveyor \u2014 Complete orders to earn stars!');
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  soundBtn.addEventListener('click', toggleSound);
  resetBtn.addEventListener('click', resetGame);
  setInterval(saveGame, 5000);
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', init);

/* ============================
   INGREDIENT BUTTONS
   ============================ */

document.getElementById('ingredientBar').addEventListener('click', function (e) {
  var btn = e.target.closest('.ing-btn');
  if (btn) addIngredient(btn.dataset.ing);
});


