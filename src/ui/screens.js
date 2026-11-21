// One screen per colony, holding its stage badge and its cells
import { $, el } from './dom.js'
import { COLONIES } from '../data/colonies.js'

const track = $('#screen-track')

export const views = COLONIES.slice(0, 1).map((c, i) => {
  const screen = el('section', 'screen')
  const content = el('div', 'screen-content', '<div class="stage-badge"><span class="badge-label">Stage 1: Procaryotic Sphere</span></div>')
  const area = el('div', 'cell-container')
  const mass = el('div', 'cell-mass', '<div class="cell-sphere" style="position:absolute;left:-100px;top:-100px"></div>')
  area.appendChild(mass)
  content.appendChild(area)
  screen.appendChild(content)
  track.appendChild(screen)
  return { i, screen, area, mass }
})
