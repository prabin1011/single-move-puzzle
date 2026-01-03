
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
    if (level < 2) return { type: 'add', rangeA: [2, 9], rangeB: [2, 9], description: "Let's warm up with some simple addition." };
    if (level < 4) return { type: 'subtract', rangeA: [10, 20], rangeB: [2, 9], description: "Time to practice subtraction." };
    if (level < 6) return { type: 'multiply', rangeA: [2, 9], rangeB: [2, 9], description: "Can you solve these multiplication puzzles?" };
    if (level < 8) return { type: 'divide', rangeA: [10, 81], rangeB: [2, 9], description: "Now for some division. The answer will always be a whole number." };
    
    // Levels 9-25: Order of Operations (PEMDAS/BODMAS)
    if (level < 25) return { type: 'equation', rangeA: [1, 9], rangeB: [2, 9], rangeC: [2, 5], description: "Think about the order of operations!" };

    // Levels 26-50+: Algebraic thinking with "fill-in-the-blank"
    return { type: 'fill-blank', rangeA: [2, 12], rangeB: [2, 12], description: "Solve for the blank. A taste of algebra!" };
}

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to convert a number or operator into an array of single-character strings
const toChars = (value: number | string): string[] => String(value).split('');

// Helper function to convert an array of characters to an array of Tiles
const toTiles = (chars: (string|null)[], isLocked: boolean): Tile[] => {
    return chars.map(char => ({
        value: char === null ? null : (isNaN(Number(char)) ? (char as TileValue) : Number(char)),
        isLocked,
    }));
};

const generateSimplePuzzle = (level: number): { equation: Tile[], solution: (TileValue)[] } => {
    const config = getMathPuzzleConfig(level);
    let a=0, b=0, c=0;
    let op: '+' | '-' | '*' | '/' = '+';
    let solution: (TileValue)[] = [];

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
    
    solution = [...toChars(a), op, ...toChars(b), '=', ...toChars(c)].map(v => isNaN(Number(v)) ? v as TileValue : Number(v));
    const equation = [
        ...toTiles(toChars(a), false),
        ...toTiles([op], true),
        ...toTiles(toChars(b), false),
        ...toTiles(['='], true),
        ...toTiles(toChars(c), false),
    ];
    return { equation, solution };
}

const generateComplexPuzzle = (level: number): { equation: Tile[], solution: (TileValue)[] } => {
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

    const solution: (TileValue)[] = [...toChars(a), op1, ...toChars(b), op2, ...toChars(cVal), '=', ...toChars(solutionValue)].map(v => isNaN(Number(v)) ? v as TileValue : Number(v));
    
    const equation = [
        ...toTiles(toChars(a), false),
        ...toTiles([op1], true),
        ...toTiles(toChars(b), false),
        ...toTiles([op2], true),
        ...toTiles(toChars(cVal), false),
        ...toTiles(['='], true),
        ...toTiles(toChars(solutionValue), false),
    ];

    return { equation, solution };
}

const generateFillBlankPuzzle = (level: number): { equation: Tile[], solution: (TileValue)[] } => {
    const config = getMathPuzzleConfig(level);
    const { rangeA, rangeB } = config;
    const op = Math.random() > 0.5 ? '*' : '+';
    
    const a = getRandom(rangeA![0], rangeA![1]);
    const b = getRandom(rangeB![0], rangeB![1]);
    const c = op === '*' ? a * b : a + b;

    const parts = [
        { value: a, locked: false, isAnswer: false },
        { value: op, locked: true, isAnswer: false },
        { value: b, locked: false, isAnswer: false },
        { value: '=', locked: true, isAnswer: false },
        { value: c, locked: false, isAnswer: false },
    ];
    
    // Decide which number to make the blank
    const blankPartIndex = [0, 2, 4][Math.floor(Math.random() * 3)];
    parts[blankPartIndex].isAnswer = true;
    const answerValue = parts[blankPartIndex].value;

    let solution: (TileValue)[] = [];
    let equation: Tile[] = [];

    parts.forEach((part) => {
        const chars = part.isAnswer ? Array(String(part.value).length).fill(null) : toChars(part.value);
        solution.push(...(toChars(part.value).map(v => isNaN(Number(v)) ? v as TileValue : Number(v))));
        equation.push(...toTiles(chars, part.locked));
    });
    
    // Add the answer digit(s) somewhere else on the board to be swapped in.
    const answerDigits = toChars(answerValue);
    const nonAnswerTiles = equation.filter(t => t.value !== null && !t.isLocked);
    
    // Find a random tile to replace with the first answer digit
    if (nonAnswerTiles.length > 0 && answerDigits.length > 0) {
        const tileToReplaceIndex = getRandom(0, nonAnswerTiles.length - 1);
        const originalTile = nonAnswerTiles[tileToReplaceIndex];
        
        // Find this tile in the main equation board
        const boardIndex = equation.findIndex(t => t === originalTile);
        
        if(boardIndex > -1) {
            // Place the answer digit there.
             equation.push(...toTiles(toChars(equation[boardIndex].value as number), false));
             equation[boardIndex] = toTiles([answerDigits[0]], false)[0];
        }
    } else {
        // Fallback: just append the answer
        equation.push(...toTiles(answerDigits, false));
    }


    return { equation, solution };
}


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    const config = getMathPuzzleConfig(level);
    let finalCorrectBoard: Tile[] = [];
    let solutionValues: (TileValue)[] = [];

    if (config.type === 'equation') {
        const { equation, solution } = generateComplexPuzzle(level);
        finalCorrectBoard = equation;
        solutionValues = solution;
    } else if (config.type === 'fill-blank') {
        const { equation, solution } = generateFillBlankPuzzle(level);
        finalCorrectBoard = equation;
        solutionValues = solution;
        // In fill-blank, the puzzle is already scrambled. The "swap" is moving the answer into the blank.
        // We need to find the index of the blank and the index of the answer tile.
        const blankIndex = finalCorrectBoard.findIndex(t => t.value === null);
        const answerValue = String(solution[blankIndex]);
        const answerIndex = finalCorrectBoard.findIndex(t => String(t.value) === answerValue && t.isLocked === false && t !== finalCorrectBoard[blankIndex]);

        if (blankIndex > -1 && answerIndex > -1) {
            return {
                id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
                board: finalCorrectBoard,
                swappedIndices: [blankIndex, answerIndex].sort((a,b) => a-b) as [number, number],
                correctSolution: solutionValues,
            };
        }
        // Fallback if something goes wrong
        return generatePuzzle(level, retryCount + 1);


    } else {
        const { equation, solution } = generateSimplePuzzle(level);
        finalCorrectBoard = equation;
        solutionValues = solution;
    }

  // --- Scramble the board by swapping two number tiles ---
  const scrambledBoard: Tile[] = JSON.parse(JSON.stringify(finalCorrectBoard));
  
  // Get indices of all tiles that are single-digit numbers (not locked)
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
  [scrambledBoard[idx1], scrambledBoard[idx2]] = [scrambledBoard[idx2], scrambledBoard[idx1]];
  
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
