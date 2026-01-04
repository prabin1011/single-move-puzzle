'use client';

// A tile can have a color, a shape, and a direction.
// Not all properties will be used in every puzzle type.
export interface Tile {
  id: string; // Unique ID for React keys, e.g., "0-0"
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'empty';
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'empty';
  direction: 'up' | 'down' | 'left' | 'right' | 'empty';
}

// Defines a single puzzle variation.
export interface PatternPuzzle {
  id: string; // e.g., "level-1-var-0"
  solution: {
    type: 'swap'; // For now, we only support swaps
    indices: [number, number]; // The two indices that need to be swapped
  };
  grid: Tile[]; // The array of tiles representing the scrambled puzzle state
}

// Defines a level, which contains a concept and multiple variations.
export interface LevelTemplate {
  level: number;
  concept: string;
  gridSize: 3 | 4 | 5;
  hint: string;
  // A function that generates a puzzle variation for this level.
  // The 'seed' ensures we get different but deterministic variations.
  generate: (level: number, seed: number) => PatternPuzzle;
}

// --- UTILITY FUNCTIONS ---

/**
 * Creates a flat grid of default tiles.
 */
const createGrid = (size: number): Tile[] => {
  return Array.from({ length: size * size }, (_, i) => ({
    id: `${Math.floor(i / size)}-${i % size}`,
    color: 'empty',
    shape: 'empty',
    direction: 'empty',
  }));
};

/**
 * Creates a deep copy of a grid to prevent mutation issues.
 */
const copyGrid = (grid: Tile[]): Tile[] => {
  return grid.map(tile => ({ ...tile }));
};

// --- PUZZLE GENERATION LOGIC ---

// --- PILLAR 1: COLOR PATTERNS ---

const generateCheckerboard = (level: number, seed: number): PatternPuzzle => {
    const size = level < 11 ? 3 : 4;
    const colors: ['blue' | 'red', 'green' | 'yellow', 'purple' | 'blue'] = [['blue', 'red'], ['green', 'yellow'], ['purple', 'blue']];
    const [c1, c2] = colors[seed % colors.length];

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        grid[i].color = (row + col) % 2 === 0 ? c1 : c2;
    }
    
    // Introduce a flaw
    const incorrectGrid = copyGrid(grid);
    const index1 = (seed + 3) % (size * size);
    let index2 = (seed + 7) % (size * size);
    if (index1 === index2) index2 = (index2 + 1) % (size * size);

    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: [index1, index2] },
    };
};

const generateRowColumn = (level: number, seed: number): PatternPuzzle => {
    const size = level < 11 ? 3 : 4;
    const colors: ['blue' | 'red', 'green' | 'yellow'] = [['blue', 'red'], ['green', 'yellow']];
    const [c1, c2] = colors[seed % colors.length];

    const grid = createGrid(size);
    const byRow = seed % 2 === 0;

    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const determinant = byRow ? row : col;
        grid[i].color = determinant % 2 === 0 ? c1 : c2;
    }

    const incorrectGrid = copyGrid(grid);
    const index1 = (seed + 1) % (size * size);
    let index2 = (seed + 5) % (size * size);
    if (index1 === index2) index2 = (index2 + 1) % (size * size);
    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: [index1, index2] },
    };
};

// --- PILLAR 2: SHAPE PATTERNS ---

const generateShapeDiagonals = (level: number, seed: number): PatternPuzzle => {
    const size = level < 26 ? 4 : 5;
    const shapes: ['circle' | 'square', 'triangle' | 'diamond'] = [['circle', 'square'], ['triangle', 'diamond']];
    const [s1, s2] = shapes[seed % shapes.length];

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        grid[i].shape = row === col ? s1 : s2;
    }
    
    const incorrectGrid = copyGrid(grid);
    const index1 = (seed) % (size * size);
    let index2 = (seed + size + 1) % (size * size);
     if (index1 === index2) index2 = (index2 + 1) % (size * size);
    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];
    
    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: [index1, index2] },
    };
};

