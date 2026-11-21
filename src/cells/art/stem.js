import { svgWrap, gradient } from './helpers.js'

export const stem = {
  features: (st) => svgWrap(
    `<circle r="130" fill="${gradient('halo', st)}">` +
    '<animate attributeName="r" values="122;142;122" dur="2.8s" repeatCount="indefinite"/>' +
    '<animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/></circle>'),
  organelles: () => '<div class="stem-sheen"></div>'
}
