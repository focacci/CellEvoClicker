import { orgSvg } from './helpers.js'

export const epithelial = {
  organelles: (st) => orgSvg(st,
    [[70, 52], [92, 44], [114, 50], [128, 64], [82, 68], [104, 66], [60, 72], [120, 82]]
      .map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${4 + (k % 2)}" fill="rgba(255,255,255,0.35)"/>`).join('') +
    '<path d="M40 105 Q60 95 80 105 T120 105 T155 100" stroke="rgba(255,255,255,0.15)" stroke-width="3" fill="none"/>' +
    '<path d="M45 175 Q65 165 85 175" stroke="rgba(255,255,255,0.12)" stroke-width="3" fill="none"/>')
}
