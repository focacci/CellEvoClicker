// Top bar: DNA and RNA counters and the Generation Rate line
import { $, setText, setHTML } from './dom.js'
import { DNA_ICON, RNA_ICON } from './icons.js'
import { commas, long } from '../format.js'
import { totalPerSecond } from '../rules.js'

const dna = $('#dna-counter')
const rna = $('#rdna-counter')
const rate = $('#dps-counter')
dna.innerHTML = DNA_ICON + '<span></span>'
rna.innerHTML = RNA_ICON + '<span></span>'
let shown = 0

export function renderHeader(game, dt) {
  // The DNA counter rolls up to the real value; spending snaps it down at once
  shown = shown < game.money ? shown + (game.money - shown) * Math.min(1, dt * 14) : game.money
  if (game.money - shown < 1 || (game.money - shown) / game.money < 1e-7) shown = game.money
  setText(dna.lastChild, long(shown))
  setText(rna.lastChild, long(game.rdna))
  const r = totalPerSecond(game)
  setHTML(rate, `Generation Rate: ${DNA_ICON}${r < 1e6 ? commas(r) + '.' + Math.floor(r % 1 * 10) : long(r)}/s`)
}

const POP = [
  { transform: 'scale(1)', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { transform: 'scale(1.07)', offset: 0.4, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { transform: 'scale(1)' }
]

// Counter pop on crits. The animation is reused (rewound) instead of creating a new one each time.
export function pop(which = 'dna') {
  const node = which === 'rna' ? rna : dna
  if (node._pop) { node._pop.currentTime = 0; node._pop.play() } else node._pop = node.animate(POP, 320)
}
