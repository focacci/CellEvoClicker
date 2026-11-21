import { svgWrap, orgSvg, flagellum } from './helpers.js'

export const flagellate = {
  features: (st) => svgWrap(
    flagellum(st, 90, 125, 10, 0.7, 1.6, 5) +
    `<g transform="rotate(180)">${flagellum(st, 90, 105, 9, 0.85, 1.5, 4.5)}</g>`),
  organelles: (st) => orgSvg(st,
    '<circle cx="150" cy="70" r="7" fill="#fb923c" opacity="0.9"/>' +
    '<circle cx="62" cy="130" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>' +
    '<circle cx="132" cy="140" r="6" fill="rgba(255,255,255,0.12)"/>')
}
