
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
 * Converts an equation string into an array of Tile objects.
 * e.g., "3 + 3 = 6" -> [{value: 3, locked: false}, {value: '+', locked: true}, ...]
 */
const toTiles = (equation: string): Tile[] => {
    // Add spaces around operators to ensure clean splitting
    const spacedEquation = equation.replace(/([+\-*/=])/g, ' $1 ');
    const parts = spacedEquation.split(' ').filter(p => p.trim() !== '');
    
    const tiles: Tile[] = [];
    for (const part of parts) {
        if (['+', '-', '*', '/', '='].includes(part)) {
            tiles.push({ value: part, isLocked: true });
        } else if (part === '_') {
            tiles.push({ value: '_', isLocked: false });
        }
        else if (!isNaN(Number(part))) {
            // Handle multi-digit numbers by splitting them into individual digit tiles
            for (const char of part) {
                tiles.push({ value: parseInt(char, 10), isLocked: false });
            }
        }
    }
    return tiles;
};

// This function is no longer needed with the new robust logic
// but we keep its structure in case of future debugging needs.
const findSwapIndicesRobust = (incorrectBoard: Tile[], correctBoard: Tile[]): [number, number] => {
    const diffIndices: number[] = [];
    for (let i = 0; i < incorrectBoard.length; i++) {
        if (incorrectBoard[i].value !== correctBoard[i].value) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 2) {
        return [diffIndices[0], diffIndices[1]];
    }

    console.error("Critical: Could not find exactly two differing indices between boards.", {
        incorrect: incorrectBoard.map(t => t.value),
        correct: correctBoard.map(t => t.value),
    });
    // Fallback for safety, though this should not be reached with correct templates.
    const unlocked = incorrectBoard.map((t, i) => !t.isLocked ? i : -1).filter(i => i !== -1);
    return [unlocked[0] ?? 0, unlocked[1] ?? 1];
}


/**
 * Takes a correct equation string and a pair of values to swap,
 * and returns the scrambled equation string.
 */
const createScrambledEquation = (correctEquation: string, swapPair: [string, string]): string => {
    const [val1, val2] = swapPair;
    
    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    const tempPlaceholder = `___TEMP_${Date.now()}___`;
    let scrambled = correctEquation;

    const regex1 = new RegExp(escapeRegExp(val1));
    const regex2 = new RegExp(escapeRegExp(val2));

    // Test if both values exist in the string before attempting a replacement.
    // This logic handles cases where a value appears multiple times, like '3+3=6' and swap ['3','6']
    const firstValCount = (correctEquation.match(regex1) || []).length;
    const secondValCount = (correctEquation.match(regex2) || []).length;

    if (firstValCount > 0 && secondValCount > 0) {
        // Perform the swap
        scrambled = correctEquation.replace(regex1, tempPlaceholder);
        scrambled = scrambled.replace(regex2, val1);
        scrambled = scrambled.replace(tempPlaceholder, val2);
    } else {
        // This indicates a misconfigured puzzle template.
        console.error(`Swap pair [${val1}, ${val2}] is invalid for equation "${correctEquation}"`);
    }
    
    return scrambled;
};

const templateToCorrectEquation = (template: string, swap: [string, string]): string => {
    // With the new system, the template IS the incorrect equation.
    // This function's job is to apply the swap to solve it.
    const [val1, val2] = swap;
    
    const tempPlaceholder = `___TEMP_CORRECT_${Date.now()}___`;
    let correct = template;

    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const regex1 = new RegExp(escapeRegExp(val1));
    const regex2 = new RegExp(escapeRegExp(val2));

    if (regex1.test(correct) && regex2.test(correct)) {
        correct = correct.replace(regex1, tempPlaceholder);
        correct = correct.replace(regex2, val1);
        correct = correct.replace(tempPlaceholder, val2);
    } else {
         console.error(`Could not form correct equation from template "${template}" with swap [${val1}, ${val2}]`);
    }

    return correct;
};


/**
 * Compares the initial (incorrect) board with the solved board to find the two swapped indices.
 * This is a robust way to identify the swappable tiles.
 */
const findSwapIndices = (scrambledEquation: string, swap: [string, string]): [number, number] => {
    
    // Let's generate the correct and incorrect boards, and find the two differing tiles.
    const correctEq = templateToCorrectEquation(scrambledEquation, swap);
    const correctTiles = toTiles(correctEq).map(t => String(t.value));
    const incorrectTiles = toTiles(scrambledEquation).map(t => String(t.value));
    
    const diffIndices: number[] = [];
    for (let i = 0; i < incorrectTiles.length; i++) {
        if (i >= correctTiles.length || incorrectTiles[i] !== correctTiles[i]) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 2) {
        return [diffIndices[0], diffIndices[1]];
    }
    
    console.error("Could not find exactly two differing indices. Check puzzle template.", {
        incorrect: incorrectTiles,
        correct: correctTiles,
        equation: scrambledEquation,
        swap,
    });
    // Return a default, non-crashing value.
    const incorrectBoard = toTiles(scrambledEquation);
    const unlocked = incorrectBoard.map((t, i) => !t.isLocked ? i : -1).filter(i => i !== -1);
    return [unlocked[0] ?? 0, unlocked[1] ?? 1];
};


