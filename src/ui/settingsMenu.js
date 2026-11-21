// The Settings pop-up: Sound (volume sliders), Visual (on/off switches) and Game (Reset)
import { $ } from './dom.js'
import { openModal, closeModal } from './modal.js'
import { settings, saveSettings } from '../settings.js'
import { syncMusic } from '../audio/music.js'
import { setSfxVolume, playClick } from '../audio/sfx.js'

const modal = $('#settings-modal')
$('#settings-btn').addEventListener('click', () => openModal(modal))
modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal))
$('#reset-open').addEventListener('click', () => openModal($('#reset-modal')))

// Sound: shows a volume on its slider (position, % label and the colored fill)
function paintSlider(k) {
  const pct = Math.round(settings[k] * 100), slider = $('#vol-' + k)
  slider.value = pct
  $(`#vol-${k}-val`).textContent = pct + '%'
  slider.style.setProperty('--fill', (pct / 150 * 100).toFixed(1) + '%')
}

for (const k of ['music', 'sfx']) {
  paintSlider(k)
  $('#vol-' + k).addEventListener('input', (e) => {
    settings[k] = Number(e.target.value) / 100
    paintSlider(k)
    if (k === 'music') syncMusic()
    else setSfxVolume(settings.sfx)
    saveSettings()
  })
}
$('#vol-sfx').addEventListener('change', playClick) // hear the new effects level on release

// Visual: each switch turns a class on the page on or off.
// (Slow cell rotation is read by the cell mass every frame.)
export function applyVisuals() {
  const page = document.body.classList
  page.toggle('hide-name', settings.hideName)
  page.toggle('hide-earnings', settings.hideEarnings)
  page.toggle('center-currency', settings.centerCurrency)
}

for (const box of modal.querySelectorAll('[data-setting]')) {
  box.checked = settings[box.dataset.setting]
  box.addEventListener('change', () => {
    settings[box.dataset.setting] = box.checked
    saveSettings()
    applyVisuals()
  })
}
applyVisuals()
