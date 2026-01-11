/**
 * Hint Engine (deterministic, 3 tiers)
 * Tier 1: vague quadrant + row/col ranges
 * Tier 2: math puzzle reveals exact column
 * Tier 3: math puzzle reveals exact row
 */

export type HintTier = 1 | 2 | 3;

function getCoords(index: number, grid: number): { row: number; col: number } {
  return {
    row: Math.floor(index / grid) + 1,
    col: (index % grid) + 1,
  };
}

// Small deterministic hash (FNV-1a 32-bit)
function hash32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Deterministic pseudo-random from a uint32 seed
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOneDeterministic<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Generates a simple deterministic math hint for a coordinate value.
 * Uses only + and - so it stays easy.
 */
function generateMathProblem(value: number, label: string, rng: () => number): string {
  // Always keep answer = value, but vary expression.
  if (value === 1) {
    const options = [
      `${label} is 1 + 0`,
      `${label} is 2 - 1`,
      `${label} is 3 - 2`,
    ];
    return pickOneDeterministic(options, rng);
  }

  // Choose operands for addition
  const a = Math.floor(rng() * (value - 1)) + 1; // 1..value-1
  const b = value - a;

  // Or convert to subtraction
  if (rng() < 0.5) {
    return `${label} is ${a} + ${b}`;
  } else {
    const big = value + b;
    return `${label} is ${big} - ${b}`;
  }
}

/**
 * Returns quadrant name + ranges (vague but useful).
 * Example: "top-right quadrant (rows 1–2, cols 2–3)"
 */
function getQuadrantHint(row: number, col: number, grid: number): string {
  const split = Math.ceil(grid / 2);

  const top = row <= split;
  const left = col <= split;

  const rowRange = top ? `rows 1–${split}` : `rows ${split + 1}–${grid}`;
  const colRange = left ? `cols 1–${split}` : `cols ${split + 1}–${grid}`;

  const quadrant =
    top && left
      ? "top-left quadrant"
      : top && !left
        ? "top-right quadrant"
        : !top && left
          ? "bottom-left quadrant"
          : "bottom-right quadrant";

  return `${quadrant} (${rowRange}, ${colRange})`;
}

/**
 * Main generator.
 * IMPORTANT: pass a stable seed string (puzzleSeed) so hints don't change across renders.
 */
export function generateHints(args: {
  grid: number;
  swappedIndices: number[];   // indices that are wrong due to swap
  seed: string;              // e.g. puzzleSeed or levelSeed
}): string[] {
  const { grid, swappedIndices, seed } = args;

  const safeSwapped = swappedIndices.length ? swappedIndices : [0];

  // Derive deterministic RNG from seed (avoid Math.random)
  const rng = mulberry32(hash32(`hints:${seed}`));

  // Pick one of swapped tiles deterministically
  const targetIndex = pickOneDeterministic(safeSwapped, rng);
  const { row, col } = getCoords(targetIndex, grid);

  // Hint 1: vague quadrant + ranges
  const quadrantText = getQuadrantHint(row, col, grid);
  const hint1 = `Hint 1: One incorrect tile is somewhere in the ${quadrantText}.`;

  // Hint 2: exact column revealed through a math prompt
  const hint2 = `Hint 2: ${generateMathProblem(col, "The column", rng)}.`;

  // Hint 3: exact row revealed through a math prompt
  const hint3 = `Hint 3: ${generateMathProblem(row, "The row", rng)}.`;

  return [hint1, hint2, hint3];
}