export const mathLevels: MathLevel[] = [
    // 🔰 LEVELS 1–10: OPERATOR & DIGIT SWAPS (SINGLE DIGIT RESULTS)
    {
        level: 1, description: "Basic Arithmetic", hint: "The numbers look right, but is the relationship correct? Swap an operator with a number.",
        variations: [
            { equation: "3 + 3 = 6", swap: ["+", "6"] }, { equation: "4 + 2 = 6", swap: ["4", "6"] },
            { equation: "5 - 1 = 4", swap: ["-", "4"] }, { equation: "8 - 2 = 6", swap: ["8", "6"] },
            { equation: "9 - 3 = 6", swap: ["-", "6"] }, { equation: "2 * 3 = 6", swap: ["*", "6"] },
            { equation: "4 * 2 = 8", swap: ["4", "8"] }, { equation: "8 / 2 = 4", swap: ["/", "4"] },
            { equation: "9 / 3 = 3", swap: ["/", "3"] }, { equation: "5 + 2 = 7", swap: ["5", "7"] }
        ]
    },
    {
        level: 2, description: "Operator Swaps", hint: "It's not the numbers that are wrong, it's the action. Swap two operators.",
        variations: [
            { equation: "8 * 2 = 4 - 1", swap: ["*", "-"] }, { equation: "10 + 5 = 1 / 1", swap: ["+", "/"] },
            { equation: "3 - 3 = 10 * 1", swap: ["-", "*"] }, { equation: "4 * 5 = 3 + 3", swap: ["*", "+"] },
            { equation: "6 / 2 = 8 - 2", swap: ["/", "-"] }, { equation: "2 - 4 = 10 * 2", swap: ["-", "*"] },
            { equation: "12 + 6 = 1 / 1", swap: ["+", "/"] }, { equation: "5 * 3 = 2 + 4", swap: ["*", "+"] },
            { equation: "9 * 1 = 4 - 2", swap: ["*", "-"] }, { equation: "15 + 5 = 1 / 2", swap: ["+", "/"] }
        ]
    },
    {
        level: 3, description: "Digit Swaps", hint: "All the operators are correct, but two numbers need to trade places.",
        variations: [
            { equation: "9 + 8 = 1", swap: ["9", "1"] }, { equation: "8 - 1 = 9", swap: ["8", "9"] },
            { equation: "8 * 4 = 2", swap: ["8", "2"] }, { equation: "2 / 3 = 6", swap: ["2", "6"] },
            { equation: "7 + 4 = 3", swap: ["7", "3"] }, { equation: "4 - 3 = 7", swap: ["4", "7"] },
            { equation: "5 * 5 = 1", swap: ["5", "1"] }, { equation: "2 / 2 = 4", swap: ["2", "4"] },
            { equation: "8 + 6 = 2", swap: ["8", "2"] }, { equation: "3 - 5 = 8", swap: ["3", "8"] }
        ]
    },
    { 
        level: 4, description: "Basic Logic", hint: "A single swap will make it all add up.", 
        variations: [ 
            { equation: "9 + 7 = 2", swap: ["9", "2"] }, { equation: "5 - 3 = 8", swap: ["5", "8"] }, 
            { equation: "9 * 9 = 1", swap: ["9", "1"] }, { equation: "3 / 2 = 6", swap: ["3", "6"] }, 
            { equation: "8 + 4 = 4", swap: ["8", "4"] }, { equation: "5 - 4 = 9", swap: ["5", "9"] }, 
            { equation: "6 * 2 = 3", swap: ["6", "3"] }, { equation: "4 / 2 = 8", swap: ["4", "8"] }, 
            { equation: "8 + 3 = 5", swap: ["8", "5"] }, { equation: "5 - 2 = 7", swap: ["5", "7"] }
        ] 
    },
    { 
        level: 5, description: "Basic Logic", hint: "It's a puzzle of simple arithmetic.", 
        variations: [ 
            { equation: "7 + 6 = 1", swap: ["7", "1"] }, { equation: "7 - 2 = 9", swap: ["7", "9"] }, 
            { equation: "8 * 2 = 4", swap: ["8", "4"] }, { equation: "2 / 4 = 8", swap: ["2", "8"] }, 
            { equation: "9 + 6 = 3", swap: ["9", "3"] }, { equation: "5 - 1 = 6", swap: ["5", "6"] }, 
            { equation: "4 * 2 = 2", swap: ["4", "2"] }, { equation: "5 / 2 = 10", swap: ["5", "10"] }, 
            { equation: "7 + 3 = 4", swap: ["7", "4"] }, { equation: "7 - 1 = 8", swap: ["7", "8"] }
        ] 
    },
    { 
        level: 6, description: "Basic Logic", hint: "Look for the two symbols that are out of place.", 
        variations: [ 
            { equation: "7 + 5 = 2", swap: ["7", "2"] }, { equation: "4 - 5 = 9", swap: ["4", "9"] }, 
            { equation: "9 * 3 = 3", swap: ["9", "3"] }, { equation: "2 / 5 = 10", swap: ["2", "10"] }, 
            { equation: "6 + 5 = 1", swap: ["6", "1"] }, { equation: "2 - 6 = 8", swap: ["2", "8"] }, 
            { equation: "4 * 4 = 1", swap: ["4", "1"] }, { equation: "2 / 3 = 6", swap: ["2", "6"] }, 
            { equation: "6 + 1 = 5", swap: ["6", "5"] }, { equation: "2 - 7 = 9", swap: ["2", "9"] }
        ] 
    },
    { 
        level: 7, description: "Basic Logic", hint: "One swap will make the equation true.", 
        variations: [ 
            { equation: "8 + 5 = 3", swap: ["8", "3"] }, { equation: "3 - 4 = 7", swap: ["3", "7"] }, 
            { equation: "6 * 3 = 2", swap: ["6", "2"] }, { equation: "4 / 2 = 8", swap: ["4", "8"] }, 
            { equation: "6 + 2 = 4", swap: ["6", "4"] }, { equation: "3 - 6 = 9", swap: ["3", "9"] }, 
            { equation: "8 * 8 = 1", swap: ["8", "1"] }, { equation: "3 / 4 = 12", swap: ["3", "12"] }, 
            { equation: "6 + 4 = 2", swap: ["6", "2"] }, { equation: "2 - 5 = 7", swap: ["2", "7"] }
        ] 
    },
    { 
        level: 8, description: "Basic Logic", hint: "Find the two tiles that need to trade places.", 
        variations: [ 
            { equation: "9 + 3 = 6", swap: ["9", "6"] }, { equation: "6 - 2 = 8", swap: ["6", "8"] }, 
            { equation: "4 * 2 = 2", swap: ["4", "2"] }, { equation: "2 / 6 = 12", swap: ["2", "12"] }, 
            { equation: "8 + 3 = 5", swap: ["8", "5"] }, { equation: "6 - 1 = 7", swap: ["6", "7"] }, 
            { equation: "3 * 3 = 1", swap: ["3", "1"] }, { equation: "5 / 3 = 15", swap: ["5", "15"] }, 
            { equation: "5 + 1 = 4", swap: ["5", "4"] }, { equation: "8 - 2 = 10", swap: ["8", "10"] }
        ] 
    },
    { 
        level: 9, description: "Basic Logic", hint: "Focus on the numbers; one of them is in the wrong spot.", 
        variations: [ 
            { equation: "7 + 3 = 4", swap: ["7", "4"] }, { equation: "5 - 4 = 9", swap: ["5", "9"] }, 
            { equation: "8 * 4 = 2", swap: ["8", "2"] }, { equation: "7 / 2 = 14", swap: ["7", "14"] }, 
            { equation: "5 + 3 = 2", swap: ["5", "2"] }, { equation: "3 - 5 = 8", swap: ["3", "8"] }, 
            { equation: "10 * 2 = 5", swap: ["10", "5"] }, { equation: "4 / 4 = 16", swap: ["4", "16"] }, 
            { equation: "8 + 5 = 3", swap: ["8", "3"] }, { equation: "7 - 3 = 10", swap: ["7", "10"] }
        ] 
    },
    { 
        level: 10, description: "Basic Logic", hint: "The solution is just one swap away.", 
        variations: [ 
            { equation: "9 + 4 = 5", swap: ["9", "5"] }, { equation: "7 - 1 = 8", swap: ["7", "8"] }, 
            { equation: "6 * 2 = 3", swap: ["6", "3"] }, { equation: "6 / 3 = 18", swap: ["6", "18"] }, 
            { equation: "7 + 1 = 6", swap: ["7", "6"] }, { equation: "3 - 6 = 9", swap: ["3", "9"] }, 
            { equation: "8 + 2 = 4", swap: ["8", "4"] }, { equation: "4 / 5 = 20", swap: ["4", "20"] }, 
            { equation: "4 + 2 = 2", swap: ["4", "2"] }, { equation: "1 - 6 = 7", swap: ["1", "7"] }
        ] 
    },

    // 🔢 LEVELS 11-20: INTRODUCE MULTI-DIGIT RESULTS
    {
        level: 11, description: "Multi-Digit Results", hint: "The answer is a two-digit number. One of its digits has been swapped with a number in the problem.",
        variations: [
            { equation: "8 + 1 = 24", swap: ["1", "4"] }, { equation: "9 + 1 = 45", swap: ["1", "5"] },
            { equation: "7 + 1 = 36", swap: ["1", "6"] }, { equation: "6 * 1 = 83", swap: ["1", "3"] },
            { equation: "5 * 2 = 04", swap: ["2", "4"] }, { equation: "20 - 1 = 19", swap: ["1", "9"] },
            { equation: "25 - 0 = 25", swap: ["0", "5"] }, { equation: "30 - 1 = 29", swap: ["1", "9"] },
            { equation: "7 + 1 = 47", swap: ["1", "7"] }, { equation: "8 * 1 = 62", swap: ["1", "2"] }
        ]
    },
    {
        level: 12, description: "Digit Position", hint: "The digits in the answer are correct, but they have been swapped with each other.",
        variations: [
            { equation: "15 - 3 = 21", swap: ["2", "1"] }, { equation: "18 - 4 = 41", swap: ["4", "1"] },
            { equation: "9 * 2 = 81", swap: ["8", "1"] }, { equation: "24 / 2 = 21", swap: ["2", "1"] },
            { equation: "8 + 9 = 71", swap: ["7", "1"] }, { equation: "21 - 9 = 21", swap: ["2", "1"] },
            { equation: "4 * 4 = 61", swap: ["6", "1"] }, { equation: "30 / 2 = 51", swap: ["5", "1"] },
            { equation: "9 + 9 = 81", swap: ["8", "1"] }, { equation: "16 - 4 = 21", swap: ["2", "1"] }
        ]
    },
    { 
        level: 13, description: "Multi-Digit Swaps", hint: "All the right digits, but not in the right order.", 
        variations: [ 
            { equation: "15 + 5 = 10", swap: ["5", "0"] }, { equation: "22 - 8 = 10", swap: ["2", "0"] }, 
            { equation: "1 * 3 = 86", swap: ["1", "6"] }, { equation: "10 / 4 = 40", swap: ["0", "4"] }, 
            { equation: "1 + 3 = 29", swap: ["1", "9"] }, { equation: "25 - 15 = 10", swap: ["5", "0"] }, 
            { equation: "2 * 3 = 17", swap: ["2", "7"] }, { equation: "10 / 5 = 50", swap: ["0", "5"] }, 
            { equation: "1 + 8 = 68", swap: ["1", "6"] }, { equation: "31 - 11 = 90", swap: ["1", "0"] }
        ] 
    },
    { 
        level: 14, description: "Multi-Digit Swaps", hint: "It's not what the numbers say, it's where they are.", 
        variations: [ 
            { equation: "19 + 7 = 12", swap: ["9", "2"] }, { equation: "27 - 5 = 12", swap: ["7", "2"] }, 
            { equation: "1 * 5 = 53", swap: ["1", "3"] }, { equation: "18 / 2 = 44", swap: ["1", "4"] }, 
            { equation: "1 + 8 = 79", swap: ["1", "9"] }, { equation: "12 - 7 = 99", swap: ["2", "9"] }, 
            { equation: "2 * 4 = 46", swap: ["2", "6"] }, { equation: "19 / 3 = 33", swap: ["1", "3"] }, 
            { equation: "12 + 9 = 20", swap: ["2", "0"] }, { equation: "20 - 6 = 26", swap: ["0", "6"] }
        ] 
    },
    { 
        level: 15, description: "Multi-Digit Swaps", hint: "A single digit swap will make the equation balance.", 
        variations: [ 
            { equation: "19 + 5 = 14", swap: ["9", "4"] }, { equation: "29 - 9 = 18", swap: ["9", "8"] }, 
            { equation: "2 * 5 = 55", swap: ["2", "5"] }, { equation: "16 / 3 = 22", swap: ["1", "2"] }, 
            { equation: "19 + 6 = 13", swap: ["9", "3"] }, { equation: "23 - 8 = 11", swap: ["3", "1"] }, 
            { equation: "2 * 5 = 04", swap: ["2", "4"] }, { equation: "18 / 4 = 22", swap: ["1", "2"] }, 
            { equation: "11 + 9 = 22", swap: ["1", "2"] }, { equation: "34 - 8 = 22", swap: ["4", "2"] }
        ] 
    },
    { 
        level: 16, description: "Multi-Digit Swaps", hint: "Two digits are in the wrong positions.", 
        variations: [ 
            { equation: "12 + 8 = 27", swap: ["2", "7"] }, { equation: "32 - 8 = 20", swap: ["2", "0"] }, 
            { equation: "3 * 5 = 06", swap: ["3", "6"] }, { equation: "24 / 2 = 22", swap: ["2", "4"] }, 
            { equation: "12 + 9 = 25", swap: ["2", "5"] }, { equation: "22 - 6 = 28", swap: ["2", "8"] }, 
            { equation: "2 * 4 = 87", swap: ["2", "7"] }, { equation: "20 / 3 = 60", swap: ["2", "6"] }, 
            { equation: "12 + 5 = 29", swap: ["2", "9"] }, { equation: "30 - 10 = 55", swap: ["0", "5"] }
        ] 
    },
    { 
        level: 17, description: "Multi-Digit Swaps", hint: "The digits of the answer are correct, but swapped.", 
        variations: [ 
            { equation: "8 * 4 = 23", swap: ["2", "3"] }, { equation: "9 * 5 = 54", swap: ["5", "4"] }, 
            { equation: "7 * 6 = 24", swap: ["2", "4"] }, { equation: "9 * 6 = 45", swap: ["4", "5"] }, 
            { equation: "8 * 7 = 65", swap: ["6", "5"] }, { equation: "9 * 7 = 36", swap: ["3", "6"] }, 
            { equation: "8 * 8 = 46", swap: ["4", "6"] }, { equation: "9 * 8 = 27", swap: ["2", "7"] }, 
            { equation: "9 * 9 = 18", swap: ["1", "8"] }, { equation: "12 * 5 = 06", swap: ["0", "6"] }
        ] 
    },
    { 
        level: 18, description: "Multi-Digit Swaps", hint: "One number in the question and one in the answer need to swap.", 
        variations: [ 
            { equation: "20 + 25 = 55", swap: ["0", "5"] }, { equation: "55 - 25 = 20", swap: ["5", "0"] }, 
            { equation: "18 * 4 = 42", swap: ["8", "2"] }, { equation: "105 / 4 = 20", swap: ["5", "0"] }, 
            { equation: "35 + 20 = 50", swap: ["5", "0"] }, { equation: "45 - 15 = 20", swap: ["5", "0"] }, 
            { equation: "14 * 3 = 45", swap: ["4", "5"] }, { equation: "72 / 3 = 25", swap: ["2", "5"] }, 
            { equation: "30 + 15 = 55", swap: ["0", "5"] }, { equation: "65 - 15 = 40", swap: ["5", "0"] }
        ] 
    },
    { 
        level: 19, description: "Operator & Digit Swaps", hint: "The numbers are right, but the operators are wrong.", 
        variations: [ 
            { equation: "5 * 5 0 5 = 2-", swap: ["0", "-"] }, { equation: "6 * 6 0 6 = 3-", swap: ["0", "-"] }, 
            { equation: "4 * 4 2 4 = 1-", swap: ["2", "-"] }, { equation: "10 * 2 5 5 = 1-", swap: ["5", "-"] }, 
            { equation: "8 * 3 0 4 = 2-", swap: ["0", "-"] }, { equation: "9 * 2 0 8 = 1-", swap: ["0", "-"] }, 
            { equation: "7 * 3 0 1 = 2-", swap: ["0", "-"] }, { equation: "3 * 5 0 5 = 1-", swap: ["0", "-"] }, 
            { equation: "12 * 2 0 4 = 2-", swap: ["0", "-"] }, { equation: "10 * 3 0 10 = 2-", swap: ["0", "-"] }
        ] 
    },
    { 
        level: 20, description: "Multi-Digit Swaps", hint: "Find the two digits that are out of place.", 
        variations: [ 
            { equation: "15 + 13 = 22", swap: ["5", "2"] }, { equation: "24 - 11 = 15", swap: ["4", "5"] }, 
            { equation: "18 * 2 = 24", swap: ["8", "4"] }, { equation: "13 / 3 = 11", swap: ["1", "3"] }, 
            { equation: "17 + 12 = 25", swap: ["7", "5"] }, { equation: "38 - 12 = 10", swap: ["8", "0"] }, 
            { equation: "15 * 5 = 51", swap: ["5", "1"] }, { equation: "21 / 2 = 21", swap: ["2", "1"] }, 
            { equation: "17 + 11 = 26", swap: ["7", "6"] }, { equation: "20 - 10 = 19", swap: ["0", "9"] }
        ] 
    },
    
    // 🧮 LEVELS 21-30: ORDER OF OPERATIONS
    { 
        level: 21, description: "Order of Operations", hint: "Which operation should happen first? Swap an operator and a number.", 
        variations: [ 
            { equation: "2 + 4 * 3 = 14", swap: ["+", "4"] }, { equation: "3 + 5 * 2 = 11", swap: ["+", "1"] }, 
            { equation: "10 - 4 * 2 = 2", swap: ["-", "2"] }, { equation: "15 - 6 * 3 = 3", swap: ["-", "3"] }, 
            { equation: "3 * 2 + 4 = 14", swap: ["+", "4"] }, { equation: "4 * 5 + 3 = 17", swap: ["+", "7"] }, 
            { equation: "20 / 5 - 2 = 5", swap: ["-", "5"] }, { equation: "18 / 3 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "5 + 2 * 5 = 15", swap: ["+", "5"] }, { equation: "8 - 3 * 2 = 2", swap: ["-", "2"] }
        ] 
    },
    { 
        level: 22, description: "Order of Operations", hint: "Remember: Multiplication before Addition. One digit is out of place.", 
        variations: [ 
            { equation: "3 + 8 * 3 = 15", swap: ["8", "5"] }, { equation: "2 * 1 + 4 = 66", swap: ["1", "6"] }, 
            { equation: "10 * 2 7 3 = 1-", swap: ["7", "-"] }, { equation: "8 + 1 / 2 = 61", swap: ["1", "6"] }, 
            { equation: "12 - 5 * 2 = 2", swap: ["-", "2"] }, { equation: "7 + 7 * 5 = 12", swap: ["7", "2"] }, 
            { equation: "20 / 4 4 1 = -", swap: ["4", "-"] }, { equation: "9 * 2 3 5 = 1-", swap: ["3", "-"] }, 
            { equation: "15 + 17 / 5 = 10", swap: ["7", "0"] }, { equation: "3 + 3 * 5 = 24", swap: ["3", "4"] }
        ] 
    },
    { 
        level: 23, description: "Order of Operations", hint: "A digit or an operator might be in the wrong place.", 
        variations: [ 
            { equation: "5 + 1 * 5 = 25", swap: ["1", "5"] }, { equation: "10 / 8 + 3 = 2", swap: ["/", "2"] }, 
            { equation: "12 + 4 / 8 = 14", swap: ["4", "8"] }, { equation: "20 - 1 * 2 = 00", swap: ["-", "0"] }, 
            { equation: "9 * 4 - 3 = 23", swap: ["-", "3"] }, { equation: "18 - 6 / 3 = 16", swap: ["-", "6"] }, 
            { equation: "7 + 5 * 2 = 14", swap: ["5", "4"] }, { equation: "16 / 4 - 4 = 2", swap: ["/", "2"] }, 
            { equation: "1 + 9 * 2 = 19", swap: ["1", "9"] }, { equation: "25 - 5 * 4 = 5", swap: ["-", "5"] }
        ] 
    },
    { 
        level: 24, description: "Order of Operations", hint: "Think about the sequence of calculations.", 
        variations: [ 
            { equation: "10 - 2 * 3 = 4", swap: ["-", "4"] }, { equation: "15 / 7 + 2 = 3", swap: ["/", "3"] }, 
            { equation: "5 * 1 + 4 = 21", swap: ["1", "4"] }, { equation: "18 / 2 - 1 = 6", swap: ["-", "6"] }, 
            { equation: "8 + 4 * 3 = 12", swap: ["4", "2"] }, { equation: "24 / 4 - 4 = 2", swap: ["-", "2"] }, 
            { equation: "7 + 9 * 4 = 13", swap: ["9", "3"] }, { equation: "21 / 1 - 2 = 7", swap: ["-", "7"] }, 
            { equation: "6 + 6 * 2 = 15", swap: ["6", "5"] }, { equation: "30 / 7 + 1 = 5", swap: ["/", "5"] }
        ] 
    },
    { 
        level: 25, description: "Order of Operations", hint: "It's a puzzle of priority.", 
        variations: [ 
            { equation: "40 / 10 - 2 = 2", swap: ["-", "2"] }, { equation: "36 / 6 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "100 / 10 - 1 = 9", swap: ["-", "9"] }, { equation: "50 / 10 + 0 = 15", swap: ["+", "5"] }, 
            { equation: "1 + 7 * 3 = 2", swap: ["+", "2"] }, { equation: "9 - 7 / 3 = 6", swap: ["-", "6"] }, 
            { equation: "4 * 4 + 2 = 38", swap: ["*", "8"] }, { equation: "16 / 2 - 2 = 4", swap: ["-", "4"] }, 
            { equation: "10 * 10 - 9 = 91", swap: ["-", "1"] }, { equation: "25 + 17 / 5 = 20", swap: ["7", "0"] }
        ] 
    },
    { 
        level: 26, description: "Order of Operations", hint: "Find the single incorrect symbol, digit or operator.", 
        variations: [ 
            { equation: "4 * 8 + 2 = 14", swap: ["8", "4"] }, { equation: "6 + 4 * 9 = 22", swap: ["4", "2"] }, 
            { equation: "30 / 3 - 5 = 5", swap: ["-", "5"] }, { equation: "5 * 7 - 6 = 29", swap: ["6", "9"] }, 
            { equation: "6 * 9 + 7 = 47", swap: ["+", "7"] }, { equation: "12 + 14 / 5 = 10", swap: ["4", "0"] }, 
            { equation: "45 / 9 - 0 = 5", swap: ["-", "0"] }, { equation: "8 * 4 + 14 = 42", swap: ["4", "2"] }, 
            { equation: "9 * 11 - 9 = 80", swap: ["-", "0"] }, { equation: "100 / 10 + 5 = 15", swap: ["+", "5"] }
        ] 
    },
    { 
        level: 27, description: "Order of Operations", hint: "Think outside the box. Digits can move anywhere.", 
        variations: [ 
            { equation: "5 * 3 + 2 = 62", swap: ["3", "6"] }, { equation: "9 * 4 - 0 = 36", swap: ["-", "6"] }, 
            { equation: "40 / 7 + 2 = 8", swap: ["7", "8"] }, { equation: "2 + 7 * 5 = 37", swap: ["5", "7"] }, 
            { equation: "14 + 24 / 8 = 28", swap: ["4", "8"] }, {
                "equation": "10 * 10 - 1 = 99",
                "swap": [
                    "1",
                    "9"
                ]
            }, {
                "equation": "81 / 7 + 8 = 19",
                "swap": [
                    "7",
                    "9"
                ]
            }, {
                "equation": "3 * 15 - 0 = 45",
                "swap": [
                    "0",
                    "5"
                ]
            }, {
                "equation": "60 / 4 + 6 = 14",
                "swap": [
                    "4",
                    "6"
                ]
            }, {
                "equation": "22 + 3 * 8 = 28",
                "swap": [
                    "3",
                    "2"
                ]
            }
        ]
    },
    { 
        level: 28, description: "Order of Operations", hint: "It might be an operator swap, or it might be a digit.", 
        variations: [ 
            {
                "equation": "12 * 6 + 8 = 54",
                "swap": [
                    "*",
                    "4"
                ]
            }, {
                "equation": "50 / 10 - 1 = 4",
                "swap": [
                    "-",
                    "1"
                ]
            }, {
                "equation": "7 + 4 * 9 = 33",
                "swap": [
                    "+",
                    "3"
                ]
            }, {
                "equation": "100 / 5 - 5 = 15",
                "swap": [
                    "/",
                    "5"
                ]
            }, {
                "equation": "9 + 4 * 5 = 35",
                "swap": [
                    "+",
                    "5"
                ]
            }, {
                "equation": "64 / 8 - 0 = 8",
                "swap": [
                    "-",
                    "0"
                ]
            }, {
                "equation": "13 + 4 * 3 = 90",
                "swap": [
                    "4",
                    "9"
                ]
            }, {
                "equation": "49 / 7 - 0 = 7",
                "swap": [
                    "-",
                    "0"
                ]
            }, {
                "equation": "11 * 0 + 2 = 98",
                "swap": [
                    "*",
                    "8"
                ]
            }, {
                "equation": "33 / 3 - 0 = 11",
                "swap": [
                    "-",
                    "0"
                ]
            }
        ] 
    },
    { 
        level: 29, description: "Order of Operations", hint: "The answer seems impossible until you find the swap.", 
        variations: [ 
            {
                "equation": "9 * 9 - 2 = 79",
                "swap": [
                    "2",
                    "9"
                ]
            }, {
                "equation": "8 * 8 - 6 = 58",
                "swap": [
                    "6",
                    "8"
                ]
            }, {
                "equation": "7 * 7 - 2 = 47",
                "swap": [
                    "2",
                    "7"
                ]
            }, {
                "equation": "6 * 6 - 0 = 36",
                "swap": [
                    "0",
                    "6"
                ]
            }, {
                "equation": "5 * 5 - 0 = 25",
                "swap": [
                    "0",
                    "5"
                ]
            }, {
                "equation": "12 * 12 - 2 = 132",
                "swap": [
                    "-",
                    "2"
                ]
            }, {
                "equation": "11 * 11 - 0 = 111",
                "swap": [
                    "0",
                    "1"
                ]
            }, {
                "equation": "10 * 10 - 0 = 90",
                "swap": [
                    "-",
                    "0"
                ]
            }, {
                "equation": "13 * 13 - 6 = 159",
                "swap": [
                    "6",
                    "9"
                ]
            }, {
                "equation": "14 * 14 - 4 = 182",
                "swap": [
                    "4",
                    "2"
                ]
            }
        ] 
    },
    { 
        level: 30, description: "Order of Operations", hint: "One swap makes it all add up. Or multiply.", 
        variations: [ 
            {
                "equation": "4 + 0 * 4 = 24",
                "swap": [
                    "0",
                    "4"
                ]
            }, {
                "equation": "6 + 1 * 5 = 23",
                "swap": [
                    "1",
                    "3"
                ]
            }, {
                "equation": "45 / 5 + 3 = 14",
                "swap": [
                    "3",
                    "4"
                ]
            }, {
                "equation": "100 - 1 * 9 = 99",
                "swap": [
                    "1",
                    "9"
                ]
            }, {
                "equation": "1 + 8 * 3 = 29",
                "swap": [
                    "8",
                    "9"
                ]
            }, {
                "equation": "8 * 5 - 30 = 10",
                "swap": [
                    "30",
                    "10"
                ]
            }, {
                "equation": "72 / 8 + 3 = 14",
                "swap": [
                    "3",
                    "4"
                ]
            }, {
                "equation": "60 - 5 * 7 = 25",
                "swap": [
                    "0",
                    "2"
                ]
            }, {
                "equation": "2 + 3 * 8 = 34",
                "swap": [
                    "3",
                    "4"
                ]
            }, {
                "equation": "99 / 9 - 0 = 11",
                "swap": [
                    "0",
                    "1"
                ]
            }
        ] 
    },
    
    // 🧩 LEVELS 31-40: FILL-IN-THE-BLANK (PRE-ALGEBRA)
    { 
        level: 31, description: "Fill in the Blank", hint: "What number is missing? Swap it with the blank space.", 
        variations: [ 
            { equation: "4 + 6 = _0", swap: ["_", "1"] }, { equation: "5 + 7 = _2", swap: ["_", "1"] }, 
            { equation: "5 + 4 = _", swap: ["_", "9"] }, { equation: "5 + 8 = _3", swap: ["_", "1"] }, 
            { equation: "6 + 5 = _1", swap: ["_", "1"] }, { equation: "5 + 9 = _4", swap: ["_", "1"] }, 
            { equation: "3 + 4 = _", swap: ["_", "7"] }, { equation: "4 + 2 = _", swap: ["_", "6"] }, 
            { equation: "3 + 1 = _", swap: ["_", "4"] }, { equation: "5 + 10 = _5", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 32, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", 
        variations: [ 
            { equation: "15 - 7 = _", swap: ["_", "8"] }, { equation: "20 - 9 = _1", swap: ["_", "1"] }, 
            { equation: "12 - 7 = _", swap: ["_", "5"] }, { equation: "18 - 9 = _", swap: ["_", "9"] }, 
            { equation: "25 - 10 = _5", swap: ["_", "1"] }, { equation: "14 - 8 = _", swap: ["_", "6"] }, 
            { equation: "17 - 8 = _", swap: ["_", "9"] }, { equation: "22 - 9 = _3", swap: ["_", "1"] }, 
            { equation: "30 - 9 = _1", swap: ["_", "2"] }, { equation: "19 - 7 = _2", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 33, description: "Fill in the Blank", hint: "What times 3 equals 21?", 
        variations: [ 
            { equation: "7 * 3 = _1", swap: ["_", "2"] }, { equation: "5 * 5 = _5", swap: ["_", "2"] }, 
            { equation: "9 * 4 = _6", swap: ["_", "3"] }, { equation: "7 * 6 = _2", swap: ["_", "4"] }, 
            { equation: "8 * 8 = _4", swap: ["_", "6"] }, { equation: "9 * 2 = _8", swap: ["_", "1"] }, 
            { equation: "9 * 9 = _1", swap: ["_", "8"] }, { equation: "7 * 7 = _9", swap: ["_", "4"] }, 
            { equation: "10 * 10 = _00", swap: ["_", "1"] }, { equation: "11 * 11 = _21", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 34, description: "Fill in the Blank", hint: "A number is missing from the equation.", 
        variations: [ 
            { equation: "45 / 5 = _", swap: ["_", "9"] }, { equation: "63 / 9 = _", swap: ["_", "7"] }, 
            { equation: "48 / 6 = _", swap: ["_", "8"] }, { equation: "56 / 8 = _", swap: ["_", "7"] }, 
            { equation: "72 / 8 = _", swap: ["_", "9"] }, { equation: "81 / 9 = _", swap: ["_", "9"] }, 
            { equation: "49 / 7 = _", swap: ["_", "7"] }, { equation: "100 / 10 = _0", swap: ["_", "1"] }, 
            { equation: "144 / 12 = _2", swap: ["_", "1"] }, { equation: "110 / 10 = _1", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 35, description: "Fill in the Blank", hint: "Swap the correct number into the blank space.", 
        variations: [ 
            { equation: "10 + 8 = _8", swap: ["_", "1"] }, { equation: "25 - 8 = _7", swap: ["_", "1"] }, 
            { equation: "6 * 9 = _4", swap: ["_", "5"] }, { equation: "77 / 11 = _", swap: ["_", "7"] }, 
            { equation: "13 + 8 = _1", swap: ["_", "2"] }, { equation: "30 - 11 = _9", swap: ["_", "1"] }, 
            { equation: "8 * 9 = _2", swap: ["_", "7"] }, { equation: "96 / 12 = _", swap: ["_", "8"] }, 
            { equation: "21 + 9 = _0", swap: ["_", "3"] }, { equation: "42 - 13 = _9", swap: ["_", "2"] }
        ] 
    },
    { 
        level: 36, description: "Blank + Multi-digit", hint: "Solve backwards from the answer.", 
        variations: [ 
            { equation: "8 + 6 = _4", swap: ["_", "1"] }, { equation: "3 * 6 = _8", swap: ["_", "1"] }, 
            { equation: "12 + 9 = _1", swap: ["_", "2"] }, { equation: "45 / 15 = _", swap: ["_", "3"] }, 
            { equation: "22 - 15 = _", swap: ["_", "7"] }, { equation: "5 * 7 = _5", swap: ["_", "3"] }, 
            { equation: "14 + 11 = _5", swap: ["_", "2"] }, { equation: "60 / 12 = _", swap: ["_", "5"] }, 
            { equation: "24 - 12 = _2", swap: ["_", "1"] }, { equation: "2 * 16 = _2", swap: ["_", "3"] }
        ] 
    },
    { 
        level: 37, description: "Blank + Multi-digit", hint: "What single digit completes the equation?", 
        variations: [ 
            { equation: "3 * 12 = _6", swap: ["_", "3"] }, { equation: "100 - 15 = _5", swap: ["_", "8"] }, 
            { equation: "25 + 16 = _1", swap: ["_", "4"] }, { equation: "144 / 12 = _2", swap: ["_", "1"] }, 
            { equation: "12 * 9 = _08", swap: ["_", "1"] }, { equation: "75 - 25 = _0", swap: ["_", "5"] }, 
            { equation: "50 + 27 = _7", swap: ["_", "7"] }, { equation: "132 / 12 = _1", swap: ["_", "1"] }, 
            { equation: "8 * 12 = _6", swap: ["_", "9"] }, { equation: "200 - 25 = _75", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 38, description: "Blank + Multi-digit", hint: "Find the missing number to balance the equation.", 
        variations: [ 
            { equation: "13 * 3 = _9", swap: ["_", "3"] }, { equation: "55 - 35 = _0", swap: ["_", "2"] }, 
            { equation: "42 + 18 = _0", swap: ["_", "6"] }, { equation: "125 / 5 = _5", swap: ["_", "2"] }, 
            { equation: "15 * 5 = _5", swap: ["_", "7"] }, { equation: "75 - 45 = _0", swap: ["_", "3"] }, 
            { equation: "60 + 39 = _9", swap: ["_", "9"] }, { equation: "250 / 10 = _5", swap: ["_", "2"] }, 
            { equation: "11 * 12 = _32", swap: ["_", "1"] }, { equation: "150 - 100 = _0", swap: ["_", "5"] }
        ] 
    },
    { 
        level: 39, description: "Blank + Multi-digit", hint: "A single swap will solve it.", 
        variations: [ 
            { equation: "14 * 4 = _6", swap: ["_", "5"] }, { equation: "80 - 15 = _5", swap: ["_", "6"] }, 
            { equation: "20 + 35 = _5", swap: ["_", "5"] }, { equation: "90 / 15 = _", swap: ["_", "6"] }, 
            { equation: "16 * 4 = _4", swap: ["_", "6"] }, { equation: "120 - 25 = _5", swap: ["_", "9"] }, 
            { equation: "45 + 25 = _0", swap: ["_", "7"] }, { equation: "105 / 15 = _", swap: ["_", "7"] }, 
            { equation: "18 * 4 = _2", swap: ["_", "7"] }, { equation: "150 - 25 = _25", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 40, description: "Blank + Multi-digit", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "19 * 5 = _5", swap: ["_", "9"] }, { equation: "100 - 85 = _5", swap: ["_", "1"] }, 
            { equation: "70 + 40 = _10", swap: ["_", "1"] }, { equation: "180 / 20 = _", swap: ["_", "9"] }, 
            { equation: "22 * 4 = _8", swap: ["_", "8"] }, { equation: "150 - 125 = _5", swap: ["_", "2"] }, 
            { equation: "90 + 40 = _30", swap: ["_", "1"] }, { equation: "200 / 25 = _", swap: ["_", "8"] }, 
            { equation: "24 * 5 = _20", swap: ["_", "1"] }, { equation: "200 - 125 = _5", swap: ["_", "7"] }
        ] 
    },
    
    // 🔥 LEVELS 41-50: EVIL GENIUS LEVELS (MIXED LOGIC)
    { 
        level: 41, description: "Mixed Logic", hint: "Solve backwards. Find the missing number.", 
        variations: [ 
            { equation: "4 * 4 + 2 = _8", swap: ["_", "1"] }, { equation: "4 * 3 + 1 = _3", swap: ["_", "1"] }, 
            { equation: "5 * 5 - 5 = _0", swap: ["_", "2"] }, { equation: "3 * 6 / 2 = _", swap: ["_", "9"] }, 
            { equation: "5 * 2 + 4 = _4", swap: ["_", "1"] }, { equation: "4 * 7 - 7 = _1", swap: ["_", "2"] }, 
            { equation: "3 * 3 + 6 = _5", swap: ["_", "1"] }, { equation: "3 * 8 / 4 = _", swap: ["_", "6"] }, 
            { equation: "4 * 9 - 9 = _7", swap: ["_", "2"] }, { equation: "4 * 10 / 5 = _", swap: ["_", "8"] }
        ] 
    },
    { 
        level: 42, description: "Mixed Logic", hint: "What needs to happen first?", 
        variations: [ 
            { equation: "10 + 7 * 2 = _4", swap: ["_", "2"] }, { equation: "20 - 4 * 3 = _", swap: ["_", "8"] }, 
            { equation: "5 * 5 + 5 = _0", swap: ["_", "3"] }, { equation: "30 / 6 + 2 = _", swap: ["_", "7"] }, 
            { equation: "8 + 3 * 4 = _0", swap: ["_", "2"] }, { equation: "40 - 5 * 5 = _5", swap: ["_", "1"] }, 
            { equation: "6 * 4 + 8 = _2", swap: ["_", "3"] }, { equation: "50 / 5 - 3 = _", swap: ["_", "7"] }, 
            { equation: "12 + 6 * 3 = _0", swap: ["_", "3"] }, { equation: "100 - 10 * 10 = _", swap: ["_", "0"] }
        ] 
    },
    { 
        level: 43, description: "Mixed Logic", hint: "Two steps. One swap.", 
        variations: [ 
            { equation: "3 * 4 + 6 = _8", swap: ["_", "1"] }, { equation: "5 * 6 - 10 = _0", swap: ["_", "2"] }, 
            { equation: "20 / 4 + 4 = _", swap: ["_", "9"] }, { equation: "18 / 6 - 2 = _", swap: ["_", "1"] }, 
            { equation: "2 * 8 + 6 = _2", swap: ["_", "2"] }, { equation: "7 * 3 - 6 = _5", swap: ["_", "1"] }, 
            { equation: "36 / 4 + 6 = _5", swap: ["_", "1"] }, { equation: "40 / 8 - 3 = _", swap: ["_", "2"] }, 
            { equation: "5 * 7 + 5 = _0", swap: ["_", "4"] }, { equation: "60 / 10 - 6 = _", swap: ["_", "0"] }
        ] 
    },
    { 
        level: 44, description: "Mixed Logic", hint: "Find the single incorrect symbol.", 
        variations: [ 
            { equation: "4 + 5 * 3 = _9", swap: ["_", "1"] }, { equation: "25 - 2 * 5 = _5", swap: ["_", "1"] }, 
            { equation: "8 * 2 + 4 = _0", swap: ["_", "2"] }, { equation: "42 / 7 - 3 = _", swap: ["_", "3"] }, 
            { equation: "9 + 3 * 3 = _8", swap: ["_", "1"] }, { equation: "32 - 4 * 4 = _6", swap: ["_", "1"] }, 
            { equation: "6 * 5 + 3 = _3", swap: ["_", "3"] }, { equation: "54 / 9 - 4 = _", swap: ["_", "2"] }, 
            { equation: "11 + 6 * 3 = _9", swap: ["_", "2"] }, { equation: "70 - 7 * 7 = _1", swap: ["_", "2"] }
        ] 
    },
    { 
        level: 45, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", 
        variations: [ 
            { equation: "6 + 5 * 3 = _1", swap: ["_", "2"] }, { equation: "4 * 7 - 7 = _1", swap: ["_", "2"] }, 
            { equation: "50 / 10 + 5 = _0", swap: ["_", "1"] }, { equation: "100 - 10 * 9 = _0", swap: ["_", "1"] }, 
            { equation: "1 + 9 * 3 = _8", swap: ["_", "2"] }, { equation: "8 * 5 - 10 = _0", swap: ["_", "3"] }, 
            { equation: "72 / 9 + 4 = _2", swap: ["_", "1"] }, { equation: "60 - 5 * 7 = _5", swap: ["_", "2"] }, 
            { equation: "2 + 4 * 8 = _4", swap: ["_", "3"] }, { equation: "99 / 9 - 1 = _0", swap: ["_", "1"] }
        ] 
    },
    { 
        level: 46, description: "Evil Genius", hint: "The digits are there, just scrambled.", 
        variations: [ 
            { equation: "29 * 4 = 96", swap: ["9", "4"] }, { equation: "74 / 3 = 22", swap: ["4", "2"] }, 
            { equation: "32 + 41 = 71", swap: ["2", "1"] }, { equation: "99 - 19 = 78", swap: ["9", "8"] }, 
            { equation: "10 * 5 = 98", swap: ["0", "8"] }, { equation: "152 / 6 = 26", swap: ["2", "6"] }, 
            { equation: "61 + 23 = 98", swap: ["1", "8"] }, { equation: "85 - 18 = 63", swap: ["5", "3"] }, 
            { equation: "28 * 4 = 82", swap: ["8", "2"] }, { equation: "47 / 7 = 9", swap: ["7", "9"] }
        ] 
    },
    { 
        level: 47, description: "Evil Genius", hint: "Two numbers are switched. Can you spot them?", 
        variations: [ 
            { equation: "18 + 8 = 10", swap: ["8", "0"] }, { equation: "10 - 10 = 9", swap: ["0", "9"] }, 
            { equation: "7 * 9 = 47", swap: ["9", "7"] }, { equation: "39 / 4 = 6", swap: ["9", "6"] }, 
            { equation: "21 + 9 = 32", swap: ["1", "2"] }, { equation: "55 - 25 = 20", swap: ["5", "0"] }, 
            { equation: "12 * 8 = 150", swap: ["2", "5"] }, { equation: "89 / 9 = 1", swap: ["9", "1"] }, 
            { equation: "49 + 53 = 96", swap: ["9", "6"] }, { equation: "119 - 11 = 90", swap: ["9", "0"] }
        ] 
    },
    { 
        level: 48, description: "Evil Genius", hint: "The equation looks complex, but the fix is a simple digit swap.", 
        variations: [ 
            { equation: "10 * 8 = 134", swap: ["0", "3"] }, { equation: "12 * 15 = 225", swap: ["2", "1"] }, 
            { equation: "12 * 14 = 264", swap: ["2", "6"] }, { equation: "19 * 16 = 122", swap: ["9", "2"] }, 
            { equation: "21 * 5 = 155", swap: ["1", "5"] }, { equation: "10 * 19 = 219", swap: ["0", "1"] }, 
            { equation: "22 * 11 = 220", swap: ["2", "0"] }, { equation: "25 * 11 = 233", swap: ["5", "3"] }, 
            { equation: "15 * 18 = 282", swap: ["5", "8"] }, { equation: "22 * 8 = 284", swap: ["2", "8"] }
        ] 
    },
    { 
        level: 49, description: "Evil Genius", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "7 6 1 = -", swap: ["6", "-"] }, { equation: "3 1 4 = *", swap: ["1", "*"] }, 
            { equation: "10 1 5 = +", swap: ["1", "+"] }, { equation: "8 1 2 = *", swap: ["1", "*"] }, 
            { equation: "6 9 3 = +", swap: ["9", "+"] }, { equation: "5 1 4 = -", swap: ["1", "-"] }, 
            { equation: "12 4 2 = +", swap: ["4", "+"] }, { equation: "9 2 3 = *", swap: ["2", "*"] }, 
            { equation: "14 / 2 = 7", swap: ["/", "7"] }, { equation: "2 7 5 = +", swap: ["7", "+"] }
        ] 
    },
    { 
        level: 50, description: "Evil Genius", hint: "One simple sign swap will solve it.", 
        variations: [ 
            { equation: "20 / 4 = 5", swap: ["/", "5"] }, { equation: "8 - 6 = 2", swap: ["-", "2"] }, 
            { equation: "15 / 3 = 5", swap: ["/", "5"] }, { equation: "6 + 10 = 4", swap: ["+", "4"] }, 
            { equation: "18 - 5 = 13", swap: ["-", "3"] }, { equation: "7 * 4 = 12", swap: ["*", "2"] }, 
            { equation: "16 / 4 = 4", swap: ["/", "4"] }, { equation: "5 + 10 = 5", swap: ["+", "5"] }, 
            { equation: "21 / 3 = 7", swap: ["/", "7"] }, { equation: "9 - 7 = 2", swap: ["-", "2"] }
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
    
    const variationIndex = (level + retryCount) % config.variations.length;
    const puzzleTemplate = config.variations[variationIndex];
    
    const { equation: scrambledEquation, swap } = puzzleTemplate;

    const correctEquation = templateToCorrectEquation(scrambledEquation, swap);
    
    const scrambledTiles = toTiles(scrambledEquation);
    const correctTiles = toTiles(correctEquation);

    const swappedIndices = findSwapIndices(scrambledEquation, swap);

    return {
        id: `${config.level}-${variationIndex}`,
        board: scrambledTiles,
        swappedIndices,
        correctSolution: correctTiles.map(t => t.value),
    };
}

export function getHint(puzzle: MathPuzzle, level: number): string {
    const config = getMathPuzzleConfig(level);
    return config.hint;
}

    