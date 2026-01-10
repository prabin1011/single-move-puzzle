
import { generateHints } from './hint-engine';

export interface Level {
  id: string;
  place: string;
  country: string;
  facts: string[][];
  category: "architecture" | "nature" | "sky" | "city" | "interior" | "abstract";
  visualComplexity: "low" | "medium" | "high";
  imageId: string;
  variations: number;
}

export const allLevels: Level[] = [
  {
    id: "lvl-01",
    place: "Eiffel Tower",
    country: "France",
    facts: [
      ["Designed by Gustave Eiffel.", "Built in 1889 for the World's Fair."],
      ["Made of wrought iron and is ~330 meters tall.", "Initially criticized by artists but became a global symbol."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "eiffel-tower",
    variations: 1,
  },
  {
    id: "lvl-02",
    place: "Colosseum",
    country: "Italy",
    facts: [
      ["Ancient Roman amphitheater built between 70–80 AD.", "Used for gladiator fights and could seat ~50,000 people."],
      ["A symbol of Roman engineering, now a UNESCO World Heritage Site.", "Partially damaged by earthquakes over the centuries."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "colosseum",
    variations: 1,
  },
  {
    id: "lvl-03",
    place: "Elizabeth Tower",
    country: "UK",
    facts: [
        ["Commonly called Big Ben, it was completed in 1859.", "Part of the Palace of Westminster in London."],
        ["A symbol of British democracy, it was renamed Elizabeth Tower in 2012.", "Stands 96 meters tall and is a Gothic Revival icon."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "elizabeth-tower",
    variations: 1,
  },
  {
    id: "lvl-04",
    place: "Tower Bridge",
    country: "UK",
    facts: [
        ["A bascule and suspension bridge that crosses the River Thames.", "Opened in 1894 and is an icon of the London skyline."],
        ["The towers are connected by high-level walkways.", "It still opens to allow ships to pass through."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "tower-bridge",
    variations: 1,
  },
  {
    id: "lvl-05",
    place: "Sagrada Família",
    country: "Spain",
    facts: [
        ["Designed by Antoni Gaudí, with construction starting in 1882.", "It is still under construction, funded by donations."],
        ["Its unique organic architecture is inspired by nature.", "It is a UNESCO World Heritage Site in Barcelona."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "sagrada-familia",
    variations: 1,
  },
  {
    id: "lvl-06",
    place: "Alhambra",
    country: "Spain",
    facts: [
        ["A Moorish palace complex built in Granada in the 13th century.", "Famous for its intricate Islamic architecture and courtyards."],
        ["Its red sandstone walls overlook the city of Granada.", "A UNESCO World Heritage Site symbolizing Andalusian history."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "alhambra",
    variations: 1,
  },
  {
    id: "lvl-07",
    place: "Acropolis of Athens",
    country: "Greece",
    facts: [
        ["An ancient citadel on a hill, built in the 5th century BC.", "Includes the Parthenon, dedicated to the goddess Athena."],
        ["A symbol of Classical Greek architecture and democracy.", "A major archaeological site visible across Athens."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "acropolis-of-athens",
    variations: 1,
  },
  {
    id: "lvl-08",
    place: "Stonehenge",
    country: "England",
    facts: [
        ["A prehistoric monument built around 3000 BC.", "Made of massive stones, its purpose is still debated."],
        ["It is aligned with the solstices, adding to its mystery.", "A UNESCO World Heritage Site and one of Europe's oldest landmarks."]
    ],
    category: "nature",
    visualComplexity: "low",
    imageId: "stonehenge",
    variations: 1,
  },
  {
    id: "lvl-09",
    place: "Louvre Museum",
    country: "France",
    facts: [
        ["The world's largest and most visited art museum.", "A former royal palace that opened as a museum in 1793."],
        ["Famous for its glass pyramid entrance and for housing the Mona Lisa.", "Holds over 35,000 artworks from multiple civilizations."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "louvre",
    variations: 1,
  },
  {
    id: "lvl-10",
    place: "Notre-Dame de Paris",
    country: "France",
    facts: [
        ["A Gothic cathedral built between 1163–1345 on the Île de la Cité.", "Famous for its rose windows and dedicated to the Virgin Mary."],
        ["Severely damaged in a 2019 fire, it is currently under restoration.", "A cultural symbol of Paris, popularized by Victor Hugo's novel."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "notre-dame",
    variations: 1,
  },
  {
    id: "lvl-11",
    place: "Mont-Saint-Michel",
    country: "France",
    facts: [
        ["A medieval abbey on a tidal island in Normandy, founded in the 8th century.", "Accessible by a causeway, it is surrounded by fast-moving tides."],
        ["A major pilgrimage site and UNESCO World Heritage Site.", "Its appearance dramatically changes between high and low tide."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "mont-saint-michel",
    variations: 1,
  },
  {
    id: "lvl-12",
    place: "Arc de Triomphe",
    country: "France",
    facts: [
        ["Commissioned by Napoleon and completed in 1836 to honor French soldiers.", "Located at the center of the Champs-Élysées."],
        ["The Tomb of the Unknown Soldier lies beneath its vault.", "Features a viewing platform with panoramic views of Paris."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "arc-de-triomphe",
    variations: 1,
  },
  {
    id: "lvl-13",
    place: "Brandenburg Gate",
    country: "Germany",
    facts: [
        ["A neoclassical monument in Berlin, built in 1791.", "It stood in the divide during the Cold War and now symbolizes German unity."],
        ["Topped by the Quadriga, a statue of a four-horse chariot.", "A major site for historical events and celebrations."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "brandenburg-gate",
    variations: 1,
  },
  {
    id: "lvl-14",
    place: "Neuschwanstein Castle",
    country: "Germany",
    facts: [
        ["A 19th-century castle built by King Ludwig II in Bavaria.", "Its romantic architecture inspired Disney's Sleeping Beauty castle."],
        ["Set in the foothills of the Alps, it was never fully completed.", "One of Europe's most photographed landmarks, now a tourist-only castle."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "neuschwanstein-castle",
    variations: 1,
  },
  {
    id: "lvl-15",
    place: "Charles Bridge",
    country: "Czech Republic",
    facts: [
        ["A Gothic stone bridge crossing the Vltava River in Prague, built in the 14th century.", "Decorated with 30 statues, it is now pedestrian-only."],
        ["It connects Prague's Old Town and Castle districts.", "A popular spot for artists and for watching the sunrise."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "charles-bridge",
    variations: 1,
  },
  {
    id: "lvl-16",
    place: "Moscow Kremlin",
    country: "Russia",
    facts: [
        ["A historic fortified complex at the heart of Moscow, overlooking Red Square.", "The seat of the Russian government, its walls were built from the 15th century."],
        ["Includes numerous cathedrals, palaces, and towers.", "A UNESCO World Heritage Site and a symbol of Russian power."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "moscow-kremlin",
    variations: 1,
  },
  {
    id: "lvl-17",
    place: "Trevi Fountain",
    country: "Italy",
    facts: [
        ["The largest Baroque fountain in Rome, completed in 1762.", "Features a famous tradition of tossing a coin to ensure a return to Rome."],
        ["Its marble sculptures are dedicated to Oceanus, god of the sea.", "The coins collected are used to fund charity."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "trevi-fountain",
    variations: 1,
  },
  {
    id: "lvl-18",
    place: "Leaning Tower of Pisa",
    country: "Italy",
    facts: [
        ["The bell tower of Pisa Cathedral, famous for its unintentional tilt.", "The lean was caused by a soft foundation and began during construction in the 12th century."],
        ["Its tilt has been stabilized by modern engineering.", "A Romanesque UNESCO World Heritage Site and a popular photo spot."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "leaning-tower-of-pisa",
    variations: 1,
  },
  {
    id: "lvl-19",
    place: "Milan Cathedral (Duomo)",
    country: "Italy",
    facts: [
        ["The largest church in Italy, a masterpiece of Gothic architecture.", "Construction took nearly 600 years to complete."],
        ["Features a white marble façade, 135 spires, and a walkable rooftop.", "A central landmark and symbol of Milan."]
    ],
    category: "architecture",
    visualComplexity: "high",
    imageId: "milan-cathedral",
    variations: 1,
  },
  {
    id: "lvl-20",
    place: "Venice",
    country: "Italy",
    facts: [
        ["A city built on 118 islands, connected by canals and bridges.", "Has no roads for cars, with gondolas as a primary form of transport."],
        ["A historic trading power with rich Renaissance architecture.", "A UNESCO World Heritage Site known for its romantic reputation and frequent flooding."]
    ],
    category: "city",
    visualComplexity: "high",
    imageId: "venice",
    variations: 1,
  },
  {
    id: "lvl-21",
    place: "Rialto Bridge",
    country: "Italy",
    facts: [
        ["The oldest bridge crossing the Grand Canal in Venice.", "A stone arch design built in 1591 to replace a wooden bridge."],
        ["Features shops along its span, a major commercial crossing.", "A popular tourist spot and an icon of Venetian engineering."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "rialto-bridge",
    variations: 1,
  },
  {
    id: "lvl-22",
    place: "Edinburgh Castle",
    country: "Scotland",
    facts: [
        ["A historic royal fortress built on a volcanic rock overlooking Edinburgh.", "Dates back to the 12th century and holds the Scottish Crown Jewels."],
        ["A key military stronghold throughout its history.", "Hosts a daily gun salute and is a major UNESCO World Heritage tourist attraction."]
    ],
    category: "architecture",
    visualComplexity: "medium",
    imageId: "edinburgh-castle",
    variations: 1,
  },
];


export const levels: Level[] = allLevels;

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

  const hint = level.place.toLowerCase().replace(/ /g, '-');

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
