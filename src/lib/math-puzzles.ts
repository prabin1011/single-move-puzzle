

export type TileValue = number | '+' | '-' | '*' | '/' | '=' | null;

export interface Tile {
  value: TileValue;
  isLocked: boolean; // Operators and equals sign are locked
}

export interface MathPuzzle {
  id: string;
  board: Tile[];
  swappedIndices: [number, number];
  correctSolution: (number | string)[]; 
}

interface PuzzleConfig {
    type: 'add' | 'subtract' | 'multiply';
    range: [number, number];
    description: string;
}

/**
 * Defines the difficulty and type of puzzle for each level.
 * @param level The player's current level (0-indexed).
 * @returns {PuzzleConfig} The configuration for that level.
 */
export function getMathPuzzleConfig(level: number): PuzzleConfig {
    if (level < 2) return { type: 'add', range: [1, 5], description: "Let's warm up with some simple addition." };
    if (level < 10) return { type: 'add', range: [10, 50], description: "Time for some double-digit addition." };
    if (level < 20) return { type: 'subtract', range: [5, 50], description: "Now, let's try some subtraction." };
    if (level < 30) return { type: 'multiply', range: [2, 10], description: "Can you solve this multiplication puzzle?" };
    
    // Default for higher levels
    return { type: 'multiply', range: [5, 12], description: "Getting tougher! Let's multiply." };
}

const generateNumbers = (level: number): {a: number, b: number, c: number, op: '+' | '-' | '*'} => {
    const config = getMathPuzzleConfig(level);
    let a = 0, b = 0, c = 0;
    const [min, max] = config.range;

    const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch(config.type) {
        case 'subtract':
            a = getRandom(min + 1, max);
            b = getRandom(min, a - 1);
            c = a - b;
            return { a, b, c, op: '-' };
        case 'multiply':
            a = getRandom(min, max);
            b = getRandom(min, max);
            c = a * b;
            return { a, b, c, op: '*' };
        case 'add':
        default:
            a = getRandom(min, max);
            b = getRandom(min, max);
            c = a + b;
            return { a, b, c, op: '+' };
    }
}


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
  const {a, b, c, op} = generateNumbers(level);

  // --- 1. Create the correct board ---
  const finalCorrectBoard: Tile[] = [];
  const strA = a.toString();
  for (let i = 0; i < strA.length; i++) finalCorrectBoard.push({ value: parseInt(strA[i]), isLocked: false });
  
  finalCorrectBoard.push({ value: op, isLocked: true });
  
  const strB = b.toString();
  for (let i = 0; i < strB.length; i++) finalCorrectBoard.push({ value: parseInt(strB[i]), isLocked: false });
  
  finalCorrectBoard.push({ value: '=', isLocked: true });
  
  const strC = c.toString();
  for (let i = 0; i < strC.length; i++) finalCorrectBoard.push({ value: parseInt(strC[i]), isLocked: false });


  // --- 2. Create the puzzle by swapping two numbers ---
  const scrambledBoard = JSON.parse(JSON.stringify(finalCorrectBoard));
  const numberIndices = finalCorrectBoard.map((tile, i) => !tile.isLocked ? i : -1).filter(i => i !== -1);

  // Pick two distinct random indices from the available number positions
  let idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  let idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  
  // Ensure the swapped numbers are different to make a solvable puzzle
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
    correctSolution: correctSolutionValues.map(v => (v === null ? '' : String(v))),
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

    
