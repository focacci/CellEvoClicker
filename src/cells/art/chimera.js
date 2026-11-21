import { orgSvg, featLayer, flagellum, gradient } from './helpers.js'

// Fused hybrid: a second nucleus, an iridescent shimmer and two counter-rotating rings
export const chimera = {
  features: (st) =>
    featLayer('feat-spin', '--dur:24s', `<circle r="122" fill="none" stroke="${gradient('chim', st)}" stroke-width="4" stroke-dasharray="16 10" stroke-linecap="round"/>`) +
    featLayer('feat-spin rev', '--dur:36s', `<circle r="136" fill="none" stroke="${gradient('chim', st)}" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round" opacity="0.6"/>`) +
    featLayer('', '', flagellum(st, 96, 120, 9, 0.9, 1.5, 4)),
  organelles: (st) => '<div class="chimera-sheen"></div>' + orgSvg(st,
    `<circle cx="132" cy="126" r="22" fill="${gradient('nuc2', st)}"/>` +
    '<circle cx="138" cy="120" r="5" fill="rgba(15,118,110,0.65)"/>' +
    '<circle cx="64" cy="140" r="6" fill="rgba(255,255,255,0.18)"/><circle cx="150" cy="64" r="5" fill="rgba(255,255,255,0.18)"/>')
}
