# Coffee Conveyor — Order Fulfillment Game

Isometric coffee conveyor order-fulfillment game. Pure vanilla HTML/CSS/JS, no build step.

## Quick Start
```
npm run dev
```
Opens at `http://localhost:3000`

## Files
- `index.html` — Main game (header, stats bar, conveyor scene, order panel with timer, dynamic ingredient bar, upgrade shop)
- `style.css` — All styles (conveyor, cups, circular timer, pause overlay, floating stars, ingredient bar, upgrade shop, hint log, animations)
- `script.js` — Game logic (orders, ingredients, timer, cup cycle, upgrades, money, auto-fill, floating stars, particles, persistence)
- `conveyor-demo.html` — Standalone demo (outdated, kept for reference)
- `AGENTS.md` — Session context for AI continuation

## Gameplay
- Each cup is a **customer order** with specific ingredient requirements and a circular countdown timer
- Only the **center cup** is active; side cups show upcoming orders
- Click **ingredient buttons** to add ingredients to the active order; buttons dynamically appear/disappear based on rating
- Complete all ingredient requirements before the timer runs out → order served with 1-5 stars
- Timer expires → order missed → rating penalty (consecutive misses increase penalty by +2 each)
- Rating = `totalStars / maxStars` (displayed as percentage + ★★★★★)
- Wrong ingredient **resets the recipe** (clears progress on same order, no timer reset, no miss penalty)
- **Money** earned per order funds upgrades from the shop
- Rating-based difficulty scaling: higher rating = shorter times, extra bonus ingredients, stricter star thresholds, new ingredient unlocks

## Stats Bar
- Four stats displayed vertically (icon above text, centered): **Served** (☕), **Missed** (⏰), **Rating** (% + ★★★★★), **Money** (💰)
- Rating stat shows tooltip with formula: `totalStars / maxStars × 100`

## Conveyor
- Isometric belt: `scale(1, 0.5) rotate(-49deg)` on a 600×92px rectangle
- 5 cups on a diagonal from bottom-left to top-right (DIAG_X=74, DIAG_Y=41, BASE_X=265, BASE_Y=155)
- 10 distinct cup designs (`.d-0` through `.d-9`) with color-matched 3px borders
- Active center cup is larger (scale 1.0) with pulse glow; side cups are smaller (scale 0.75)
- Coffee fill rises in the cup as ingredients are added (percentage-based)
- Steam particles while ingredients are being added

## Order System
- **32 order templates** (Black Coffee, Espresso, Latte, Cappuccino, Mocha, Macchiato, Affogato, Irish Coffee, Cold Brew, Americano, Flat White, Con Panna, Ristretto, Cortado, Red Eye, Vienna, Frappe, Latte Macchiato, Cafe au Lait, Cafe Bombon, Egg Coffee, Galao, Maple Latte, Syrup Americano, Cinnamon Cappuccino, Cinnamon Mocha, Vanilla Dream, Vanilla Macchiato, Honey Bliss, Spiced Honey)
- Templates have `minRating` thresholds (0.25/0.50/0.75/0.90) and are only available at sufficient rating
- Templates that require locked ingredients are filtered out by `randOrder(rating)`
- Each order has required ingredient counts (e.g., Coffee: 2, Milk: 1)
- Timer counts down in real-time via `requestAnimationFrame`
- Circular SVG clock arc depletes (green→yellow→red); shows "✓" when complete
- Pause button freezes game loop dims scene with blur overlay

## Ingredients (9 total, 2 starter + 7 unlockable)
| Ingredient | Icon | Unlocks At |
|-----------|------|-----------|
| Coffee | ☕ | Always |
| Sugar | 🍚 | Always |
| Milk | 🥛 | Rating ≥ 15% |
| Cream | 🍦 | Rating ≥ 25% |
| Choco | 🍫 | Rating ≥ 40% |
| Syrup | 🍁 | Rating ≥ 55% |
| Cinnamon | 🌿 | Rating ≥ 70% |
| Vanilla | 🌼 | Rating ≥ 85% |
| Honey | 🍯 | Rating ≥ 95% |

- Each ingredient button has a distinct color
- Buttons animate in on unlock (`.ing-btn-enter`), bar pulses when ingredients are lost (`.lock-pulse`)
- When rating drops below a threshold, locked ingredients' orders are regenerated via `regenerateLockedOrders()`
- Error feedback for: ingredient not needed, ingredient already full, or busy/timed out order

## Star Rating (1-5★)
- Per-order: 1-5 stars based on time remaining
  - Thresholds tighten with rating (two→five thresholds: 0.18→0.40 up to 0.78→0.92)
  - **Inventory Manager** upgrade reduces all thresholds by 0.06
- Rating starts at 10% (`totalStars=1, maxStars=10`)
- Consecutive misses add `5 + floor(missStreak × 2)` to maxStars (reset on serve); **Cashier** reduces penalty by 2
- Floating labels: "Incredible!" (5★), "Amazing!" (4★), "Perfect!" (3★), "Great!" (2★), "Good!" (1★), "Miss!" (0★)
- Golden glow (`.float-stars`) animates upward at cup position

## Money System
- Money replaces served as upgrade currency; served remains as pure stat
- Formula: `floor(totalIngredientCount × baseTime/8 × starMultiplier)`
  - `starMultiplier`: 1★=1, 2★=1.5, 3★=2, 4★=2.5, 5★=3
  - Money multipliers (multiplicative): Wall Art ×1.15, Outdoor Seating ×1.20, Premium Beans ×1.50, Ambient Lighting ×(1 + 0.1×stars)
- No starting money; static upgrade costs (no scaling)

