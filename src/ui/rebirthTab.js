// Rebirth Mutations: bought with RNA, kept forever. Shown while the cell is dormant after a rebirth.
import { el, replay } from './dom.js'
import { makeCard, updateCard } from './card.js'
import { RNA_ICON } from './icons.js'
import { pop } from './header.js'
import { REBIRTH } from '../data/rebirth.js'
import { buyRebirth } from '../actions.js'
import { saveGame } from '../save.js'
import { playTink } from '../audio/sfx.js'
import { commas } from '../format.js'
import { game } from '../state.js'

export const rebirthTab = el('div', 'upgrade-group')
const cards = REBIRTH.map(r => {
  const ref = makeCard(r.label, r.desc, () => buy(r, ref), 'rebirth')
  rebirthTab.appendChild(ref.card)
  return ref
})

function buy(r, ref) {
  if (!buyRebirth(game, r.id)) return
  playTink()
  replay(ref.card, 'bought')
  pop('rna')
  saveGame(game)
}

export function renderRebirthTab() {
  REBIRTH.forEach((r, k) => {
    const owned = game.owned.includes(r.id)
    updateCard(cards[k], {
      lvl: owned ? 'Owned' : 'Permanent',
      effect: r.echo ? `×${(1 + r.echo * game.earned).toFixed(2)} now` : r.effect,
      button: owned ? 'OWNED' : RNA_ICON + commas(r.cost),
      afford: !owned && game.rdna >= r.cost, have: game.rdna, cost: r.cost, done: owned
    })
  })
}
