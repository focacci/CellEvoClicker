// Themes: buy one with DNA or earn it with an achievement, then wear it. Bought themes are kept forever.
import { THEMES } from './data/themes.js'

export const themeById = (id) => THEMES.find(t => t.id === id)

export function ownsTheme(game, t) {
  if (t.achievement) return game.achievements.includes(t.achievement)
  return !t.price || game.themes.includes(t.id)
}

// Buying a theme also puts it on
export function buyTheme(game, id) {
  const t = themeById(id)
  if (!t?.price || ownsTheme(game, t) || game.money < t.price) return false
  game.money -= t.price
  game.themes.push(id)
  game.theme = id
  return true
}

export function equipTheme(game, id) {
  const t = themeById(id)
  if (!t || !ownsTheme(game, t)) return false
  game.theme = id
  return true
}

// The CSS variables a theme sets. Classic sets none, so the stylesheet's light or dark colors show.
export function themeVars(t) {
  if (!t.bg) return {}
  const vars = { '--bg-dark': t.bg, '--panel-bg': t.panel, '--border': t.border, '--accent-primary': t.accent, '--on-accent': t.ink || '#ffffff' }
  if (t.sky) vars['--sky'] = t.sky
  return vars
}

const VARS = ['--bg-dark', '--panel-bg', '--border', '--accent-primary', '--on-accent', '--sky']

export function applyTheme(id) {
  const root = document.documentElement, vars = themeVars(themeById(id) || THEMES[0])
  root.dataset.theme = id
  for (const k of VARS) {
    if (vars[k]) root.style.setProperty(k, vars[k])
    else root.style.removeProperty(k)
  }
}
