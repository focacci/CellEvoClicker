import { $, el } from './dom.js'

const stack = $('#toast-stack')

// kind: '' (plain), 'purple' (rebirth) or 'gold' (achievement)
export function toast(html, kind = '') {
  const t = el('div', 'toast ' + kind, html)
  stack.appendChild(t)
  setTimeout(() => t.classList.add('out'), 3400)
  setTimeout(() => t.remove(), 3900)
}
