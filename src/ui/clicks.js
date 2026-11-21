// Clicking a colony's cells, and showing what clicks and auto clicks earn
import { game } from '../state.js'
import { click, wake } from '../actions.js'
import { clickCooldown } from '../rules.js'
import { STAGES } from '../data/stages.js'
import { nearestCell, cellPoint } from '../cells/mass.js'
import { bounce } from '../cells/bounce.js'
import { COLORS, label, addFloater, addRipple } from '../fx/effects.js'
import { playClick } from '../audio/sfx.js'
import { views } from './screens.js'
import { pane } from './pane.js'
import { pop } from './header.js'
import { modalOpen } from './modal.js'
import { spawnRing } from '../cells/junctions.js'
import { saveGame } from '../save.js'

const pressSound = (v) => { if (game.colonies[v.i].unlocked || game.pending) playClick() }

for (const v of views) {
  v.area.addEventListener('pointerdown', () => pressSound(v))
  v.area.addEventListener('click', (e) => clickColony(v, e.clientX - pane.left, e.clientY - pane.top))
}

// Space clicks the cell: one click per press (holding it down doesn't repeat) and the page doesn't scroll.
// Space on a focused button, switch, slider or stage badge still works the normal way.
addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || modalOpen() || e.target.closest('button, input, select, textarea, a, [role=button]')) return
  e.preventDefault()
  if (e.repeat) return
  const v = views[game.view], p = cellPoint(v, v.cells[0])
  pressSound(v)
  clickColony(v, p.x, p.y)
})

// x, y: where the click landed on the pane
export function clickColony(v, x, y) {
  if (pane.sliding || game.view !== v.i) return
  if (game.pending) return wakeUp(v)
  const hit = click(game, v.i, performance.now())
  if (!hit) return
  const clicked = nearestCell(v, x, y)
  showYield(v, hit.perCell, hit.crit ? COLORS.crit : COLORS.click, clicked, x, y)
  bounce(v, clicked, clickCooldown(game, v.i))
  addRipple(v.i, x, y, hit.crit ? COLORS.crit : STAGES[v.stage].colors[0], hit.crit)
  if (hit.crit) pop()
  coolDown(v)
}

// The dormant cell after a rebirth: clicking it starts the next cycle
function wakeUp(v) {
  if (!wake(game)) return
  bounce(v, -1, 300)
  v.cells.forEach(c => spawnRing(v, c))
  saveGame(game)
}

// Auto clicks on the colony on screen float up in red (orange for crits, which also pop the DNA counter).
// Not while catching up after the tab was hidden.
export function showAutoTick(i, hit) {
  if (!hit || hit.ticks > 5 || game.view !== i || document.hidden || pane.sliding) return
  showYield(views[i], hit.perCell, hit.crit ? COLORS.autoCrit : COLORS.auto)
  if (hit.crit) pop()
}

// What ONE cell made floats up over every cell (over the click point for the clicked one)
function showYield(v, amount, color, clicked = -1, x = 0, y = 0) {
  const tag = label(amount, color)
  v.cells.forEach((c, i) => {
    const p = cellPoint(v, c), jiggle = () => Math.random() * 40 - 20
    if (i === clicked) addFloater(v.i, x, y - 12, tag)
    else addFloater(v.i, p.x + jiggle(), p.y + jiggle(), tag)
  })
}

// The whole mass dims until the next click is allowed
function coolDown(v) {
  v.mass.classList.add('cooldown')
  clearTimeout(v.coolTimer)
  v.coolTimer = setTimeout(() => v.mass.classList.remove('cooldown'), clickCooldown(game, v.i))
}
