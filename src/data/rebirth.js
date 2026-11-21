// Rebirth mutations: bought once with RNA and kept forever. Cheapest first.
// Effect fields (read by bonus() and perk() in rules.js):
//   all / click / auto / crit: multiply that DNA yield     price / cellPrice: multiply mutation prices
//   halfReq: halves unlock levels   startDna: DNA at the start of a cycle   offline: share earned while closed
//   echo: extra yield per RNA ever earned   keepColony: colony that stays unlocked   leap: stage bonus
//   startLevels: mutation levels every colony starts a cycle with
export const REBIRTH = [
  { id: 'primordial', label: 'Primordial Memory', desc: 'All DNA generation is increased by 50%.', cost: 1, effect: '×1.5 generation', all: 1.5 },
  { id: 'memory', label: 'Genetic Memory', desc: 'Mutation unlock requirements are halved.', cost: 2, effect: '½ unlock levels', halfReq: true },
  { id: 'reserve', label: 'Spore Reserve', desc: 'Begin every cycle with 1 Million DNA.', cost: 4, effect: '+1M starting DNA', startDna: 1e6 },
  { id: 'membrane', label: 'Reinforced Membrane', desc: 'Manual click yield is tripled.', cost: 7, effect: '×3 manual', click: 3 },
  { id: 'metabolism', label: 'Efficient Metabolism', desc: 'Passive generation is tripled.', cost: 12, effect: '×3 passive', auto: 3 },
  { id: 'reflex', label: 'Reflex Imprint', desc: 'Synaptic Reflex and Metabolic Rate begin every cycle fully evolved.', cost: 20, effect: 'Max reflexes', startLevels: { clickCooldown: 10, autoClickCooldown: 12 } },
  { id: 'lucky', label: 'Lucky Codons', desc: 'Critical yields are doubled.', cost: 35, effect: '×2 crit yield', crit: 2 },
  { id: 'spores', label: 'Dormant Spores', desc: 'Earn 50% of passive generation while the game is closed (up to 12 hours).', cost: 60, effect: '50% offline', offline: 0.5 },
  { id: 'telo1', label: 'Ancestral Telomeres', desc: 'All mutations cost 15% less.', cost: 100, effect: '-15% cost', price: 0.85 },
  { id: 'echo', label: 'Ancestral Echo', desc: '+2% to all generation for every RNA ever earned.', cost: 175, echo: 0.02 },
  { id: 'colony2', label: 'Colony Memory', desc: 'The second colony stays unlocked through rebirths.', cost: 300, effect: 'Keeps Colony II', keepColony: 1 },
  { id: 'budding', label: 'Budding Instinct', desc: 'Every colony begins each cycle with 6 extra cells.', cost: 500, effect: '+6 cells', startLevels: { extraCells: 6 } },
  { id: 'overclock', label: 'Overclocked Mitochondria', desc: 'All DNA generation is quadrupled.', cost: 850, effect: '×4 generation', all: 4 },
  { id: 'hyperplasia', label: 'Hyperplasia', desc: 'Mitotic Division costs 50% less.', cost: 1500, effect: '-50% division', cellPrice: 0.5 },
  { id: 'colony3', label: 'Deep Colony Memory', desc: 'The third colony stays unlocked through rebirths.', cost: 2500, effect: 'Keeps Colony III', keepColony: 2 },
  { id: 'leap', label: 'Evolutionary Leap', desc: 'Each evolution stage a colony reaches boosts its generation by 10%.', cost: 4500, effect: '×1.1 per stage', leap: true },
  { id: 'telo2', label: 'Eternal Telomeres', desc: 'All mutations cost a further 25% less.', cost: 8000, effect: '-25% cost', price: 0.75 },
  { id: 'hereditary', label: 'Hereditary Strength', desc: 'Membrane Tension and Mitochondrial Core begin every cycle at level 25.', cost: 15000, effect: 'Start at Lvl 25', startLevels: { clickPower: 25, autoClickPower: 25 } },
  { id: 'quantum', label: 'Quantum Coherence', desc: 'All DNA generation is multiplied by 10.', cost: 30000, effect: '×10 generation', all: 10 },
  { id: 'apex', label: 'Apex Genome', desc: 'All DNA generation is multiplied by 25.', cost: 75000, effect: '×25 generation', all: 25 }
]
