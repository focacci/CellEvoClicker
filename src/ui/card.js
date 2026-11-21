// One upgrade card. Used for both mutations and rebirth mutations.
import { el, setText, setHTML, setStyle, replay } from './dom.js'

export function makeCard(name, desc, onBuy, cls = '') {
  const card = el('div', 'upgrade-card ' + cls,
    `<div class="upgrade-info"><div class="upgrade-name">${name}</div><div class="upgrade-desc">${desc}</div>` +
    '<div class="upgrade-meta"><span class="meta-lvl"></span><span class="meta-effect"></span></div></div>' +
    '<button class="upgrade-btn" type="button"></button>')
  const ref = { card, btn: card.querySelector('.upgrade-btn'), lvl: card.querySelector('.meta-lvl'), eff: card.querySelector('.meta-effect') }
  ref.btn.addEventListener('click', onBuy)
  card.addEventListener('animationend', (e) => { if (e.target === card) card.classList.remove('reveal', 'bought') })
  ref.lvl.addEventListener('animationend', () => ref.lvl.classList.remove('tick'))
  return ref
}

// s = { lvl, effect, button (html), afford, have, cost, done }
// The grey button fills up (in 2% steps) as you get closer to affording it.
export function updateCard(ref, s) {
  setText(ref.lvl, s.lvl)
  setHTML(ref.eff, s.effect)
  setHTML(ref.btn, s.button)
  ref.btn.disabled = !s.afford
  ref.card.classList.toggle('affordable', s.afford)
  ref.card.classList.toggle('owned', !!s.done)
  const p = s.afford || s.done ? 0 : Math.floor(Math.min(1, s.have / s.cost) * 50) * 2
  setStyle(ref.btn, '--p', p + '%')
}

export function flashBought(ref) {
  replay(ref.card, 'bought')
  replay(ref.lvl, 'tick')
}
