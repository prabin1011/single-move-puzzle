
'use client';

// A tile can have a color and a shape.
export interface Tile {
  id: string; // Unique ID for React keys, e.g., "0-0"
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'empty';
  shape:
    | 'circle'
    | 'square'
    | 'triangle'
    | 'diamond'
    | 'hexagon'
    | 'pentagon'
    | 'octagon'
    | 'star'
    | 'empty';
  direction: 'up' | 'down' | 'left' | 'right' | 'empty';
}

// A single puzzle instance.
export interface PatternPuzzle {
  id: string; // e.g. "L1-V0"
  solution: {
    type: 'swap';
    indices: [number, number]; // board indices that must be selected
    rule: string;
  };
  grid: Tile[]; // scrambled grid shown to the player
  correctGrid: Tile[]; // the solved grid for preview
}

// Level template – concept + generator.
export interface LevelTemplate {
  level: number; // 1..50 (for display)
  concept: string;
  gridSize: 3 | 4 | 5;
  hintLevels: string[];
  // The generate function is now chosen from a pool of generators
  generate: (levelIndex: number, variation: number) => PatternPuzzle;
}

// --------------------------------------------------------
// CONSTANTS & UTILITIES
// --------------------------------------------------------

const SHAPES: Array<Tile['shape']> = [
  'circle',
  'square',
  'triangle',
  'diamond',
  'pentagon',
  'hexagon',
  'octagon',
  'star',
];
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
 * Applies a single, random swap flaw to the *correct* grid to create the puzzle.
 */
const applySwapFlaw = (
  correctGrid: Tile[],
): { incorrectGrid: Tile[]; solutionIndices: [number, number] } => {
  const size = correctGrid.length;
  const incorrectGrid = copyGrid(correctGrid);

  let idx1 = Math.floor(Math.random() * size);
  let idx2 = Math.floor(Math.random() * size);
  
  while (idx1 === idx2) {
    idx2 = Math.floor(Math.random() * size);
  }

  [incorrectGrid[idx1], incorrectGrid[idx2]] = [
    incorrectGrid[idx2],
    incorrectGrid[idx1],
  ];

  const solutionIndices: [number, number] =
    idx1 < idx2 ? [idx1, idx2] : [idx2, idx1];

  return { incorrectGrid, solutionIndices };
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

// --------------------------------------------------------
// PATTERN GENERATORS
// --------------------------------------------------------

type PatternGenerator = (gridSize: 3 | 4 | 5, levelIndex: number, variation: number) => PatternPuzzle;


/**
 * Pattern A: Rows share the same color, columns share the same shape.
 */
const generateRowColorColShape: PatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Each row has a single color, and each column has a single shape.";

  const rowColors = getVariationSequence(COLORS, size, variation);
  const colShapes = getVariationSequence(SHAPES, size, variation + 1);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      correctGrid[idx].color = rowColors[row];
      correctGrid[idx].shape = colShapes[col];
    }
  }
  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
  return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
};

/**
 * Pattern B: Rows share the same shape, columns share the same color.
 */
const generateRowShapeColColor: PatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Each row has a single shape, and each column has a single color.";

  const rowShapes = getVariationSequence(SHAPES, size, variation);
  const colColors = getVariationSequence(COLORS, size, variation + 3);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      correctGrid[idx].shape = rowShapes[row];
      correctGrid[idx].color = colColors[col];
    }
  }
  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
  return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
};

/**
 * Pattern C: Rows follow a color sequence, columns are a static shape.
 */
const generateRowColorSequence: PatternGenerator = (gridSize, levelIndex, variation) => {
    const size = gridSize;
    const correctGrid = createGrid(size);
    const uniqueColors = getVariationSequence(COLORS, size, variation);
    const staticShape = SHAPES[(variation + 1) % SHAPES.length];
    const rule = `Each row is a repeating sequence of colors, and all tiles share the same shape (${staticShape}).`;

    for(let r = 0; r < size; r++) {
        for(let c = 0; c < size; c++) {
            const idx = r * size + c;
            correctGrid[idx].color = uniqueColors[(c + r + variation) % size];
            correctGrid[idx].shape = staticShape;
        }
    }
    const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
    return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
}

/**
 * Pattern D: Columns follow a shape sequence, rows are a static color.
 */
