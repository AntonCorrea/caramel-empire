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
  { id: 'milk', name: 'Milk', icon: '\uD83E\uDD5B', color: '#f0ece4', minRating: 0.15 },
  { id: 'cream', name: 'Cream', icon: '\uD83C\uDF66', color: '#fdf2e3', minRating: 0.25 },
  { id: 'choco', name: 'Choco', icon: '\uD83C\uDF6B', color: '#4a2810', minRating: 0.40 },
  { id: 'syrup', name: 'Syrup', icon: '\uD83C\uDF41', color: '#c87840', minRating: 0.55 },
  { id: 'cinnamon', name: 'Cinnamon', icon: '\uD83C\uDF3F', color: '#a06030', minRating: 0.70 },
  { id: 'vanilla', name: 'Vanilla', icon: '\uD83C\uDF3C', color: '#f0e0c0', minRating: 0.85 },
  { id: 'honey', name: 'Honey', icon: '\uD83C\uDF6F', color: '#e0a020', minRating: 0.95 },
];

const ORDER_TEMPLATES = [
  { name: 'Black Coffee',     ings: { coffee: 1 },                  time: 20 },
  { name: 'Espresso',         ings: { coffee: 2, sugar: 1 },        time: 18 },
  { name: 'Latte',            ings: { coffee: 1, milk: 1 },         time: 20 },
  { name: 'Cappuccino',       ings: { coffee: 1, milk: 1, cream: 1 },  time: 22 },
  { name: 'Mocha',            ings: { coffee: 1, milk: 1, choco: 1 },  time: 22 },
  { name: 'Macchiato',        ings: { coffee: 2, milk: 1 },         time: 18 },
  { name: 'Affogato',         ings: { coffee: 1, cream: 1, choco: 1 },  time: 20 },
  { name: 'Irish Coffee',     ings: { coffee: 1, sugar: 1, cream: 1 },  time: 20 },
  { name: 'Cold Brew',        ings: { coffee: 1, milk: 1, sugar: 1 },   time: 18 },
  { name: 'Americano',        ings: { coffee: 2 },                  time: 16 },
  { name: 'Flat White',       ings: { coffee: 1, milk: 2 },         time: 18 },
  { name: 'Con Panna',        ings: { coffee: 1, cream: 2 },        time: 16 },
  { name: 'Ristretto',        ings: { coffee: 1 },                  time: 14 },
  { name: 'Cortado',          ings: { coffee: 1, milk: 1 },         time: 16 },
  { name: 'Red Eye',          ings: { coffee: 2 },                  time: 14 },
  { name: 'Vienna',           ings: { coffee: 1, cream: 2 },        time: 18 },
  { name: 'Frapp\u00e9',     ings: { coffee: 1, milk: 1, cream: 1 },  time: 20 },
  { name: 'Latte Macchiato',  ings: { coffee: 1, milk: 2 },         time: 18 },
  { name: 'Caf\u00e9 au Lait', ings: { coffee: 1, milk: 1, sugar: 1 },  time: 18 },
  { name: 'Caf\u00e9 Bomb\u00f3n', ings: { coffee: 1, milk: 1, choco: 1, sugar: 1 }, time: 22 },
  { name: 'Egg Coffee',       ings: { coffee: 1, milk: 1, sugar: 1, cream: 1 }, time: 22 },
  { name: 'Galao',            ings: { coffee: 1, milk: 2, sugar: 1 },    time: 18 },
  { name: 'Maple Latte',      ings: { coffee: 1, milk: 1, syrup: 1 },       time: 20, minRating: 0.25 },
  { name: 'Syrup Americano',  ings: { coffee: 2, syrup: 1 },                time: 16, minRating: 0.25 },
  { name: 'Cinnamon Cappuccino', ings: { coffee: 1, milk: 1, cinnamon: 1, cream: 1 }, time: 22, minRating: 0.50 },
  { name: 'Cinnamon Mocha',   ings: { coffee: 1, choco: 1, cinnamon: 1, milk: 1 }, time: 22, minRating: 0.50 },
  { name: 'Vanilla Dream',    ings: { coffee: 1, milk: 1, vanilla: 1, sugar: 1 },  time: 20, minRating: 0.75 },
  { name: 'Vanilla Macchiato', ings: { coffee: 2, milk: 1, vanilla: 1 },             time: 20, minRating: 0.75 },
  { name: 'Honey Bliss',      ings: { coffee: 1, milk: 1, honey: 1, cream: 1 },     time: 22, minRating: 0.90 },
  { name: 'Spiced Honey',     ings: { coffee: 1, cinnamon: 1, honey: 1 },            time: 18, minRating: 0.90 },
];

