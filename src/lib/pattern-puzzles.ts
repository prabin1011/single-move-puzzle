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

/**
 * Applies a flaw to a grid by swapping two tiles.
 */
const applySwapFlaw = (grid: Tile[], seed: number): { incorrectGrid: Tile[], solution: [number, number] } => {
    const size = Math.sqrt(grid.length);
    const incorrectGrid = copyGrid(grid);
    const index1 = (seed + 3) % (size * size);
    let index2 = (seed + 7) % (size * size);
    if (index1 === index2) index2 = (index2 + 1) % (size * size);

    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];
    return { incorrectGrid, solution: [index1, index2] };
}


// --- PUZZLE GENERATION LOGIC ---

// --- PILLAR 1: SHAPE SEQUENCES ---

const generateRowShapeSequence = (level: number, seed: number): PatternPuzzle => {
    const size = level < 6 ? 3 : 4;
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    
    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const col = i % size;
        grid[i].shape = shapes[(col + seed) % shapes.length];
        grid[i].color = 'blue';
    }

    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);
    
    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

const generateColumnShapeSequence = (level: number, seed: number): PatternPuzzle => {
    const size = level < 6 ? 3 : 4;
    const shapes: ('diamond' | 'square' | 'triangle')[] = ['diamond', 'square', 'triangle'];

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        grid[i].shape = shapes[(row + seed) % shapes.length];
        grid[i].color = 'green';
    }

    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

// --- PILLAR 2: GRID LOGIC (MATRIX REASONING) ---

const generateShapeSudoku = (level: number, seed: number): PatternPuzzle => {
    const size = 3; // Keep it 3x3 for simplicity
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    const grid = createGrid(size);

    // Create a valid Latin Square (Sudoku basis)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const index = i * size + j;
            grid[index].shape = shapes[(i + j + seed) % size];
            grid[index].color = 'red';
        }
    }
    
    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

// --- PILLAR 3: DIRECTIONAL PATTERNS ---

const generateDirectionalFlow = (level: number, seed: number): PatternPuzzle => {
    const size = level < 36 ? 3 : 4;
    const isVertical = seed % 2 === 0;

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        grid[i].shape = 'empty';
        grid[i].color = 'purple';
        if (isVertical) {
            grid[i].direction = row % 2 === 0 ? 'down' : 'up';
        } else {
            grid[i].direction = col % 2 === 0 ? 'right' : 'left';
        }
    }
    
    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

const generateRotationalSymmetry = (level: number, seed: number): PatternPuzzle => {
    const size = 4;
    const grid = createGrid(size);
    const center1 = (size / 2 - 1) * size + (size / 2 - 1);
    const center2 = center1 + 1;
    const center3 = center1 + size;
    const center4 = center1 + size + 1;

    // Define a rotational pattern for the center 2x2
    grid[center1].direction = 'up';
    grid[center2].direction = 'right';
    grid[center3].direction = 'left';
    grid[center4].direction = 'down';

    // Fill the rest of the grid
     for (let i = 0; i < grid.length; i++) {
        if(grid[i].direction === 'empty') grid[i].direction = 'up';
        grid[i].color = 'yellow';
    }
    
    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

// --- PILLAR 4: MIXED LOGIC ---

const generateShapeDeterminesDirection = (level: number, seed: number): PatternPuzzle => {
    const size = 4;
    const grid = createGrid(size);

    // Rule: Circles point up, Squares point right.
    for (let i = 0; i < grid.length; i++) {
        const shape = (i + seed) % 2 === 0 ? 'circle' : 'square';
        grid[i].shape = shape;
        grid[i].direction = shape === 'circle' ? 'up' : 'right';
        grid[i].color = shape === 'circle' ? 'blue' : 'red';
    }

    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);
    
    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

// --- LEVEL DEFINITIONS ---

export const patternLevels: LevelTemplate[] = [
    // Levels 1-10: Shape Sequences
    ...Array.from({ length: 5 }, (_, i) => ({
        level: i + 1,
        concept: "Row Shape Sequence",
        gridSize: 3 as 3,
        hint: "The shapes in each row follow a repeating pattern.",
        generate: generateRowShapeSequence,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
        level: i + 6,
        concept: "Column Shape Sequence",
        gridSize: 3 as 3,
        hint: "The shapes in each column follow a repeating pattern.",
        generate: generateColumnShapeSequence,
    })),
    // Levels 11-20: Grid Logic (Matrix Reasoning)
    ...Array.from({ length: 10 }, (_, i) => ({
        level: i + 11,
        concept: "Shape Sudoku",
        gridSize: 3 as 3,
        hint: "Each row and column must contain one of each shape.",
        generate: generateShapeSudoku,
    })),
    // Levels 21-35: Directional Patterns
    ...Array.from({ length: 10 }, (_, i) => ({
        level: i + 21,
        concept: "Directional Flow",
        gridSize: 3 as 3,
        hint: "The arrows should all flow in a consistent direction for each row or column.",
        generate: generateDirectionalFlow,
    })),
     ...Array.from({ length: 5 }, (_, i) => ({
        level: i + 31,
        concept: "Rotational Symmetry",
        gridSize: 4 as 4,
        hint: "Look for a pattern of rotation, maybe in the center.",
        generate: generateRotationalSymmetry,
    })),
    // Levels 36-50: Mixed Logic
    ...Array.from({ length: 15 }, (_, i) => ({
        level: i + 36,
        concept: "Mixed Logic",
        gridSize: 4 as 4,
        hint: "There's a rule connecting a tile's shape to its direction. Find the tile that breaks the rule.",
        generate: generateShapeDeterminesDirection,
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