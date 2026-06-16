# Coffee Conveyor — Order Fulfillment Game

Isometric coffee conveyor order-fulfillment game. Pure vanilla HTML/CSS/JS, no build step.

## Quick Start
```
npm run dev
```
Opens at `http://localhost:3000`

## Files
- `index.html` — Main game (header, stats, conveyor scene, order panel with timer & warp button, dynamic ingredient bar, upgrade shop)
- `style.css` — All styles (conveyor, cups, circular timer, pause overlay, floating stars, ingredient bar, upgrade shop, animations)
- `script.js` — Game logic (orders, ingredients, circular timer, cup cycle, upgrades, espresso shot, time warp, safety net, floating stars, persistence)
- `conveyor-demo.html` — Standalone demo (outdated, kept for reference)
- `AGENTS.md` — Session context for AI continuation

## Gameplay
- Each cup is a **customer order** with specific ingredient requirements and a circular countdown timer
- Only the **center cup** is active; side cups show upcoming orders
- Click **ingredient buttons** to add ingredients to the active order; buttons dynamically appear/disappear based on rating
- Complete all ingredient requirements before the timer runs out → order served with 0-3 stars
- Timer expires → order missed → rating penalty
- Rating = `totalStars / maxStars` (displayed as percentage + ★★★)
- Wrong ingredient resets the same cup with a new order (no miss penalty) — unless Safety Net upgrade blocks it
- "Served" coffees are currency for buying upgrades from the shop
- Rating-based difficulty scaling: higher rating = shorter times, bonus ingredients, stricter star thresholds, new ingredient unlocks

## Conveyor
- Isometric belt: `scale(1, 0.5) rotate(-49deg)` on a 520x80px rectangle
- 5 cups on a diagonal from bottom-left to top-right
- 10 distinct cup designs (`.d-0` through `.d-9`) with color-matched 3px borders
- Active center cup is larger (scale 1.0) with pulse glow; side cups are smaller (scale 0.75)
- Coffee fill rises in the cup as ingredients are added (percentage-based)
- Steam particles appear while ingredients are being added

## Order System
- **32 order templates** (Black Coffee, Espresso, Latte, Cappuccino, Mocha, Macchiato, Affogato, Irish Coffee, Cold Brew, Americano, Flat White, Con Panna, Ristretto, Cortado, Red Eye, Vienna, Frappe, Latte Macchiato, Cafe au Lait, Cafe Bombon, Egg Coffee, Galao, Maple Latte, Syrup Americano, Cinnamon Cappuccino, Cinnamon Mocha, Vanilla Dream, Vanilla Macchiato, Honey Bliss, Spiced Honey)
- Newer templates have `minRating` thresholds and are only available at sufficient rating
- Each order has required ingredient counts (e.g., Coffee: 2, Milk: 1)
- Timer counts down in real-time via `requestAnimationFrame`
- Circular SVG clock arc depletes (green→yellow→red); shows "✓" when complete
- Pause button freezes game loop and interaction, dims scene with overlay

## Ingredients (9 total, 5 base + 4 unlockable)
| Ingredient | Icon | Unlocks At |
|-----------|------|-----------|
| Coffee | ☕ | Always |
| Sugar | 🍚 | Always |
| Milk | 🥛 | Always |
| Cream | 🍦 | Always |
| Choco | 🍫 | Always |
| Syrup | 🍁 | Rating ≥ 25% |
| Cinnamon | 🌿 | Rating ≥ 50% |
| Vanilla | 🌼 | Rating ≥ 75% |
| Honey | 🍯 | Rating ≥ 90% |

- Each ingredient button has a distinct color and icon
- Clicking adds `clickPower` units of that ingredient (capped at requirement)
- Buttons dynamically re-render when rating changes (only show unlocked ingredients)
- Event delegation on `#ingredientBar` for dynamically created buttons
- Error feedback for: ingredient not needed, ingredient already full, or busy/timed out order

