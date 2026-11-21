// Themes tab: buy solid colors with DNA, earn the others with achievements, and wear any you own
import { el } from './dom.js'
import { makeCard, updateCard, flashBought } from './card.js'
import { DNA_ICON } from './icons.js'
import { THEMES } from '../data/themes.js'
import { ACHIEVEMENTS } from '../data/achievements.js'
import { ownsTheme, buyTheme, equipTheme, applyTheme } from '../themes.js'
import { saveGame } from '../save.js'
import { playTink } from '../audio/sfx.js'
import { short } from '../format.js'
import { game } from '../state.js'

export const themesTab = el('div', 'upgrade-group')

function describe(t) {
  if (t.desc) return t.desc
  if (t.price) return 'A solid color, bought once with DNA'
  return `Unlocked by the “${ACHIEVEMENTS.find(a => a.id === t.achievement).name}” achievement`
}

const cards = THEMES.map(t => {
  const ref = makeCard(t.name, describe(t), () => choose(t, ref), 'theme-card')
  const swatch = el('div', 'theme-swatch theme-' + t.id)
  swatch.style.background = t.sky || (t.bg ? `radial-gradient(circle, ${t.panel}, ${t.bg})` : '')
  swatch.style.borderColor = t.accent || ''
  ref.card.prepend(swatch)
  themesTab.appendChild(ref.card)
  return ref
})

function choose(t, ref) {
  if (!(ownsTheme(game, t) ? equipTheme(game, t.id) : buyTheme(game, t.id))) return
  playTink()
  flashBought(ref)
  saveGame(game)
}

export function renderThemes() {
  THEMES.forEach((t, k) => {
    const owned = ownsTheme(game, t), worn = game.theme === t.id
    updateCard(cards[k], {
      lvl: t.kind, effect: owned ? 'Owned' : t.price ? '' : 'Locked',
      button: worn ? 'WEARING' : owned ? 'Wear' : t.price ? DNA_ICON + short(t.price) : 'Locked',
      afford: !worn && (owned || game.money >= t.price), have: t.price ? game.money : 0, cost: t.price || 1, done: worn
    })
  })
}

// Puts the worn theme on the page (only does work when it changes)
let worn = null
export function renderWornTheme() {
  if (worn === game.theme) return
  worn = game.theme
  applyTheme(worn)
}
