'use client';

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

interface PuzzleVariation {
    equation: string;
    swap: [string, string];
}

export interface MathLevel {
    level: number;
    description: string;
    hint: string;
    variations: PuzzleVariation[];
}


/**
 * Converts an equation string into an array of TileValue.
 * e.g., "3 + 3 = 6" -> [3, '+', 3, '=', 6]
 */
const toValues = (equation: string): TileValue[] => {
    // Add spaces around operators to ensure clean splitting, but not for multi-digit numbers.
    const spacedEquation = equation.replace(/([+\-*/=])/g, ' $1 ');
    const parts = spacedEquation.split(' ').filter(p => p.trim() !== '');
    
    const values: TileValue[] = [];
    for (const part of parts) {
        if (!isNaN(Number(part))) {
             // Handle multi-digit numbers by splitting them into individual digits
             for (const char of part) {
                values.push(parseInt(char, 10));
             }
        } else {
            values.push(part);
        }
    }
    return values;
};


/**
 * Converts an array of TileValues into an array of Tile objects.
 * Locks operators and the equals sign by default.
 */
const toTiles = (values: TileValue[]): Tile[] => {
    return values.map(value => ({
        value,
        isLocked: ['+', '-', '*', '/', '='].includes(value as string),
    }));
};


/**
 * A robust function to find the indices of the two tiles that differ
 * between the scrambled board and the correct solution.
 */
const findSwapIndices = (scrambledValues: TileValue[], correctValues: TileValue[]): [number, number] => {
    const diffIndices: number[] = [];
    const limit = Math.max(scrambledValues.length, correctValues.length);

    for (let i = 0; i < limit; i++) {
        if (scrambledValues[i] !== correctValues[i]) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 2) {
        return [diffIndices[0], diffIndices[1]];
    }

    // This is a critical fallback. If this happens, the puzzle template is wrong.
    console.error("CRITICAL: Could not find exactly two differing indices. Check puzzle template.", {
        scrambled: scrambledValues,
        correct: correctValues,
    });
    // Return a default, non-crashing value.
    return [0, 1];
};


/**
 * Takes a correct equation string and a pair of values to swap,
 * and returns the scrambled equation string.
 */
const createScrambledEquation = (correctEquation: string, swapPair: [string, string]): string => {
    const [val1, val2] = swapPair;

    // This function will be very careful about swapping to avoid issues.
    // It will find the first occurrence of each value and swap them.
    const parts = correctEquation.split(' ');
    const index1 = parts.indexOf(val1);
    const index2 = parts.indexOf(val2);

    if (index1 !== -1 && index2 !== -1) {
        [parts[index1], parts[index2]] = [parts[index2], parts[index1]];
        return parts.join(' ');
    }
    
    // This indicates a misconfigured puzzle template.
    console.error(`Swap pair [${val1}, ${val2}] is invalid for equation "${correctEquation}"`);
    return correctEquation; // Return original on error
};


