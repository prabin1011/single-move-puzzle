
'use client';

// A tile can have a color and a shape.
// (direction is kept for future use but not used in the current patterns UI.)
export interface Tile {
  id: string; // Unique ID for React keys, e.g., "0-0"
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'empty';
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'empty';
  direction: 'up' | 'down' | 'left' | 'right' | 'empty';
}

// A single puzzle instance.
export interface PatternPuzzle {
  id: string; // e.g. "L1-V0"
  solution: {
    type: 'swap';
    indices: [number, number]; // board indices that must be selected
  };
  grid: Tile[]; // scrambled grid shown to the player
  correctGrid: Tile[]; // the solved grid for preview
}

// Level template – concept + generator.
export interface LevelTemplate {
  level: number;             // 1..50 (for display)
  concept: string;
  gridSize: 3 | 4 | 5;
  hint: string;
  generate: (levelIndex: number, variation: number) => PatternPuzzle;
}

// --------------------------------------------------------
// CONSTANTS & UTILITIES
// --------------------------------------------------------

const SHAPES: Array<Tile['shape']> = ['circle', 'square', 'triangle', 'diamond'];
const COLORS: Array<Tile['color']> = ['blue', 'red', 'green', 'yellow', 'purple'];

export const VARIATIONS_PER_LEVEL = 10;

/**
 * Creates a flat grid of empty tiles.
 */
const createGrid = (size: number): Tile[] =>
  Array.from({ length: size * size }, (_, i) => ({
    id: `${Math.floor(i / size)}-${i % size}`,
    color: 'empty',
    shape: 'empty',
    direction: 'empty',
  }));

/**
 * Deep-copy a grid.
 */
const copyGrid = (grid: Tile[]): Tile[] => grid.map((t) => ({ ...t }));

/**
 * Deterministic "pseudo-random" index picker based on level + variation.
 */
const makeSeed = (levelIndex: number, variation: number) =>
  levelIndex * VARIATIONS_PER_LEVEL + variation;

/**
 * Applies a single swap flaw to the *correct* grid to create the puzzle.
 */
const applySwapFlaw = (
  correctGrid: Tile[],
  levelIndex: number,
  variation: number
): { incorrectGrid: Tile[]; solution: [number, number] } => {
  const size = correctGrid.length;
  const incorrectGrid = copyGrid(correctGrid);

  const seed = makeSeed(levelIndex, variation);
  let idx1 = seed % size;
  let idx2 = (seed * 7 + 3) % size;
  if (idx1 === idx2) {
    idx2 = (idx2 + 1) % size;
  }

  [incorrectGrid[idx1], incorrectGrid[idx2]] = [
    incorrectGrid[idx2],
    incorrectGrid[idx1],
  ];

  const solution: [number, number] =
    idx1 < idx2 ? [idx1, idx2] : [idx2, idx1];

  return { incorrectGrid, solution };
};

/**
 * Get a rotated & optionally reversed slice of base array
 * so each variation looks slightly different but still regular.
 */
const getVariationSequence = <T>(
  base: T[],
  length: number,
  variation: number
): T[] => {
  const n = Math.min(length, base.length);
  const offset = variation % n;
  const reversed = Math.floor(variation / n) % 2 === 1;

  const arr = base.slice(0, n);
  const rotated = [...arr.slice(offset), ...arr.slice(0, offset)];
  return reversed ? rotated.reverse() : rotated;
};

/**
 * Creates a sequence by cycling through the base array.
 * This is useful for grids larger than the number of available items.
 */
const getCycledSequence = <T>(
  base: T[],
  length: number,
  offset: number
): T[] => {
  return Array.from({ length }, (_, i) => {
    const idx = (i + offset) % base.length;
    return base[idx];
  });
};


// --------------------------------------------------------
// PATTERN GENERATORS
// --------------------------------------------------------

/**
 * Pattern A (Levels 1–10): 3×3
 * Rows share the same color, columns share the same shape.
 * Very clean: color = row rule, shape = column rule.
 */
