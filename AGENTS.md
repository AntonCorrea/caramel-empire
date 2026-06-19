# Caramel Empire — Coffee Shop Order Fulfillment Game

Coffee shop order-fulfillment game. Pure vanilla HTML/CSS/JS, no build step.

## Quick Start
```
npm run dev
```
Opens at `http://localhost:3000`

## Files
- `index.html` — Main game (header, stats bar, scene with background + furniture, order panel with timer, dynamic ingredient bar, upgrade shop)
- `style.css` — All styles (background, furniture, cups, circular timer, pause overlay, floating stars, ingredient bar, upgrade shop, hint log, animations)
- `script.js` — Game logic (orders, ingredients, timer, cup cycle, upgrades, money, auto-fill, floating stars, particles, persistence, background builder)
- `demo-bg.html` — Standalone coffee shop background demo (furniture, patterns, palette)
- `AGENTS.md` — Session context for AI continuation

## Gameplay
- Each cup is a **customer order** with specific ingredient requirements and a circular countdown timer
- Only the **center cup** is active; the offscreen cup waits on the right and slides in next
- Click **ingredient buttons** to add ingredients to the active order; buttons dynamically appear/disappear based on rating
- Complete all ingredient requirements before the timer runs out → order served with 1-5 stars
- Timer expires → order missed → rating penalty (scales with maxStars)
- Rating = `totalStars / maxStars` (displayed as percentage + ★★★★★)
- Wrong ingredient **resets the recipe** (clears progress on same order, no timer reset, no miss penalty)
- **Money** earned per order funds upgrades from the shop
- Rating-based difficulty scaling: higher rating = shorter times, extra bonus ingredients, stricter star thresholds, new ingredient unlocks

## Stats Bar
- Four stats displayed in a row: **Served** (☕), **Missed** (⏰), **Rating** (% + ★★★★★), **Money** (💰)
- Rating stat shows tooltip with formula: `totalStars / maxStars × 100`

## Scene
- Coffee shop 2D background with wall, wainscot, floor, counter, and 11 furniture pieces (espresso machine, shelf, cabinet, pendant lights, window, grinder, pastry display, clock, cup tree, hanging sign, sink)
- Wall patterns: Plain, Brick, Subway Tile, Stripes, Diagonal, Polka Dots, Diamond (default), Wood Planks
- Yellow warmth overlay with `mix-blend-mode: overlay`
- Background rendered at z-index 0-1, game elements at z-index 3+
- Furniture built by `buildCoffeeShopBackground()` on init

## Conveyor / Cup Flow
- Single active cup at center, one offscreen cup waiting on the right (`CUP_OFFSCREEN_X = 500`)
- Cup enters by sliding **right → center** with a bounce
- Cup exits by sliding **center → left** (`cupExitBounce` translate to -160px)
- Enter/exit animations use CSS keyframes; the `left` transition handles the long slide, `transform` keyframe handles bounce
- `.entering .cup-inner` and `.exiting .cup-inner` rules come after `.active .cup-inner` in CSS to override pulse glow
- 10 distinct cup designs (`.d-0` through `.d-9`) with color-matched borders
- Coffee fill rises in the cup as ingredients are added (percentage-based)
- Steam particles while ingredients are being added
- Cup center computed dynamically from `scene.offsetWidth / 2`
- Cup sits on the counter top at y=172 (body bottom at y=186 = counter surface)

## Order System
- **30 order templates** (Black Coffee, Espresso, Latte, Cappuccino, Mocha, Macchiato, Affogato, Irish Coffee, Cold Brew, Americano, Flat White, Con Panna, Ristretto, Cortado, Red Eye, Vienna, Frappe, Latte Macchiato, Cafe au Lait, Cafe Bombon, Egg Coffee, Galao, Maple Latte, Syrup Americano, Cinnamon Cappuccino, Cinnamon Mocha, Vanilla Dream, Vanilla Macchiato, Honey Bliss, Spiced Honey)
- Templates have `minRating` thresholds aligned with their ingredient unlock levels
- `randOrder(rating)` filters by template minRating AND ingredient-level minRating; falls back to Black Coffee
- **Weighted random selection** — probability proportional to ingredient count (5-ingredient Honey Bliss is 5× more likely than Black Coffee)
- **No pre-generated queue** — each order spawns at current rating when needed
- Each order has required ingredient counts (e.g., Coffee: 2, Milk: 1)
- Timer counts down in real-time via `requestAnimationFrame`
- Circular SVG clock arc depletes (green→yellow→red); shows "✓" when complete
- Pause button freezes game loop, dims scene with blur overlay

## Ingredients (9 total, 2 starter + 7 unlockable)
| Ingredient | Icon | Unlocks At |
|-----------|------|-----------|
| Coffee | ☕ | Always |
| Sugar | 🍚 | Always |
| Milk | 🥛 | Rating ≥ 25% |
| Cream | 🍦 | Rating ≥ 40% |
| Choco | 🍫 | Rating ≥ 45% |
| Syrup | 🍁 | Rating ≥ 50% |
| Cinnamon | 🌿 | Rating ≥ 55% |
| Vanilla | 🌼 | Rating ≥ 60% |
| Honey | 🍯 | Rating ≥ 65% |

