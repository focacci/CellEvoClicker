// 1.0.0 against v0.3.5: the same saves must give the same prices, yields, DNA/s, crits, stages and RNA.
// The expected numbers in v035-parity.json come from running the real v0.3.5 code (see v035-parity.mjs).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { SAVES } from './fixtures/v035-saves.js'
import { cleanSave } from '../src/save.js'
import { MUTATIONS } from '../src/data/mutations.js'
import * as R from '../src/rules.js'

const OLD = JSON.parse(readFileSync(new URL('./fixtures/v035-parity.json', import.meta.url)))
const OLD_FIELDS = ['money', 'rdna', 'frac', 'earned', 'rebirths', 'owned', 'pending', 'view', 'colonies']
const oldView = (g) => Object.fromEntries(OLD_FIELDS.map(k => [k, g[k]]))

function measure(g) {
  const colonies = g.colonies.map((c, i) => ({
    costs: MUTATIONS.map(m => R.mutationCost(g, i, m.key)),
    revealed: MUTATIONS.map(m => R.isRevealed(g, i, m.key)),
    maxed: MUTATIONS.map(m => R.isMaxed(g, i, m.key)),
    click: R.clickYield(g, i), auto: R.autoYield(g, i), perSecond: R.autoPerSecond(g, i), critMult: R.critMult(g, i),
    stage: R.stageOf(g, i), cells: R.cellCount(g, i),
    stats: { clickPower: R.clickPowerAt(c.levels.clickPower), autoPower: R.autoPowerAt(c.levels.autoClickPower), clickCooldown: R.clickCooldown(g, i), autoCooldown: R.autoCooldown(g, i), critChance: R.critChance(g, i), autoCritChance: R.autoCritChance(g, i) }
  }))
  const total = R.rebirthGain(g) + g.frac, whole = Math.floor(total)
  return { colonies, rebirth: { total, whole, frac: Math.max(0, total - whole) }, offline: R.offlineGain(g, 3600), totalPerSecond: R.totalPerSecond(g) }
}

SAVES.forEach((save, k) => {
  test(`same numbers as v0.3.5: ${save.name}`, () => {
    const { resaved, oldReadsNew, ...expected } = OLD[k]
    assert.deepEqual(measure(cleanSave(save)), expected)
  })

  test(`saves stay compatible both ways: ${save.name}`, () => {
    const g = cleanSave(save)
    const { resaved, oldReadsNew } = OLD[k]
    assert.deepEqual(oldView(g), without(resaved, 'v'), '1.0.0 reads the save like v0.3.5 does')
    assert.deepEqual(oldReadsNew, resaved, 'v0.3.5 reads a 1.0.0 save like its own')
    assert.equal(JSON.parse(JSON.stringify(g)).v, 2)
  })
})

function without(o, key) {
  const copy = { ...o }
  delete copy[key]
  return copy
}
