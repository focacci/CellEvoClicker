// The stage name above each colony, with its yellow progress bar toward the next stage
import { el, setText, setStyle, replay } from './dom.js'
import { chevron } from './icons.js'
import { STAGES } from '../data/stages.js'
import { stageOf, stageProgress, totalLevels } from '../rules.js'
import { game } from '../state.js'

export function makeBadge(onOpen) {
  const badge = el('div', 'stage-badge',
    '<span class="badge-label"></span>' + chevron('badge-chev') + '<span class="stage-xp" aria-hidden="true"><i></i></span>')
  badge.setAttribute('role', 'button')
  badge.setAttribute('aria-haspopup', 'true')
  badge.setAttribute('aria-expanded', 'false')
  badge.tabIndex = 0
  badge.addEventListener('pointerdown', (e) => e.stopPropagation())
  badge.addEventListener('click', (e) => { e.stopPropagation(); onOpen() })
  badge.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() }
  })
  return badge
}

export function renderBadge(v) {
  const idx = stageOf(game, v.i), st = STAGES[idx], next = STAGES[idx + 1]
  const bar = v.badge.querySelector('.stage-xp')
  if (v.badgeStage !== undefined && idx > v.badgeStage) replay(v.badge, 'pop')
  if (idx !== v.badgeStage) v.badgeBox = null // the name changed, so the badge's size did too
  v.badgeStage = idx
  setText(v.badge.firstChild, `Stage ${idx + 1}: ${st.name}`)
  setStyle(bar.firstChild, 'width', (stageProgress(game, v.i) * 100).toFixed(1) + '%')
  bar.classList.toggle('galaxy', !!st.galaxy)
  // The Immortal Cell keeps a full bar (it still looks like the end); the Transcendent Cell truly is
  const title = st.finalLabel || !next ? st.finalLabel || 'Final stage reached'
    : `${totalLevels(game, v.i)} / ${next.min} total mutation levels to reach ${next.name}`
  if (v.badge.title !== title) v.badge.title = title
}
