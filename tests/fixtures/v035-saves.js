// Saves used for the v0.3.5 parity check, written in the v0.3.5 save format
const lv = (o = {}) => ({ clickPower: 0, clickCooldown: 0, autoClickPower: 0, autoClickCooldown: 0, ribosomalSynthesis: 0, chloroplastSymbiosis: 0, critChance: 0, autoCritChance: 0, critPower: 0, endocyticUptake: 0, extraCells: 0, telomerase: 0, ...o })
const MAXED = lv({ clickPower: 180, clickCooldown: 10, autoClickPower: 170, autoClickCooldown: 12, ribosomalSynthesis: 60, chloroplastSymbiosis: 55, critChance: 20, autoCritChance: 20, critPower: 8, endocyticUptake: 10, extraCells: 36, telomerase: 10 })
const ALL_PERKS = ['primordial', 'memory', 'reserve', 'membrane', 'metabolism', 'reflex', 'lucky', 'spores', 'telo1', 'echo', 'colony2', 'budding', 'overclock', 'hyperplasia', 'colony3', 'leap', 'telo2', 'hereditary', 'quantum', 'apex']

export const SAVES = [
  { name: 'early game', v: 2, t: 1795000000000, money: 1234.5, rdna: 0, frac: 0, earned: 0, rebirths: 0, owned: [], pending: false, view: 0,
    colonies: [{ unlocked: true, levels: lv({ clickPower: 7, clickCooldown: 2, autoClickPower: 3 }) }, { unlocked: false, levels: lv() }, { unlocked: false, levels: lv() }] },
  { name: 'mid game, two colonies', v: 2, t: 1795000000000, money: 3.2e12, rdna: 5, frac: 0.42, earned: 12, rebirths: 3, owned: ['primordial', 'memory', 'membrane', 'metabolism', 'lucky'], pending: false, view: 1,
    colonies: [{ unlocked: true, levels: lv({ clickPower: 61, clickCooldown: 10, autoClickPower: 77, autoClickCooldown: 9, ribosomalSynthesis: 21, chloroplastSymbiosis: 18, critChance: 11, autoCritChance: 6, critPower: 3, endocyticUptake: 4, extraCells: 9, telomerase: 2 }) },
      { unlocked: true, levels: lv({ clickPower: 12, clickCooldown: 3, autoClickPower: 4 }) }, { unlocked: false, levels: lv() }] },
  { name: 'late game, every rebirth mutation, a Transcendent colony', v: 2, t: 1795000000000, money: 7.7e15, rdna: 1234, frac: 0.999, earned: 98765, rebirths: 150, owned: ALL_PERKS, pending: false, view: 2,
    colonies: [{ unlocked: true, levels: MAXED }, { unlocked: true, levels: { ...MAXED, clickPower: 95 } }, { unlocked: true, levels: { ...MAXED, clickPower: 700 } }] },
  { name: 'dormant after a rebirth', v: 2, t: 1795000000000, money: 0, rdna: 3, frac: 0.25, earned: 70, rebirths: 9, owned: ['reserve', 'spores', 'colony2', 'leap'], pending: true, view: 2,
    colonies: [{ unlocked: true, levels: lv() }, { unlocked: false, levels: lv() }, { unlocked: false, levels: lv() }] },
  { name: 'damaged save', v: 2, t: 'soon', money: -5, rdna: 3.9, frac: 7, earned: NaN, rebirths: '4', owned: ['apex', 'bogus', 'spores', 'apex'], pending: 0, view: 9,
    colonies: [{ unlocked: false, levels: { clickPower: 1e3, critChance: 99, extraCells: -2, telomerase: 'x' } }, { unlocked: 1, levels: lv({ autoClickPower: 2.7 }) }, null] }
]
