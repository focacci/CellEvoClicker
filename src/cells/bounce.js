// The click bounce: a springy squash on the clicked cell and a softer one on the rest
function frames(squash, stretch) {
  return [
    { transform: 'scale(1)', easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' },
    { transform: `scale(${squash})`, offset: 0.22, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' },
    { transform: `scale(${stretch})`, offset: 0.55, easing: 'ease-in-out' },
    { transform: 'scale(0.99)', offset: 0.8, easing: 'ease-out' },
    { transform: 'scale(1)' }
  ]
}
const STRONG = frames(0.86, 1.06)
const SOFT = frames(0.94, 1.025)

// Each cell keeps its bounce animation and rewinds it on the next click
// (creating 37 new animations per click was slow on older machines). clicked = -1 bounces every cell hard.
export function bounce(v, clicked, cooldown) {
  const duration = Math.min(320, Math.max(110, cooldown * 0.95))
  v.cells.forEach((c, i) => {
    const kind = i === clicked || clicked < 0 ? STRONG : SOFT
    if (c.spring && c.springKind === kind && c.springDuration === duration) {
      c.spring.currentTime = 0
      c.spring.play()
      return
    }
    c.spring?.cancel()
    c.spring = c.glow.animate(kind, { duration })
    c.springKind = kind
    c.springDuration = duration
  })
}
