import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSave, cleanSave, cleanNumber } from '../src/save.js'
import { newGame } from '../src/state.js'

// Exactly what v0.3.5 writes to localStorage (cellEvoClicker.save.v2)
const LEVELS = { clickPower: 61, clickCooldown: 10, autoClickPower: 77, autoClickCooldown: 12, ribosomalSynthesis: 33, chloroplastSymbiosis: 21, critChance: 20, autoCritChance: 3, critPower: 2, endocyticUptake: 5, extraCells: 12, telomerase: 3 }
const OLD_SAVE = JSON.stringify({
  v: 2, t: 1795000000000, money: 123456789.5, rdna: 42, frac: 0.37, earned: 180, rebirths: 7,
  owned: ['primordial', 'memory', 'leap'], pending: false, view: 1,
  colonies: [{ unlocked: true, levels: LEVELS }, { unlocked: true, levels: { ...LEVELS, clickPower: 5 } }, { unlocked: false, levels: { ...LEVELS, clickPower: 0 } }]
})

test('an old v0.3.5 save loads with the same DNA, RNA and levels', () => {
  const g = cleanSave(parseSave(OLD_SAVE))
  assert.equal(g.money, 123456789.5)
  assert.equal(g.rdna, 42)
  assert.equal(g.frac, 0.37)
  assert.equal(g.earned, 180)
  assert.equal(g.rebirths, 7)
  assert.deepEqual(g.owned, ['primordial', 'memory', 'leap'])
  assert.equal(g.view, 1)
  assert.deepEqual(g.colonies[0].levels, LEVELS)
  assert.equal(g.colonies[1].levels.clickPower, 5)
  assert.deepEqual(g.colonies.map(c => c.unlocked), [true, true, false])
})

test('an old save gets the new fields with their defaults', () => {
  const g = cleanSave(parseSave(OLD_SAVE))
  assert.equal(g.played, 0)
  assert.deepEqual(g.totals, { clicks: 0, crits: 0, dna: 0 })
  assert.deepEqual(g.achievements, [])
  assert.deepEqual(g.themes, [])
  assert.equal(g.theme, 'classic')
})

test('a new save keeps every v0.3.5 field name and type, so the old game can still read it', () => {
  const saved = JSON.parse(JSON.stringify(cleanSave(parseSave(OLD_SAVE))))
  const old = JSON.parse(OLD_SAVE)
  for (const k in old) assert.equal(typeof saved[k], typeof old[k], k)
  assert.equal(saved.v, 2)
  assert.ok(Array.isArray(saved.owned) && Array.isArray(saved.colonies))
  assert.deepEqual(Object.keys(saved.colonies[0]), ['unlocked', 'levels'])
})

test('saving and loading again changes nothing', () => {
  const g = cleanSave(parseSave(OLD_SAVE))
  assert.deepEqual(cleanSave(JSON.parse(JSON.stringify(g))), g)
})

test('bad values are cleaned like v0.3.5 did', () => {
  const g = cleanSave({
    v: 2, money: -5, rdna: 3.9, frac: 4, earned: NaN, rebirths: 'x', owned: ['apex', 'bogus', 'apex'], pending: true, view: 2,
    colonies: [{ levels: { clickPower: 1e3, critChance: 99, extraCells: -1 } }, { unlocked: 1 }, 'junk'],
    totals: { clicks: Infinity, crits: 5 }
  })
  assert.equal(g.money, 0)
  assert.equal(g.rdna, 3)
  assert.equal(g.frac, 0.999999)
  assert.equal(g.earned, 0)
  assert.equal(g.rebirths, 0)
  assert.deepEqual(g.owned, ['apex'])
  assert.equal(g.view, 0, 'a dormant game always shows Colony I')
  assert.equal(g.colonies[0].levels.clickPower, 1000)
  assert.equal(g.colonies[0].levels.critChance, 20, 'levels are capped at max')
  assert.equal(g.colonies[0].levels.extraCells, 0)
  assert.deepEqual(g.colonies.map(c => c.unlocked), [true, true, false])
  assert.deepEqual(g.totals, { clicks: 0, crits: 5, dna: 0 })
})

test('only v2 saves are accepted', () => {
  assert.equal(parseSave('not json'), null)
  assert.equal(parseSave(null), null)
  assert.equal(parseSave('{"v":1,"money":5}'), null)
  assert.equal(cleanNumber(7), 7)
  assert.equal(cleanNumber('7'), 0)
})

test('a fresh game saves with v: 2 and the old field names', () => {
  const keys = Object.keys(newGame())
  for (const k of ['v', 't', 'money', 'rdna', 'frac', 'earned', 'rebirths', 'owned', 'pending', 'view', 'colonies']) assert.ok(keys.includes(k), k)
})

test('achievements in a save keep only known ids', () => {
  const g = cleanSave({ v: 2, achievements: ['first-click', 'nope', 'first-click', 'immortality'] })
  assert.deepEqual(g.achievements, ['first-click', 'immortality'])
})
