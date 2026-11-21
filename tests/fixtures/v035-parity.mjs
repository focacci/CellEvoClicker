// Makes v035-parity.json: what the v0.3.5 single-file game computes for a few saves.
// It runs the real v0.3.5 code (from the git tag) in a sandbox with a do-nothing page.
// Run again with: node tests/fixtures/v035-parity.mjs
import vm from 'node:vm'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { SAVES } from './v035-saves.js'
import { cleanSave } from '../../src/save.js'

const html = execSync('git show v0.3.5:CellEvoClicker.html', { encoding: 'utf8', maxBuffer: 1e8 })
const gameScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1]
const any = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'length' ? 0 : any),
  set: () => true, apply: () => any, construct: () => any
})

function oldGame() {
  const storage = { saved: null, getItem: () => null, setItem: (k, v) => { storage.saved = v }, removeItem() {} }
  const ctx = vm.createContext({
    document: any, window: any, indexedDB: any, Path2D: any, localStorage: storage, performance, Math, Date, JSON, Promise,
    Set, Map, Float32Array, Number, String, Array, Object, requestAnimationFrame() {}, setTimeout() {}, clearTimeout() {}, setInterval() {}
  })
  vm.runInContext(gameScript, ctx)
  return { run: (code) => vm.runInContext(code, ctx), resave: () => { vm.runInContext('save()', ctx); return without(JSON.parse(storage.saved), 't') } }
}

const without = (o, key) => { const c = { ...o }; delete c[key]; return c }
const KEYS = 'UPGRADES.map(u => u.key)'

// Everything the old game computes for one save, read straight from its own functions
function measure(save) {
  const old = oldGame()
  old.run(`load(${JSON.stringify(save)}); goToScreen(game.pending ? 0 : Math.floor(num0(${JSON.stringify(save.view)})), true)`)
  const colonies = old.run(`colonies.map(c => ({
    costs: ${KEYS}.map(k => c.cost(k)), revealed: UPGRADES.map(u => c.isRevealed(u)), maxed: ${KEYS}.map(k => c.isMaxed(k)),
    click: c.manualPerCell(), auto: c.passivePerCell(), perSecond: c.passivePerSecond(), critMult: c.critMult(),
    stage: stageForLevels(c.totalLevels()), cells: c.cellCount(), stats: c.stats }))`)
  const rebirth = old.run('(() => { const total = rebirthGain() + game.rdnaFrac, whole = Math.floor(total); return { total, whole, frac: Math.max(0, total - whole) } })()')
  const offline = old.run(`has('spores') && !game.pending ? colonies.reduce((a, c) => a + c.passivePerSecond(), 0) * 3600 * 0.5 : 0`)
  const totalPerSecond = old.run('colonies.reduce((a, c) => a + c.passivePerSecond(), 0)')
  const resaved = old.resave()
  // The same save after 1.0.0 cleaned it and added its new fields: does v0.3.5 still read it the same?
  const back = oldGame()
  back.run(`load(${JSON.stringify(cleanSave(save))}); goToScreen(game.pending ? 0 : Math.floor(num0(${JSON.stringify(save.view)})), true)`)
  return { colonies, rebirth, offline, totalPerSecond, resaved, oldReadsNew: back.resave() }
}

writeFileSync(new URL('./v035-parity.json', import.meta.url), JSON.stringify(SAVES.map(measure), null, 1) + '\n')
console.log(`wrote ${SAVES.length} scenarios`)
