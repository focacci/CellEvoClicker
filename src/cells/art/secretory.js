import { orgSvg, times } from './helpers.js'

// Golgi arcs sending vesicles out of the cell
export const secretory = {
  organelles: (st) => {
    const vesicles = times(6, k => {
      const a = (-70 + k * 28) * Math.PI / 180
      const ex = (100 + Math.cos(a) * 122).toFixed(1), ey = (100 + Math.sin(a) * 122).toFixed(1)
      const b = `begin="-${(k * 0.47).toFixed(2)}s" dur="2.8s" repeatCount="indefinite"`
      return `<circle cx="150" cy="88" r="6" fill="${st.colors[0]}">` +
        `<animate attributeName="cx" values="150;${ex}" ${b}/>` +
        `<animate attributeName="cy" values="88;${ey}" ${b}/>` +
        `<animate attributeName="r" values="4;6;4" ${b}/>` +
        `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" ${b}/></circle>`
    })
    return orgSvg(st,
      `<g stroke="${st.colors[0]}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.55">` +
      '<path d="M112 58 Q140 88 112 118"/><path d="M123 54 Q155 88 123 122"/><path d="M134 52 Q168 88 134 124"/></g>' + vesicles)
  }
}
