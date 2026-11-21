import { svgWrap, orgSvg, gradient } from './helpers.js'

// Crawling pseudopods, swallowed bacteria and lysosomes
export const macrophage = {
  features: (st) => svgWrap([20, 145, 250].map((a, k) =>
    `<g transform="rotate(${a})"><ellipse cx="96" cy="0" rx="44" ry="26" fill="${gradient('pod', st)}">` +
    `<animate attributeName="cx" values="86;114;86" dur="${4 + k}s" begin="-${(k * 1.3).toFixed(1)}s" repeatCount="indefinite"/></ellipse></g>`).join('')),
  organelles: (st) => orgSvg(st,
    [[62, 70, 13], [140, 128, 11], [72, 142, 9]].map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>` +
      `<rect x="${x - 5}" y="${y - 2}" width="10" height="4" rx="2" fill="rgba(0,0,0,0.45)" transform="rotate(${x % 90} ${x} ${y})"/>`).join('') +
    [[110, 60], [150, 90], [120, 160], [48, 108], [100, 140], [160, 64]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="3" fill="${st.colors[0]}" opacity="0.8"/>`).join(''))
}