/* ============================
   CONVEYOR SETUP
   ============================ */

const VISIBLE = 5;
const DESIGNS = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }];

const DIAG_X = 74;
const DIAG_Y = 41;
const BASE_X = 265;
const BASE_Y = 155;
const SCALE_NORMAL = 0.75;
const SCALE_ACTIVE = 1.0;

let cups = [];
let clickPower = 1;
let served = 0;
let missed = 0;
let missStreak = 0;
let totalStars = 1;
let maxStars = 10;
let activeIdx = 2;
let queue = [];
let busy = false;
let paused = false;

const row = document.getElementById('cupsRow');
function pushHint(msg) {
  var log = document.getElementById('hintLog');
  if (!log) return;
  var entry = document.createElement('div');
  entry.className = 'hint-entry';
  entry.textContent = msg;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 8) {
    log.removeChild(log.firstChild);
  }
  // entries persist
}
const servedDisplay = document.getElementById('servedDisplay');
const ratingDisplay = document.getElementById('ratingDisplay');
const clickDisplay = document.getElementById('clickDisplay');
const beltStripes = document.getElementById('beltStripes');
const beltSurface = document.getElementById('beltSurface');
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
  const timeMult = Math.max(0.4, 1.0 - efficiency * 0.5);
  const time = Math.max(5, Math.round(template.time * timeMult));
  const ings = {};
  for (const [id, count] of Object.entries(template.ings)) {
    ings[id] = count;
  }
  const bonus = Math.floor(efficiency * 3);
  for (let i = 0; i < bonus; i++) {
    const keys = Object.keys(ings);
    const pick = keys[Math.floor(Math.random() * keys.length)];
    ings[pick] = (ings[pick] || 0) + 1;
  }
  return { name: template.name, ings: ings, time: time };
}

function applyEspressoShot(a) {
  if (!a || a.full) return;
  var level = state.upgrades['shot'] || 0;
  if (level === 0) return;
  var count = level;
  for (var s = 0; s < count; s++) {
    var missing = [];
    for (var _i = 0; _i < INGREDIENTS.length; _i++) {
      var ing = INGREDIENTS[_i];
      var need = a.order.ings[ing.id] || 0;
      if (need > 0 && (a.added[ing.id] || 0) < need) missing.push(ing.id);
    }
    if (missing.length === 0) break;
    var pick = missing[Math.floor(Math.random() * missing.length)];
    a.added[pick] = Math.min((a.added[pick] || 0) + 1, a.order.ings[pick] || 0);
  }
  if (level > 0) {
    updateCupFill(a);
    updateOrderUI();
  }
}

function getStarThresholds(rating) {
  return {
    five: Math.min(0.92, 0.78 + rating * 0.14),
    four: Math.min(0.78, 0.58 + rating * 0.20),
    three: Math.min(0.62, 0.38 + rating * 0.24),
    two: Math.min(0.40, 0.18 + rating * 0.22),
  };
}

function activateTimeWarp() {
  var a = cups[activeIdx];
  if (!a || a.full || a.timeWarpUsed || a.timeWarpActive) return;
  a.timeWarpUsed = true;
  a.timeWarpActive = true;
  a.timeWarpCountdown = 5;
  pushHint('\u23F3 Time Warp activated! 5s freeze.');
  var btn = document.getElementById('timeWarpBtn');
  if (btn) btn.disabled = true;
  setTimeout(function () {
    if (a) a.timeWarpActive = false;
    if (btn) btn.style.display = 'none';
  }, 5000);
}

