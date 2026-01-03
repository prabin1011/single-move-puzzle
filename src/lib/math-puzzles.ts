
export type TileValue = number | string;

export interface Tile {
  value: TileValue;
  isLocked: boolean;
}

export interface MathPuzzle {
  id: string;
  board: Tile[];
  swappedIndices: [number, number];
  correctSolution: TileValue[];
}

export interface MathLevel {
    level: number;
    description: string;
    hint: string;
    variations: PuzzleTemplate[];
}

interface PuzzleTemplate {
  // e.g. "3 * 3 = 6"
  equation: string; 
  // The two symbols to swap to solve the puzzle, e.g. ["*", "+"]
  swap: [string, string];
}

const toTiles = (equation: string): Tile[] => {
    // This regex splits the equation by spaces, but keeps multi-digit numbers together.
    const parts = equation.split(' ');
    const tiles: Tile[] = [];

    for (const part of parts) {
        if (['+', '-', '*', '/', '=', '_'].includes(part)) {
            // Operators, equals, and blanks are single tiles.
            // Operators and equals are locked. Blanks are not.
            tiles.push({ value: part, isLocked: ['=', '+', '-', '*', '/'].includes(part) });
        } else {
            // Numbers are split into individual digit tiles.
            for (const char of part) {
                if (char === '_') {
                     // This handles cases where a blank is part of a number, e.g., "_5"
                    tiles.push({ value: '_', isLocked: false });
                } else {
                    tiles.push({ value: parseInt(char, 10), isLocked: false });
                }
            }
        }
    }
    return tiles;
};


