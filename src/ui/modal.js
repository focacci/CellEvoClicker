// Pop-ups (Settings, Reset). The game keeps running underneath.
// Esc or a click on the dimmed background closes the top one (Esc no longer resets the game).
const open = [] // open pop-ups, the top one last

export function openModal(m) {
  if (open.includes(m)) return
  m.returnFocus = document.activeElement
  m.hidden = false
  void m.offsetWidth // start the fade-in from the hidden state
  m.classList.add('open')
  open.push(m)
  m.querySelector('button').focus()
}

export function closeModal(m = open.at(-1)) {
  if (!open.includes(m)) return
  open.splice(open.indexOf(m), 1)
  m.classList.remove('open')
  setTimeout(() => { if (!m.classList.contains('open')) m.hidden = true }, 220)
  m.returnFocus?.focus()
}

export const modalOpen = () => open.length > 0

for (const m of document.querySelectorAll('.modal-backdrop')) {
  m.addEventListener('pointerdown', (e) => { if (e.target === m) closeModal(m) })
}
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal() })