export const mathLevels: MathLevel[] = [
    // 🔰 LEVELS 1–10: BASIC SWAPS
    {
        level: 1, description: "Basic Arithmetic", hint: "The numbers look right, but is the operation correct?",
        variations: [
            { equation: "3 + 3 = 6", swap: ["+", "6"] }, { equation: "4 + 2 = 6", swap: ["4", "6"] },
            { equation: "5 - 1 = 4", swap: ["-", "4"] }, { equation: "8 - 2 = 6", swap: ["8", "6"] },
            { equation: "9 - 3 = 6", swap: ["-", "6"] }, { equation: "2 * 3 = 6", swap: ["*", "6"] },
            { equation: "4 * 2 = 8", swap: ["4", "8"] }, { equation: "8 / 2 = 4", swap: ["/", "4"] },
            { equation: "9 / 3 = 3", swap: ["/", "3"] }, { equation: "5 + 2 = 7", swap: ["5", "7"] }
        ]
    },
    {
        level: 2, description: "Simple Swaps", hint: "Two numbers have traded places.",
        variations: [
            { equation: "1 + 8 = 9", swap: ["1", "9"] }, { equation: "7 - 1 = 6", swap: ["1", "6"] },
            { equation: "4 * 2 = 8", swap: ["2", "8"] }, { equation: "6 / 2 = 3", swap: ["2", "3"] },
            { equation: "3 + 4 = 7", swap: ["3", "7"] }, { equation: "9 - 2 = 7", swap: ["2", "7"] },
            { equation: "5 * 1 = 5", swap: ["1", "5"] }, { equation: "4 / 2 = 2", swap: ["4", "2"] },
            { equation: "2 + 6 = 8", swap: ["2", "8"] }, { equation: "8 - 3 = 5", swap: ["3", "5"] }
        ]
    },
    {
        level: 3, description: "Operator vs Number", hint: "Is it an operation that's wrong, or a number?",
        variations: [
            { equation: "10 - 5 = 5", swap: ["-", "5"] }, { equation: "3 * 4 = 12", swap: ["*", "1"] },
            { equation: "9 + 9 = 18", swap: ["9", "8"] }, { equation: "16 / 4 = 4", swap: ["/", "4"] },
            { equation: "7 + 8 = 15", swap: ["7", "1"] }, { equation: "14 - 7 = 7", swap: ["-", "7"] },
            { equation: "6 * 3 = 18", swap: ["3", "8"] }, { equation: "15 / 3 = 5", swap: ["/", "5"] },
            { equation: "5 + 7 = 12", swap: ["7", "2"] }, { equation: "20 - 10 = 10", swap: ["-", "1"] }
        ]
    },
    { 
        level: 4, description: "Basic Logic", hint: "A single swap will make it all add up.", 
        variations: [ 
            { equation: "2 + 7 = 9", swap: ["2", "9"] }, { equation: "8 - 3 = 5", swap: ["3", "5"] }, 
            { equation: "9 * 1 = 9", swap: ["1", "9"] }, { equation: "6 / 3 = 2", swap: ["3", "2"] }, 
            { equation: "4 + 4 = 8", swap: ["4", "8"] }, { equation: "9 - 4 = 5", swap: ["4", "5"] }, 
            { equation: "3 * 2 = 6", swap: ["2", "6"] }, { equation: "8 / 4 = 2", swap: ["4", "2"] }, 
            { equation: "5 + 3 = 8", swap: ["3", "8"] }, { equation: "7 - 2 = 5", swap: ["2", "5"] }
        ] 
    },
    { 
        level: 5, description: "Slightly Trickier", hint: "It's a puzzle of simple arithmetic.", 
        variations: [ 
            { equation: "1 + 6 = 7", swap: ["1", "7"] }, { equation: "9 - 2 = 7", swap: ["2", "7"] }, 
            { equation: "4 * 2 = 8", swap: ["4", "8"] }, { equation: "8 / 4 = 2", swap: ["4", "2"] }, 
            { equation: "3 + 6 = 9", swap: ["3", "9"] }, { equation: "6 - 1 = 5", swap: ["1", "5"] }, 
            { equation: "2 * 2 = 4", swap: ["2", "4"] }, { equation: "10 / 2 = 5", swap: ["2", "5"] }, 
            { equation: "4 + 3 = 7", swap: ["3", "7"] }, { equation: "8 - 1 = 7", swap: ["1", "7"] }
        ] 
    },
    { 
        level: 6, description: "Look Closely", hint: "Look for the two symbols that are out of place.", 
        variations: [ 
            { equation: "2 + 5 = 7", swap: ["2", "7"] }, { equation: "9 - 4 = 5", swap: ["4", "5"] }, 
            { equation: "3 * 3 = 9", swap: ["3", "9"] }, { equation: "10 / 2 = 5", swap: ["2", "5"] }, 
            { equation: "1 + 5 = 6", swap: ["1", "6"] }, { equation: "8 - 2 = 6", swap: ["2", "6"] }, 
            { equation: "4 * 1 = 4", swap: ["1", "4"] }, { equation: "6 / 3 = 2", swap: ["3", "2"] }, 
            { equation: "5 + 1 = 6", swap: ["1", "6"] }, { equation: "9 - 2 = 7", swap: ["2", "7"] }
        ] 
    },
    { 
        level: 7, description: "Getting Warmer", hint: "One swap will make the equation true.", 
        variations: [ 
            { equation: "3 + 5 = 8", swap: ["3", "8"] }, { equation: "7 - 3 = 4", swap: ["3", "4"] }, 
            { equation: "2 * 3 = 6", swap: ["2", "6"] }, { equation: "8 / 4 = 2", swap: ["4", "2"] }, 
            { equation: "4 + 2 = 6", swap: ["2", "6"] }, { equation: "9 - 3 = 6", swap: ["3", "6"] }, 
            { equation: "1 * 8 = 8", swap: ["1", "8"] }, { equation: "12 / 4 = 3", swap: ["4", "3"] }, 
            { equation: "2 + 4 = 6", swap: ["2", "6"] }, { equation: "7 - 2 = 5", swap: ["2", "5"] }
        ] 
    },
    { 
        level: 8, description: "Aha Moment", hint: "Find the two tiles that need to trade places.", 
        variations: [ 
            { equation: "6 + 3 = 9", swap: ["3", "9"] }, { equation: "8 - 2 = 6", swap: ["2", "6"] }, 
            { equation: "2 * 2 = 4", swap: ["2", "4"] }, { equation: "12 / 2 = 6", swap: ["2", "6"] }, 
            { equation: "5 + 3 = 8", swap: ["3", "8"] }, { equation: "7 - 1 = 6", swap: ["1", "6"] }, 
            { equation: "3 * 1 = 3", swap: ["1", "3"] }, { equation: "15 / 3 = 5", swap: ["3", "5"] }, 
            { equation: "1 + 4 = 5", swap: ["1", "5"] }, { equation: "10 - 2 = 8", swap: ["2", "8"] }
        ] 
    },
    { 
        level: 9, description: "Think It Through", hint: "Focus on the numbers; one of them is in the wrong spot.", 
        variations: [ 
            { equation: "4 + 3 = 7", swap: ["3", "7"] }, { equation: "9 - 4 = 5", swap: ["4", "5"] }, 
            { equation: "2 * 4 = 8", swap: ["2", "8"] }, { equation: "14 / 2 = 7", swap: ["2", "7"] }, 
            { equation: "2 + 3 = 5", swap: ["2", "5"] }, { equation: "8 - 3 = 5", swap: ["3", "5"] }, 
            { equation: "10 / 2 = 5", swap: ["10", "5"] }, { equation: "16 / 4 = 4", swap: ["16", "4"] }, 
            { equation: "3 + 5 = 8", swap: ["3", "8"] }, { equation: "10 - 3 = 7", swap: ["3", "7"] }
        ] 
    },
    { 
        level: 10, description: "Final Basic", hint: "The solution is just one swap away.", 
        variations: [ 
            { equation: "5 + 4 = 9", swap: ["4", "9"] }, { equation: "8 - 1 = 7", swap: ["1", "7"] }, 
            { equation: "3 * 2 = 6", swap: ["2", "6"] }, { equation: "18 / 3 = 6", swap: ["3", "6"] }, 
            { equation: "1 + 6 = 7", swap: ["1", "7"] }, { equation: "9 - 3 = 6", swap: ["3", "6"] }, 
            { equation: "8 / 2 = 4", swap: ["8", "4"] }, { equation: "20 / 4 = 5", swap: ["4", "5"] }, 
            { equation: "2 + 2 = 4", swap: ["2", "4"] }, { equation: "7 - 1 = 6", swap: ["1", "6"] }
        ] 
    },

    // 🔢 LEVELS 11-20: INTRODUCE MULTI-DIGIT RESULTS
    {
        level: 11, description: "Two-Digit Answers", hint: "The answer is a two-digit number. One of its digits has been swapped with a number in the problem.",
        variations: [
            { equation: "8 + 4 = 12", swap: ["4", "2"] }, { equation: "9 + 5 = 14", swap: ["5", "4"] },
            { equation: "7 + 6 = 13", swap: ["6", "3"] }, { equation: "6 * 3 = 18", swap: ["3", "8"] },
            { equation: "5 * 4 = 20", swap: ["4", "0"] }, { equation: "20 - 1 = 19", swap: ["1", "9"] },
            { equation: "25 - 5 = 20", swap: ["5", "0"] }, { equation: "30 - 1 = 29", swap: ["1", "9"] },
            { equation: "7 + 7 = 14", swap: ["7", "4"] }, { equation: "8 * 2 = 16", swap: ["2", "6"] }
        ]
    },
    {
        level: 12, description: "Digit Position", hint: "The digits in the answer are correct, but they have been swapped with each other.",
        variations: [
            { equation: "15 - 3 = 12", swap: ["1", "2"] }, { equation: "18 - 4 = 14", swap: ["1", "4"] },
            { equation: "9 * 2 = 18", swap: ["1", "8"] }, { equation: "24 / 2 = 12", swap: ["1", "2"] },
            { equation: "8 + 9 = 17", swap: ["1", "7"] }, { equation: "21 - 9 = 12", swap: ["1", "2"] },
            { equation: "4 * 4 = 16", swap: ["1", "6"] }, { equation: "30 / 2 = 15", swap: ["1", "5"] },
            { equation: "9 + 9 = 18", swap: ["1", "8"] }, { equation: "16 - 4 = 12", swap: ["1", "2"] }
        ]
    },
    { 
        level: 13, description: "Multi-Digit Swaps", hint: "All the right digits, but not in the right order.", 
        variations: [ 
            { equation: "10 + 5 = 15", swap: ["0", "5"] }, { equation: "20 - 8 = 12", swap: ["0", "2"] }, 
            { equation: "1 * 86 = 86", swap: ["1", "6"] }, { equation: "40 / 4 = 10", swap: ["4", "0"] }, 
            { equation: "1 + 29 = 30", swap: ["1", "0"] }, { equation: "25 - 10 = 15", swap: ["0", "5"] }, 
            { equation: "2 * 17 = 34", swap: ["2", "4"] }, { equation: "50 / 5 = 10", swap: ["5", "0"] }, 
            { equation: "1 + 68 = 69", swap: ["1", "9"] }, { equation: "31 - 11 = 20", swap: ["1", "0"] }
        ] 
    },
    { 
        level: 14, description: "Place Value Puzzles", hint: "It's not what the numbers say, it's where they are.", 
        variations: [ 
            { equation: "12 + 7 = 19", swap: ["2", "9"] }, { equation: "22 - 5 = 17", swap: ["2", "7"] }, 
            { equation: "1 * 53 = 53", swap: ["1", "3"] }, { equation: "44 / 2 = 22", swap: ["4", "2"] }, 
            { equation: "1 + 79 = 80", swap: ["1", "0"] }, { equation: "99 - 7 = 92", swap: ["9", "2"] }, 
            { equation: "2 * 46 = 92", swap: ["2", "9"] }, { equation: "33 / 3 = 11", swap: ["3", "1"] }, 
            { equation: "10 + 9 = 19", swap: ["0", "9"] }, { equation: "26 - 6 = 20", swap: ["6", "0"] }
        ] 
    },
    { 
        level: 15, description: "Multi-Digit Logic", hint: "A single digit swap will make the equation balance.", 
        variations: [ 
            { equation: "14 + 5 = 19", swap: ["4", "9"] }, { equation: "28 - 9 = 19", swap: ["8", "9"] }, 
            { equation: "2 * 55 = 110", swap: ["2", "1"] }, { equation: "22 / 2 = 11", swap: ["2", "1"] }, 
            { equation: "13 + 6 = 19", swap: ["3", "9"] }, { equation: "21 - 8 = 13", swap: ["1", "3"] }, 
            { equation: "4 * 20 = 80", swap: ["4", "8"] }, { equation: "22 / 2 = 11", swap: ["2", "1"] }, 
            { equation: "12 + 9 = 21", swap: ["2", "1"] }, { equation: "32 - 8 = 24", swap: ["2", "4"] }
        ] 
    },
    { 
        level: 16, description: "Deeper Swaps", hint: "Two digits are in the wrong positions.", 
        variations: [ 
            { equation: "17 + 8 = 25", swap: ["7", "5"] }, { equation: "30 - 8 = 22", swap: ["0", "2"] }, 
            { equation: "3 * 60 = 180", swap: ["3", "1"] }, { equation: "22 / 2 = 11", swap: ["2", "1"] }, 
            { equation: "15 + 9 = 24", swap: ["5", "4"] }, { equation: "28 - 6 = 22", swap: ["8", "2"] }, 
            { equation: "2 * 87 = 174", swap: ["2", "1"] }, { equation: "60 / 3 = 20", swap: ["6", "2"] }, 
            { equation: "19 + 5 = 24", swap: ["9", "4"] }, { equation: "35 - 10 = 25", swap: ["3", "2"] }
        ] 
    },
    { 
        level: 17, description: "Tens and Ones", hint: "The digits of the answer are correct, but swapped.", 
        variations: [ 
            { equation: "8 * 4 = 32", swap: ["3", "2"] }, { equation: "9 * 5 = 45", swap: ["4", "5"] }, 
            { equation: "7 * 6 = 42", swap: ["4", "2"] }, { equation: "9 * 6 = 54", swap: ["5", "4"] }, 
            { equation: "8 * 7 = 56", swap: ["5", "6"] }, { equation: "9 * 7 = 63", swap: ["6", "3"] }, 
            { equation: "8 * 8 = 64", swap: ["6", "4"] }, { equation: "9 * 8 = 72", swap: ["7", "2"] }, 
            { equation: "9 * 9 = 81", swap: ["8", "1"] }, { equation: "12 * 5 = 60", swap: ["6", "0"] }
        ] 
    },
    { 
        level: 18, description: "Operand & Result Swap", hint: "One number in the question and one in the answer need to swap.", 
        variations: [ 
            { equation: "25 + 25 = 50", swap: ["5", "0"] }, { equation: "50 - 25 = 25", swap: ["0", "5"] }, 
            { equation: "12 * 4 = 48", swap: ["2", "8"] }, { equation: "100 / 4 = 25", swap: ["0", "5"] }, 
            { equation: "30 + 20 = 50", swap: ["0", "5"] }, { equation: "40 - 15 = 25", swap: ["0", "5"] }, 
            { equation: "15 * 3 = 45", swap: ["5", "4"] }, { equation: "75 / 3 = 25", swap: ["7", "2"] }, 
            { equation: "35 + 15 = 50", swap: ["5", "0"] }, { equation: "60 - 15 = 45", swap: ["0", "5"] }
        ] 
    },
    { 
        level: 19, description: "Operator & Zero", hint: "The zero is not where it should be.", 
        variations: [ 
            { equation: "5 * 5 = 25 - 0", swap: ["*", "-"] }, { equation: "6 * 6 = 36 - 0", swap: ["*", "-"] }, 
            { equation: "4 * 4 = 16 - 0", swap: ["*", "-"] }, { equation: "10 * 5 = 50 - 0", swap: ["*", "-"] }, 
            { equation: "8 * 3 = 24 - 0", swap: ["*", "-"] }, { equation: "9 * 2 = 18 - 0", swap: ["*", "-"] }, 
            { equation: "7 * 3 = 21 - 0", swap: ["*", "-"] }, { equation: "3 * 5 = 15 - 0", swap: ["*", "-"] }, 
            { equation: "12 * 2 = 24 - 0", swap: ["*", "-"] }, { equation: "10 * 3 = 30 - 0", swap: ["*", "-"] }
        ] 
    },
    { 
        level: 20, description: "Final Digit Puzzles", hint: "Find the two digits that are out of place.", 
        variations: [ 
            { equation: "12 + 13 = 25", swap: ["2", "5"] }, { equation: "25 - 11 = 14", swap: ["5", "4"] }, 
            { equation: "14 * 2 = 28", swap: ["4", "8"] }, { equation: "33 / 3 = 11", swap: ["3", "1"] }, 
            { equation: "15 + 12 = 27", swap: ["5", "7"] }, { equation: "30 - 12 = 18", swap: ["0", "8"] }, 
            { equation: "11 * 5 = 55", swap: ["1", "5"] }, { equation: "21 / 1 = 21", swap: ["1", "1"] }, 
            { equation: "16 + 11 = 27", swap: ["6", "7"] }, { equation: "20 - 1 = 19", swap: ["0", "9"] }
        ] 
    },
    
    // 🧮 LEVELS 21-30: ORDER OF OPERATIONS
    { 
        level: 21, description: "Order of Operations", hint: "Which operation should happen first? Swap an operator and a number.", 
        variations: [ 
            { equation: "2 + 3 * 4 = 14", swap: ["+", "4"] }, { equation: "3 + 2 * 5 = 13", swap: ["+", "3"] }, 
            { equation: "10 - 2 * 2 = 6", swap: ["-", "6"] }, { equation: "15 - 3 * 3 = 6", swap: ["-", "6"] }, 
            { equation: "3 * 2 + 4 = 10", swap: ["*", "1"] }, { equation: "4 * 3 + 5 = 17", swap: ["*", "1"] }, 
            { equation: "20 / 2 - 5 = 5", swap: ["-", "5"] }, { equation: "18 / 3 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "5 + 2 * 5 = 15", swap: ["+", "1"] }, { equation: "8 - 2 * 3 = 2", swap: ["-", "2"] }
        ] 
    },
    { 
        level: 22, description: "PEMDAS", hint: "Remember: Multiplication before Addition. One digit is out of place.", 
        variations: [ 
            { equation: "3 + 5 * 3 = 18", swap: ["5", "8"] }, { equation: "2 * 6 + 4 = 16", swap: ["6", "1"] }, 
            { equation: "10 * 3 - 7 = 23", swap: ["-", "3"] }, { equation: "8 + 6 / 2 = 11", swap: ["6", "1"] }, 
            { equation: "12 - 2 * 5 = 2", swap: ["-", "2"] }, { equation: "7 + 2 * 5 = 17", swap: ["2", "7"] }, 
            { equation: "20 / 4 - 1 = 4", swap: ["-", "4"] }, { equation: "9 * 2 - 3 = 15", swap: ["-", "5"] }, 
            { equation: "15 + 10 / 5 = 17", swap: ["0", "7"] }, { equation: "3 + 5 * 3 = 24", swap: ["5", "4"] }
        ] 
    },
    { 
        level: 23, description: "Mixed Operations", hint: "A digit or an operator might be in the wrong place.", 
        variations: [ 
            { equation: "5 + 5 * 1 = 10", swap: ["1", "0"] }, { equation: "10 / 2 + 3 = 8", swap: ["/", "+"] }, 
            { equation: "12 + 8 / 4 = 14", swap: ["8", "4"] }, { equation: "20 - 2 * 10 = 0", swap: ["-", "0"] }, 
            { equation: "9 * 3 - 4 = 23", swap: ["-", "3"] }, { equation: "18 - 6 / 3 = 16", swap: ["-", "6"] }, 
            { equation: "7 + 2 * 5 = 17", swap: ["2", "7"] }, { equation: "16 / 2 - 4 = 4", swap: ["-", "4"] }, 
            { equation: "1 + 2 * 9 = 19", swap: ["1", "9"] }, { equation: "25 - 4 * 5 = 5", swap: ["-", "5"] }
        ] 
    },
     { 
        level: 24, description: "Find the Flaw", hint: "Think about the sequence of calculations.", 
        variations: [ 
            { equation: "10 - 3 * 2 = 4", swap: ["-", "4"] }, { equation: "15 / 3 + 2 = 7", swap: ["/", "+"] }, 
            { equation: "5 * 4 + 1 = 21", swap: ["1", "4"] }, { equation: "18 / 6 - 1 = 2", swap: ["-", "2"] }, 
            { equation: "8 + 2 * 3 = 14", swap: ["2", "4"] }, { equation: "24 / 2 - 4 = 8", swap: ["-", "8"] }, 
            { equation: "7 + 3 * 4 = 19", swap: ["3", "9"] }, { equation: "21 / 7 - 2 = 1", swap: ["-", "1"] }, 
            { equation: "6 + 2 * 6 = 18", swap: ["2", "8"] }, { equation: "30 / 5 + 1 = 7", swap: ["/", "+"] }
        ] 
    },
    { 
        level: 25, description: "Advanced PEMDAS", hint: "It's a puzzle of priority.", 
        variations: [ 
            { equation: "40 / 10 - 2 = 2", swap: ["-", "2"] }, { equation: "36 / 6 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "100 / 10 - 1 = 9", swap: ["-", "9"] }, { equation: "50 / 10 + 5 = 10", swap: ["+", "0"] }, 
            { equation: "1 + 3 * 7 = 22", swap: ["1", "2"] }, { equation: "9 - 6 / 3 = 7", swap: ["-", "7"] }, 
            { equation: "4 * 8 + 2 = 34", swap: ["8", "4"] }, { equation: "16 / 4 - 2 = 2", swap: ["-", "2"] }, 
            { equation: "10 * 10 - 9 = 91", swap: ["-", "1"] }, { equation: "25 + 10 / 5 = 27", swap: ["0", "7"] }
        ] 
    },
    // ... filling in the rest of the levels up to 50
    {
        level: 26, description: "Order of Operations", hint: "Find the single incorrect symbol, digit or operator.",
        variations: [
            { equation: "4 * 2 + 8 = 16", swap: ["2", "6"] }, { equation: "6 + 2 * 9 = 24", swap: ["2", "4"] },
            { equation: "30 / 5 - 3 = 3", swap: ["-", "3"] }, { equation: "5 * 6 - 7 = 23", swap: ["6", "3"] },
            { equation: "6 * 7 + 9 = 51", swap: ["7", "1"] }, { equation: "12 + 10 / 5 = 14", swap: ["0", "4"] },
            { equation: "45 / 9 - 0 = 5", swap: ["-", "0"] }, { equation: "8 * 2 + 14 = 30", swap: ["2", "0"] },
            { equation: "9 * 9 - 11 = 70", swap: ["-", "0"] }, { equation: "100 / 5 + 5 = 25", swap: ["+", "5"] }
        ]
    },
    {
        level: 27, description: "Hidden Operations", hint: "Think outside the box. Digits can move anywhere.",
        variations: [
            { equation: "5 * 2 + 3 = 13", swap: ["2", "3"] }, { equation: "9 * 6 - 0 = 54", swap: ["-", "4"] },
            { equation: "40 / 8 + 2 = 7", swap: ["8", "7"] }, { equation: "2 + 5 * 7 = 37", swap: ["5", "7"] },
            { equation: "14 + 28 / 8 = 18", swap: ["8", "4"] }, { equation: "10 * 9 - 1 = 89", swap: ["-", "9"] },
            { equation: "81 / 9 + 8 = 17", swap: ["8", "7"] }, { equation: "3 * 10 - 5 = 25", swap: ["0", "5"] },
            { equation: "60 / 6 + 4 = 14", swap: ["6", "4"] }, { equation: "22 + 2 * 3 = 28", swap: ["2", "8"] }
        ]
    },
    {
        level: 28, description: "Operator Anomaly", hint: "It might be an operator swap, or it might be a digit.",
        variations: [
            { equation: "12 * 4 + 8 = 56", swap: ["*", "+"] }, { equation: "50 / 10 - 1 = 4", swap: ["-", "1"] },
            { equation: "7 + 3 * 9 = 34", swap: ["+", "4"] }, { equation: "100 / 15 - 5 = 5", swap: ["15", "5"] },
            { equation: "9 + 5 * 4 = 29", swap: ["+", "9"] }, { equation: "64 / 8 - 0 = 8", swap: ["-", "0"] },
            { equation: "13 + 3 * 4 = 25", swap: ["3", "5"] }, { equation: "49 / 7 - 0 = 7", swap: ["-", "0"] },
            { equation: "11 * 8 + 2 = 90", swap: ["8", "0"] }, { equation: "33 / 3 - 0 = 11", swap: ["-", "0"] }
        ]
    },
    {
        level: 29, description: "Double Digits", hint: "The answer seems impossible until you find the swap.",
        variations: [
            { equation: "9 * 9 - 2 = 79", swap: ["2", "9"] }, { equation: "8 * 8 - 6 = 58", swap: ["6", "8"] },
            { equation: "7 * 7 - 2 = 47", swap: ["2", "7"] }, { equation: "6 * 6 - 0 = 36", swap: ["0", "6"] },
            { equation: "5 * 5 - 0 = 25", swap: ["0", "5"] }, { equation: "12 * 12 - 132 = 12", swap: ["132", "12"] },
            { equation: "11 * 11 - 111 = 10", swap: ["111", "10"] }, { equation: "10 * 10 - 90 = 10", swap: ["90", "10"] },
            { equation: "13 * 13 - 6 = 163", swap: ["6", "3"] }, { equation: "14 * 14 - 4 = 192", swap: ["4", "2"] }
        ]
    },
    {
        level: 30, description: "Final Order", hint: "One swap makes it all add up. Or multiply.",
        variations: [
            { equation: "4 + 4 * 4 = 20", swap: ["4", "0"] }, { equation: "6 + 3 * 5 = 21", swap: ["3", "1"] },
            { equation: "45 / 5 + 4 = 13", swap: ["4", "3"] }, { equation: "100 - 1 * 9 = 91", swap: ["-", "1"] },
            { equation: "1 + 3 * 8 = 25", swap: ["3", "5"] }, { equation: "8 * 10 - 30 = 50", swap: ["10", "50"] },
            { equation: "72 / 8 + 4 = 13", swap: ["4", "3"] }, { equation: "60 - 7 * 5 = 25", swap: ["7", "5"] },
            { equation: "2 + 4 * 8 = 34", swap: ["4", "3"] }, { equation: "99 / 9 - 1 = 10", swap: ["1", "0"] }
        ]
    },
    // ... Levels 31-50
    {
        level: 31, description: "Fill in the Blank", hint: "What number is missing? Swap it with the blank space.",
        variations: [
            { equation: "4 + 6 = 1 _", swap: ["_", "0"] }, { equation: "5 + 7 = 1 _", swap: ["_", "2"] },
            { equation: "5 + 4 = _", swap: ["_", "9"] }, { equation: "5 + 8 = 1 _", swap: ["_", "3"] },
            { equation: "6 + 5 = 1 _", swap: ["_", "1"] }, { equation: "5 + 9 = 1 _", swap: ["_", "4"] },
            { equation: "3 + 4 = _", swap: ["_", "7"] }, { equation: "4 + 2 = _", swap: ["_", "6"] },
            { equation: "3 + 1 = _", swap: ["_", "4"] }, { equation: "5 + 10 = 1 _", swap: ["_", "5"] }
        ]
    },
    {
        level: 32, description: "Missing Subtrahend", hint: "Find the missing piece of the puzzle.",
        variations: [
            { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] },
            { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] },
            { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] },
            { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] },
            { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }
        ]
    },
    {
        level: 33, description: "Missing Factor", hint: "What times 3 equals 21?",
        variations: [
            { equation: "_ * 3 = 21", swap: ["_", "7"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] },
            { equation: "_ * 4 = 36", swap: ["_", "9"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] },
            { equation: "_ * 8 = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] },
            { equation: "_ * 9 = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] },
            { equation: "_ * 10 = 100", swap: ["_", "10"] }, { equation: "_ * 11 = 121", swap: ["_", "11"] }
        ]
    },
    {
        level: 34, description: "Missing Divisor", hint: "A number is missing from the equation.",
        variations: [
            { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] },
            { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] },
            { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] },
            { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] },
            { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }
        ]
    },
    {
        level: 35, description: "Mixed Blanks", hint: "Swap the correct number into the blank space.",
        variations: [
            { equation: "10 + _ = 18", swap: ["_", "8"] }, { equation: "25 - _ = 17", swap: ["_", "8"] },
            { equation: "6 * _ = 54", swap: ["_", "9"] }, { equation: "77 / _ = 7", swap: ["_", "11"] },
            { equation: "13 + _ = 21", swap: ["_", "8"] }, { equation: "30 - _ = 19", swap: ["_", "11"] },
            { equation: "8 * _ = 72", swap: ["_", "9"] }, { equation: "96 / _ = 8", swap: ["_", "12"] },
            { equation: "21 + _ = 30", swap: ["_", "9"] }, { equation: "42 - _ = 29", swap: ["_", "13"] }
        ]
    },
    { 
        level: 36, description: "Blank + Multi-digit", hint: "Solve backwards from the answer.", 
        variations: [ 
            { equation: "8 + _ = 14", swap: ["_", "6"] }, { equation: "3 * _ = 18", swap: ["_", "6"] }, 
            { equation: "12 + _ = 21", swap: ["_", "9"] }, { equation: "45 / _ = 3", swap: ["_", "15"] }, 
            { equation: "22 - _ = 7", swap: ["_", "15"] }, { equation: "5 * _ = 35", swap: ["_", "7"] }, 
            { equation: "14 + _ = 25", swap: ["_", "11"] }, { equation: "60 / _ = 5", swap: ["_", "12"] }, 
            { equation: "24 - _ = 12", swap: ["_", "12"] }, { equation: "2 * _ = 32", swap: ["_", "16"] }
        ] 
    },
    { 
        level: 37, description: "Complex Blanks", hint: "What single digit completes the equation?", 
        variations: [ 
            { equation: "3 * 12 = 3 _", swap: ["_", "6"] }, { equation: "100 - 15 = 8 _", swap: ["_", "5"] }, 
            { equation: "25 + 16 = 4 _", swap: ["_", "1"] }, { equation: "144 / 12 = 1 _", swap: ["_", "2"] }, 
            { equation: "12 * 9 = 10 _", swap: ["_", "8"] }, { equation: "75 - 25 = 5 _", swap: ["_", "0"] }, 
            { equation: "50 + 27 = 7 _", swap: ["_", "7"] }, { equation: "132 / 12 = 1 _", swap: ["_", "1"] }, 
            { equation: "8 * 12 = 9 _", swap: ["_", "6"] }, { equation: "200 - 25 = 17 _", swap: ["_", "5"] }
        ] 
    },
    { 
        level: 38, description: "Advanced Blanks", hint: "Find the missing number to balance the equation.", 
        variations: [ 
            { equation: "13 * _ = 39", swap: ["_", "3"] }, { equation: "55 - _ = 20", swap: ["_", "35"] }, 
            { equation: "42 + _ = 60", swap: ["_", "18"] }, { equation: "125 / _ = 25", swap: ["_", "5"] }, 
            { equation: "15 * _ = 75", swap: ["_", "5"] }, { equation: "75 - _ = 30", swap: ["_", "45"] }, 
            { equation: "60 + _ = 99", swap: ["_", "39"] }, { equation: "250 / _ = 25", swap: ["_", "10"] }, 
            { equation: "11 * _ = 132", swap: ["_", "12"] }, { equation: "150 - _ = 50", swap: ["_", "100"] }
        ] 
    },
    { 
        level: 39, description: "Final Blanks", hint: "A single swap will solve it.", 
        variations: [ 
            { equation: "14 * 4 = 5 _", swap: ["_", "6"] }, { equation: "80 - 15 = 6 _", swap: ["_", "5"] }, 
            { equation: "20 + 35 = 5 _", swap: ["_", "5"] }, { equation: "90 / 15 = _", swap: ["_", "6"] }, 
            { equation: "16 * 4 = 6 _", swap: ["_", "4"] }, { equation: "120 - 25 = 9 _", swap: ["_", "5"] }, 
            { equation: "45 + 25 = 7 _", swap: ["_", "0"] }, { equation: "105 / 15 = _", swap: ["_", "7"] }, 
            { equation: "18 * 4 = 7 _", swap: ["_", "2"] }, { equation: "150 - 25 = 12 _", swap: ["_", "5"] }
        ] 
    },
    { 
        level: 40, description: "Blank Mastery", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "19 * 5 = 9 _", swap: ["_", "5"] }, { equation: "100 - 85 = 1 _", swap: ["_", "5"] }, 
            { equation: "70 + 40 = 11 _", swap: ["_", "0"] }, { equation: "180 / 20 = _", swap: ["_", "9"] }, 
            { equation: "22 * 4 = 8 _", swap: ["_", "8"] }, { equation: "150 - 125 = 2 _", swap: ["_", "5"] }, 
            { equation: "90 + 40 = 13 _", swap: ["_", "0"] }, { equation: "200 / 25 = _", swap: ["_", "8"] }, 
            { equation: "24 * 5 = 12 _", swap: ["_", "0"] }, { equation: "200 - 125 = 7 _", swap: ["_", "5"] }
        ] 
    },
    { 
        level: 41, description: "Mixed Logic", hint: "Solve backwards. Find the missing number.", 
        variations: [ 
            { equation: "4 * 4 + 2 = 1 _", swap: ["_", "8"] }, { equation: "4 * 3 + 1 = 1 _", swap: ["_", "3"] }, 
            { equation: "5 * 5 - 5 = 2 _", swap: ["_", "0"] }, { equation: "18 / 2 = _", swap: ["_", "9"] }, 
            { equation: "5 * 2 + 4 = 1 _", swap: ["_", "4"] }, { equation: "4 * 7 - 7 = 2 _", swap: ["_", "1"] }, 
            { equation: "3 * 3 + 6 = 1 _", swap: ["_", "5"] }, { equation: "24 / 4 = _", swap: ["_", "6"] }, 
            { equation: "4 * 9 - 9 = 2 _", swap: ["_", "7"] }, { equation: "40 / 5 = _", swap: ["_", "8"] }
        ] 
    },
    { 
        level: 42, description: "Mixed Logic", hint: "What needs to happen first?", 
        variations: [ 
            { equation: "10 + 2 * 7 = 2 _", swap: ["_", "4"] }, { equation: "20 - 3 * 4 = _", swap: ["_", "8"] }, 
            { equation: "5 * 5 + 5 = 3 _", swap: ["_", "0"] }, { equation: "30 / 6 + 2 = _", swap: ["_", "7"] }, 
            { equation: "8 + 3 * 4 = 2 _", swap: ["_", "0"] }, { equation: "40 - 5 * 5 = 1 _", swap: ["_", "5"] }, 
            { equation: "6 * 4 + 8 = 3 _", swap: ["_", "2"] }, { equation: "50 / 5 - 3 = _", swap: ["_", "7"] }, 
            { equation: "12 + 6 * 3 = 3 _", swap: ["_", "0"] }, { equation: "100 - 10 * 10 = _", swap: ["_", "0"] }
        ] 
    },
    { 
        level: 43, description: "Mixed Logic", hint: "Two steps. One swap.", 
        variations: [ 
            { equation: "3 * 4 + 6 = 1 _", swap: ["_", "8"] }, { equation: "5 * 6 - 10 = 2 _", swap: ["_", "0"] }, 
            { equation: "20 / 4 + 5 = _", swap: ["_", "10"] }, { equation: "18 / 6 - 2 = _", swap: ["_", "1"] }, 
            { equation: "2 * 8 + 6 = 2 _", swap: ["_", "2"] }, { equation: "7 * 3 - 6 = 1 _", swap: ["_", "5"] }, 
            { equation: "36 / 4 + 6 = 1 _", swap: ["_", "5"] }, { equation: "40 / 8 - 3 = _", swap: ["_", "2"] }, 
            { equation: "5 * 7 + 5 = 4 _", swap: ["_", "0"] }, { equation: "60 / 10 - 6 = _", swap: ["_", "0"] }
        ] 
    },
    { 
        level: 44, description: "Mixed Logic", hint: "Find the single incorrect symbol.", 
        variations: [ 
            { equation: "4 + 5 * 3 = 1 _", swap: ["_", "9"] }, { equation: "25 - 2 * 5 = 1 _", swap: ["_", "5"] }, 
            { equation: "8 * 2 + 4 = 2 _", swap: ["_", "0"] }, { equation: "42 / 7 - 3 = _", swap: ["_", "3"] }, 
            { equation: "9 + 3 * 3 = 1 _", swap: ["_", "8"] }, { equation: "32 - 4 * 4 = 1 _", swap: ["_", "6"] }, 
            { equation: "6 * 5 + 3 = 3 _", swap: ["_", "3"] }, { equation: "54 / 9 - 4 = _", swap: ["_", "2"] }, 
            { equation: "11 + 6 * 3 = 2 _", swap: ["_", "9"] }, { equation: "70 - 7 * 7 = 2 _", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 45, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", 
        variations: [ 
            { equation: "6 + 5 * 3 = 2 _", swap: ["_", "1"] }, { equation: "4 * 7 - 7 = 2 _", swap: ["_", "1"] }, 
            { equation: "50 / 10 + 5 = 1 _", swap: ["_", "0"] }, { equation: "100 - 10 * 9 = 1 _", swap: ["_", "0"] }, 
            { equation: "1 + 9 * 3 = 2 _", swap: ["_", "8"] }, { equation: "8 * 5 - 10 = 3 _", swap: ["_", "0"] }, 
            { equation: "72 / 9 + 4 = 1 _", swap: ["_", "2"] }, { equation: "60 - 5 * 7 = 2 _", swap: ["_", "5"] }, 
            { equation: "2 + 4 * 8 = 3 _", swap: ["_", "4"] }, { equation: "99 / 9 - 1 = 1 _", swap: ["_", "0"] }
        ] 
    },
    { 
        level: 46, description: "Evil Genius", hint: "The digits are there, just scrambled.", 
        variations: [ 
            { equation: "24 * 4 = 96", swap: ["4", "6"] }, { equation: "72 / 3 = 24", swap: ["2", "4"] }, 
            { equation: "31 + 41 = 72", swap: ["1", "2"] }, { equation: "98 - 19 = 79", swap: ["8", "9"] }, 
            { equation: "10 * 8 = 80", swap: ["0", "8"] }, { equation: "156 / 6 = 26", swap: ["5", "6"] }, 
            { equation: "61 + 28 = 89", swap: ["1", "9"] }, { equation: "85 - 18 = 67", swap: ["5", "7"] }, 
            { equation: "28 * 2 = 56", swap: ["8", "6"] }, { equation: "49 / 7 = 7", swap: ["4", "7"] }
        ] 
    },
    { 
        level: 47, description: "Evil Genius", hint: "Two numbers are switched. Can you spot them?", 
        variations: [ 
            { equation: "10 + 8 = 18", swap: ["0", "8"] }, { equation: "10 - 9 = 1", swap: ["9", "1"] }, 
            { equation: "7 * 7 = 49", swap: ["7", "9"] }, { equation: "36 / 4 = 9", swap: ["6", "9"] }, 
            { equation: "21 + 2 = 23", swap: ["1", "3"] }, { equation: "50 - 25 = 25", swap: ["0", "5"] }, 
            { equation: "12 * 10 = 120", swap: ["2", "0"] }, { equation: "81 / 9 = 9", swap: ["1", "9"] }, 
            { equation: "46 + 53 = 99", swap: ["6", "9"] }, { equation: "110 - 11 = 99", swap: ["0", "9"] }
        ] 
    },
    { 
        level: 48, description: "Evil Genius", hint: "The equation looks complex, but the fix is a simple digit swap.", 
        variations: [ 
            { equation: "13 * 8 = 104", swap: ["3", "0"] }, { equation: "11 * 15 = 165", swap: ["1", "6"] }, 
            { equation: "12 * 14 = 168", swap: ["2", "8"] }, { equation: "12 * 16 = 192", swap: ["6", "9"] }, 
            { equation: "21 * 5 = 105", swap: ["1", "0"] }, { equation: "10 * 12 = 120", swap: ["0", "2"] }, 
            { equation: "22 * 10 = 220", swap: ["0", "2"] }, { equation: "25 * 11 = 275", swap: ["5", "7"] }, 
            { equation: "15 * 18 = 270", swap: ["5", "7"] }, { equation: "22 * 8 = 176", swap: ["2", "7"] }
        ] 
    },
    { 
        level: 49, description: "Evil Genius", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "7 - 1 = 6", swap: ["-", "6"] }, { equation: "3 * 1 = 3", swap: ["*", "3"] }, 
            { equation: "10 + 5 = 15", swap: ["+", "1"] }, { equation: "8 / 2 = 4", swap: ["/", "4"] }, 
            { equation: "6 + 3 = 9", swap: ["+", "9"] }, { equation: "5 - 1 = 4", swap: ["-", "4"] }, 
            { equation: "12 / 4 = 3", swap: ["/", "3"] }, { equation: "9 * 2 = 18", swap: ["*", "1"] }, 
            { equation: "14 - 7 = 7", swap: ["-", "7"] }, { equation: "2 + 5 = 7", swap: ["+", "7"] }
        ] 
    },
    { 
        level: 50, description: "Final Challenge", hint: "One simple sign swap will solve it.", 
        variations: [ 
            { equation: "20 - 4 = 16", swap: ["-", "1"] }, { equation: "8 * 2 = 16", swap: ["*", "1"] }, 
            { equation: "15 / 5 = 3", swap: ["/", "3"] }, { equation: "6 + 4 = 10", swap: ["+", "1"] }, 
            { equation: "18 - 5 = 13", swap: ["-", "1"] }, { equation: "7 * 2 = 14", swap: ["*", "1"] }, 
            { equation: "16 / 4 = 4", swap: ["/", "4"] }, { equation: "5 + 5 = 10", swap: ["+", "1"] }, 
            { equation: "21 / 7 = 3", swap: ["/", "3"] }, { equation: "9 - 2 = 7", swap: ["-", "7"] }
        ] 
    },
];

