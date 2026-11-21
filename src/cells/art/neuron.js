import { svgWrap, orgSvg, featLayer } from './helpers.js'

function dendrite(a, len, w) {
  const end = 66 + len
  return `<g transform="rotate(${a})">` +
    `<path d="M66 0 C${66 + len * 0.35} -8 ${66 + len * 0.6} 7 ${end} 0" stroke-width="${w}"/>` +
    `<path d="M${(66 + len * 0.55).toFixed(1)} 2 L${(66 + len * 0.85).toFixed(1)} ${(-len * 0.28).toFixed(1)}" stroke-width="${(w * 0.55).toFixed(1)}"/>` +
    `<path d="M${(66 + len * 0.75).toFixed(1)} 1 L${end + 14} ${(len * 0.22).toFixed(1)}" stroke-width="${(w * 0.5).toFixed(1)}"/></g>`
}

// Branching dendrites, and a myelinated axon with a signal running along it
export const neuron = {
  features: (st) => {
    const dendrites = [[60, 58], [115, 66], [165, 52], [210, 64], [255, 56], [305, 62]].map(([a, l]) => dendrite(a, l, 4)).join('')
    return svgWrap(
      `<g stroke="${st.colors[0]}" fill="none" stroke-linecap="round" opacity="0.85">${dendrites}` +
      '<path d="M70 0 L235 0" stroke-width="5"/></g>' +
      `<g fill="${st.colors[0]}" opacity="0.55"><rect x="105" y="-5" width="25" height="10" rx="5"/><rect x="145" y="-5" width="25" height="10" rx="5"/><rect x="185" y="-5" width="25" height="10" rx="5"/></g>`) +
      featLayer('', '',
        '<circle r="4" fill="#ffffff"><animateMotion path="M70 0 L235 0" dur="1.6s" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite"/></circle>')
  },
  organelles: (st) => orgSvg(st,
    [[40, 50], [105, 42], [112, 100], [44, 104], [70, 120], [118, 70], [30, 78]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="3.5" fill="rgba(0,0,0,0.3)"/>`).join(''))
}
