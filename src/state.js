// The one `game` object. Its fields are exactly what gets saved (cellEvoClicker.save.v2).
import { COLONIES } from './data/colonies.js'
import { MUTATIONS } from './data/mutations.js'

function zeroLevels() {
  return Object.fromEntries(MUTATIONS.map(m => [m.key, 0]))
}

function newColonies() {
  return COLONIES.map((c, i) => ({ unlocked: i === 0, levels: zeroLevels() }))
}

export function newGame() {
  return {
    v: 2, t: 0,
    money: 0, rdna: 0, frac: 0, earned: 0, rebirths: 0,
    owned: [], pending: false, view: 0,
    colonies: newColonies(),
    played: 0, totals: { clicks: 0, crits: 0, dna: 0 },
    achievements: [], themes: [], theme: 'classic'
  }
}

// Rebirth: this cycle's DNA, mutations and colonies reset. RNA, rebirth mutations,
// time played, totals, achievements and themes are kept.
export function newCycle(game) {
  game.money = 0
  game.pending = true
  game.view = 0
  game.colonies = newColonies()
}

export const game = newGame()
