// Moving between colony screens: the side arrows and the sliding animation
import { $, setStyle } from './dom.js'
import { pane } from './pane.js'
import { views } from './screens.js'
import { closeStageList } from './stageList.js'
import { pauseSvgs } from '../cells/mass.js'
import { game } from '../state.js'

const left = $('#nav-left'), right = $('#nav-right')
let slide = null // { from, to, t0 } while the screens move

left.addEventListener('click', () => goTo(game.view - 1))
right.addEventListener('click', () => goTo(game.view + 1))

export function goTo(i, instant = false) {
  i = Math.max(0, Math.min(views.length - 1, i))
  if ((game.pending && i !== 0) || (i === game.view && !instant)) return
  closeStageList()
  const from = pane.slide
  game.view = i
  // Every screen the slide passes over must be visible while it moves
  for (const v of views) if (v.i >= Math.min(Math.floor(from), i) && v.i <= Math.max(Math.ceil(from), i)) show(v, true)
  slide = { from, to: i, t0: instant ? -Infinity : performance.now() }
}

const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

export function renderSlide(now) {
  if (slide) {
    const t = Math.min(1, (now - slide.t0) / 720)
    pane.slide = slide.from + (slide.to - slide.from) * easeInOut(t)
    if (t >= 1) {
      slide = null
      views.forEach(v => show(v, v.i === game.view))
    }
  }
  pane.sliding = !!slide
  for (const v of views) {
    const d = v.i - pane.slide, near = Math.min(1, Math.abs(d))
    setStyle(v.screen, 'transform', `translate3d(${(d * 100).toFixed(3)}%, 0, 0) scale(${(1 - 0.06 * near).toFixed(4)})`)
    setStyle(v.screen, 'opacity', (1 - 0.4 * near).toFixed(3))
  }
  left.classList.toggle('hidden', game.pending || game.view === 0)
  right.classList.toggle('hidden', game.pending || game.view === views.length - 1)
}

// Screens off to the side stop painting and pause their SVG animations
function show(v, visible) {
  if (v.paused === !visible) return
  v.paused = !visible
  v.screen.classList.toggle('offscreen', !visible)
  if (visible) v.screen.querySelectorAll('svg').forEach(svg => svg.unpauseAnimations())
  else pauseSvgs(v.screen)
}