const generateColShapeSequence: PatternGenerator = (gridSize, levelIndex, variation) => {
    const size = gridSize;
    const correctGrid = createGrid(size);
    const uniqueShapes = getVariationSequence(SHAPES, size, variation);
    const staticColor = COLORS[(variation + 2) % COLORS.length];
    const rule = `Each column is a repeating sequence of shapes, and all tiles are the same color (${staticColor}).`;

    for(let c = 0; c < size; c++) {
        for(let r = 0; r < size; r++) {
            const idx = r * size + c;
            correctGrid[idx].shape = uniqueShapes[(r + c + variation) % size];
            correctGrid[idx].color = staticColor;
        }
    }
    const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
    return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
}

/**
 * Pattern E: Sudoku-like rule - one of each shape/color per row/column. (Latin Square)
 */
const generateLatinSquare: PatternGenerator = (gridSize, levelIndex, variation) => {
    const size = gridSize;
    const correctGrid = createGrid(size);
    const colorSeq = getVariationSequence(COLORS, size, variation);
    const shapeSeq = getVariationSequence(SHAPES, size, variation + 1);
    const rule = "Each row and each column contains exactly one of each color and one of each shape.";


    for(let r = 0; r < size; r++) {
        for(let c = 0; c < size; c++) {
            const idx = r * size + c;
            correctGrid[idx].color = colorSeq[(r + c) % size];
            correctGrid[idx].shape = shapeSeq[(r + c + Math.floor(variation / 2)) % size];
        }
    }
    const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
    return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
}

/**
 * Pattern F: One specific item (e.g., "Red Circle") must appear once in every row and column.
 */
const generateSameItemRule: PatternGenerator = (gridSize, levelIndex, variation) => {
    const size = gridSize;
    const correctGrid = createGrid(size);

    const specialColor = COLORS[variation % COLORS.length];
    const specialShape = SHAPES[Math.floor(variation / COLORS.length) % SHAPES.length];
    const rule = `The special tile (a ${specialColor} ${specialShape}) must appear exactly once in every row and every column.`;
    
    // Fill with random background tiles
    for(let i = 0; i < size*size; i++) {
        correctGrid[i].color = COLORS[(i + variation + 1) % COLORS.length];
        correctGrid[i].shape = SHAPES[(i + variation + 1) % SHAPES.length];
        if (correctGrid[i].color === specialColor && correctGrid[i].shape === specialShape) {
            correctGrid[i].color = COLORS[(i + variation + 2) % COLORS.length];
        }
    }

    // Place the special item in a diagonal pattern to satisfy the rule
    for(let i = 0; i < size; i++) {
        const idx = ((i + variation) % size) * size + i;
        correctGrid[idx].color = specialColor;
        correctGrid[idx].shape = specialShape;
    }

    const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);
    return { id: `L${levelIndex + 1}-V${variation}`, grid: incorrectGrid, correctGrid, solution: { type: 'swap', indices: solutionIndices, rule } };
}

const generateShapeComplexityGradient: PatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Shapes get more complex (more sides) as you move from top-left to bottom-right.";

  const orderedShapes = getVariationSequence(SHAPES, size, variation);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;

      // Complexity = row index + column index
      const shapeIndex = (r + c) % orderedShapes.length;

      correctGrid[idx].shape = orderedShapes[shapeIndex];
      correctGrid[idx].color = COLORS[(shapeIndex + variation) % COLORS.length];
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-G1-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule }
  };
};

const generateMirrorSymmetryPattern: PatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid is symmetrical. The left side is a mirror image of the right side, and the top mirrors the bottom.";

  const rowShapes = getVariationSequence(SHAPES, size, variation);
  const rowColors = getVariationSequence(COLORS, size, variation + 2);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const mirrorCol = size - c - 1;
      const idx = r * size + c;

      correctGrid[idx].shape = rowShapes[Math.min(c, mirrorCol)];
      correctGrid[idx].color = rowColors[Math.min(r, mirrorCol)];
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-G2-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule }
  };
};

