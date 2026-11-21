// The side panel: Mutations, or Rebirth Mutations while the cell is dormant
import { $, setText } from './dom.js'
import { mutationsTab, renderMutations } from './mutationsTab.js'
import { rebirthTab, renderRebirthTab } from './rebirthTab.js'
import { game } from '../state.js'

const panel = $('#upgrades-pane'), list = $('#upgrades-container'), title = $('#pane-title')
list.append(mutationsTab, rebirthTab)
let shown = null

export function renderPanel() {
  const tab = game.pending ? rebirthTab : mutationsTab
  if (tab !== shown) {
    shown?.classList.remove('active')
    tab.classList.add('active')
    list.scrollTop = 0
    shown = tab
  }
  setText(title, game.pending ? 'Rebirth Mutations' : 'Mutations')
  title.classList.toggle('rebirth-mode', game.pending)
  // Viewing a colony that hasn't been bought yet greys out the whole panel
  panel.classList.toggle('greyed', !game.pending && !game.colonies[game.view].unlocked)
  if (game.pending) renderRebirthTab()
  else renderMutations(game.view)
}
