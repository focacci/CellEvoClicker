// Expected numbers come from the v0.3.5 single-file game (CellEvoClicker.html).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as R from '../src/rules.js'
import { newGame } from '../src/state.js'
import { STAGES } from '../src/data/stages.js'
import { MUTATIONS } from '../src/data/mutations.js'
import { REBIRTH } from '../src/data/rebirth.js'
import { commas, long, short } from '../src/format.js'

const FULL = { clickPower: 30, clickCooldown: 10, autoClickPower: 40, autoClickCooldown: 12, ribosomalSynthesis: 12, chloroplastSymbiosis: 9, critChance: 20, autoCritChance: 14, critPower: 8, endocyticUptake: 10, extraCells: 36, telomerase: 10 }

function gameWith(levels, owned = [], i = 0) {
  const g = newGame()
  g.owned = owned
  g.colonies[i].unlocked = true
  Object.assign(g.colonies[i].levels, levels)
  return g
}

test('click and auto power curves double every 25 levels', () => {
  assert.deepEqual([0, 1, 2, 5, 24, 25, 26, 50, 100].map(R.clickPowerAt), [1, 3, 6, 17, 193, 414, 444, 2904, 43216])
  assert.deepEqual([0, 1, 2, 5, 24, 25, 26, 50, 100].map(R.autoPowerAt), [0, 1, 3, 15, 254, 550, 592, 4200, 65600])
})

test('stage thresholds', () => {
  assert.deepEqual(STAGES.map(s => s.min), [0, 5, 15, 25, 35, 48, 62, 78, 95, 120, 155, 195, 240, 290, 335, 370, 400, 435, 480, 540, 1000])
  assert.deepEqual([0, 4, 5, 539, 540, 999, 1000, 5000].map(R.stageIndex), [0, 0, 1, 18, 19, 19, 20, 20])
  assert.equal(STAGES[19].name, 'Immortal Cell')
  assert.equal(STAGES[20].name, 'Transcendent Cell')
  assert.ok(STAGES[20].hidden && STAGES[20].glitch && !STAGES[20].fact)
})

test('stage progress bar', () => {
  assert.equal(R.stageProgress(gameWith({ clickPower: 10 }), 0), 0.5)
  assert.equal(R.stageProgress(gameWith({ clickPower: 600 }), 0), 1)
  assert.equal(R.stageProgress(gameWith({ clickPower: 1000 }), 0), 1)
})

test('prices on a fresh game', () => {
  const g = newGame()
  assert.deepEqual(MUTATIONS.map(m => R.mutationCost(g, 0, m.key)), [10, 60, 150, 400, 1500, 4000, 12000, 25000, 60000, 150000, 500000, 5000000])
})

test('prices with telomerase, discounts and colony scale', () => {
  const g = gameWith(FULL, ['telo1', 'telo2', 'hyperplasia', 'lucky', 'leap', 'primordial'], 1)
  assert.equal(R.mutationCost(g, 1, 'clickPower'), 73430640870)
  assert.equal(R.mutationCost(g, 1, 'extraCells'), 38909778751352410000)
  assert.equal(R.mutationCost(g, 1, 'telomerase'), 314979082176595300)
  assert.equal(R.mutationCost(g, 1, 'critChance'), 647379776403634)
})

test('click power, auto power, crits and DNA per second', () => {
  const g = gameWith(FULL, ['telo1', 'telo2', 'hyperplasia', 'lucky', 'leap', 'primordial'], 1)
  assert.equal(R.clickYield(g, 1), 16536664428.613577)
  assert.equal(R.autoYield(g, 1), 9458081880.75466)
  assert.equal(R.autoPerSecond(g, 1), 3499490295879.224)
  assert.equal(R.critMult(g, 1), 100)
  assert.equal(R.stageOf(g, 1), 11)
  assert.equal(R.cellCount(g, 1), 37)
})

test('every rebirth mutation together', () => {
  const g = gameWith(FULL, REBIRTH.map(r => r.id))
  g.earned = 1234
  assert.equal(R.clickYield(g, 0), 2547969255.16078)
  assert.equal(R.autoYield(g, 0), 1457301256.186678)
})

test('fresh cell makes 1 DNA per click and nothing passive', () => {
  const g = newGame()
  assert.equal(R.clickYield(g, 0), 1)
  assert.equal(R.autoPerSecond(g, 0), 0)
})

test('cooldowns and crit chances are clamped by the level caps', () => {
  const g = gameWith(FULL)
  assert.equal(R.clickCooldown(g, 0), 50)
  assert.equal(R.autoCooldown(g, 0), 100)
  assert.equal(R.critChance(g, 0), 10)
  assert.equal(R.autoCritChance(g, 0), 7)
  assert.equal(R.critMult(newGame(), 0), 10)
})

test('mutations unlock in order and Genetic Memory halves the requirement', () => {
  const g = gameWith({ clickPower: 3 })
  assert.equal(R.isRevealed(g, 0, 'clickCooldown'), false)
  g.owned = ['memory']
  assert.equal(R.isRevealed(g, 0, 'clickCooldown'), true)
  assert.equal(R.reqLevel(g, 5), 3)
  assert.equal(R.isRevealed(newGame(), 1, 'clickPower'), true)
  assert.equal(R.isRevealed(newGame(), 1, 'clickCooldown'), false)
  assert.equal(R.isMaxed(gameWith({ clickCooldown: 10 }), 0, 'clickCooldown'), true)
  assert.equal(R.isMaxed(gameWith({ clickPower: 900 }), 0, 'clickPower'), false)
})

test('RNA gain is the square root of DNA over 10 Trillion', () => {
  const g = newGame()
  for (const [money, rna] of [[9.99e12, 0], [10e12, 1], [4e13, 2], [1e20, 3162.2776601683795]]) {
    g.money = money
    assert.equal(R.rebirthGain(g), rna)
  }
})

test('Dormant Spores pay 50% for up to 12 hours, after 30 seconds', () => {
  const g = gameWith({ autoClickPower: 1 }, ['spores'])
  assert.equal(R.offlineGain(g, 3600), 1800)
  assert.equal(R.offlineGain(g, 29), 0)
  assert.equal(R.offlineGain(g, 99 * 3600), 12 * 3600 * 0.5)
  assert.equal(R.offlineGain(gameWith({ autoClickPower: 1 }), 3600), 0)
})

test('number formatting', () => {
  assert.equal(commas(1234567.8), '1,234,567')
  assert.deepEqual([0, 999999.9, 1234567, 999999999.9, 1.5e33, 1e70].map(n => long(n)),
    ['0', '999,999', '1.235 Million', '1.000 Billion', '1.500 Decillion', '1.000e70'])
  assert.deepEqual([1e11, 1.5e12].map(n => long(n, true)), ['100 Billion', '1.5 Trillion'])
  assert.deepEqual([2.5, 12.345, 9999, 12345, 999995].map(short), ['2.5', '12.35', '9,999', '12.35K', '1.00M'])
})
