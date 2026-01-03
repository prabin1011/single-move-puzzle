
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
  equation: string; 
  swap: [string, string];
}

const toTiles = (equation: string): Tile[] => {
    const parts = equation.split(' ');
    const tiles: Tile[] = [];

    for (const part of parts) {
        if (['+', '-', '*', '/', '=', '_'].includes(part)) {
            tiles.push({ value: part, isLocked: ['=', '+', '-', '*', '/'].includes(part) });
        } else {
            for (const char of part) {
                if (char === '_') {
                    tiles.push({ value: '_', isLocked: false });
                } else if (!isNaN(parseInt(char, 10))) {
                    tiles.push({ value: parseInt(char, 10), isLocked: false });
                }
            }
        }
    }
    return tiles;
};

// This function converts the unsolved equation string into the solved one.
const templateToCorrectEquation = (equation: string, swap: [string, string]): string => {
    const [val1, val2] = swap;
    // This is a direct string replacement based on the puzzle template's design.
    // It assumes the 'swap' property correctly identifies the incorrect part and its correct replacement.
    return equation.replace(val1, val2);
};


const findSwapIndices = (equation: string, swapPair: [string, string]): [number, number] => {
    // This function now correctly finds the indices that need to be swapped
    // by comparing the incorrect board with the *correct* board.
    
    // Create the board representing the CORRECT solution first.
    const correctEq = templateToCorrectEquation(equation, swapPair);
    const correctTiles = toTiles(correctEq).map(t => String(t.value));

    // Create the board for the INCORRECT puzzle as it's displayed.
    const incorrectTiles = toTiles(equation).map(t => String(t.value));
    
    const diffIndices: number[] = [];
    for (let i = 0; i < correctTiles.length; i++) {
        if (correctTiles[i] !== incorrectTiles[i]) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 2) {
        return [diffIndices[0], diffIndices[1]];
    }

    // Fallback/Error case: This should not happen with well-designed templates.
    // This logic handles cases where the swap involves symbols that are identical
    // but in different positions, like swapping a '2' with another '2'.
    if (diffIndices.length === 0) {
        let first = -1;
        let second = -1;
        for (let i = 0; i < incorrectTiles.length; i++) {
            if (incorrectTiles[i] === swapPair[0] && first === -1) {
                first = i;
            } else if (incorrectTiles[i] === swapPair[1] && second === -1) {
                second = i;
            }
        }
        if (first !== -1 && second !== -1) return [first, second];
    }
    
    console.error(`Could not determine unique swap indices for equation: "${equation}" with swap:`, swapPair);
    return [0, 1]; // Fallback
};

const getCorrectSolution = (equation: string, swap: [string, string]): TileValue[] => {
    const correctEquationString = templateToCorrectEquation(equation, swap);
    const solutionTiles = toTiles(correctEquationString);
    return solutionTiles.map(tile => tile.value);
};


