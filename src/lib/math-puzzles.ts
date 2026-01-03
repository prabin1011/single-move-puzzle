
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
    description: string;
}

/**
 * Defines the difficulty and type of puzzle for each level based on the new, advanced progression.
 * @param level The player's current level (0-indexed).
 * @returns {PuzzleConfig} The configuration for that level.
 */
export function getMathPuzzleConfig(level: number): PuzzleConfig {
    // Levels 1-8: Rapid introduction to all four operations
    if (level < 2) return { type: 'add', description: "Let's warm up with some simple addition." }; // Lvl 1-2
    if (level < 4) return { type: 'subtract', description: "Time to practice subtraction." }; // Lvl 3-4
    if (level < 6) return { type: 'multiply', description: "Can you solve these multiplication puzzles?" }; // Lvl 5-6
    if (level < 8) return { type: 'divide', description: "Now for some division. The answer will always be a whole number." }; // Lvl 7-8
    
    // Levels 9-25: Order of Operations (PEMDAS/BODMAS)
    if (level < 25) return { type: 'equation', description: "Think about the order of operations!" };

    // Levels 26-50: Algebraic thinking with "fill-in-the-blank"
    return { type: 'fill-blank', description: "Solve for the blank. A taste of algebra!" };
}

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const toDigits = (n: number) => String(n).split('').map(Number);

/**
 * Evaluates an array of atomic tiles based on PEMDAS rules.
 * e.g., [2, '+', 3, '*', 4] -> 14
 */
function evaluate(tiles: (number | string)[]): number {
    try {
        // This is a safe use of eval because we are only ever passing it a string
        // constructed from numbers and basic operators from our own code.
        const expression = tiles.join('');
        // eslint-disable-next-line no-eval
        return eval(expression);
    } catch (e) {
        return NaN; // Return NaN if the expression is invalid
    }
}


