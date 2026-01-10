
import { PlaceHolderImages } from './placeholder-images';
import { generateHints } from './hint-engine';

export interface Level {
  id: string;
  place: string;
  country: string;
  facts: string[][]; // Facts are now a nested array
  category: 'architecture' | 'nature' | 'sky' | 'city' | 'interior' | 'abstract';
  visualComplexity: 'low' | 'medium' | 'high';
  imageId: string;
  variations: number;
}

export type Solution =
  | { type: "swap"; indices: [number, number] }
  | { type: "rotate"; index: number; correctRotation: number }
  | { type: "symmetry-swap"; indices: [number, number]; axis: "vertical" | "horizontal" };

export interface Tile {
  originalIndex: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface Puzzle {
  solvedBoard: Tile[];
  scrambledBoard: Tile[];
  solution: Solution;
  imageUrl: string;
  imageHint: string;
  hints: string[];
  facts: string[];
}

const allLevels: Level[] = [
  {
    id: 'lvl_001',
    place: 'Eiffel Tower',
    country: 'France',
    facts: [
      ['Built in 1889 for the World’s Fair.', 'Made of wrought iron, it stands ~330 meters tall.', 'Initially criticized by artists, it became a global symbol of France.'],
      ['The tower is repainted every seven years, requiring 60 tons of paint.', 'Its height varies by up to 15 cm due to temperature changes.', 'The names of 72 French scientists are engraved on the tower.']
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'eiffel-tower',
    variations: 1,
  },
  {
    id: 'lvl_002',
    place: 'Colosseum',
    country: 'Italy',
    facts: [
      ['Built between 70–80 AD, it is the largest ancient amphitheater ever constructed.', 'Used for gladiator fights, it could seat around 50,000 people.', 'It is a UNESCO World Heritage Site and one of the New Seven Wonders of the World.'],
      ['The hypogeum, an underground network of tunnels, was added later to house gladiators and animals.', 'It is estimated that over 400,000 people died within its walls.', 'The southern side collapsed during a major earthquake in 1349.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'colosseum',
    variations: 1,
  },
  {
    id: 'lvl_003',
    place: 'Elizabeth Tower (Big Ben)',
    country: 'UK',
    facts: [
      ['Commonly called Big Ben, which is the name of the Great Bell inside.', 'Completed in 1859, it is a symbol of British democracy.', 'The tower is 96 meters tall and features a world-famous clock.'],
      ['It was renamed Elizabeth Tower in 2012 to celebrate the Queen\'s Diamond Jubilee.', 'The clock is renowned for its reliability.', 'The tower is part of the Palace of Westminster.']
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'elizabeth-tower',
    variations: 1,
  },
  {
    id: 'lvl_004',
    place: 'Tower Bridge',
    country: 'UK',
    facts: [
      ['Opened in 1894, it crosses the River Thames in London.', 'It is a combined bascule and suspension bridge, often mistaken for London Bridge.', 'The walkways between the towers are open to the public, offering city views.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'tower-bridge',
    variations: 1,
  },
  {
    id: 'lvl_005',
    place: 'Sagrada Família',
    country: 'Spain',
    facts: [
      ['Designed by Antoni Gaudí, construction began in 1882 and is still ongoing.', 'Its unique organic architecture is inspired by nature.', 'When finished, it will be the tallest church in Europe.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'sagrada-familia',
    variations: 1,
  },
  {
    id: 'lvl_006',
    place: 'Alhambra',
    country: 'Spain',
    facts: [
      ['A Moorish palace complex from the 13th century in Granada.', 'Famous for its intricate Islamic carvings, tilework, and beautiful courtyards.', 'Its name comes from an Arabic root meaning "red castle".']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'alhambra',
    variations: 1,
  },
  {
    id: 'lvl_007',
    place: 'Acropolis of Athens',
    country: 'Greece',
    facts: [
      ['An ancient citadel built on a rocky outcrop above Athens in the 5th century BC.', 'It includes the Parthenon, a temple dedicated to the goddess Athena.', 'It is a symbol of democracy and Classical Greek architecture.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'acropolis-of-athens',
    variations: 1,
  },
  {
    id: 'lvl_008',
    place: 'Stonehenge',
    country: 'England',
    facts: [
      ['A prehistoric monument of massive stones built around 3000 BC.', 'Its purpose is still debated, but it is aligned with the solstices.', 'A UNESCO World Heritage Site, it is one of Europe’s most mysterious landmarks.']
    ],
    category: 'nature',
    visualComplexity: 'medium',
    imageId: 'stonehenge',
    variations: 1,
  },
  {
    id: 'lvl_009',
    place: 'Louvre',
    country: 'France',
    facts: [
      ["The world's largest and most visited art museum, housed in a former royal palace.", 'It is home to the Mona Lisa and features a famous glass pyramid entrance.', 'The museum opened in 1793 and now holds over 35,000 artworks.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'louvre',
    variations: 1,
  },
  {
    id: 'lvl_010',
    place: 'Notre-Dame de Paris',
    country: 'France',
    facts: [
      ['A masterpiece of Gothic architecture, built between 1163–1345.', 'Famous for its rose windows and flying buttresses.', 'A 2019 fire destroyed its spire and roof, leading to a major restoration effort.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'notre-dame-de-paris',
    variations: 1,
  },
  {
    id: 'lvl_011',
    place: 'Mont-Saint-Michel',
    country: 'France',
    facts: [
      ['A tidal island in Normandy topped by a medieval abbey founded in the 8th century.', 'It is a major pilgrimage site and UNESCO World Heritage Site.', 'The island is surrounded by some of the fastest tides in Europe.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'mont-saint-michel',
    variations: 1,
  },
  {
    id: 'lvl_012',
    place: 'Arc de Triomphe',
    country: 'France',
    facts: [
      ['Commissioned by Napoleon and completed in 1836 to honor French soldiers.', 'It stands at the center of the Place Charles de Gaulle, at the end of the Champs-Élysées.', 'The Tomb of the Unknown Soldier from WWI is beneath its vault.']
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'arc-de-triomphe',
    variations: 1,
  },
  {
    id: 'lvl_013',
    place: 'Brandenburg Gate',
    country: 'Germany',
    facts: [
      ['An 18th-century neoclassical monument in Berlin.', 'It has become a symbol of German unity and stood in the divide during the Cold War.', 'The Quadriga, a chariot drawn by four horses, sits on top of the gate.']
    ],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'brandenburg-gate',
    variations: 1,
  },
  {
    id: 'lvl_014',
    place: 'Neuschwanstein Castle',
    country: 'Germany',
    facts: [
      ['A 19th-century fairy-tale castle built by King Ludwig II of Bavaria.', 'It was the inspiration for Disneyland\'s Sleeping Beauty Castle.', 'Set in the Alps, it is one of the most photographed castles in Europe.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'neuschwanstein-castle',
    variations: 1,
  },
  {
    id: 'lvl_015',
    place: 'Charles Bridge',
    country: 'Czech Republic',
    facts: [
      ['A Gothic stone bridge crossing the Vltava River in Prague, built in the 14th century.', 'It is decorated with 30 statues and is now a pedestrian-only zone.', 'A popular spot for tourists and artists, especially at sunrise.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'charles-bridge',
    variations: 1,
  },
  {
    id: 'lvl_016',
    place: 'Moscow Kremlin',
    country: 'Russia',
    facts: [
      ['A fortified complex in the heart of Moscow, serving as the seat of the Russian government.', 'The complex includes several cathedrals, palaces, and the iconic red brick walls.', 'A UNESCO World Heritage Site overlooking Red Square.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'moscow-kremlin',
    variations: 1,
  },
  {
    id: 'lvl_017',
    place: 'Trevi Fountain',
    country: 'Italy',
    facts: [
      ['The largest Baroque fountain in Rome, completed in 1762.', 'It is famous for the coin toss ritual; throwing a coin over your shoulder ensures a return to Rome.', 'The money collected from the fountain is used to fund charities.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'trevi-fountain',
    variations: 1,
  },
  {
    id: 'lvl_018',
    place: 'Leaning Tower of Pisa',
    country: 'Italy',
    facts: [
      ['The bell tower of Pisa Cathedral, famous for its unintentional tilt.', 'The lean is caused by an inadequate foundation on soft ground.', 'The structure was stabilized in the late 20th century.']
    ],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'leaning-tower-of-pisa',
    variations: 1,
  },
  {
    id: 'lvl_019',
    place: 'Milan Cathedral (Duomo)',
    country: 'Italy',
    facts: [
      ['The largest church in Italy, a masterpiece of Gothic architecture.', 'It took nearly 600 years to complete and features a stunning white marble façade.', 'Visitors can walk on the roof among its 135 spires for city views.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'milan-cathedral',
    variations: 1,
  },
  {
    id: 'lvl_020',
    place: 'Venice',
    country: 'Italy',
    facts: [
      ['A city built on 118 small islands, connected by canals and bridges.', 'It has no roads for cars; transport is by boat, including the iconic gondolas.', 'A UNESCO World Heritage Site known for its romantic atmosphere and Renaissance architecture.']
    ],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'venice',
    variations: 1,
  },
  {
    id: 'lvl_021',
    place: 'Rialto Bridge',
    country: 'Italy',
    facts: [
      ['The oldest bridge crossing the Grand Canal in Venice.', 'A 16th-century stone arch bridge lined with shops.', 'A major commercial crossing and one of Venice\'s most famous icons.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'rialto-bridge',
    variations: 1,
  },
  {
    id: 'lvl_022',
    place: 'Edinburgh Castle',
    country: 'Scotland',
    facts: [
      ['A historic royal fortress built on a volcanic rock overlooking Edinburgh.', 'It dates back to the 12th century and holds the Scottish Crown Jewels.', 'A daily gun salute is fired from the castle at 1 PM.']
    ],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'edinburgh-castle',
    variations: 1,
  },
];

export const levels: Level[] = allLevels;

export function getImageUrl(
  imageId: string,
  availableVariations: number,
  round = 0
): { url: string; hint: string; facts: string[] } {
  const level = allLevels.find((l) => l.imageId === imageId);
  if (!level) {
    // A safe fallback to prevent crashes
    return {
      url: `/images/eiffel-tower-1.jpg`,
      hint: "paris france",
      facts: ["The Eiffel Tower was built in 1889.", "It is located in Paris, France.", "It is a famous landmark."],
    };
  }

  // Placeholder-images.ts is not used in this setup, but we could use it for hints
  const hint = imageId.replace(/-/g, ' ');

  const safeVariations = Math.max(1, availableVariations || 1);
  const safeRound = (round >>> 0);

  const factIndex = safeRound % level.facts.length;
  const facts = level.facts[factIndex] ?? level.facts[0];

  const variationIndex = safeRound % safeVariations;
  const fileVariantNumber = variationIndex + 1;

  const url = `/images/${imageId}-${fileVariantNumber}.jpg`;
  return { url, hint, facts };
}


function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeedToUint(seed: string): number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = (h ^ seed.charCodeAt(i)) * 16777619;
  }
  return (h >>> 0);
}

function idxToRowCol(idx: number, grid: number) {
  return { row: Math.floor(idx / grid), col: idx % grid };
}

function rowColToIdx(row: number, col: number, grid: number) {
  return row * grid + col;
}

function mirroredIndex(idx: number, grid: number, axis: "vertical" | "horizontal") {
  const { row, col } = idxToRowCol(idx, grid);
  if (axis === "vertical") {
    return rowColToIdx(row, grid - 1 - col, grid);
  }
  return rowColToIdx(grid - 1 - row, col, grid);
}

function pickNonSelfMirroredIndex(rng: () => number, grid: number) {
  const total = grid * grid;
  for (let tries = 0; tries < 50; tries++) {
    const idx = Math.floor(rng() * total);
    const axis: "vertical" | "horizontal" = rng() < 0.5 ? "vertical" : "horizontal";
    const mir = mirroredIndex(idx, grid, axis);
    if (mir !== idx) return { idx, axis, mir };
  }
  const idx = 0;
  const axis: "vertical" | "horizontal" = "vertical";
  const mir = mirroredIndex(idx, grid, axis);
  return { idx, axis, mir: mir === idx ? 1 : mir };
}

function chooseRotation(rng: () => number): 90 | 180 | 270 {
  const opts: (90 | 180 | 270)[] = [90, 180, 270];
  return opts[Math.floor(rng() * opts.length)];
}

function getDifficultyProfile(levelIndex: number, visualComplexity: Level["visualComplexity"]) {
  const hard = levelIndex >= 1;
  const veryHard = levelIndex >= 5;
  const insane = levelIndex >= 12;

  const baseRotate =
    visualComplexity === "low" ? 0.40 :
    visualComplexity === "medium" ? 0.32 :
    0.24;

  const rotateChance = insane ? baseRotate + 0.25
    : veryHard ? baseRotate + 0.18
    : hard ? baseRotate + 0.10
    : baseRotate;

  const symmetryChance = insane ? 0.55
    : veryHard ? 0.45
    : hard ? 0.30
    : 0.0;

  const maxHints = insane ? 0 : veryHard ? 1 : hard ? 2 : 3;

  return {
    rotateChance: Math.min(0.85, rotateChance),
    symmetryChance: Math.min(0.70, symmetryChance),
    maxHints,
  };
}


function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function neighbors(idx: number, grid: number): number[] {
  const { row, col } = idxToRowCol(idx, grid);
  const out: number[] = [];
  if (row > 0) out.push(rowColToIdx(row - 1, col, grid));
  if (row < grid - 1) out.push(rowColToIdx(row + 1, col, grid));
  if (col > 0) out.push(rowColToIdx(row, col - 1, grid));
  if (col < grid - 1) out.push(rowColToIdx(row, col + 1, grid));
  return out;
}

function pickNearIndex(rng: () => number, grid: number, baseIdx: number, radius: number) {
  const { row, col } = idxToRowCol(baseIdx, grid);
  const rMin = clamp(row - radius, 0, grid - 1);
  const rMax = clamp(row + radius, 0, grid - 1);
  const cMin = clamp(col - radius, 0, grid - 1);
  const cMax = clamp(col + radius, 0, grid - 1);

  for (let tries = 0; tries < 30; tries++) {
    const rr = rMin + Math.floor(rng() * (rMax - rMin + 1));
    const cc = cMin + Math.floor(rng() * (cMax - cMin + 1));
    const idx = rowColToIdx(rr, cc, grid);
    if (idx !== baseIdx) return idx;
  }

  const n = neighbors(baseIdx, grid);
  return n[Math.floor(rng() * n.length)];
}

function pickHardSwapPair(rng: () => number, grid: number, levelIndex: number) {
  const total = grid * grid;
  const i1 = Math.floor(rng() * total);

  if (levelIndex >= 1) {
    const n = neighbors(i1, grid);
    if (n.length) {
      const i2 = n[Math.floor(rng() * n.length)];
      return [i1, i2] as [number, number];
    }
  }

  const radius = levelIndex >= 5 ? 2 : 1;
  const i2 = pickNearIndex(rng, grid, i1, radius);
  return [i1, i2] as [number, number];
}

export const generatePuzzle = (
  imageId: string,
  grid: number,
  levelIndex: number,
  seed?: string
): Puzzle => {
  const level = allLevels.find((l) => l.imageId === imageId);
  if (!level) throw new Error(`Could not find level with imageId: ${imageId}`);

  let round = 0;
  let rng = Math.random;

  if (seed) {
    const numericSeed = hashSeedToUint(seed);
    rng = mulberry32(numericSeed);
    round = numericSeed;
  } else if (typeof window !== "undefined") {
    round = parseInt(localStorage.getItem("gameRound") || "0", 10) >>> 0;
  }

  const { url: imageUrl, hint: imageHint, facts } = getImageUrl(
    level.imageId,
    level.variations,
    round
  );

  const totalTiles = grid * grid;
  const solvedBoard: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
    originalIndex: i,
    rotation: 0,
  }));

  const scrambledBoard: Tile[] = solvedBoard.map((t) => ({ ...t }));
  
  const profile = getDifficultyProfile(levelIndex, level.visualComplexity);
  
  let solution: Solution;
  let proceduralHints: string[] = [];
  
  const rotateW = profile.rotateChance;
  const symmetryW = profile.symmetryChance;
  
  const r = rng();

  if (r < rotateW) {
    // ROTATE
    const index = Math.floor(rng() * totalTiles);
    const rotation = chooseRotation(rng);
    scrambledBoard[index].rotation = rotation;

    solution = { type: "rotate", index, correctRotation: 0 };
    proceduralHints = generateHints(grid, [index]);

  } else if (r < rotateW + symmetryW) {
    // SYMMETRY SWAP
    const pick = pickNonSelfMirroredIndex(rng, grid);
    const i1 = pick.idx;
    const i2 = pick.mir;

    [scrambledBoard[i1], scrambledBoard[i2]] = [scrambledBoard[i2], scrambledBoard[i1]];

    solution = { type: "symmetry-swap", indices: [i1, i2], axis: pick.axis };

    const base = generateHints(grid, [i1, i2]);
    const symmetryLine =
        pick.axis === "vertical"
        ? "Look for a mistake across the vertical mirror line (left ↔ right)."
        : "Look for a mistake across the horizontal mirror line (top ↔ bottom).";
    proceduralHints = [symmetryLine, ...base];

  } else {
    // NORMAL SWAP (harder: nearby swaps)
    const [index1, index2] = pickHardSwapPair(rng, grid, levelIndex);

    [scrambledBoard[index1], scrambledBoard[index2]] = [
      scrambledBoard[index2],
      scrambledBoard[index1],
    ];

    solution = { type: "swap", indices: [index1, index2] };
    proceduralHints = generateHints(grid, solution.indices);
  }

  proceduralHints = proceduralHints.slice(0, profile.maxHints);

  return {
    solvedBoard,
    scrambledBoard,
    solution,
    imageUrl,
    imageHint,
    hints: proceduralHints,
    facts,
  };
};
