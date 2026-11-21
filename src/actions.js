// The ONLY code that changes `game`. Each action returns what happened, so the UI can show it.
import * as R from './rules.js'
import { COLONIES } from './data/colonies.js'

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
