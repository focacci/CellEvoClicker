// Sound effects: the soft pop when a cell is clicked and the "tink" of a purchase
import { audio, resumeAudio } from './ctx.js'
import { duckMusic } from './music.js'
import { settings } from '../settings.js'

const CLICK = 0.55 // raised so it cuts through the music
const TINK = 0.24

// Final volume knob (after the compressor, so it scales every effect evenly)
const volume = audio.createGain()
volume.gain.value = settings.sfx
volume.connect(audio.destination)

// A gentle compressor lifts quiet sounds at low device volume and keeps peaks from blasting
const bus = audio.createDynamicsCompressor()
Object.entries({ threshold: -14, knee: 12, ratio: 2.5, attack: 0.004, release: 0.25 }).forEach(([k, v]) => { bus[k].value = v })
const makeup = audio.createGain()
makeup.gain.value = 1.3
bus.connect(makeup)
makeup.connect(volume)

export function setSfxVolume(v) {
  volume.gain.setTargetAtTime(v, audio.currentTime, 0.02)
}

// A sine that slides from `from` Hz down to `to` Hz while fading out
function blip(from, to, level, seconds, attack = 0, filter = null) {
  const t = audio.currentTime
  const osc = audio.createOscillator(), gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + seconds)
  gain.gain.setValueAtTime(attack ? 0 : level, t)
  if (attack) gain.gain.linearRampToValueAtTime(level, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.001, t + seconds)
  osc.connect(filter || gain)
  if (filter) filter.connect(gain)
  gain.connect(bus)
  osc.start(t)
  osc.stop(t + seconds)
}

// A soft low "thump" with a quieter higher pop on top, so it is audible on laptop speakers
export function playClick() {
  resumeAudio()
  const lowpass = audio.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 800
  blip(120, 40, CLICK, 0.08, 0, lowpass)
  blip(360, 140, CLICK * 0.4, 0.06)
  duckMusic()
}

// A smooth downward "tink" from 600 Hz to 150 Hz
export function playTink() {
  resumeAudio()
  blip(600, 150, TINK, 0.15, 0.01)
  duckMusic()
}
