import { orgSvg, featLayer, gradient, times } from './helpers.js'

// A flexible, nucleus-free disc with four O2 molecules riding around it (the whole ring turns on the GPU)
export const erythrocyte = {
  features: () => featLayer('feat-spin', '--dur:8s', times(4, k =>
    `<g transform="rotate(${k * 90}) translate(126 0) rotate(90)" opacity="0.85">` +
    '<circle cx="-4.5" r="5" fill="#ffe4e6"/><circle cx="4.5" r="5" fill="#ffe4e6"/></g>')),
  organelles: (st) => orgSvg(st,
    '<circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="16"/>' +
    `<circle cx="100" cy="100" r="58" fill="${gradient('dimple', st)}"/>` +
    '<ellipse cx="80" cy="74" rx="22" ry="10" fill="rgba(255,255,255,0.14)" transform="rotate(-35 80 74)"/>')
}