## Star Rating
- Per-order: 0-3 stars based on time remaining when completed
  - 3 stars: remaining ≥ ~66% (threshold tightens with rating)
  - 2 stars: remaining ≥ ~33%
  - 1 star: remaining > 0%
- Total rating = `totalStars / maxStars × 100` — displayed as percentage + ★☆☆ style stars
- **Golden Timer** upgrade reduces star thresholds (easier to get 3★)
- **Double Stars** upgrade multiplies both `totalStars` and `maxStars` (no rating inflation)
- **Floating star indicator** — "Perfect!" (3★), "Great!" (2★), "Good!" (1★), "Miss!" (0★) animates upward at cup position

## Upgrades (8 total)
| ID | Name | Effect | Base Cost |
|----|------|--------|-----------|
| grinder | Sharp Grinder | +1 per tap | 10 |
| quick | Quick Hands | +3s per order | 30 |
| shot | Espresso Shot | Auto-fill 1 ingredient/level | 80 |
| golden | Golden Timer | Easier 3-star rating | 150 |
| net | Safety Net | 1 free mistake per order | 300 |
| warp | Time Warp | Freeze timer 5s once/order | 500 |
| double | Double Stars | ×2 stars earned | 800 |
| master | Master Blend | Timer 25% slower/level | 1500 |

**Upgrade mechanics:**
- Sharp Grinder: only click-boost upgrade
- Quick Hands: only time-boost upgrade
- Espresso Shot: when a cup enters active position, auto-fills `level` random missing ingredients
- Golden Timer: reduces 3-star threshold by 0.08 per level, 2-star by 0.05 per level
- Safety Net: blocks first wrong ingredient per order (shield icon via hint text), consumed on use
- Time Warp: button appears in order panel when owned & unused; freezes timer for 5 seconds
- Double Stars: multipliers apply equally to both numerator and denominator (no rating inflation)
- Master Blend: timer runs at `(1 - level × 0.25)` speed, minimum 10%
- Cost scaling: `baseCost × 1.15^level`

## Sound
- Web Audio API for sound effects (pop, ding, complete, error)
- Toggle via sound button in header
- Setting persisted separately (`coffeeSound` key in localStorage)

## Difficulty Scaling
- `generateOrder(rating)`: time multiplier `max(0.5, 1.0 - rating × 0.4)`, up to `floor(rating × 2)` bonus ingredients
- `getStarThresholds(rating)`: three-star threshold tightens from 0.66 up to 0.9, two-star from 0.33 up to 0.7
- Ingredient unlocks at 25%, 50%, 75%, 90% rating thresholds
- Templates with `minRating` are filtered out until rating is sufficient

## Visual FX
- Canvas-based particle system (ambient steam particles)
- CSS pop/burst animations on ingredient add
- Order complete burst particles with "Served!" float text
- Floating star indicator (Perfect!/Great!/Good!/Miss! with ★★★ on order events)
- Timer urgency pulse when low
- Belt stripe scroll and pulse on cup advance
- Cup enter/exit bounce animations and ruin shake on wrong ingredient
- Ingredient bar with animated glow pulse
- Pause overlay with blur backdrop

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
- `generateOrder(rating)` → creates scaled order object with time, ingredients, bonus
- `getStarThresholds(rating)` → `{three, two}` thresholds
- `applyEspressoShot(a)` → auto-fills missing ingredients on a cup
- `activateTimeWarp()` → freezes active timer for 5 seconds
- `showFloatingStars(stars, text, cupEl)` → animates star indicator at cup
- `renderIngredientButtons()` → rebuilds button bar based on current rating
- `randOrder(rating)` → picks eligible template (filters by minRating)
- `updateTimerArc(a)` → updates circular SVG arc position and color

## Cup Designs
- d-0: White ceramic, d-1: Red mug, d-2: Blue dots, d-3: Green matte, d-4: Yellow stripe
- d-5: Dark ceramic, d-6: Terracotta, d-7: Pink diamond, d-8: Turquoise wave, d-9: Purple speckle
