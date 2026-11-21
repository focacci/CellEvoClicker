// Clicking a colony's cells
import { game } from '../state.js'
import { click } from '../actions.js'
import { clickCooldown } from '../rules.js'
import { nearestCell } from '../cells/mass.js'
import { bounce } from '../cells/bounce.js'
import { views } from './screens.js'
import { pane } from './pane.js'
import { pop } from './header.js'

for (const v of views) {
  v.area.addEventListener('click', (e) => clickColony(v, e.clientX - pane.left, e.clientY - pane.top))
}

// x, y: where the click landed on the pane
export function clickColony(v, x, y) {
  if (game.view !== v.i) return
  const hit = click(game, v.i, performance.now())
  if (!hit) return
  bounce(v, nearestCell(v, x, y), clickCooldown(game, v.i))
  if (hit.crit) pop()
  coolDown(v)
}

// The whole mass dims until the next click is allowed
function coolDown(v) {
  v.mass.classList.add('cooldown')
  clearTimeout(v.coolTimer)
  v.coolTimer = setTimeout(() => v.mass.classList.remove('cooldown'), clickCooldown(game, v.i))
}