- Each ingredient button has a distinct color
- Buttons animate in on unlock (`.ing-btn-enter`), bar pulses when ingredients are lost (`.lock-pulse`)
- When rating drops below a threshold, locked ingredients' orders are regenerated via `regenerateLockedOrders()`
- Error feedback for: ingredient not needed, ingredient already full, or busy/timed out order

## Star Rating (1-5★)
- Per-order: 1-5 stars based on time remaining
  - Thresholds tighten with rating (two→five thresholds: 0.18→0.40 up to 0.78→0.92)
  - **Inventory Manager** upgrade reduces all thresholds by 0.06
- Rating starts at 10% (`totalStars=5, maxStars=50`)
- On serve: `totalStars += stars (1-5)` and `maxStars += 5`
- On miss: `maxStars += round(maxStars × 0.25) + round(missStreak × maxStars × 0.1) — cashier reduces streak part by round(maxStars × 0.1)`
- Miss penalty scales with maxStars so it hurts proportionally at any level
- Floating labels: "Incredible!" (5★), "Amazing!" (4★), "Perfect!" (3★), "Great!" (2★), "Good!" (1★), "Miss!" (0★)
- Golden glow (`.float-stars`) animates upward at cup position

## Money System
- Formula: `floor(totalIngs × baseTime/8 × starMoney[stars])`
  - `starMoney = [0, 0.5, 0.8, 1.1, 1.4, 1.8]` (indexed by star count)
  - e.g., 1★=0.5×, 3★=1.1×, 5★=1.8×
  - Upgrades (multiplicative): Wall Art ×1.15, Outdoor Seating ×1.20, Premium Beans ×1.50, Ambient Lighting ×(1 + 0.1×stars)
- No starting money; static upgrade costs (no scaling)
- Tip shown in orange when upgrades boost the base amount

## Upgrades (16 total, 3 categories)
Any upgrade can be bought if you have enough money (no sequential lock).

### 🏰 Decor
| ID | Name | Effect | Cost |
|----|------|--------|------|
| plant | Potted Plant | +2s per order | 20 |
| wallart | Wall Art | +15% money per order | 40 |
| counter | New Counter | +1 bonus ingredient capacity | 80 |
| window | Window Display | +3s per order | 150 |
| lighting | Ambient Lighting | +2s, star money bonus | 250 |
| outdoor | Outdoor Seating | +20% money per order | 400 |
| music | Music System | +4s per order | 650 |
| layout | Premium Layout | ×2 all decor time bonuses | 1000 |

### 👷 Employees
| ID | Name | Effect | Cost |
|----|------|--------|------|
| barista | Part-time Barista | Auto-fill 1 ingredient per order | 1500 |
| cashier | Cashier | Reduce miss streak penalty | 2500 |
| inventory | Inventory Manager | Loosen star thresholds by 0.06 | 4000 |
| supervisor | Shift Supervisor | Auto-advance on order complete | 6500 |

### ⚙️ Equipment
| ID | Name | Effect | Cost |
|----|------|--------|------|
| beans | Premium Beans | ×1.5 money per order | 10000 |
| milkfrother | Milk Frother | +1 tap for milk & cream | 16000 |
| syrups | Syrup Dispenser | +1 tap for syrup/spices | 25000 |
| brewer | Master Brewer | Timer 25% slower | 40000 |

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
- `generateOrder(rating)`: time multiplier `max(0.3, 1.0 - rating × 0.7)`, bonus `floor(rating × 3)` extra ingredients, plus counter upgrade adds +1 to cap
- `randOrder(rating)`: weighted by ingredient count, filters by minRating AND ingredient-level minRating; falls back to Black Coffee
- `getStarThresholds(rating)`: thresholds tighten continuously from low to high rating
- Ingredient unlocks at 25%, 40%, 45%, 50%, 55%, 60%, 65% rating

## Visual FX
- Coffee shop background built from CSS (wall, diamond pattern, wainscot, floor, counter, 11 furniture pieces)
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
- Cup enter (right→center with bounce) / exit (center→left) animations, ruin shake on wrong ingredient
- Pause overlay with blur backdrop

## Hint Log
- Chat-style scrollable log above counter, below cups
- 3-row height, max 3 entries, auto-scrolls to latest
- Older entries fade via CSS: `:nth-last-child(3)` at 0.4, `:nth-last-child(2)` at 0.7
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
- `randOrder(rating)` → picks eligible template (weighted by ingredient count), filters by minRating and ingredient minRating
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
- `buildCoffeeShopBackground()` → builds all furniture, applies wall color and diamond pattern

## Cup Designs
- d-0: White ceramic, d-1: Red mug, d-2: Blue dots, d-3: Green matte, d-4: Yellow stripe
- d-5: Dark ceramic, d-6: Terracotta, d-7: Pink diamond, d-8: Turquoise wave, d-9: Purple speckle