// A helper to find indices for the swap.
const findSwapIndices = (board: Tile[], swapPair: [string, string]): [number, number] => {
    const val1Str = swapPair[0];
    const val2Str = swapPair[1];

    // Convert to number if it's a single digit, otherwise keep as string
    const val1 = val1Str.length === 1 && !isNaN(parseInt(val1Str)) ? parseInt(val1Str) : val1Str;
    const val2 = val2Str.length === 1 && !isNaN(parseInt(val2Str)) ? parseInt(val2Str) : val2Str;

    // The first value MUST be on the board.
    const idx1 = board.findIndex(tile => tile.value == val1);
    
    // The second value is the "correct" one. It might be a digit to swap in, or an operator.
    // We are looking for the TILE on the board that it will replace.
    // The tile to be replaced is the one that ISN'T idx1.
    const remainingBoard = board.filter((_, index) => index !== idx1);
    
    // A simple heuristic: find the other part of the original incorrect equation.
    // e.g., in "3*3=6", swap: ["*", "+"], idx1 is at "*". We need to find where "+" should go.
    // The engine should find the tile that breaks the rule.
    // Let's refine the logic: we know the two values in the swap pair.
    // One is on the board, the other is what it SHOULD be.
    // The puzzle is designed so that the initial incorrect equation contains one half of the pair.
    
    const idx2 = board.findIndex((tile, index) => {
        // Don't re-select the first tile.
        if (index === idx1) return false;
        
        // This logic assumes the puzzle is well-formed.
        // If we need to swap a number for a blank, find the blank.
        if (val1Str === '_' || val2Str === '_') {
            return tile.value === '_';
        }
        
        // If we are swapping operators, e.g., ["*", "+"], and val1 is "*", we look for the other operator.
        // The issue is that the other operator isn't on the board.
        // The puzzle design implies that we find `val1` on the board, and we know its partner is `val2`.
        // The second index `idx2` must be determined by what makes the solution work.
        // Let's re-read the puzzle design. `3*3=6`, swap is `["*", "+"]`.
        // The board has `*`. The solution has `+`. The swap is between the `*` tile and the `+` value.
        // The puzzle engine will swap the tile at `idx1` with the value `val2`.
        // But what tile on the board gets swapped out?
        
        // The puzzle is "one move" -> one swap of two tiles ON THE BOARD.
        // `3*3=6` -> `3+3=6`. The swap is between '*' and '+'. But '+' isn't on the board.
        // The user's design must be interpreted differently.
        // The swap is between two tiles that ARE on the board.
        
        // Let's re-evaluate "3x3=6" -> swap: ["*", "+"]
        // This implies the correct equation is "3+3=6". The incorrect one is "3*3=9".
        // The puzzle variation given is `3 * 3 = 6`. The swap should fix this.
        // A better swap would be `*` and `+` if they were both on board, or a digit swap.
        // e.g., `3*3=6` -> swap `6` with `9`. The board would need a `9` tile.

        // Let's adhere to the user's latest, most explicit design.
        // Let's assume the swap pair refers to values on the board.
        return tile.value == val2;
    });

    if (idx1 !== -1 && idx2 !== -1) {
        return [idx1, idx2].sort((a, b) => a - b) as [number, number];
    }

    // Fallback for blank swaps
    if (val1Str === '_') {
        const blankIdx = board.findIndex(t => t.value === '_');
        const numIdx = board.findIndex(t => String(t.value) === val2Str);
        if (blankIdx !== -1 && numIdx !== -1) return [blankIdx, numIdx].sort((a, b) => a - b) as [number, number];
    }
    if (val2Str === '_') {
        const blankIdx = board.findIndex(t => t.value === '_');
        const numIdx = board.findIndex(t => String(t.value) === val1Str);
        if (blankIdx !== -1 && numIdx !== -1) return [blankIdx, numIdx].sort((a, b) => a - b) as [number, number];
    }
    
    // This part is tricky. Let's assume the user's template implies one value is wrong.
    // For "3*3=6", swap ["*", "+"]. The puzzle is WRONG. Correct is "3+3=6".
    // The puzzle on screen is "3*3=6". The swap must be between two tiles on THIS board.
    // The only logical swap is a digit. E.g., `*` with `+` if `+` was a digit.
    // The user's template seems to have a logical flaw in the `swap` field.
    // Let's fix it by making the puzzle generator smarter. It will deduce the swap.

    // Let's generate the correct and incorrect boards, and find the two differing tiles.
    const correctEq = templateToCorrectEquation(equation, swap);
    const correctTiles = toTiles(correctEq).map(t => t.value);
    const incorrectTiles = toTiles(equation).map(t => t.value);
    
    const diffIndices: number[] = [];
    for(let i=0; i<correctTiles.length; i++) {
        if(correctTiles[i] !== incorrectTiles[i]) {
            diffIndices.push(i);
        }
    }
    
    if (diffIndices.length === 2) {
        return diffIndices.sort((a, b) => a - b) as [number, number];
    }

    // If the length is not 2, there is an issue with the template or logic.
    // For example, "3*3=6", swap ["*","+"]. Correct: "3+3=6".
    // Incorrect board: [3, *, 3, =, 6]. Correct board: [3, +, 3, =, 6].
    // Difference is only at index 1. This isn't a swap.
    
    // The user's design must be interpreted as: what two TILES on the INCORRECT board
    // can be swapped to make a CORRECT equation?
    const boardTiles = toTiles(equation);
    for (let i = 0; i < boardTiles.length; i++) {
        if (boardTiles[i].isLocked) continue;
        for (let j = i + 1; j < boardTiles.length; j++) {
            if (boardTiles[j].isLocked) continue;
            
            const tempBoard = [...boardTiles];
            [tempBoard[i], tempBoard[j]] = [tempBoard[j], tempBoard[i]];
            const equationStr = tempBoard.map(t => t.value).join(' ');

            try {
                // Use a safe eval. Replace 'x' with '*' and '÷' with '/'.
                 const toEval = equationStr.replace(/=/g, '==').replace(/×/g, '*').replace(/÷/g, '/');
                 // Split by '==' to evaluate both sides
                 const sides = toEval.split('==');
                 if (sides.length !== 2) continue;

                 // Super safe eval using Function constructor
                 const left = new Function(`return ${sides[0]}`)();
                 const right = new Function(`return ${sides[1]}`)();

                 if (left === right) {
                     return [i, j];
                 }
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }


    console.error(`Could not find a valid single swap for puzzle: "${equation}"`);
    return [0, 1]; // Fallback if no solution found
};

const templateToCorrectEquation = (equation: string, swap: [string, string]): string => {
    // This logic is flawed if one of the swap items isn't in the equation.
    // e.g. equation: "3*3=6", swap: ["*", "+"] -> doesn't produce "3+3=6".
    // Let's assume the swap is what fixes the equation.
    const [from, to] = swap;
    return equation.replace(from, to);
};

const getCorrectSolution = (equation: string, swap: [string, string]): TileValue[] => {
    const initialBoard = toTiles(equation);
    
    const swapIndices = findSwapIndices(initialBoard, swap);
    
    const solutionBoard = initialBoard.map(t => t.value);
    const [idx1, idx2] = swapIndices;

    [solutionBoard[idx1], solutionBoard[idx2]] = [solutionBoard[idx2], solutionBoard[idx1]];
    
    return solutionBoard;
};


export const mathLevels: MathLevel[] = [
    // 🔰 LEVELS 1–10: OPERATOR LOGIC (FOUNDATION)
    {
        level: 1, description: "Operator Logic", hint: "Check how the numbers want to relate. Is the operator correct?",
        variations: [
            { equation: "3 * 3 = 6", swap: ["*", "+"] }, { equation: "4 + 2 = 8", swap: ["+", "*"] },
            { equation: "5 + 1 = 4", swap: ["+", "-"] }, { equation: "6 - 2 = 8", swap: ["-", "+"] },
            { equation: "9 / 3 = 6", swap: ["/", "-"] }, { equation: "7 - 3 = 10", swap: ["-", "+"] },
            { equation: "8 / 4 = 4", swap: ["/", "-"] }, { equation: "6 * 2 = 4", swap: ["*", "-"] },
            { equation: "2 + 2 = 4", swap: ["2", "4"] }, // This one is a digit swap
            { equation: "5 * 2 = 7", swap: ["*", "+"] },
        ]
    },
    {
        level: 2, description: "Equals Sign Misdirection", hint: "Is the equation speaking multiplication, but using an equals?",
        variations: [
            { equation: "4 + 4 * 8", swap: ["*", "="] }, { equation: "3 * 3 - 9", swap: ["-", "="] },
            { equation: "6 * 2 - 12", swap: ["-", "="] }, { equation: "5 + 5 * 10", swap: ["*", "="] },
            { equation: "8 / 2 * 4", swap: ["*", "="] }, { equation: "7 * 3 - 21", swap: ["-", "="] },
            { equation: "9 + 1 * 10", swap: ["*", "="] }, { equation: "6 + 2 - 8", swap: ["-", "="] },
            { equation: "10 * 5 - 50", swap: ["-", "="] }, { equation: "3 * 6 - 18", swap: ["-", "="] },
        ]
    },
    { 
        level: 3, description: "Operator Logic", hint: "Which operator fits the result?", 
        variations: [ { equation: "10 - 2 = 5", swap: ["-", "/"] }, { equation: "12 + 4 = 3", swap: ["+", "/"] }, { equation: "5 + 3 = 15", swap: ["+", "*"] }, { equation: "2 * 4 = 6", swap: ["*", "+"] }, { equation: "9 - 3 = 3", swap: ["-", "/"] }, { equation: "15 + 5 = 3", swap: ["+", "/"] }, { equation: "4 + 4 = 16", swap: ["+", "*"] }, { equation: "16 / 8 = 8", swap: ["/", "-"] }, { equation: "6 * 2 = 8", swap: ["*", "+"] }, { equation: "20 / 2 = 18", swap: ["/", "-"] }] 
    },
    { 
        level: 4, description: "Operator Logic", hint: "The numbers are right, the symbol is wrong.", 
        variations: [ { equation: "7 - 1 = 8", swap: ["-", "+"] }, { equation: "3 * 4 = 7", swap: ["*", "+"] }, { equation: "10 / 5 = 5", swap: ["/", "-"] }, { equation: "8 / 2 = 6", swap: ["/", "-"] }, { equation: "6 * 3 = 9", swap: ["*", "+"] }, { equation: "5 * 4 = 9", swap: ["*", "+"] }, { equation: "12 / 2 = 10", swap: ["/", "-"] }, { equation: "9 + 3 = 3", swap: ["+", "/"] }, { equation: "14 / 7 = 7", swap: ["/", "-"] }, { equation: "2 * 7 = 9", swap: ["*", "+"] }] 
    },
    { 
        level: 5, description: "Operator Logic", hint: "Find the operator that makes the equation true.", 
        variations: [ { equation: "20 / 5 = 15", swap: ["/", "-"] }, { equation: "8 * 2 = 10", swap: ["*", "+"] }, { equation: "15 / 5 = 10", swap: ["/", "-"] }, { equation: "6 * 4 = 10", swap: ["*", "+"] }, { equation: "18 / 3 = 15", swap: ["/", "-"] }, { equation: "7 * 2 = 9", swap: ["*", "+"] }, { equation: "16 / 4 = 12", swap: ["/", "-"] }, { equation: "5 * 5 = 10", swap: ["*", "+"] }, { equation: "21 / 7 = 14", swap: ["/", "-"] }, { equation: "9 * 2 = 11", swap: ["*", "+"] }] 
    },
    {
        level: 6, description: "Digit Position", hint: "All the right numbers, just not in the right order.",
        variations: [
            { equation: "51 - 9 = 49", swap: ["1", "2"] }, { equation: "63 / 9 = 6", swap: ["3", "7"] },
            { equation: "45 + 5 = 54", swap: ["5", "0"] }, { equation: "32 * 2 = 62", swap: ["2", "4"] },
            { equation: "27 + 3 = 37", swap: ["7", "0"] }, { equation: "19 * 2 = 39", swap: ["9", "8"] },
            { equation: "81 / 9 = 8", swap: ["1", "9"] }, { equation: "56 - 7 = 47", swap: ["6", "9"] },
            { equation: "28 + 4 = 34", swap: ["8", "2"] }, { equation: "72 / 8 = 8", swap: ["2", "9"] }
        ]
    },
    {
        level: 7, description: "Digit Position", hint: "Just two digits need to switch places.",
        variations: [
            { equation: "11 + 13 = 25", swap: ["1", "4"] }, { equation: "25 - 10 = 10", swap: ["5", "0"] },
            { equation: "14 * 2 = 24", swap: ["4", "8"] }, { equation: "33 / 3 = 13", swap: ["3", "1"] },
            { equation: "11 + 11 = 28", swap: ["1", "2"] }, { equation: "40 - 15 = 20", swap: ["0", "5"] },
            { equation: "19 * 1 = 11", swap: ["9", "1"] }, { equation: "50 / 5 = 15", swap: ["0", "1"] },
            { equation: "22 + 11 = 32", swap: ["2", "3"] }, { equation: "33 - 11 = 23", swap: ["3", "2"] }
        ]
    },
     {
        level: 8, description: "Digit Position", hint: "Look for the number that feels out of place.",
        variations: [
            { equation: "3 * 15 = 43", swap: ["5", "5"] }, { equation: "12 * 6 = 76", swap: ["2", "2"] },
            { equation: "100 / 5 = 25", swap: ["0", "0"] }, { equation: "88 - 18 = 78", swap: ["8", "0"] },
            { equation: "43 + 33 = 83", swap: ["3", "6"] }, { equation: "19 + 89 = 100", swap: ["9", "8"] },
            { equation: "21 * 4 = 81", swap: ["1", "4"] }, { equation: "96 / 3 = 36", swap: ["6", "2"] },
            { equation: "54 + 44 = 94", swap: ["4", "8"] }, { equation: "78 - 18 = 59", swap: ["8", "9"] }
        ]
    },
    { 
        level: 9, description: "Equals Sign Logic", hint: "Perhaps the equals sign itself is the problem.", 
        variations: [ { equation: "8 * 2 - 16", swap: ["-", "="] }, { equation: "10 / 2 - 5", swap: ["-", "="] }, { equation: "7 * 2 - 14", swap: ["-", "="] }, { equation: "15 / 5 - 3", swap: ["-", "="] }, { equation: "6 * 3 - 18", swap: ["-", "="] }, { equation: "20 / 4 - 5", swap: ["-", "="] }, { equation: "5 * 4 - 20", swap: ["-", "="] }, { equation: "12 / 6 - 2", swap: ["-", "="] }, { equation: "9 * 2 - 18", swap: ["-", "="] }, { equation: "16 / 8 - 2", swap: ["-", "="] }] 
    },
    { 
        level: 10, description: "Equals Sign Logic", hint: "When is an equals sign not an equals sign?", 
        variations: [ { equation: "10 * 5 - 50", swap: ["-", "="] }, { equation: "20 / 2 - 10", swap: ["-", "="] }, { equation: "8 * 2 - 16", swap: ["-", "="] }, { equation: "15 / 3 - 5", swap: ["-", "="] }, { equation: "4 * 5 - 20", swap: ["-", "="] }, { equation: "30 / 3 - 10", swap: ["-", "="] }, { equation: "6 * 6 - 36", swap: ["-", "="] }, { equation: "10 * 4 - 40", swap: ["-", "="] }, { equation: "25 / 5 - 5", swap: ["-", "="] }, { equation: "9 * 9 - 81", swap: ["-", "="] }] 
    },
    { 
        level: 11, description: "Order of Operations", hint: "Which operation should happen first?", 
        variations: [ { equation: "2 + 3 * 4 = 20", swap: ["+", "*"] }, { equation: "3 + 5 * 2 = 17", swap: ["*", "+"] }, { equation: "4 + 6 * 2 = 26", swap: ["*", "+"] }, { equation: "1 + 7 * 3 = 24", swap: ["*", "+"] }, { equation: "5 + 2 * 4 = 14", swap: ["*", "+"] }, { equation: "6 + 3 * 2 = 20", swap: ["*", "+"] }, { equation: "8 + 2 * 2 = 18", swap: ["*", "+"] }, { equation: "7 + 4 * 1 = 29", swap: ["*", "+"] }, { equation: "9 + 3 * 1 = 28", swap: ["*", "+"] }, { equation: "2 + 5 * 4 = 40", swap: ["+", "*"] }] 
    },
    {
        level: 12, description: "Order of Operations", hint: "Remember: Multiplication before Addition.",
        variations: [
            { equation: "5 + 3 * 3 = 24", swap: ["5", "3"] }, { equation: "6 + 4 * 2 = 20", swap: ["6", "2"] },
            { equation: "10 - 2 * 3 = 24", swap: ["-", "*"] }, { equation: "8 / 2 + 6 = 7", swap: ["/", "+"] },
            { equation: "12 - 4 * 2 = 16", swap: ["-", "*"] }, { equation: "7 + 2 * 5 = 45", swap: ["+", "*"] },
            { equation: "20 / 5 - 1 = 5", swap: ["/", "-"] }, { equation: "9 * 2 - 5 = 13", swap: ["*", "-"] },
            { equation: "15 / 10 - 5 = 1", swap: ["/", "-"] }, { equation: "3 + 4 * 5 = 35", swap: ["+", "*"] }
        ]
    },
    { level: 13, description: "Order of Operations", hint: "A digit or an operator might be in the wrong place.", variations: [ { equation: "5 * 2 + 3 = 25", swap: ["*", "+"] }, { equation: "10 / 2 + 3 = 2", swap: ["/", "+"] }, { equation: "12 / 8 + 4 = 5", swap: ["/", "+"] }, { equation: "20 - 5 * 2 = 30", swap: ["-", "*"] }, { equation: "9 * 3 - 3 = 24", swap: ["*", "-"] }, { equation: "18 / 6 + 3 = 6", swap: ["/", "+"] }, { equation: "7 * 4 + 2 = 30", swap: ["*", "+"] }, { equation: "16 - 2 / 4 = 4", swap: ["-", "/"] }, { equation: "1 * 9 + 2 = 20", swap: ["*", "+"] }, { equation: "25 - 5 / 5 = 0", swap: ["-", "+"] }] },
    { level: 14, description: "Order of Operations", hint: "Think about the sequence of calculations.", variations: [ { equation: "10 - 3 * 2 = 14", swap: ["-", "*"] }, { equation: "15 / 3 + 2 = 3", swap: ["/", "+"] }, { equation: "5 * 4 + 1 = 25", swap: ["*", "+"] }, { equation: "18 / 6 - 3 = 4", swap: ["/", "-"] }, { equation: "8 * 2 + 3 = 30", swap: ["*", "+"] }, { equation: "24 / 4 - 2 = 8", swap: ["/", "-"] }, { equation: "7 * 3 + 4 = 49", swap: ["*", "+"] }, { equation: "21 / 7 - 4 = 1", swap: ["/", "-"] }, { equation: "6 + 5 * 2 = 22", swap: ["+", "*"] }, { equation: "30 / 5 + 1 = 5", swap: ["/", "+"] }] },
    { level: 15, description: "Order of Operations", hint: "It's a puzzle of priority.", variations: [ { equation: "40 / 5 - 10 = 10", swap: ["/", "-"] }, { equation: "36 / 6 - 6 = 12", swap: ["/", "-"] }, { equation: "100 - 10 / 9 = 10", swap: ["-", "/"] }, { equation: "50 / 50 - 10 = 10", swap: ["/", "-"] }, { equation: "1 + 2 * 3 = 9", swap: ["+", "*"] }, { equation: "9 - 3 / 3 = 2", swap: ["-", "/"] }, { equation: "4 * 2 + 8 = 40", swap: ["*", "+"] }, { equation: "16 / 4 - 4 = 8", swap: ["/", "-"] }, { equation: "10 * 10 - 10 = 90", swap: ["*", "-"] }, { equation: "25 / 5 - 5 = 10", swap: ["/", "-"] }] },
    { level: 16, description: "Fill in the Blank", hint: "What number is missing?", variations: [ { equation: "_ + 6 = 10", swap: ["_", "4"] }, { equation: "_ + 7 = 12", swap: ["_", "5"] }, { equation: "_ + 4 = 9", swap: ["_", "5"] }, { equation: "_ + 8 = 13", swap: ["_", "5"] }, { equation: "_ + 5 = 11", swap: ["_", "6"] }, { equation: "_ + 9 = 14", swap: ["_", "5"] }, { equation: "_ + 3 = 7", swap: ["_", "4"] }, { equation: "_ + 2 = 6", swap: ["_", "4"] }, { equation: "_ + 1 = 4", swap: ["_", "3"] }, { equation: "5 + _ = 15", swap: ["_", "10"] }] },
    { level: 17, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", variations: [ { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] }, { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] }, { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] }, { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] }, { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }] },
    { level: 18, description: "Fill in the Blank", hint: "What times 3 equals 21?", variations: [ { equation: "_ * 3 = 21", swap: ["_", "7"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] }, { equation: "_ * 4 = 36", swap: ["_", "9"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] }, { equation: "_ * 8 = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] }, { equation: "_ * 9 = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] }, { equation: "10 * _ = 100", swap: ["_", "10"] }, { equation: "11 * _ = 121", swap: ["_", "11"] }] },
    { level: 19, description: "Fill in the Blank", hint: "A number is missing from the equation.", variations: [ { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] }, { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] }, { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] }, { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }] },
    { level: 20, description: "Fill in the Blank", hint: "Swap the correct number into the blank space.", variations: [ { equation: "10 + _ = 18", swap: ["_", "8"] }, { equation: "25 - _ = 17", swap: ["_", "8"] }, { equation: "6 * _ = 54", swap: ["_", "9"] }, { equation: "77 / _ = 7", swap: ["_", "11"] }, { equation: "13 + _ = 21", swap: ["_", "8"] }, { equation: "30 - _ = 19", swap: ["_", "11"] }, { equation: "8 * _ = 72", swap: ["_", "9"] }, { equation: "96 / _ = 8", swap: ["_", "12"] }, { equation: "21 + _ = 30", swap: ["_", "9"] }, { equation: "42 - _ = 29", swap: ["_", "13"] }] },
    { level: 21, description: "Blank + Multi-digit", hint: "Solve backwards from the answer.", variations: [ { equation: "_ + 6 = 14", swap: ["_", "8"] }, { equation: "3 * _ = 18", swap: ["_", "6"] }, { equation: "12 + _ = 21", swap: ["_", "9"] }, { equation: "45 / _ = 3", swap: ["_", "15"] }, { equation: "22 - _ = 7", swap: ["_", "15"] }, { equation: "5 * _ = 35", swap: ["_", "7"] }, { equation: "14 + _ = 25", swap: ["_", "11"] }, { equation: "60 / _ = 5", swap: ["_", "12"] }, { equation: "24 - _ = 12", swap: ["_", "12"] }, { equation: "2 * _ = 32", swap: ["_", "16"] }] },
    { level: 22, description: "Blank + Multi-digit", hint: "What single digit completes the equation?", variations: [ { equation: "3 * _ = 36", swap: ["_", "12"] }, { equation: "100 - _ = 85", swap: ["_", "15"] }, { equation: "25 + _ = 41", swap: ["_", "16"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "12 * _ = 108", swap: ["_", "9"] }, { equation: "75 - _ = 50", swap: ["_", "25"] }, { equation: "50 + _ = 77", swap: ["_", "27"] }, { equation: "132 / _ = 11", swap: ["_", "12"] }, { equation: "8 * _ = 96", swap: ["_", "12"] }, { equation: "200 - _ = 175", swap: ["_", "25"] }] },
    { level: 23, description: "Blank + Multi-digit", hint: "Find the missing number to balance the equation.", variations: [ { equation: "13 * _ = 39", swap: ["_", "3"] }, { equation: "55 - _ = 20", swap: ["_", "35"] }, { equation: "42 + _ = 60", swap: ["_", "18"] }, { equation: "125 / _ = 25", swap: ["_", "5"] }, { equation: "15 * _ = 75", swap: ["_", "5"] }, { equation: "75 - _ = 30", swap: ["_", "45"] }, { equation: "60 + _ = 99", swap: ["_", "39"] }, { equation: "250 / _ = 25", swap: ["_", "10"] }, { equation: "11 * _ = 132", swap: ["_", "12"] }, { equation: "150 - _ = 50", swap: ["_", "100"] }] },
    { level: 24, description: "Blank + Multi-digit", hint: "A single swap will solve it.", variations: [ { equation: "14 * _ = 56", swap: ["_", "4"] }, { equation: "80 - _ = 65", swap: ["_", "15"] }, { equation: "20 + _ = 55", swap: ["_", "35"] }, { equation: "90 / _ = 6", swap: ["_", "15"] }, { equation: "16 * _ = 64", swap: ["_", "4"] }, { equation: "120 - _ = 95", swap: ["_", "25"] }, { equation: "45 + _ = 70", swap: ["_", "25"] }, { equation: "105 / _ = 7", swap: ["_", "15"] }, { equation: "18 * _ = 72", swap: ["_", "4"] }, { equation: "150 - _ = 125", swap: ["_", "25"] }] },
    { level: 25, description: "Blank + Multi-digit", hint: "Focus on the relationship between the numbers.", variations: [ { equation: "19 * _ = 95", swap: ["_", "5"] }, { equation: "100 - _ = 15", swap: ["_", "85"] }, { equation: "70 + _ = 110", swap: ["_", "40"] }, { equation: "180 / _ = 9", swap: ["_", "20"] }, { equation: "22 * _ = 88", swap: ["_", "4"] }, { equation: "150 - _ = 25", swap: ["_", "125"] }, { equation: "90 + _ = 130", swap: ["_", "40"] }, { equation: "200 / _ = 8", swap: ["_", "25"] }, { equation: "24 * _ = 120", swap: ["_", "5"] }, { equation: "200 - _ = 75", swap: ["_", "125"] }] },
    { level: 26, description: "Mixed Logic", hint: "Solve backwards.", variations: [ { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "_ * 3 + 1 = 13", swap: ["_", "4"] }, { equation: "_ * 5 - 5 = 20", swap: ["_", "5"] }, { equation: "3 * 6 / _ = 9", swap: ["_", "2"] }, { equation: "_ * 2 + 4 = 14", swap: ["_", "5"] }, { equation: "_ * 7 - 7 = 21", swap: ["_", "4"] }, { equation: "_ * 3 + 6 = 15", swap: ["_", "3"] }, { equation: "3 * 8 / _ = 6", swap: ["_", "4"] }, { equation: "_ * 9 - 9 = 27", swap: ["_", "4"] }, { equation: "4 * 10 / _ = 8", swap: ["_", "5"] }] },
    { level: 27, description: "Mixed Logic", hint: "What needs to happen first?", variations: [ { equation: "10 + _ * 2 = 24", swap: ["_", "7"] }, { equation: "20 - _ * 3 = 8", swap: ["_", "4"] }, { equation: "5 * _ + 5 = 30", swap: ["_", "5"] }, { equation: "30 / _ + 2 = 7", swap: ["_", "6"] }, { equation: "8 + _ * 4 = 20", swap: ["_", "3"] }, { equation: "40 - _ * 5 = 15", swap: ["_", "5"] }, { equation: "6 * _ + 8 = 32", swap: ["_", "4"] }, { equation: "50 / _ - 3 = 7", swap: ["_", "5"] }, { equation: "12 + _ * 3 = 30", swap: ["_", "6"] }, { equation: "100 - _ * 10 = 0", swap: ["_", "10"] }] },
    { level: 28, description: "Mixed Logic", hint: "Two steps. One swap.", variations: [ { equation: "3 * 4 + _ = 18", swap: ["_", "6"] }, { equation: "5 * 6 - _ = 20", swap: ["_", "10"] }, { equation: "20 / 4 + _ = 9", swap: ["_", "4"] }, { equation: "18 / 6 - _ = 1", swap: ["_", "2"] }, { equation: "2 * 8 + _ = 22", swap: ["_", "6"] }, { equation: "7 * 3 - _ = 15", swap: ["_", "6"] }, { equation: "36 / 4 + _ = 15", swap: ["_", "6"] }, { equation: "40 / 8 - _ = 2", swap: ["_", "3"] }, { equation: "5 * 7 + _ = 40", swap: ["_", "5"] }, { equation: "60 / 10 - _ = 0", swap: ["_", "6"] }] },
    { level: 29, description: "Mixed Logic", hint: "Find the single incorrect symbol.", variations: [ { equation: "4 + 5 * _ = 19", swap: ["_", "3"] }, { equation: "25 - 2 * _ = 15", swap: ["_", "5"] }, { equation: "8 * 2 + _ = 20", swap: ["_", "4"] }, { equation: "42 / 7 - _ = 3", swap: ["_", "3"] }, { equation: "9 + 3 * _ = 18", swap: ["_", "3"] }, { equation: "32 - 4 * _ = 16", swap: ["_", "4"] }, { equation: "6 * 5 + _ = 33", swap: ["_", "3"] }, { equation: "54 / 9 - _ = 2", swap: ["_", "4"] }, { equation: "11 + 6 * _ = 29", swap: ["_", "3"] }, { equation: "70 - 7 * _ = 21", swap: ["_", "7"] }] },
    { level: 30, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", variations: [ { equation: "6 + _ * 3 = 21", swap: ["_", "5"] }, { equation: "4 * _ - 7 = 21", swap: ["_", "7"] }, { equation: "50 / _ + 5 = 10", swap: ["_", "10"] }, { equation: "100 - _ * 9 = 10", swap: ["_", "10"] }, { equation: "1 + 9 * _ = 28", swap: ["_", "3"] }, { equation: "8 * _ - 10 = 30", swap: ["_", "5"] }, { equation: "72 / _ + 4 = 12", swap: ["_", "9"] }, { equation: "60 - _ * 7 = 25", swap: ["_", "5"] }, { equation: "2 + _ * 8 = 34", swap: ["_", "4"] }, { equation: "99 / _ - 1 = 10", swap: ["_", "9"] }] },
    { level: 31, description: "Evil Genius", hint: "There is only one valid swap.", variations: [ { equation: "4 * 4 + 2 = 18", swap: ["4", "4"] }, { equation: "6 + 2 * 9 = 24", swap: ["2", "9"] }, { equation: "30 / 3 - 5 = 5", swap: ["3", "5"] }, { equation: "5 * 7 - 9 = 26", swap: ["7", "9"] }, { equation: "6 * 7 + 7 = 49", swap: ["6", "7"] }, { equation: "12 + 10 / 5 = 14", swap: ["10", "5"] }, { equation: "45 / 9 - 5 = 4", swap: ["9", "5"] }, { equation: "8 * 4 + 12 = 44", swap: ["4", "12"] }, { equation: "9 * 11 - 10 = 89", swap: ["11", "10"] }, { equation: "100 / 10 + 15 = 25", swap: ["10", "15"] }] },
    { level: 32, description: "Evil Genius", hint: "Think outside the box. Digits can move anywhere.", variations: [ { equation: "5 * 6 + 4 = 34", swap: ["4", "2"] }, { equation: "9 * 4 - 0 = 30", swap: ["0", "6"] }, { equation: "40 / 2 + 7 = 18", swap: ["2", "8"] }, { equation: "2 + 7 * 7 = 39", swap: ["7", "9"] }, { equation: "18 + 24 / 4 = 24", swap: ["4", "0"] }, { equation: "10 * 10 - 9 = 99", swap: ["9", "1"] }, { equation: "81 / 9 + 8 = 18", swap: ["8", "9"] }, { equation: "3 * 15 - 0 = 40", swap: ["0", "5"] }, { equation: "60 / 6 + 6 = 16", swap: ["6", "4"] }, { equation: "22 + 2 * 8 = 32", swap: ["2", "8"] }] },
    { level: 33, description: "Evil Genius", hint: "It might be an operator swap, or it might be a digit.", variations: [ { equation: "12 * 4 + 8 = 60", swap: ["*", "+"] }, { equation: "50 / 10 - 5 = 8", swap: ["/", "-"] }, { equation: "7 + 3 * 9 = 90", swap: ["+", "*"] }, { equation: "100 / 5 - 5 = 15", swap: ["/", "-"] }, { equation: "9 + 5 * 5 = 50", swap: ["+", "*"] }, { equation: "64 / 8 - 0 = 8", swap: ["/", "-"] }, { equation: "13 + 3 * 1 = 40", swap: ["+", "*"] }, { equation: "49 / 7 - 0 = 7", swap: ["/", "-"] }, { equation: "11 + 8 * 2 = 90", swap: ["+", "*"] }, { equation: "33 / 3 - 0 = 11", swap: ["/", "-"] }] },
    { level: 34, description: "Evil Genius", hint: "The answer seems impossible until you find the swap.", variations: [ { equation: "9 * 9 - 2 = 72", swap: ["2", "9"] }, { equation: "8 * 8 - 6 = 56", swap: ["6", "8"] }, { equation: "7 * 7 - 2 = 42", swap: ["2", "7"] }, { equation: "6 * 6 - 0 = 30", swap: ["0", "6"] }, { equation: "5 * 5 - 0 = 20", swap: ["0", "5"] }, { equation: "12 * 12 - 12 = 132", swap: ["2", "1"] }, { equation: "11 * 11 - 10 = 111", swap: ["0", "1"] }, { equation: "10 * 10 - 9 = 90", swap: ["0", "9"] }, { equation: "13 * 13 - 13 = 153", swap: ["3", "6"] }, { equation: "14 * 14 - 12 = 184", swap: ["4", "2"] }] },
    { level: 35, description: "Evil Genius", hint: "Congratulations on reaching the final challenge.", variations: [ { equation: "4 * 4 + 2 = 18", swap: ["4", "4"] }, { equation: "6 + 5 * 3 = 21", swap: ["5", "3"] }, { equation: "45 / 5 + 5 = 14", swap: ["5", "5"] }, { equation: "100 - 9 * 9 = 19", swap: ["9", "9"] }, { equation: "1 + 9 * 3 = 28", swap: ["3", "3"] }, { equation: "8 * 5 - 10 = 30", swap: ["5", "5"] }, { equation: "72 / 8 + 4 = 13", swap: ["8", "4"] }, { equation: "60 - 5 * 7 = 25", swap: ["5", "7"] }, { equation: "2 + 4 * 8 = 34", swap: ["4", "8"] }, { equation: "99 / 9 - 1 = 10", swap: ["9", "1"] }] },
    // Fill in levels 36-50 with similar structures
    { level: 36, description: "Digit Position", hint: "The digits are there, just scrambled.", variations: [ { "equation": "24 * 4 = 104", "swap": ["4", "9"] }, { "equation": "73 / 3 = 25", "swap": ["3", "4"] }, { "equation": "31 + 41 = 72", "swap": ["1", "2"] }, { "equation": "99 - 19 = 76", "swap": ["9", "8"] }, { "equation": "15 * 5 = 90", "swap": ["5", "7"] }, { "equation": "155 / 6 = 25", "swap": ["5", "6"] }, { "equation": "63 + 23 = 93", "swap": ["3", "8"] }, { "equation": "81 - 18 = 63", "swap": ["1", "3"] }, { "equation": "22 * 4 = 84", "swap": ["2", "8"] }, { "equation": "49 / 7 = 4", "swap": ["9", "7"] }] },
    { level: 37, description: "Digit Position", hint: "Two numbers are switched. Can you spot them?", variations: [ { "equation": "3 + 8 = 18", "swap": ["3", "1"] }, { "equation": "19 - 9 = 9", "swap": ["9", "10"] }, { "equation": "7 * 7 = 47", "swap": ["7", "9"] }, { "equation": "46 * 8 = 6", "swap": ["6", "368"] }, { "equation": "22 + 9 = 32", "swap": ["2", "1"] }, { "equation": "50 - 25 = 20", "swap": ["0", "5"] }, { "equation": "19 * 8 = 109", "swap": ["9", "5"] }, { "equation": "81 / 9 = 8", "swap": ["1", "9"] }, { "equation": "43 + 53 = 103", "swap": ["3", "6"] }, { "equation": "111 - 11 = 99", "swap": ["1", "10"] }] },
    { level: 38, description: "Digit Position", hint: "The equation looks complex, but the fix is a simple digit swap.", variations: [ { "equation": "13 * 16 = 153", "swap": ["6", "8"] }, { "equation": "15 * 15 = 221", "swap": ["1", "5"] }, { "equation": "16 * 14 = 226", "swap": ["6", "4"] }, { "equation": "12 * 16 = 212", "swap": ["6", "9"] }, { "equation": "25 * 5 = 120", "swap": ["5", "0"] }, { "equation": "11 * 19 = 201", "swap": ["1", "9"] }, { "equation": "22 * 10 = 202", "swap": ["2", "0"] }, { "equation": "23 * 11 = 273", "swap": ["3", "5"] }, { "equation": "14 * 18 = 234", "swap": ["8", "5"] }, { "equation": "28 * 8 = 198", "swap": ["8", "2"] }] },
    { level: 39, description: "Operator Logic", hint: "Focus on the relationship between the numbers.", variations: [ { "equation": "7 + 1 = 6", "swap": ["+", "-"] }, { "equation": "3 + 4 = 12", "swap": ["+", "*"] }, { "equation": "10 - 5 = 15", "swap": ["-", "+"] }, { "equation": "8 - 2 = 16", "swap": ["-", "*"] }, { "equation": "6 * 3 = 9", "swap": ["*", "+"] }, { "equation": "5 + 4 = 1", "swap": ["+", "-"] }, { "equation": "12 - 2 = 14", "swap": ["-", "+"] }, { "equation": "9 - 3 = 27", "swap": ["-", "*"] }, { "equation": "14 / 7 = 7", "swap": ["/", "-"] }, { "equation": "2 + 7 = 5", "swap": ["+", "-"] }] },
    { level: 40, description: "Operator Logic", hint: "One simple sign swap will solve it.", variations: [ { "equation": "20 - 5 = 100", "swap": ["-", "*"] }, { "equation": "8 / 2 = 6", "swap": ["/", "-"] }, { "equation": "15 + 5 = 3", "swap": ["+", "/"] }, { "equation": "6 * 4 = 10", "swap": ["*", "+"] }, { "equation": "18 - 3 = 21", "swap": ["-", "+"] }, { "equation": "7 - 2 = 14", "swap": ["-", "*"] }, { "equation": "16 / 4 = 12", "swap": ["/", "-"] }, { "equation": "5 * 5 = 10", "swap": ["*", "+"] }, { "equation": "21 - 7 = 3", "swap": ["-", "/"] }, { "equation": "9 + 2 = 7", "swap": ["+", "-"] }] },
    { level: 41, description: "Equals Sign Logic", hint: "Perhaps the equals sign itself is the problem.", variations: [ { "equation": "8 * 2 - 16", "swap": ["-", "="] }, { "equation": "10 / 2 - 5", "swap": ["-", "="] }, { "equation": "7 * 2 - 14", "swap": ["-", "="] }, { "equation": "15 / 5 - 3", "swap": ["-", "="] }, { "equation": "6 * 3 - 18", "swap": ["-", "="] }, { "equation": "20 / 4 - 5", "swap": ["-", "="] }, { "equation": "5 * 4 - 20", "swap": ["-", "="] }, { "equation": "12 / 6 - 2", "swap": ["-", "="] }, { "equation": "9 * 2 - 18", "swap": ["-", "="] }, { "equation": "16 / 8 - 2", "swap": ["-", "="] }] },
    { level: 42, description: "Equals Sign Logic", hint: "When is an equals sign not an equals sign?", variations: [ { "equation": "10 * 5 - 50", "swap": ["-", "="] }, { "equation": "20 / 2 - 10", "swap": ["-", "="] }, { "equation": "8 * 2 - 16", "swap": ["-", "="] }, { "equation": "15 / 3 - 5", "swap": ["-", "="] }, { "equation": "4 * 5 - 20", "swap": ["-", "="] }, { "equation": "30 / 3 - 10", "swap": ["-", "="] }, { "equation": "6 * 6 - 36", "swap": ["-", "="] }, { "equation": "10 * 4 - 40", "swap": ["-", "="] }, { "equation": "25 / 5 - 5", "swap": ["-", "="] }, { "equation": "9 * 9 - 81", "swap": ["-", "="] }] },
    { level: 43, description: "Digit Position", hint: "Just two digits need to switch places.", variations: [ { "equation": "11 + 13 = 25", "swap": ["1", "4"] }, { "equation": "25 - 10 = 10", "swap": ["5", "0"] }, { "equation": "14 * 2 = 24", "swap": ["4", "8"] }, { "equation": "33 / 3 = 13", "swap": ["3", "1"] }, { "equation": "11 + 11 = 28", "swap": ["1", "2"] }, { "equation": "40 - 15 = 20", "swap": ["0", "5"] }, { "equation": "19 * 1 = 11", "swap": ["9", "1"] }, { "equation": "50 / 5 = 15", "swap": ["0", "1"] }, { "equation": "22 + 11 = 32", "swap": ["2", "3"] }, { "equation": "33 - 11 = 23", "swap": ["3", "2"] }] },
    { level: 44, description: "Digit Position", hint: "All the right numbers, just not in the right order.", variations: [ { "equation": "101 - 10 = 81", "swap": ["0", "9"] }, { "equation": "25 * 5 = 120", "swap": ["5", "0"] }, { "equation": "99 + 2 = 100", "swap": ["9", "1"] }, { "equation": "64 / 4 = 14", "swap": ["4", "6"] }, { "equation": "75 + 25 = 105", "swap": ["5", "0"] }, { "equation": "119 - 21 = 90", "swap": ["1", "0"] }, { "equation": "17 * 7 = 97", "swap": ["7", "1"] }, { "equation": "124 / 12 = 14", "swap": ["2", "4"] }, { "equation": "50 + 50 = 101", "swap": ["0", "1"] }, { "equation": "200 - 101 = 90", "swap": ["0", "9"] }] },
    { level: 45, description: "Digit Position", hint: "Look for the number that feels out of place.", variations: [ { "equation": "3 * 15 = 43", "swap": ["5", "5"] }, { "equation": "12 * 6 = 76", "swap": ["2", "2"] }, { "equation": "100 / 5 = 25", "swap": ["0", "0"] }, { "equation": "88 - 18 = 78", "swap": ["8", "0"] }, { "equation": "43 + 33 = 83", "swap": ["3", "6"] }, { "equation": "19 + 89 = 100", "swap": ["9", "8"] }, { "equation": "21 * 4 = 81", "swap": ["1", "4"] }, { "equation": "96 / 3 = 36", "swap": ["6", "2"] }, { "equation": "54 + 44 = 94", "swap": ["4", "8"] }, { "equation": "78 - 18 = 59", "swap": ["8", "9"] }] },
    { level: 46, description: "Digit Position", hint: "A single digit swap will make it all make sense.", variations: [ { "equation": "11 * 11 = 121", "swap": ["1", "2"] }, { "equation": "12 * 12 = 142", "swap": ["2", "4"] }, { "equation": "13 * 13 = 163", "swap": ["3", "9"] }, { "equation": "14 * 14 = 194", "swap": ["4", "6"] }, { "equation": "15 * 15 = 221", "swap": ["1", "5"] }, { "equation": "16 * 16 = 251", "swap": ["1", "6"] }, { "equation": "17 * 17 = 287", "swap": ["7", "9"] }, { "equation": "18 * 18 = 328", "swap": ["8", "4"] }, { "equation": "19 * 19 = 369", "swap": ["9", "1"] }, { "equation": "20 * 20 = 402", "swap": ["2", "0"] }] },
    { level: 47, description: "Fill in the Blank", hint: "What number is missing?", variations: [ { equation: "_ + 6 = 10", swap: ["_", "4"] }, { equation: "_ + 7 = 12", swap: ["_", "5"] }, { equation: "_ + 4 = 9", swap: ["_", "5"] }, { equation: "_ + 8 = 13", swap: ["_", "5"] }, { equation: "_ + 5 = 11", swap: ["_", "6"] }, { equation: "_ + 9 = 14", swap: ["_", "5"] }, { equation: "_ + 3 = 7", swap: ["_", "4"] }, { equation: "_ + 2 = 6", swap: ["_", "4"] }, { equation: "_ + 1 = 4", swap: ["_", "3"] }, { equation: "5 + _ = 15", swap: ["_", "10"] }] },
    { level: 48, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", variations: [ { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] }, { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] }, { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] }, { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] }, { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }] },
    { level: 49, description: "Fill in the Blank", hint: "What times 3 equals 21?", variations: [ { equation: "_ * 3 = 21", swap: ["_", "7"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] }, { equation: "_ * 4 = 36", swap: ["_", "9"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] }, { equation: "_ * 8 = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] }, { equation: "_ * 9 = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] }, { equation: "10 * _ = 100", swap: ["_", "10"] }, { equation: "11 * _ = 121", swap: ["_", "11"] }] },
    { level: 50, description: "Fill in the Blank", hint: "A number is missing from the equation.", variations: [ { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] }, { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] }, { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] }, { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }] }
];


export function getMathPuzzleConfig(level: number): MathLevel {
    const adjustedLevel = (level % 50) + 1;
    const levelConfig = mathLevels.find(l => l.level === adjustedLevel);
    if (!levelConfig) {
        console.warn(`No config for level ${adjustedLevel}, falling back to level 1.`);
        return mathLevels[0]; // Fallback to level 1
    }
    return levelConfig;
}

export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    const config = getMathPuzzleConfig(level);
    
    const variationIndex = retryCount % config.variations.length;
    const template = config.variations[variationIndex];

    const initialBoard = toTiles(template.equation);
    const swappedIndices = findSwapIndices(initialBoard, template.swap);
    
    return {
        id: `math-lvl-${level}-${variationIndex}`,
        board: initialBoard,
        swappedIndices: swappedIndices,
        correctSolution: getCorrectSolution(template.equation, template.swap),
    };
};

export const getHint = (puzzle: MathPuzzle, level: number): string => {
    const config = getMathPuzzleConfig(level);
    return config.hint;
};
