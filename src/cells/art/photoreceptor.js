import { svgWrap, orgSvg, featLayer, gradient, times } from './helpers.js'

// Rod cell: stacked light-catching discs on top, photons falling in, a synaptic foot below
export const photoreceptor = {
  features: (st) => {
    const photons = times(3, k => {
      const b = `dur="2.4s" begin="-${(k * 0.8).toFixed(1)}s" repeatCount="indefinite"`
      return `<circle cx="${-24 + k * 24}" cy="-205" r="4" fill="#fefce8">` +
        `<animate attributeName="cy" values="-205;-100" ${b}/><animate attributeName="opacity" values="0;1;0" ${b}/></circle>`
    })
    return svgWrap(
      `<polygon points="-46,-215 46,-215 34,-96 -34,-96" fill="${gradient('beam', st)}"/>` +
      `<path d="M-8 96 L-8 122 Q0 134 8 122 L8 96" fill="${st.colors[1]}" opacity="0.9"/>` +
      `<circle cy="130" r="9" fill="${st.colors[1]}"/>`) +
      featLayer('', '', photons)
  },
  organelles: (st) => orgSvg(st,
    times(10, k => `<rect x="24" y="${(16 + k * 8.2).toFixed(1)}" width="82" height="5" rx="2.5" fill="rgba(255,255,255,0.26)"/>`) +
    '<rect x="20" y="8" width="90" height="14" rx="7" fill="rgba(255,255,255,0.5)">' +
    '<animate attributeName="y" values="8;96" dur="3s" repeatCount="indefinite"/>' +
    '<animate attributeName="opacity" values="0;0.7;0" dur="3s" repeatCount="indefinite"/></rect>' +
    '<path d="M30 106 H100" stroke="rgba(0,0,0,0.18)" stroke-width="3" stroke-linecap="round"/>' +
    [[46, 114], [65, 118], [84, 114]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#fb923c" opacity="0.75"/>`).join(''))
}
