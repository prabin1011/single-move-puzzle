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
    let index1 = (seed * 3 + 5) % (size * size);
    let index2 = (seed * 7 + 1) % (size * size);
    
    // Ensure indices are different and not on the same tile
    if (index1 === index2) {
      index2 = (index2 + 1) % (size * size);
    }

    [incorrectGrid[index1], incorrectGrid[index2]] = [incorrectGrid[index2], incorrectGrid[index1]];
    
    // Sort to ensure consistent order for solution checking
    return { incorrectGrid, solution: [Math.min(index1, index2), Math.max(index1, index2)] };
}


// --- PUZZLE GENERATION LOGIC ---

// --- PILLAR 1: SEQUENCES (Levels 1-10) ---

const generateRowSequence = (level: number, seed: number): PatternPuzzle => {
    const size = 3;
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    const colors: ('blue' | 'red' | 'green')[] = ['blue', 'red', 'green'];
    
    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        // Alternate between shape and color sequence based on seed
        if (seed % 2 === 0) {
            grid[i].shape = shapes[(col + seed + row) % shapes.length];
            grid[i].color = colors[row];
        } else {
            grid[i].shape = shapes[row];
            grid[i].color = colors[(col + seed) % colors.length];
        }
    }

    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);
    
    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

const generateColumnSequence = (level: number, seed: number): PatternPuzzle => {
    const size = 3;
    const shapes: ('diamond' | 'square' | 'triangle')[] = ['diamond', 'square', 'triangle'];
    const colors: ('purple' | 'yellow' | 'blue')[] = ['purple', 'yellow', 'blue'];

    const grid = createGrid(size);
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        if (seed % 2 === 0) {
            grid[i].shape = shapes[(row + seed) % shapes.length];
            grid[i].color = colors[col];
        } else {
            grid[i].shape = shapes[col];
            grid[i].color = colors[(row + seed) % colors.length];
        }
    }

    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};

// --- PILLAR 2: GRID LOGIC (MATRIX REASONING, Levels 11-25) ---

const generateGridLogic = (level: number, seed: number): PatternPuzzle => {
    const size = 4; // Increased grid size
    const shapes: ('circle' | 'square' | 'triangle' | 'diamond')[] = ['circle', 'square', 'triangle', 'diamond'];
    const colors: ('blue' | 'red' | 'green' | 'yellow')[] = ['blue', 'red', 'green', 'yellow'];
    const grid = createGrid(size);

    // Rule: Each row must contain one of each shape, color determined by column.
    for (let i = 0; i < size; i++) { // row
        for (let j = 0; j < size; j++) { // col
            const index = i * size + j;
            grid[index].shape = shapes[(i + j + seed) % size];
            grid[index].color = colors[(j + seed) % size];
        }
    }
    
    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};


// --- PILLAR 3: DIRECTIONAL PATTERNS (Levels 26-40) ---

const generateDirectionalLogic = (level: number, seed: number): PatternPuzzle => {
    const size = 4;
    const grid = createGrid(size);

    // Rule: Arrows point away from the center
    const center = (size - 1) / 2;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const index = i * size + j;
            grid[index].color = 'purple';

            const dRow = i - center;
            const dCol = j - center;
            
            if (Math.abs(dRow) > Math.abs(dCol)) {
                grid[index].direction = dRow > 0 ? 'down' : 'up';
            } else {
                grid[index].direction = dCol > 0 ? 'right' : 'left';
            }
        }
    }
    
    const { incorrectGrid, solution } = applySwapFlaw(grid, seed);

    return {
        id: `level-${level}-var-${seed}`,
        grid: incorrectGrid,
        solution: { type: 'swap', indices: solution },
    };
};


// --- PILLAR 4: MIXED LOGIC (Levels 41-50) ---

const generateMixedLogic = (level: number, seed: number): PatternPuzzle => {
    const size = 5;
    const grid = createGrid(size);

    // Rule: Shape determines color, position (row) determines direction.
    const shapes: ('circle' | 'square' | 'triangle' | 'diamond' | 'empty')[] = ['circle', 'square', 'triangle', 'diamond', 'empty'];
    const colors: ('blue' | 'red' | 'green' | 'yellow' | 'purple')[] = ['blue', 'red', 'green', 'yellow', 'purple'];
    const directions: ('up' | 'down' | 'left' | 'right' | 'empty')[] = ['up', 'down', 'left', 'right', 'empty'];
    
    for (let i = 0; i < grid.length; i++) {
        const row = Math.floor(i / size);
        const col = i % size;
        const currentShape = shapes[(row + col + seed) % shapes.length];
        
        grid[i].shape = currentShape;
        grid[i].color = colors[shapes.indexOf(currentShape)];
        grid[i].direction = directions[(row + seed) % directions.length];
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
    // Levels 1-5: Row Sequences (3x3)
    ...Array.from({ length: 5 }, (_, i) => ({
        level: i + 1,
        concept: "Row Sequence",
        gridSize: 3 as 3,
        hint: "Look at the pattern of shapes or colors in each row.",
        generate: generateRowSequence,
    })),
    // Levels 6-10: Column Sequences (3x3)
    ...Array.from({ length: 5 }, (_, i) => ({
        level: i + 6,
        concept: "Column Sequence",
        gridSize: 3 as 3,
        hint: "Look at the pattern of shapes or colors in each column.",
        generate: generateColumnSequence,
    })),
    // Levels 11-25: Grid Logic (4x4) - Increased difficulty
    ...Array.from({ length: 15 }, (_, i) => ({
        level: i + 11,
        concept: "Grid Logic",
        gridSize: 4 as 4,
        hint: "Each row and column follows a specific rule. Find the tile that breaks it.",
        generate: generateGridLogic,
    })),
    // Levels 26-40: Directional Logic (4x4)
    ...Array.from({ length: 15 }, (_, i) => ({
        level: i + 26,
        concept: "Directional Flow",
        gridSize: 4 as 4,
        hint: "The arrows should all follow a consistent pattern. Find the outlier.",
        generate: generateDirectionalLogic,
    })),
    // Levels 41-50: Mixed Logic (5x5)
    ...Array.from({ length: 10 }, (_, i) => ({
        level: i + 41,
        concept: "Mixed Logic",
        gridSize: 5 as 5,
        hint: "A tile's shape, color, and position are all related. Find the one that doesn't fit.",
        generate: generateMixedLogic,
    })),
];


// --- PUBLIC API ---

export function getPatternPuzzleConfig(level: number): LevelTemplate {
    const adjustedLevel = Math.max(0, Math.min(level, patternLevels.length - 1));
    return patternLevels[adjustedLevel];
}

export function generatePatternPuzzle(level: number, retryCount: number): PatternPuzzle {
    const config = getPatternPuzzleConfig(level);
    // Use retryCount as a seed to generate a different variation of the same level concept
    return config.generate(level, retryCount);
}
