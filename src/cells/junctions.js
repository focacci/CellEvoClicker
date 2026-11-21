// Junctions between touching cells (adhesion plaques, synapses) and the ring flash around a cell
import { el } from '../ui/dom.js'
import { STAGES } from '../data/stages.js'

const TOUCHING = 198 * 1.05

export function scheduleJunctions(v, ms) {
  clearTimeout(v.junctionTimer)
  v.junctions.innerHTML = ''
  v.junctionTimer = setTimeout(() => buildJunctions(v), ms)
}

function buildJunctions(v) {
  const kind = STAGES[v.stage].junction
  v.junctions.innerHTML = ''
  if (!kind) return
  for (let i = 0; i < v.cells.length; i++) {
    for (let j = i + 1; j < v.cells.length; j++) {
      const a = v.cells[i], b = v.cells[j]
      if (Math.hypot(a.x - b.x, a.y - b.y) <= TOUCHING) v.junctions.appendChild(junction(kind, a, b))
    }
  }
}

function junction(kind, a, b) {
  const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI
  const node = el('div', 'junction ' + kind)
  node.style.left = (a.x + b.x) / 2 + 'px'
  node.style.top = (a.y + b.y) / 2 + 'px'
  node.style.transform = `rotate(${kind === 'adhesion' ? angle + 90 : angle}deg)`
  node.style.animationDelay = `-${(Math.random() * 2).toFixed(2)}s`
  return node
}

export function spawnRing(v, c, scale = 1) {
  const st = STAGES[v.stage]
  const size = Math.max(...st.size) * scale
  const ring = el('div', 'evolve-ring')
  Object.assign(ring.style, {
    width: size + 'px', height: size + 'px', left: c.x - size / 2 + 'px', top: c.y - size / 2 + 'px', color: st.colors[1]
  })
  v.fx.appendChild(ring)
  setTimeout(() => ring.remove(), 950)
}
