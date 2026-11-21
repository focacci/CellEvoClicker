// Achievements, easy to hard. Each is earned when the measured `stat` reaches `goal`.
// Stats (measured in achievements.js): clicks, crits, dna (all-time DNA earned), mostLevels, mostCells,
// bestStage (1-21), colonies (unlocked), rebirths, rna (all-time RNA earned), perks (rebirth mutations owned),
// played (seconds), transcended (colonies at the Transcendent Cell).
export const ACHIEVEMENTS = [
  { id: 'first-click', name: 'First Contact', desc: 'Click your cell', tier: 'easy', stat: 'clicks', goal: 1 },
  { id: 'first-mutation', name: 'Mutant', desc: 'Buy your first mutation', tier: 'easy', stat: 'mostLevels', goal: 1 },
  { id: 'first-crit', name: 'Lucky Strike', desc: 'Land a critical hit', tier: 'easy', stat: 'crits', goal: 1 },
  { id: 'two-cells', name: 'Mitosis', desc: 'Grow a second cell', tier: 'easy', stat: 'mostCells', goal: 2 },
  { id: 'stage-2', name: 'Nucleus', desc: 'Reach stage 2', tier: 'easy', stat: 'bestStage', goal: 2 },
  { id: 'stage-3', name: 'Swimmer', desc: 'Reach stage 3', tier: 'easy', stat: 'bestStage', goal: 3 },
  { id: 'dna-1m', name: 'Millionaire', desc: 'Earn 1 Million DNA', tier: 'easy', stat: 'dna', goal: 1e6 },
  { id: 'clicks-1k', name: 'Busy Fingers', desc: 'Click 1,000 times', tier: 'easy', stat: 'clicks', goal: 1000 },
  { id: 'colony-2', name: 'Expansion', desc: 'Unlock Colony II', tier: 'easy', stat: 'colonies', goal: 2 },
  { id: 'rebirth-1', name: 'Born Again', desc: 'Rebirth for the first time', tier: 'easy', stat: 'rebirths', goal: 1 },

  { id: 'clicks-10k', name: 'Tireless', desc: 'Click 10,000 times', tier: 'medium', stat: 'clicks', goal: 10000 },
  { id: 'crits-500', name: 'Critical Mass', desc: 'Land 500 critical hits', tier: 'medium', stat: 'crits', goal: 500 },
  { id: 'dna-1t', name: 'Trillionaire', desc: 'Earn 1 Trillion DNA', tier: 'medium', stat: 'dna', goal: 1e12 },
  { id: 'stage-10', name: 'Blood Flow', desc: 'Reach stage 10', tier: 'medium', stat: 'bestStage', goal: 10 },
  { id: 'stage-15', name: 'Bone Builder', desc: 'Reach stage 15', tier: 'medium', stat: 'bestStage', goal: 15 },
  { id: 'cells-19', name: 'Tissue', desc: 'Grow 19 cells in one colony', tier: 'medium', stat: 'mostCells', goal: 19 },
  { id: 'colony-3', name: 'Empire', desc: 'Unlock Colony III', tier: 'medium', stat: 'colonies', goal: 3 },
  { id: 'rebirths-10', name: 'Cycle of Life', desc: 'Rebirth 10 times', tier: 'medium', stat: 'rebirths', goal: 10 },
  { id: 'rna-100', name: 'Ribosome', desc: 'Earn 100 RNA', tier: 'medium', stat: 'rna', goal: 100 },
  { id: 'perks-10', name: 'Heritage', desc: 'Own 10 rebirth mutations', tier: 'medium', stat: 'perks', goal: 10 },

  { id: 'clicks-100k', name: 'Relentless', desc: 'Click 100,000 times', tier: 'hard', stat: 'clicks', goal: 100000 },
  { id: 'dna-1e18', name: 'Quintillionaire', desc: 'Earn 1 Quintillion DNA', tier: 'hard', stat: 'dna', goal: 1e18 },
  { id: 'cells-37', name: 'Full Hive', desc: 'Grow all 37 cells in one colony', tier: 'hard', stat: 'mostCells', goal: 37 },
  { id: 'stage-19', name: 'Chimera', desc: 'Reach stage 19', tier: 'hard', stat: 'bestStage', goal: 19 },
  { id: 'rebirths-100', name: 'Eternal Return', desc: 'Rebirth 100 times', tier: 'hard', stat: 'rebirths', goal: 100 },
  { id: 'perks-20', name: 'Perfect Genome', desc: 'Own all 20 rebirth mutations', tier: 'hard', stat: 'perks', goal: 20 },
  { id: 'played-10h', name: 'Dedicated', desc: 'Play for 10 hours', tier: 'hard', stat: 'played', goal: 36000 },

  { id: 'immortality', name: 'Immortality', desc: 'Unlock the Immortal Cell', tier: 'named', stat: 'bestStage', goal: 20 },
  { id: 'transcendent', name: 'Transcendent', desc: 'Evolve beyond the Immortal Cell', tier: 'named', stat: 'bestStage', goal: 21 },
  { id: 'transdimensional', name: 'Transdimensional', desc: 'Evolve beyond the Immortal Cell in all three colonies', tier: 'named', stat: 'transcended', goal: 3 }
]
