// Floating DNA numbers, click ripples and crit sparks, all drawn on one canvas (far cheaper than DOM nodes)
import { $ } from '../ui/dom.js'
import { pane } from '../ui/pane.js'
import { views } from '../ui/screens.js'
import { short } from '../format.js'
import { settings } from '../settings.js'

export const COLORS = { click: '#10b981', crit: '#ffed29', auto: '#ff000d', autoCrit: '#ff8c00' }
const canvas = $('#fx-canvas')
const ctx = canvas.getContext('2d')
const floaters = [], ripples = [], sparks = []
const FONT = "800 24px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
const STRANDS = [new Path2D('M2 1 C2 5.5 10 5.5 10 10 C10 14.5 2 14.5 2 19'), new Path2D('M10 1 C10 5.5 2 5.5 2 10 C2 14.5 10 14.5 10 19')]
const RUNGS = new Path2D('M3.2 2.8h5.6 M2.6 10h6.8 M3.2 17.2h5.6')
let dirty = false

// "+[DNA]123": measured once, then shared by every floater from the same click
export function label(amount, color) {
  const text = short(amount)
  ctx.font = FONT
  const plus = ctx.measureText('+').width
  return { text, color, plus, w: 12 + plus + 16.1 + ctx.measureText(text).width }
}

// Hide DNA earnings also hides these
export function addFloater(screen, x, y, tag) {
  if (settings.hideEarnings) return
  floaters.push({ screen, x, y, tag, t0: performance.now() })
  if (floaters.length > 700) floaters.splice(0, floaters.length - 700)
}

export function addRipple(screen, x, y, color, crit) {
  const t0 = performance.now()
  ripples.push({ screen, x, y, t0, color, size: crit ? 70 : 46 })
  for (let i = 0; crit && i < 12; i++) {
    const a = Math.random() * Math.PI * 2, speed = 140 + Math.random() * 160
    sparks.push({ screen, x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, t0, color })
  }
}

// Keeps only the items still alive and draws each one at its progress t (0 → 1)
function drawAll(list, now, ms, draw) {
  let kept = 0
  for (const item of list) {
    const t = Math.max(0, (now - item.t0) / ms)
    if (t >= 1) continue
    list[kept++] = item
    draw(item, t, (item.screen - pane.slide) * pane.w)
  }
  list.length = kept
}

function drawRipple(r, t, dx) {
  ctx.globalAlpha = 0.55 * (1 - t)
  ctx.strokeStyle = r.color
  ctx.lineWidth = 3 * (1 - t) + 0.5
  ctx.beginPath()
  ctx.arc(r.x + dx, r.y, 8 + r.size * (1 - (1 - t) ** 3), 0, Math.PI * 2)
  ctx.stroke()
}

function drawSpark(s, t, dx) {
  const d = (1 - (1 - t) ** 2) * 0.55
  ctx.globalAlpha = 1 - t
  ctx.fillStyle = s.color
  ctx.beginPath()
  ctx.arc(s.x + s.vx * d + dx, s.y + s.vy * d, 3 * (1 - t) + 0.6, 0, Math.PI * 2)
  ctx.fill()
}

// Rises 100px, shrinks to 80% and fades over 0.8 s
function drawFloater(f, t, dx) {
  const e = 1 - (1 - t) ** 2, s = 1 - 0.2 * e, tag = f.tag
  ctx.globalAlpha = 1 - e
  ctx.setTransform(pane.dpr * s, 0, 0, pane.dpr * s, pane.dpr * (f.x + dx), pane.dpr * (f.y - 100 * e))
  ctx.translate(-tag.w / 2, 8)
  ctx.fillStyle = ctx.strokeStyle = tag.color
  ctx.fillText('+', 6, 0)
  ctx.fillText(tag.text, 6 + tag.plus + 16.1, 0)
  ctx.translate(6 + tag.plus + 0.12, -19.2)
  ctx.scale(1.08, 1.08)
  ctx.lineWidth = 1.8
  STRANDS.forEach(p => ctx.stroke(p))
  ctx.lineWidth = 1.3
  ctx.globalAlpha *= 0.85
  ctx.stroke(RUNGS)
}

// Effects are drawn everywhere except over the stage badges on screen, so the badges stay readable
function skipBadges() {
  ctx.beginPath()
  ctx.rect(0, 0, pane.w, pane.h)
  for (const v of views) {
    const d = v.i - pane.slide, b = v.badge
    if (Math.abs(d) >= 1) continue
    v.badgeBox ??= { x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight }
    ctx.rect(v.badgeBox.x + d * pane.w, v.badgeBox.y, v.badgeBox.w, v.badgeBox.h)
  }
  ctx.clip('evenodd')
}

export function renderFx(now) {
  ctx.setTransform(pane.dpr, 0, 0, pane.dpr, 0, 0)
  if (dirty) ctx.clearRect(0, 0, pane.w, pane.h)
  dirty = floaters.length + ripples.length + sparks.length > 0
  if (!dirty) return
  ctx.save()
  skipBadges()
  drawAll(ripples, now, 450, drawRipple)
  drawAll(sparks, now, 550, drawSpark)
  ctx.font = FONT
  ctx.lineCap = 'round'
  // A crisp 1px shadow keeps the numbers readable on bright cells. (A blurred one made 37 cells lag.)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowOffsetY = 1
  drawAll(floaters, now, 800, drawFloater)
  ctx.restore()
}
