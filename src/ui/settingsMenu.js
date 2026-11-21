// Settings: the Sound section (Music and Effects volume sliders)
import { $ } from './dom.js'
import { settings, saveSettings } from '../settings.js'
import { syncMusic } from '../audio/music.js'
import { setSfxVolume, playClick } from '../audio/sfx.js'

const button = $('#volume-btn'), panel = $('#volume-panel'), wrap = $('#volume-wrap')

// Shows a volume on its slider: position, % label and the colored fill
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

function setOpen(open) {
  panel.classList.toggle('open', open)
  button.setAttribute('aria-expanded', open)
}
button.addEventListener('click', () => setOpen(!panel.classList.contains('open')))
document.addEventListener('pointerdown', (e) => { if (!wrap.contains(e.target)) setOpen(false) })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false) })
