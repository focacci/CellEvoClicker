// Soft specks drifting up behind the cells
import { $ } from '../ui/dom.js'
import { pane } from '../ui/pane.js'

const canvas = $('#ambient-canvas')
const ctx = canvas.getContext('2d')

// One soft glowing dot, drawn once and reused for every speck
const sprite = document.createElement('canvas')
sprite.width = sprite.height = 64
const g = sprite.getContext('2d')
const glow = g.createRadialGradient(32, 32, 0, 32, 32, 32)
glow.addColorStop(0, 'rgba(186, 214, 255, 1)')
glow.addColorStop(0.35, 'rgba(120, 160, 230, 0.45)')
glow.addColorStop(1, 'rgba(120, 160, 230, 0)')
g.fillStyle = glow
g.fillRect(0, 0, 64, 64)

const specks = Array.from({ length: 38 }, () => ({
  x: Math.random(), y: Math.random(),
  size: 6 + Math.random() * 22,
  vy: 0.004 + Math.random() * 0.012,
  alpha: 0.05 + Math.random() * 0.17,
  freq: 0.15 + Math.random() * 0.35,
  phase: Math.random() * Math.PI * 2,
  depth: 0.3 + Math.random() * 0.7
}))

export function renderAmbient(now, dt) {
  ctx.setTransform(pane.dpr, 0, 0, pane.dpr, 0, 0)
  ctx.clearRect(0, 0, pane.w, pane.h)
  for (const p of specks) {
    p.y -= p.vy * dt
    if (p.y < -0.06) { p.y = 1.06; p.x = Math.random() }
    // A gentle sway, plus a little parallax as the screens slide
    let x = (p.x * pane.w + Math.sin(now / 1000 * p.freq + p.phase) * 14 - pane.slide * pane.w * 0.12 * p.depth) % pane.w
    if (x < 0) x += pane.w
    ctx.globalAlpha = p.alpha
    ctx.drawImage(sprite, x - p.size / 2, p.y * pane.h - p.size / 2, p.size, p.size)
  }
  ctx.globalAlpha = 1
}
