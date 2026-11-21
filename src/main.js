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
import { autoTick, collectOffline, addPlayTime } from './actions.js'
import { long } from './format.js'
import { renderHeader } from './ui/header.js'
import { renderPanel } from './ui/panel.js'
import { checkAwards } from './ui/awards.js'
import { renderRebirthButton } from './ui/rebirthButton.js'
import { DNA_ICON } from './ui/icons.js'
import { toast } from './ui/toast.js'
import { renderScreens } from './ui/screens.js'
import { showAutoTick } from './ui/clicks.js'
import { renderLocks } from './ui/locks.js'
import { goTo, renderSlide } from './ui/colonies.js'
import { renderAmbient } from './fx/ambient.js'
import { renderFx } from './fx/effects.js'
import { syncMusic } from './audio/music.js'
import './ui/settingsMenu.js'
import './ui/resetModal.js'

const saved = await loadGame()
if (saved) welcomeBack(saved)
if (import.meta.env.DEV) window.game = game // set levels from the console to try out stages
goTo(game.view, true)

function welcomeBack(saved) {
  Object.assign(game, cleanSave(saved))
  const { gain, secs } = collectOffline(game)
  const h = Math.floor(secs / 3600), m = Math.floor(secs % 3600 / 60)
  if (gain > 0) toast(`While dormant for ${h ? h + 'h ' : ''}${m}m your spores made ${DNA_ICON}${long(gain)}`)
  toast('Welcome back! Your progress was restored.')
}

let lastTick = performance.now()
function tick(now) {
  addPlayTime(game, (now - lastTick) / 1000)
  lastTick = now
  game.colonies.forEach((c, i) => showAutoTick(i, autoTick(game, i, now)))
  checkAwards(now)
}

function render(now, dt) {
  renderSlide(now)
  renderHeader(game, dt)
  renderScreens(dt)
  renderLocks()
  renderPanel()
  renderRebirthButton(now)
  renderAmbient(now, dt)
  renderFx(now)
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
syncMusic()

// Hidden tabs get no animation frames, so a slow timer keeps auto clicks going
setInterval(() => { if (document.hidden) tick(performance.now()) }, 1000)
setInterval(() => saveGame(game), 5000)
addEventListener('pagehide', () => saveGame(game))
