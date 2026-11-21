// Shared drawing helpers for the stage art. Every function returns an HTML/SVG string.

// Gradients are added to the page only when a stage's art first asks for one.
// c = the stage's colors [highlight, main, shadow]; glow = its glow color as "r, g, b".
const GRADIENTS = {
  tail: (c) => `<linearGradient x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c[1]}"/><stop offset="100%" stop-color="${c[0]}" stop-opacity="0"/></linearGradient>`,
  halo: (c) => `<radialGradient><stop offset="60%" stop-color="${c[1]}" stop-opacity="0.35"/><stop offset="100%" stop-color="${c[1]}" stop-opacity="0"/></radialGradient>`,
  pod: (c) => `<radialGradient cx="35%" cy="35%" r="75%"><stop offset="0%" stop-color="${c[0]}"/><stop offset="55%" stop-color="${c[1]}"/><stop offset="100%" stop-color="${c[2]}"/></radialGradient>`,
  aura: (c, glow) => `<radialGradient><stop offset="55%" stop-color="rgb(${glow})" stop-opacity="0.45"/><stop offset="100%" stop-color="rgb(${glow})" stop-opacity="0"/></radialGradient>`,
  dimple: (c) => `<radialGradient><stop offset="0%" stop-color="${c[2]}" stop-opacity="0.55"/><stop offset="65%" stop-color="${c[2]}" stop-opacity="0.25"/><stop offset="100%" stop-color="${c[2]}" stop-opacity="0"/></radialGradient>`,
  lum: (c) => `<radialGradient><stop offset="0%" stop-color="#f0f9ff"/><stop offset="35%" stop-color="${c[0]}" stop-opacity="0.9"/><stop offset="100%" stop-color="${c[0]}" stop-opacity="0"/></radialGradient>`,
  beam: (c) => `<linearGradient x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c[0]}" stop-opacity="0"/><stop offset="100%" stop-color="${c[0]}" stop-opacity="0.3"/></linearGradient>`,
  chim: () => '<linearGradient x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0abfc"/><stop offset="35%" stop-color="#22d3ee"/><stop offset="70%" stop-color="#a3e635"/><stop offset="100%" stop-color="#f0abfc"/></linearGradient>',
  nuc2: () => '<radialGradient cx="30%" cy="30%" r="80%"><stop offset="0%" stop-color="#99f6e4"/><stop offset="100%" stop-color="#0d9488"/></radialGradient>'
}
const SAME_FOR_EVERY_STAGE = ['chim', 'nuc2']
const made = new Set()

export function gradient(kind, st) {
  const id = SAME_FOR_EVERY_STAGE.includes(kind) ? kind : `${kind}-${st.id}`
  if (!made.has(id)) {
    made.add(id)
    const svg = GRADIENTS[kind](st.colors, st.glow).replace(/^<(\w+)/, `<$1 id="${id}"`)
    document.getElementById('bio-defs').insertAdjacentHTML('beforeend', svg)
  }
  return `url(#${id})`
}

// Art around a cell (tails, rays...), drawn on a 500×500 board centred on the cell
export const svgWrap = (inner) => `<svg class="feat-svg" viewBox="-250 -250 500 500">${inner}</svg>`

// Art inside a cell, drawn in the cell's own size
export const orgSvg = (st, inner) => `<svg class="org-svg" viewBox="0 0 ${st.size[0]} ${st.size[1]}">${inner}</svg>`

// Moving art gets its own GPU layer. kind: '' (SVG animation inside), 'feat-spin', 'feat-pulse' or 'feat-breathe'
export const featLayer = (kind, style, inner) => `<div class="feat-layer ${kind}" style="${style}">${svgWrap(inner)}</div>`

// A travelling wave (every frame has the same number of points, so it morphs smoothly)
function wavePath(x0, len, amp, phase, freq) {
  let d = ''
  for (let i = 0; i <= 26; i++) {
    const t = i / 26
    const y = Math.sin(t * freq * 2 * Math.PI - phase) * amp * (0.25 + t * 0.75)
    d += (i ? ' L' : 'M') + (x0 + len * t).toFixed(1) + ' ' + y.toFixed(1)
  }
  return d
}

export function flagellum(st, x0, len, amp, dur, freq, width) {
  const frames = [0, 1, 2, 3, 4].map(k => wavePath(x0, len, amp, k * Math.PI / 2, freq)).join(';')
  return `<path d="${wavePath(x0, len, amp, 0, freq)}" fill="none" stroke="${gradient('tail', st)}" stroke-width="${width}" stroke-linecap="round">` +
    `<animate attributeName="d" values="${frames}" dur="${dur}s" repeatCount="indefinite"/></path>`
}

// Repeats f(k) for k = 0..n-1 and joins the strings
export const times = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join('')
