
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
    id: 'lvl-01',
    place: 'Eiffel Tower',
    country: 'France',
    facts: [['Built for the 1889 World’s Fair', 'Designed by Gustave Eiffel'], ['Height: ~330 meters', 'Made of wrought iron']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'eiffel-tower',
    variations: 4
  },
  {
    id: 'lvl-02',
    place: 'Colosseum',
    country: 'Italy',
    facts: [['Built in 1st century AD', 'Largest Roman amphitheatre'], ['Hosted gladiator fights', 'Could hold ~50,000 spectators']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'colosseum',
    variations: 4
  },
  {
    id: 'lvl-03',
    place: 'Elizabeth Tower',
    country: 'UK',
    facts: [['Clock tower at Westminster', 'Completed in 1859'], ['Big Ben is the bell, not tower', 'Tower renamed in 2012']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'big-ben-elizabeth-tower',
    variations: 4
  },
  {
    id: 'lvl-04',
    place: 'Tower Bridge',
    country: 'UK',
    facts: [['Opened in 1894', 'Bascule and suspension bridge'], ['Crosses River Thames', 'Often mistaken as London Bridge']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'tower-bridge',
    variations: 4
  },
  {
    id: 'lvl-05',
    place: 'Sagrada Família',
    country: 'Spain',
    facts: [['Designed by Antoni Gaudí', 'Construction began in 1882'], ['Still under construction', 'Funded mainly by donations']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'sagrada-familia',
    variations: 4
  },
  {
    id: 'lvl-06',
    place: 'Alhambra',
    country: 'Spain',
    facts: [['Moorish palace-fortress', 'Built in 13th–14th century'], ['Nasrid dynasty residence', 'Famous for Islamic architecture']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'alhambra',
    variations: 4
  },
  {
    id: 'lvl-07',
    place: 'Acropolis of Athens',
    country: 'Greece',
    facts: [['Ancient citadel on hilltop', 'Built in 5th century BC'], ['Parthenon dedicated to Athena', 'Classical Greek architecture']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'acropolis-of-athens',
    variations: 4
  },
  {
    id: 'lvl-08',
    place: 'Stonehenge',
    country: 'England',
    facts: [['Prehistoric stone circle', 'Built ~3000–2000 BC'], ['Located in Wiltshire', 'Purpose still debated']],
    category: 'nature',
    visualComplexity: 'low',
    imageId: 'stonehenge',
    variations: 4
  },
  {
    id: 'lvl-09',
    place: 'Louvre Museum',
    country: 'France',
    facts: [['World’s largest art museum', 'Former royal palace'], ['Opened as museum in 1793', 'Home to Mona Lisa']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'louvre',
    variations: 4
  },
  {
    id: 'lvl-10',
    place: 'Notre-Dame Cathedral',
    country: 'France',
    facts: [['Gothic cathedral begun in 1163', 'Famous rose windows'], ['Located on Île de la Cité', 'Major fire in 2019']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'notre-dame',
    variations: 4
  },
  {
    id: 'lvl-11',
    place: 'Mont Saint-Michel',
    country: 'France',
    facts: [['Tidal island commune', 'Medieval abbey on top'], ['Built starting 8th century', 'Becomes island at high tide']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'mont-saint-michel',
    variations: 4
  },
  {
    id: 'lvl-12',
    place: 'Arc de Triomphe',
    country: 'France',
    facts: [['Commissioned by Napoleon', 'Completed in 1836'], ['Honors French soldiers', 'Tomb of Unknown Soldier beneath']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'arc-de-triomphe',
    variations: 4
  },
  {
    id: 'lvl-13',
    place: 'Brandenburg Gate',
    country: 'Germany',
    facts: [['Built in 18th century', 'Neoclassical design'], ['Symbol of peace and unity', 'Once divided East and West Berlin']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'brandenburg-gate',
    variations: 4
  },
  {
    id: 'lvl-14',
    place: 'Neuschwanstein Castle',
    country: 'Germany',
    facts: [['Built by King Ludwig II', 'Construction began 1869'], ['Inspired Disney castles', 'Romanesque Revival style']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'neuschwanstein-castle',
    variations: 4
  },
  {
    id: 'lvl-15',
    place: 'Charles Bridge',
    country: 'Czechia',
    facts: [['Built in 14th century', 'Crosses Vltava River'], ['Commissioned by Charles IV', 'Decorated with 30 statues']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'charles-bridge',
    variations: 4
  },
  {
    id: 'lvl-16',
    place: 'Kremlin',
    country: 'Russia',
    facts: [['Fortified complex', 'Political center of Russia'], ['Houses government buildings', 'Contains cathedrals']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'kremlin',
    variations: 4
  },
  {
    id: 'lvl-17',
    place: 'Trevi Fountain',
    country: 'Italy',
    facts: [['Baroque fountain completed in 1762', 'Designed by Nicola Salvi'], ['Located at end of ancient aqueduct', 'Dedicated to Oceanus']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'trevi-fountain',
    variations: 4
  },
  {
    id: 'lvl-18',
    place: 'Leaning Tower of Pisa',
    country: 'Italy',
    facts: [['Bell tower of Pisa Cathedral', 'Construction began in 1173'], ['Lean caused by soft soil', 'Tilt stabilized in 20th century']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'leaning-tower-of-pisa',
    variations: 4
  },
  {
    id: 'lvl-19',
    place: 'Duomo di Milano',
    country: 'Italy',
    facts: [['Largest church in Italy', 'Construction began in 1386'], ['Gothic architectural style', 'Over 135 spires']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'duomo-di-milano',
    variations: 4
  },
  {
    id: 'lvl-20',
    place: 'Canals of Venice',
    country: 'Italy',
    facts: [['Built on 118 small islands', 'Over 150 canals'], ['Main canal is Grand Canal', 'Gondolas traditional transport']],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'canals-of-venice',
    variations: 4
  },
  {
    id: 'lvl-21',
    place: 'Rialto Bridge',
    country: 'Italy',
    facts: [['Oldest bridge on Grand Canal', 'Built in 1591'], ['Stone arch design', 'Replaced wooden bridges']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'rialto-bridge',
    variations: 4
  },
  {
    id: 'lvl-22',
    place: 'Edinburgh Castle',
    country: 'Scotland',
    facts: [['Located on Castle Rock', 'Ancient volcanic plug'], ['Used as royal residence', 'Military stronghold']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'edinburgh-castle-scotland',
    variations: 4
  },
  {
    id: 'lvl-23',
    place: 'Statue of Liberty',
    country: 'USA',
    facts: [['Gift from France', 'Dedicated in 1886'], ['Designed by Frédéric Bartholdi', 'Stands on Liberty Island']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'statue-of-liberty',
    variations: 4
  },
  {
    id: 'lvl-24',
    place: 'Empire State Building',
    country: 'USA',
    facts: [['Completed in 1931', 'Art Deco skyscraper'], ['Height 381 meters', 'Once world’s tallest building']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'empire-state-building',
    variations: 4
  },
  {
    id: 'lvl-25',
    place: 'Great Wall of China',
    country: 'China',
    facts: [['Constructed over centuries by various dynasties', 'Primary purpose was defense against invasions'], ['Total length is over 21,000 kilometers', 'The "visible from space" claim is a myth']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'great-wall-of-china',
    variations: 4
  },
  {
    id: 'lvl-26',
    place: 'Golden Gate Bridge',
    country: 'USA',
    facts: [['Opened in 1937', 'Suspension bridge'], ['Spans Golden Gate strait', 'International Orange color']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'golden-gate-bridge',
    variations: 4
  },
  {
    id: 'lvl-27',
    place: 'Hollywood Sign',
    country: 'USA',
    facts: [['Erected in 1923', 'Originally read “Hollywoodland”'], ['Located on Mount Lee', 'Symbol of film industry']],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'hollywood-sign-los-angeles',
    variations: 4
  },
  {
    id: 'lvl-28',
    place: 'Mount Rushmore',
    country: 'USA',
    facts: [['Carved into granite mountain', 'Features four US presidents'], ['Sculpted by Gutzon Borglum', 'Completed in 1941']],
    category: 'nature',
    visualComplexity: 'medium',
    imageId: 'mount-rushmore',
    variations: 4
  },
  {
    id: 'lvl-29',
    place: 'Grand Canyon',
    country: 'USA',
    facts: [['Carved by Colorado River', 'Over 440 km long'], ['Depth over 1.6 km', 'Exposes ancient rock layers']],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'grand-canyon',
    variations: 4
  },
  {
    id: 'lvl-30',
    place: 'Niagara Falls',
    country: 'USA/Canada',
    facts: [['Three major waterfalls', 'On US–Canada border'], ['Formed by glaciers', 'Huge water volume']],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'niagara-falls',
    variations: 4
  },
  {
    id: 'lvl-31',
    place: 'CN Tower',
    country: 'Canada',
    facts: [['Completed in 1976', 'Height 553 meters'], ['Observation tower', 'Once world’s tallest structure']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'cn-tower',
    variations: 4
  },
  {
    id: 'lvl-32',
    place: 'Capitol Building',
    country: 'USA',
    facts: [['Seat of US Congress', 'Construction began 1793'], ['Neoclassical design', 'Large central dome']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'capitol-building',
    variations: 4
  },
  {
    id: 'lvl-33',
    place: 'White House',
    country: 'USA',
    facts: [['Official US president residence', 'Built in 1800'], ['Neoclassical style', 'Designed by James Hoban']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'white-house',
    variations: 4
  },
  {
    id: 'lvl-34',
    place: 'Lincoln Memorial',
    country: 'USA',
    facts: [['Dedicated in 1922', 'Honors Abraham Lincoln'], ['Greek temple design', '19-foot seated statue']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'lincoln-memorial',
    variations: 4
  },
  {
    id: 'lvl-35',
    place: 'Space Needle',
    country: 'USA',
    facts: [['Built for 1962 World’s Fair', 'Height 184 meters'], ['Futuristic design', 'Observation deck']],
    category: 'architecture',
    visualComplexity: 'low',
    imageId: 'space-needle',
    variations: 4
  },
  {
    id: 'lvl-36',
    place: 'Las Vegas Strip',
    country: 'USA',
    facts: [['Stretch of Las Vegas Boulevard', 'Known for mega-resorts'], ['Bright neon skyline', 'Major casino hub']],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'las-vegas-strip',
    variations: 4
  },
  {
    id: 'lvl-37',
    place: 'Walt Disney World',
    country: 'USA',
    facts: [['Opened in 1971', 'Largest Disney resort'], ['Located in Orlando area', 'Four theme parks']],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'walt-disney-world-florida',
    variations: 4
  },
  {
    id: 'lvl-38',
    place: 'Chichén Itzá',
    country: 'Mexico',
    facts: [['Major Maya city', 'Built between 600–1200 AD'], ['El Castillo pyramid centerpiece', 'Astronomical alignments']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'chichen-itza',
    variations: 4
  },
  {
    id: 'lvl-39',
    place: 'Teotihuacan',
    country: 'Mexico',
    facts: [['Ancient Mesoamerican city', 'Built around 100 BC'], ['Pyramid of the Sun', 'Pyramid of the Moon']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'teotihuacan',
    variations: 4
  },
  {
    id: 'lvl-40',
    place: 'Old San Juan',
    country: 'USA',
    facts: [['Founded in 1521', 'Spanish colonial city'], ['Colorful historic buildings', 'Fortified city walls']],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'old-san-juan',
    variations: 4
  },
  {
    id: 'lvl-41',
    place: 'Christ the Redeemer',
    country: 'Brazil',
    facts: [['Completed in 1931', 'Art Deco statue'], ['Height 30 meters', 'Located on Corcovado']],
    category: 'architecture',
    visualComplexity: 'medium',
    imageId: 'christ-the-redeemer',
    variations: 4
  },
  {
    id: 'lvl-42',
    place: 'Sugarloaf Mountain',
    country: 'Brazil',
    facts: [['Granite monolith', 'Height ~396 meters'], ['Cable car access', 'Views of Rio Bay']],
    category: 'nature',
    visualComplexity: 'medium',
    imageId: 'sugarloaf-mountain',
    variations: 4
  },
  {
    id: 'lvl-43',
    place: 'Machu Picchu',
    country: 'Peru',
    facts: [['Inca citadel', 'Built in 15th century'], ['Located in Andes Mountains', 'Rediscovered in 1911']],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'machu-picchu',
    variations: 4
  },
  {
    id: 'lvl-44',
    place: 'Iguazu Falls',
    country: 'Argentina/Brazil',
    facts: [['275 individual waterfalls', 'On Argentina–Brazil border'], ['Formed by Iguazu River', 'Devil’s Throat main drop']],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'iguazu-falls',
    variations: 4
  },
  {
    id: 'lvl-45',
    place: 'Copacabana Beach',
    country: 'Brazil',
    facts: [['4 km long beach', 'Located in Rio'], ['Famous wave-pattern promenade', 'Major cultural hotspot']],
    category: 'city',
    visualComplexity: 'high',
    imageId: 'copacabana-beach',
    variations: 4
  },
  {
    id: 'lvl-46',
    place: 'Moai of Easter Island',
    country: 'Chile',
    facts: [['Stone statues carved by Rapa Nui', 'Created between 1250–1500'], ['Made of volcanic tuff', 'Represent ancestors']],
    category: 'nature',
    visualComplexity: 'low',
    imageId: 'moai-of-easter-island',
    variations: 4
  },
  {
    id: 'lvl-47',
    place: 'Salar de Uyuni',
    country: 'Bolivia',
    facts: [['World’s largest salt flat', 'Over 10,000 sq km'], ['Formed from ancient lakes', 'Mirror effect in rainy season']],
    category: 'nature',
    visualComplexity: 'low',
    imageId: 'salar-de-uyuni',
    variations: 4
  },
  {
    id: 'lvl-48',
    place: 'Angel Falls',
    country: 'Venezuela',
    facts: [['World’s tallest waterfall', 'Height 979 meters'], ['Located in Canaima Park', 'Named after Jimmy Angel']],
    category: 'nature',
    visualComplexity: 'high',
    imageId: 'angel-falls',
    variations: 4
  },
  {
    id: 'lvl-49',
    place: 'Perito Moreno Glacier',
    country: 'Argentina',
    facts: [['Located in Patagonia', 'One of few advancing glaciers'], ['Part of Los Glaciares Park', 'Ice walls ~70 meters high']],
    category: 'nature',
    visualComplexity: 'medium',
    imageId: 'perito-moreno-glacier',
    variations: 4
  },
  {
    id: 'lvl-50',
    place: 'Maracanã Stadium',
    country: 'Brazil',
    facts: [['Opened in 1950', 'Located in Rio'], ['Historic football stadium', 'Hosted World Cup finals']],
    category: 'architecture',
    visualComplexity: 'high',
    imageId: 'maracana-stadium-brazil',
    variations: 4
  },
];


export const levels: Level[] = allLevels;

export type Solution =
  | { type: "swap"; indices: [number, number] }
  | { type: "rotate"; index: number; correctRotation: number };

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
      url: `/images/eiffel-tower-1.png`,
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

  const url = `/images/${imageId}-${fileVariantNumber}.png`;
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

  const maxHints = insane ? 2 : veryHard ? 3 : hard ? 3 : 3;

  return {
    rotateChance: Math.min(0.85, rotateChance),
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

function pickHardSwapPair(rng: () => number, grid: number, levelIndex: number) {
  const total = grid * grid;
  const i1 = Math.floor(rng() * total);

  // For higher levels, prefer adjacent swaps to make them harder
  if (levelIndex >= 1) {
    const n = neighbors(i1, grid);
    if (n.length > 0 && rng() > 0.3) { // 70% chance of adjacent swap
      const i2 = n[Math.floor(rng() * n.length)];
      return [i1, i2] as [number, number];
    }
  }

  // Otherwise, pick a nearby tile to swap with
  const radius = levelIndex >= 5 ? 1 : 2; // smaller radius for harder levels
  const i2 = pickNearIndex(rng, grid, i1, radius);
  return [i1, i2] as [number, number];
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
    return n.length > 0 ? n[Math.floor(rng() * n.length)] : (baseIdx + 1) % (grid * grid);
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
  let puzzleSeed = seed || `r${round}`;

  if (seed) {
    const numericSeed = hashSeedToUint(seed);
    rng = mulberry32(numericSeed);
    round = numericSeed;
  } else if (typeof window !== "undefined") {
    round = parseInt(localStorage.getItem("gameRound") || "0", 10) >>> 0;
    puzzleSeed = `r${round}`;
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
  const r = rng();

  if (r < rotateW) {
    // ROTATE
    const index = Math.floor(rng() * totalTiles);
    const rotation = chooseRotation(rng);
    scrambledBoard[index].rotation = rotation;

    solution = { type: "rotate", index, correctRotation: 0 };

  } else {
    // NORMAL SWAP (harder: nearby swaps)
    const [index1, index2] = pickHardSwapPair(rng, grid, levelIndex);

    [scrambledBoard[index1], scrambledBoard[index2]] = [
      scrambledBoard[index2],
      scrambledBoard[index1],
    ];

    solution = { type: "swap", indices: [index1, index2] };
  }

  proceduralHints = generateHints({
    grid, 
    swappedIndices: 'indices' in solution ? solution.indices : [solution.index],
    seed: puzzleSeed,
  });

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


    