function cupPos(index) {
  const offset = index - 2;
  return { x: BASE_X + offset * DIAG_X, y: BASE_Y - offset * DIAG_Y };
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
  const bonus = computeTimeBonus();
  const total = order.time + bonus;
  return {
    el, design: d,
    order: order,
    added: added,
    full: false,
    ruined: false,
    safetyUsed: false,
    timeWarpUsed: false,
    timeWarpActive: false,
    timeWarpCountdown: 0,
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
    const scale = i === activeIdx ? SCALE_ACTIVE : SCALE_NORMAL;
    el.style.left = (pos.x - 22) + 'px';
    el.style.top = (pos.y - 25) + 'px';
    el.style.transform = 'scale(' + scale + ')';
    el.style.transformOrigin = 'center bottom';
    el.style.transition = animate ? 'all 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)' : 'none';
    el.className = 'cup-wrap d-' + c.design.id;
    el.classList.toggle('active', i === activeIdx);
    el.classList.toggle('next', i === activeIdx + 1 || i === activeIdx + 2);
    el.style.zIndex = 4 + i;
    el.querySelector('.cup-inner').classList.toggle('no-pulse', i !== activeIdx);
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
  activeIdx = 2;
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

  orderName.textContent = a.order.name;
  updateTimerArc(a);

  // Time Warp button
  var warpBtn = document.getElementById('timeWarpBtn');
  var warpLevel = state.upgrades['warp'] || 0;
  if (warpLevel > 0 && !a.timeWarpUsed && !a.full && a.timer > 0) {
    warpBtn.style.display = '';
    warpBtn.disabled = false;
  } else {
    warpBtn.style.display = 'none';
  }

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
    var netLevel = state.upgrades['net'] || 0;
    if (netLevel > 0 && !a.safetyUsed) {
      a.safetyUsed = true;
      playError();
      pushHint('\uD83D\uDEE1\uFE0F Safety net used! Wrong ingredient blocked.');
      return;
    }
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
      a.safetyUsed = false;
      a.timeWarpUsed = false;
      a.timeWarpActive = false;
      a.timeWarpCountdown = 0;
      updateOrderUI();
      updateBadges();
      pushHint('\u2615 Complete the order!');
    }, 600);
    return;
  }
  if ((a.added[ingId] || 0) >= need) {
    playError();
    pushHint('\u2705 ' + ingId + ' already full!');
    return;
  }

  const power = Math.min(computeClickPower() || 1, need - (a.added[ingId] || 0));
  a.added[ingId] = (a.added[ingId] || 0) + power;
  playPop();

  // Steam on cup
  a.steam.classList.add('active');

  // Particles
  const rect = a.el.querySelector('.cup-inner').getBoundingClientRect();
  const cx = rect.left + rect.width * 0.5;
  const cy = rect.top + rect.height * 0.4;
  for (let i = 0; i < 3; i++) {
    const p = document.createElement('div');
    p.className = 'pop';
    const ing = INGREDIENTS.find(function (x) { return x.id === ingId; });
    p.style.background = ing ? ing.color : '#fff';
    p.style.left = (cx + (Math.random() - 0.5) * 20) + 'px';
    p.style.top = (cy + (Math.random() - 0.5) * 10) + 'px';
    p.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
    p.style.setProperty('--dy', (Math.random() * -40 - 10) + 'px');
    document.body.appendChild(p);
    setTimeout(function (pp) { pp.remove(); }, 500);
  }

  // Burst text
  const ingName = INGREDIENTS.find(function (x) { return x.id === ingId; }).name;
  const b = document.createElement('div');
  b.className = 'burst';
  b.textContent = '+' + ingName;
  b.style.left = (cx - 20) + 'px';
  b.style.top = (cy - 10) + 'px';
  document.body.appendChild(b);
  setTimeout(function () { b.remove(); }, 600);

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
    var goldenLevel = state.upgrades['golden'] || 0;
    var effectiveFive = thresholds.five - goldenLevel * 0.06;
    var effectiveFour = thresholds.four - goldenLevel * 0.05;
    var effectiveThree = thresholds.three - goldenLevel * 0.04;
    var effectiveTwo = thresholds.two - goldenLevel * 0.03;
    let stars = 0;
    if (ratio >= effectiveFive) stars = 5;
    else if (ratio >= effectiveFour) stars = 4;
    else if (ratio >= effectiveThree) stars = 3;
    else if (ratio >= effectiveTwo) stars = 2;
    else if (ratio > 0) stars = 1;
    var doubleLevel = state.upgrades['double'] || 0;
    var multiplier = 1 + doubleLevel;
    totalStars += stars * multiplier;
    maxStars += 5 * multiplier;
    missStreak = 0;
    updateRating();
    showFloatingStars(stars, '', a.el);
    pushHint('\u2705 ' + stars + '\u2605 Order complete!');
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

    setTimeout(advance, 450);
  }
}

