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
  { id: 'choco', name: 'Choco', icon: '\uD83C\uDF6B', color: '#4a2810', minRating: 0.45 },
  { id: 'syrup', name: 'Syrup', icon: '\uD83C\uDF41', color: '#c87840', minRating: 0.50 },
  { id: 'cinnamon', name: 'Cinnamon', icon: '\uD83C\uDF3F', color: '#a06030', minRating: 0.55 },
  { id: 'vanilla', name: 'Vanilla', icon: '\uD83C\uDF3C', color: '#f0e0c0', minRating: 0.60 },
  { id: 'honey', name: 'Honey', icon: '\uD83C\uDF6F', color: '#e0a020', minRating: 0.65 },
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
  { name: 'Maple Latte',      ings: { coffee: 1, milk: 1, syrup: 1 },       time: 16, minRating: 0.50 },
  { name: 'Syrup Americano',  ings: { coffee: 2, syrup: 1 },                time: 13, minRating: 0.50 },
  { name: 'Cinnamon Cappuccino', ings: { coffee: 1, milk: 1, cinnamon: 1, cream: 1 }, time: 18, minRating: 0.55 },
  { name: 'Cinnamon Mocha',   ings: { coffee: 1, choco: 1, cinnamon: 1, milk: 1 }, time: 18, minRating: 0.55 },
  { name: 'Vanilla Dream',    ings: { coffee: 1, milk: 1, vanilla: 1, sugar: 1 },  time: 16, minRating: 0.60 },
  { name: 'Vanilla Macchiato', ings: { coffee: 2, milk: 1, vanilla: 1 },             time: 16, minRating: 0.60 },
  { name: 'Honey Bliss',      ings: { coffee: 1, milk: 1, honey: 1, cream: 1 },     time: 18, minRating: 0.65 },
  { name: 'Spiced Honey',     ings: { coffee: 1, cinnamon: 1, honey: 1 },            time: 14, minRating: 0.65 },
];

/* ============================
   CONVEYOR SETUP
   ============================ */

const VISIBLE = 2;
const DESIGNS = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }];

const CUP_CENTER_Y = 172;
const CUP_OFFSCREEN_X = 500;

let cups = [];
let money = 0;
let level = 0;
let nextLevelXP = 20;
let served = 0;
let missed = 0;
let missStreak = 0;
let totalStars = 5;
let maxStars = 50;
let activeIdx = 0;
let busy = false;
let paused = false;
let wasPausedBeforeLevelUp = false;

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
  var weights = eligible.map(function (t) {
    var total = 0;
    for (var k in t.ings) total += t.ings[k];
    return total;
  });
  var totalWeight = 0;
  for (var w = 0; w < weights.length; w++) totalWeight += weights[w];
  var r = Math.random() * totalWeight;
  for (var i = 0; i < eligible.length; i++) {
    r -= weights[i];
    if (r <= 0) return eligible[i];
  }
  return eligible[eligible.length - 1];
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
  var bonusCap = 3;
  const bonus = Math.floor(efficiency * bonusCap);
  for (let i = 0; i < bonus; i++) {
    const keys = Object.keys(ings);
    const pick = keys[Math.floor(Math.random() * keys.length)];
    ings[pick] = (ings[pick] || 0) + 1;
  }
  var decorTime = 0;
  decorTime += (state.upgrades['plant'] || 0) * 1;
  decorTime += (state.upgrades['window'] || 0) * 1;
  decorTime += (state.upgrades['lighting'] || 0) * 1;
  decorTime += (state.upgrades['music'] || 0) * 1;
  decorTime *= 1 + (state.upgrades['layout'] || 0) * 0.5;
  return { name: template.name, ings: ings, time: time + decorTime };
}

function getStarThresholds(rating) {
  return {
    five: Math.min(0.92, 0.78 + rating * 0.14),
    four: Math.min(0.78, 0.58 + rating * 0.20),
    three: Math.min(0.62, 0.38 + rating * 0.24),
    two: Math.min(0.40, 0.18 + rating * 0.22),
  };
}

function getNextLevelXP(level) {
  return 20 + level * 15 + Math.floor(level * level * 0.5);
}

