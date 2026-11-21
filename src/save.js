// Saving in this browser. The save is the `game` object as JSON, under the same key as v0.3.5.
import { newGame } from './state.js'
import { MUTATIONS } from './data/mutations.js'
import { REBIRTH } from './data/rebirth.js'
import { ACHIEVEMENTS } from './data/achievements.js'

export const SAVE_KEY = 'cellEvoClicker.save.v2'

// Storage can be blocked (e.g. in a sandboxed frame): then the game still runs, it just can't save
export const storage = (() => { try { return localStorage } catch { return null } })()

let blocked = false

export function saveGame(game) {
  if (blocked || !storage) return
  game.t = Date.now()
  storage.setItem(SAVE_KEY, JSON.stringify(game))
}

export function parseSave(json) {
  try {
    const d = JSON.parse(json)
    return d && d.v === 2 ? d : null
  } catch {
    return null
  }
}

// A real number ≥ 0, or 0
export function cleanNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0
}

const validIds = (list, valid) => (Array.isArray(list) ? [...new Set(list)].filter(id => valid.includes(id)) : [])

// Builds a full game from a save: missing fields get defaults, bad values are dropped
export function cleanSave(d) {
  const g = newGame()
  for (const k of ['t', 'money', 'played']) g[k] = cleanNumber(d[k])
  for (const k of ['rdna', 'earned', 'rebirths']) g[k] = Math.floor(cleanNumber(d[k]))
  for (const k in g.totals) g.totals[k] = cleanNumber(d.totals?.[k])
  g.frac = Math.min(0.999999, cleanNumber(d.frac))
  g.owned = validIds(d.owned, REBIRTH.map(r => r.id))
  g.achievements = validIds(d.achievements, ACHIEVEMENTS.map(a => a.id))
  g.pending = !!d.pending
  g.view = g.pending ? 0 : Math.min(2, Math.floor(cleanNumber(d.view)))
  g.colonies.forEach((c, i) => cleanColony(c, Array.isArray(d.colonies) ? d.colonies[i] : null))
  return g
}

function cleanColony(c, saved) {
  if (!saved) return
  for (const m of MUTATIONS) c.levels[m.key] = Math.min(m.max ?? Infinity, Math.floor(cleanNumber(saved.levels?.[m.key])))
  c.unlocked = c.unlocked || !!saved.unlocked
}

// v0.3.5 also kept a copy in IndexedDB. Read it once when localStorage has no save,
// and never write it again. (Delete this a few months after 1.0.0.)
export function readOldBackup() {
  return new Promise(resolve => {
    if (typeof indexedDB === 'undefined') return resolve(null)
    const req = indexedDB.open('cellEvoClicker', 1)
    req.onupgradeneeded = () => req.transaction.abort() // no old copy: don't create one
    req.onerror = () => resolve(null)
    req.onsuccess = () => {
      const db = req.result, get = db.transaction('save').objectStore('save').get(SAVE_KEY)
      get.onsuccess = get.onerror = () => {
        db.close()
        resolve(get.result ?? null)
      }
    }
  })
}

export async function loadGame() {
  return parseSave(storage?.getItem(SAVE_KEY)) ?? parseSave(await readOldBackup())
}

// Full reset: erase the save (and the old IndexedDB copy). Settings live under their own key and stay.
export function wipeSave() {
  blocked = true
  storage?.removeItem(SAVE_KEY)
  return new Promise(resolve => {
    if (typeof indexedDB === 'undefined') return resolve()
    const req = indexedDB.deleteDatabase('cellEvoClicker')
    req.onsuccess = req.onerror = req.onblocked = () => resolve()
  })
}
