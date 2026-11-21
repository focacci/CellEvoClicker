// Checks for new achievements twice a second: a gold toast for each, and a dot on the panel arrows
import { toast } from './toast.js'
import { markNew } from './panel.js'
import { checkAchievements } from '../achievements.js'
import { game } from '../state.js'

let last = -Infinity

export function checkAwards(now) {
  if (now - last < 500) return
  last = now
  const reached = checkAchievements(game)
  if (!reached.length) return
  markNew()
  // An old save can earn many at once: then one toast says how many
  if (reached.length > 3) toast(`🏆 ${reached.length} achievements unlocked!`, 'gold')
  else for (const a of reached) toast(`🏆 Achievement unlocked: <b>${a.name}</b>`, 'gold')
}
