import { svgWrap, orgSvg, featLayer, gradient, times } from './helpers.js'

// Egg cell: a glassy zona pellucida and a slowly turning, breathing crown of follicle cells
export const oocyte = {
  features: (st) => {
    const corona = times(16, k => {
      const a = k * Math.PI * 2 / 16
      return `<circle cx="${(Math.cos(a) * 142).toFixed(1)}" cy="${(Math.sin(a) * 142).toFixed(1)}" r="12" fill="${gradient('pod', st)}" opacity="0.85"/>`
    })
    return svgWrap(
      '<circle r="114" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="16"/>' +
      `<circle r="106" fill="none" stroke="${st.colors[0]}" stroke-width="1.5" opacity="0.45"/>`) +
      `<div class="feat-layer feat-spin" style="--dur:90s">${featLayer('feat-breathe', '--dur:3.2s', corona)}</div>`
  },
  organelles: (st) => orgSvg(st, times(22, k => {
    const a = k * 2.399, r = 18 + (k * 29) % 62
    return `<circle cx="${(100 + Math.cos(a) * r).toFixed(1)}" cy="${(100 + Math.sin(a) * r).toFixed(1)}" r="${2.5 + (k % 3)}" fill="rgba(255,241,242,0.35)"/>`
  }))
}
