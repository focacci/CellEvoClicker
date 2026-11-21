import { orgSvg, featLayer, gradient, times } from './helpers.js'

// Deep-sea light cell: twinkling scintillons inside a breathing aura
export const photocyte = {
  features: (st) => {
    const motes = times(4, k => {
      const b = `dur="3s" begin="-${(k * 0.75).toFixed(2)}s" repeatCount="indefinite"`
      return `<g transform="rotate(${k * 90 + 20})"><circle cx="100" r="3" fill="#bae6fd">` +
        `<animate attributeName="cx" values="100;178" ${b}/><animate attributeName="opacity" values="0;1;0" ${b}/></circle></g>`
    })
    return featLayer('feat-pulse', '--dur:3.4s;--lo:0.35;--hi:0.95', `<circle r="138" fill="${gradient('aura', st)}"/>`) +
      featLayer('', '', motes)
  },
  organelles: (st) => orgSvg(st,
    [[56, 62], [140, 58], [150, 128], [70, 140], [100, 34], [38, 104], [164, 94], [112, 160]].map(([x, y], k) =>
      `<circle cx="${x}" cy="${y}" r="10" fill="${gradient('lum', st)}">` +
      `<animate attributeName="opacity" values="0.15;1;0.15" dur="2.6s" begin="-${(k * 0.33).toFixed(2)}s" repeatCount="indefinite"/></circle>`).join(''))
}
