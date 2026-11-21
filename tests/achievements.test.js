import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ACHIEVEMENTS } from '../src/data/achievements.js'
import { measure, checkAchievements } from '../src/achievements.js'
import { rebirth } from '../src/actions.js'
import { cleanSave } from '../src/save.js'
import { newGame } from '../src/state.js'

const ids = (list) => list.map(a => a.id)

test('15 to 50 achievements, a multiple of five, easy to hard, with unique ids', () => {
  const n = ACHIEVEMENTS.length
  assert.ok(n >= 15 && n <= 50 && n % 5 === 0, `${n} achievements`)
  assert.equal(new Set(ids(ACHIEVEMENTS)).size, n)
  const order = ['easy', 'medium', 'hard', 'named']
  const tiers = ACHIEVEMENTS.map(a => order.indexOf(a.tier))
  assert.ok(tiers.every(t => t >= 0))
  assert.deepEqual(tiers, [...tiers].sort((a, b) => a - b), 'sorted easy → hard')
  const stats = Object.keys(measure(newGame()))
  for (const a of ACHIEVEMENTS) assert.ok(stats.includes(a.stat), `${a.id} measures ${a.stat}`)
})

test('the three named achievements, in order', () => {
  const named = ACHIEVEMENTS.filter(a => a.tier === 'named')
  assert.deepEqual(named.map(a => [a.name, a.stat, a.goal]),
    [['Immortality', 'bestStage', 20], ['Transcendent', 'bestStage', 21], ['Transdimensional', 'transcended', 3]])
})

test('achievements are awarded once, when reached', () => {
  const g = newGame()
  assert.deepEqual(ids(checkAchievements(g)), [])
  g.totals.clicks = 1
  assert.deepEqual(ids(checkAchievements(g)), ['first-click'])
  assert.deepEqual(ids(checkAchievements(g)), [], 'not twice')
  g.colonies[0].levels.clickPower = 540
  assert.ok(ids(checkAchievements(g)).includes('immortality'))
  assert.ok(!g.achievements.includes('transcendent'))
})

test('Transdimensional needs all three colonies at the Transcendent Cell at the same time', () => {
  const g = newGame()
  g.colonies.forEach(c => { c.unlocked = true; c.levels.clickPower = 1000 })
  g.colonies[2].levels.clickPower = 999
  checkAchievements(g)
  assert.ok(g.achievements.includes('transcendent'))
  assert.ok(!g.achievements.includes('transdimensional'))
  g.colonies[2].levels.clickPower = 1000
  assert.deepEqual(ids(checkAchievements(g)), ['transdimensional'])
})

test('locked colonies do not count', () => {
  const g = newGame()
  g.colonies[1].levels.clickPower = 600
  assert.equal(measure(g).bestStage, 1)
  assert.equal(measure(g).colonies, 1)
})

test('an old save earns what is already true the moment it loads', () => {
  const g = cleanSave({ v: 2, money: 5e12, rebirths: 12, earned: 150, owned: ['primordial', 'memory'],
    colonies: [{ unlocked: true, levels: { clickPower: 400, extraCells: 18 } }, { unlocked: true, levels: {} }, { unlocked: false, levels: {} }] })
  const got = ids(checkAchievements(g))
  for (const id of ['first-mutation', 'two-cells', 'stage-15', 'cells-19', 'colony-2', 'rebirth-1', 'rebirths-10', 'rna-100']) assert.ok(got.includes(id), id)
  for (const id of ['first-click', 'colony-3', 'dna-1m', 'immortality']) assert.ok(!got.includes(id), id)
})

test('achievements and time survive a rebirth', () => {
  const g = newGame()
  g.totals.clicks = 5
  g.played = 10
  checkAchievements(g)
  g.money = 1e13
  rebirth(g)
  assert.deepEqual(g.achievements, ['first-click'])
  assert.equal(g.totals.clicks, 5)
  assert.equal(g.played, 10)
})