/**
 * Generates a puzzle ensuring there is only ONE valid swap.
 * This is the new core engine for puzzle creation.
 */
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    if (retryCount > 50) { // Safety break to prevent infinite loops
        // Fallback to a very simple puzzle if generation fails
        const fallbackSolution = [1, '+', 1, '=', 2];
        const board = toTiles(fallbackSolution, (v) => typeof v === 'string');
        const scrambledBoard: Tile[] = JSON.parse(JSON.stringify(board));
        [scrambledBoard[0].value, scrambledBoard[4].value] = [scrambledBoard[4].value, scrambledBoard[0].value];
        return {
            id: `fallback-lvl-${level}`,
            board: scrambledBoard,
            swappedIndices: [0, 4],
            correctSolution: fallbackSolution
        };
    }
    
    const config = getMathPuzzleConfig(level);
    let equationTiles: TileValue[] = [];
    let isBlankPuzzle = false;

    // 1. Create a valid, correct equation based on level config
    if (config.type === 'add') {
        const a = getRandom(1, 9);
        const b = getRandom(1, 9);
        equationTiles = [...toDigits(a), '+', ...toDigits(b), '=', ...toDigits(a + b)];
    } else if (config.type === 'subtract') {
        const a = getRandom(10, 20);
        const b = getRandom(1, a-1);
        equationTiles = [...toDigits(a), '-', ...toDigits(b), '=', ...toDigits(a - b)];
    } else if (config.type === 'multiply') {
        const a = getRandom(2, 9);
        const b = getRandom(2, 9);
        equationTiles = [...toDigits(a), '*', ...toDigits(b), '=', ...toDigits(a * b)];
    } else if (config.type === 'divide') {
        const b = getRandom(2, 9);
        const res = getRandom(2, 9);
        const a = b * res;
        equationTiles = [...toDigits(a), '/', ...toDigits(b), '=', ...toDigits(res)];
    } else if (config.type === 'equation') {
        const a = getRandom(1, 9);
        const b = getRandom(1, 9);
        const c = getRandom(2, 5);
        const ops = [['+', '*'], ['-', '*'], ['+', '+'], ['-', '+']];
        const [op1, op2] = ops[level % ops.length];
        const result = evaluate([a, op1, b, op2, c]);
        if (result < 0 || result > 99) return generatePuzzle(level, retryCount + 1);
        equationTiles = [...toDigits(a), op1, ...toDigits(b), op2, ...toDigits(c), '=', ...toDigits(result)];
    } else if (config.type === 'fill-blank') {
        isBlankPuzzle = true;
        const a = getRandom(2, 9);
        const b = getRandom(2, 9);
        const op = ['*', '+'][level % 2];
        const res = op === '*' ? a * b : a + b;
        const parts = [[a], [b], [res]];
        const blankIndex = getRandom(0, 2); // 0=a, 1=b, 2=res
        
        let tempEquation: TileValue[] = [];
        if (blankIndex === 0) tempEquation = [null, op, ...toDigits(b), '=', ...toDigits(res)];
        else if (blankIndex === 1) tempEquation = [...toDigits(a), op, null, '=', ...toDigits(res)];
        else tempEquation = [...toDigits(a), op, ...toDigits(b), '=', null];
        
        equationTiles = tempEquation;
    }

    if (equationTiles.length === 0) return generatePuzzle(level, retryCount + 1); // Should not happen

    const finalBoard = toTiles(equationTiles, (v) => typeof v === 'string' || v === null);
    const numberIndices = finalBoard
        .map((tile, i) => (typeof tile.value === 'number') ? i : -1)
        .filter(i => i !== -1);
    
    if (numberIndices.length < 2 && !isBlankPuzzle) {
        return generatePuzzle(level, retryCount + 1);
    }

    // 2. Find a single, valid swap that creates a broken equation
    const possibleSwaps = [];
    for (let i = 0; i < numberIndices.length; i++) {
        for (let j = i + 1; j < numberIndices.length; j++) {
            const idx1 = numberIndices[i];
            const idx2 = numberIndices[j];

            const tempBoard = [...equationTiles];
            [tempBoard[idx1], tempBoard[idx2]] = [tempBoard[idx2], tempBoard[idx1]];
            
            const [left, right] = tempBoard.join('').split('=');
            if (String(evaluate(left.split('').map(c => isNaN(parseInt(c)) ? c : parseInt(c) ))) === right) {
                continue; // This swap results in a correct equation, so it's not a puzzle
            }
            possibleSwaps.push([idx1, idx2]);
        }
    }

    if (possibleSwaps.length === 0 && !isBlankPuzzle) {
        return generatePuzzle(level, retryCount + 1); // No valid puzzle swap found
    }

    let scrambledBoard: Tile[], swappedIndices: [number, number];

    if (isBlankPuzzle) {
        const blankIndex = equationTiles.indexOf(null);
        const correctDigit = toDigits(evaluate(equationTiles.join('').replace('null','0').split('=')[0]))[0] ?? 0
        
        const otherDigitIndex = numberIndices[Math.floor(Math.random()*numberIndices.length)];
        const digitToSwap = equationTiles[otherDigitIndex];

        const puzzleBoard = [...equationTiles];
        puzzleBoard[blankIndex] = digitToSwap;
        puzzleBoard[otherDigitIndex] = correctDigit;
        
        scrambledBoard = toTiles(puzzleBoard, (v) => typeof v === 'string');
        swappedIndices = [blankIndex, otherDigitIndex].sort((a,b) => a-b) as [number, number];

    } else {
        swappedIndices = possibleSwaps[Math.floor(Math.random() * possibleSwaps.length)];
        const scrambledTiles = [...equationTiles];
        [scrambledTiles[swappedIndices[0]], scrambledTiles[swappedIndices[1]]] = [scrambledTiles[swappedIndices[1]], scrambledTiles[swappedIndices[0]]];
        scrambledBoard = toTiles(scrambledTiles, (v) => typeof v === 'string');
    }

    // 3. Verify the chosen swap is the ONLY valid solution.
    let validSolutions = 0;
    const allNumberIndicesOnScrambled = scrambledBoard.map((t,i) => typeof t.value === 'number' ? i : -1).filter(i => i !== -1);
    
    for (let i = 0; i < allNumberIndicesOnScrambled.length; i++) {
        for (let j = i + 1; j < allNumberIndicesOnScrambled.length; j++) {
             const idx1 = allNumberIndicesOnScrambled[i];
             const idx2 = allNumberIndicesOnScrambled[j];
             
             const tempTiles = scrambledBoard.map(t => t.value);
             [tempTiles[idx1], tempTiles[idx2]] = [tempTiles[idx2], tempTiles[idx1]];
             const [left, right] = tempTiles.join('').split('=');
             if (String(evaluate(left.split('').map(c => isNaN(parseInt(c)) ? c : parseInt(c)))) === right) {
                validSolutions++;
             }
        }
    }

    if (validSolutions !== 1) {
        return generatePuzzle(level, retryCount + 1); // Multiple solutions found, regenerate
    }

    return {
        id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
        board: scrambledBoard,
        swappedIndices: swappedIndices.sort((a, b) => a - b) as [number, number],
        correctSolution: equationTiles,
    };
};


export const getHint = (puzzle: MathPuzzle): string => {
    const [idx1, idx2] = puzzle.swappedIndices;
    const tile1Value = puzzle.correctSolution[idx1];
    
    // Check if the puzzle is a "fill-blank" type by seeing if null was in the original solution
    const isBlankPuzzle = puzzle.correctSolution.includes(null);

    if (isBlankPuzzle) {
        return `One of the numbers you need to swap is '${tile1Value}', and it goes into the blank space.`;
    }
    
    const hints = [
        `One of the numbers you need to swap is '${tile1Value}'.`,
        `Think about the order of operations. Does multiplication or addition come first?`,
        `The final answer on the right side of the '=' should be ${puzzle.correctSolution.slice(puzzle.correctSolution.indexOf('=') + 1).join('')}.`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
}
