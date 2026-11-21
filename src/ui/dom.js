export const $ = (selector) => document.querySelector(selector)

export function el(tag, cls = '', html = '') {
  const node = document.createElement(tag)
  node.className = cls
  node.innerHTML = html
  return node
}

// These only touch the page when the value really changed (keeps buttons clickable during fast updates)
export function setText(node, text) {
  if (node._text !== text) { node._text = text; node.textContent = text }
}

export function setHTML(node, html) {
  if (node._html !== html) { node._html = html; node.innerHTML = html }
}

export function setStyle(node, prop, value) {
  if (node['_' + prop] !== value) { node['_' + prop] = value; node.style.setProperty(prop, value) }
}

// Plays a CSS animation class again from the start
export function replay(node, cls) {
  node.classList.remove(cls)
  void node.offsetWidth
  node.classList.add(cls)
}
