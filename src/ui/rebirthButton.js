// The Rebirth button under the panel. It fills up toward 10 Trillion DNA; click it twice to confirm.
import { $, setText, setHTML, setStyle, replay } from './dom.js'
import { DNA_ICON, RNA_ICON } from './icons.js'
import { pop } from './header.js'
import { toast } from './toast.js'
import { goTo } from './colonies.js'
import { pane } from './pane.js'
import { REBIRTH_REQ, rebirthGain } from '../rules.js'
import { rebirth } from '../actions.js'
import { saveGame } from '../save.js'
import { commas, long } from '../format.js'
import { game } from '../state.js'

const bar = $('#rebirth-bar'), button = $('#rebirth-btn')
let armedAt = 0 // when the first click happened; 0 = not waiting for a confirm

button.addEventListener('click', () => {
  if (game.pending || game.money < REBIRTH_REQ) return
  if (!armedAt) armedAt = performance.now()
  else startRebirth()
})

// RNA with two decimals, rounded down so it never overstates: "12.37"
function rnaAmount(total) {
  const whole = Math.floor(total), dec = Math.floor((total - whole) * 100) / 100
  return commas(whole) + (dec > 0 ? dec.toFixed(2).slice(1) : '')
}

const rnaLabel = (color) => `<span style="color:var(${color})">${RNA_ICON}</span>RNA`

export function renderRebirthButton(now) {
  bar.classList.toggle('hidden', game.pending)
  const ready = game.money >= REBIRTH_REQ
  if (armedAt && (!ready || now - armedAt > 4000)) armedAt = 0
  setText($('#rb-title'), armedAt ? 'Click again to confirm' : 'Rebirth')
  setHTML($('#rb-sub'), !ready ? `Requires ${DNA_ICON}${long(REBIRTH_REQ, true)}`
    : armedAt ? 'Resets mutations and colonies. Rebirth mutations are kept.'
      : `Gain +${rnaAmount(rebirthGain(game) + game.frac)} ${rnaLabel('--rebirth-text')}`)
  button.classList.toggle('ready', ready)
  button.classList.toggle('confirm', !!armedAt)
  setStyle($('#rb-fill'), 'width', (ready ? 100 : Math.floor(game.money / REBIRTH_REQ * 200) / 2) + '%')
}

// A purple flash covers the reset
function startRebirth() {
  armedAt = 0
  replay($('#rebirth-flash'), 'go')
  setTimeout(() => {
    goTo(0, pane.slide === 0)
    const total = rebirth(game)
    if (!total) return
    pop('rna')
    toast(`Reborn! +${rnaAmount(total)} ${rnaLabel('--rebirth')}`, 'purple')
    saveGame(game)
  }, 380)
}
