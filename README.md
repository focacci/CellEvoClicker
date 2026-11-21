# Cellular Evolution Clicker

You start as one blue bacterium. Click it to make **DNA**, then spend DNA on **mutations**. As it mutates, your cell evolves through 20 stages from a Procaryotic Sphere to the Immortal Cell, and there is one secret stage after that.

- **DNA** (green double helix) comes from clicks and from auto-clicks. It buys mutations, colonies and solid-color themes, and it resets when you rebirth.
- **RNA** (purple single strand) only comes from rebirth. It buys Rebirth Mutations, which you keep forever.

## How it plays

**Clicking.** When you click the cell mass (or press **Space**), *every* cell in it pays out, so more cells means more DNA per click. A number floats up over each cell. Clicks have a short cooldown (300 ms, down to 50 ms). A **crit** pays ×10 or more, flashes yellow, throws sparks and pops the DNA counter.

**Auto-clicks.** Once you buy Mitochondrial Core, every cell also pays out on its own each tick (every 1 s, down to 0.1 s). Auto-click numbers float up red, and auto-crits are orange and pop the DNA counter too. The game keeps earning while its tab is in the background.

**Mutations.** Each colony has its own mutations. A new one appears when the one before it reaches a set level, and every level costs more than the last.

| Mutation | Effect per level | Max |
|---|---|---|
| Membrane Tension | more DNA per click (doubles every 25 levels) | – |
| Synaptic Reflex | click cooldown −25 ms | 10 |
| Mitochondrial Core | more auto DNA per tick (doubles every 25 levels) | – |
| Metabolic Rate | auto tick −75 ms | 12 |
| Ribosomal Synthesis | +25% click DNA | – |
| Chloroplast Symbiosis | +25% auto DNA | – |
| Mutagenic Strike | +0.5% click crit chance | 20 |
| Transposon Burst | +0.5% auto crit chance | 20 |
| Gene Amplification | crits pay ×10, +5 per level | 8 |
| Endocytic Uptake | clicks also get 10% of auto power | 10 |
| Mitotic Division | +1 cell (a hex-shaped mass of up to 37) | 36 |
| Telomerase Activity | all mutations −3% cost | 10 |

**Stages.** A colony's stage depends on its *total* mutation levels: 0, 5, 15, 25 … 480, and then the Immortal Cell at 540. The yellow bar under the stage name shows how close the next stage is. Click the stage name to open the stage list. Stages you have reached open a short real-biology note and a "Did you know?". Stages you haven't reached show as "???". The secret 21st stage, the **Transcendent Cell** (1,000 levels), stays off the list until you reach it, and its note is glitched text.

**Colonies.** There are three colonies, one screen each, and you move between them with the side arrows. Each colony has its own cells, mutations and stage, but DNA is shared. Colony II costs 100 Billion DNA to unlock and Colony III costs 1 Trillion. Mutations in later colonies cost far more but also pay far more.

**Rebirth.** Once you hold 10 Trillion DNA the Rebirth button fills up. Click it twice to confirm. You get RNA = √(DNA ÷ 10 Trillion), and any leftover fraction carries over to the next rebirth. DNA, mutations and colonies reset, your cell goes dormant, and the panel shows **Rebirth Mutations**. There are 20 of them, costing from 1 to 75,000 RNA. They give multipliers, cheaper mutations, starting levels and cells, keep colonies unlocked, earn DNA while the game is closed (*Dormant Spores*: 50% for up to 12 h), and *Evolutionary Leap*: every stage a colony reaches gives ×1.1, and the Transcendent Cell gives ×10. Click the cell to start the next cycle.

**Achievements, Themes, Stats.** Use the arrows beside the panel title, `‹ Mutations ›`, to cycle through Mutations → Achievements → Themes → Stats. There are 30 achievements from easy to hard, ending with *Immortality*, *Transcendent* and *Transdimensional* (all three colonies at the Transcendent Cell). Solid-color themes are bought with DNA; gradient themes come from easy achievements; *Solar*, *Galactical* and *Singularity* come from the three named achievements. Classic follows your device's light or dark mode. Achievements, themes, totals and time played survive rebirth.

**Settings ⚙.** *Sound*: Music and Effects volume (0% music is off). *Visual*: hide the game name, hide DNA earnings (the Generation Rate line and the `+DNA` pop-ups), currency in the center, slow cell rotation. *Game*: export or import a save code, and **Reset game** (with a confirm pop-up), which erases progress but keeps your sound and visual settings.

**Saving.** The game saves in your browser on its own (every 5 seconds, after every purchase, and when the page closes) under `cellEvoClicker.save.v2`, the same save as v0.3.5, so old saves keep working.

## Running it

```
npm install       # once (needs Node LTS)
npm run dev       # http://localhost:5173, reloads every time you save a file
npm test          # checks the game math, saves, achievements and themes
npm run build     # → dist/index.html: one file with all JS, CSS and the favicon inside
npm run preview   # play the built file
```

To publish, upload `dist/index.html` to Fleuralink as an app. In `npm run dev`, `window.game` is the live game: try `game.colonies[0].levels.clickPower = 540` in the console to jump to the Immortal Cell.

## Where things live

```
index.html              the page: header, colony pane, side panel, pop-ups
src/main.js             start-up and the game loop: tick() then render() every frame, plus autosave
src/state.js            the one `game` object (exactly what gets saved) and newCycle()
src/rules.js            pure math: yields, crits, prices, stages, RNA gain
src/actions.js          the ONLY code that changes `game`: click, autoTick, buy, unlock, rebirth, wake
src/save.js             save, load, export/import, old-save safety checks
src/settings.js         volumes and visual options (their own storage key)
src/achievements.js     measures progress and awards achievements
src/themes.js           buy, wear and apply a theme
src/data/               ← game content, data only: mutations, rebirth, colonies, stages, achievements, themes
src/cells/              cell painting, the hex mass, and art/ (one drawing per stage)
src/fx/  src/audio/     canvas effects and background specks; clicks, purchase sounds and music
src/ui/                 one file per piece of the screen
tests/                  node --test; tests/parity.test.js compares the math with v0.3.5
```

To add or change content (a stage's text, a mutation's price, a new achievement or theme), edit the files in `src/data/` and run `npm test`.

The old single-file game is kept in the git tag `v0.3.5`.