const generateRowColorColShape = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
): PatternPuzzle => {
  const size = gridSize;
  const correctGrid = createGrid(size);

  const rowColors = getVariationSequence(COLORS, size, variation);
  const colShapes = getVariationSequence(SHAPES, size, variation + 1);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      correctGrid[idx].color = rowColors[row];
      correctGrid[idx].shape = colShapes[col];
    }
  }

  const { incorrectGrid, solution } = applySwapFlaw(
    correctGrid,
    levelIndex,
    variation
  );

  return {
    id: `L${levelIndex + 1}-V${variation}`,
    grid: incorrectGrid,
    correctGrid: correctGrid,
    solution: { type: 'swap', indices: solution },
  };
};

/**
 * Pattern B (Levels 11–20): 3×3
 * Rows share the same *shape*, columns share the same *color*.
 * This feels different but is still very regular.
 */
const generateRowShapeColColor = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
): PatternPuzzle => {
  const size = gridSize;
  const correctGrid = createGrid(size);

  const rowShapes = getVariationSequence(SHAPES, size, variation);
  const colColors = getVariationSequence(COLORS, size, variation + 3);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      correctGrid[idx].shape = rowShapes[row];
      correctGrid[idx].color = colColors[col];
    }
  }

  const { incorrectGrid, solution } = applySwapFlaw(
    correctGrid,
    levelIndex,
    variation
  );

  return {
    id: `L${levelIndex + 1}-V${variation}`,
    grid: incorrectGrid,
    correctGrid: correctGrid,
    solution: { type: 'swap', indices: solution },
  };
};

/**
 * Pattern C (Levels 21–30): 4×4 Diagonal Rule.
 * Main diagonal has same color & shape; other tiles follow a row/column rule.
 */
const generateDiagonalPlusRowCol = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
): PatternPuzzle => {
  const size = gridSize;
  const correctGrid = createGrid(size);

  const diagColor = COLORS[(variation + 1) % COLORS.length];
  const diagShape = SHAPES[(variation + 2) % SHAPES.length];

  const rowColors = getVariationSequence(COLORS, size, variation);
  const colShapes = getVariationSequence(SHAPES, size, variation + 4);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      if (row === col) {
        correctGrid[idx].color = diagColor;
        correctGrid[idx].shape = diagShape;
      } else {
        correctGrid[idx].color = rowColors[row];
        correctGrid[idx].shape = colShapes[col];
      }
    }
  }

  const { incorrectGrid, solution } = applySwapFlaw(
    correctGrid,
    levelIndex,
    variation
  );

  return {
    id: `L${levelIndex + 1}-V${variation}`,
    grid: incorrectGrid,
    correctGrid: correctGrid,
    solution: { type: 'swap', indices: solution },
  };
};

/**
 * Pattern D (Levels 31–40): 4×4 Block / Stripe Logic.
 * Top vs bottom half uses different colors; left vs right uses different shapes.
 * This makes a very visible quadrant pattern.
 */
const generateBlockPattern = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
): PatternPuzzle => {
  const size = gridSize;
  const correctGrid = createGrid(size);

  const colors = getVariationSequence(COLORS, 4, variation);
  const shapes = getVariationSequence(SHAPES, 4, variation + 5);

  // split rows in half: top uses colors[0/1], bottom uses colors[2/3]
  const rowSplit = Math.floor(size / 2);
  const colSplit = Math.floor(size / 2);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;

      const rowBand = row < rowSplit ? 0 : 1;
      const colBand = col < colSplit ? 0 : 1;

      // choose color by row band, shape by col band
      correctGrid[idx].color = colors[rowBand * 2 + colBand];
      correctGrid[idx].shape = shapes[rowBand * 2 + colBand];
    }
  }

  const { incorrectGrid, solution } = applySwapFlaw(
    correctGrid,
    levelIndex,
    variation
  );

  return {
    id: `L${levelIndex + 1}-V${variation}`,
    grid: incorrectGrid,
    correctGrid: correctGrid,
    solution: { type: 'swap', indices: solution },
  };
};

/**
 * Pattern E (Levels 41–50): 5×5 Mixed Logic.
 * - Middle row & column have their own sequences.
 * - Other tiles follow rowColor/colShape, so everything ties together.
 */
