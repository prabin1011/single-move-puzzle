
'use client';

// ---------------------------------------------
// TYPES
// ---------------------------------------------

export interface SymbolTile {
  id: string; // e.g. "0-0"
  symbol: string; // unicode symbol character
  color: 'none' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';
  category: 'math_op' | 'compare' | 'arrow' | 'logic' | 'shape';
}

export interface SymbolPuzzle {
  id: string; // e.g. "L1-V0"
  grid: SymbolTile[]; // scrambled grid shown to player
  correctGrid: SymbolTile[]; // solved state
  solution: {
    type: 'swap';
    indices: [number, number]; // indices in flat grid
    rule: string;
  };
}

export interface SymbolLevelTemplate {
  level: number;              // 1..100
  concept: string;            // short label
  gridSize: 3 | 4 | 5;
  difficulty: 'easy' | 'medium' | 'hard';
  generatorType: SymbolGeneratorType;
  hintLevels: string[];       // multiple hints per puzzle concept
  generator: (levelIndex: number, variation: number) => SymbolPuzzle;
}

// ---------------------------------------------
// CONSTANTS
// ---------------------------------------------

export const VARIATIONS_PER_SYMBOL_LEVEL = 10;
export const TOTAL_SYMBOL_LEVELS = 100;

// Symbol families
const MATH_OPS = ['+', '−', '×', '÷'] as const;
const COMP_OPS = ['=', '≠', '<', '>', '≤', '≥'] as const;
const ARROWS = ['↑', '↓', '←', '→'] as const;
const LOGIC_SYM = ['∧', '∨', '¬', '⇒'] as const;
const SHAPE_SYM = ['●', '■', '▲', '◆', '★', '⬟', '⬢', '⬣'] as const; // circle, square, triangle, diamond, star, hex/pent-style

const COLORS: Array<SymbolTile['color']> = [
  'blue',
  'red',
  'green',
  'yellow',
  'purple',
];

type SymbolGeneratorType =
  | 'ROW_OP_COL_GROUP'
  | 'ROW_SEQ_MATH'
  | 'ARROW_FLOW'
  | 'MIRROR_SYM'
  | 'CHECKER_PARITY'
  | 'GROUP_CLUSTER'
  | 'LATIN_SYMBOL'
  | 'SHAPE_COMPLEXITY'
  | 'QUADRANT_RULE'
  | 'RING_RULE';

// ---------------------------------------------
// UTILITIES
// ---------------------------------------------

const createGrid = (size: number): SymbolTile[] =>
  Array.from({ length: size * size }, (_, i) => ({
    id: `${Math.floor(i / size)}-${i % size}`,
    symbol: '',
    color: 'none',
    category: 'shape' as const,
  }));

const copyGrid = (grid: SymbolTile[]): SymbolTile[] =>
  grid.map((t) => ({ ...t }));

/**
 * Apply a single swap flaw to correctGrid to create puzzle.
 */
