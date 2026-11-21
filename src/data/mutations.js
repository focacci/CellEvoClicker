// Mutations, in unlock order. Each level costs baseCost × mult^level.
// max: highest level (no max = unlimited). req: [mutation, level] needed before this one shows up.
export const MUTATIONS = [
  { key: 'clickPower', label: 'Membrane Tension', desc: 'Increases manual click generation yield. Doubles every 25 levels.', baseCost: 10, mult: 1.28 },
  { key: 'clickCooldown', label: 'Synaptic Reflex', desc: 'Reduces manual click locking timer.', baseCost: 60, mult: 1.75, max: 10, req: ['clickPower', 5] },
  { key: 'autoClickPower', label: 'Mitochondrial Core', desc: 'Increases income generated passively. Doubles every 25 levels.', baseCost: 150, mult: 1.28, req: ['clickCooldown', 2] },
  { key: 'autoClickCooldown', label: 'Metabolic Rate', desc: 'Speeds up the interval of passive income generation.', baseCost: 400, mult: 2.0, max: 12, req: ['autoClickPower', 5] },
  { key: 'ribosomalSynthesis', label: 'Ribosomal Synthesis', desc: 'Amplifies manual click generation yield by a percentage.', baseCost: 1500, mult: 1.4, req: ['autoClickCooldown', 2] },
  { key: 'chloroplastSymbiosis', label: 'Chloroplast Symbiosis', desc: 'Amplifies passive income generation by a percentage.', baseCost: 4000, mult: 1.4, req: ['ribosomalSynthesis', 5] },
  { key: 'critChance', label: 'Mutagenic Strike', desc: 'Grants manual clicks a chance to trigger a critical yield.', baseCost: 12000, mult: 1.6, max: 20, req: ['chloroplastSymbiosis', 5] },
  { key: 'autoCritChance', label: 'Transposon Burst', desc: 'Grants passive income generation a chance to trigger a critical yield.', baseCost: 25000, mult: 1.6, max: 20, req: ['critChance', 3] },
  { key: 'critPower', label: 'Gene Amplification', desc: 'Increases the yield multiplier of critical generation.', baseCost: 60000, mult: 2.1, max: 8, req: ['autoCritChance', 3] },
  { key: 'endocyticUptake', label: 'Endocytic Uptake', desc: 'Manual clicks absorb a portion of passive income power.', baseCost: 150000, mult: 1.9, max: 10, req: ['critPower', 2] },
  { key: 'extraCells', label: 'Mitotic Division', desc: 'Adds an extra cell to the mass, each generating its own full yield.', baseCost: 500000, mult: 1.62, max: 36, req: ['endocyticUptake', 2] },
  { key: 'telomerase', label: 'Telomerase Activity', desc: 'Reduces the DNA cost of all mutations.', baseCost: 5e6, mult: 2.6, max: 10, req: ['extraCells', 3] }
]

export const MUTATION = Object.fromEntries(MUTATIONS.map(m => [m.key, m]))
