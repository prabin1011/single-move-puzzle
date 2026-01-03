
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
    if (level < 2) return { type: 'add', description: "Let's warm up with some simple addition." };
    if (level < 4) return { type: 'subtract', description: "Time to practice subtraction." };
    if (level < 6) return { type: 'multiply', description: "Can you solve these multiplication puzzles?" };
    if (level < 8) return { type: 'divide', description: "Now for some division. The answer will be a whole number." };
    
    // Levels 9-25: Order of Operations (PEMDAS/BODMAS)
    if (level < 25) return { type: 'equation', description: "Think about the order of operations!" };

    // Levels 26-50: Algebraic thinking with "fill-in-the-blank"
    return { type: 'fill-blank', description: "Solve for the blank. A taste of algebra!" };
}

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to convert a number to an array of its digits
function toDigits(n: number): number[] {
    if (n < 0) return []; // Or handle negative numbers as needed
    if (n === 0) return [0];
    return String(n).split('').map(Number);
}

// Helper to create a Tile array from an equation array
const toTiles = (equation: TileValue[], lockCondition: (val: TileValue) => boolean): Tile[] => {
    return equation.map(value => ({
        value,
        isLocked: lockCondition(value),
    }));
};

/**
 * Evaluates an array of atomic tiles based on PEMDAS rules.
 * e.g., [2, '+', 3, '*', 4] -> 14
 */
function evaluate(tiles: (TileValue)[]): number {
    const s = tiles.join('');
    // This is a safe use of eval because we are only ever passing it a string
    // constructed from numbers and basic operators from our own code.
    try {
        // eslint-disable-next-line no-eval
        return eval(s);
    } catch (e) {
        return NaN; // Return NaN if the expression is invalid
    }
}

/**
 * Generates a puzzle ensuring there is only ONE valid swap.
 * This is the new core engine for puzzle creation.
 */
export const generatePuzzle = (level: number): MathPuzzle => {
    let retryCount = 0;
    
    // This loop will continue until a valid puzzle with a unique solution is found.
    while (true) {
        if (retryCount++ > 200) { // Safety break to prevent truly infinite loops
            // Fallback to a very simple puzzle if generation is too complex/slow
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
        const isBlankPuzzle = config.type === 'fill-blank';

        // 1. Create a valid, correct equation based on level config
        if (config.type === 'add') {
            const a = (level > 10) ? getRandom(10, 20) : getRandom(1, 9);
            const b = getRandom(1, 9);
            equationTiles = [...toDigits(a), '+', ...toDigits(b), '=', ...toDigits(a + b)];
        } else if (config.type === 'subtract') {
            const a = (level > 20) ? getRandom(10, 20) : getRandom(5, 9);
            const b = getRandom(1, a - 1);
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
            if (!Number.isInteger(result) || result < 0 || result > 99) continue;
            equationTiles = [...toDigits(a), op1, ...toDigits(b), op2, ...toDigits(c), '=', ...toDigits(result)];
        } else if (isBlankPuzzle) {
            const a = getRandom(2, 9);
            const b = getRandom(2, 9);
            const op = ['*', '+'][level % 2];
            const res = op === '*' ? a * b : a + b;
            
            const blankTarget = [a, b, res][level % 3];
            const blankIsResult = blankTarget === res;
            
            let tempEquation: TileValue[] = [];
            if(blankTarget === a) tempEquation = [null, op, ...toDigits(b), '=', ...toDigits(res)];
            else if(blankTarget === b) tempEquation = [...toDigits(a), op, null, '=', ...toDigits(res)];
            else tempEquation = [...toDigits(a), op, ...toDigits(b), '=', ...(blankIsResult && res > 9 ? [null, null] : [null])];
            equationTiles = tempEquation;
        }

        if (equationTiles.length === 0) continue;

        const numberIndices = equationTiles
            .map((tile, i) => (typeof tile === 'number' || tile === null) ? i : -1)
            .filter(i => i !== -1);

        if (numberIndices.length < 2) continue;

        // 2. Find a single, valid swap that creates a broken equation
        const possibleSwaps = [];
        for (let i = 0; i < numberIndices.length; i++) {
            for (let j = i + 1; j < numberIndices.length; j++) {
                const idx1 = numberIndices[i];
                const idx2 = numberIndices[j];

                const tempBoard = [...equationTiles];
                [tempBoard[idx1], tempBoard[idx2]] = [tempBoard[idx2], tempBoard[idx1]];
                
                const [leftSide, rightSide] = tempBoard.join('').split('=');
                if (leftSide.includes('null') || rightSide.includes('null')) continue;

                if (String(evaluate(leftSide.split('').map(c => isNaN(parseInt(c)) ? c : parseInt(c)))) === rightSide) {
                    continue; // This swap results in a correct equation, so it's not a puzzle
                }
                possibleSwaps.push([idx1, idx2]);
            }
        }

        if (possibleSwaps.length === 0 && !isBlankPuzzle) continue;
        
        let scrambledBoard: Tile[], swappedIndices: [number, number];
        const scrambledTiles = [...equationTiles];

        if (isBlankPuzzle) {
             const blankIndices = equationTiles.map((t, i) => t === null ? i : -1).filter(i => i !== -1);
             const correctDigits = toDigits(evaluate(equationTiles.join('').replace(/null/g, '0').split('=')[0]));
             
             if (blankIndices.length !== correctDigits.length) continue;

             const otherIndices = numberIndices.filter(i => !blankIndices.includes(i));
             if (otherIndices.length === 0) continue;

             const swapFromIndex = otherIndices[retryCount % otherIndices.length];
             const swapFromDigit = scrambledTiles[swapFromIndex];

             scrambledTiles[blankIndices[0]] = swapFromDigit;
             scrambledTiles[swapFromIndex] = correctDigits[0];
             swappedIndices = [blankIndices[0], swapFromIndex].sort((a,b) => a - b) as [number, number];

        } else {
             swappedIndices = possibleSwaps[retryCount % possibleSwaps.length];
            [scrambledTiles[swappedIndices[0]], scrambledTiles[swappedIndices[1]]] = [scrambledTiles[swappedIndices[1]], scrambledTiles[swappedIndices[0]]];
        }

        scrambledBoard = toTiles(scrambledTiles, (v) => typeof v === 'string' || v === null);
        
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
                 if(left.includes('null') || right.includes('null')) continue;
                 
                 if (String(evaluate(left.split('').map(c => isNaN(parseInt(c)) ? c : parseInt(c)))) === right) {
                    validSolutions++;
                 }
            }
        }
        
        if (validSolutions === 1) {
            return {
                id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
                board: scrambledBoard,
                swappedIndices: swappedIndices.sort((a, b) => a - b) as [number, number],
                correctSolution: equationTiles,
            };
        }
        // If no unique solution found, the loop continues and tries again.
    }
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
};
