import { svgWrap, orgSvg, flagellum, times } from './helpers.js'

// A collar of microvilli around one long flagellum
export const choanoflagellate = {
  features: (st) => {
    const villi = times(13, k => {
      const y = -30 + k * 5
      return `<line x1="94" y1="${(y * 0.9).toFixed(1)}" x2="152" y2="${(y * 1.9).toFixed(1)}"/>`
    })
    return svgWrap(
      `<g stroke="${st.colors[0]}" stroke-width="2.4" stroke-linecap="round" opacity="0.75">` +
      `<animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="3s" repeatCount="indefinite"/>${villi}</g>` +
      flagellum(st, 96, 150, 11, 0.9, 1.4, 5))
  },
  organelles: (st) => orgSvg(st,
    '<circle cx="68" cy="66" r="9" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>' +
    '<circle cx="132" cy="138" r="7" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>' +
    '<circle cx="60" cy="136" r="6" fill="rgba(255,255,255,0.12)"/>')
}
