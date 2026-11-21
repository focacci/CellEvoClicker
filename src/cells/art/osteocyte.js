import { svgWrap, orgSvg, featLayer } from './helpers.js'

function canal(a, len) {
  const end = 78 + len
  return `<g transform="rotate(${a.toFixed(1)})">` +
    `<path d="M70 0 C${(78 + len * 0.4).toFixed(1)} -6 ${(78 + len * 0.7).toFixed(1)} 6 ${end} 0" stroke-width="3"/>` +
    `<path d="M${(78 + len * 0.6).toFixed(1)} 2 L${(78 + len * 0.9).toFixed(1)} ${(-len * 0.3).toFixed(1)}" stroke-width="1.8"/></g>`
}

// Bone cell: a star of fine canals reaching through its lacuna, with nutrients pulsing inward
export const osteocyte = {
  features: (st) => {
    const canals = Array.from({ length: 14 }, (_, k) => [k * 360 / 14 + (k % 2 ? 8 : -5), 52 + (k * 37) % 30])
    const pulses = [0, 4, 7, 11].map((k, j) => {
      const [a, len] = canals[k]
      const b = `dur="2.2s" begin="-${(j * 0.55).toFixed(2)}s" repeatCount="indefinite"`
      return `<g transform="rotate(${a.toFixed(1)})"><circle r="3" fill="${st.colors[0]}">` +
        `<animateMotion path="M${78 + len} 0 L72 0" ${b}/><animate attributeName="opacity" values="0;1;1;0" ${b}/></circle></g>`
    }).join('')
    return svgWrap(
      `<ellipse rx="150" ry="138" fill="none" stroke="${st.colors[1]}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity="0.35"/>` +
      `<g stroke="${st.colors[1]}" fill="none" stroke-linecap="round" opacity="0.9">${canals.map(([a, l]) => canal(a, l)).join('')}</g>`) +
      featLayer('', '', pulses)
  },
  organelles: (st) => orgSvg(st,
    '<path d="M36 108 Q56 98 76 108 T118 106" stroke="rgba(68,64,60,0.35)" stroke-width="3" fill="none"/>' +
    [[44, 56], [132, 48], [142, 110], [58, 124], [108, 128]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="rgba(68,64,60,0.35)"/>`).join('') +
    [[120, 76, 20], [62, 84, -30], [96, 40, 60]].map(([x, y, r]) =>
      `<rect x="${x - 6}" y="${y - 2}" width="12" height="4" rx="1" fill="rgba(255,255,255,0.4)" transform="rotate(${r} ${x} ${y})"/>`).join(''))
}
