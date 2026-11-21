// Mutations tab: the viewed colony's mutation cards, plus a teaser for the next one
import { el, setText, setStyle } from './dom.js'
import { makeCard, updateCard, flashBought } from './card.js'
import { DNA_ICON, TEASER_LOCK } from './icons.js'
import { MUTATIONS, MUTATION } from '../data/mutations.js'
import { COLONIES } from '../data/colonies.js'
import * as R from '../rules.js'
import { short } from '../format.js'
import { buyMutation } from '../actions.js'
import { saveGame } from '../save.js'
import { game } from '../state.js'

export const mutationsTab = el('div', 'upgrade-group')
const teaser = el('div', 'upgrade-card teaser', TEASER_LOCK +
  '<div class="upgrade-info"><div class="upgrade-name">Unknown Mutation</div>' +
  '<div class="upgrade-desc"></div><div class="teaser-bar"><i></i></div></div>')
const teaserText = teaser.querySelector('.upgrade-desc')
const teaserFill = teaser.querySelector('.teaser-bar > i')
mutationsTab.appendChild(teaser)
let cards = {}
let shownColony = -1

const EFFECTS = {
  clickPower: (g, i, L) => `+${DNA_ICON}${short(R.clickPowerAt(L.clickPower) * COLONIES[i].yieldScale)} / click`,
  clickCooldown: (g, i) => `${R.clickCooldown(g, i)}ms latency`,
  autoClickPower: (g, i, L) => `+${DNA_ICON}${short(R.autoPowerAt(L.autoClickPower) * COLONIES[i].yieldScale)} power`,
  autoClickCooldown: (g, i) => `${(R.autoCooldown(g, i) / 1000).toFixed(2)}s pace`,
  ribosomalSynthesis: (g, i, L) => `+${L.ribosomalSynthesis * 25}% manual`,
  chloroplastSymbiosis: (g, i, L) => `+${L.chloroplastSymbiosis * 25}% passive`,
  critChance: (g, i) => `${short(R.critChance(g, i))}% chance`,
  autoCritChance: (g, i) => `${short(R.autoCritChance(g, i))}% chance`,
  critPower: (g, i) => `x${R.critMult(g, i)} crit yield`,
  endocyticUptake: (g, i, L) => `${L.endocyticUptake * 10}% absorbed`,
  extraCells: (g, i) => { const n = R.cellCount(g, i); return `${n} ${n === 1 ? 'cell' : 'cells'}` },
  telomerase: (g, i, L) => (L.telomerase ? `-${L.telomerase * 3}% cost` : '0% cost')
}

export function renderMutations(i) {
  const stale = MUTATIONS.some(m => cards[m.key] && !R.isRevealed(game, i, m.key))
  if (i !== shownColony || stale) rebuild(i)
  for (const m of MUTATIONS) if (!cards[m.key] && R.isRevealed(game, i, m.key)) addCard(i, m, true)
  for (const key in cards) updateCard(cards[key], cardState(i, key))
  renderTeaser(i)
}

// New colony on screen (or a rebirth): rebuild the cards without the reveal animation
function rebuild(i) {
  for (const key in cards) cards[key].card.remove()
  cards = {}
  shownColony = i
  for (const m of MUTATIONS) if (R.isRevealed(game, i, m.key)) addCard(i, m, false)
}

// Cards stay in unlock order, above the teaser
function addCard(i, m, animate) {
  const ref = makeCard(m.label, m.desc, () => buy(i, m.key))
  if (animate) ref.card.classList.add('reveal')
  const after = MUTATIONS.slice(MUTATIONS.indexOf(m) + 1).find(n => cards[n.key])
  mutationsTab.insertBefore(ref.card, after ? cards[after.key].card : teaser)
  cards[m.key] = ref
}

function buy(i, key) {
  if (!buyMutation(game, i, key)) return
  flashBought(cards[key])
  saveGame(game)
}

function cardState(i, key) {
  const L = game.colonies[i].levels
  const s = { lvl: `Lvl ${L[key]}`, effect: EFFECTS[key](game, i, L) }
  if (R.isMaxed(game, i, key)) return { ...s, button: 'MAXED', afford: false, done: true }
  const cost = R.mutationCost(game, i, key)
  const have = game.colonies[i].unlocked && !game.pending ? game.money : 0
  return { ...s, button: DNA_ICON + short(cost), afford: have >= cost, have, cost }
}

function renderTeaser(i) {
  const next = MUTATIONS.find(m => !cards[m.key])
  const show = game.colonies[i].unlocked && next
  setStyle(teaser, 'display', show ? '' : 'none')
  if (!show) return
  const need = R.reqLevel(game, next.req[1])
  const have = Math.min(need, game.colonies[i].levels[next.req[0]])
  setText(teaserText, `Reach Lvl ${need} ${MUTATION[next.req[0]].label} to unlock (${have}/${need})`)
  setStyle(teaserFill, 'width', have / need * 100 + '%')
}
