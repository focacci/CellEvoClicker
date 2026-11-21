// Clicking a colony's cells
import { game } from '../state.js'
import { click } from '../actions.js'
import { clickCooldown } from '../rules.js'
import { views } from './screens.js'
import { pop } from './header.js'

for (const v of views) v.area.addEventListener('click', () => clickColony(v))

export function clickColony(v) {
  if (game.view !== v.i) return
  const hit = click(game, v.i, performance.now())
  if (!hit) return
  if (hit.crit) pop()
  coolDown(v)
}

// The whole mass dims until the next click is allowed
function coolDown(v) {
  v.mass.classList.add('cooldown')
  clearTimeout(v.coolTimer)
  v.coolTimer = setTimeout(() => v.mass.classList.remove('cooldown'), clickCooldown(game, v.i))
}
