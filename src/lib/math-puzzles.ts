
export type TileValue = number | '+' | '-' | '*' | '/' | '=' | null;

export interface Tile {
  value: TileValue;
  isLocked: boolean; // Operators and equals sign are locked
}

export interface MathPuzzle {
  id: string;
  board: Tile[];
  swappedIndices: [number, number];
  correctSolution: (TileValue)[]; 
}

interface PuzzleConfig {
    type: 'add' | 'subtract' | 'multiply';
    rangeA: [number, number];
    rangeB: [number, number];
    description: string;
}

/**
 * Defines the difficulty and type of puzzle for each level.
 * @param level The player's current level (0-indexed).
 * @returns {PuzzleConfig} The configuration for that level.
 */
export function getMathPuzzleConfig(level: number): PuzzleConfig {
    if (level < 2) return { type: 'add', rangeA: [1, 5], rangeB: [1, 5], description: "Let's warm up. A simple addition." };
    if (level < 10) return { type: 'add', rangeA: [1, 9], rangeB: [1, 9], description: "More addition practice." };
    if (level < 20) return { type: 'add', rangeA: [10, 20], rangeB: [10, 20], description: "Time for some double-digit addition." };
    if (level < 35) return { type: 'subtract', rangeA: [10, 50], rangeB: [1, 20], description: "Now, let's try some subtraction." };
    if (level < 50) return { type: 'multiply', rangeA: [2, 9], rangeB: [2, 9], description: "Can you solve this multiplication puzzle?" };
    
    // Default for levels 50+
    return { type: 'multiply', rangeA: [5, 12], rangeB: [5, 12], description: "Getting tougher! Let's multiply." };
}

const generateNumbers = (level: number): {a: number, b: number, c: number, op: '+' | '-' | '*'} => {
    const config = getMathPuzzleConfig(level);
    let a = 0, b = 0, c = 0;

    const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch(config.type) {
        case 'subtract':
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], Math.min(a - 1, config.rangeB[1])); // Ensure b is smaller than a
            c = a - b;
            return { a, b, c, op: '-' };
        case 'multiply':
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], config.rangeB[1]);
            c = a * b;
            return { a, b, c, op: '*' };
        case 'add':
        default:
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], config.rangeB[1]);
            c = a + b;
            return { a, b, c, op: '+' };
    }
}

// Helper function to convert a number or operator into an array of Tiles
const toTiles = (value: number | string, isLocked: boolean): Tile[] => {
    return String(value).split('').map(char => ({
        value: isNaN(Number(char)) ? (char as TileValue) : Number(char),
        isLocked,
    }));
};


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
  const {a, b, c, op} = generateNumbers(level);

  // --- 1. Create the correct board as an array of Tiles ---
  const finalCorrectBoard: Tile[] = [
    ...toTiles(a, false),
    ...toTiles(op, true),
    ...toTiles(b, false),
    ...toTiles('=', true),
    ...toTiles(c, false),
  ];


  // --- 2. Create the puzzle by swapping two number tiles ---
  const scrambledBoard: Tile[] = JSON.parse(JSON.stringify(finalCorrectBoard));
  
  // Get indices of all tiles that are numbers (not locked)
  const numberIndices = finalCorrectBoard
    .map((tile, i) => !tile.isLocked ? i : -1)
    .filter(i => i !== -1);

  // Pick two distinct random indices from the available number positions
  let idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  let idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  
  // Ensure the swapped numbers are different and indices are different to make a solvable puzzle
  while (idx1 === idx2 || scrambledBoard[idx1].value === scrambledBoard[idx2].value) {
    idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
    idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  }

  // Swap the values at these indices to create the puzzle
  [scrambledBoard[idx1].value, scrambledBoard[idx2].value] = [scrambledBoard[idx2].value, scrambledBoard[idx1].value];
  
  const correctSolutionValues = finalCorrectBoard.map(tile => tile.value);

  return {
    id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
    board: scrambledBoard,
    swappedIndices: [idx1, idx2].sort((a,b) => a - b) as [number, number],
    correctSolution: correctSolutionValues,
  };
};

export const getHint = (puzzle: MathPuzzle): string => {
    const [idx1, idx2] = puzzle.swappedIndices;
    const tile1Value = puzzle.correctSolution[idx1];
    
    const hints = [
        `One of the numbers you need to swap is '${tile1Value}'.`,
        `Think about the relationship between the numbers. Does the result make sense?`,
        `One of the tiles is in the wrong position. It should be a '${tile1Value}'.`,
        `The final answer should have ${puzzle.correctSolution.slice(puzzle.correctSolution.indexOf('=') + 1).length} digits.`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
}

    