export const mathLevels: MathLevel[] = [
    // 🔰 LEVELS 1–10: OPERATOR LOGIC (FOUNDATION)
    {
        level: 1, description: "Operator Logic", hint: "Check how the numbers want to relate. Is the operator correct?",
        variations: [
            { equation: "3 * 3 = 6", swap: ["*", "+"] }, { equation: "4 + 2 = 8", swap: ["+", "*"] },
            { equation: "5 + 1 = 4", swap: ["+", "-"] }, { equation: "6 - 2 = 8", swap: ["-", "+"] },
            { equation: "9 / 3 = 6", swap: ["/", "-"] }, { equation: "7 + 3 = 10", swap: ["+", "-"] },
            { equation: "8 / 4 = 4", swap: ["/", "-"] }, { equation: "6 * 2 = 4", swap: ["*", "-"] },
            { equation: "2 * 2 = 4", swap: ["*", "+"] },
            { equation: "5 + 2 = 10", swap: ["+", "*"] },
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
        variations: [ 
            { equation: "10 - 2 = 5", swap: ["-", "/"] }, { equation: "12 - 4 = 3", swap: ["-", "/"] }, 
            { equation: "5 + 3 = 15", swap: ["+", "*"] }, { equation: "2 - 4 = 6", swap: ["-", "+"] }, 
            { equation: "9 - 3 = 3", swap: ["-", "/"] }, { equation: "15 - 5 = 3", swap: ["-", "/"] }, 
            { equation: "4 + 4 = 16", swap: ["+", "*"] }, { equation: "16 / 8 = 8", swap: ["/", "-"] }, 
            { equation: "6 - 2 = 8", swap: ["-", "+"] }, { equation: "20 / 2 = 18", swap: ["/", "-"] }
        ] 
    },
    { 
        level: 4, description: "Operator Logic", hint: "The numbers are right, the symbol is wrong.", 
        variations: [ 
            { equation: "7 - 1 = 8", swap: ["-", "+"] }, { equation: "3 * 4 = 7", swap: ["*", "+"] }, 
            { equation: "10 / 5 = 5", swap: ["/", "-"] }, { equation: "8 / 2 = 6", swap: ["/", "-"] }, 
            { equation: "6 * 3 = 9", swap: ["*", "+"] }, { equation: "5 * 4 = 9", swap: ["*", "+"] }, 
            { equation: "12 / 2 = 10", swap: ["/", "-"] }, { equation: "9 + 3 = 3", swap: ["+", "/"] }, 
            { equation: "14 / 7 = 7", swap: ["/", "-"] }, { equation: "2 * 7 = 9", swap: ["*", "+"] }
        ] 
    },
    { 
        level: 5, description: "Operator Logic", hint: "Find the operator that makes the equation true.", 
        variations: [ 
            { equation: "20 / 5 = 15", swap: ["/", "-"] }, { equation: "8 * 2 = 10", swap: ["*", "+"] }, 
            { equation: "15 / 5 = 10", swap: ["/", "-"] }, { equation: "6 * 4 = 10", swap: ["*", "+"] }, 
            { equation: "18 / 3 = 15", swap: ["/", "-"] }, { equation: "7 * 2 = 9", swap: ["*", "+"] }, 
            { equation: "16 / 4 = 12", swap: ["/", "-"] }, { equation: "5 * 5 = 10", swap: ["*", "+"] }, 
            { equation: "21 / 7 = 14", swap: ["/", "-"] }, { equation: "9 * 2 = 11", swap: ["*", "+"] }
        ] 
    },
    { 
        level: 6, description: "Operator Logic", hint: "The equation is just one symbol away from being correct.", 
        variations: [
            { equation: "10 * 2 = 20", swap: ["*", "-"] }, { equation: "12 * 3 = 4", swap: ["*", "/"] },
            { equation: "5 * 3 = 8", swap: ["*", "+"] }, { equation: "9 - 3 = 12", swap: ["-", "+"] },
            { equation: "14 / 2 = 12", swap: ["/", "-"] }, { equation: "10 * 2 = 5", swap: ["*", "/"] },
            { equation: "20 - 10 = 2", swap: ["-", "/"] }, { equation: "7 * 3 = 10", swap: ["*", "+"] },
            { equation: "8 * 2 = 10", swap: ["*", "+"] }, { equation: "10 - 2 = 12", swap: ["-", "+"] }
        ]
    },
    { 
        level: 7, description: "Operator Logic", hint: "Which operation makes logical sense here?", 
        variations: [
            { equation: "3 * 5 = 8", swap: ["*", "+"] }, { equation: "10 / 2 = 8", swap: ["/", "-"] },
            { equation: "4 * 4 = 8", swap: ["*", "+"] }, { equation: "18 - 9 = 2", swap: ["-", "/"] },
            { equation: "6 * 3 = 18", swap: ["*", "-"] }, { equation: "7 - 1 = 8", swap: ["-", "+"] },
            { equation: "12 - 4 = 3", swap: ["-", "/"] }, { equation: "15 / 5 = 20", swap: ["/", "+"] },
            { equation: "2 * 9 = 11", swap: ["*", "+"] }, { equation: "20 / 10 = 10", swap: ["/", "-"] }
        ]
    },
    { 
        level: 8, description: "Operator Logic", hint: "The numbers are fixed. The operation is not.", 
        variations: [
            { equation: "5 * 5 = 25", swap: ["*", "-"] }, { equation: "20 / 4 = 16", swap: ["/", "-"] },
            { equation: "30 / 3 = 27", swap: ["/", "-"] }, { equation: "7 * 7 = 49", swap: ["*", "-"] },
            { equation: "10 * 10 = 20", swap: ["*", "+"] }, { equation: "100 / 10 = 90", swap: ["/", "-"] },
            { equation: "50 / 5 = 45", swap: ["/", "-"] }, { equation: "11 * 2 = 13", swap: ["*", "+"] },
            { equation: "13 * 3 = 16", swap: ["*", "+"] }, { equation: "24 - 12 = 2", swap: ["-", "/"] }
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
    
    // 🔢 LEVELS 11-20: DIGIT POSITION LOGIC
    {
        level: 11, description: "Digit Position", hint: "All the right numbers, just not in the right order.",
        variations: [
            { equation: "21 - 9 = 2", swap: ["1", "9"] }, { equation: "54 / 9 = 7", swap: ["4", "3"] },
            { equation: "40 + 5 = 54", swap: ["0", "9"] }, { equation: "32 * 2 = 62", swap: ["2", "4"] },
            { equation: "20 + 3 = 30", swap: ["0", "7"] }, { equation: "18 * 2 = 38", swap: ["8", "9"] },
            { equation: "81 / 9 = 8", swap: ["1", "9"] }, { equation: "52 - 7 = 42", swap: ["2", "5"] },
            { equation: "28 + 4 = 38", swap: ["8", "2"] }, { equation: "72 / 8 = 8", swap: ["2", "9"] }
        ]
    },
    {
        level: 12, description: "Digit Position", hint: "Just two digits need to switch places.",
        variations: [
            { equation: "14 + 13 = 21", swap: ["4", "7"] }, { equation: "25 - 10 = 10", swap: ["5", "0"] },
            { equation: "14 * 2 = 24", swap: ["4", "8"] }, { equation: "31 / 3 = 11", swap: ["1", "3"] },
            { equation: "11 + 18 = 28", swap: ["1", "9"] }, { equation: "40 - 15 = 20", swap: ["0", "5"] },
            { equation: "19 * 1 = 11", swap: ["9", "1"] }, { equation: "51 / 5 = 11", swap: ["1", "0"] },
            { equation: "22 + 11 = 32", swap: ["2", "3"] }, { equation: "33 - 11 = 23", swap: ["3", "2"] }
        ]
    },
    {
        level: 13, description: "Digit Position", hint: "The equation looks complex, but the fix is a simple digit swap.",
        variations: [
            { equation: "13 * 3 = 43", swap: ["3", "9"] }, { equation: "12 * 6 = 76", swap: ["6", "2"] },
            { equation: "100 / 5 = 25", swap: ["5", "0"] }, { equation: "88 - 18 = 78", swap: ["8", "0"] },
            { equation: "43 + 36 = 83", swap: ["3", "9"] }, { equation: "19 + 88 = 108", swap: ["9", "7"] },
            { equation: "21 * 4 = 81", swap: ["1", "4"] }, { equation: "92 / 3 = 32", swap: ["2", "6"] },
            { equation: "54 + 48 = 98", swap: ["4", "2"] }, { equation: "79 - 18 = 58", swap: ["9", "1"] }
        ]
    },
    {
        level: 14, description: "Digit Position", hint: "A single digit swap will make it all make sense.",
        variations: [
            { equation: "11 * 21 = 121", swap: ["2", "1"] }, { equation: "14 * 12 = 144", swap: ["2", "4"] },
            { equation: "19 * 13 = 169", swap: ["3", "3"] }, { equation: "16 * 14 = 196", swap: ["6", "4"] },
            { equation: "21 * 15 = 225", swap: ["1", "5"] }, { equation: "11 * 16 = 256", swap: ["1", "6"] },
            { equation: "28 * 17 = 289", swap: ["8", "9"] }, { equation: "32 * 18 = 324", swap: ["2", "4"] },
            { equation: "31 * 19 = 361", swap: ["1", "9"] }, { equation: "40 * 20 = 400", swap: ["2", "0"] }
        ]
    },
    {
        level: 15, description: "Digit Position", hint: "The digits are there, just scrambled.",
        variations: [
            { equation: "29 * 4 = 104", swap: ["9", "6"] }, { equation: "74 / 3 = 24", swap: ["4", "2"] },
            { equation: "32 + 41 = 71", swap: ["2", "3"] }, { equation: "98 - 19 = 78", swap: ["8", "9"] },
            { equation: "17 * 5 = 90", swap: ["7", "8"] }, { equation: "156 / 6 = 25", swap: ["6", "5"] },
            { equation: "68 + 23 = 93", swap: ["8", "1"] }, { equation: "83 - 18 = 63", swap: ["3", "5"] },
            { equation: "28 * 4 = 88", swap: ["8", "2"] }, { equation: "47 / 7 = 4", swap: ["7", "9"] }
        ]
    },
    {
        level: 16, description: "Digit Position", hint: "Two numbers are switched. Can you spot them?",
        variations: [
            { equation: "13 + 8 = 18", swap: ["3", "0"] }, { equation: "10 - 9 = 9", swap: ["0", "9"] },
            { equation: "47 * 7 = 49", swap: ["7", "9"] }, { equation: "368 / 8 = 6", swap: ["8", "4"] },
            { equation: "21 + 9 = 31", swap: ["1", "0"] }, { equation: "55 - 25 = 25", swap: ["5", "0"] },
            { equation: "15 * 8 = 108", swap: ["5", "2"] }, { equation: "89 / 9 = 8", swap: ["9", "1"] },
            { equation: "46 + 53 = 106", swap: ["6", "9"] }, { equation: "110 - 11 = 90", swap: ["0", "9"] }
        ]
    },
    {
        level: 17, description: "Digit Position", hint: "The equation looks complex, but the fix is a simple digit swap.",
        variations: [
            { equation: "13 * 18 = 153", swap: ["8", "4"] }, { equation: "225 - 15 = 15", swap: ["2", "1"] },
            { equation: "224 / 16 = 16", swap: ["4", "4"] }, { equation: "192 / 12 = 21", swap: ["2", "6"] },
            { equation: "120 * 5 = 25", swap: ["0", "5"] }, { equation: "209 / 11 = 20", swap: ["0", "9"] },
            { equation: "202 / 10 = 22", swap: ["2", "0"] }, { equation: "253 / 11 = 27", swap: ["7", "3"] },
            { equation: "252 / 14 = 23", swap: ["2", "8"] }, { equation: "224 / 8 = 19", swap: ["4", "8"] }
        ]
    },
    {
        level: 18, description: "Digit Position", hint: "It seems impossible, but one swap makes it work.",
        variations: [
            { equation: "9 * 9 - 2 = 79", swap: ["9", "2"] }, { equation: "8 * 8 - 6 = 58", swap: ["8", "6"] },
            { equation: "7 * 7 - 7 = 47", swap: ["7", "2"] }, { equation: "6 * 6 - 6 = 36", swap: ["6", "0"] },
            { equation: "5 * 5 - 5 = 25", swap: ["5", "0"] }, { equation: "12 * 11 - 12 = 132", swap: ["1", "2"] },
            { equation: "11 * 10 - 11 = 111", swap: ["0", "0"] }, { equation: "10 * 9 - 10 = 90", swap: ["9", "0"] },
            { equation: "13 * 13 - 13 = 156", swap: ["3", "6"] }, { equation: "14 * 14 - 12 = 182", swap: ["2", "4"] }
        ]
    },
    {
        level: 19, description: "Digit Position", hint: "All digits are correct, but their positions are not.",
        variations: [
            { equation: "6 * 9 = 45", swap: ["6", "5"] }, { equation: "8 * 9 = 27", swap: ["8", "3"] },
            { equation: "7 * 6 = 24", swap: ["6", "4"] }, { equation: "9 * 7 = 36", swap: ["7", "6"] },
            { equation: "4 * 9 = 63", swap: ["4", "7"] }, { equation: "3 * 8 = 42", swap: ["8", "4"] },
            { equation: "5 * 9 = 54", swap: ["9", "6"] }, { equation: "8 * 8 = 46", swap: ["8", "6"] },
            { equation: "6 * 7 = 24", swap: ["7", "4"] }, { equation: "7 * 8 = 65", swap: ["8", "5"] }
        ]
    },
    {
        level: 20, description: "Digit Position", hint: "A single swap will resolve the calculation.",
        variations: [
            { equation: "23 - 18 = 13", swap: ["8", "5"] }, { equation: "45 - 29 = 19", swap: ["9", "6"] },
            { equation: "52 - 38 = 18", swap: ["8", "4"] }, { equation: "61 - 49 = 19", swap: ["9", "2"] },
            { equation: "33 - 17 = 17", swap: ["7", "6"] }, { equation: "41 - 28 = 18", swap: ["8", "3"] },
            { equation: "55 - 39 = 19", swap: ["9", "6"] }, { equation: "62 - 47 = 17", swap: ["7", "5"] },
            { equation: "71 - 55 = 15", swap: ["5", "6"] }, { equation: "82 - 69 = 19", swap: ["9", "3"] }
        ]
    },

    // 🧮 LEVELS 21-30: ORDER OF OPERATIONS
    { 
        level: 21, description: "Order of Operations", hint: "Which operation should happen first?", 
        variations: [ 
            { equation: "2 + 3 * 4 = 20", swap: ["+", "*"] }, { equation: "3 * 5 + 2 = 17", swap: ["*", "+"] }, 
            { equation: "4 * 6 + 2 = 26", swap: ["*", "+"] }, { equation: "1 + 7 * 3 = 24", swap: ["+", "*"] }, 
            { equation: "5 * 2 + 4 = 14", swap: ["*", "+"] }, { equation: "6 + 3 * 2 = 18", swap: ["+", "*"] }, 
            { equation: "8 * 2 + 2 = 18", swap: ["*", "+"] }, { equation: "7 * 4 + 1 = 29", swap: ["*", "+"] }, 
            { equation: "9 * 3 + 1 = 28", swap: ["*", "+"] }, { equation: "2 + 5 * 4 = 40", swap: ["+", "*"] }
        ] 
    },
    {
        level: 22, description: "Order of Operations", hint: "Remember: Multiplication before Addition.",
        variations: [
            { equation: "3 + 5 * 3 = 24", swap: ["+", "*"] }, { equation: "2 + 6 * 4 = 20", swap: ["6", "4"] },
            { equation: "10 * 2 - 3 = 2", swap: ["*", "-"] }, { equation: "8 / 2 + 6 = 7", swap: ["/", "-"] },
            { equation: "12 - 2 * 4 = 40", swap: ["-", "*"] }, { equation: "7 + 2 * 5 = 45", swap: ["+", "*"] },
            { equation: "20 / 1 - 5 = 4", swap: ["1", "4"] }, { equation: "9 * 2 - 5 = 13", swap: ["*", "-"] },
            { equation: "15 / 5 - 10 = 1", swap: ["10", "2"] }, { equation: "3 + 4 * 5 = 35", swap: ["+", "*"] }
        ]
    },
    { level: 23, description: "Order of Operations", hint: "A digit or an operator might be in the wrong place.", variations: [ { equation: "5 + 2 * 3 = 25", swap: ["+", "*"] }, { equation: "10 / 2 + 3 = 2", swap: ["/", "-"] }, { equation: "12 / 8 + 4 = 5", swap: ["/", "-"] }, { equation: "20 - 5 * 2 = 30", swap: ["-", "*"] }, { equation: "9 * 3 - 3 = 24", swap: ["-", "+"] }, { equation: "18 + 6 / 3 = 8", swap: ["+", "-"] }, { equation: "7 + 4 * 2 = 30", swap: ["+", "*"] }, { equation: "16 / 2 - 4 = 4", swap: ["-", "+"] }, { equation: "1 + 9 * 2 = 20", swap: ["+", "*"] }, { equation: "25 - 5 / 5 = 0", swap: ["-", "*"] }] },
    { level: 24, description: "Order of Operations", hint: "Think about the sequence of calculations.", variations: [ { equation: "10 - 3 * 2 = 14", swap: ["-", "*"] }, { equation: "15 / 3 + 2 = 3", swap: ["/", "-"] }, { equation: "5 + 4 * 1 = 25", swap: ["+", "*"] }, { equation: "18 / 6 - 4 = 2", swap: ["4", "1"] }, { equation: "8 + 2 * 3 = 30", swap: ["+", "*"] }, { equation: "24 / 4 - 8 = 2", swap: ["8", "2"] }, { equation: "7 + 3 * 4 = 49", swap: ["+", "*"] }, { equation: "21 / 7 - 1 = 4", swap: ["1", "2"] }, { equation: "6 + 5 * 2 = 22", swap: ["+", "*"] }, { equation: "30 / 5 + 1 = 5", swap: ["/", "-"] }] },
    { level: 25, description: "Order of Operations", hint: "It's a puzzle of priority.", variations: [ { equation: "40 / 10 - 5 = 1", swap: ["5", "1"] }, { equation: "36 / 6 - 12 = 3", swap: ["12", "3"] }, { equation: "100 / 10 - 9 = 1", swap: ["9", "0"] }, { equation: "50 / 10 - 5 = 0", swap: ["-", "+"] }, { equation: "1 + 2 * 3 = 9", swap: ["+", "*"] }, { equation: "9 - 3 / 2 = 3", swap: ["-", "/"] }, { equation: "4 + 2 * 8 = 40", swap: ["+", "*"] }, { equation: "16 / 4 - 8 = 0", swap: ["8", "2"] }, { equation: "10 * 10 - 10 = 99", swap: ["10", "1"] }, { equation: "25 / 5 - 10 = 0", swap: ["10", "0"] }] },
    {
        level: 26, description: "Order of Operations", hint: "Find the single incorrect symbol, digit or operator.",
        variations: [
            { equation: "4 * 4 + 2 = 18", swap: ["+", "*"] }, { equation: "6 + 2 * 9 = 24", swap: ["+", "*"] },
            { equation: "30 / 3 - 5 = 15", swap: ["-", "+"] }, { equation: "5 * 7 - 9 = 26", swap: ["-", "+"] },
            { equation: "6 * 7 + 7 = 49", swap: ["+", "*"] }, { equation: "12 + 10 / 5 = 14", swap: ["+", "-"] },
            { equation: "45 / 9 - 5 = 0", swap: ["-", "-"] }, { equation: "8 * 4 + 12 = 44", swap: ["+", "*"] },
            { equation: "9 * 11 - 10 = 89", swap: ["-", "+"] }, { equation: "100 / 10 + 15 = 25", swap: ["+", "-"] }
        ]
    },
    {
        level: 27, description: "Order of Operations", hint: "Think outside the box. Digits can move anywhere.",
        variations: [
            { equation: "5 * 6 + 4 = 32", swap: ["2", "4"] }, { equation: "9 * 4 - 0 = 30", swap: ["0", "6"] },
            { equation: "40 / 2 + 7 = 27", swap: ["0", "8"] }, { equation: "2 + 7 * 5 = 39", swap: ["5", "7"] },
            { equation: "18 + 24 / 4 = 20", swap: ["0", "4"] }, { equation: "10 * 10 - 9 = 91", swap: ["9", "9"] },
            { equation: "81 / 9 + 8 = 19", swap: ["9", "7"] }, { equation: "3 * 15 - 0 = 40", swap: ["0", "5"] },
            { equation: "60 / 6 + 6 = 14", swap: ["4", "6"] }, { equation: "22 + 2 * 8 = 38", swap: ["2", "8"] }
        ]
    },
    {
        level: 28, description: "Order of Operations", hint: "It might be an operator swap, or it might be a digit.",
        variations: [
            { equation: "12 + 4 * 8 = 60", swap: ["+", "*"] }, { equation: "50 / 10 - 5 = 1", swap: ["-", "/"] },
            { equation: "7 + 3 * 9 = 90", swap: ["+", "*"] }, { equation: "100 / 5 - 5 = 15", swap: ["-", "+"] },
            { equation: "9 + 5 * 5 = 50", swap: ["+", "*"] }, { equation: "64 / 8 - 0 = 8", swap: ["0", "0"] },
            { equation: "13 + 3 * 1 = 40", swap: ["1", "9"] }, { equation: "49 / 7 - 0 = 7", swap: ["0", "0"] },
            { equation: "11 + 8 * 2 = 90", swap: ["2", "8"] }, { equation: "33 / 3 - 0 = 11", swap: ["0", "0"] }
        ]
    },
    {
        level: 29, description: "Order of Operations", hint: "The answer seems impossible until you find the swap.",
        variations: [
            { equation: "9 * 9 - 2 = 72", swap: ["2", "9"] }, { equation: "8 * 8 - 6 = 56", swap: ["6", "8"] },
            { equation: "7 * 7 - 2 = 42", swap: ["2", "7"] }, { equation: "6 * 6 - 0 = 30", swap: ["0", "6"] },
            { equation: "5 * 5 - 0 = 20", swap: ["0", "5"] }, { equation: "12 * 12 - 12 = 131", swap: ["1", "2"] },
            { equation: "11 * 11 - 10 = 110", swap: ["0", "1"] }, { equation: "10 * 10 - 9 = 90", swap: ["0", "1"] },
            { equation: "13 * 13 - 13 = 153", swap: ["3", "6"] }, { equation: "14 * 14 - 12 = 184", swap: ["2", "2"] }
        ]
    },
    {
        level: 30, description: "Order of Operations", hint: "One swap makes it all add up. Or multiply.",
        variations: [
            { equation: "4 * 4 + 2 = 18", swap: ["4", "4"] }, { equation: "6 + 5 * 3 = 21", swap: ["5", "3"] },
            { equation: "45 / 5 + 5 = 14", swap: ["5", "5"] }, { equation: "100 - 9 * 9 = 19", swap: ["9", "9"] },
            { equation: "1 + 9 * 3 = 28", swap: ["3", "3"] }, { equation: "8 * 5 - 10 = 30", swap: ["5", "5"] },
            { equation: "72 / 8 + 4 = 13", swap: ["8", "4"] }, { equation: "60 - 5 * 7 = 25", swap: ["5", "7"] },
            { equation: "2 + 4 * 8 = 34", swap: ["4", "8"] }, { equation: "99 / 9 - 1 = 10", swap: ["9", "1"] }
        ]
    },

    // 🧩 LEVELS 31-40: FILL-IN-THE-BLANK (PRE-ALGEBRA)
    { level: 31, description: "Fill in the Blank", hint: "What number is missing?", variations: [ { equation: "_ + 6 = 10", swap: ["_", "4"] }, { equation: "_ + 7 = 12", swap: ["_", "5"] }, { equation: "_ + 4 = 9", swap: ["_", "5"] }, { equation: "_ + 8 = 13", swap: ["_", "5"] }, { equation: "_ + 5 = 11", swap: ["_", "6"] }, { equation: "_ + 9 = 14", swap: ["_", "5"] }, { equation: "_ + 3 = 7", swap: ["_", "4"] }, { equation: "_ + 2 = 6", swap: ["_", "4"] }, { equation: "_ + 1 = 4", swap: ["_", "3"] }, { equation: "5 + _ = 15", swap: ["_", "10"] }] },
    { level: 32, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", variations: [ { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] }, { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] }, { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] }, { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] }, { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }] },
    { level: 33, description: "Fill in the Blank", hint: "What times 3 equals 21?", variations: [ { equation: "_ * 3 = 21", swap: ["_", "7"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] }, { equation: "_ * 4 = 36", swap: ["_", "9"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] }, { equation: "_ * 8 = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] }, { equation: "_ * 9 = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] }, { equation: "10 * _ = 100", swap: ["_", "10"] }, { equation: "11 * _ = 121", swap: ["_", "11"] }] },
    { level: 34, description: "Fill in the Blank", hint: "A number is missing from the equation.", variations: [ { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] }, { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] }, { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] }, { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }] },
    { level: 35, description: "Fill in the Blank", hint: "Swap the correct number into the blank space.", variations: [ { equation: "10 + _ = 18", swap: ["_", "8"] }, { equation: "25 - _ = 17", swap: ["_", "8"] }, { equation: "6 * _ = 54", swap: ["_", "9"] }, { equation: "77 / _ = 7", swap: ["_", "11"] }, { equation: "13 + _ = 21", swap: ["_", "8"] }, { equation: "30 - _ = 19", swap: ["_", "11"] }, { equation: "8 * _ = 72", swap: ["_", "9"] }, { equation: "96 / _ = 8", swap: ["_", "12"] }, { equation: "21 + _ = 30", swap: ["_", "9"] }, { equation: "42 - _ = 29", swap: ["_", "13"] }] },
    { level: 36, description: "Blank + Multi-digit", hint: "Solve backwards from the answer.", variations: [ { equation: "_ + 6 = 14", swap: ["_", "8"] }, { equation: "3 * _ = 18", swap: ["_", "6"] }, { equation: "12 + _ = 21", swap: ["_", "9"] }, { equation: "45 / _ = 3", swap: ["_", "15"] }, { equation: "22 - _ = 7", swap: ["_", "15"] }, { equation: "5 * _ = 35", swap: ["_", "7"] }, { equation: "14 + _ = 25", swap: ["_", "11"] }, { equation: "60 / _ = 5", swap: ["_", "12"] }, { equation: "24 - _ = 12", swap: ["_", "12"] }, { equation: "2 * _ = 32", swap: ["_", "16"] }] },
    { level: 37, description: "Blank + Multi-digit", hint: "What single digit completes the equation?", variations: [ { equation: "3 * _ = 36", swap: ["_", "12"] }, { equation: "100 - _ = 85", swap: ["_", "15"] }, { equation: "25 + _ = 41", swap: ["_", "16"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "12 * _ = 108", swap: ["_", "9"] }, { equation: "75 - _ = 50", swap: ["_", "25"] }, { equation: "50 + _ = 77", swap: ["_", "27"] }, { equation: "132 / _ = 11", swap: ["_", "12"] }, { equation: "8 * _ = 96", swap: ["_", "12"] }, { equation: "200 - _ = 175", swap: ["_", "25"] }] },
    { level: 38, description: "Blank + Multi-digit", hint: "Find the missing number to balance the equation.", variations: [ { equation: "13 * _ = 39", swap: ["_", "3"] }, { equation: "55 - _ = 20", swap: ["_", "35"] }, { equation: "42 + _ = 60", swap: ["_", "18"] }, { equation: "125 / _ = 25", swap: ["_", "5"] }, { equation: "15 * _ = 75", swap: ["_", "5"] }, { equation: "75 - _ = 30", swap: ["_", "45"] }, { equation: "60 + _ = 99", swap: ["_", "39"] }, { equation: "250 / _ = 25", swap: ["_", "10"] }, { equation: "11 * _ = 132", swap: ["_", "12"] }, { equation: "150 - _ = 50", swap: ["_", "100"] }] },
    { level: 39, description: "Blank + Multi-digit", hint: "A single swap will solve it.", variations: [ { equation: "14 * _ = 56", swap: ["_", "4"] }, { equation: "80 - _ = 65", swap: ["_", "15"] }, { equation: "20 + _ = 55", swap: ["_", "35"] }, { equation: "90 / _ = 6", swap: ["_", "15"] }, { equation: "16 * _ = 64", swap: ["_", "4"] }, { equation: "120 - _ = 95", swap: ["_", "25"] }, { equation: "45 + _ = 70", swap: ["_", "25"] }, { equation: "105 / _ = 7", swap: ["_", "15"] }, { equation: "18 * _ = 72", swap: ["_", "4"] }, { equation: "150 - _ = 125", swap: ["_", "25"] }] },
    { level: 40, description: "Blank + Multi-digit", hint: "Focus on the relationship between the numbers.", variations: [ { equation: "19 * _ = 95", swap: ["_", "5"] }, { equation: "100 - _ = 15", swap: ["_", "85"] }, { equation: "70 + _ = 110", swap: ["_", "40"] }, { equation: "180 / _ = 9", swap: ["_", "20"] }, { equation: "22 * _ = 88", swap: ["_", "4"] }, { equation: "150 - _ = 25", swap: ["_", "125"] }, { equation: "90 + _ = 130", swap: ["_", "40"] }, { equation: "200 / _ = 8", swap: ["_", "25"] }, { equation: "24 * _ = 120", swap: ["_", "5"] }, { equation: "200 - _ = 75", swap: ["_", "125"] }] },
    
    // 🔥 LEVELS 41-50: EVIL GENIUS LEVELS (MIXED LOGIC)
    { level: 41, description: "Mixed Logic", hint: "Solve backwards.", variations: [ { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "_ * 3 + 1 = 13", swap: ["_", "4"] }, { equation: "_ * 5 - 5 = 20", swap: ["_", "5"] }, { equation: "3 * 6 / _ = 9", swap: ["_", "2"] }, { equation: "_ * 2 + 4 = 14", swap: ["_", "5"] }, { equation: "_ * 7 - 7 = 21", swap: ["_", "4"] }, { equation: "_ * 3 + 6 = 15", swap: ["_", "3"] }, { equation: "3 * 8 / _ = 6", swap: ["_", "4"] }, { equation: "_ * 9 - 9 = 27", swap: ["_", "4"] }, { equation: "4 * 10 / _ = 8", swap: ["_", "5"] }] },
    { level: 42, description: "Mixed Logic", hint: "What needs to happen first?", variations: [ { equation: "10 + _ * 2 = 24", swap: ["_", "7"] }, { equation: "20 - _ * 3 = 8", swap: ["_", "4"] }, { equation: "5 * _ + 5 = 30", swap: ["_", "5"] }, { equation: "30 / _ + 2 = 7", swap: ["_", "6"] }, { equation: "8 + _ * 4 = 20", swap: ["_", "3"] }, { equation: "40 - _ * 5 = 15", swap: ["_", "5"] }, { equation: "6 * _ + 8 = 32", swap: ["_", "4"] }, { equation: "50 / _ - 3 = 7", swap: ["_", "5"] }, { equation: "12 + _ * 3 = 30", swap: ["_", "6"] }, { equation: "100 - _ * 10 = 0", swap: ["_", "10"] }] },
    { level: 43, description: "Mixed Logic", hint: "Two steps. One swap.", variations: [ { equation: "3 * 4 + _ = 18", swap: ["_", "6"] }, { equation: "5 * 6 - _ = 20", swap: ["_", "10"] }, { equation: "20 / 4 + _ = 9", swap: ["_", "4"] }, { equation: "18 / 6 - _ = 1", swap: ["_", "2"] }, { equation: "2 * 8 + _ = 22", swap: ["_", "6"] }, { equation: "7 * 3 - _ = 15", swap: ["_", "6"] }, { equation: "36 / 4 + _ = 15", swap: ["_", "6"] }, { equation: "40 / 8 - _ = 2", swap: ["_", "3"] }, { equation: "5 * 7 + _ = 40", swap: ["_", "5"] }, { equation: "60 / 10 - _ = 0", swap: ["_", "6"] }] },
    { level: 44, description: "Mixed Logic", hint: "Find the single incorrect symbol.", variations: [ { equation: "4 + 5 * _ = 19", swap: ["_", "3"] }, { equation: "25 - 2 * _ = 15", swap: ["_", "5"] }, { equation: "8 * 2 + _ = 20", swap: ["_", "4"] }, { equation: "42 / 7 - _ = 3", swap: ["_", "3"] }, { equation: "9 + 3 * _ = 18", swap: ["_", "3"] }, { equation: "32 - 4 * _ = 16", swap: ["_", "4"] }, { equation: "6 * 5 + _ = 33", swap: ["_", "3"] }, { equation: "54 / 9 - _ = 2", swap: ["_", "4"] }, { equation: "11 + 6 * _ = 29", swap: ["_", "3"] }, { equation: "70 - 7 * _ = 21", swap: ["_", "7"] }] },
    { level: 45, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", variations: [ { equation: "6 + _ * 3 = 21", swap: ["_", "5"] }, { equation: "4 * _ - 7 = 21", swap: ["_", "7"] }, { equation: "50 / _ + 5 = 10", swap: ["_", "10"] }, { equation: "100 - _ * 9 = 10", swap: ["_", "10"] }, { equation: "1 + 9 * _ = 28", swap: ["_", "3"] }, { equation: "8 * _ - 10 = 30", swap: ["_", "5"] }, { equation: "72 / _ + 4 = 12", swap: ["_", "9"] }, { equation: "60 - _ * 7 = 25", swap: ["_", "5"] }, { equation: "2 + _ * 8 = 34", swap: ["_", "4"] }, { equation: "99 / _ - 1 = 10", swap: ["_", "9"] }] },
    { level: 46, description: "Evil Genius", hint: "The digits are there, just scrambled.", variations: [ { "equation": "24 * 4 = 104", "swap": ["4", "9"] }, { "equation": "73 / 3 = 25", "swap": ["3", "4"] }, { "equation": "31 + 41 = 72", "swap": ["1", "2"] }, { "equation": "99 - 19 = 76", "swap": ["9", "8"] }, { "equation": "15 * 5 = 90", "swap": ["5", "7"] }, { "equation": "155 / 6 = 25", "swap": ["5", "6"] }, { "equation": "63 + 23 = 93", "swap": ["3", "8"] }, { "equation": "81 - 18 = 63", "swap": ["1", "3"] }, { "equation": "22 * 4 = 84", "swap": ["2", "8"] }, { "equation": "49 / 7 = 4", "swap": ["9", "7"] }] },
    { level: 47, description: "Evil Genius", hint: "Two numbers are switched. Can you spot them?", variations: [ { "equation": "3 + 8 = 18", "swap": ["3", "1"] }, { "equation": "19 - 9 = 9", "swap": ["9", "10"] }, { "equation": "7 * 7 = 47", "swap": ["7", "9"] }, { "equation": "46 * 8 = 6", "swap": ["6", "368"] }, { "equation": "22 + 9 = 32", "swap": ["2", "1"] }, { "equation": "50 - 25 = 20", "swap": ["0", "5"] }, { "equation": "19 * 8 = 109", "swap": ["9", "5"] }, { "equation": "81 / 9 = 8", "swap": ["1", "9"] }, { "equation": "43 + 53 = 103", "swap": ["3", "6"] }, { "equation": "111 - 11 = 99", "swap": ["1", "10"] }] },
    { level: 48, description: "Evil Genius", hint: "The equation looks complex, but the fix is a simple digit swap.", variations: [ { "equation": "13 * 16 = 153", "swap": ["6", "8"] }, { "equation": "15 * 15 = 221", "swap": ["1", "5"] }, { "equation": "16 * 14 = 226", "swap": ["6", "4"] }, { "equation": "12 * 16 = 212", "swap": ["6", "9"] }, { "equation": "25 * 5 = 120", "swap": ["5", "0"] }, { "equation": "11 * 19 = 201", "swap": ["1", "9"] }, { "equation": "22 * 10 = 202", "swap": ["2", "0"] }, { "equation": "23 * 11 = 273", "swap": ["3", "5"] }, { "equation": "14 * 18 = 234", "swap": ["8", "5"] }, { "equation": "28 * 8 = 198", "swap": ["8", "2"] }] },
    { level: 49, description: "Evil Genius", hint: "Focus on the relationship between the numbers.", variations: [ { "equation": "7 + 1 = 6", "swap": ["+", "-"] }, { "equation": "3 + 4 = 12", "swap": ["+", "*"] }, { "equation": "10 - 5 = 15", "swap": ["-", "+"] }, { "equation": "8 - 2 = 16", "swap": ["-", "*"] }, { "equation": "6 * 3 = 9", "swap": ["*", "+"] }, { "equation": "5 + 4 = 1", "swap": ["+", "-"] }, { "equation": "12 - 2 = 14", "swap": ["-", "+"] }, { "equation": "9 - 3 = 27", "swap": ["-", "*"] }, { "equation": "14 / 7 = 7", "swap": ["/", "-"] }, { "equation": "2 + 7 = 5", "swap": ["+", "-"] }] },
    { level: 50, description: "Evil Genius", hint: "One simple sign swap will solve it.", variations: [ { "equation": "20 - 5 = 100", "swap": ["-", "*"] }, { "equation": "8 / 2 = 6", "swap": ["/", "-"] }, { "equation": "15 + 5 = 3", "swap": ["+", "/"] }, { "equation": "6 * 4 = 10", "swap": ["*", "+"] }, { "equation": "18 - 3 = 21", "swap": ["-", "+"] }, { "equation": "7 - 2 = 14", "swap": ["-", "*"] }, { "equation": "16 / 4 = 12", "swap": ["/", "-"] }, { "equation": "5 * 5 = 10", "swap": ["*", "+"] }, { "equation": "21 - 7 = 3", "swap": ["-", "/"] }, { "equation": "9 + 2 = 7", "swap": ["+", "-"] }] }
];


export function getMathPuzzleConfig(level: number): MathLevel {
    const adjustedLevel = Math.max(1, Math.min(level + 1, mathLevels[mathLevels.length - 1].level));
    const config = mathLevels.find(l => l.level === adjustedLevel);
    if (!config) {
        return mathLevels[mathLevels.length - 1];
    }
    return config;
}

export function generatePuzzle(level: number, retryCount: number): MathPuzzle {
    const config = getMathPuzzleConfig(level);
    const variationIndex = (level + retryCount) % config.variations.length;
    const puzzleTemplate = config.variations[variationIndex];
    
    const { equation, swap } = puzzleTemplate;

    const board = toTiles(equation);
    const swappedIndices = findSwapIndices(equation, swap);
    const correctSolution = getCorrectSolution(equation, swap);

    return {
        id: `${config.level}-${variationIndex}`,
        board,
        swappedIndices,
        correctSolution,
    };
}

export function getHint(puzzle: MathPuzzle, level: number): string {
    const config = getMathPuzzleConfig(level);
    return config.hint;
}
