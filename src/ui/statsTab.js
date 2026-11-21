// Stats tab: time played, lifetime totals, and the click and auto power of the colony on screen.
// "Base" is one cell with every multiplier; "Multi" is all the cells in the colony together.
import { el, setHTML } from './dom.js'
import { DNA_ICON, RNA_ICON } from './icons.js'
import * as R from '../rules.js'
import { STAGES } from '../data/stages.js'
import { COLONIES } from '../data/colonies.js'
import { ACHIEVEMENTS } from '../data/achievements.js'
import { commas, short } from '../format.js'
import { game } from '../state.js'

const dna = (n) => DNA_ICON + short(n)
const i = () => game.view
const cells = () => R.cellCount(game, i())
const click = () => R.clickYield(game, i())
const auto = () => R.autoYield(game, i())
const crit = () => R.critMult(game, i())

function clock(seconds) {
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = Math.floor(seconds % 60)
  return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`
}

// [title, [label, value]...]. Titles and values are functions, read every frame.
const GROUPS = [
  [() => 'You', [
    ['Time played', () => clock(game.played)],
    ['Achievements', () => `${game.achievements.length} / ${ACHIEVEMENTS.length}`],
    ['Total clicks', () => commas(game.totals.clicks)],
    ['Total crits', () => commas(game.totals.crits)],
    ['DNA earned', () => dna(game.totals.dna)],
    ['Rebirths', () => commas(game.rebirths)],
    ['RNA earned', () => RNA_ICON + commas(game.earned)]]],
  [() => COLONIES[i()].name, [
    ['Stage', () => `${R.stageOf(game, i()) + 1}: ${STAGES[R.stageOf(game, i())].name}`],
    ['Mutation levels', () => commas(R.totalLevels(game, i()))],
    ['Cells', () => cells()]]],
  [() => 'Click power', [
    ['Base', () => dna(click())],
    ['Base crit', () => dna(click() * crit())],
    ['Multi', () => dna(click() * cells())],
    ['Multi crit', () => dna(click() * cells() * crit())],
    ['Crit chance', () => short(R.critChance(game, i())) + '%'],
    ['Cooldown', () => R.clickCooldown(game, i()) + ' ms']]],
  [() => 'Auto power', [
    ['Base per tick', () => dna(auto())],
    ['Base crit per tick', () => dna(auto() * crit())],
    ['Multi per tick', () => dna(auto() * cells())],
    ['Multi crit per tick', () => dna(auto() * cells() * crit())],
    ['Multi per second', () => dna(R.autoPerSecond(game, i()))],
    ['Crit chance', () => short(R.autoCritChance(game, i())) + '%'],
    ['Tick', () => (R.autoCooldown(game, i()) / 1000).toFixed(2) + ' s']]]
]

export const statsTab = el('div', 'upgrade-group')
const shown = [] // [node, value function]

for (const [title, rows] of GROUPS) {
  const group = statsTab.appendChild(el('div', 'stat-group', '<h4></h4>'))
  shown.push([group.firstChild, title])
  for (const [label, value] of rows) {
    const row = group.appendChild(el('div', 'stat-row', `<span>${label}</span><b></b>`))
    shown.push([row.lastChild, value])
  }
}

export function renderStats() {
  for (const [node, value] of shown) setHTML(node, String(value()))
}