const generateMixedPattern = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
): PatternPuzzle => {
  const size = gridSize;
  const correctGrid = createGrid(size);

  const center = Math.floor(size / 2);

  // Colors: we have 5 colors, so this is fine
  const rowColors = getVariationSequence(COLORS, size, variation);

  // Shapes: cycle through SHAPES to always get `size` items (works for 5×5)
  const colShapes = getCycledSequence(SHAPES, size, (variation + 2) % SHAPES.length);
  const centerRowShapes = getCycledSequence(SHAPES, size, (variation + 6) % SHAPES.length);
  const centerColColors = getVariationSequence(COLORS, size, variation + 7);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;

      if (row === center) {
        // Special middle row – shape sequence across the row
        correctGrid[idx].shape = centerRowShapes[col];
        correctGrid[idx].color = rowColors[row];
      } else if (col === center) {
        // Special middle column – color sequence down the column
        correctGrid[idx].color = centerColColors[row];
        correctGrid[idx].shape = colShapes[col];
      } else {
        // Normal tiles: row color + column shape
        correctGrid[idx].color = rowColors[row];
        correctGrid[idx].shape = colShapes[col];
      }
    }
  }

  const { incorrectGrid, solution } = applySwapFlaw(
    correctGrid,
    levelIndex,
    variation
  );

  return {
    id: `L${levelIndex + 1}-V${variation}`,
    grid: incorrectGrid,
    correctGrid: correctGrid,
    solution: { type: 'swap', indices: solution },
  };
};


// --------------------------------------------------------
// LEVEL DEFINITIONS – 50 LEVELS
// --------------------------------------------------------

export const patternLevels: LevelTemplate[] = (() => {
  const levels: LevelTemplate[] = [];

  // Levels 1–10 (index 0–9): 3×3, simple row-color / column-shape
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: i + 1,
      concept: 'Rows & Colors',
      gridSize: 3,
      hint: 'Each row shares a color, each column shares a shape.',
      generate: (levelIndex, variation) =>
        generateRowColorColShape(3, levelIndex, variation),
    });
  }

  // Levels 11–20 (index 10–19): 3×3, row-shape / column-color
  for (let i = 10; i < 20; i++) {
    levels.push({
      level: i + 1,
      concept: 'Rows & Shapes',
      gridSize: 3,
      hint: 'Each row shares a shape, each column shares a color.',
      generate: (levelIndex, variation) =>
        generateRowShapeColColor(3, levelIndex, variation),
    });
  }

  // Levels 21–30 (index 20–29): 4×4, diagonal special + row/col rules
  for (let i = 20; i < 30; i++) {
    levels.push({
      level: i + 1,
      concept: 'Diagonal Rule',
      gridSize: 4,
      hint: 'The main diagonal is special – the other tiles follow row/column rules.',
      generate: (levelIndex, variation) =>
        generateDiagonalPlusRowCol(4, levelIndex, variation),
    });
  }

  // Levels 31–40 (index 30–39): 4×4, quadrant block logic
  for (let i = 30; i < 40; i++) {
    levels.push({
      level: i + 1,
      concept: 'Blocks / Quadrants',
      gridSize: 4,
      hint: 'Each quadrant follows its own consistent shape & color.',
      generate: (levelIndex, variation) =>
        generateBlockPattern(4, levelIndex, variation),
    });
  }

  // Levels 41–50 (index 40–49): 5×5, mixed center row/column logic
  for (let i = 40; i < 50; i++) {
    levels.push({
      level: i + 1,
      concept: 'Mixed Logic',
      gridSize: 5,
      hint: 'The middle row and column follow their own sequence; everything else fits around them.',
      generate: (levelIndex, variation) =>
        generateMixedPattern(5, levelIndex, variation),
    });
  }

  return levels;
})();

// --------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------

export function getPatternPuzzleConfig(levelIndex: number): LevelTemplate {
  const idx = Math.max(
    0,
    Math.min(levelIndex, patternLevels.length - 1)
  );
  return patternLevels[idx];
}

export function generatePatternPuzzle(
  levelIndex: number,
  retryCount: number
): PatternPuzzle {
  const variation = retryCount % VARIATIONS_PER_LEVEL; // 0..9
  const config = getPatternPuzzleConfig(levelIndex);
  return config.generate(levelIndex, variation);
}
