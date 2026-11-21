// One screen per colony: its stage badge and its cell mass. renderScreens() keeps them matching the game.
import { $, el } from './dom.js'
import { measurePane } from './pane.js'
import { makeBadge, renderBadge } from './stageBadge.js'
import { toggleStageList, renderStageList } from './stageList.js'
import { buildMass, syncMass, layout } from '../cells/mass.js'
import { COLONIES } from '../data/colonies.js'
import { cellCount, stageOf } from '../rules.js'
import { game } from '../state.js'

const track = $('#screen-track')

export const views = COLONIES.map((c, i) => {
  const screen = el('section', 'screen'), content = el('div', 'screen-content'), area = el('div', 'cell-container')
  const v = { i, screen, content, ...buildMass(area) }
  v.badge = makeBadge(() => toggleStageList(v))
  content.append(v.badge, area)
  screen.appendChild(content)
  track.appendChild(screen)
  return v
})

export function renderScreens() {
  for (const v of views) {
    syncMass(v, cellCount(game, v.i), stageOf(game, v.i))
    renderBadge(v)
  }
  renderStageList()
}

addEventListener('resize', () => {
  measurePane()
  for (const v of views) {
    v.badgeBox = null
    layout(v)
  }
})
