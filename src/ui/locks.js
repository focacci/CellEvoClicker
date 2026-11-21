// The padlock over Colony II and III: shows the price, shakes if you can't afford it,
// and springs open when you buy the colony
import { el, replay } from './dom.js'
import { DNA_ICON, LOCK_ICON } from './icons.js'
import { views } from './screens.js'
import { pane } from './pane.js'
import { spawnRing } from '../cells/junctions.js'
import { COLONIES } from '../data/colonies.js'
import { unlockColony } from '../actions.js'
import { saveGame } from '../save.js'
import { playTink } from '../audio/sfx.js'
import { long } from '../format.js'
import { game } from '../state.js'

for (const v of views.slice(1)) {
  const name = COLONIES[v.i].name
  v.overlay = el('div', 'lock-overlay', `<button class="lock-btn" type="button" aria-label="Unlock ${name}">${LOCK_ICON}` +
    `<span class="lock-price">${DNA_ICON}${long(COLONIES[v.i].unlockCost, true)}</span><span class="lock-caption">Unlock ${name}</span></button>`)
  v.lockBtn = v.overlay.firstChild
  v.lockBtn.addEventListener('click', () => unlock(v))
  v.screen.appendChild(v.overlay)
  setLocked(v, true)
}

// Without the animation: loading a save, a rebirth, or a colony kept by a rebirth mutation
function setLocked(v, locked) {
  v.locked = locked
  v.screen.classList.toggle('locked', locked)
  v.overlay.classList.toggle('gone', !locked)
  v.overlay.classList.toggle('removed', !locked)
  v.lockBtn.classList.remove('unlocking', 'denied')
}

export function renderLocks() {
  for (const v of views.slice(1)) {
    const locked = !game.colonies[v.i].unlocked
    if (locked !== v.locked && !v.unlocking) setLocked(v, locked)
    v.lockBtn.classList.toggle('affordable', !game.pending && game.money >= COLONIES[v.i].unlockCost)
  }
}

// The shackle springs open, then the grey drains away
function unlock(v) {
  if (v.unlocking || pane.sliding) return
  if (!unlockColony(game, v.i)) return replay(v.lockBtn, 'denied')
  playTink()
  saveGame(game)
  v.unlocking = true
  v.lockBtn.classList.add('unlocking')
  setTimeout(() => {
    v.overlay.classList.add('gone')
    v.screen.classList.remove('locked')
    v.cells.forEach(c => spawnRing(v, c))
  }, 520)
  setTimeout(() => {
    setLocked(v, false)
    v.unlocking = false
  }, 1000)
}
