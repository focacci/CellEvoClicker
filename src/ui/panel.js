// The side panel and its ‹ Mutations › switcher. The arrows loop through the tabs both ways.
import { $, setText } from './dom.js'
import { mutationsTab, renderMutations } from './mutationsTab.js'
import { rebirthTab, renderRebirthTab } from './rebirthTab.js'
import { achievementsTab, renderAchievements } from './achievementsTab.js'
import { themesTab, renderThemes } from './themesTab.js'
import { statsTab, renderStats } from './statsTab.js'
import { game } from '../state.js'

const TABS = ['mutations', 'achievements', 'themes', 'stats']
const PAGES = {
  mutations: { title: 'Mutations', el: mutationsTab, render: () => renderMutations(game.view) },
  rebirth: { title: 'Rebirth Mutations', el: rebirthTab, render: renderRebirthTab },
  achievements: { title: 'Achievements', el: achievementsTab, render: renderAchievements },
  themes: { title: 'Themes', el: themesTab, render: renderThemes },
  stats: { title: 'Stats', el: statsTab, render: renderStats }
}
const panel = $('#upgrades-pane'), list = $('#upgrades-container'), title = $('#pane-title')
let tab = 0
let shown = null

list.append(...Object.values(PAGES).map(p => p.el))
$('#tab-prev').addEventListener('click', () => { tab = (tab + TABS.length - 1) % TABS.length })
$('#tab-next').addEventListener('click', () => { tab = (tab + 1) % TABS.length })

// A dot on the arrows until the player looks at a newly earned achievement
export function markNew() {
  for (const arrow of title.querySelectorAll('.tab-arrow')) arrow.classList.add('has-new')
}

// While the cell is dormant after a rebirth, the Mutations slot shows Rebirth Mutations
function page() {
  const id = TABS[tab]
  return PAGES[id === 'mutations' && game.pending ? 'rebirth' : id]
}

export function renderPanel() {
  // A locked colony shows Mutations (greyed out), and the panel stays on Mutations afterwards
  const locked = !game.pending && !game.colonies[game.view].unlocked
  if (locked) tab = 0
  const p = page()
  if (p.el !== shown) {
    shown?.classList.remove('active')
    p.el.classList.add('active')
    list.scrollTop = 0
    shown = p.el
  }
  setText($('#pane-title-text'), p.title)
  title.classList.toggle('rebirth-mode', p === PAGES.rebirth)
  title.classList.toggle('no-arrows', locked)
  panel.classList.toggle('greyed', locked)
  if (p === PAGES.achievements) title.querySelectorAll('.has-new').forEach(a => a.classList.remove('has-new'))
  p.render()
}
