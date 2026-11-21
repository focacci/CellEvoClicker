// Player settings: volumes and visual options. Saved apart from the game, so a full reset keeps them.
import { storage } from './save.js'

export const SETTINGS_KEY = 'cellEvoClicker.settings'
const DEFAULTS = { music: 1, sfx: 1, hideName: false, hideEarnings: false, centerCurrency: false, slowRotate: true }

function readJson(text) {
  try { return JSON.parse(text) } catch { return null }
}

// Keeps only known settings with the right type. Volumes go from 0 (off) to 1.5 (150%).
export function cleanSettings(d) {
  const s = { ...DEFAULTS }
  for (const k in DEFAULTS) {
    const v = d?.[k]
    if (typeof v === typeof s[k] && (typeof v !== 'number' || Number.isFinite(v))) s[k] = v
  }
  s.music = Math.min(1.5, Math.max(0, s.music))
  s.sfx = Math.min(1.5, Math.max(0, s.sfx))
  return s
}

// The first time 1.0.0 runs, the volumes come from v0.3.5's keys and music that was
// switched off stays off. Then the two old keys are deleted.
export function loadSettings(store) {
  if (!store) return { ...DEFAULTS }
  const saved = readJson(store.getItem(SETTINGS_KEY))
  if (saved) return cleanSettings(saved)
  const s = cleanSettings(readJson(store.getItem('cellEvoClicker.volume')))
  if (store.getItem('cellEvoClicker.music') === 'off') s.music = 0
  store.removeItem('cellEvoClicker.volume')
  store.removeItem('cellEvoClicker.music')
  store.setItem(SETTINGS_KEY, JSON.stringify(s))
  return s
}

export const settings = loadSettings(storage)

export function saveSettings() {
  storage?.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