const applySwapFlaw = (
  correctGrid: SymbolTile[],
): { incorrectGrid: SymbolTile[]; solutionIndices: [number, number] } => {
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
 * Deterministic pseudo-random index generator based on seed.
 * Used to keep variations stable across sessions.
 */
const seededRandomIndex = (seed: number, max: number): number => {
  let x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.floor(r * max);
};

/**
 * Rotated / reversed slice of base array for variation.
 */
const getVariationSequence = <T>(
  base: readonly T[],
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

// Helper to build tiles from symbol family
const makeTile = (
  base: SymbolTile,
  symbol: string,
  color: SymbolTile['color'],
  category: SymbolTile['category']
): SymbolTile => ({
  ...base,
  symbol,
  color,
  category,
});

// ---------------------------------------------
// GENERATORS
// ---------------------------------------------

type SymbolPatternGenerator = (
  gridSize: 3 | 4 | 5,
  levelIndex: number,
  variation: number
) => SymbolPuzzle;

/**
 * G1: Rows share a math operator type, columns share a symbol family.
 * Concept: "Row operator, column category".
 */
const generateRowOpColGroup: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Each row uses a specific math operator type, and each column is dedicated to a single symbol family (math, comparison, arrows, or logic).";

  const rowOps = getVariationSequence(MATH_OPS, size, variation);
  const colFamilies: ('math_op' | 'compare' | 'arrow' | 'logic')[] =
    ['math_op', 'compare', 'arrow', 'logic'].slice(0, size);

  const familySymbols: Record<string, readonly string[]> = {
    math_op: MATH_OPS,
    compare: COMP_OPS,
    arrow: ARROWS,
    logic: LOGIC_SYM,
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const family = colFamilies[c % colFamilies.length];
      const symbols = familySymbols[family] || SHAPE_SYM;
      const symIndex = (r + c + variation) % symbols.length;

      correctGrid[idx] = makeTile(
        base,
        symbols[symIndex],
        COLORS[(r + c + variation) % COLORS.length],
        family === 'math_op'
          ? 'math_op'
          : family === 'compare'
          ? 'compare'
          : family === 'arrow'
          ? 'arrow'
          : 'logic'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-ROWOPCOL-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G2: Each row forms a repeating sequence of math ops.
 * Concept: "Row sequences".
 */
const generateRowSequenceMath: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Each row follows a repeating sequence of mathematical operators.";
  const seq = getVariationSequence(MATH_OPS, size, variation);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const sym = seq[(c + r + variation) % seq.length];
      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(r + variation) % COLORS.length],
        'math_op'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-ROWSEQ-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G3: Arrows flow in a consistent direction pattern.
 * Concept: "Arrow flow".
 */
const generateArrowFlow: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The arrows create a logical, flowing path across the grid.";
  const arrowSeq = getVariationSequence(ARROWS, size, variation);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];
      const sym = arrowSeq[(r + c) % arrowSeq.length];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(c + variation) % COLORS.length],
        'arrow'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-ARROW-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G4: Mirror symmetry horizontally and/or vertically.
 * Concept: "Mirror symmetry".
 */
const generateMirrorSymmetry: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid is symmetrical. The left side is a mirror image of the right, and the top mirrors the bottom.";
  const shapes = getVariationSequence(SHAPE_SYM, size, variation);
  const colors = getVariationSequence(COLORS, size, variation + 3);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const mirrorR = size - 1 - r;
      const mirrorC = size - 1 - c;

      const useR = Math.min(r, mirrorR);
      const useC = Math.min(c, mirrorC);

      const sym = shapes[(useR + useC) % shapes.length];
      const col = colors[(useR + useC + variation) % colors.length];

      correctGrid[idx] = makeTile(base, sym, col, 'shape');
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-MIRROR-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G5: Checkerboard parity – even vs odd cells follow different symbol families.
 * Concept: "Checkerboard logic".
 */
const generateCheckerParity: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid follows a checkerboard pattern. Even-positioned tiles belong to one symbol family, while odd-positioned tiles belong to another.";

  const evenFamily: readonly string[] = MATH_OPS;
  const oddFamily: readonly string[] = COMP_OPS;

  for (let i = 0; i < size * size; i++) {
    const base = correctGrid[i];
    const isEven = ((i + variation) % 2) === 0;

    if (isEven) {
      const sym = evenFamily[i % evenFamily.length];
      correctGrid[i] = makeTile(
        base,
        sym,
        COLORS[(i + variation) % COLORS.length],
        'math_op'
      );
    } else {
      const sym = oddFamily[i % oddFamily.length];
      correctGrid[i] = makeTile(
        base,
        sym,
        COLORS[(i + 1 + variation) % COLORS.length],
        'compare'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-CHECKER-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G6: Cluster different symbol families into quadrants.
 * Concept: "Symbol groups by area".
 */
const generateGroupCluster: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid is divided into quadrants, and each quadrant contains symbols from a specific family (e.g., math, logic).";

  const families = [
    { cat: 'math_op' as const, list: MATH_OPS },
    { cat: 'compare' as const, list: COMP_OPS },
    { cat: 'arrow' as const, list: ARROWS },
    { cat: 'logic' as const, list: LOGIC_SYM },
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      // Quadrant index (0..3)
      const qRow = r < size / 2 ? 0 : 1;
      const qCol = c < size / 2 ? 0 : 1;
      const qIndex = (qRow * 2 + qCol + variation) % families.length;

      const fam = families[qIndex];
      const sym = fam.list[(r + c + variation) % fam.list.length];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(qIndex + variation) % COLORS.length],
        fam.cat
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-CLUSTER-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G7: Latin-square style symbol usage.
 * Concept: "Each row & column uses each symbol once".
 */
const generateLatinSymbol: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "Similar to Sudoku, each symbol appears exactly once in every row and every column.";

  const symbols = getVariationSequence(SHAPE_SYM, size, variation);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const symIndex = (r + c) % symbols.length;
      const sym = symbols[symIndex];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(symIndex + variation) % COLORS.length],
        'shape'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-LATIN-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G8: Shape complexity gradient (simple → complex).
 * Concept: "Shape complexity".
 */
const generateShapeComplexity: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The symbols are arranged in a gradient of complexity, from simple shapes (like circles) to more complex ones (like stars).";

  const orderedShapes = getVariationSequence(SHAPE_SYM, size, variation);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      // complexity increases as r+c grows
      const index = (r + c) % orderedShapes.length;
      const sym = orderedShapes[index];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(index + variation) % COLORS.length],
        'shape'
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-COMPLEX-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G9: Ring rule – inner vs outer ring follow different symbol families.
 * Concept: "Inner vs outer ring".
 */
const generateRingRule: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The symbols on the outer ring of the grid follow a different rule from the symbols in the center.";

  const outerFamily = SHAPE_SYM;
  const innerFamily = LOGIC_SYM;

  const center = (size - 1) / 2;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const dist = Math.max(Math.abs(r - center), Math.abs(c - center));

      const isOuter = dist === center;
      const list = isOuter ? outerFamily : innerFamily;
      const cat = isOuter ? 'shape' : 'logic';
      const sym = list[(r + c + variation) % list.length];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(dist + variation) % COLORS.length],
        cat
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-RING-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

/**
 * G10: Quadrant rule with complexity mixing (good for harder levels).
 * Concept: "Mixed quadrant constraints".
 */
const generateQuadrantRule: SymbolPatternGenerator = (gridSize, levelIndex, variation) => {
  const size = gridSize;
  const correctGrid = createGrid(size);
  const rule = "The grid is split into four quarters. Each quadrant follows its own unique rule or belongs to a different symbol family.";

  const families = [
    { cat: 'math_op' as const, list: MATH_OPS },
    { cat: 'compare' as const, list: COMP_OPS },
    { cat: 'arrow' as const, list: ARROWS },
    { cat: 'shape' as const, list: SHAPE_SYM },
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const base = correctGrid[idx];

      const qRow = r < size / 2 ? 0 : 1;
      const qCol = c < size / 2 ? 0 : 1;
      const qIndex = (qRow * 2 + qCol + variation) % families.length;

      const fam = families[qIndex];
      const sym = fam.list[(r + c + 2 * variation) % fam.list.length];

      correctGrid[idx] = makeTile(
        base,
        sym,
        COLORS[(qIndex + r + variation) % COLORS.length],
        fam.cat
      );
    }
  }

  const { incorrectGrid, solutionIndices } = applySwapFlaw(correctGrid);

  return {
    id: `L${levelIndex + 1}-QUAD-${variation}`,
    grid: incorrectGrid,
    correctGrid,
    solution: { type: 'swap', indices: solutionIndices, rule },
  };
};

