
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
    if (level < 5) return { type: 'add', rangeA: [1, 9], rangeB: [1, 9], description: "Let's warm up with some simple addition." };
    if (level < 10) return { type: 'subtract', rangeA: [5, 15], rangeB: [1, 9], description: "Time to practice subtraction." };
    if (level < 18) return { type: 'multiply', rangeA: [2, 9], rangeB: [2, 9], description: "Can you solve these multiplication puzzles?" };
    if (level < 25) return { type: 'divide', rangeA: [10, 50], rangeB: [2, 9], description: "Now for some division. The answer will always be a whole number." };
    if (level < 40) return { type: 'equation', rangeA: [1, 9], rangeB: [2, 5], rangeC: [2, 5], description: "Think about the order of operations! (e.g., 3 + 4 * 2)" };
    
    // Levels 41-50+
    return { type: 'fill-blank', rangeA: [2, 9], rangeB: [2, 9], description: "Fill in the blank to solve the puzzle." };
}

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to convert a number or operator into an array of single-character strings
const toChars = (value: number | string): string[] => String(value).split('');

// Helper function to convert an array of characters to an array of Tiles
const toTiles = (chars: string[], isLocked: boolean): Tile[] => {
    return chars.map(char => ({
        value: isNaN(Number(char)) ? (char as TileValue) : Number(char),
        isLocked,
    }));
};

const generateSimplePuzzle = (level: number): { equation: Tile[], solution: number } => {
    const config = getMathPuzzleConfig(level);
    let a=0, b=0, c=0;
    let op: '+' | '-' | '*' | '/' = '+';
    let equation: Tile[] = [];

    switch(config.type) {
        case 'subtract':
            a = getRandom(config.rangeA[0], config.rangeA[1]);
            b = getRandom(config.rangeB[0], Math.min(a - 1, config.rangeB[1])); // Ensure b is smaller than a
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
    
    equation = [
        ...toTiles(toChars(a), false),
        ...toTiles([op], true),
        ...toTiles(toChars(b), false),
        ...toTiles(['='], true),
        ...toTiles(toChars(c), false),
    ];
    return { equation, solution: c };
}

const generateComplexPuzzle = (level: number): { equation: Tile[], solution: number } => {
    const config = getMathPuzzleConfig(level);
    const { rangeA, rangeB, rangeC } = config;

    const a = getRandom(rangeA![0], rangeA![1]);
    const b = getRandom(rangeB![0], rangeB![1]);
    const c = getRandom(rangeC![0], rangeC![1]);
    
    const op1 = Math.random() > 0.5 ? '+' : '-';
    const op2 = Math.random() > 0.5 ? '*' : '+';

    const solution = op2 === '*' ? (op1 === '+' ? a + (b * c) : a - (b * c)) : (op1 === '+' ? a + b + c : a - b + c);

    const equation = [
        ...toTiles(toChars(a), false),
        ...toTiles([op1], true),
        ...toTiles(toChars(b), false),
        ...toTiles([op2], true),
        ...toTiles(toChars(c), false),
        ...toTiles(['='], true),
        ...toTiles(toChars(solution), false),
    ];

    return { equation, solution };
}

const generateFillBlankPuzzle = (level: number): { equation: Tile[], solution: number } => {
    const config = getMathPuzzleConfig(level);
    const { rangeA, rangeB } = config;
    const op = Math.random() > 0.5 ? '*' : '+';
    
    const a = getRandom(rangeA[0], rangeA[1]);
    const b = getRandom(rangeB[0], rangeB[1]);
    const c = op === '*' ? a * b : a + b;

    const parts = [
        { value: a, locked: false, isAnswer: false },
        { value: op, locked: true, isAnswer: false },
        { value: b, locked: false, isAnswer: false },
        { value: '=', locked: true, isAnswer: false },
        { value: c, locked: false, isAnswer: false },
    ];
    
    const blankIndex = Math.random() > 0.5 ? 0 : 2; // Make 'a' or 'b' the blank
    parts[blankIndex].isAnswer = true;
    const solution = parts[blankIndex].value as number;
    
    let equation: Tile[] = [];
    parts.forEach((part, index) => {
        if(index === blankIndex) {
            equation.push({ value: null, isLocked: false }); // The blank tile
        } else {
            equation.push(...toTiles(toChars(part.value), part.locked));
        }
    });

    return { equation, solution };
}


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    const config = getMathPuzzleConfig(level);
    let finalCorrectBoard: Tile[] = [];
    let solutionValue: number = 0;

    if (config.type === 'equation') {
        const { equation, solution } = generateComplexPuzzle(level);
        finalCorrectBoard = equation;
        solutionValue = solution;
    } else if (config.type === 'fill-blank') {
        const { equation, solution } = generateFillBlankPuzzle(level);
        // For fill-blank, we need to add the answer tile somewhere else on the board to be swapped in.
        finalCorrectBoard = equation;
        solutionValue = solution;
        // Add the solution as a swappable tile at the end of the puzzle
        finalCorrectBoard.push(...toTiles(toChars(solution), false));
    } else {
        const { equation, solution } = generateSimplePuzzle(level);
        finalCorrectBoard = equation;
        solutionValue = solution;
    }

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
  [scrambledBoard[idx1], scrambledBoard[idx2]] = [scrambledBoard[idx2], scrambledBoard[idx1]];
  
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

    

    