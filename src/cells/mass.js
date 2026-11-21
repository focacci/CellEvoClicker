// A colony's cell mass: hex layout, mitosis and the evolve animation
import { el, replay } from '../ui/dom.js'
import { pane } from '../ui/pane.js'
import { STAGES } from '../data/stages.js'
import { makeCell, paintCell } from './look.js'
import { scheduleJunctions, spawnRing } from './junctions.js'

const SPACING = 198 // centre-to-centre distance between neighbouring cells

// Hex slots filled ring by ring: 1 + 6 + 12 + 18 = 37 cells (36 Mitotic Divisions)
const HEX_SLOTS = (() => {
  const steps = [[-1, 1], [-1, 0], [0, -1], [1, -1], [1, 0], [0, 1]]
  const out = [{ q: 0, r: 0, ring: 0 }]
  for (let ring = 1; ring <= 3; ring++) {
    let q = ring, r = 0
    for (const [dq, dr] of steps) {
      for (let j = 0; j < ring; j++) { out.push({ q, r, ring }); q += dq; r += dr }
    }
  }
  return out.map(h => ({ x: SPACING * (h.q + h.r / 2), y: SPACING * (Math.sqrt(3) / 2) * h.r, ring: h.ring }))
})()

export function buildMass(area) {
  const mass = el('div', 'cell-mass')
  const layer = (name) => mass.appendChild(el('div', 'mass-layer layer-' + name))
  area.appendChild(mass)
  return { area, mass, features: layer('features'), bodies: layer('bodies'), junctions: layer('junctions'), fx: layer('fx'), cells: [], stage: -1, scale: 1 }
}

// Makes the cells match the game: how many there are and which stage they show.
// Only growth during play is animated (not loading a save or a rebirth).
export function syncMass(v, count, stage) {
  const first = v.stage === -1
  if (stage !== v.stage) evolve(v, stage, !first && stage > v.stage)
  if (count !== v.cells.length) setCount(v, count, !first)
}

function paint(v, c) {
  paintCell(c, STAGES[v.stage])
  if (v.paused) pauseSvgs(c.body, c.feat)
}

// Every cell squeezes, flashes and re-forms as the new stage, rippling out from the centre
function evolve(v, stage, animate) {
  v.stage = stage
  if (!animate) {
    v.cells.forEach(c => paint(v, c))
    layout(v)
    return scheduleJunctions(v, 0)
  }
  for (const c of v.cells) {
    setTimeout(() => {
      replay(c.body, 'evolving')
      replay(c.feat, 'evolving')
      spawnRing(v, c)
      setTimeout(() => paint(v, c), 225)
    }, c.ring * 110)
  }
  setTimeout(() => layout(v), 225)
  scheduleJunctions(v, Math.max(...v.cells.map(c => c.ring)) * 110 + 950)
}

function setCount(v, count, animate) {
  const before = v.cells.map(c => ({ x: c.x, y: c.y }))
  while (v.cells.length > count) {
    const c = v.cells.pop()
    c.feat.remove()
    c.body.remove()
  }
  const born = []
  while (v.cells.length < count) born.push(addCell(v))
  if (animate) born.forEach(c => budFrom(c, before[parentOf(c.index, before.length)]))
  layout(v)
  if (animate) setTimeout(() => born.forEach(c => spawnRing(v, c, 0.8)), 450)
  scheduleJunctions(v, animate ? 800 : 0)
}

function addCell(v) {
  const c = makeCell(v.cells.length)
  v.features.appendChild(c.feat)
  v.bodies.appendChild(c.body)
  v.cells.push(c)
  paint(v, c)
  return c
}

// Mitosis: a new cell buds off the nearest existing cell, then slides into its own slot
function parentOf(index, existing) {
  const slot = HEX_SLOTS[index], dist = (s) => Math.hypot(s.x - slot.x, s.y - slot.y)
  let best = 0
  for (let i = 1; i < existing; i++) if (dist(HEX_SLOTS[i]) < dist(HEX_SLOTS[best])) best = i
  return best
}

function budFrom(c, start) {
  for (const node of [c.feat, c.body]) {
    Object.assign(node.style, { transition: 'none', left: start.x - 100 + 'px', top: start.y - 100 + 'px', transform: 'scale(0.25)', opacity: '0' })
  }
  void c.body.offsetWidth
  for (const node of [c.feat, c.body]) Object.assign(node.style, { transition: '', transform: '', opacity: '' })
}

// Centres the mass and scales it to fit the pane (leaving room for the side arrows and the stage badge)
export function layout(v) {
  const n = v.cells.length, st = STAGES[v.stage]
  if (!n) return
  const slots = HEX_SLOTS.slice(0, n)
  const cx = slots.reduce((a, p) => a + p.x, 0) / n
  const cy = slots.reduce((a, p) => a + p.y, 0) / n
  v.cells.forEach((c, i) => Object.assign(c, { x: slots[i].x - cx, y: slots[i].y - cy, ring: slots[i].ring }))
  const halfW = Math.max(...v.cells.map(c => Math.abs(c.x))) + st.size[0] / 2
  const halfH = Math.max(...v.cells.map(c => Math.abs(c.y))) + st.size[1] / 2
  const fitW = Math.max(200, pane.w - 64 - 140) / (2 * (halfW + st.reach))
  const fitH = Math.max(200, pane.h - 200) / (2 * (halfH + st.reach))
  v.scale = Math.max(0.2, Math.min(1, fitW, fitH))
  v.mass.style.transform = `scale(${v.scale})`
  v.area.style.width = 2 * halfW * v.scale + 100 + 'px'
  v.area.style.height = 2 * halfH * v.scale + 100 + 'px'
  for (const c of v.cells) place(c, st)
}

function place(c, st) {
  for (const node of [c.feat, c.body]) Object.assign(node.style, { left: c.x - 100 + 'px', top: c.y - 100 + 'px' })
  c.rot.style.transform = `rotate(${featureAngle(c, st)}deg)`
}

// Which way a cell's art points: never turned, away from the mass centre, or a fixed "random" angle
function featureAngle(c, st) {
  if (st.orient === 'fixed') return 0
  if (st.orient === 'outward' && Math.hypot(c.x, c.y) > 1) return Math.atan2(c.y, c.x) * 180 / Math.PI
  return (c.index * 137.508) % 360
}

// Where a cell sits on the pane, in px
export function cellPoint(v, c) {
  return { x: pane.w / 2 + c.x * v.scale, y: pane.h / 2 + c.y * v.scale }
}

export function nearestCell(v, x, y) {
  const dist = (c) => { const p = cellPoint(v, c); return Math.hypot(p.x - x, p.y - y) }
  return v.cells.reduce((best, c, i) => (dist(c) < dist(v.cells[best]) ? i : best), 0)
}

export function pauseSvgs(...roots) {
  for (const root of roots) root.querySelectorAll('svg').forEach(svg => svg.pauseAnimations())
}