function showFloatingStars(stars, text, cupEl) {
  if (!cupEl) return;
  var rect = cupEl.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var el = document.createElement('div');
  el.className = 'float-stars';
  var starStr = '';
  for (var i = 0; i < 5; i++) {
    starStr += i < stars ? '\u2605' : '\u2606';
  }
  var label = '';
  if (stars === 5) label = 'Incredible!';
  else if (stars === 4) label = 'Amazing!';
  else if (stars === 3) label = 'Perfect!';
  else if (stars === 2) label = 'Great!';
  else if (stars === 1) label = 'Good!';
  else label = 'Miss!';
  el.innerHTML = '<div class="float-stars-text">' + label + '</div><div class="float-stars-stars">' + starStr + '</div>';
  el.style.left = (cx - 50) + 'px';
  el.style.top = (cy - 20) + 'px';
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 1400);
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

  if (a.timeWarpActive) {
    a.timeWarpCountdown -= dt;
    if (a.timeWarpCountdown <= 0) {
      a.timeWarpActive = false;
      a.timeWarpCountdown = 0;
    }
    return;
  }
  var masterLevel = state.upgrades['master'] || 0;
  var slowdown = 1 - masterLevel * 0.25;
  a.timer -= dt * Math.max(0.1, slowdown);
  updateOrderUI();

  if (a.timer <= 0) {
    a.timer = 0;
    a.full = true;
    missed++;
    missStreak++;
    document.getElementById('missedDisplay').textContent = missed;
    totalStars += 0;
    var missPenalty = 5 + Math.floor(missStreak * 2);
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

  beltStripes.classList.remove('scroll');
  void beltStripes.offsetWidth;
  beltStripes.classList.add('scroll');

  beltSurface.classList.remove('pulse');
  void beltSurface.offsetWidth;
  beltSurface.classList.add('pulse');

  const rect = a.el.querySelector('.cup-inner').getBoundingClientRect();
  for (let i = 0; i < 4; i++) {
    const p = document.createElement('div');
    p.className = 'pop';
    p.style.background = ['#d09050','#e0a060','#f0c860'][i % 3];
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.4;
    p.style.left = (cx - 4) + 'px';
    p.style.top = (cy - 4) + 'px';
    p.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
    p.style.setProperty('--dy', (Math.random() * -50 - 10) + 'px');
    document.body.appendChild(p);
    setTimeout(function (pp) { pp.remove(); }, 500);
  }

  setTimeout(function () {
    a.el.style.transition = 'none';
    a.el.style.transform = 'scale(' + SCALE_NORMAL + ')';
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

      beltStripes.classList.remove('scroll-fast');
      void beltStripes.offsetWidth;
      beltStripes.classList.add('scroll-fast');

      setTimeout(function () {
        newEl.classList.remove('entering');
        busy = false;
        updateOrderUI();
        applyEspressoShot(cups[activeIdx]);
        pushHint('\u2615 Complete the order!');
      }, 450);
    }, 350);
  }, 300);
}

/* ============================
   STATE & UPGRADES
   ============================ */

const state = {
  upgrades: {},
};

const UPGRADES = [
  { id: 'grinder', name: 'Sharp Grinder', desc: 'More per tap', icon: '\u26A1', baseCost: 10, clickBonus: 1 },
  { id: 'quick', name: 'Quick Hands', desc: '+3s per order', icon: '\u23F1\uFE0F', baseCost: 30, timeBonus: 3 },
  { id: 'shot', name: 'Espresso Shot', desc: 'Auto-fill 1 ingredient', icon: '\uD83D\uDCA8', baseCost: 80 },
  { id: 'golden', name: 'Golden Timer', desc: 'Easier high-star rating', icon: '\uD83C\uDF1F', baseCost: 150 },
  { id: 'net', name: 'Safety Net', desc: '1 free mistake per order', icon: '\uD83D\uDEE1\uFE0F', baseCost: 300 },
  { id: 'warp', name: 'Time Warp', desc: 'Freeze timer 5s once/order', icon: '\u23F3', baseCost: 500 },
  { id: 'double', name: 'Double Stars', desc: '\u00d72 stars earned', icon: '\u2B50', baseCost: 800 },
  { id: 'master', name: 'Master Blend', desc: 'Timer 25% slower', icon: '\uD83C\uDFAF', baseCost: 1500 },
];

