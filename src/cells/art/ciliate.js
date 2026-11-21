import { svgWrap, orgSvg, times } from './helpers.js'

// 30 cilia beat in a wave: each swings -22° → 24° → -22° every 1.1 s, 0.07 s after its neighbour.
// They are pre-computed into ONE path that morphs between frames: one animation per cell instead of 30.
const COUNT = 30, DUR = 1.1, FRAMES = 20

function swing(t) {
  const u = (t % DUR) / DUR
  return u < 0.35 ? -22 + 46 * (u / 0.35) : 24 - 46 * ((u - 0.35) / 0.65)
}

function frame(t) {
  let d = ''
  for (let k = 0; k < COUNT; k++) {
    const ring = k * 2 * Math.PI / COUNT, c = Math.cos(ring), s = Math.sin(ring)
    const a = swing(t + k * 0.07) * Math.PI / 180
    const points = [[97, 0], [108, -5], [121, -2]].map(([x, y]) => {
      const rx = 97 + (x - 97) * Math.cos(a) - y * Math.sin(a) // turn about the root (97, 0)...
      const ry = (x - 97) * Math.sin(a) + y * Math.cos(a)
      return (rx * c - ry * s).toFixed(1) + ' ' + (rx * s + ry * c).toFixed(1) // ...then place it on the ring
    })
    d += `M${points[0]} Q${points[1]} ${points[2]} `
  }
  return d.trim()
}

export const ciliate = {
  features: (st) => {
    const frames = Array.from({ length: FRAMES + 1 }, (_, f) => frame(f / FRAMES * DUR))
    return svgWrap(`<path d="${frames[0]}" stroke="${st.colors[0]}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85">` +
      `<animate attributeName="d" values="${frames.join(';')}" dur="${DUR}s" repeatCount="indefinite"/></path>`)
  },
  // The pulsing star is a contractile vacuole
  organelles: (st) => {
    const canals = times(6, k => {
      const a = k * Math.PI / 3
      return `<line x1="${(145 + Math.cos(a) * 11).toFixed(1)}" y1="${(62 + Math.sin(a) * 11).toFixed(1)}" x2="${(145 + Math.cos(a) * 24).toFixed(1)}" y2="${(62 + Math.sin(a) * 24).toFixed(1)}"/>`
    })
    return orgSvg(st,
      `<g stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round">${canals}</g>` +
      '<circle cx="145" cy="62" r="9" fill="rgba(255,255,255,0.28)"><animate attributeName="r" values="6;11;6" dur="2.2s" repeatCount="indefinite"/></circle>' +
      '<path d="M150 112 Q132 136 142 162" stroke="rgba(0,0,0,0.22)" stroke-width="5" fill="none" stroke-linecap="round"/>')
  }
}
