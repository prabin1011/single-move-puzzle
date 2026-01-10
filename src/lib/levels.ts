

import { generateHints } from './hint-engine';
import { allLevels as allLandmarkLevels, Level } from './landmark-levels-data';

export type { Level };

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

export const levels: Level[] = allLandmarkLevels;

export function getImageUrl(
  imageId: string,
  availableVariations: number,
  round = 0
): { url: string; hint: string; facts: string[] } {
  const level = allLandmarkLevels.find((l) => l.imageId === imageId);
  if (!level) {
    // A safe fallback to prevent crashes
    return {
      url: `/images/eiffel-tower-1.jpg`,
      hint: "paris france",
      facts: ["The Eiffel Tower was built in 1889.", "It is located in Paris, France.", "It is a famous landmark."],
    };
  }

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
  const level = allLandmarkLevels.find((l) => l.imageId === imageId);
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