function cupPos(index) {
  var scene = document.getElementById('scene');
  var cx = scene ? scene.offsetWidth / 2 : 220;
  return { x: index === 0 ? cx : CUP_OFFSCREEN_X, y: CUP_CENTER_Y };
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
  cups = [];
  for (let i = 0; i < VISIBLE; i++) {
    const c = spawn();
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
  var _ouStart = performance.now();
  const a = cups[activeIdx];
  if (!a) {
    orderName.textContent = '\u2014';
    timerArc.setAttribute('stroke-dashoffset', '0');
    timerText.textContent = '\u2014';
    orderChecklist.innerHTML = '';
    profiler.orderUiMs += performance.now() - _ouStart;
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
  profiler.orderUiMs += performance.now() - _ouStart;
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
      setTimeout(function () { p.remove(); }, 500);
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
  power += (state.upgrades[ingId + '_tap'] || 0);
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
    setTimeout(function () { p.remove(); }, 500);
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
    var invOffset = (state.upgrades['inventory'] || 0) * 0.06;
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
    var moneyMultiplier = 1;
    var wallartLevel = state.upgrades['wallart'] || 0;
    if (wallartLevel) moneyMultiplier += wallartLevel * 0.10;
    var outdoorLevel = state.upgrades['outdoor'] || 0;
    if (outdoorLevel) moneyMultiplier += outdoorLevel * 0.10;
    var beansLevel = state.upgrades['beans'] || 0;
    if (beansLevel) moneyMultiplier += beansLevel * 0.15;
    var lightingLevel = state.upgrades['lighting'] || 0;
    if (lightingLevel) moneyMultiplier += lightingLevel * 0.05 * stars;
    moneyEarned = Math.floor(moneyEarned * moneyMultiplier);
    money += moneyEarned;
    document.getElementById('moneyDisplay').textContent = '$' + money;
    updateLevelBar();

    // Level up check
    if (money >= nextLevelXP) {
      money -= nextLevelXP;
      level++;
      nextLevelXP = getNextLevelXP(level);
      showLevelUpChoices();
    }

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
      setTimeout(function () { p.remove(); }, 500);
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

  a.timer -= dt;
  updateOrderUI();

  if (a.timer <= 0) {
    a.timer = 0;
    a.full = true;
    missed++;
    missStreak++;
    document.getElementById('missedDisplay').textContent = missed;
    totalStars += 0;
    var missPenalty = Math.round(maxStars * 0.25) + Math.round(missStreak * maxStars * 0.1);
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
      setTimeout(function () { p.remove(); }, 500);
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

  a.el.classList.remove('active');
  a.el.querySelector('.cup-inner').style.animation = 'none';
  void a.el.offsetWidth;
  a.el.classList.add('exiting');
  a.el.querySelector('.cup-inner').style.animation = '';

  setTimeout(function () {
    const removed = cups.shift();
    removed.el.remove();

    let next = spawn();
    cups.push(next);
    row.appendChild(next.el);

    const newEl = next.el;
    newEl.style.transition = 'none';
    newEl.querySelector('.cup-inner').style.animation = 'none';
    void newEl.offsetWidth;
    reposition(true);
    cups[activeIdx].el.classList.add('entering');

    setTimeout(function () {
      cups[activeIdx].el.classList.remove('entering');
      busy = false;
      updateOrderUI();
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

var MAX_UPGRADE_LEVEL = 3;

var UPGRADE_CATEGORIES = [
  {
    name: '\uD83C\uDFF0 Decor',
    upgrades: [
      { id: 'plant', names: ['Potted Plant', 'Flowering Plant', 'Exotic Orchid'], icon: '\uD83C\uDF3F' },
      { id: 'wallart', names: ['Wall Art', 'Gallery Wall', 'Masterpiece'], icon: '\uD83D\uDDBC\uFE0F' },
      { id: 'window', names: ['Window Display', 'Bay Window', 'Panoramic View'], icon: '\uD83C\uDFE1' },
      { id: 'lighting', names: ['Ambient Lighting', 'Warm Lighting', 'Designer Lighting'], icon: '\uD83D\uDCA1' },
      { id: 'outdoor', names: ['Outdoor Seating', 'Patio', 'Rooftop Terrace'], icon: '\uD83C\uDFD5\uFE0F' },
      { id: 'music', names: ['Music System', 'Sound System', 'Live Band'], icon: '\uD83C\uDFB5' },
      { id: 'layout', names: ['Premium Layout', 'Executive Layout', 'Grand Layout'], icon: '\u2728' },
    ]
  },
  {
    name: '\uD83D\uDC77 Employees',
    upgrades: [
      { id: 'inventory', names: ['Inventory Manager', 'Inventory Analyst', 'Inventory Director'], icon: '\uD83D\uDCCA' },
      { id: 'supervisor', names: ['Shift Supervisor', 'Store Manager', 'Regional Manager'], icon: '\uD83C\uDFC6' },
    ]
  },
  {
    name: '\u2699\uFE0F Equipment',
    upgrades: [
      { id: 'beans', names: ['Premium Beans', 'Single-Origin', 'Reserve Blend'], icon: '\uD83C\uDF4E' },
      { id: 'sugar_tap', names: ['Sugar Shot', 'Sugar Stream', 'Sugar Flood'], icon: '\uD83C\uDF7C' },
      { id: 'milk_tap', names: ['Milk Splash', 'Milk Pour', 'Milk Cascade'], icon: '\uD83E\uDD5B' },
      { id: 'cream_tap', names: ['Cream Dollop', 'Cream Swirl', 'Cream Wave'], icon: '\uD83C\uDF66' },
      { id: 'choco_tap', names: ['Choco Dust', 'Choco Drizzle', 'Choco Deluge'], icon: '\uD83C\uDF6B' },
      { id: 'syrup_tap', names: ['Syrup Drop', 'Syrup Stream', 'Syrup River'], icon: '\uD83C\uDF41' },
      { id: 'cinnamon_tap', names: ['Cinnamon Dust', 'Cinnamon Swirl', 'Cinnamon Storm'], icon: '\uD83C\uDF3F' },
      { id: 'vanilla_tap', names: ['Vanilla Drop', 'Vanilla Pour', 'Vanilla Flood'], icon: '\uD83C\uDF3C' },
      { id: 'honey_tap', names: ['Honey Drip', 'Honey Flow', 'Honey Cascade'], icon: '\uD83C\uDF6F' },
    ]
  }
];

function getUpgradeDesc(id, level) {
  var lvl = (level || 0) + 1;
  switch (id) {
    case 'plant': return '+' + (lvl * 1) + 's per order';
    case 'wallart': return '+' + (lvl * 10) + '% money';
    case 'window': return '+' + (lvl * 1) + 's per order';
    case 'lighting': return '+' + (lvl * 1) + 's, more $ from stars';
    case 'outdoor': return '+' + (lvl * 10) + '% money';
    case 'music': return '+' + (lvl * 1) + 's per order';
    case 'layout': return '\u00d7' + (1 + lvl * 0.5).toFixed(1) + ' decor time';
    case 'inventory': return 'Easier ' + (lvl * 6) + '% star ratings';
    case 'supervisor': return 'Skip delay between orders';
    case 'beans': return '+' + (lvl * 15) + '% money';
    case 'sugar_tap': return '+' + lvl + ' sugar per click';
    case 'milk_tap': return '+' + lvl + ' milk per click';
    case 'cream_tap': return '+' + lvl + ' cream per click';
    case 'choco_tap': return '+' + lvl + ' choco per click';
    case 'syrup_tap': return '+' + lvl + ' syrup per click';
    case 'cinnamon_tap': return '+' + lvl + ' cinnamon per click';
    case 'vanilla_tap': return '+' + lvl + ' vanilla per click';
    case 'honey_tap': return '+' + lvl + ' honey per click';
    default: return '';
  }
}

/* ============================
   DOM REFS
   ============================ */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const soundBtn = document.getElementById('soundBtn');
const resetBtn = document.getElementById('resetBtn');
const levelDisplay = document.getElementById('levelDisplay');
const levelXpFill = document.getElementById('levelXpFill');
const levelXpText = document.getElementById('levelXpText');
const levelXpNext = document.getElementById('levelXpNext');
const levelUpModal = document.getElementById('levelUpModal');
const modalChoices = document.getElementById('modalChoices');
const ownedGrid = document.getElementById('ownedGrid');
const ownedCount = document.getElementById('ownedCount');

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
  var allCups = cups.slice();
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

function updateLevelBar() {
  levelDisplay.textContent = level;
  levelXpText.textContent = money;
  levelXpNext.textContent = nextLevelXP;
  var pct = Math.min(100, Math.floor(money / nextLevelXP * 100));
  levelXpFill.style.width = pct + '%';
  renderActiveEffects();
  renderOwnedUpgrades();
}

function renderActiveEffects() {
  var el = document.getElementById('activeEffects');
  if (!el) return;
  var lines = [];

  // Time bonus
  var pl = state.upgrades['plant'] || 0;
  var wl = state.upgrades['window'] || 0;
  var ll = state.upgrades['lighting'] || 0;
  var ml = state.upgrades['music'] || 0;
  var timeBonus = (pl + wl + ll + ml) * 1;
  if (timeBonus > 0) {
    var lvl = state.upgrades['layout'] || 0;
    var total = timeBonus * (1 + lvl * 0.5);
    var txt = '+' + total + 's per order';
    if (lvl > 0) txt += ' (\u00d7' + (1 + lvl * 0.5).toFixed(1) + ' layout)';
    lines.push(txt);
  }

  // Money bonus
  var wal = state.upgrades['wallart'] || 0;
  var ol = state.upgrades['outdoor'] || 0;
  var bl = state.upgrades['beans'] || 0;
  var moneyPct = wal * 10 + ol * 10 + bl * 15;
  if (moneyPct > 0) {
    lines.push('+' + moneyPct + '% money');
  }

  // Star money
  var litLvl = state.upgrades['lighting'] || 0;
  if (litLvl > 0) {
    lines.push('+ up to ' + (litLvl * 5 * 5) + '% $ from stars');
  }

  // Tap upgrades
  var tapParts = [];
  if (state.upgrades['sugar_tap']) tapParts.push('+' + state.upgrades['sugar_tap'] + ' sugar');
  if (state.upgrades['milk_tap']) tapParts.push('+' + state.upgrades['milk_tap'] + ' milk');
  if (state.upgrades['cream_tap']) tapParts.push('+' + state.upgrades['cream_tap'] + ' cream');
  if (state.upgrades['choco_tap']) tapParts.push('+' + state.upgrades['choco_tap'] + ' choco');
  if (state.upgrades['syrup_tap']) tapParts.push('+' + state.upgrades['syrup_tap'] + ' syrup');
  if (state.upgrades['cinnamon_tap']) tapParts.push('+' + state.upgrades['cinnamon_tap'] + ' cinnamon');
  if (state.upgrades['vanilla_tap']) tapParts.push('+' + state.upgrades['vanilla_tap'] + ' vanilla');
  if (state.upgrades['honey_tap']) tapParts.push('+' + state.upgrades['honey_tap'] + ' honey');
  if (tapParts.length > 0) {
    lines.push('Tap: ' + tapParts.join(', '));
  }

  // Thresholds
  var invLvl = state.upgrades['inventory'] || 0;
  if (invLvl > 0) {
    lines.push('Easier ' + (invLvl * 6) + '% star ratings');
  }

  // Supervisor
  if (state.upgrades['supervisor'] > 0) {
    lines.push('Skip delay between orders');
  }

  el.innerHTML = lines.length > 0
    ? lines.map(function (l) { return '<div class="effect-line">' + l + '</div>'; }).join('')
    : '<div class="effect-empty">No upgrades yet</div>';
}

function renderOwnedUpgrades() {
  var items = [];
  var total = 0;
  for (var c = 0; c < UPGRADE_CATEGORIES.length; c++) {
    var cat = UPGRADE_CATEGORIES[c];
    for (var i = 0; i < cat.upgrades.length; i++) {
      var upg = cat.upgrades[i];
      var lvl = state.upgrades[upg.id] || 0;
      if (lvl > 0) {
        total++;
        var name = upg.names[lvl - 1];
        var roman = lvl === 1 ? 'I' : lvl === 2 ? 'II' : 'III';
        var desc = getUpgradeDesc(upg.id, lvl - 1);
        items.push(
          '<div class="owned-item">' +
          '<div class="owned-item-top">' +
          '<span class="owned-item-icon">' + upg.icon + '</span>' +
          '<span class="owned-item-name">' + name + '</span>' +
          '<span class="owned-item-level">' + roman + '</span>' +
          '</div>' +
          '<div class="owned-item-desc">' + desc + '</div>' +
          '</div>'
        );
      }
    }
  }
  ownedGrid.innerHTML = items.join('');
  ownedCount.textContent = total;
}

function getEligibleUpgrades() {
  var eligible = [];
  for (var c = 0; c < UPGRADE_CATEGORIES.length; c++) {
    var cat = UPGRADE_CATEGORIES[c];
    for (var i = 0; i < cat.upgrades.length; i++) {
      var upg = cat.upgrades[i];
      var currentLevel = state.upgrades[upg.id] || 0;
      if (currentLevel < MAX_UPGRADE_LEVEL) {
        eligible.push(upg);
      }
    }
  }
  return eligible;
}

function showLevelUpChoices() {
  initAudio();
  wasPausedBeforeLevelUp = paused;
  paused = true;

  var eligible = getEligibleUpgrades();
  if (eligible.length === 0) {
    pushHint('\uD83D\uDC51 All upgrades maxed!');
    paused = wasPausedBeforeLevelUp;
    return;
  }

  // Pick 3 random distinct upgrades
  var choices = [];
  var pool = eligible.slice();
  for (var i = 0; i < 3 && pool.length > 0; i++) {
    var idx = Math.floor(Math.random() * pool.length);
    choices.push(pool[idx]);
    pool.splice(idx, 1);
  }

  modalChoices.innerHTML = '';
  for (var ci = 0; ci < choices.length; ci++) {
    var upg = choices[ci];
    var currentLevel = state.upgrades[upg.id] || 0;
    var nextName = upg.names[currentLevel];
    var nextDesc = getUpgradeDesc(upg.id, currentLevel);
    var card = document.createElement('div');
    card.className = 'choice-card';
    card.innerHTML =
      '<span class="choice-icon">' + upg.icon + '</span>' +
      '<div class="choice-info">' +
        '<div class="choice-name">' + nextName + '</div>' +
        '<div class="choice-desc">' + nextDesc + '</div>' +
      '</div>';
    card.addEventListener('click', function (id) { return function () { pickUpgradeChoice(id); }; }(upg.id));
    modalChoices.appendChild(card);
  }

  levelUpModal.classList.remove('hidden');
  playDing();
}

function pickUpgradeChoice(id) {
  state.upgrades[id] = (state.upgrades[id] || 0) + 1;
  levelUpModal.classList.add('hidden');
  paused = wasPausedBeforeLevelUp;
  updateLevelBar();

  pushHint('\u2B50 Upgraded ' + getUpgradeName(id, state.upgrades[id] - 1) + '!');
  playComplete();

  // Check for another level up
  if (money >= nextLevelXP) {
    money -= nextLevelXP;
    level++;
    nextLevelXP = getNextLevelXP(level);
    showLevelUpChoices();
  }
}

function getUpgradeName(id, levelIndex) {
  for (var c = 0; c < UPGRADE_CATEGORIES.length; c++) {
    var cat = UPGRADE_CATEGORIES[c];
    for (var i = 0; i < cat.upgrades.length; i++) {
      if (cat.upgrades[i].id === id) {
        return cat.upgrades[i].names[levelIndex] || id;
      }
    }
  }
  return id;
}

/* ============================
   PERSISTENCE
   ============================ */

function saveGame() {
  const data = {
    served: served,
    missed: missed,
    money: money,
    level: level,
    nextLevelXP: nextLevelXP,
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
      level = data.level || 0;
      nextLevelXP = data.nextLevelXP || getNextLevelXP(level);
      totalStars = data.totalStars !== undefined ? data.totalStars : 5;
      maxStars = data.maxStars !== undefined ? data.maxStars : 50;
      state.upgrades = data.upgrades || {};
      // Normalize old boolean upgrades to numbers
      for (var _uk in state.upgrades) {
        if (state.upgrades[_uk] === true) state.upgrades[_uk] = 1;
      }
      // Migrate old upgrade keys
      if (state.upgrades['counter']) { delete state.upgrades['counter']; }
      if (state.upgrades['cashier']) { delete state.upgrades['cashier']; }
      if (state.upgrades['barista']) { delete state.upgrades['barista']; }
      if (state.upgrades['brewer']) { delete state.upgrades['brewer']; }
      if (state.upgrades['milkfrother']) {
        state.upgrades['milk_tap'] = state.upgrades['milkfrother'];
        state.upgrades['cream_tap'] = state.upgrades['milkfrother'];
        delete state.upgrades['milkfrother'];
      }
      if (state.upgrades['syrups']) {
        var _sl = state.upgrades['syrups'];
        state.upgrades['syrup_tap'] = _sl;
        state.upgrades['cinnamon_tap'] = _sl;
        state.upgrades['vanilla_tap'] = _sl;
        state.upgrades['honey_tap'] = _sl;
        delete state.upgrades['syrups'];
      }
      if (state.upgrades['sweeteners']) {
        var _sw = state.upgrades['sweeteners'];
        state.upgrades['sugar_tap'] = _sw;
        state.upgrades['honey_tap'] = _sw;
        delete state.upgrades['sweeteners'];
      }
      if (state.upgrades['dairy']) {
        var _da = state.upgrades['dairy'];
        state.upgrades['milk_tap'] = _da;
        state.upgrades['cream_tap'] = _da;
        delete state.upgrades['dairy'];
      }
      if (state.upgrades['spices']) {
        var _sp = state.upgrades['spices'];
        state.upgrades['cinnamon_tap'] = _sp;
        state.upgrades['vanilla_tap'] = _sp;
        delete state.upgrades['spices'];
      }
      if (state.upgrades['flavors']) {
        var _fl = state.upgrades['flavors'];
        state.upgrades['choco_tap'] = _fl;
        state.upgrades['syrup_tap'] = _fl;
        delete state.upgrades['flavors'];
      }
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
    level = 0;
    nextLevelXP = 20;
    totalStars = 5;
    maxStars = 50;
    state.upgrades = {};
    initCups();
    updateLevelBar();
    updateUI();
    servedDisplay.textContent = '0';
    document.getElementById('missedDisplay').textContent = '0';
    document.getElementById('moneyDisplay').textContent = '$0';
    updateRating();
    orderName.textContent = '\u2014';
    timerText.textContent = '\u2014';
    timerArc.setAttribute('stroke-dashoffset', '0');
    pushHint('\u2615 Complete the order!');
  }
}

function togglePause() {
  if (levelUpModal && !levelUpModal.classList.contains('hidden')) return;
  paused = !paused;
  const btn = document.getElementById('pauseBtn');
  btn.textContent = paused ? '\u25B6' : '\u23F8';
  document.getElementById('app').classList.toggle('paused', paused);
}

/* ============================
   PROFILER
   ============================ */

var profiler = {
  frameCount: 0,
  totalFrameMs: 0,
  maxFrameMs: 0,
  minFrameMs: 999,
  timerMs: 0,
  orderUiMs: 0,
  lastLog: 0,
  logInterval: 3000,
  displayEl: null,
  init: function () {
    var el = document.createElement('div');
    el.id = 'profilerDisplay';
    el.style.cssText = 'position:fixed;top:4px;left:4px;z-index:999;font-size:10px;font-family:monospace;color:#888;background:rgba(0,0,0,0.7);padding:4px 8px;border-radius:4px;pointer-events:none;line-height:1.5;';
    el.textContent = 'profiling...';
    document.body.appendChild(el);
    this.displayEl = el;
    this.lastLog = performance.now();
  },
  frame: function (frameMs) {
    this.frameCount++;
    this.totalFrameMs += frameMs;
    if (frameMs > this.maxFrameMs) this.maxFrameMs = frameMs;
    if (frameMs < this.minFrameMs) this.minFrameMs = frameMs;
    var now = performance.now();
    if (now - this.lastLog > this.logInterval) {
      this.log(now);
    }
  },
  log: function (now) {
    if (!this.displayEl) return;
    var avg = this.frameCount > 0 ? (this.totalFrameMs / this.frameCount).toFixed(1) : '0.0';
    var fps = this.frameCount > 0 ? (1000 / (this.totalFrameMs / this.frameCount)).toFixed(0) : '0';
    var min = this.minFrameMs === 999 ? '0.0' : this.minFrameMs.toFixed(1);
    var max = this.maxFrameMs.toFixed(1);
    var timerAvg = this.frameCount > 0 ? (this.timerMs / this.frameCount).toFixed(2) : '0.00';
    var orderAvg = this.frameCount > 0 ? (this.orderUiMs / this.frameCount).toFixed(3) : '0.000';
    this.displayEl.innerHTML =
      'FPS: ' + fps + ' (min:' + min + ' avg:' + avg + ' max:' + max + 'ms)' +
      '<br>timer: ' + timerAvg + 'ms  orderUI: ' + orderAvg + 'ms  frames: ' + this.frameCount;
    this.frameCount = 0;
    this.totalFrameMs = 0;
    this.maxFrameMs = 0;
    this.minFrameMs = 999;
    this.timerMs = 0;
    this.orderUiMs = 0;
    this.lastLog = now;
  }
};

/* ============================
   ANIMATION LOOP
   ============================ */

let lastTime = 0;
var firstFrame = true;

function animate(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);

  if (firstFrame) {
    firstFrame = false;
  } else {
    profiler.frame(time - lastTime);
  }

  lastTime = time;

  if (!paused) {
    var t0 = performance.now();
    updateTimer(dt);
    profiler.timerMs += performance.now() - t0;
  }
  updateParticles(dt);
  renderParticles();
  requestAnimationFrame(animate);
}

/* ============================
   COFFEE SHOP BACKGROUND
   ============================ */

function buildCoffeeShopBackground() {
  var bgWallInner = document.getElementById('bgWallInner');
  var bgPattern = document.getElementById('bgPattern');
  var fLayer = document.getElementById('furnitureLayer');
  if (!bgWallInner || !bgPattern || !fLayer) return;

  // Wall color
  bgWallInner.style.background = 'linear-gradient(180deg, #e8d5c0, #d4b898)';

  // Diamond pattern
  bgPattern.className = 'bg-pattern bg-pattern-diamond';

  // --- Build all furniture ---
  fLayer.innerHTML = '';

  // Espresso Machine
  var machine = document.createElement('div');
  machine.className = 'furn-piece f-machine';
  machine.style.right = '24px';
  machine.innerHTML = '<div class="body"><div class="badge"></div></div><div class="group"></div><div class="drip"></div><div class="steam"></div>';
  fLayer.appendChild(machine);

  // Wall Shelf
  var shelf = document.createElement('div');
  shelf.className = 'furn-piece f-shelf';
  shelf.style.left = '50px';
  shelf.style.bottom = '100px';
  shelf.innerHTML = '<div class="board"></div><div class="bracket-l"></div><div class="bracket-r"></div>';
  var sItems = [
    { cls:'book', left:6 }, { cls:'book', left:14 }, { cls:'jar', left:28 },
    { cls:'cup', left:44 }, { cls:'book', left:56 }, { cls:'book', left:63 },
    { cls:'jar', left:76 }, { cls:'cup', left:88 }
  ];
  for (var si = 0; si < sItems.length; si++) {
    var item = document.createElement('div');
    item.className = 'item ' + sItems[si].cls;
    item.style.left = sItems[si].left + 'px';
    shelf.appendChild(item);
  }
  fLayer.appendChild(shelf);

  // Tall Cabinet
  var cabinet = document.createElement('div');
  cabinet.className = 'furn-piece f-cabinet';
  cabinet.style.left = '10px';
  cabinet.innerHTML = '<div class="cab-body"><div class="door"><div class="handle"></div></div></div>';
  fLayer.appendChild(cabinet);

  // Pendant Lights
  var lPositions = [70, 160, 248];
  var lColors = ['#8a6a4a', '#7a5a3a', '#9a7a5a'];
  for (var li = 0; li < lPositions.length; li++) {
    var light = document.createElement('div');
    light.className = 'furn-piece f-light';
    light.style.left = (lPositions[li] - 9) + 'px';
    light.innerHTML = '<div class="cord"></div><div class="shade" style="background:linear-gradient(180deg,' + lColors[li] + ', #5a3a22);"><div class="glow"></div></div>';
    fLayer.appendChild(light);
  }

  // Window
  var win = document.createElement('div');
  win.className = 'furn-piece f-window';
  win.style.right = '70px';
  win.style.top = '12px';
  win.innerHTML = '<div class="frame"><div class="sun"></div></div><div class="curtain-l"></div><div class="curtain-r"></div>';
  fLayer.appendChild(win);

  // Coffee Grinder
  var grinder = document.createElement('div');
  grinder.className = 'furn-piece f-grinder';
  grinder.style.right = '24px';
  grinder.style.bottom = '54px';
  grinder.innerHTML = '<div class="body"><div class="knob"></div></div><div class="hopper"></div><div class="spout"></div>';
  fLayer.appendChild(grinder);

  // Pastry Display
  var pastry = document.createElement('div');
  pastry.className = 'furn-piece f-pastry';
  pastry.style.left = '170px';
  pastry.style.bottom = '30px';
  pastry.innerHTML = '<div class="base"></div><div class="glass"></div><div class="top"></div>';
  var treats = [3, 12, 21];
  var tColors = ['#c08050', '#d09060', '#b07040'];
  for (var ti = 0; ti < treats.length; ti++) {
    var t = document.createElement('div');
    t.className = 'treat';
    t.style.left = treats[ti] + 'px';
    t.style.background = tColors[ti];
    pastry.appendChild(t);
  }
  fLayer.appendChild(pastry);

  // Wall Clock
  var clock = document.createElement('div');
  clock.className = 'furn-piece f-clock';
  clock.style.right = '66px';
  clock.style.top = '68px';
  clock.innerHTML = '<div class="face"><div class="hand-h"></div><div class="hand-m"></div><div class="center"></div></div>';
  fLayer.appendChild(clock);

  // Cup Tree
  var cuptree = document.createElement('div');
  cuptree.className = 'furn-piece f-cuptree';
  cuptree.style.left = '46px';
  cuptree.innerHTML = '<div class="base"></div><div class="post"></div>';
  var cArms = [
    { side:'left', top:2 }, { side:'right', top:2 },
    { side:'left', top:10 }, { side:'right', top:10 }
  ];
  for (var ai = 0; ai < cArms.length; ai++) {
    var a = cArms[ai];
    var arm = document.createElement('div');
    arm.className = 'arm';
    arm.style[a.side === 'left' ? 'left' : 'right'] = '-10px';
    arm.style.top = a.top + 'px';
    cuptree.appendChild(arm);
    var cup = document.createElement('div');
    cup.className = 'cup';
    cup.style[a.side === 'left' ? 'left' : 'right'] = '-8px';
    cup.style.top = a.top + 'px';
    cuptree.appendChild(cup);
  }
  fLayer.appendChild(cuptree);

  // Hanging Sign
  var sign = document.createElement('div');
  sign.className = 'furn-piece f-sign';
  sign.style.left = '50%';
  sign.style.transform = 'translateX(-50%)';
  sign.innerHTML = '<div class="chain"></div><div class="board"><div class="line">COFFEE</div><div class="line">TEA</div></div>';
  fLayer.appendChild(sign);

  // Sink Basin
  var sink = document.createElement('div');
  sink.className = 'furn-piece f-sink';
  sink.style.left = '230px';
  sink.style.bottom = '30px';
  sink.innerHTML = '<div class="basin"></div><div class="faucet"></div><div class="knob-l"></div><div class="knob-r"></div>';
  fLayer.appendChild(sink);
}

/* ============================
   INIT
   ============================ */

function init() {
  profiler.init();
  loadGame();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  buildCoffeeShopBackground();
  initCups();
  updateLevelBar();
  updateUI();
  servedDisplay.textContent = served;
  document.getElementById('missedDisplay').textContent = missed;
  document.getElementById('moneyDisplay').textContent = '$' + money;
  updateRating();
  pushHint('\u2615 Coffee Conveyor \u2014 Complete orders to earn stars!');
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  soundBtn.addEventListener('click', toggleSound);
  resetBtn.addEventListener('click', resetGame);
  setInterval(saveGame, 5000);
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('keydown', function (e) {
  var key = parseInt(e.key, 10);
  if (key >= 1 && key <= 9) {
    var btns = document.querySelectorAll('#ingredientBar .ing-btn');
    var btn = btns[key - 1];
    if (btn) { e.preventDefault(); addIngredient(btn.dataset.ing); }
  }
});

/* ============================
   INGREDIENT BUTTONS
   ============================ */

document.getElementById('ingredientBar').addEventListener('click', function (e) {
  var btn = e.target.closest('.ing-btn');
  if (btn) addIngredient(btn.dataset.ing);
});