## Upgrades (16 total, 3 categories)
Any upgrade can be bought if you have enough money (no sequential lock).

### 🏰 Decor
| ID | Name | Effect | Cost |
|----|------|--------|------|
| plant | Potted Plant | +2s per order | 30 |
| wallart | Wall Art | +15% money per order | 80 |
| counter | New Counter | +1 bonus ingredient capacity | 180 |
| window | Window Display | +3s per order | 400 |
| lighting | Ambient Lighting | +2s, star money bonus | 800 |
| outdoor | Outdoor Seating | +20% money per order | 1600 |
| music | Music System | +4s per order | 3200 |
| layout | Premium Layout | ×2 all decor time bonuses | 6500 |

### 👷 Employees
| ID | Name | Effect | Cost |
|----|------|--------|------|
| barista | Part-time Barista | Auto-fill 1 ingredient per order | 12000 |
| cashier | Cashier | Reduce miss streak penalty by 2 | 24000 |
| inventory | Inventory Manager | Loosen star thresholds by 0.06 | 48000 |
| supervisor | Shift Supervisor | Auto-advance on order complete | 96000 |

### ⚙️ Equipment
| ID | Name | Effect | Cost |
|----|------|--------|------|
| beans | Premium Beans | ×1.5 money per order | 180000 |
| milkfrother | Milk Frother | +1 tap for milk & cream | 350000 |
| syrups | Syrup Dispenser | +1 tap for syrup/spices | 700000 |
| brewer | Master Brewer | Timer 25% slower | 1400000 |

**Upgrade mechanics:**
- Decor time bonuses are cumulative; Premium Layout doubles total
- Part-time Barista: when cup enters active, fills 1 random missing ingredient
- Milk Frother: adds +1 per click on milk/cream ingredients
- Syrup Dispenser: adds +1 per click on syrup/cinnamon/vanilla/honey ingredients
- Shift Supervisor: skips the 450ms advance delay after order complete
- Master Brewer: timer runs at 0.75× speed

## Sound
- Web Audio API for sound effects (pop, ding, complete, error)
- Toggle via sound button in header
- Setting persisted separately (`coffeeSound` key in localStorage)

## Difficulty Scaling
- `generateOrder(rating)`: time multiplier `max(0.4, 1.0 - rating × 0.5)`, bonus `floor(rating × 3)` extra ingredients, plus counter upgrade adds +1 to cap
- `randOrder(rating)`: filters templates by minRating AND ingredient-level minRating; falls back to Black Coffee
- `getStarThresholds(rating)`: two/thresholds tighten continuously from low to high rating
- Ingredient unlocks at 15%, 25%, 40%, 55%, 70%, 85%, 95% rating

## Visual FX
- Canvas-based particle system (ambient steam particles)
- CSS pop/burst animations on ingredient add
- Order complete burst particles
- Floating labels (stars, money, tip) use two-element nesting for smooth parabolic arc:
  - `.float-arc` (outer) animates `translateX` with `ease-in`
  - `.float-*-inner` (inner) animates `translateY` with `ease-out` + scale + opacity
  - Labels arc upward from cup, last 1s (animation) + linger in DOM for 1.2s
- Stars: single label with only filled stars (e.g. ★★★), no empty ☆, size 1.4rem
- Money: `+$X` shows base cost, arcs upward-right
- Tip: `tipped $X !!` in orange, arcs upward-left, only shown when tip > 0
- Tip also shown in hint log as orange `<span>` after base cost
- Timer urgency pulse when low (<33%)
- Cup enter/exit horizontal translateX animations, ruin shake on wrong ingredient
- Pause overlay with blur backdrop

## Hint Log
- Chat-style scrollable log below scene
- 3-row height, max 3 entries, auto-scrolls to latest
- Appears on order complete, miss, wrong ingredient, upgrade purchase
- Uses `innerHTML` for styled tip display (orange `<span>` after base cost)

## Tech
- Vanilla JS (no template literals, no arrow functions — must pass `new Function(code)` check)
- CSS custom properties, flexbox, CSS animations
- SVG for circular timer arc (`stroke-dasharray` animation)
- Web Audio API
- Canvas 2D for particles
- localStorage for save/load (`coffeeConveyor` key) — auto-saves every 5 seconds
- http-server for local dev

## Key Functions
- `getRating()` → returns `totalStars / maxStars` (0-1)
- `generateOrder(rating)` → creates scaled order object with time, ingredients, bonus, decor time
- `randOrder(rating)` → picks eligible template, filters by minRating and ingredient minRating
- `getStarThresholds(rating)` → `{five, four, three, two}` thresholds
- `applyAutoFill(a)` → auto-fills 1 missing ingredient (Part-time Barista)
- `showFloatingStars(stars, text, cupEl)` → animates star indicator at cup
- `showFloatingMoney(amount, cupEl)` → animates `+$X` base cost upward-right
- `showFloatingTip(amount, cupEl)` → animates `tipped $X !!` upward-left (orange)
- `makeRemover(el)` → returns cleanup fn for setTimeout
- `renderIngredientButtons()` → rebuilds button bar based on current rating
- `regenerateLockedOrders(locked)` → replaces orders referencing locked ingredients
- `updateTimerArc(a)` → updates circular SVG arc position and color
- `renderUpgrades()` → renders category-based upgrade shop
- `pushHint(msg)` → adds message to hint log

## Cup Designs
- d-0: White ceramic, d-1: Red mug, d-2: Blue dots, d-3: Green matte, d-4: Yellow stripe
- d-5: Dark ceramic, d-6: Terracotta, d-7: Pink diamond, d-8: Turquoise wave, d-9: Purple speckle