// Group generators by "difficulty flavor"
const easyGenerators: SymbolPatternGenerator[] = [
  generateRowOpColGroup,
  generateRowSequenceMath,
  generateArrowFlow,
];

const mediumGenerators: SymbolPatternGenerator[] = [
  generateMirrorSymmetry,
  generateCheckerParity,
  generateGroupCluster,
  generateLatinSymbol,
];

const hardGenerators: SymbolPatternGenerator[] = [
  generateShapeComplexity,
  generateRingRule,
  generateQuadrantRule,
];

// ---------------------------------------------
// HINT HELPERS (MULTI-HINT PER CONCEPT)
// ---------------------------------------------

const baseHints: Record<SymbolGeneratorType, string[]> = {
  ROW_OP_COL_GROUP: [
    'The symbols in each row are not random – they share something.',
    'Look at rows and columns separately. Do rows and columns behave differently?',
    'Rows tend to use a similar kind of symbol (like operators).',
    'Columns might represent categories (math, comparison, arrows, logic). Find the two tiles that break this idea.',
  ],
  ROW_SEQ_MATH: [
    'Scan each row from left to right – do you see a repeating pattern?',
    'Think of sequences like +, −, ×, ÷ repeating.',
    'Each row should follow the same math-operation pattern.',
    'Find the two symbols that break the repeating order and imagine swapping them.',
  ],
  ARROW_FLOW: [
    'Focus on the arrows – where are they pointing?',
    'Try to see if arrows create a flow or path across the grid.',
    'Some rows / columns might always move in a consistent direction.',
    'Find the two arrows whose directions don’t fit the overall flow.',
  ],
  MIRROR_SYM: [
    'Imagine drawing a line in the middle of the grid.',
    'Some tiles may have mirror partners across a center line.',
    'Check if left and right halves (or top and bottom) mirror each other.',
    'Find the two symbols that break the mirror symmetry.',
  ],
  CHECKER_PARITY: [
    'Think of the grid like a chessboard: dark and light squares.',
    'Even and odd positions might follow different rules.',
    'Some cells might always show operators, others comparisons.',
    'Find the two tiles that are on the wrong “color” of this checkerboard logic.',
  ],
  GROUP_CLUSTER: [
    'Look at each corner or region – do they group similar symbols?',
    'Top-left, top-right, bottom-left, bottom-right might act like families.',
    'Each quadrant could belong to a single symbol family (math, compare, arrow, logic).',
    'Find the two symbols that ended up in the wrong region.',
  ],
  LATIN_SYMBOL: [
    'Try comparing rows and columns carefully.',
    'Each row and column might be using each symbol only once.',
    'No symbol should repeat in the same row or column.',
    'Find the swap that restores this “one of each per row/column” rule.',
  ],
  SHAPE_COMPLEXITY: [
    'Focus on shapes, not colors.',
    'Some shapes are simpler, others more complex or “spiky”.',
    'Complexity might change as you move across the grid.',
    'Find the two shapes that don’t follow the simple → complex progression.',
  ],
  RING_RULE: [
    'Look at the outer ring vs the inner area.',
    'Maybe the outer edge uses different symbols than the center.',
    'Inner tiles could belong to one family, outer tiles to another.',
    'Find the two symbols that are on the wrong side of this ring rule.',
  ],
  QUADRANT_RULE: [
    'Split the grid into four quadrants.',
    'Each quadrant might use a different kind of symbol.',
    'Top-left, top-right, bottom-left, bottom-right may each follow their own rule.',
    'Find the two tiles that look like they belong to a different quadrant.',
  ],
};

