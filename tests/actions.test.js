import { test } from 'node:test'
import assert from 'node:assert/strict'
import { click, autoTick, buyMutation, unlockColony, rebirth, wake, buyRebirth, collectOffline, clocks } from '../src/actions.js'
import { newGame } from '../src/state.js'

function setup(levels = {}) {
  const g = newGame()
  Object.assign(g.colonies[0].levels, levels)
  clocks.click[0] = -Infinity
  clocks.auto[0] = 0
  return g
}

test('a click pays every cell and respects the cooldown', () => {
  const g = setup({ extraCells: 2 })
  assert.deepEqual(click(g, 0, 1000), { perCell: 1, crit: false })
  assert.equal(g.money, 3)
  assert.equal(click(g, 0, 1299), null, '300 ms cooldown')
  assert.ok(click(g, 0, 1300))
  assert.equal(g.totals.clicks, 2)
  assert.equal(g.totals.dna, 6)
})

test('a crit pays ×10 and counts as a crit', () => {
  const g = setup({ critChance: 2 })
  const hit = click(g, 0, 1000, 0.5)
  assert.deepEqual(hit, { perCell: 10, crit: true })
  assert.equal(g.totals.crits, 1)
  assert.equal(click(g, 0, 2000, 1).crit, false, 'roll 1 misses a 1% chance')
})

test('locked or dormant colonies do not click', () => {
  const g = setup()
  assert.equal(click(g, 1, 1000), null)
  g.pending = true
  assert.equal(click(g, 0, 1000), null)
})

test('auto ticks pay per elapsed tick and catch up with the average', () => {
  const g = setup({ autoClickPower: 1, autoCritChance: 20, critPower: 0 })
  assert.equal(autoTick(g, 0, 999), null)
  assert.deepEqual(autoTick(g, 0, 1000, () => 0.5), { ticks: 1, perCell: 1, crit: false })
  assert.deepEqual(autoTick(g, 0, 2000, () => 0), { ticks: 1, perCell: 10, crit: true })
  assert.equal(g.money, 11)
  assert.deepEqual(autoTick(g, 0, 12000), { ticks: 10 })
  assert.equal(g.money, 11 + 10 * (1 + 0.1 * 9))
})

test('no auto income without Mitochondrial Core', () => {
  const g = setup()
  assert.equal(autoTick(g, 0, 50000), null)
  assert.equal(g.money, 0)
})

test('buying a mutation spends DNA and raises its level', () => {
  const g = setup()
  assert.equal(buyMutation(g, 0, 'clickPower'), false)
  g.money = 25
  assert.equal(buyMutation(g, 0, 'clickPower'), true)
  assert.equal(g.money, 15)
  assert.equal(g.colonies[0].levels.clickPower, 1)
  g.money = 1e9
  g.colonies[0].levels.clickCooldown = 10
  assert.equal(buyMutation(g, 0, 'clickCooldown'), false, 'maxed')
})

test('unlocking a colony costs its price and gives rebirth starting levels', () => {
  const g = setup()
  g.money = 99e9
  assert.equal(unlockColony(g, 1), false, 'Colony II costs 100 Billion')
  g.money = 1e11
  g.owned = ['reflex', 'budding']
  assert.equal(unlockColony(g, 1), true)
  assert.equal(g.money, 0)
  assert.equal(g.colonies[1].unlocked, true)
  assert.equal(g.colonies[1].levels.clickCooldown, 10)
  assert.equal(g.colonies[1].levels.autoClickCooldown, 12)
  assert.equal(g.colonies[1].levels.extraCells, 6)
  assert.equal(unlockColony(g, 1), false, 'already unlocked')
})

test('rebirth pays whole RNA, carries the fraction and resets the cycle', () => {
  const g = setup({ clickPower: 50 })
  g.money = 9e12
  assert.equal(rebirth(g), 0, 'needs 10 Trillion')
  g.money = 4.84e13 // √4.84 = 2.2
  g.frac = 0.9
  g.colonies[1].unlocked = true
  g.played = 99
  g.achievements = ['first-click']
  const total = rebirth(g)
  assert.ok(Math.abs(total - 3.1) < 1e-9)
  assert.equal(g.rdna, 3)
  assert.equal(g.earned, 3)
  assert.ok(Math.abs(g.frac - 0.1) < 1e-9)
  assert.equal(g.rebirths, 1)
  assert.equal(g.money, 0)
  assert.equal(g.pending, true)
  assert.equal(g.colonies[0].levels.clickPower, 0)
  assert.deepEqual(g.colonies.map(c => c.unlocked), [true, false, false])
  assert.equal(g.played, 99, 'time played survives rebirth')
  assert.deepEqual(g.achievements, ['first-click'], 'achievements survive rebirth')
  assert.equal(click(g, 0, 1e9), null, 'the dormant cell does not pay')
})

test('waking the dormant cell applies Spore Reserve, kept colonies and starting levels', () => {
  const g = setup()
  g.pending = true
  g.owned = ['reserve', 'colony3', 'hereditary']
  assert.equal(wake(g), true)
  assert.equal(g.pending, false)
  assert.equal(g.money, 1e6)
  assert.deepEqual(g.colonies.map(c => c.unlocked), [true, false, true])
  assert.equal(g.colonies[0].levels.clickPower, 25)
  assert.equal(g.colonies[2].levels.autoClickPower, 25)
  assert.equal(g.colonies[1].levels.clickPower, 0)
  assert.equal(wake(g), false)
})

test('rebirth mutations are bought once with RNA', () => {
  const g = setup()
  g.rdna = 5
  assert.equal(buyRebirth(g, 'reserve'), true)
  assert.equal(g.rdna, 1)
  assert.equal(buyRebirth(g, 'reserve'), false)
  assert.equal(buyRebirth(g, 'membrane'), false, 'costs 7')
  assert.equal(buyRebirth(g, 'bogus'), false)
  assert.deepEqual(g.owned, ['reserve'])
})

test('Dormant Spores pay for the time the game was closed', () => {
  const g = setup({ autoClickPower: 1 })
  g.owned = ['spores']
  g.t = 1_000_000
  assert.deepEqual(collectOffline(g, 1_000_000 + 3600e3), { gain: 1800, secs: 3600 })
  assert.equal(g.money, 1800)
  g.t = 0
  assert.equal(collectOffline(g, 5e12).gain, 0, 'no save time, no offline DNA')
})
