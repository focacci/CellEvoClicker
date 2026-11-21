import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSettings, cleanSettings, SETTINGS_KEY } from '../src/settings.js'

function fakeStorage(items = {}) {
  return {
    items,
    getItem: (k) => (k in items ? items[k] : null),
    setItem: (k, v) => { items[k] = String(v) },
    removeItem: (k) => { delete items[k] }
  }
}

test('first run copies the old volumes, then deletes the old keys', () => {
  const store = fakeStorage({ 'cellEvoClicker.volume': '{"music":0.4,"sfx":1.25}', 'cellEvoClicker.music': 'on' })
  const s = loadSettings(store)
  assert.equal(s.music, 0.4)
  assert.equal(s.sfx, 1.25)
  assert.deepEqual(Object.keys(store.items), [SETTINGS_KEY])
  assert.deepEqual(JSON.parse(store.items[SETTINGS_KEY]), s)
})

test('players who had music off keep it off', () => {
  const s = loadSettings(fakeStorage({ 'cellEvoClicker.volume': '{"music":0.8,"sfx":1}', 'cellEvoClicker.music': 'off' }))
  assert.equal(s.music, 0)
  assert.equal(s.sfx, 1)
})

test('a brand new player gets the defaults', () => {
  assert.deepEqual(loadSettings(fakeStorage()), { music: 1, sfx: 1, hideName: false, hideEarnings: false, centerCurrency: false, slowRotate: true })
})

test('saved settings win over the old keys and are cleaned', () => {
  const store = fakeStorage({ [SETTINGS_KEY]: '{"music":9,"sfx":-1,"hideEarnings":true,"slowRotate":"no","junk":1}', 'cellEvoClicker.music': 'off' })
  const s = loadSettings(store)
  assert.equal(s.music, 1.5)
  assert.equal(s.sfx, 0)
  assert.equal(s.hideEarnings, true)
  assert.equal(s.slowRotate, true)
  assert.equal('junk' in s, false)
  assert.equal(cleanSettings('garbage').music, 1)
})
