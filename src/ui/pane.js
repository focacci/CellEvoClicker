// The simulation pane's size and slide position. Measured on resize, so clicks never force a re-measure.
import { $ } from './dom.js'

export const pane = { el: $('#simulation-pane'), w: 0, h: 0, left: 0, top: 0, dpr: 1, slide: 0, sliding: false }

export function measurePane() {
  const r = pane.el.getBoundingClientRect()
  Object.assign(pane, { w: r.width, h: r.height, left: r.left, top: r.top, dpr: Math.min(2, devicePixelRatio || 1) })
  for (const canvas of pane.el.querySelectorAll('canvas')) {
    canvas.width = Math.round(pane.w * pane.dpr)
    canvas.height = Math.round(pane.h * pane.dpr)
  }
}

measurePane()
