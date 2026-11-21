import { orgSvg, featLayer, times } from './helpers.js'

// An immune cell studded with Y-shaped receptors that slowly scan around it
export const lymphocyte = {
  features: (st) => featLayer('feat-spin', '--dur:60s',
    `<g stroke="${st.colors[0]}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">` +
    times(16, k => `<g transform="rotate(${(k * 22.5).toFixed(1)})"><path d="M92 0 H110 M110 0 L119 -8 M110 0 L119 8"/></g>`) + '</g>'),
  organelles: (st) => orgSvg(st,
    [[28, 64], [162, 72], [154, 142], [40, 140], [96, 178]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="4" fill="rgba(255,255,255,0.3)"/>`).join(''))
}
