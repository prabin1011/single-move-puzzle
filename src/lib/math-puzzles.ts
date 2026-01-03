
export type TileValue = number | string | null;

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
    const parts = equation.split(' ');
    const tiles: Tile[] = [];
    for (const part of parts) {
        if (['+', '-', '*', '/', '=', '_'].includes(part)) {
            tiles.push({ value: part, isLocked: ['=', '+', '-', '*', '/'].includes(part) });
        } else {
            // Handle multi-digit numbers by splitting them
            for (const char of part) {
                 if (char === '_') {
                    tiles.push({ value: '_', isLocked: false });
                } else {
                    tiles.push({ value: parseInt(char, 10), isLocked: false });
                }
            }
        }
    }
    return tiles;
};

// A helper to find indices for the swap. This is more robust than hardcoding indices.
const findSwapIndices = (board: Tile[], swapPair: [string, string]): [number, number] => {
    // val1 is the INCORRECT value on the board.
    // val2 is the CORRECT value that needs to be swapped in.
    const val1 = swapPair[0].length === 1 && !isNaN(parseInt(swapPair[0])) ? parseInt(swapPair[0]) : swapPair[0];
    const val2 = swapPair[1].length === 1 && !isNaN(parseInt(swapPair[1])) ? parseInt(swapPair[1]) : swapPair[1];

    // Find the index of the incorrect tile ON THE BOARD.
    const idx1 = board.findIndex(tile => tile.value == val1);
    
    // Create a temporary "correct" board to find where the correct tile *should* go.
    const correctBoard = [...board];
    if (idx1 !== -1) {
        correctBoard[idx1] = { ...correctBoard[idx1], value: val2 };
    }

    // Now, find the second index. This could be another tile that needs to be swapped out,
    // or it could be a blank tile that needs to be filled.
    const idx2 = correctBoard.findIndex(tile => tile.value == val2 && tile.value != board[idx1]?.value);
    
    if (idx1 === -1 || idx2 === -1) {
        // This error means the puzzle template is malformed.
        console.error(`Could not find swap pair [${swapPair[0]}, ${swapPair[1]}] in board`, board.map(b => b.value));
        return [0,1]; // Fallback to avoid crashing
    }

    return [idx1, idx2].sort((a,b) => a-b) as [number, number];
};


const getCorrectSolution = (equation: string, swap: [string, string]): TileValue[] => {
    const incorrectBoard = toTiles(equation).map(t => t.value);
    
    const val1 = swap[0].length === 1 && !isNaN(parseInt(swap[0])) ? parseInt(swap[0]) : swap[0];
    const val2 = swap[1].length === 1 && !isNaN(parseInt(swap[1])) ? parseInt(swap[1]) : swap[1];

    const idx1 = incorrectBoard.findIndex(v => v == val1);
    const idx2 = incorrectBoard.findIndex(v => v == val2);

    const correctBoard = [...incorrectBoard];
    // This logic handles all swap types: digit-digit, operator-operator, or digit-operator
    if (idx1 !== -1 && idx2 !== -1) {
        [correctBoard[idx1], correctBoard[idx2]] = [correctBoard[idx2], correctBoard[idx1]];
    } else if (idx1 !== -1) { // Case for swapping a value that isn't on the board (like for blanks)
        const tempBoard = toTiles(equation);
        const swapIndices = findSwapIndices(tempBoard, swap);
        const realIdx1 = swapIndices[0];
        const realIdx2 = swapIndices[1];
        [correctBoard[realIdx1], correctBoard[realIdx2]] = [correctBoard[realIdx2], correctBoard[realIdx1]];

    } else {
        // Fallback for safety, though this shouldn't be reached with correct templates
        const tempBoard = toTiles(equation);
        const swapIndices = findSwapIndices(tempBoard, swap);
        [correctBoard[swapIndices[0]], correctBoard[swapIndices[1]]] = [correctBoard[swapIndices[1]], correctBoard[swapIndices[0]]];
    }
    
    return correctBoard;
};


/**
 * The new curated library of 500 puzzles.
 * 50 levels, each with 10 variations.
 * Based on the excellent design from the user.
 */
