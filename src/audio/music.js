// Ambient music: a slow Cmaj7 → Am9 → Fmaj7 → G6 pad loop, a new chord every 6 seconds.
// It plays whenever the Music volume is above 0 (there is no on/off button).
import { audio } from './ctx.js'
import { settings } from '../settings.js'

const LEVEL = 0.1 // quiet, but present
const midi = (n) => 440 * 2 ** ((n - 69) / 12)
// bass: one low root, tones: the chord around middle C, bells: soft notes floating on top
const CHORDS = [
  { bass: 48, tones: [55, 64, 71], bells: [76, 79, 83] },
  { bass: 45, tones: [60, 64, 67, 71], bells: [72, 76, 79] },
  { bass: 41, tones: [60, 64, 69], bells: [72, 77, 81] },
  { bass: 43, tones: [59, 62, 64], bells: [71, 74, 79] }
]
let main = null, pads = null, wave = null
let chord = 0, timer = null, playing = false
const level = () => LEVEL * settings.music

// A short stereo noise burst with a fading tail sounds like a soft room
function room(seconds, decay) {
  const len = Math.floor(audio.sampleRate * seconds)
  const buf = audio.createBuffer(2, len, audio.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay
  }
  return buf
}

// Pads → low-pass → dry + reverb → volume → trim → soft limiter. Music skips the effects compressor,
// so clicking can't make the pads pump.
function build() {
  const limiter = audio.createDynamicsCompressor()
  Object.entries({ threshold: -10, knee: 8, ratio: 6, attack: 0.02, release: 0.5 }).forEach(([k, v]) => { limiter[k].value = v })
  limiter.connect(audio.destination)
  const trim = audio.createGain()
  trim.gain.value = 2.7
  trim.connect(limiter)
  main = audio.createGain()
  main.connect(trim)
  pads = audio.createBiquadFilter()
  pads.type = 'lowpass'
  pads.frequency.value = 2400
  pads.Q.value = 0.4
  const dry = audio.createGain(), wet = audio.createGain(), verb = audio.createConvolver()
  dry.gain.value = 0.85
  wet.gain.value = 0.45
  verb.buffer = room(3.2, 2.6)
  pads.connect(dry).connect(main)
  pads.connect(verb).connect(wet).connect(main)
  // A warm, round tone: the fundamental plus a few quiet overtones
  wave = audio.createPeriodicWave(new Float32Array(6), new Float32Array([0, 1, 0.3, 0.1, 0.04, 0.015]))
}

// One pad note. spread = two slightly detuned copies panned left and right for a calm shimmer.
function pad(freq, start, length, peak, spread) {
  const env = audio.createGain()
  env.gain.setValueAtTime(0, start)
  env.gain.linearRampToValueAtTime(peak, start + 1.5)
  env.gain.exponentialRampToValueAtTime(0.001, start + length)
  env.connect(pads)
  for (const cents of spread ? [-5, 5] : [0]) {
    const osc = audio.createOscillator()
    osc.setPeriodicWave(wave)
    osc.frequency.value = freq
    osc.detune.value = cents
    if (spread) osc.connect(panner(cents > 0 ? 0.35 : -0.35)).connect(env)
    else osc.connect(env)
    osc.start(start)
    osc.stop(start + length + 0.05)
  }
}

function panner(value) {
  const pan = audio.createStereoPanner()
  pan.pan.value = value
  return pan
}

// A soft glassy bell: a pure tone plus a quiet octave
function bell(freq, start, peak) {
  const env = audio.createGain()
  env.gain.setValueAtTime(0, start)
  env.gain.linearRampToValueAtTime(peak, start + 0.02)
  env.gain.exponentialRampToValueAtTime(0.001, start + 2.8)
  env.connect(pads)
  for (const [overtone, gain] of [[1, 1], [2, 0.25]]) {
    const osc = audio.createOscillator(), g = audio.createGain()
    osc.frequency.value = freq * overtone
    g.gain.value = gain
    osc.connect(g).connect(env)
    osc.start(start)
    osc.stop(start + 2.9)
  }
}

// Bass first, then the chord tones staggered like a harp, then two quiet bells
function playChord() {
  const now = audio.currentTime + 0.05, c = CHORDS[chord]
  pad(midi(c.bass), now, 7, 0.3, false)
  c.tones.forEach((n, k) => pad(midi(n), now + (k + 1) * 0.4, 7, 0.13, true))
  bell(midi(c.bells[chord % c.bells.length]), now + 2.2, 0.07)
  bell(midi(c.bells[(chord + 2) % c.bells.length]), now + 3.8, 0.055)
  chord = (chord + 1) % CHORDS.length
  timer = setTimeout(playChord, 6000)
}

// Moves the music volume from where it is now. how(gain, t) adds the new automation.
function automate(how) {
  const g = main.gain, t = audio.currentTime
  g.cancelScheduledValues(t)
  g.setValueAtTime(g.value, t)
  how(g, t)
}

// Starts, stops or re-levels the music to match the Music slider. Notes are only scheduled while
// the audio engine runs, otherwise they would pile up and all play at once.
export function syncMusic() {
  if (!main) build()
  if (settings.music > 0 && audio.state === 'running' && !playing) {
    playing = true
    automate((g, t) => g.setValueAtTime(level(), t))
    clearTimeout(timer)
    playChord()
  } else if (settings.music === 0 && playing) {
    playing = false
    clearTimeout(timer)
    automate((g, t) => g.linearRampToValueAtTime(0, t + 1)) // the last notes fade out gracefully
  } else if (playing) automate((g, t) => g.setTargetAtTime(level(), t, 0.05))
}

audio.addEventListener('statechange', syncMusic)

// Effects briefly dip the music (like a radio DJ talking over a song) so clicks and purchases stand out
export function duckMusic() {
  if (!playing) return
  automate((g, t) => {
    g.linearRampToValueAtTime(level() * 0.6, t + 0.02)
    g.setTargetAtTime(level(), t + 0.08, 0.15)
  })
}
