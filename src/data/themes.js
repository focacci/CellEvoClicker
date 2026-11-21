// Themes recolor the background, panels, borders and accent. DNA and RNA keep their colors.
// price: DNA to buy it once (kept forever). achievement: earning that achievement unlocks it.
// ink: text color on accent buttons (default white). sky: what's behind the cells (default: the panel color).
export const THEMES = [
  { id: 'classic', name: 'Classic', kind: 'Free', desc: 'The original look, light or dark like your device' },

  { id: 'darkBlue', name: 'Dark Blue', kind: 'Solid', price: 1e6, bg: '#060d1f', panel: '#0d1a36', border: '#1e3a8a', accent: '#3b82f6' },
  { id: 'green', name: 'Green', kind: 'Solid', price: 1e9, bg: '#04140b', panel: '#0a2415', border: '#166534', accent: '#22c55e', ink: '#052e16' },
  { id: 'red', name: 'Red', kind: 'Solid', price: 10e9, bg: '#1f0a0c', panel: '#2d1013', border: '#5b1d22', accent: '#ef4444' },
  { id: 'yellow', name: 'Yellow', kind: 'Solid', price: 100e9, bg: '#171204', panel: '#262009', border: '#713f12', accent: '#eab308', ink: '#1c1917' },
  { id: 'purple', name: 'Purple', kind: 'Solid', price: 1e12, bg: '#12081f', panel: '#1d0f33', border: '#4c1d95', accent: '#a855f7' },

  { id: 'ocean', name: 'Ocean', kind: 'Gradient', achievement: 'stage-2', bg: '#03131c', panel: '#082433', border: '#155e75', accent: '#06b6d4', ink: '#042f2e',
    sky: 'linear-gradient(170deg, #0c4a6e 0%, #083344 50%, #042f2e 100%)' },
  { id: 'forest', name: 'Forest', kind: 'Gradient', achievement: 'two-cells', bg: '#06140a', panel: '#0d2414', border: '#166534', accent: '#4ade80', ink: '#052e16',
    sky: 'linear-gradient(170deg, #14532d 0%, #052e16 60%, #1c1917 100%)' },
  { id: 'sunset', name: 'Sunset', kind: 'Gradient', achievement: 'dna-1m', bg: '#1a0b14', panel: '#2a1020', border: '#9d174d', accent: '#fb923c', ink: '#1c0a02',
    sky: 'linear-gradient(170deg, #7c2d12 0%, #831843 50%, #1e1b4b 100%)' },
  { id: 'aurora', name: 'Aurora', kind: 'Gradient', achievement: 'colony-2', bg: '#05121a', panel: '#0b1f2a', border: '#0f766e', accent: '#2dd4bf', ink: '#042f2e',
    sky: 'linear-gradient(170deg, #134e4a 0%, #312e81 55%, #0b1120 100%)' },
  { id: 'ember', name: 'Ember', kind: 'Gradient', achievement: 'rebirth-1', bg: '#160805', panel: '#26100a', border: '#9a3412', accent: '#f97316', ink: '#1c0a02',
    sky: 'radial-gradient(ellipse at bottom, #9a3412 0%, #450a0a 45%, #0c0a09 100%)' },

  { id: 'solar', name: 'Solar', kind: 'Legendary', achievement: 'immortality', bg: '#140c02', panel: '#241605', border: '#b45309', accent: '#fbbf24', ink: '#1c1003',
    sky: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.4) 0%, rgba(180, 83, 9, 0.25) 30%, transparent 62%), #0f0802' },
  { id: 'galactical', name: 'Galactical', kind: 'Legendary', achievement: 'transcendent', bg: '#07041a', panel: '#110a2e', border: '#4338ca', accent: '#c084fc', ink: '#1e1b4b',
    sky: 'radial-gradient(1.5px 1.5px at 12% 22%, #fff 50%, transparent), radial-gradient(1px 1px at 68% 14%, #e9d5ff 50%, transparent), ' +
      'radial-gradient(1.5px 1.5px at 82% 64%, #fff 50%, transparent), radial-gradient(1px 1px at 33% 78%, #a5f3fc 50%, transparent), ' +
      'radial-gradient(1px 1px at 52% 40%, #fff 50%, transparent), radial-gradient(ellipse at 25% 25%, rgba(124, 58, 237, 0.45), transparent 55%), ' +
      'radial-gradient(ellipse at 80% 75%, rgba(8, 145, 178, 0.35), transparent 50%), #05030f' },
  // Pitch black and orange, with a rotating accretion disk behind the cells and cells glowing in their main color
  { id: 'singularity', name: 'Singularity', kind: 'Legendary', achievement: 'transdimensional', bg: '#000000', panel: '#070707', border: '#3d1f08', accent: '#f97316', ink: '#0a0a0a',
    sky: '#000000' }
]