const generateCheckerboardParityPattern: PatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid follows a checkerboard pattern. Tiles in 'light' squares follow one rule, and tiles in 'dark' squares follow another.";

  const shapeSeq = getVariationSequence(SHAPES, size, variation);
  const colorSeq = getVariationSequence(COLORS, size, variation + 1);

  for (let i = 0; i < size * size; i++) {
    const isEven = (i + variation) % 2 === 0;

    if (isEven) {
      correctGrid[i].color = colorSeq[i % colorSeq.length];
      correctGrid[i].shape = shapeSeq[(i + 1) % shapeSeq.length];
    } else {
      correctGrid[i].shape = shapeSeq[i % shapeSeq.length];
      correctGrid[i].color = colorSeq[(i + 1) % colorSeq.length];
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-G3-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule }
  };
};

// --- Generator Pools ---
const basicGenerators: PatternGenerator[] = [generateRowColorColShape, generateRowShapeColColor];
const sequenceGenerators: PatternGenerator[] = [generateRowColorSequence, generateColShapeSequence];
const advancedGenerators: PatternGenerator[] = [generateLatinSquare, generateSameItemRule, generateShapeComplexityGradient, generateMirrorSymmetryPattern, generateCheckerboardParityPattern];

const allGenerators: PatternGenerator[] = [...basicGenerators, ...sequenceGenerators, ...advancedGenerators];

// --------------------------------------------------------
// LEVEL DEFINITIONS – 50 LEVELS
// --------------------------------------------------------

export const patternLevels: LevelTemplate[] = (() => {
  const levels: LevelTemplate[] = [];

  // Levels 1–20 (index 0–19): 3×3 grids with basic rules
  for (let i = 0; i < 20; i++) {
    const generator = basicGenerators[i % basicGenerators.length];
    levels.push({
      level: i + 1,
      concept: 'Basic Rules',
      gridSize: 3,
      hintLevels: [
        "Observe the grid carefully. How are rows and columns related?",
        "The rule connects either rows or columns to a specific color or shape.",
        "Check if all items in a row share one property, and all items in a column share another.",
        "The pattern is: all tiles in a row have the same color, and all tiles in a column have the same shape (or vice-versa)."
      ],
      generate: (levelIndex, variation) => generator(3, levelIndex, variation),
    });
  }

  // Levels 21–35 (index 20–34): 4×4 grids introducing sequences
  for (let i = 20; i < 35; i++) {
    // Mix basic and sequence rules
    const generatorPool = [...basicGenerators, ...sequenceGenerators, generateMirrorSymmetryPattern];
    const generator = generatorPool[i % generatorPool.length];
    levels.push({
      level: i + 1,
      concept: 'Introducing Sequences & Symmetry',
      gridSize: 4,
      hintLevels: [
        "Does the pattern repeat, or does it change?",
        "The rule might be static (same for the whole row/column) or sequential (changes tile by tile).",
        "Look for repeating sequences of colors/shapes, or for patterns that mirror across the center.",
        "The rule could be a sequence, a static property per line, or a mirror image."
      ],
      generate: (levelIndex, variation) => generator(4, levelIndex, variation),
    });
  }

  // Levels 36–50 (index 35–49): 5×5 grids with all rules, including advanced logic
  for (let i = 35; i < 50; i++) {
    // Use all available generators for maximum variety
    const generator = allGenerators[i % allGenerators.length];
    levels.push({
      level: i + 1,
      concept: 'Advanced Logic',
      gridSize: 5,
      hintLevels: [
        "The rule might involve the whole grid, not just rows or columns.",
        "Think about concepts like 'one of each', alternating tiles, or gradients.",
        "Could there be two rules at once? Or a rule about symmetry or complexity?",
        "The pattern might be a checkerboard, a gradient, a mirror, or a 'Sudoku-style' unique-item rule."
      ],
      generate: (levelIndex, variation) => generator(5, levelIndex, variation),
    });
  }

  return levels;
})();

// --------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------

export function getPatternPuzzleConfig(levelIndex: number): LevelTemplate {
  const clampedIndex = Math.max(
    0,
    Math.min(levelIndex, patternLevels.length - 1)
  );
  return patternLevels[clampedIndex];
}

export function generatePatternPuzzle(
  levelIndex: number,
  retryCount: number
): PatternPuzzle {
  // Use retryCount to vary the sequences, but the swap itself is now random.
  const variation = retryCount % VARIATIONS_PER_LEVEL;
  const config = getPatternPuzzleConfig(levelIndex);
  // The generator is now determined by the level config, providing more variety
  return config.generate(levelIndex, variation);
}
