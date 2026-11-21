// The stage list that opens from a stage badge. Reached stages open a short biology note.
import { $, el } from './dom.js'
import { chevron } from './icons.js'
import { STAGES } from '../data/stages.js'
import { stageOf } from '../rules.js'
import { commas } from '../format.js'
import { game } from '../state.js'

const menu = el('div', 'stage-menu')
menu.setAttribute('role', 'list')
menu.addEventListener('pointerdown', (e) => e.stopPropagation())
$('#simulation-pane').appendChild(menu) // above the floating DNA numbers
let openFor = null // the colony view whose list is open

const items = STAGES.map((st, i) => {
  const entry = el('div', 'stage-entry' + (st.galaxy ? ' galaxy' : ''))
  entry.style.setProperty('--stage-color', st.colors[1])
  const row = el('div', 'stage-item', `<span class="si-num">${i + 1}</span>` +
    `<span class="si-dot" style="background:radial-gradient(circle at 30% 30%, ${st.colors[0]}, ${st.colors[1]})"></span>` +
    `<span class="si-name"></span><span class="si-req">${st.min ? commas(st.min) + ' lvls' : 'Start'}</span>` + chevron('si-chev'))
  const about = st.glitch ? `<p class="glitch" data-text="${st.about}">${st.about}</p>` : `<p>${st.about}</p>`
  const fact = st.fact ? `<p class="si-fact"><strong>Did you know?</strong> ${st.fact}</p>` : ''
  entry.append(row, el('div', 'stage-info', `<div class="stage-info-inner">${about}${fact}</div>`))
  row.addEventListener('click', () => toggleNote(i))
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNote(i) }
  })
  menu.appendChild(entry)
  return { entry, row, name: row.querySelector('.si-name'), state: null }
})

export function toggleStageList(v) {
  const open = openFor !== v
  closeStageList()
  if (!open) return
  openFor = v
  renderStageList()
  menu.classList.add('open')
  v.badge.classList.add('open')
  v.badge.setAttribute('aria-expanded', 'true')
  const current = items[stageOf(game, v.i)].entry
  menu.scrollTop = Math.max(0, current.offsetTop - menu.clientHeight / 2 + current.offsetHeight / 2)
}

export function closeStageList() {
  if (!openFor) return
  menu.classList.remove('open')
  openFor.badge.classList.remove('open')
  openFor.badge.setAttribute('aria-expanded', 'false')
  openFor = null
}

// Reached stages green, the current one white, later ones grey and hidden as "???"
export function renderStageList() {
  if (!openFor) return
  const idx = stageOf(game, openFor.i)
  items.forEach((it, i) => {
    const state = i < idx ? 'done' : i === idx ? 'current' : 'future'
    if (it.state !== state) setState(it, STAGES[i], state)
  })
}

function setState(it, st, state) {
  const known = state !== 'future'
  it.state = state
  it.row.className = 'stage-item ' + state
  it.name.textContent = known ? st.name : '???'
  it.entry.style.display = !known && st.hidden ? 'none' : '' // the secret stage stays off the list until reached
  it.row.title = known ? 'Click to learn about this cell' : `Reach ${commas(st.min)} total mutation levels to discover this stage`
  if (known) {
    it.row.setAttribute('role', 'button')
    it.row.tabIndex = 0
  } else {
    it.entry.classList.remove('expanded')
    it.row.removeAttribute('role')
    it.row.removeAttribute('tabindex')
  }
}

function toggleNote(i) {
  const it = items[i]
  if (it.state === 'future') return
  const open = it.entry.classList.toggle('expanded')
  it.row.setAttribute('aria-expanded', open)
  if (open) setTimeout(() => it.entry.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 260)
}

// Clicking anywhere outside the open list closes it
document.addEventListener('pointerdown', closeStageList)
