// Achievements tab: every achievement by tier, with a progress bar until it is earned
import { el, setText, setStyle } from './dom.js'
import { ACHIEVEMENTS } from '../data/achievements.js'
import { THEMES } from '../data/themes.js'
import { measure } from '../achievements.js'
import { game } from '../state.js'

const TIERS = { easy: 'Easy', medium: 'Medium', hard: 'Hard', named: 'Legendary' }
const STAR = '<svg class="ach-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>'

export const achievementsTab = el('div', 'upgrade-group')
const summary = achievementsTab.appendChild(el('div', 'ach-summary'))
const rows = {}

for (const tier in TIERS) {
  achievementsTab.appendChild(el('h4', 'ach-tier', TIERS[tier]))
  for (const a of ACHIEVEMENTS.filter(a => a.tier === tier)) {
    const theme = THEMES.find(t => t.achievement === a.id)
    const reward = theme ? `<div class="ach-reward">Unlocks the ${theme.name} theme</div>` : ''
    const row = achievementsTab.appendChild(el('div', 'ach tier-' + tier, STAR +
      `<div class="ach-info"><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div>${reward}<div class="ach-bar"><i></i></div></div>`))
    rows[a.id] = { row, bar: row.querySelector('.ach-bar > i') }
  }
}

export function renderAchievements() {
  const stats = measure(game)
  setText(summary, `${game.achievements.length} / ${ACHIEVEMENTS.length} unlocked`)
  for (const a of ACHIEVEMENTS) {
    const done = game.achievements.includes(a.id)
    rows[a.id].row.classList.toggle('done', done)
    setStyle(rows[a.id].bar, 'width', (done ? 100 : Math.min(100, stats[a.stat] / a.goal * 100)).toFixed(1) + '%')
  }
}
