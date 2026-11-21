// Start-up and the game loop: tick() then render() every frame, plus autosave
import './styles/base.css'
import './styles/header.css'
import './styles/colony.css'
import './styles/stage.css'
import './styles/cells.css'
import './styles/panel.css'
import './styles/popups.css'
import { game } from './state.js'
import { loadGame, cleanSave, saveGame } from './save.js'
import { autoTick } from './actions.js'
import { $ } from './ui/dom.js'
import { renderHeader } from './ui/header.js'
import { mutationsTab, renderMutations } from './ui/mutationsTab.js'
import { toast } from './ui/toast.js'
import { renderScreens } from './ui/screens.js'
import './ui/clicks.js'

const saved = await loadGame()
if (saved) {
  Object.assign(game, cleanSave(saved))
  toast('Welcome back! Your progress was restored.')
}
if (import.meta.env.DEV) window.game = game // set levels from the console to try out stages
$('#upgrades-container').appendChild(mutationsTab)
mutationsTab.classList.add('active')

function tick(now) {
  game.colonies.forEach((c, i) => autoTick(game, i, now))
}

function render(now, dt) {
  renderHeader(game, dt)
  renderScreens()
  renderMutations(game.view)
}

let last = performance.now()
function frame(now) {
  requestAnimationFrame(frame)
  const dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
  last = now
  tick(now)
  render(now, dt)
}
requestAnimationFrame(frame)

// Hidden tabs get no animation frames, so a slow timer keeps auto clicks going
setInterval(() => { if (document.hidden) tick(performance.now()) }, 1000)
setInterval(() => saveGame(game), 5000)
addEventListener('pagehide', () => saveGame(game))
