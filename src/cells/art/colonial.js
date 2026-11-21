import { svgWrap, orgSvg, gradient, times } from './helpers.js'

export const colonial = {
  features: (st) => svgWrap(`<circle r="132" fill="${gradient('halo', st)}"/>`),
  organelles: (st) => orgSvg(st,
    times(10, k => {
      const a = k * Math.PI / 5 + 0.3
      return `<circle cx="${(100 + Math.cos(a) * 86).toFixed(1)}" cy="${(100 + Math.sin(a) * 86).toFixed(1)}" r="4" fill="${st.colors[0]}" opacity="0.9"/>`
    }) +
    '<circle cx="62" cy="128" r="7" fill="rgba(255,255,255,0.15)"/>' +
    '<circle cx="138" cy="70" r="5" fill="rgba(255,255,255,0.15)"/>')
}
