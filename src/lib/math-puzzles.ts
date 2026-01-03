
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
    type: 'add' | 'subtract' | 'multiply' | 'divide' | 'equation' | 'fill-blank';
    rangeA: [number, number];
    rangeB: [number, number];
    rangeC?: [number, number];
    description: string;
}

/**
 * Defines the difficulty and type of puzzle for each level.
 * @param level The player's current level (0-indexed).
 * @returns {PuzzleConfig} The configuration for that level.
 */
export function getMathPuzzleConfig(level: number): PuzzleConfig {
    // Levels 1-8: Rapid introduction to all four operations
    if (level < 2) return { type: 'add', rangeA: [2, 9], rangeB: [2, 9], description: "Let's warm up with some simple addition." }; // Lvl 1-2
    if (level < 4) return { type: 'subtract', rangeA: [10, 20], rangeB: [2, 9], description: "Time to practice subtraction." }; // Lvl 3-4
    if (level < 6) return { type: 'multiply', rangeA: [2, 9], rangeB: [2, 9], description: "Can you solve these multiplication puzzles?" }; // Lvl 5-6
    if (level < 8) return { type: 'divide', rangeA: [10, 81], rangeB: [2, 9], description: "Now for some division. The answer will always be a whole number." }; // Lvl 7-8
    
    // Levels 9-25: Order of Operations (PEMDAS/BODMAS)
    if (level < 25) return { type: 'equation', rangeA: [1, 9], rangeB: [2, 9], rangeC: [2, 5], description: "Think about the order of operations!" };

    // Levels 26-50: Algebraic thinking with "fill-in-the-blank"
    return { type: 'fill-blank', rangeA: [2, 12], rangeB: [2, 12], description: "Solve for the blank. A taste of algebra!" };
}

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to convert a number into an array of single-digit numbers
const toDigits = (value: number): number[] => String(value).split('').map(Number);

// Helper function to convert an array of TileValues to an array of Tiles
const toTiles = (values: TileValue[], isLocked: (value: TileValue) => boolean): Tile[] => {
    return values.map(val => ({
        value: val,
        isLocked: isLocked(val),
    }));
};

const generateSimplePuzzle = (level: number): { board: Tile[], solution: TileValue[] } => {
    const config = getMathPuzzleConfig(level);
    let a=0, b=0, c=0;
    let op: '+' | '-' | '*' | '/' = '+';
    let solution: TileValue[] = [];

    switch(config.type) {
        case 'subtract':
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], Math.min(a - 1, config.rangeB[1]));
            c = a - b;
            op = '-';
            break;
        case 'multiply':
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], config.rangeB[1]);
            c = a * b;
            op = '*';
            break;
        case 'divide':
            b = getRandom(config.rangeB[0], config.rangeB[1]);
            c = getRandom(2, Math.floor(config.rangeA[1] / b));
            a = b * c; // Ensure a is perfectly divisible by b
            op = '/';
            break;
        case 'add':
        default:
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], config.rangeB[1]);
            c = a + b;
            op = '+';
            break;
    }
    
    solution = [...toDigits(a), op, ...toDigits(b), '=', ...toDigits(c)];
    const isLocked = (v: TileValue) => typeof v === 'string';
    const board = toTiles(solution, isLocked);
    return { board, solution };
}

const generateComplexPuzzle = (level: number): { board: Tile[], solution: TileValue[] } => {
    const config = getMathPuzzleConfig(level);
    const { rangeA, rangeB, rangeC } = config;

    const a = getRandom(rangeA![0], rangeA![1]);
    const b = getRandom(rangeB![0], rangeB![1]);
    const cVal = getRandom(rangeC![0], rangeC![1]);
    
    const op1 = Math.random() > 0.5 ? '+' : '-';
    // Prioritize multiplication to make it more interesting
    const op2 = Math.random() > 0.7 ? '*' : '+';

    let solutionValue: number;
    if (op2 === '*') {
        solutionValue = (op1 === '+') ? a + (b * cVal) : a - (b * cVal);
    } else { // op2 is '+'
        solutionValue = (op1 === '+') ? a + b + cVal : a - b + cVal;
    }

    const solution: TileValue[] = [...toDigits(a), op1, ...toDigits(b), op2, ...toDigits(cVal), '=', ...toDigits(solutionValue)];
    const isLocked = (v: TileValue) => typeof v === 'string';
    const board = toTiles(solution, isLocked);

    return { board, solution };
}