export const mathLevels: MathLevel[] = [
    // 🔰 LEVELS 1–10: OPERATOR LOGIC (FOUNDATION)
    {
        level: 1, description: "Operator Logic", hint: "Check how the numbers want to relate. Is the operator correct?",
        variations: [
            { equation: "3 * 3 = 6", swap: ["*", "+"] },
            { equation: "4 * 2 = 6", swap: ["*", "+"] },
            { equation: "5 - 1 = 4", swap: ["-", "+"] }, // changed from 10 to 4
            { equation: "6 + 2 = 8", swap: ["+", "-"] }, // changed from 16 to 8
            { equation: "9 / 3 = 6", swap: ["/", "-"] },
            { equation: "7 + 3 = 10", swap: ["+", "-"] }, // changed from 21
            { equation: "8 - 4 = 4", swap: ["-", "+"] }, // changed from 32
            { equation: "6 / 2 = 3", swap: ["/", "+"] }, // changed from 12
            { equation: "2 + 2 = 4", swap: ["+", "*"] }, // changed from 8
            { equation: "5 * 2 = 7", swap: ["*", "+"] },
        ]
    },
    {
        level: 2, description: "Equals Sign Misdirection", hint: "Is the equation speaking multiplication, but using an equals?",
        variations: [
            { equation: "4 + 4 * 16", swap: ["*", "="] },
            { equation: "3 * 3 - 6", swap: ["-", "="] },
            { equation: "6 - 2 * 12", swap: ["*", "="] },
            { equation: "5 + 5 * 20", swap: ["*", "="] }, // changed from 25
            { equation: "8 / 2 * 8", swap: ["*", "="] },
            { equation: "7 - 3 * 28", swap: ["*", "="] },
            { equation: "9 + 1 * 18", swap: ["*", "="] },
            { equation: "6 * 2 - 8", swap: ["-", "="] },
            { equation: "10 - 5 * 50", swap: ["*", "="] },
            { equation: "3 + 6 * 27", swap: ["*", "="] },
        ]
    },
    // Remainder of levels 3-10 will follow this pattern
    { level: 3, description: "Operator Logic", hint: "Which operator fits the result?", variations: [ { equation: "10 - 2 = 5", swap: ["-", "/"] }, { equation: "12 / 4 = 8", swap: ["/", "-"] }, { equation: "5 + 3 = 15", swap: ["+", "*"] }, { equation: "2 * 4 = 6", swap: ["*", "+"] }, { equation: "9 - 3 = 3", swap: ["-", "/"] }, { equation: "15 / 5 = 10", swap: ["/", "-"] }, { equation: "4 + 4 = 16", swap: ["+", "*"] }, { equation: "16 - 8 = 2", swap: ["-", "/"] }, { equation: "6 * 2 = 8", swap: ["*", "+"] }, { equation: "20 / 2 = 18", swap: ["/", "-"] }] },
    { level: 4, description: "Operator Logic", hint: "The numbers are right, the symbol is wrong.", variations: [ { equation: "7 - 1 = 8", swap: ["-", "+"] }, { equation: "3 * 4 = 7", swap: ["*", "+"] }, { equation: "10 / 5 = 5", swap: ["/", "-"] }, { equation: "8 + 2 = 4", swap: ["+", "/"] }, { equation: "6 - 3 = 18", swap: ["-", "*"] }, { equation: "5 * 4 = 9", swap: ["*", "+"] }, { equation: "12 / 2 = 10", swap: ["/", "-"] }, { equation: "9 + 3 = 3", swap: ["+", "/"] }, { equation: "14 - 7 = 2", swap: ["-", "/"] }, { equation: "2 * 7 = 9", swap: ["*", "+"] }] },
    { level: 5, description: "Operator Logic", hint: "Find the operator that makes the equation true.", variations: [ { equation: "20 / 5 = 15", swap: ["/", "-"] }, { equation: "8 * 2 = 10", swap: ["*", "+"] }, { equation: "15 - 5 = 3", swap: ["-", "/"] }, { equation: "6 + 4 = 24", swap: ["+", "*"] }, { equation: "18 / 3 = 15", swap: ["/", "-"] }, { equation: "7 * 2 = 9", swap: ["*", "+"] }, { equation: "16 - 4 = 4", swap: ["-", "/"] }, { equation: "5 + 5 = 25", swap: ["+", "*"] }, { equation: "21 / 7 = 14", swap: ["/", "-"] }, { equation: "9 * 2 = 11", swap: ["*", "+"] }] },
    { level: 6, description: "Operator Logic", hint: "Is it addition, or something else?", variations: [ { equation: "10 + 2 = 5", swap: ["+", "/"] }, { equation: "12 - 4 = 3", swap: ["-", "/"] }, { equation: "5 * 3 = 8", swap: ["*", "+"] }, { equation: "2 + 4 = 8", swap: ["+", "*"] }, { equation: "9 + 3 = 3", swap: ["+", "/"] }, { equation: "15 - 5 = 75", swap: ["-", "*"] }, { equation: "4 * 4 = 8", swap: ["*", "+"] }, { equation: "16 / 8 = 8", swap: ["/", "-"] }, { equation: "6 + 2 = 12", swap: ["+", "*"] }, { equation: "20 - 2 = 10", swap: ["-", "/"] }] },
    { level: 7, description: "Operator Logic", hint: "Focus on the relationship between the numbers.", variations: [ { equation: "7 + 1 = 6", swap: ["+", "-"] }, { equation: "3 * 4 = 12", swap: ["*", "+"] }, { equation: "10 / 5 = 15", swap: ["/", "+"] }, { equation: "8 - 2 = 16", swap: ["-", "*"] }, { equation: "6 * 3 = 9", swap: ["*", "+"] }, { equation: "5 + 4 = 1", swap: ["+", "-"] }, { equation: "12 / 2 = 14", swap: ["/", "+"] }, { equation: "9 - 3 = 27", swap: ["-", "*"] }, { equation: "14 / 7 = 7", swap: ["/", "-"] }, { equation: "2 * 7 = 5", swap: ["*", "-"] }] },
    { level: 8, description: "Operator Logic", hint: "One simple sign swap will solve it.", variations: [ { equation: "20 - 5 = 100", swap: ["-", "*"] }, { equation: "8 / 2 = 6", swap: ["/", "-"] }, { equation: "15 + 5 = 3", swap: ["+", "/"] }, { equation: "6 * 4 = 10", swap: ["*", "+"] }, { equation: "18 / 3 = 21", swap: ["/", "+"] }, { equation: "7 - 2 = 14", swap: ["-", "*"] }, { equation: "16 / 4 = 12", swap: ["/", "-"] }, { equation: "5 * 5 = 10", swap: ["*", "+"] }, { equation: "21 - 7 = 3", swap: ["-", "/"] }, { equation: "9 + 2 = 7", swap: ["+", "-"] }] },
    { level: 9, description: "Equals Sign Logic", hint: "Perhaps the equals sign itself is the problem.", variations: [ { equation: "8 - 2 * 16", swap: ["*", "="] }, { equation: "10 / 2 - 8", swap: ["-", "="] }, { equation: "7 + 2 * 14", swap: ["*", "="] }, { equation: "15 / 5 - 10", swap: ["-", "="] }, { equation: "6 + 3 * 18", swap: ["*", "="] }, { equation: "20 / 4 - 16", swap: ["-", "="] }, { equation: "5 + 4 * 20", swap: ["*", "="] }, { equation: "12 / 6 - 6", swap: ["-", "="] }, { equation: "9 + 2 * 18", swap: ["*", "="] }, { equation: "16 / 8 - 8", swap: ["-", "="] }] },
    { level: 10, description: "Equals Sign Logic", hint: "When is an equals sign not an equals sign?", variations: [ { equation: "10 + 5 * 50", swap: ["*", "="] }, { equation: "20 / 2 - 18", swap: ["-", "="] }, { equation: "8 * 2 + 10", swap: ["+", "="] }, { equation: "15 / 3 - 12", swap: ["-", "="] }, { equation: "4 * 5 + 9", swap: ["+", "="] }, { equation: "30 / 3 - 27", swap: ["-", "="] }, { equation: "6 + 6 * 36", swap: ["*", "="] }, { equation: "10 - 4 * 40", swap: ["*", "="] }, { equation: "25 / 5 - 20", swap: ["-", "="] }, { equation: "9 + 9 * 81", swap: ["*", "="] }] },

    // 🔢 LEVELS 11–20: DIGIT POSITION LOGIC
    { level: 11, description: "Digit Position", hint: "The numbers are right. Their order isn’t.", variations: [ { equation: "21 + 3 = 18", swap: ["1", "5"] }, { equation: "41 + 2 = 61", swap: ["1", "6"] }, { equation: "51 + 4 = 91", swap: ["1", "9"] }, { equation: "31 + 5 = 81", swap: ["1", "8"] }, { equation: "61 + 3 = 91", swap: ["1", "9"] }, { equation: "81 + 1 = 91", swap: ["1", "9"] }, { equation: "71 + 2 = 91", swap: ["1", "9"] }, { equation: "11 + 8 = 91", swap: ["1", "9"] }, { equation: "91 + 0 = 91", swap: ["0", "1"] }, { equation: "10 + 9 = 91", swap: ["0", "9"] }] },
    { level: 12, description: "Digit Position", hint: "Swap two digits to make the math work.", variations: [ { equation: "23 + 5 = 28", swap: ["3", "1"] }, { equation: "27 + 4 = 72", swap: ["7", "3"] }, { equation: "20 - 5 = 2", swap: ["0", "5"] }, { equation: "35 - 5 = 2", swap: ["5", "0"] }, { equation: "4 * 5 = 25", swap: ["5", "0"] }, { equation: "6 * 3 = 16", swap: ["6", "8"] }, { equation: "42 / 7 = 8", swap: ["2", "6"] }, { equation: "36 / 6 = 8", swap: ["6", "8"] }, { equation: "22 + 5 = 27", swap: ["2", "4"] }, { equation: "12 - 6 = 16", swap: ["2", "8"] }] },
    { level: 13, description: "Digit Position", hint: "One number is in the wrong spot.", variations: [ { equation: "52 - 9 = 49", swap: ["2", "1"] }, { equation: "67 / 9 = 6", swap: ["7", "3"] }, { equation: "40 + 5 = 54", swap: ["0", "5"] }, { equation: "34 * 2 = 62", swap: ["4", "2"] }, { equation: "20 + 3 = 37", swap: ["0", "7"] }, { equation: "18 * 2 = 39", swap: ["8", "9"] }, { equation: "89 / 9 = 8", swap: ["9", "1"] }, { equation: "59 - 7 = 47", swap: ["9", "6"] }, { equation: "22 + 4 = 34", swap: ["2", "8"] }, { equation: "79 / 8 = 8", swap: ["9", "2"] }] },
    { level: 14, description: "Digit Position", hint: "Just two digits need to switch places.", variations: [ { equation: "15 + 13 = 21", swap: ["5", "1"] }, { equation: "20 - 10 = 10", swap: ["0", "5"] }, { equation: "18 * 2 = 24", swap: ["8", "4"] }, { equation: "32 / 3 = 13", swap: ["2", "3"] }, { equation: "18 + 11 = 21", swap: ["8", "1"] }, { equation: "45 - 15 = 20", swap: ["5", "0"] }, { equation: "11 * 1 = 19", swap: ["1", "9"] }, { equation: "55 / 5 = 15", swap: ["5", "0"] }, { equation: "23 + 11 = 32", swap: ["3", "2"] }, { equation: "32 - 11 = 23", swap: ["2", "3"] }] },
    { level: 15, description: "Digit Position", hint: "All the right numbers, just not in the right order.", variations: [ { equation: "191 - 10 = 81", swap: ["9", "0"] }, { equation: "20 * 5 = 125", swap: ["0", "5"] }, { equation: "91 + 2 = 100", swap: ["1", "9"] }, { equation: "66 / 4 = 14", swap: ["6", "4"] }, { equation: "70 + 25 = 105", swap: ["0", "5"] }, { equation: "129 - 21 = 90", swap: ["9", "1"] }, { equation: "11 * 7 = 97", swap: ["1", "7"] }, { equation: "142 / 12 = 14", swap: ["2", "4"] }, { equation: "51 + 50 = 100", swap: ["1", "0"] }, { equation: "290 - 101 = 90", swap: ["9", "0"] }] },
    { level: 16, description: "Digit Position", hint: "Look for the number that feels out of place.", variations: [ { equation: "3 * 13 = 45", swap: ["3", "5"] }, { equation: "16 * 6 = 72", swap: ["6", "2"] }, { equation: "105 / 5 = 20", swap: ["5", "0"] }, { equation: "80 - 18 = 78", swap: ["0", "8"] }, { equation: "40 + 33 = 83", swap: ["0", "3"] }, { equation: "10 + 89 = 100", swap: ["0", "9"] }, { equation: "24 * 4 = 81", swap: ["4", "1"] }, { equation: "92 / 3 = 36", swap: ["2", "6"] }, { equation: "59 + 44 = 94", swap: ["9", "4"] }, { equation: "79 - 18 = 59", swap: ["9", "8"] }] },
    { level: 17, description: "Digit Position", hint: "A single digit swap will make it all make sense.", variations: [ { equation: "12 * 11 = 121", swap: ["2", "1"] }, { equation: "14 * 12 = 142", swap: ["4", "2"] }, { equation: "19 * 13 = 163", swap: ["9", "3"] }, { equation: "16 * 14 = 194", swap: ["6", "4"] }, { equation: "11 * 15 = 225", swap: ["1", "5"] }, { equation: "11 * 16 = 256", swap: ["1", "6"] }, { equation: "19 * 17 = 287", swap: ["9", "7"] }, { equation: "14 * 18 = 328", swap: ["4", "8"] }, { equation: "11 * 19 = 369", swap: ["1", "9"] }, { equation: "22 * 20 = 400", swap: ["2", "0"] }] },
    { level: 18, description: "Digit Position", hint: "The digits for the answer are there, just scrambled.", variations: [ { equation: "20 * 4 = 104", swap: ["0", "4"] }, { equation: "75 / 3 = 23", swap: ["3", "5"] }, { equation: "32 + 41 = 71", swap: ["2", "1"] }, { equation: "96 - 19 = 79", swap: ["6", "9"] }, { equation: "10 * 5 = 95", swap: ["0", "5"] }, { equation: "156 / 6 = 25", swap: ["6", "5"] }, { equation: "60 + 23 = 93", swap: ["0", "3"] }, { equation: "83 - 18 = 61", swap: ["3", "1"] }, { equation: "28 * 4 = 84", swap: ["8", "2"] }, { equation: "47 / 7 = 4", swap: ["7", "9"] }] },
    { level: 19, description: "Digit Position", hint: "Two numbers are switched. Can you spot them?", variations: [ { equation: "1 + 8 = 18", swap: ["1", "3"] }, { equation: "16 - 9 = 9", swap: ["6", "9"] }, { equation: "7 * 9 = 47", swap: ["9", "7"] }, { equation: "ええと、`_` は `+` ではありません。`6 * 8 = 6", swap: ["6", "4"] }, { equation: "29 + 9 = 32", swap: ["9", "2"] }, { equation: "55 - 25 = 20", swap: ["5", "0"] }, { equation: "12 * 8 = 109", swap: ["8", "9"] }, { equation: "89 / 9 = 8", swap: ["9", "1"] }, { equation: "40 + 53 = 103", swap: ["0", "3"] }, { equation: "119 - 11 = 99", swap: ["9", "1"] }] },
    { level: 20, description: "Digit Position", hint: "The equation looks complex, but the fix is a simple digit swap.", variations: [ { equation: "12 * 16 = 153", swap: ["6", "3"] }, { equation: "11 * 15 = 225", swap: ["1", "5"] }, { equation: "14 * 14 = 226", swap: ["4", "6"] }, { equation: "18 * 16 = 212", swap: ["6", "2"] }, { equation: "20 * 5 = 125", swap: ["0", "5"] }, { equation: "19 * 19 = 201", swap: ["9", "1"] }, { equation: "20 * 10 = 202", swap: ["0", "2"] }, { equation: "21 * 11 = 273", swap: ["1", "3"] }, { equation: "17 * 18 = 234", swap: ["8", "4"] }, { equation: "22 * 8 = 198", swap: ["2", "8"] }] },

    // 🧮 LEVELS 21–30: ORDER OF OPERATIONS (PEMDAS)
    { level: 21, description: "Order of Operations", hint: "Which operation should happen first?", variations: [ { equation: "2 + 4 * 3 = 18", swap: ["+", "*"] }, { equation: "3 + 5 * 2 = 16", swap: ["+", "*"] }, { equation: "4 + 6 * 2 = 20", swap: ["+", "*"] }, { equation: "1 + 7 * 3 = 24", swap: ["+", "*"] }, { equation: "5 + 2 * 4 = 28", swap: ["+", "*"] }, { equation: "6 + 3 * 2 = 18", swap: ["+", "*"] }, { equation: "8 + 2 * 2 = 20", swap: ["+", "*"] }, { equation: "7 + 4 * 1 = 11", swap: ["+", "*"] }, { equation: "9 + 3 * 1 = 12", swap: ["+", "*"] }, { equation: "2 + 5 * 4 = 28", swap: ["+", "*"] }] },
    { level: 22, description: "Order of Operations", hint: "Remember: Multiplication before Addition.", variations: [ { equation: "3 + 5 * 3 = 24", swap: ["3", "5"] }, { equation: "4 + 6 * 2 = 14", swap: ["4", "6"] }, { equation: "10 - 2 * 3 = 24", swap: ["-", "*"] }, { equation: "8 / 6 + 2 = 7", swap: ["/", "+"] }, { equation: "12 - 4 * 2 = 16", swap: ["-", "*"] }, { equation: "7 + 2 * 5 = 45", swap: ["+", "*"] }, { equation: "20 / 5 + 1 = 5", swap: ["+", "-"] }, { equation: "9 * 2 - 5 = 13", swap: ["*", "-"] }, { equation: "15 / 10 - 5 = 1", swap: ["/", "-"] }, { equation: "3 * 4 + 5 = 27", swap: ["+", "*"] }] },
    { level: 23, description: "Order of Operations", hint: "A digit or an operator might be in the wrong place.", variations: [ { equation: "5 * 2 + 3 = 25", swap: ["+", "*"] }, { equation: "10 / 2 + 3 = 2", swap: ["+", "-"] }, { equation: "12 / 8 + 4 = 5", swap: ["/", "+"] }, { equation: "20 - 5 * 2 = 30", swap: ["-", "*"] }, { equation: "9 * 3 - 3 = 24", swap: ["*", "-"] }, { equation: "18 / 6 + 3 = 6", swap: ["+", "-"] }, { equation: "7 * 4 + 2 = 30", swap: ["*", "+"] }, { equation: "16 / 2 - 4 = 4", swap: ["-", "/"] }, { equation: "1 + 9 * 2 = 20", swap: ["+", "*"] }, { equation: "25 - 5 * 5 = 0", swap: ["-", "/"] }] },
    { level: 24, description: "Order of Operations", hint: "Think about the sequence of calculations.", variations: [ { equation: "10 - 3 * 2 = 14", swap: ["-", "*"] }, { equation: "15 / 3 + 2 = 3", swap: ["+", "-"] }, { equation: "5 * 4 + 1 = 25", swap: ["+", "*"] }, { equation: "18 / 6 - 3 = 4", swap: ["/", "-"] }, { equation: "8 + 2 * 3 = 30", swap: ["+", "*"] }, { equation: "24 / 4 - 2 = 8", swap: ["-", "*"] }, { equation: "7 * 3 + 4 = 49", swap: ["+", "*"] }, { equation: "21 / 7 - 4 = 1", swap: ["/", "-"] }, { equation: "6 + 5 * 2 = 22", swap: ["+", "*"] }, { equation: "30 / 5 + 1 = 5", swap: ["+", "-"] }] },
    { level: 25, description: "Order of Operations", hint: "It's a puzzle of priority.", variations: [ { equation: "4 * 5 - 10 = 10", swap: ["-", "/"] }, { equation: "36 / 6 + 6 = 12", swap: ["+", "-"] }, { equation: "100 - 10 * 9 = 10", swap: ["-", "/"] }, { equation: "50 + 50 / 10 = 10", swap: ["+", "-"] }, { equation: "1 + 2 * 3 = 9", swap: ["+", "*"] }, { equation: "9 - 3 / 3 = 2", swap: ["/", "-"] }, { equation: "4 * 2 + 8 = 40", swap: ["+", "*"] }, { equation: "16 / 4 + 4 = 8", swap: ["+", "-"] }, { equation: "10 * 10 - 10 = 90", swap: ["*", "-"] }, { equation: "25 / 5 + 5 = 10", swap: ["+", "-"] }] },
    { level: 26, description: "Order of Operations", hint: "Multiplication and division come before addition and subtraction.", variations: [ { equation: "7 + 3 * 2 = 20", swap: ["7", "3"] }, { equation: "10 - 4 / 2 = 8", swap: ["4", "10"] }, { equation: "2 * 5 + 6 = 16", swap: ["2", "5"] }, { equation: "18 / 3 + 3 = 9", swap: ["3", "18"] }, { equation: "1 + 9 * 5 = 14", swap: ["1", "9"] }, { equation: "20 - 8 / 4 = 18", swap: ["8", "20"] }, { equation: "3 * 6 + 9 = 27", swap: ["3", "6"] }, { equation: "32 / 8 + 4 = 8", swap: ["8", "32"] }, { equation: "8 + 4 * 2 = 20", swap: ["8", "4"] }, { equation: "40 - 10 / 2 = 35", swap: ["10", "40"] }] },
    { level: 27, description: "Order of Operations", hint: "Look for the element that breaks the mathematical rules.", variations: [ { equation: "2 * 8 - 6 = 10", swap: ["2", "8"] }, { equation: "24 / 6 + 2 = 6", swap: ["6", "24"] }, { equation: "10 + 3 * 4 = 22", swap: ["3", "10"] }, { equation: "30 - 9 / 3 = 27", swap: ["9", "30"] }, { equation: "5 * 7 - 10 = 25", swap: ["5", "7"] }, { equation: "48 / 8 + 2 = 8", swap: ["8", "48"] }, { equation: "11 + 4 * 5 = 31", swap: ["4", "11"] }, { equation: "60 - 12 / 6 = 58", swap: ["12", "60"] }, { equation: "9 * 4 - 11 = 25", swap: ["4", "9"] }, { equation: "72 / 9 + 3 = 11", swap: ["9", "72"] }] },
    { level: 28, description: "Order of Operations", hint: "The structure is complex, but the fix is simple.", variations: [ { equation: "13 + 5 * 2 = 23", swap: ["5", "13"] }, { equation: "45 / 9 - 3 = 2", swap: ["9", "45"] }, { equation: "17 - 6 * 2 = 5", swap: ["6", "17"] }, { equation: "10 * 3 + 7 = 37", swap: ["3", "10"] }, { equation: "81 / 9 - 0 = 9", swap: ["0", "81"] }, { equation: "19 + 2 * 3 = 25", swap: ["2", "19"] }, { equation: "54 / 6 - 3 = 6", swap: ["6", "54"] }, { equation: "22 - 7 * 2 = 8", swap: ["7", "22"] }, { equation: "16 * 2 + 5 = 37", swap: ["2", "16"] }, { equation: "99 / 11 - 2 = 7", swap: ["11", "99"] }] },
    { level: 29, description: "Order of Operations", hint: "Remember PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction).", variations: [ { equation: "10 * 2 + 3 = 50", swap: ["+", "*"] }, { equation: "20 / 4 - 2 = 2", swap: ["-", "/"] }, { equation: "6 + 3 * 5 = 45", swap: ["+", "*"] }, { equation: "40 / 10 - 5 = 6", swap: ["/", "-"] }, { equation: "8 * 4 + 2 = 48", swap: ["+", "*"] }, { equation: "50 / 5 - 5 = 5", swap: ["-", "/"] }, { equation: "7 + 2 * 6 = 54", swap: ["+", "*"] }, { equation: "100 / 20 - 5 = 16", swap: ["/", "-"] }, { equation: "9 * 3 + 3 = 36", swap: ["+", "*"] }, { equation: "36 / 6 - 3 = 9", swap: ["-", "/"] }] },
    { level: 30, description: "Order of Operations", hint: "Find the single swap that respects the order of operations.", variations: [ { equation: "12 / 10 + 2 = 11", swap: ["/", "+"] }, { equation: "24 - 8 * 2 = 32", swap: ["-", "*"] }, { equation: "5 * 5 + 5 = 30", swap: ["+", "*"] }, { equation: "72 / 9 - 1 = 7", swap: ["-", "/"] }, { equation: "14 + 6 * 3 = 60", swap: ["+", "*"] }, { equation: "48 / 8 - 2 = 4", swap: ["-", "/"] }, { equation: "11 * 5 + 4 = 59", swap: ["+", "*"] }, { equation: "81 / 9 - 9 = 0", swap: ["-", "+"] }, { equation: "13 + 7 * 2 = 40", swap: ["+", "*"] }, { equation: "64 / 8 - 4 = 4", swap: ["-", "/"] }] },

    // 🧩 LEVELS 31–40: MISSING VALUE (PRE-ALGEBRA)
    { level: 31, description: "Fill in the Blank", hint: "What number is missing?", variations: [ { equation: "_ + 6 = 10", swap: ["_", "4"] }, { equation: "_ + 7 = 12", swap: ["_", "5"] }, { equation: "_ + 4 = 9", swap: ["_", "5"] }, { equation: "_ + 8 = 13", swap: ["_", "5"] }, { equation: "_ + 5 = 11", swap: ["_", "6"] }, { equation: "_ + 9 = 14", swap: ["_", "5"] }, { equation: "_ + 3 = 7", swap: ["_", "4"] }, { equation: "_ + 2 = 6", swap: ["_", "4"] }, { equation: "_ + 1 = 4", swap: ["_", "3"] }, { equation: "_ + 10 = 15", swap: ["_", "5"] }] },
    { level: 32, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", variations: [ { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] }, { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] }, { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] }, { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] }, { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }] },
    { level: 33, description: "Fill in the Blank", hint: "What times 3 equals 21?", variations: [ { equation: "_ * 3 = 21", swap: ["_", "7"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] }, { equation: "_ * 4 = 36", swap: ["_", "9"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] }, { equation: "_ * 8 = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] }, { equation: "_ * 9 = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] }, { equation: "_ * 10 = 100", swap: ["_", "10"] }, { equation: "_ * 11 = 121", swap: ["_", "11"] }] },
    { level: 34, description: "Fill in the Blank", hint: "A number is missing from the equation.", variations: [ { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] }, { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] }, { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] }, { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }] },
    { level: 35, description: "Fill in the Blank", hint: "Swap the correct number into the blank space.", variations: [ { equation: "10 + _ = 18", swap: ["_", "8"] }, { equation: "25 - _ = 17", swap: ["_", "8"] }, { equation: "6 * _ = 54", swap: ["_", "9"] }, { equation: "77 / _ = 7", swap: ["_", "11"] }, { equation: "13 + _ = 21", swap: ["_", "8"] }, { equation: "30 - _ = 19", swap: ["_", "11"] }, { equation: "8 * _ = 72", swap: ["_", "9"] }, { equation: "96 / _ = 8", swap: ["_", "12"] }, { equation: "21 + _ = 30", swap: ["_", "9"] }, { equation: "42 - _ = 29", swap: ["_", "13"] }] },
    { level: 36, description: "Blank + Multi-digit", hint: "Solve backwards from the answer.", variations: [ { equation: "_ + 6 = 14", swap: ["_", "8"] }, { equation: "3 * _ = 18", swap: ["_", "6"] }, { equation: "_ + 9 = 21", swap: ["_", "12"] }, { equation: "45 / _ = 3", swap: ["_", "15"] }, { equation: "_ - 7 = 15", swap: ["_", "22"] }, { equation: "5 * _ = 35", swap: ["_", "7"] }, { equation: "_ + 11 = 25", swap: ["_", "14"] }, { equation: "60 / _ = 5", swap: ["_", "12"] }, { equation: "_ - 12 = 12", swap: ["_", "24"] }, { equation: "2 * _ = 32", swap: ["_", "16"] }] },
    { level: 37, description: "Blank + Multi-digit", hint: "What single digit completes the equation?", variations: [ { equation: "_ * 12 = 36", swap: ["_", "3"] }, { equation: "100 - _ = 85", swap: ["_", "15"] }, { equation: "25 + _ = 41", swap: ["_", "16"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "_ * 9 = 108", swap: ["_", "12"] }, { equation: "75 - _ = 50", swap: ["_", "25"] }, { equation: "50 + _ = 77", swap: ["_", "27"] }, { equation: "132 / _ = 11", swap: ["_", "12"] }, { equation: "_ * 8 = 96", swap: ["_", "12"] }, { equation: "200 - _ = 175", swap: ["_", "25"] }] },
    { level: 38, description: "Blank + Multi-digit", hint: "Find the missing number to balance the equation.", variations: [ { equation: "13 * _ = 39", swap: ["_", "3"] }, { equation: "_ - 20 = 35", swap: ["_", "55"] }, { equation: "42 + _ = 60", swap: ["_", "18"] }, { equation: "125 / _ = 25", swap: ["_", "5"] }, { equation: "15 * _ = 75", swap: ["_", "5"] }, { equation: "_ - 30 = 45", swap: ["_", "75"] }, { equation: "60 + _ = 99", swap: ["_", "39"] }, { equation: "250 / _ = 25", swap: ["_", "10"] }, { equation: "11 * _ = 132", swap: ["_", "12"] }, { equation: "_ - 50 = 100", swap: ["_", "150"] }] },
    { level: 39, description: "Blank + Multi-digit", hint: "A single swap will solve it.", variations: [ { equation: "14 * _ = 56", swap: ["_", "4"] }, { equation: "80 - _ = 65", swap: ["_", "15"] }, { equation: "_ + 35 = 55", swap: ["_", "20"] }, { equation: "90 / _ = 6", swap: ["_", "15"] }, { equation: "16 * _ = 64", swap: ["_", "4"] }, { equation: "120 - _ = 95", swap: ["_", "25"] }, { equation: "_ + 45 = 70", swap: ["_", "25"] }, { equation: "105 / _ = 7", swap: ["_", "15"] }, { equation: "18 * _ = 72", swap: ["_", "4"] }, { equation: "150 - _ = 125", swap: ["_", "25"] }] },
    { level: 40, description: "Blank + Multi-digit", hint: "Focus on the relationship between the numbers.", variations: [ { equation: "19 * _ = 95", swap: ["_", "5"] }, { equation: "_ - 15 = 85", swap: ["_", "100"] }, { equation: "70 + _ = 110", swap: ["_", "40"] }, { equation: "180 / _ = 9", swap: ["_", "20"] }, { equation: "22 * _ = 88", swap: ["_", "4"] }, { equation: "_ - 25 = 125", swap: ["_", "150"] }, { equation: "90 + _ = 130", swap: ["_", "40"] }, { equation: "200 / _ = 8", swap: ["_", "25"] }, { equation: "24 * _ = 120", swap: ["_", "5"] }, { equation: "_ - 75 = 125", swap: ["_", "200"] }] },

    // 🔥 LEVELS 41–50: MIXED LOGIC (ELITE)
    { level: 41, description: "Mixed Logic", hint: "Solve backwards.", variations: [ { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "_ * 3 + 1 = 13", swap: ["_", "4"] }, { equation: "_ * 5 - 5 = 20", swap: ["_", "5"] }, { equation: "_ * 6 / 2 = 9", swap: ["_", "3"] }, { equation: "_ * 2 + 4 = 14", swap: ["_", "5"] }, { equation: "_ * 7 - 7 = 21", swap: ["_", "4"] }, { equation: "_ * 3 + 6 = 15", swap: ["_", "3"] }, { equation: "_ * 8 / 4 = 6", swap: ["_", "3"] }, { equation: "_ * 9 - 9 = 27", swap: ["_", "4"] }, { equation: "_ * 10 / 5 = 8", swap: ["_", "4"] }] },
    { level: 42, description: "Mixed Logic", hint: "What needs to happen first?", variations: [ { equation: "10 + _ * 2 = 24", swap: ["_", "7"] }, { equation: "20 - _ * 3 = 8", swap: ["_", "4"] }, { equation: "5 * _ + 5 = 30", swap: ["_", "5"] }, { equation: "30 / _ + 2 = 7", swap: ["_", "6"] }, { equation: "8 + _ * 4 = 20", swap: ["_", "3"] }, { equation: "40 - _ * 5 = 15", swap: ["_", "5"] }, { equation: "6 * _ + 8 = 32", swap: ["_", "4"] }, { equation: "50 / _ - 3 = 7", swap: ["_", "5"] }, { equation: "12 + _ * 3 = 30", swap: ["_", "6"] }, { equation: "100 - _ * 10 = 0", swap: ["_", "10"] }] },
    { level: 43, description: "Mixed Logic", hint: "Two steps. One swap.", variations: [ { equation: "3 * 4 + _ = 18", swap: ["_", "6"] }, { equation: "5 * 6 - _ = 20", swap: ["_", "10"] }, { equation: "20 / 4 + _ = 9", swap: ["_", "4"] }, { equation: "18 / 6 - _ = 1", swap: ["_", "2"] }, { equation: "2 * 8 + _ = 22", swap: ["_", "6"] }, { equation: "7 * 3 - _ = 15", swap: ["_", "6"] }, { equation: "36 / 4 + _ = 15", swap: ["_", "6"] }, { equation: "40 / 8 - _ = 2", swap: ["_", "3"] }, { equation: "5 * 7 + _ = 40", swap: ["_", "5"] }, { equation: "60 / 10 - _ = 0", swap: ["_", "6"] }] },
    { level: 44, description: "Mixed Logic", hint: "Find the single incorrect symbol.", variations: [ { equation: "4 + 5 * _ = 19", swap: ["_", "3"] }, { equation: "25 - 2 * _ = 15", swap: ["_", "5"] }, { equation: "8 * 2 + _ = 20", swap: ["_", "4"] }, { equation: "42 / 7 - _ = 3", swap: ["_", "3"] }, { equation: "9 + 3 * _ = 18", swap: ["_", "3"] }, { equation: "32 - 4 * _ = 16", swap: ["_", "4"] }, { equation: "6 * 5 + _ = 33", swap: ["_", "3"] }, { equation: "54 / 9 - _ = 2", swap: ["_", "4"] }, { equation: "11 + 6 * _ = 29", swap: ["_", "3"] }, { equation: "70 - 7 * _ = 21", swap: ["_", "7"] }] },
    { level: 45, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", variations: [ { equation: "6 + _ * 3 = 21", swap: ["_", "5"] }, { equation: "4 * _ - 7 = 21", swap: ["_", "7"] }, { equation: "50 / _ + 5 = 10", swap: ["_", "10"] }, { equation: "100 - _ * 9 = 10", swap: ["_", "10"] }, { equation: "1 + 9 * _ = 28", swap: ["_", "3"] }, { equation: "8 * _ - 10 = 30", swap: ["_", "5"] }, { equation: "72 / _ + 4 = 12", swap: ["_", "9"] }, { equation: "60 - _ * 7 = 25", swap: ["_", "5"] }, { equation: "2 + _ * 8 = 34", swap: ["_", "4"] }, { equation: "99 / _ - 1 = 10", swap: ["_", "9"] }] },
    { level: 46, description: "Evil Genius", hint: "There is only one valid swap.", variations: [ { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "6 + 2 * _ = 24", swap: ["_", "9"] }, { equation: "30 / 3 - _ = 5", swap: ["_", "5"] }, { equation: "5 * _ - 9 = 26", swap: ["_", "7"] }, { equation: "_ * 7 + 7 = 49", swap: ["_", "6"] }, { equation: "12 + 10 / _ = 14", swap: ["_", "5"] }, { equation: "45 / _ - 5 = 4", swap: ["_", "9"] }, { equation: "8 * _ + 12 = 44", swap: ["_", "4"] }, { equation: "_ * 11 - 10 = 89", swap: ["_", "9"] }, { equation: "100 / _ + 15 = 25", swap: ["_", "10"] }] },
    { level: 47, description: "Evil Genius", hint: "Think outside the box. Digits can move anywhere.", variations: [ { equation: "5 * 6 + 4 = 32", swap: ["4", "2"] }, { equation: "9 * 4 - 0 = 36", swap: ["0", "6"] }, { equation: "40 / 2 + 7 = 18", swap: ["2", "8"] }, { equation: "2 + 7 * 7 = 39", swap: ["7", "9"] }, { equation: "18 + 24 / 4 = 20", swap: ["0", "4"] }, { equation: "10 * 10 - 9 = 91", swap: ["9", "1"] }, { equation: "81 / 9 + 8 = 19", swap: ["8", "9"] }, { equation: "3 * 15 - 0 = 45", swap: ["0", "5"] }, { equation: "60 / 6 + 6 = 14", swap: ["6", "4"] }, { equation: "22 + 2 * 8 = 38", swap: ["2", "8"] }] },
    { level: 48, description: "Evil Genius", hint: "It might be an operator swap, or it might be a digit.", variations: [ { equation: "12 * 4 + 8 = 60", swap: ["+", "*"] }, { equation: "50 / 10 - 5 = 8", swap: ["/", "-"] }, { equation: "7 + 3 * 9 = 90", swap: ["+", "*"] }, { equation: "100 / 5 - 5 = 15", swap: ["/", "-"] }, { equation: "9 * 5 + 5 = 50", swap: ["+", "*"] }, { equation: "64 / 8 + 0 = 8", swap: ["+", "-"] }, { equation: "13 * 3 + 1 = 40", swap: ["+", "*"] }, { equation: "49 / 7 - 0 = 7", swap: ["-", "+"] }, { equation: "11 * 8 + 2 = 90", swap: ["+", "*"] }, { equation: "33 / 3 - 0 = 11", swap: ["-", "+"] }] },
    { level: 49, description: "Evil Genius", hint: "The answer seems impossible until you find the swap.", variations: [ { equation: "9 * 9 - 2 = 79", swap: ["2", "9"] }, { equation: "8 * 8 - 6 = 58", swap: ["6", "8"] }, { equation: "7 * 7 - 2 = 47", swap: ["2", "7"] }, { equation: "6 * 6 - 0 = 36", swap: ["0", "6"] }, { equation: "5 * 5 - 0 = 25", swap: ["0", "5"] }, { equation: "12 * 12 - 12 = 131", swap: ["1", "2"] }, { equation: "11 * 11 - 10 = 111", swap: ["0", "1"] }, { equation: "10 * 10 - 0 = 99", swap: ["0", "9"] }, { equation: "13 * 13 - 16 = 151", swap: ["6", "3"] }, { equation: "14 * 14 - 12 = 182", swap: ["2", "4"] }] },
    { level: 50, description: "Evil Genius", hint: "Congratulations on reaching the final challenge.", variations: [ { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "6 + _ * 3 = 21", swap: ["_", "5"] }, { equation: "45 / _ + 5 = 14", swap: ["_", "5"] }, { equation: "100 - _ * 9 = 19", swap: ["_", "9"] }, { equation: "1 + 9 * _ = 28", swap: ["_", "3"] }, { equation: "8 * _ - 10 = 30", swap: ["_", "5"] }, { equation: "72 / _ + 4 = 13", swap: ["_", "8"] }, { equation: "60 - _ * 7 = 25", swap: ["_", "5"] }, { equation: "2 + _ * 8 = 34", swap: ["_", "4"] }, { equation: "99 / _ - 1 = 10", swap: ["_", "9"] }] },
];

/**
 * Gets the configuration for a given level.
 * @param level The player's current level (0-indexed).
 * @returns The MathLevel object for that level.
 */
export function getMathPuzzleConfig(level: number): MathLevel {
    const levelConfig = mathLevels.find(l => l.level === level + 1);
    if (!levelConfig) {
        console.warn(`No config for level ${level + 1}, falling back to level 1.`);
        return mathLevels[0]; // Fallback to level 1
    }
    return levelConfig;
}

/**
 * Generates a puzzle for a given level using the curated puzzle library.
 * This is now an instant lookup, not a slow procedural generation.
 */
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
    const config = getMathPuzzleConfig(level);
    
    // Use retryCount to pick a different variation if the player retries the same level
    const variationIndex = retryCount % config.variations.length;
    const template = config.variations[variationIndex];

    const initialBoard = toTiles(template.equation);
    const swappedIndices = findSwapIndices(initialBoard, template.swap);
    
    const correctBoardTiles = [...initialBoard];
    if (swappedIndices.every(i => i >= 0 && i < correctBoardTiles.length)) {
        const [idx1, idx2] = swappedIndices;
        const val1 = toTiles(template.swap[0])[0]?.value;
        const val2 = toTiles(template.swap[1])[0]?.value;
        
        // This logic correctly performs the swap for all puzzle types
        // by figuring out which value is on the board and which is the target.
        if (correctBoardTiles[idx1].value === val1 && correctBoardTiles[idx2].value !== val2) {
             [correctBoardTiles[idx1].value, correctBoardTiles[idx2].value] = [val2, val1];
        } else if (correctBoardTiles[idx1].value !== val1 && correctBoardTiles[idx2].value === val2) {
             [correctBoardTiles[idx1].value, correctBoardTiles[idx2].value] = [val2, val1];
        } else {
             [correctBoardTiles[idx1].value, correctBoardTiles[idx2].value] = [correctBoardTiles[idx2].value, correctBoardTiles[idx1].value];
        }
    }
    
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

    