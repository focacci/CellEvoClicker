// The ONLY code that changes `game`. Each action returns what happened, so the UI can show it.
import * as R from './rules.js'
import { COLONIES } from './data/colonies.js'
import { REBIRTH } from './data/rebirth.js'
import { newCycle } from './state.js'

// When each colony last clicked / auto-ticked (ms). Not saved.
export const clocks = { click: COLONIES.map(() => -Infinity), auto: COLONIES.map(() => performance.now()) }

function earn(game, amount) {
  game.money += amount
  game.totals.dna += amount
}

// A manual click: every cell in the colony pays out. Returns null while cooling down.
export function click(game, i, now, roll = Math.random() * 100) {
  if (game.pending || !game.colonies[i].unlocked) return null
  if (now - clocks.click[i] < R.clickCooldown(game, i)) return null
  clocks.click[i] = now
  const chance = R.critChance(game, i)
  const crit = chance > 0 && roll < chance
  const perCell = R.clickYield(game, i) * (crit ? R.critMult(game, i) : 1)
  earn(game, perCell * R.cellCount(game, i))
  game.totals.clicks++
  if (crit) game.totals.crits++
  return { perCell, crit }
}

// Auto clicks are time based, so they keep up when frames are skipped or the tab is hidden
export function autoTick(game, i, now, random = Math.random) {
  if (R.autoPerSecond(game, i) === 0) { clocks.auto[i] = now; return null }
  const cd = R.autoCooldown(game, i)
  const ticks = Math.floor((now - clocks.auto[i]) / cd)
  if (ticks < 1) return null
  clocks.auto[i] = ticks > 100000 ? now : clocks.auto[i] + ticks * cd
  const base = R.autoYield(game, i), cells = R.cellCount(game, i)
  const p = R.autoCritChance(game, i) / 100, cm = R.critMult(game, i)
  if (ticks > 5) { // catching up after the tab was hidden: pay the average instead of rolling each tick
    earn(game, base * cells * ticks * (1 + p * (cm - 1)))
    return { ticks }
  }
  let total = 0, perCell = base, crit = false
  for (let k = 0; k < ticks; k++) {
    crit = p > 0 && random() < p
    perCell = base * (crit ? cm : 1)
    total += perCell
    if (crit) game.totals.crits++
  }
  earn(game, total * cells)
  return { ticks, perCell, crit }
}

export function buyMutation(game, i, key) {
  if (!game.colonies[i].unlocked || game.pending || R.isMaxed(game, i, key)) return false
  const cost = R.mutationCost(game, i, key)
  if (game.money < cost) return false
  game.money -= cost
  game.colonies[i].levels[key]++
  return true
}

// Starting levels from rebirth mutations (Reflex Imprint, Budding Instinct, Hereditary Strength)
function startColony(game, i) {
  const levels = game.colonies[i].levels
  for (const r of R.perks(game)) {
    for (const key in r.startLevels) levels[key] = Math.max(levels[key], r.startLevels[key])
  }
}

export function unlockColony(game, i) {
  const c = game.colonies[i], cost = COLONIES[i].unlockCost
  if (c.unlocked || game.pending || game.money < cost) return false
  game.money -= cost
  c.unlocked = true
  startColony(game, i)
  return true
}

// Whole RNA is paid out; the leftover fraction carries over to the next rebirth. Returns the RNA earned.
export function rebirth(game) {
  if (game.pending || game.money < R.REBIRTH_REQ) return 0
  const total = R.rebirthGain(game) + game.frac
  const whole = Math.floor(total)
  game.frac = Math.max(0, total - whole)
  game.rdna += whole
  game.earned += whole
  game.rebirths++
  newCycle(game)
  return total
}

// Clicking the dormant cell starts the next cycle
export function wake(game) {
  if (!game.pending) return false
  game.pending = false
  game.money += R.perk(game, 'startDna')
  for (const r of R.perks(game)) if (r.keepColony) game.colonies[r.keepColony].unlocked = true
  game.colonies.forEach((c, i) => { if (c.unlocked) startColony(game, i) })
  return true
}

export function buyRebirth(game, id) {
  const r = REBIRTH.find(r => r.id === id)
  if (!r || game.owned.includes(id) || game.rdna < r.cost) return false
  game.rdna -= r.cost
  game.owned.push(id)
  return true
}

// Dormant Spores: DNA made while the game was closed
export function collectOffline(game, now = Date.now()) {
  const secs = game.t ? Math.min(R.OFFLINE_CAP, (now - game.t) / 1000) : 0
  const gain = R.offlineGain(game, secs)
  earn(game, gain)
  return { gain, secs }
}
