# Caramel Empire — Coffee Shop Order Fulfillment Game

Coffee shop order-fulfillment game. Pure vanilla HTML/CSS/JS, no build step.

## Quick Start
```
npm run dev
```
Opens at `http://localhost:3000`

## Files
- `index.html` — Main game (header, stats bar, scene, order panel, timer, ingredient bar, level panel, active effects, owned upgrades, level-up modal)
- `style.css` — All styles (background, furniture, cups, circular timer, pause overlay, floating stars, ingredient bar, level panel, upgrades, hint log, animations, profiler)
- `script.js` — Game logic (orders, ingredients, timer, cup cycle, level/XP system, upgrades, money, floating stars, particles, persistence, background builder, profiler)
- `demo-bg.html` — Standalone coffee shop background demo
- `AGENTS.md` — Session context for AI continuation

## Gameplay
- Each cup is a **customer order** with specific ingredient requirements and a circular countdown timer
- Only the **center cup** is active; the offscreen cup waits on the right and slides in next
- Click **ingredient buttons** (or press **1-9** keys) to add ingredients to the active order
- Complete all ingredient requirements before the timer runs out → order served with 1-5 stars
- Timer expires → order missed → rating penalty
- Rating = `totalStars / maxStars` (displayed as percentage + ★★★★★)
- Wrong ingredient **resets the recipe** (clears progress on same order, no timer reset, no miss penalty)
- **Money** earned per order = XP; when `money >= nextLevelXP`, you level up and pick 1 of 3 random upgrades
- Rating-based difficulty scaling: higher rating = shorter times, extra bonus ingredients, stricter star thresholds, new ingredient unlocks

## Stats Bar
- Four stats displayed in a row: **Served** (☕), **Missed** (⏰), **Rating** (% + ★★★★★), **Money** (💰)
- Rating stat shows tooltip with formula: `totalStars / maxStars × 100`

## Scene
- Coffee shop 2D background with wall, wainscot, floor, counter, and 11 furniture pieces
- Wall patterns: Plain, Brick, Subway Tile, Stripes, Diagonal, Polka Dots, Diamond (default), Wood Planks
- Yellow warmth overlay with `mix-blend-mode: overlay`
- Background at z-index 0-1, game elements at z-index 3+
- Furniture built by `buildCoffeeShopBackground()` on init

## Conveyor / Cup Flow
- Single active cup at center, one offscreen cup waiting on the right (`CUP_OFFSCREEN_X = 500`)
- Cup enters: slide right→center with bounce (scale overshoot 0.4→1.15→0.95→1.0)
- Cup exits: slide center→left with matching bounce (no shrink/fade)
- `.entering .cup-inner` and `.exiting .cup-inner` rules come after `.active .cup-inner` to override pulse glow
- 10 distinct cup designs (`.d-0` through `.d-9`) with color-matched borders
- Coffee fill rises as ingredients are added (percentage-based)
- Steam particles while ingredients are being added
- Cup center computed from `scene.offsetWidth / 2`
- Cup sits on the counter top at y=172 (body bottom at y=186 = counter surface)

## Order System
- **30 order templates** (Black Coffee through Spiced Honey)
- Templates have `minRating` thresholds aligned with ingredient unlock levels
- `randOrder(rating)` filters by template minRating AND ingredient-level minRating; falls back to Black Coffee
- **Weighted random selection** — probability proportional to ingredient count
- **No pre-generated queue** — each order spawns at current rating when needed
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

- Each ingredient button has a distinct color, triggers via click or key 1-9
- Buttons animate in on unlock, bar pulses when ingredients are lost
- Wrong ingredient feedback: red pops, error sound, recipe reset

## Star Rating (1-5★)
- Per-order: 1-5 stars based on time remaining
  - Thresholds tighten with rating (two→five thresholds: 0.18→0.40 up to 0.78→0.92)
  - **Inventory Manager** reduces all thresholds by 0.06 per level
- Rating starts at 10% (`totalStars=5, maxStars=50`)
- On serve: `totalStars += stars (1-5)` and `maxStars += 5`
- On miss: `maxStars += round(maxStars × 0.25) + round(missStreak × maxStars × 0.1)`
- Floating labels: "Incredible!" (5★), "Amazing!" (4★), "Perfect!" (3★), "Great!" (2★), "Good!" (1★), "Miss!" (0★)

## Money / XP System
- Formula: `floor(totalIngs × baseTime/8 × starMoney[stars])`
  - `starMoney = [0, 0.5, 0.8, 1.1, 1.4, 1.8]`
- Money bonuses stack **additively**: wallart (+10%/lvl), outdoor (+10%/lvl), beans (+15%/lvl), lighting gives up to +5%/star/lvl
- XP curve: `20 + level × 15 + floor(level² × 0.5)`
- On level-up: `money -= nextLevelXP` (overflow carries over), game pauses, choose 1 of 3 random eligible upgrades

## Upgrades (18 total, 3 tiers each)
Any upgrade can be bought on level-up (shown 3 at random). Each stackable to level 3 (I/II/III).

### 🏰 Decor (7)
| ID | T1/T2/T3 Names | Effect per level |
|----|----------------|-----------------|
| plant | Potted Plant / Flowering Plant / Exotic Orchid | +1s per order |
| wallart | Wall Art / Gallery Wall / Masterpiece | +10% money |
| window | Window Display / Bay Window / Panoramic View | +1s per order |
| lighting | Ambient Lighting / Warm Lighting / Designer Lighting | +1s per order + star money bonus |
| outdoor | Outdoor Seating / Patio / Rooftop Terrace | +10% money |
| music | Music System / Sound System / Live Band | +1s per order |
| layout | Premium Layout / Executive Layout / Grand Layout | ×1.5/2.0/2.5 decor time |

