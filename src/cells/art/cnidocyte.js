import { svgWrap, orgSvg } from './helpers.js'

function coil() {
  let d = ''
  for (let k = 0; k <= 60; k++) {
    const t = k / 60 * Math.PI * 7, r = 3 + k * 0.42
    d += (k ? ' L' : 'M') + (90 + Math.cos(t) * r * 0.72).toFixed(1) + ' ' + (74 + Math.sin(t) * r * 0.9).toFixed(1)
  }
  return d
}

// Stinging cell: a trigger hair and a coiled harpoon that fires outward every few seconds
export const cnidocyte = {
  features: (st) => svgWrap(
    `<g stroke="${st.colors[0]}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M86 0 Q104 -4 122 -2">` +
    '<animateTransform attributeName="transform" type="rotate" values="-10 86 0;10 86 0;-10 86 0" dur="2.6s" repeatCount="indefinite"/></path></g>' +
    '<path d="M88 10 C130 30 160 -20 200 6 S240 0 250 4" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="190" stroke-dashoffset="190" opacity="0.9">' +
    '<animate attributeName="stroke-dashoffset" values="190;190;0;0;190" keyTimes="0;0.5;0.58;0.82;1" dur="3.4s" repeatCount="indefinite"/></path>'),
  organelles: (st) => orgSvg(st,
    '<ellipse cx="90" cy="74" rx="34" ry="44" fill="rgba(107,15,26,0.28)" stroke="rgba(255,255,255,0.6)" stroke-width="2.5"/>' +
    `<path d="${coil()}" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.8" stroke-linecap="round"/>` +
    '<path d="M76 32 Q90 22 104 32" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="48" cy="120" r="5" fill="rgba(255,255,255,0.18)"/><circle cx="134" cy="128" r="4" fill="rgba(255,255,255,0.18)"/>')
}