// ---------------------------------------------
// LEVEL DEFINITIONS – 100 LEVELS
// ---------------------------------------------

export const symbolLevels: SymbolLevelTemplate[] = (() => {
  const levels: SymbolLevelTemplate[] = [];

  // Levels 1–30: Easy (3x3) using easyGenerators
  for (let i = 0; i < 30; i++) {
    const gen = easyGenerators[i % easyGenerators.length];
    const type: SymbolGeneratorType =
      gen === generateRowOpColGroup
        ? 'ROW_OP_COL_GROUP'
        : gen === generateRowSequenceMath
        ? 'ROW_SEQ_MATH'
        : 'ARROW_FLOW';

    levels.push({
      level: i + 1,
      concept:
        type === 'ROW_OP_COL_GROUP'
          ? 'Row Operator / Column Group'
          : type === 'ROW_SEQ_MATH'
          ? 'Row Operation Sequence'
          : 'Arrow Flow',
      gridSize: 3,
      difficulty: 'easy',
      generatorType: type,
      hintLevels: baseHints[type],
      generator: (levelIndex, variation) =>
        gen(3, levelIndex, variation),
    });
  }

  // Levels 31–70: Medium (4x4) using mediumGenerators + some easy
  for (let i = 30; i < 70; i++) {
    const pool = [...easyGenerators, ...mediumGenerators];
    const gen = pool[i % pool.length];
    const type: SymbolGeneratorType =
      gen === generateRowOpColGroup
        ? 'ROW_OP_COL_GROUP'
        : gen === generateRowSequenceMath
        ? 'ROW_SEQ_MATH'
        : gen === generateArrowFlow
        ? 'ARROW_FLOW'
        : gen === generateMirrorSymmetry
        ? 'MIRROR_SYM'
        : gen === generateCheckerParity
        ? 'CHECKER_PARITY'
        : gen === generateGroupCluster
        ? 'GROUP_CLUSTER'
        : 'LATIN_SYMBOL';

    levels.push({
      level: i + 1,
      concept:
        type === 'MIRROR_SYM'
          ? 'Mirror Symmetry'
          : type === 'CHECKER_PARITY'
          ? 'Checkerboard Logic'
          : type === 'GROUP_CLUSTER'
          ? 'Symbol Clusters'
          : type === 'LATIN_SYMBOL'
          ? 'Latin Symbol Grid'
          : type === 'ARROW_FLOW'
          ? 'Arrow Flow'
          : type === 'ROW_SEQ_MATH'
          ? 'Row Operation Sequence'
          : 'Row Operator / Column Group',
      gridSize: 4,
      difficulty: 'medium',
      generatorType: type,
      hintLevels: baseHints[type],
      generator: (levelIndex, variation) =>
        gen(4, levelIndex, variation),
    });
  }

  // Levels 71–100: Hard (5x5) using all generators with bias to hardGenerators
  for (let i = 70; i < 100; i++) {
    const pool = [...mediumGenerators, ...hardGenerators];
    const gen = pool[i % pool.length];
    const type: SymbolGeneratorType =
      gen === generateMirrorSymmetry
        ? 'MIRROR_SYM'
        : gen === generateCheckerParity
        ? 'CHECKER_PARITY'
        : gen === generateGroupCluster
        ? 'GROUP_CLUSTER'
        : gen === generateLatinSymbol
        ? 'LATIN_SYMBOL'
        : gen === generateShapeComplexity
        ? 'SHAPE_COMPLEXITY'
        : gen === generateRingRule
        ? 'RING_RULE'
        : 'QUADRANT_RULE';

    levels.push({
      level: i + 1,
      concept:
        type === 'SHAPE_COMPLEXITY'
          ? 'Shape Complexity Gradient'
          : type === 'RING_RULE'
          ? 'Inner vs Outer Ring'
          : type === 'QUADRANT_RULE'
          ? 'Quadrant Rules'
          : type === 'LATIN_SYMBOL'
          ? 'Latin Symbol Grid'
          : type === 'GROUP_CLUSTER'
          ? 'Symbol Clusters'
          : type === 'CHECKER_PARITY'
          ? 'Checkerboard Logic'
          : 'Mirror Symmetry',
      gridSize: 5,
      difficulty: 'hard',
      generatorType: type,
      hintLevels: baseHints[type],
      generator: (levelIndex, variation) =>
        gen(5, levelIndex, variation),
    });
  }

  return levels;
})();

// ---------------------------------------------
// PUBLIC API
// ---------------------------------------------

export function getSymbolLevelConfig(levelIndex: number): SymbolLevelTemplate {
  const clampedIndex = Math.max(
    0,
    Math.min(levelIndex, symbolLevels.length - 1)
  );
  return symbolLevels[clampedIndex];
}

/**
 * Main puzzle generator.
 * levelIndex is 0-based (0..99),
 * retryCount controls variation (0..9) but can be any integer.
 */
export function generateSymbolPuzzle(
  levelIndex: number,
  retryCount: number
): SymbolPuzzle {
  const variation = retryCount % VARIATIONS_PER_SYMBOL_LEVEL;
  const config = getSymbolLevelConfig(levelIndex);
  return config.generator(levelIndex, variation);
}

/**
 * Returns all hint tiers for a given level (for your hint UI / ad unlock).
 */
export function getSymbolHints(levelIndex: number): string[] {
  return getSymbolLevelConfig(levelIndex).hintLevels;
}