### 👷 Employees (2)
| ID | T1/T2/T3 Names | Effect per level |
|----|----------------|-----------------|
| inventory | Inventory Manager / Inventory Analyst / Inventory Director | -6% star thresholds |
| supervisor | Shift Supervisor / Store Manager / Regional Manager | Skip order delay |

### ⚙️ Equipment (9)
| ID | T1/T2/T3 Names | Effect per level |
|----|----------------|-----------------|
| beans | Premium Beans / Single-Origin / Reserve Blend | +15% money |
| sugar_tap | Sugar Shot / Sugar Stream / Sugar Flood | +1 sugar per click |
| milk_tap | Milk Splash / Milk Pour / Milk Cascade | +1 milk per click |
| cream_tap | Cream Dollop / Cream Swirl / Cream Wave | +1 cream per click |
| choco_tap | Choco Dust / Choco Drizzle / Choco Deluge | +1 choco per click |
| syrup_tap | Syrup Drop / Syrup Stream / Syrup River | +1 syrup per click |
| cinnamon_tap | Cinnamon Dust / Cinnamon Swirl / Cinnamon Storm | +1 cinnamon per click |
| vanilla_tap | Vanilla Drop / Vanilla Pour / Vanilla Flood | +1 vanilla per click |
| honey_tap | Honey Drip / Honey Flow / Honey Cascade | +1 honey per click |

## Level Panel (right sidebar)
- **Level bar**: current level, XP progress bar (money / nextLevelXP), money/XP text
- **Active Effects**: grouped text summary — total time bonus, total money %, star money, tap upgrades per ingredient, threshold reduction, supervisor status
- **Active Upgrades**: vertical list of owned upgrades with icon, tier name, Roman numeral badge (I/II/III), and numeric description

## Level-Up Modal
- Pauses game, blurred backdrop
- Shows "⬆️ LEVEL UP!" with 3 random eligible upgrade cards
- Each card shows icon, tier name, level badge, upgrade description
- Click to pick; if overflow XP still triggers next level, chains immediately

## Keyboard
- Keys **1-9**: activate the Nth visible ingredient button in the bar

## Difficulty Scaling
- `generateOrder(rating)`: time multiplier `max(0.3, 1.0 - rating × 0.7)`, bonus `floor(rating × 3)` extra random ingredients
- `randOrder(rating)`: weighted by ingredient count, filters by minRating and ingredient minRating
- `getStarThresholds(rating)`: thresholds tighten continuously from low to high rating
- Ingredient unlocks at 25%, 40%, 45%, 50%, 55%, 60%, 65% rating

## Visual FX
- Canvas-based particle system (ambient steam)
- CSS pop/burst animations on ingredient add, order complete
- Floating labels (stars, money, tip) use two-element nesting for parabolic arc
- Stars: single label with filled stars only, size 1.4rem
- Money: `+$X` arcs upward-right; Tip: `tipped $X !!` in orange arcs upward-left
- Timer urgency pulse when low (<33%)
- Cup enter/exit bounce, ruin shake on wrong ingredient
- Pause overlay with blur backdrop

## Hint Log
- Chat-style scrollable log above counter, below cups
- 3-row height, max 3 entries, auto-scrolls
- Older entries fade: `:nth-last-child(3)` at 0.4, `:nth-last-child(2)` at 0.7
- Shows order complete, miss, wrong ingredient, upgrade info

## Profiler
- Toggle with 'P' key
- Shows FPS, frame min/avg/max ms, timer/orderUI ms/frame, frame count
- First frame of animate loop skipped to avoid delta spike from `lastTime = 0`

## Tech
- Vanilla JS (no template literals, no arrow functions — must pass `new Function(code)` check)
- CSS custom properties, flexbox, CSS animations
- SVG for circular timer arc (`stroke-dasharray`)
- Web Audio API
- Canvas 2D for particles
- localStorage for save/load (`coffeeConveyor` key) — auto-saves every 5 seconds
- Save migration handles old boolean upgrade values and all prior key formats
- http-server for local dev

## Key Functions
- `getRating()` → returns `totalStars / maxStars` (0-1)
- `generateOrder(rating)` → creates scaled order object with time, ingredients, bonus, decor time
- `randOrder(rating)` → picks eligible template (weighted by ingredient count)
- `getStarThresholds(rating)` → `{five, four, three, two}` thresholds
- `getNextLevelXP(level)` → XP required for next level
- `showLevelUpChoices()` → pauses game and shows 3 upgrade cards
- `pickUpgradeChoice(id)` → applies upgrade, resumes, chains if overflow
- `renderLevelBar()` → updates level display, XP bar, effects panel, owned upgrades
- `renderActiveEffects()` → grouped text summary of all active upgrade effects
- `renderOwnedUpgrades()` → renders owned upgrade grid
- `renderIngredientButtons()` → rebuilds button bar based on current rating
- `showFloatingStars(stars, text, cupEl)` → animates star indicator at cup
- `showFloatingMoney(amount, cupEl)` → animates `+$X` base cost upward-right
- `showFloatingTip(amount, cupEl)` → animates `tipped $X !!` upward-left (orange)
- `updateTimerArc(a)` → updates circular SVG arc position and color
- `pushHint(msg)` → adds message to hint log
- `buildCoffeeShopBackground()` → builds all furniture, applies wall color and diamond pattern
