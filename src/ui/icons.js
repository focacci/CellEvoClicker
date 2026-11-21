// DNA currency symbol. Uses currentColor, so the same icon works in any color.
export const DNA_ICON = '<svg class="dna-icon" viewBox="0 0 12 20" aria-hidden="true">' +
  '<path d="M2 1 C2 5.5 10 5.5 10 10 C10 14.5 2 14.5 2 19"/>' +
  '<path d="M10 1 C10 5.5 2 5.5 2 10 C2 14.5 10 14.5 10 19"/>' +
  '<path class="rung" d="M3.2 2.8h5.6 M2.6 10h6.8 M3.2 17.2h5.6"/></svg>'

// RNA symbol: one strand with its bases reaching toward the missing second strand
export const RNA_ICON = '<svg class="dna-icon rna-icon" viewBox="15 180 775 1055" aria-hidden="true">' +
  '<path d="M745 220 C748 700 60 600 55 1195"/>' +
  '<path class="rung" d="M205 340H725 M320 510H640 M140 905H345 M95 1075H455"/></svg>'

export const LOCK_ICON = '<svg class="lock-icon" viewBox="0 0 64 72" aria-hidden="true">' +
  '<path class="shackle" d="M18 33 V22 a14 14 0 0 1 28 0 V33" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"/>' +
  '<g class="lock-body-g"><rect x="7" y="31" width="50" height="39" rx="9" fill="currentColor"/>' +
  '<rect x="7" y="31" width="50" height="10" rx="5" fill="rgba(255,255,255,0.12)"/>' +
  '<circle cx="32" cy="48" r="5.5" fill="#0f172a"/><rect x="29.5" y="49" width="5" height="11" rx="2.5" fill="#0f172a"/></g></svg>'

export const TEASER_LOCK = '<svg class="teaser-icon" viewBox="0 0 64 72" aria-hidden="true">' +
  '<path d="M18 33 V22 a14 14 0 0 1 28 0 V33" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"/>' +
  '<rect x="7" y="31" width="50" height="39" rx="9" fill="currentColor"/></svg>'

export const chevron = (cls) => `<svg class="${cls}" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 L6 7.5 L9 4.5"/></svg>`
