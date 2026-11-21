import { test } from 'node:test'
import assert from 'node:assert/strict'
import { THEMES } from '../src/data/themes.js'
import { ACHIEVEMENTS } from '../src/data/achievements.js'
import { ownsTheme, buyTheme, equipTheme, themeVars, themeById } from '../src/themes.js'
import { rebirth } from '../src/actions.js'
import { cleanSave } from '../src/save.js'
import { newGame } from '../src/state.js'

test('solid colors cost DNA: Dark Blue, Green, Red, Yellow, Purple', () => {
  const solid = THEMES.filter(t => t.price)
  assert.deepEqual(solid.map(t => [t.name, t.price]), [['Dark Blue', 1e6], ['Green', 1e9], ['Red', 10e9], ['Yellow', 100e9], ['Purple', 1e12]])
})

test('gradients come from easy achievements; Solar, Galactical, Singularity from the named ones in order', () => {
  const byId = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]))
  const gradients = THEMES.filter(t => t.kind === 'Gradient')
  assert.equal(gradients.length, 5)
  for (const t of gradients) assert.equal(byId[t.achievement].tier, 'easy', t.name)
  assert.deepEqual(THEMES.filter(t => t.kind === 'Legendary').map(t => [t.name, byId[t.achievement].name]),
    [['Solar', 'Immortality'], ['Galactical', 'Transcendent'], ['Singularity', 'Transdimensional']])
})

test('Classic is free and owned from the start', () => {
  const g = newGame()
  assert.equal(g.theme, 'classic')
  assert.ok(ownsTheme(g, themeById('classic')))
  assert.deepEqual(themeVars(themeById('classic')), {}, 'Classic leaves the light/dark stylesheet colors alone')
})

test('buying a solid theme spends DNA, keeps it forever and puts it on', () => {
  const g = newGame()
  g.money = 999999
  assert.equal(buyTheme(g, 'darkBlue'), false)
  g.money = 1e6
  assert.equal(buyTheme(g, 'darkBlue'), true)
  assert.equal(g.money, 0)
  assert.equal(g.theme, 'darkBlue')
  assert.equal(buyTheme(g, 'darkBlue'), false, 'already owned')
  g.money = 1e13
  rebirth(g)
  assert.deepEqual(g.themes, ['darkBlue'], 'kept through a rebirth')
  assert.equal(g.theme, 'darkBlue')
  assert.equal(equipTheme(g, 'classic'), true)
  assert.equal(equipTheme(g, 'darkBlue'), true)
})

test('achievement themes cannot be bought, only earned', () => {
  const g = newGame()
  g.money = 1e30
  assert.equal(buyTheme(g, 'ocean'), false)
  assert.equal(equipTheme(g, 'ocean'), false)
  g.achievements.push('stage-2')
  assert.equal(equipTheme(g, 'ocean'), true)
  assert.equal(equipTheme(g, 'singularity'), false)
})

test('every theme sets the colors it needs', () => {
  for (const t of THEMES.slice(1)) {
    const vars = themeVars(t)
    for (const k of ['--bg-dark', '--panel-bg', '--border', '--accent-primary', '--on-accent']) assert.match(vars[k], /^#[0-9a-f]{6}$/i, `${t.id} ${k}`)
  }
  const singularity = themeVars(themeById('singularity'))
  assert.equal(singularity['--bg-dark'], '#000000', 'pitch black')
  assert.equal(singularity['--accent-primary'], '#f97316', 'orange')
})

test('saved themes are checked on load', () => {
  const g = cleanSave({ v: 2, themes: ['red', 'ocean', 'bogus'], theme: 'ocean', achievements: [] })
  assert.deepEqual(g.themes, ['red'])
  assert.equal(g.theme, 'classic', 'Ocean is not earned yet')
  assert.equal(cleanSave({ v: 2, themes: ['red'], theme: 'red' }).theme, 'red')
  assert.equal(cleanSave({ v: 2, theme: 'ocean', achievements: ['stage-2'] }).theme, 'ocean')
})
