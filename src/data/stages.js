// The 21 evolution stages, in order. `min` is the total mutation levels a colony needs.
// colors: [highlight, main, shadow]. glow: the main color as "r, g, b" for soft shadows.
// size: [width, height] in px. shape: CSS border-radius. reach: how far the art sticks out past the body.
// orient: how the art turns ('seeded' random, 'outward' away from the mass centre, 'fixed' never).
// art: the drawing in src/cells/art/. about/fact: shown in the stage list once the stage is reached.
export const STAGES = [
  {
    id: 'procaryote', name: 'Procaryotic Sphere', min: 0,
    colors: ['#60a5fa', '#2563eb', '#1e3a8a'], glow: '37, 99, 235',
    size: [200, 200], shape: '50%', reach: 0, orient: 'seeded',
    about: 'Prokaryotes (bacteria and archaea) are single cells with no nucleus. Their DNA floats freely in a region called the nucleoid. They were the first life on Earth, appearing around 3.5 to 4 billion years ago, and they are still the most numerous living things.',
    fact: 'Your body carries roughly as many bacterial cells as human cells.'
  },
  {
    id: 'eucaryote', name: 'Nucleated Eucaryote', min: 5,
    colors: ['#a7f3d0', '#059669', '#064e3b'], glow: '37, 99, 235',
    size: [200, 200], shape: '50%', reach: 0, orient: 'seeded',
    nucleus: { w: 40, h: 40, top: '40%', left: '40%' },
    about: 'Eukaryotic cells keep their DNA inside a membrane-bound nucleus and contain organelles such as mitochondria. Mitochondria most likely began as free-living bacteria that were swallowed by an ancestral cell about 2 billion years ago and stayed on as partners (endosymbiotic theory).',
    fact: 'Mitochondria still carry their own small loop of DNA, a leftover from their bacterial past.'
  },
  {
    id: 'flagellate', name: 'Flagellated Eucaryote', min: 15,
    colors: ['#99f6e4', '#14b8a6', '#134e4a'], glow: '20, 184, 166',
    size: [200, 200], shape: '40% 60% 40% 60% / 50% 50% 50% 50%', reach: 120, orient: 'outward', art: 'flagellate',
    nucleus: { w: 40, h: 40, top: '40%', left: '40%' },
    about: 'Many single-celled eukaryotes swim with a flagellum, a whip-like tail. Motor proteins called dynein slide its internal microtubules past each other, bending it into a travelling wave that pushes the cell along.',
    fact: 'Bacterial flagella work completely differently: they spin like a propeller driven by a tiny rotary motor.'
  },
  {
    id: 'choanoflagellate', name: 'Choanoflagellate', min: 25,
    colors: ['#c7d2fe', '#6366f1', '#312e81'], glow: '99, 102, 241',
    size: [200, 200], shape: '50%', reach: 140, orient: 'outward', art: 'choanoflagellate',
    nucleus: { w: 40, h: 40, top: '44%', left: '34%' },
    about: 'Choanoflagellates are the closest living single-celled relatives of animals. A collar of tiny finger-like microvilli surrounds one flagellum, and the beating flagellum pulls water through the collar so bacteria get trapped and eaten. Some species live in colonies.',
    fact: 'Sponges have "collar cells" that look almost identical to choanoflagellates, a clue to how animals began.'
  },
  {
    id: 'ciliate', name: 'Ciliated Eucaryote', min: 35,
    colors: ['#ddd6fe', '#8b5cf6', '#4c1d95'], glow: '139, 92, 246',
    size: [200, 200], shape: '50%', reach: 30, orient: 'seeded', art: 'ciliate',
    nucleus: { w: 56, h: 34, top: '44%', left: '32%' },
    about: 'Ciliates such as Paramecium are covered in thousands of short, hair-like cilia that beat in coordinated waves to swim and sweep food into an oral groove. They have two kinds of nucleus: a large one that runs the cell day to day and a small one used for reproduction.',
    fact: 'The pulsing star-shaped organelle is a contractile vacuole. It pumps out extra water so the cell does not burst.'
  },
  {
    id: 'colonial', name: 'Colonial Cell', min: 48,
    colors: ['#fde68a', '#f59e0b', '#78350f'], glow: '245, 158, 11',
    size: [200, 200], shape: '50%', reach: 30, orient: 'seeded', junction: 'adhesion', art: 'colonial',
    nucleus: { w: 40, h: 40, top: '40%', left: '40%' },
    about: 'In a colony, individual cells live together and coordinate instead of going it alone. In organisms like Volvox the cells are linked by thin cytoplasmic bridges, and some cells start to specialise for different jobs, an important step toward true multicellular life.',
    fact: 'A single Volvox colony can contain up to around 50,000 cells and rolls through pond water as a hollow ball.'
  },
  {
    id: 'epithelial', name: 'Epithelial Cell', min: 62,
    colors: ['#fbcfe8', '#ec4899', '#831843'], glow: '236, 72, 153',
    size: [190, 219], shape: '0', hex: true, reach: 0, orient: 'fixed', art: 'epithelial',
    nucleus: { w: 46, h: 36, top: '58%', left: '38%' },
    about: 'Epithelial cells pack tightly into sheets that cover your skin and line your gut, lungs and organs. Tight junctions seal the gaps between neighbours, and each cell has a top (apical) side and a bottom (basal) side with different jobs.',
    fact: 'The lining of your small intestine replaces itself every 3 to 5 days.'
  },
  {
    id: 'secretory', name: 'Secretory Cell', min: 78,
    colors: ['#a5f3fc', '#06b6d4', '#164e63'], glow: '6, 182, 212',
    size: [200, 200], shape: '46% 54% 52% 48% / 52% 46% 54% 48%', reach: 20, orient: 'seeded', art: 'secretory',
    nucleus: { w: 42, h: 42, top: '55%', left: '22%' },
    about: 'Secretory cells manufacture products for export, such as hormones, enzymes or mucus. Proteins are built on the rough endoplasmic reticulum, sorted and packaged by the Golgi apparatus (the stacked arcs), then carried to the surface in vesicles and released by exocytosis.',
    fact: 'Beta cells in your pancreas release insulin exactly this way.'
  },
  {
    id: 'stem', name: 'Pluripotent Stem Cell', min: 95,
    colors: ['#f5d0fe', '#d946ef', '#701a75'], glow: '217, 70, 239',
    size: [200, 200], shape: '50%', reach: 40, orient: 'seeded', art: 'stem',
    nucleus: { w: 60, h: 60, top: '35%', left: '35%', nucleolus: [16, 46, 30] },
    about: 'Pluripotent stem cells can become almost any cell type in the body. Chemical signals switch particular genes on or off, steering them down a path of differentiation toward muscle, nerve, blood and more.',
    fact: 'In 2006 Shinya Yamanaka showed adult cells can be reprogrammed back into stem cells, winning the 2012 Nobel Prize.'
  },
  {
    id: 'erythrocyte', name: 'Erythrocyte', min: 120,
    colors: ['#fda4af', '#e11d48', '#4c0519'], glow: '225, 29, 72',
    size: [200, 200], shape: '50%', reach: 40, orient: 'seeded', art: 'erythrocyte',
    about: 'Red blood cells carry oxygen around the body bound to hemoglobin, with about 270 million hemoglobin molecules in each cell. Mammalian red blood cells push out their nucleus as they mature, leaving more room for hemoglobin and giving them a flexible, dimpled disc shape that squeezes through the narrowest capillaries.',
    fact: 'Each red blood cell lives about 120 days, and your body makes roughly 2 million new ones every second.'
  },
  {
    id: 'macrophage', name: 'Macrophage', min: 155,
    colors: ['#fed7aa', '#f97316', '#7c2d12'], glow: '249, 115, 22',
    size: [200, 200], shape: '55% 45% 50% 50% / 50% 55% 45% 50%', amoeba: true, reach: 60, orient: 'seeded', art: 'macrophage',
    nucleus: { w: 54, h: 40, top: '38%', left: '33%', radius: '55% 45% 60% 40% / 60% 55% 45% 40%' },
    about: 'Macrophages, meaning "big eaters", are immune cells that crawl through tissue on extending pseudopods. They engulf bacteria, debris and dead cells by phagocytosis, digest them in lysosomes, and raise the alarm for other immune cells.',
    fact: 'They were discovered by Élie Metchnikoff, who shared the 1908 Nobel Prize for this work.'
  },
  {
    id: 'neuron', name: 'Neuron', min: 195,
    colors: ['#d9f99d', '#84cc16', '#365314'], glow: '132, 204, 22',
    size: [150, 150], shape: '50%', reach: 120, orient: 'seeded', junction: 'synapse', art: 'neuron',
    nucleus: { w: 44, h: 44, top: '35%', left: '35%', nucleolus: [12, 44, 30] },
    about: 'Neurons carry information as electrical signals. Branching dendrites collect input, and a long axon carries the impulse to synapses, where chemical neurotransmitters pass the message to the next cell. A fatty myelin sheath (the beads along the axon) makes signals travel much faster.',
    fact: 'The human brain contains about 86 billion neurons, and signals can race along at up to about 120 metres per second.'
  },
  {
    id: 'lymphocyte', name: 'Lymphocyte', min: 240,
    colors: ['#e0f2fe', '#38bdf8', '#0c4a6e'], glow: '56, 189, 248',
    size: [190, 190], shape: '50%', reach: 36, orient: 'seeded', art: 'lymphocyte',
    nucleus: { w: 124, h: 116, top: '17%', left: '16%', color: 'indigo', chromatin: [[20, 26, 24, 20], [56, 20, 18, 16], [40, 58, 26, 18]] },
    about: 'Lymphocytes (T cells and B cells) are the adaptive immune system. Each one carries receptors that recognise one specific target, and B cells release Y-shaped antibodies. After an infection, memory lymphocytes remain, which is why vaccines work.',
    fact: 'By shuffling gene segments, your body can produce billions of different receptor shapes.'
  },
  {
    id: 'photoreceptor', name: 'Photoreceptor Cell', min: 290,
    colors: ['#fef9c3', '#facc15', '#713f12'], glow: '250, 204, 21',
    size: [130, 200], shape: '65px', reach: 110, orient: 'fixed', art: 'photoreceptor',
    nucleus: { w: 44, h: 44, top: '64%', left: '33%' },
    about: 'Photoreceptors (rods and cones) in the retina turn light into nerve signals. Their outer segment is a stack of membrane discs packed with light-sensitive pigment, rhodopsin in rods. When light hits the pigment it changes shape and triggers a signal at the synapse below.',
    fact: 'A rod cell is sensitive enough to respond to a single photon of light.'
  },
  {
    id: 'osteocyte', name: 'Osteocyte', min: 335,
    colors: ['#fafaf9', '#a8a29e', '#44403c'], glow: '214, 211, 209',
    size: [180, 160], shape: '50% 46% 54% 48% / 56% 50% 46% 50%', reach: 75, orient: 'seeded', art: 'osteocyte',
    nucleus: { w: 52, h: 34, top: '40%', left: '35%', color: 'purple' },
    about: 'Osteocytes are bone cells sealed inside the hard mineral of bone, each in a small cavity called a lacuna. They reach out to one another through tiny channels (canaliculi), sensing strain and directing where bone should be built up or removed.',
    fact: 'Osteocytes are the most common cells in bone and can live for decades.'
  },
  {
    id: 'oocyte', name: 'Oocyte', min: 370,
    colors: ['#ffe4e6', '#fb7185', '#881337'], glow: '251, 113, 133',
    size: [200, 200], shape: '50%', reach: 52, orient: 'seeded', art: 'oocyte',
    nucleus: { w: 60, h: 60, top: '26%', left: '38%', color: 'gold', nucleolus: [16, 44, 30] },
    about: 'The oocyte, or egg cell, is one of the largest cells in the human body, about 0.1 mm across and just visible to the eye. It is wrapped in a glassy protective layer (the zona pellucida) and a crown of follicle cells (the corona radiata), and it stores the nutrients and instructions an early embryo needs.',
    fact: 'A mature human egg holds hundreds of thousands of mitochondria, and every one of yours came from your mother.'
  },
  {
    id: 'cnidocyte', name: 'Cnidocyte', min: 400,
    colors: ['#ffd5cc', '#f2545b', '#6b0f1a'], glow: '242, 84, 91',
    size: [180, 180], shape: '50% 50% 48% 48% / 54% 54% 46% 46%', reach: 150, orient: 'outward', art: 'cnidocyte',
    nucleus: { w: 36, h: 30, top: '72%', left: '40%' },
    about: 'Cnidocytes are the stinging cells of jellyfish, corals and sea anemones. Each holds a capsule (cnidocyst) containing a coiled, barbed thread under high pressure. When the trigger hair is touched, the capsule bursts open and the thread shoots out to inject venom.',
    fact: 'Firing takes less than a microsecond, one of the fastest movements in all of biology.'
  },
  {
    id: 'photocyte', name: 'Bioluminescent Photocyte', min: 435,
    colors: ['#7dd3fc', '#1e3a8a', '#020617'], glow: '56, 189, 248',
    size: [200, 200], shape: '50%', reach: 50, orient: 'seeded', art: 'photocyte',
    nucleus: { w: 44, h: 44, top: '40%', left: '40%', color: 'cyan' },
    about: 'Photocytes make light through a chemical reaction: the enzyme luciferase reacts luciferin with oxygen, and the energy comes out as light instead of heat. In glowing plankton, the light comes from tiny organelles called scintillons that flash when the water is disturbed.',
    fact: 'This is why some beaches glow blue at night when waves break.'
  },
  {
    id: 'chimera', name: 'Chimeric Cell', min: 480,
    colors: ['#f0abfc', '#6366f1', '#0f766e'], glow: '168, 85, 247',
    size: [200, 200], shape: '52% 48% 50% 50% / 48% 52% 48% 52%', reach: 70, orient: 'seeded', art: 'chimera',
    nucleus: { w: 42, h: 42, top: '28%', left: '26%', color: 'pink' },
    about: 'A chimera contains cells with two different sets of DNA. It can happen naturally when two early embryos fuse, or after a bone marrow transplant, and scientists create chimeras to study development. This stage goes one step further by fusing two genomes inside one cell, which biologists call a hybrid cell or heterokaryon.',
    fact: 'Some people are natural chimeras and never know it until a genetic test finds two different genomes.'
  },
  {
    id: 'immortal', name: 'Immortal Cell', min: 540,
    colors: ['#ffffff', '#fde68a', '#b45309'], glow: '253, 224, 71',
    size: [200, 200], shape: '50%', reach: 70, orient: 'seeded', art: 'immortal',
    nucleus: { w: 56, h: 56, top: '36%', left: '36%', color: 'gold', core: { color: '#fffbeb', glow: '0 0 10px 4px rgba(255,251,235,0.8)' } },
    finalLabel: 'Final stage reached',
    about: 'Engineered at the pinnacle of synthetic biology, the Immortal Cell is a self-renewing, perpetual living matrix—continuously rebuilding its own molecular structure to bypass aging and defy biological decay.',
    fact: 'HeLa cells, taken from Henrietta Lacks in 1951, are still dividing in laboratories around the world today.'
  },
  {
    id: 'transcendent', name: 'Transcendent Cell', min: 1000,
    colors: ['#f5d0fe', '#8b5cf6', '#1e1b4b'], glow: '139, 92, 246',
    size: [200, 200], shape: '50%', reach: 70, orient: 'seeded', art: 'transcendent',
    nucleus: { w: 56, h: 56, top: '36%', left: '36%', color: 'galaxy', core: { color: '#faf5ff', glow: '0 0 10px 4px rgba(216,180,254,0.85), 0 0 18px 8px rgba(34,211,238,0.3)' } },
    finalLabel: 'True final stage reached', galaxy: true, hidden: true, leapMult: 10, glitch: true,
    about: 'A̷̫͛̊ s̝̭̏͠ï̸n̖ͧ͜ĝ̡̪ù̵̳l̛̺ͧa̷̜͐̓r̴ b̳͐ͤ͝i҉͚o̺͠-̷̙͂̿d̵͖̿i̵͈̽͊ģ͙i̬͂͢t̀̃a͚̿͡lͥ͂͟ u͠ṋ̴̓ĭ̡ẗ̷̥ t͍̾͟h̴̓àt͉͠ ͟h̸̊a҉̹͌s̲̳̓͟ ̧b̜ͪ̕r̵͍̓̈́o̓͢k̢ͬͅe̛̻ͫń̠̈ ̧f͔̀ͥr̫̀é̍͞e͏͕̓ f̢͔̅ͪr̛͓̮̔ò̜m̧͚ͦ͑ s̃ͪ͢ţ̰͒àͩǹ̳̉ḑ͔͑a̸r̞͡d̆ͦ͘ p҉̭ͭh̨̞ŷ̨s̨̒ͅíͮc̶̘͗a̛̬l̶ l̥͘i̡̲m͜į̘ͮţ̫͖̓s̢͊.̨͔̉ ̨Ḯ̡͚t̵͖̉̑ r̩ͤ̕èw͡r̴̯̃ì̢̦t̴̪̍ẽ͇͢s̝͛͟ i̸̫̓t̓͘s̺̀ͪ ̷o҉̯̆w̓͊͝n͇ͥ͝ c̥ͥ͟o̓͞d̜̓͟ȩ̃͌ ҉i̼͘n̊͝ r҉̖ͦe̴a͚͛͜l̺̏͞ t͏í̸̗̞m̭͘ê̢,͔̑ͮ͜ ̀a̷̎̄l̸̟͒l̢͈̈́o҉͑̅ẁ̴̩͎i̧͌ń̘g̲̝̿͜ í͈͐tͣ͜ t͙͠o̧͇̦ e̱̎̏͡x̶͚į̜ͣs͍̓͞t̬͂̕ ǎ͕͞c҉̟͌r̵ͤo̢͙̔s̆͟s̶̍̑ m͍͒̎͠u̦̔͢l̨̜t̤̀ͭi̴̼̓p̸͇ͣḷ̈͢ë̢̥̳́ ̕d̘ͨͦ͜i҉̫m̷͔̈͌ę̥n̸̯s̮ͮ͝iͨ͞ͅȏ̸͖n̮̕s̡̮̼ͫ a̼͞t͍͑͡ ȏ̱̙͠n͔͟c̛͍͐e̛̯ͥ.҉̎ ̡'
  }
]