const CONFIG = {
  costMultiplier: 1.15,
};

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

function computeCost(upgrade) {
  const level = state.upgrades[upgrade.id] || 0;
  return Math.floor(upgrade.baseCost * Math.pow(CONFIG.costMultiplier, level));
}

function computeClickPower() {
  let power = 0;
  for (const u of UPGRADES) {
    const level = state.upgrades[u.id] || 0;
    power += (u.clickBonus || 0) * level;
  }
  return power || 1;
}

function computeTimeBonus() {
  let bonus = 0;
  for (const u of UPGRADES) {
    const level = state.upgrades[u.id] || 0;
    bonus += (u.timeBonus || 0) * level;
  }
  return bonus;
}

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
      cup.safetyUsed = false;
      cup.timeWarpUsed = false;
      cup.timeWarpActive = false;
      cup.timeWarpCountdown = 0;
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
    bar.classList.remove('lock-pulse');
    void bar.offsetWidth;
    bar.classList.add('lock-pulse');
    regenerateLockedOrders(locked);
  }

  prevIngs = curIngs;
}

function updateUI() {
  clickDisplay.textContent = computeClickPower();
  renderIngredientButtons();
}

function renderUpgrades() {
  upgradesEl.innerHTML = '';
  for (const upgrade of UPGRADES) {
    const level = state.upgrades[upgrade.id] || 0;
    const cost = computeCost(upgrade);
    const canAfford = served >= cost;
    const card = document.createElement('div');
    card.className = 'upgrade-card' + (canAfford ? ' affordable' : '') + (level === 0 && !canAfford ? ' locked' : '');
    card.dataset.id = upgrade.id;
    var bonus = '';
    if (upgrade.clickBonus) bonus = '+' + upgrade.clickBonus + ' per tap';
    else if (upgrade.timeBonus) bonus = '+' + upgrade.timeBonus + 's';
    var showBonus = bonus ? ' (' + bonus + ')' : '';
    card.innerHTML =
      '<span class="upgrade-icon">' + upgrade.icon + '</span>' +
      '<div class="upgrade-info">' +
        '<div class="upgrade-name">' + upgrade.name + '</div>' +
        '<div class="upgrade-desc">' + upgrade.desc + showBonus + '</div>' +
      '</div>' +
      '<div class="upgrade-right">' +
        '<div class="upgrade-level">Lv ' + level + '</div>' +
        '<div class="upgrade-cost">' + Math.floor(cost) + '\u2615</div>' +
      '</div>';
    card.addEventListener('click', function () { buyUpgrade(upgrade.id); });
    upgradesEl.appendChild(card);
  }
}

function buyUpgrade(id) {
  initAudio();
  const upgrade = UPGRADES.find(function (u) { return u.id === id; });
  if (!upgrade) return;
  const cost = computeCost(upgrade);
  if (served < cost) {
    playError();
    const card = document.querySelector('.upgrade-card[data-id="' + id + '"]');
    if (card) {
      card.classList.add('shake');
      setTimeout(function () { if (card) card.classList.remove('shake'); }, 300);
    }
    return;
  }
  served -= cost;
  state.upgrades[id] = (state.upgrades[id] || 0) + 1;
  servedDisplay.textContent = served;
  playDing();
  const shop = document.getElementById('shop');
  shop.classList.add('flash');
  setTimeout(function () { shop.classList.remove('flash'); }, 400);
  renderUpgrades();
  updateUI();
  const card = document.querySelector('.upgrade-card[data-id="' + id + '"]');
  if (card) {
    card.classList.add('bought');
    setTimeout(function () { if (card) card.classList.remove('bought'); }, 300);
  }
}

/* ============================
   PERSISTENCE
   ============================ */

function saveGame() {
  const data = {
    served: served,
    missed: missed,
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
    totalStars = 1;
    maxStars = 10;
    state.upgrades = {};
    initCups();
    renderUpgrades();
    updateUI();
    servedDisplay.textContent = '0';
    document.getElementById('missedDisplay').textContent = '0';
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

document.getElementById('timeWarpBtn').addEventListener('click', activateTimeWarp);