// --- PILLAR 3: DIRECTION PATTERNS ---

const generateDirectionFlow = (level: number, seed: number): PatternPuzzle => {
    const size = level < 36 ? 4 : 5;
    const isVertical = seed % 2 === 0;

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        if (isVertical) {
            grid[i].direction = row % 2 === 0 ? 'down' : 'up';
        } else {
            grid[i].direction = col % 2 === 0 ? 'right' : 'left';
        }
    }

    const incorrectGrid = copyGrid(grid);
    const index1 = (seed + 2) % (size * size);
    let index2 = (seed + size) % (size * size);
    if (index1 === index2) index2 = (index2 + 1) % (size * size);
    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: [index1, index2] },
    };
};

// --- PILLAR 4: MIXED LOGIC ---

const generateMixedColorShape = (level: number, seed: number): PatternPuzzle => {
    const size = 5;
    const grid = createGrid(size);
    // Rule: Circles are blue, Squares are red. One tile violates this.
    for (let i = 0; i < grid.length; i++) {
        grid[i].shape = i % 2 === 0 ? 'circle' : 'square';
        grid[i].color = i % 2 === 0 ? 'blue' : 'red';
    }

    const incorrectGrid = copyGrid(grid);
    // Find a circle and a square to swap colors
    const circleIdx = incorrectGrid.findIndex(t => t.shape === 'circle');
    const squareIdx = incorrectGrid.findIndex(t => t.shape === 'square');
    
    if (circleIdx !== -1 && squareIdx !== -1) {
        // Swap the colors, creating two flawed tiles to be swapped back
        [incorrectGrid[circleIdx].color, incorrectGrid[squareIdx].color] = [incorrectGrid[squareIdx].color, incorrectGrid[circleIdx].color];
         return {
            id: `level-${level}-var-${seed}`,
            grid: incorrectGrid,
            solution: { type: 'swap', indices: [circleIdx, squareIdx] },
        };
    }
    // Fallback if something goes wrong
    return generateCheckerboard(level, seed);
};


// --- LEVEL DEFINITIONS ---

export const patternLevels: LevelTemplate[] = [
    // Levels 1-10: Color Patterns
    ...Array.from({ length: 10 }, (_, i) => ({
        level: i + 1,
        concept: i < 5 ? "Checkerboard Colors" : "Row & Column Colors",
        gridSize: 3 as 3,
        hint: i < 5 ? "Look for the tile that breaks the alternating color pattern." : "Does the color pattern follow the rows or the columns?",
        generate: i < 5 ? generateCheckerboard : generateRowColumn,
    })),
    // Levels 11-25: Shape Patterns
    ...Array.from({ length: 15 }, (_, i) => ({
        level: i + 11,
        concept: "Shape Patterns",
        gridSize: 4 as 4,
        hint: "One shape is out of place. Look at the diagonals and lines.",
        generate: generateShapeDiagonals,
    })),
    // Levels 26-40: Directional Flow
    ...Array.from({ length: 15 }, (_, i) => ({
        level: i + 26,
        concept: "Directional Flow",
        gridSize: 4 as 4,
        hint: "All arrows should follow a simple flow. Which one is going the wrong way?",
        generate: generateDirectionFlow,
    })),
    // Levels 41-50: Mixed Logic
    ...Array.from({ length: 10 }, (_, i) => ({
        level: i + 41,
        concept: "Mixed Logic",
        gridSize: 5 as 5,
        hint: "There's a rule connecting color and shape. Find the tile that breaks it.",
        generate: generateMixedColorShape,
    })),
];


// --- PUBLIC API ---

export function getPatternPuzzleConfig(level: number): LevelTemplate {
    const adjustedLevel = Math.max(0, Math.min(level, patternLevels.length - 1));
    return patternLevels[adjustedLevel];
}

export function generatePatternPuzzle(level: number, retryCount: number): PatternPuzzle {
    const config = getPatternPuzzleConfig(level);
    // Use retryCount to generate a different variation of the same level concept
    return config.generate(level, retryCount);
}