const generateFillBlankPuzzle = (level: number): { board: Tile[], solution: TileValue[] } => {
    const config = getMathPuzzleConfig(level);
    const { rangeA, rangeB } = config;
    const op = Math.random() > 0.5 ? '*' : '+';
    
    const a = getRandom(rangeA![0], rangeA![1]);
    const b = getRandom(rangeB![0], rangeB![1]);
    const c = op === '*' ? a * b : a + b;

    const parts = [
        { value: toDigits(a), locked: false, isAnswer: false },
        { value: [op], locked: true, isAnswer: false },
        { value: toDigits(b), locked: false, isAnswer: false },
        { value: ['='], locked: true, isAnswer: false },
        { value: toDigits(c), locked: false, isAnswer: false },
    ];
    
    // Decide which number to make the blank
    const blankPartIndices = [0, 2, 4].filter(i => parts[i].value.length === 1); // Only make single-digit numbers blank
    const blankPartIndex = blankPartIndices[Math.floor(Math.random() * blankPartIndices.length)];
    parts[blankPartIndex].isAnswer = true;
    const answerValue = parts[blankPartIndex].value[0];

    const solution: TileValue[] = parts.flatMap(p => p.value);
    let boardValues: TileValue[] = [];
    
    parts.forEach(part => {
        if (part.isAnswer) {
            boardValues.push(null); // This is the blank spot
        } else {
            boardValues.push(...part.value);
        }
    });

    const isLocked = (v: TileValue) => typeof v === 'string';
    const board = toTiles(boardValues, isLocked);
    
    // Find a swappable number tile on the board to replace with the answer digit
    const swappableIndices = board.map((tile, i) => 
        typeof tile.value === 'number' && !tile.isLocked ? i : -1
    ).filter(i => i !== -1);
    
    if (swappableIndices.length > 0) {
        const indexToSwapWith = swappableIndices[Math.floor(Math.random() * swappableIndices.length)];
        const valueToKeep = board[indexToSwapWith].value;
        
        const blankIndex = board.findIndex(t => t.value === null);
        board[blankIndex].value = valueToKeep; // Put the displaced number in the blank spot
        board[indexToSwapWith].value = answerValue; // Put the answer digit on the board
    } else {
        // Fallback: if no swappable numbers, just add the answer at the end
        board.push({ value: answerValue, isLocked: false });
    }

    return { board, solution };
}


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    const config = getMathPuzzleConfig(level);
    let finalCorrectBoard: Tile[] = [];
    let solutionValues: TileValue[] = [];

    if (config.type === 'equation') {
        const { board, solution } = generateComplexPuzzle(level);
        finalCorrectBoard = board;
        solutionValues = solution;
    } else if (config.type === 'fill-blank') {
        const { board, solution } = generateFillBlankPuzzle(level);
        
        const blankIndex = solution.findIndex((v, i) => board[i]?.value !== v && board[i]?.value !== null );
        const answerValue = solution[blankIndex];
        const answerIndex = board.findIndex(t => t.value === answerValue && !t.isLocked);
        
        if (blankIndex > -1 && answerIndex > -1) {
             return {
                id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
                board: board,
                swappedIndices: [blankIndex, answerIndex].sort((a,b) => a-b) as [number, number],
                correctSolution: solutionValues,
            };
        }
        return generatePuzzle(level, retryCount + 1);

    } else {
        const { board, solution } = generateSimplePuzzle(level);
        finalCorrectBoard = board;
        solutionValues = solution;
    }

  // --- Scramble the board by swapping two number tiles ---
  const scrambledBoard: Tile[] = JSON.parse(JSON.stringify(finalCorrectBoard));
  
  // Get indices of all tiles that are numbers (not locked)
  const numberIndices = finalCorrectBoard
    .map((tile, i) => (typeof tile.value === 'number' && !tile.isLocked) ? i : -1)
    .filter(i => i !== -1);

  if (numberIndices.length < 2) {
    // Not enough numbers to swap, regenerate
    return generatePuzzle(level, retryCount + 1);
  }

  // Pick two distinct random indices from the available number positions
  let idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  let idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  
  // Ensure the swapped numbers are different and indices are different to make a solvable puzzle
  let attempts = 0;
  while ((idx1 === idx2 || scrambledBoard[idx1].value === scrambledBoard[idx2].value) && attempts < 20) {
    idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
    idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
    attempts++;
  }
  
  if (attempts >= 20) {
    // Could not find a valid swap, regenerate the whole puzzle
    return generatePuzzle(level, retryCount + 1);
  }


  // Swap the values at these indices to create the puzzle
  [scrambledBoard[idx1].value, scrambledBoard[idx2].value] = [scrambledBoard[idx2].value, scrambledBoard[idx1].value];
  
  return {
    id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
    board: scrambledBoard,
    swappedIndices: [idx1, idx2].sort((a,b) => a - b) as [number, number],
    correctSolution: solutionValues,
  };
};

export const getHint = (puzzle: MathPuzzle): string => {
    const [idx1, idx2] = puzzle.swappedIndices;
    const tile1Value = puzzle.correctSolution[idx1];
    
    const hints = [
        `One of the numbers you need to swap is '${tile1Value}'.`,
        `Think about the relationship between the numbers. Does the result make sense?`,
        `One of the tiles is in the wrong position. It should be a '${tile1Value}'.`,
        `The final answer is ${puzzle.correctSolution.slice(puzzle.correctSolution.indexOf('=') + 1).join('')}.`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
}
