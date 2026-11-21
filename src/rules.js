// Pure game math. No DOM: every function reads the `game` object and returns a value.
import { MUTATIONS, MUTATION } from './data/mutations.js'
import { REBIRTH } from './data/rebirth.js'
import { COLONIES } from './data/colonies.js'
import { STAGES } from './data/stages.js'

export const REBIRTH_REQ = 10e12
export const OFFLINE_CAP = 12 * 3600

// ---- Rebirth mutations ----
export function perks(game) {
  return REBIRTH.filter(r => game.owned.includes(r.id))
}

// Multiplies `start` by the `key` value of every owned rebirth mutation
export function bonus(game, key, start = 1) {
  return perks(game).reduce((m, r) => m * (r[key] ?? 1), start)
}

// The `key` value of the owned rebirth mutation that has one, or 0
export function perk(game, key) {
  return perks(game).find(r => r[key] !== undefined)?.[key] ?? 0
}

// ---- Mutation curves ----
export function clickPowerAt(lvl) {
  let p = 1
  for (let l = 1; l <= lvl; l++) p += 2 + Math.floor(l * 0.5)
  return p * 2 ** Math.floor(lvl / 25)
}

export function autoPowerAt(lvl) {
  let p = 0
  for (let l = 1; l <= lvl; l++) p += 1 + Math.floor(l * 0.8)
  return p * 2 ** Math.floor(lvl / 25)
}

// ---- One colony ----
const lv = (game, i) => game.colonies[i].levels

export const totalLevels = (game, i) => MUTATIONS.reduce((t, m) => t + lv(game, i)[m.key], 0)
export const cellCount = (game, i) => 1 + lv(game, i).extraCells
export const clickCooldown = (game, i) => Math.max(50, 300 - lv(game, i).clickCooldown * 25)
export const autoCooldown = (game, i) => Math.max(100, 1000 - lv(game, i).autoClickCooldown * 75)
export const critChance = (game, i) => lv(game, i).critChance * 0.5
export const autoCritChance = (game, i) => lv(game, i).autoCritChance * 0.5

export function stageIndex(total) {
  return STAGES.findLastIndex(s => total >= s.min)
}

export const stageOf = (game, i) => stageIndex(totalLevels(game, i))

// Evolutionary Leap: ×1.1 for every stage reached (a stage's own leapMult replaces the 1.1)
const LEAP = STAGES.map((_, i) => STAGES.slice(1, i + 1).reduce((m, s) => m * (s.leapMult || 1.1), 1))

function stageMult(game, i) {
  return perk(game, 'leap') ? LEAP[stageOf(game, i)] : 1
}

function allMult(game) {
  return bonus(game, 'all') * (1 + perk(game, 'echo') * game.earned)
}

export function critMult(game, i) {
  return (10 + lv(game, i).critPower * 5) * bonus(game, 'crit')
}

// DNA that ONE cell makes per click
export function clickYield(game, i) {
  const L = lv(game, i)
  const absorbed = autoPowerAt(L.autoClickPower) * L.endocyticUptake * 0.1
  return (clickPowerAt(L.clickPower) + absorbed) * (1 + L.ribosomalSynthesis * 0.25) *
    COLONIES[i].yieldScale * allMult(game) * bonus(game, 'click') * stageMult(game, i)
}

// DNA that ONE cell makes per auto tick
export function autoYield(game, i) {
  const L = lv(game, i)
  return autoPowerAt(L.autoClickPower) * (1 + L.chloroplastSymbiosis * 0.25) *
    COLONIES[i].yieldScale * allMult(game) * bonus(game, 'auto') * stageMult(game, i)
}

export function autoPerSecond(game, i) {
  const c = game.colonies[i]
  if (!c.unlocked || game.pending || c.levels.autoClickPower === 0) return 0
  return autoYield(game, i) * cellCount(game, i) * (1000 / autoCooldown(game, i))
}

export function totalPerSecond(game) {
  return game.colonies.reduce((sum, c, i) => sum + autoPerSecond(game, i), 0)
}

// ---- Mutations ----
export function reqLevel(game, n) {
  return perk(game, 'halfReq') ? Math.ceil(n / 2) : n
}

export function isRevealed(game, i, key) {
  const c = game.colonies[i], req = MUTATION[key].req
  if (!c.unlocked) return key === 'clickPower'
  if (!req || c.levels[key] > 0) return true
  return c.levels[req[0]] >= reqLevel(game, req[1])
}

export function isMaxed(game, i, key) {
  const max = MUTATION[key].max
  return max !== undefined && lv(game, i)[key] >= max
}

export function mutationCost(game, i, key) {
  const m = MUTATION[key], L = lv(game, i)
  let c = m.baseCost * m.mult ** L[key] * COLONIES[i].costScale * (1 - L.telomerase * 0.03)
  c = bonus(game, 'price', c)
  if (key === 'extraCells') c *= bonus(game, 'cellPrice')
  return Math.floor(c)
}

// ---- Stages ----
// Share of the way from this stage to the next (always 1 on a final stage)
export function stageProgress(game, i) {
  const total = totalLevels(game, i), idx = stageIndex(total), st = STAGES[idx]
  if (st.finalLabel || idx === STAGES.length - 1) return 1
  const from = st.min, to = STAGES[idx + 1].min
  return Math.max(0, Math.min(1, (total - from) / (to - from)))
}

// ---- Rebirth ----
// RNA for the DNA held right now, before adding the fraction carried over from last time
export function rebirthGain(game) {
  return game.money >= REBIRTH_REQ ? Math.sqrt(game.money / REBIRTH_REQ) : 0
}

// Dormant Spores: DNA earned while the game was closed
export function offlineGain(game, seconds) {
  const share = perk(game, 'offline')
  const secs = Math.min(OFFLINE_CAP, Math.max(0, seconds))
  if (!share || game.pending || secs < 30) return 0
  return totalPerSecond(game) * secs * share
}
