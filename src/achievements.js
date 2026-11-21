// Measures progress and awards achievements. They survive rebirth; only a full reset clears them.
import { ACHIEVEMENTS } from './data/achievements.js'
import { STAGES } from './data/stages.js'
import * as R from './rules.js'

// Every stat an achievement can ask about, measured from the game right now
export function measure(game) {
  const unlocked = game.colonies.map((c, i) => i).filter(i => game.colonies[i].unlocked)
  const stages = unlocked.map(i => R.stageOf(game, i) + 1)
  return {
    clicks: game.totals.clicks, crits: game.totals.crits, dna: game.totals.dna,
    mostLevels: Math.max(...unlocked.map(i => R.totalLevels(game, i))),
    mostCells: Math.max(...unlocked.map(i => R.cellCount(game, i))),
    bestStage: Math.max(...stages),
    transcended: stages.filter(s => s === STAGES.length).length,
    colonies: unlocked.length,
    rebirths: game.rebirths, rna: game.earned, perks: game.owned.length, played: game.played
  }
}

// Awards everything newly reached, and returns those achievements (for the toasts)
export function checkAchievements(game) {
  const stats = measure(game)
  const reached = ACHIEVEMENTS.filter(a => !game.achievements.includes(a.id) && stats[a.stat] >= a.goal)
  for (const a of reached) game.achievements.push(a.id)
  return reached
}
