import { svgWrap, orgSvg, featLayer, gradient, times } from './helpers.js'

// The Immortal Cell, and the same cell recoloured as a galaxy: the Transcendent Cell.
// Both have turning rays, two tilted orbits with electrons and twinkling sparkles.
const STAR = 'M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z'
const SPARKLES = [[60, 60], [146, 70], [150, 140], [58, 136], [100, 40], [104, 164]]
const DUST = [[40, 98], [88, 24], [30, 70], [170, 110], [126, 28], [74, 176], [128, 112], [82, 88], [118, 150], [92, 126], [152, 98], [64, 104]]
const GALAXY = ['#ffffff', '#67e8f9', '#f0abfc']

function features(st, ringOpacity, electrons) {
  const rays = times(12, k => `<polygon points="104,-4 172,0 104,4" transform="rotate(${k * 30})" fill="${gradient('tail', st)}"/>`)
  const ring = (rot) => `<ellipse transform="rotate(${rot})" rx="140" ry="44" fill="none" stroke="${st.colors[1]}" stroke-width="2" opacity="${ringOpacity}"/>`
  const electron = (rot, dur, begin, color) => `<g transform="rotate(${rot})"><circle r="5" fill="${color}">` +
    `<animateMotion path="M140 0 A140 44 0 1 1 -140 0 A140 44 0 1 1 140 0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle></g>`
  return featLayer('feat-pulse', '--dur:3s;--lo:0.5;--hi:1', `<circle r="150" fill="${gradient('aura', st)}"/>`) +
    featLayer('feat-spin', '--dur:40s', `<g opacity="0.8">${rays}</g>`) +
    svgWrap(ring(32) + ring(-32)) +
    featLayer('', '', electron(32, 4.5, 0, electrons[0]) + electron(-32, 6, -2, electrons[1]))
}

const sparkles = (colors) => SPARKLES.map(([x, y], k) =>
  `<path d="${STAR}" transform="translate(${x} ${y})" fill="${colors[k % colors.length]}">` +
  `<animate attributeName="opacity" values="0.1;1;0.1" dur="2.2s" begin="-${(k * 0.37).toFixed(2)}s" repeatCount="indefinite"/></path>`).join('')

function spiralArm(a0) {
  let d = ''
  for (let k = 0; k <= 40; k++) {
    const t = k / 40, a = a0 + t * Math.PI * 2.2, r = 8 + t * 76
    d += (k ? ' L' : 'M') + (100 + Math.cos(a) * r).toFixed(1) + ' ' + (100 + Math.sin(a) * r).toFixed(1)
  }
  return d
}

function galaxy(st) {
  const dust = DUST.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${(1 + (k % 3) * 0.45).toFixed(2)}" fill="${GALAXY[(k + 1) % 3]}">` +
    `<animate attributeName="opacity" values="0.2;0.9;0.2" dur="${(1.6 + (k % 4) * 0.5).toFixed(1)}s" begin="-${(k * 0.29).toFixed(2)}s" repeatCount="indefinite"/></circle>`).join('')
  return '<div class="galaxy-sheen"></div>' + orgSvg(st,
    '<g><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="70s" repeatCount="indefinite"/>' +
    `<path d="${spiralArm(0)}" fill="none" stroke="rgba(244,114,182,0.4)" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="${spiralArm(Math.PI)}" fill="none" stroke="rgba(103,232,249,0.35)" stroke-width="4" stroke-linecap="round"/></g>` +
    dust + sparkles(GALAXY))
}

export const immortal = {
  features: (st) => features(st, 0.45, ['#ffffff', '#ffffff']),
  organelles: (st) => '<div class="stem-sheen"></div>' + orgSvg(st, sparkles(['#ffffff']))
}

export const transcendent = {
  features: (st) => features(st, 0.5, ['#67e8f9', '#f0abfc']),
  organelles: galaxy
}