export function getMathPuzzleConfig(level: number): MathLevel {
    const adjustedLevel = Math.max(0, Math.min(level, mathLevels.length - 1));
    const config = mathLevels.find(l => l.level === adjustedLevel + 1);
    if (!config) {
        // Fallback to the last level if something goes wrong
        return mathLevels[mathLevels.length - 1];
    }
    return config;
}

export function generatePuzzle(level: number, retryCount: number): MathPuzzle {
    const config = getMathPuzzleConfig(level);
    
    // Cycle through variations based on level and retry count
    const variationIndex = (level + retryCount) % config.variations.length;
    const puzzleTemplate = config.variations[variationIndex];
    
    const { equation: correctEquation, swap } = puzzleTemplate;

    const scrambledEquation = createScrambledEquation(correctEquation, swap as [string, string]);
    
    const correctValues = toValues(correctEquation);
    const scrambledValues = toValues(scrambledEquation);

    const board = toTiles(scrambledValues);
    
    const swappedIndices = findSwapIndices(scrambledValues, correctValues);

    // Make the swappable tiles selectable
    if (board[swappedIndices[0]]) board[swappedIndices[0]].isLocked = false;
    if (board[swappedIndices[1]]) board[swappedIndices[1]].isLocked = false;
    
    return {
        id: `${config.level}-${variationIndex}`,
        board,
        swappedIndices,
        correctSolution: correctValues,
    };
}

export function getHint(puzzle: MathPuzzle, level: number): string {
    const config = getMathPuzzleConfig(level);
    return config.hint;
}
