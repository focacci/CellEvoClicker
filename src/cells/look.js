// Paints one cell as a stage: body colors and shape, nucleus, and the stage's art
import { el } from '../ui/dom.js'
import * as ART from './art/index.js'

const NUCLEUS_COLORS = {
  red: 'radial-gradient(circle at 30% 30%, #f43f5e, #be123c)',
  purple: 'radial-gradient(circle at 30% 30%, #c4b5fd, #6d28d9)',
  indigo: 'radial-gradient(circle at 30% 30%, #a5b4fc, #4338ca 60%, #312e81)',
  gold: 'radial-gradient(circle at 30% 30%, #fef3c7, #f59e0b 60%, #b45309)',
  cyan: 'radial-gradient(circle at 30% 30%, #a5f3fc, #0891b2 60%, #164e63)',
  pink: 'radial-gradient(circle at 30% 30%, #fbcfe8, #db2777 60%, #831843)',
  galaxy: 'radial-gradient(circle at 30% 30%, #ffffff, #c084fc 45%, #5b21b6 80%, #1e1b4b)'
}
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
const SHADE = 'inset -10px -10px 30px rgba(0,0,0,0.7), inset 15px 15px 30px rgba(255,255,255,0.2)'

export function makeCell(index) {
  const c = {
    index, x: 0, y: 0, ring: 0,
    feat: el('div', 'cell-feat'), rot: el('div', 'feat-rot'),
    body: el('div', 'cell-body'), glow: el('div', 'cell-glow'), sphere: el('div', 'cell-sphere'),
    org: el('div', 'organelles'), nucleus: el('div', 'nucleus')
  }
  c.feat.appendChild(c.rot)
  c.sphere.append(c.org, c.nucleus)
  c.glow.appendChild(c.sphere)
  c.body.appendChild(c.glow)
  return c
}

export function paintCell(c, st) {
  const art = artFor(st)
  Object.assign(c.sphere.style, {
    width: st.size[0] + 'px', height: st.size[1] + 'px', borderRadius: st.shape,
    background: `radial-gradient(circle at 30% 30%, ${st.colors.join(', ')})`,
    // A hex or shape-shifting outline would re-blur its glow every frame, so that glow is drawn once behind it
    boxShadow: st.hex || st.amoeba ? SHADE : `0 0 50px rgba(${st.glow}, 0.4), ${SHADE}`,
    clipPath: st.hex ? HEX_CLIP : ''
  })
  c.sphere.classList.toggle('amoeba', !!st.amoeba)
  c.glow.classList.toggle('halo-glow', !!st.amoeba)
  c.glow.style.setProperty('--halo', `rgba(${st.glow}, 0.4)`)
  c.glow.style.setProperty('--main', st.colors[1])
  c.glow.style.filter = st.hex ? `drop-shadow(0 0 22px rgba(${st.glow}, 0.45))` : ''
  paintNucleus(c.nucleus, st.nucleus, art.nucleus)
  c.org.replaceChildren(art.organelles.cloneNode(true))
  c.org.classList.toggle('live', art.live)
  c.rot.replaceChildren(art.features.cloneNode(true))
}

function paintNucleus(n, nuc, inner) {
  n.style.opacity = nuc ? '1' : '0'
  if (!nuc) return
  Object.assign(n.style, {
    width: nuc.w + 'px', height: nuc.h + 'px', top: nuc.top, left: nuc.left,
    background: NUCLEUS_COLORS[nuc.color || 'red'], borderRadius: nuc.radius || '50%'
  })
  n.replaceChildren(inner.cloneNode(true))
}

// Nucleolus, chromatin spots and glowing cores, from the stage data
function nucleusInner(nuc) {
  let html = ''
  if (nuc.nucleolus) {
    const [size, left, top] = nuc.nucleolus
    html += `<div class="nucleolus" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%"></div>`
  }
  for (const [l, t, w, h] of nuc.chromatin || []) html += `<div class="chromatin" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"></div>`
  if (nuc.core) html += `<div class="nucleus-core" style="background:${nuc.core.color};box-shadow:${nuc.core.glow}"></div>`
  return html
}

// A stage's art is turned into page elements once, then copied for every cell (much cheaper than re-parsing)
const cache = {}
const parse = (html) => { const t = document.createElement('template'); t.innerHTML = html; return t.content }

function artFor(st) {
  if (!cache[st.id]) {
    const art = ART[st.art] || {}
    const organelles = art.organelles ? art.organelles(st) : ''
    cache[st.id] = {
      features: parse(art.features ? art.features(st) : ''),
      organelles: parse(organelles),
      live: /<animate|sheen/.test(organelles), // moving organelles get their own GPU layer
      nucleus: parse(st.nucleus ? nucleusInner(st.nucleus) : '')
    }
  }
  return cache[st.id]
}
