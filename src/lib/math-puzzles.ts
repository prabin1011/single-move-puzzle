
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


/**
 * Takes a correct equation string and a pair of values to swap,
 * and returns the scrambled equation string.
 * e.g., ("3 + 3 = 6", ["+", "6"]) -> "3 6 3 = +"
 */
const createScrambledEquation = (correctEquation: string, swapPair: [string, string]): string => {
    const [val1, val2] = swapPair;

    // Helper to escape special regex characters
    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    
    // Use a placeholder to avoid issues where val1/val2 are substrings of each other.
    const tempPlaceholder = '___TEMP___';
    let scrambled = correctEquation;

    // This regex ensures we only replace whole "words"
    const regex1 = new RegExp(`\\b${escapeRegExp(val1)}\\b`);
    const regex2 = new RegExp(`\\b${escapeRegExp(val2)}\\b`);

    if (regex1.test(scrambled) && regex2.test(scrambled)) {
        scrambled = scrambled.replace(regex1, tempPlaceholder);
        scrambled = scrambled.replace(regex2, val1);
        scrambled = scrambled.replace(tempPlaceholder, val2);
    } else {
        // This indicates a misconfigured puzzle template.
        console.error(`Swap pair [${val1}, ${val2}] is invalid for equation "${correctEquation}"`);
    }
    
    return scrambled;
};

const templateToCorrectEquation = (template: string, swap: [string, string]): string => {
    const [val1, val2] = swap;
    let correct = template;
    
    const tempPlaceholder = '___TEMP_CORRECT___';
    const regex1 = new RegExp(`\\b${val1}\\b`);
    const regex2 = new RegExp(`\\b${val2}\\b`);

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
const findSwapIndices = (equation: string, swap: [string, string]): [number, number] => {
    
    // Let's generate the correct and incorrect boards, and find the two differing tiles.
    const correctEq = templateToCorrectEquation(equation, swap);
    const correctTiles = toTiles(correctEq).map(t => t.value);
    const incorrectTiles = toTiles(equation).map(t => t.value);
    
    const diffIndices: number[] = [];
    for (let i = 0; i < incorrectTiles.length; i++) {
        if (i >= correctTiles.length || incorrectTiles[i] !== correctTiles[i]) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 2) {
        return [diffIndices[0], diffIndices[1]];
    }
    
    // This case should not be reached with well-formed puzzle templates.
    // It's a safeguard against crashes.
    console.error("Could not find exactly two differing indices. Check puzzle template.", {
        incorrect: incorrectTiles,
        correct: correctTiles,
        equation,
        swap,
    });
    // Return a default, non-crashing value.
    const incorrectBoard = toTiles(equation);
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
            { equation: "8 - 2 = 4 * 1", swap: ["-", "*"] }, { equation: "10 / 5 = 1 + 1", swap: ["/", "+"] },
            { equation: "3 * 3 = 10 - 1", swap: ["*", "-"] }, { equation: "4 + 5 = 3 * 3", swap: ["+", "*"] },
            { equation: "6 - 2 = 8 / 2", swap: ["-", "/"] }, { equation: "2 * 4 = 10 - 2", swap: ["*", "-"] },
            { equation: "12 / 6 = 1 + 1", swap: ["/", "+"] }, { equation: "5 + 3 = 2 * 4", swap: ["+", "*"] },
            { equation: "9 - 1 = 4 * 2", swap: ["-", "*"] }, { equation: "15 / 5 = 1 + 2", swap: ["/", "+"] }
        ]
    },
    {
        level: 3, description: "Digit Swaps", hint: "All the operators are correct, but two numbers need to trade places.",
        variations: [
            { equation: "1 + 8 = 9", swap: ["1", "9"] }, { equation: "9 - 1 = 8", swap: ["1", "8"] },
            { equation: "2 * 4 = 8", swap: ["4", "8"] }, { equation: "6 / 3 = 2", swap: ["3", "2"] },
            { equation: "3 + 4 = 7", swap: ["4", "7"] }, { equation: "7 - 3 = 4", swap: ["7", "4"] },
            { equation: "5 * 1 = 5", swap: ["1", "5"] }, { equation: "4 / 2 = 2", swap: ["4", "2"] },
            { equation: "2 + 6 = 8", swap: ["2", "8"] }, { equation: "8 - 5 = 3", swap: ["5", "3"] }
        ]
    },
    { 
        level: 4, description: "Basic Logic", hint: "A single swap will make it all add up.", 
        variations: [ 
            { equation: "2 + 7 = 9", swap: ["2", "9"] }, { equation: "8 - 3 = 5", swap: ["-", "5"] }, 
            { equation: "1 * 9 = 9", swap: ["*", "9"] }, { equation: "6 / 2 = 3", swap: ["6", "3"] }, 
            { equation: "4 + 4 = 8", swap: ["4", "8"] }, { equation: "9 - 4 = 5", swap: ["9", "5"] }, 
            { equation: "3 * 2 = 6", swap: ["3", "6"] }, { equation: "8 / 2 = 4", swap: ["8", "4"] }, 
            { equation: "5 + 3 = 8", swap: ["5", "8"] }, { equation: "7 - 2 = 5", swap: ["7", "5"] }
        ] 
    },
    { 
        level: 5, description: "Basic Logic", hint: "It's a puzzle of simple arithmetic.", 
        variations: [ 
            { equation: "1 + 6 = 7", swap: ["1", "7"] }, { equation: "9 - 2 = 7", swap: ["-", "7"] }, 
            { equation: "4 * 2 = 8", swap: ["*", "8"] }, { equation: "8 / 4 = 2", swap: ["/", "2"] }, 
            { equation: "3 + 6 = 9", swap: ["3", "9"] }, { equation: "6 - 1 = 5", swap: ["-", "5"] }, 
            { equation: "2 * 2 = 4", swap: ["2", "4"] }, { equation: "10 / 2 = 5", swap: ["10", "5"] }, 
            { equation: "4 + 3 = 7", swap: ["4", "7"] }, { equation: "8 - 1 = 7", swap: ["8", "7"] }
        ] 
    },
    { 
        level: 6, description: "Basic Logic", hint: "Look for the two symbols that are out of place.", 
        variations: [ 
            { equation: "2 + 5 = 7", swap: ["2", "7"] }, { equation: "9 - 5 = 4", swap: ["-", "4"] }, 
            { equation: "3 * 3 = 9", swap: ["*", "9"] }, { equation: "10 / 5 = 2", swap: ["10", "2"] }, 
            { equation: "1 + 5 = 6", swap: ["1", "6"] }, { equation: "8 - 6 = 2", swap: ["8", "2"] }, 
            { equation: "4 * 1 = 4", swap: ["*", "4"] }, { equation: "6 / 3 = 2", swap: ["6", "2"] }, 
            { equation: "5 + 1 = 6", swap: ["5", "6"] }, { equation: "9 - 7 = 2", swap: ["9", "2"] }
        ] 
    },
    { 
        level: 7, description: "Basic Logic", hint: "One swap will make the equation true.", 
        variations: [ 
            { equation: "3 + 5 = 8", swap: ["3", "8"] }, { equation: "7 - 4 = 3", swap: ["-", "3"] }, 
            { equation: "2 * 3 = 6", swap: ["*", "6"] }, { equation: "8 / 2 = 4", swap: ["/", "4"] }, 
            { equation: "4 + 2 = 6", swap: ["4", "6"] }, { equation: "9 - 6 = 3", swap: ["9", "3"] }, 
            { equation: "1 * 8 = 8", swap: ["*", "8"] }, { equation: "12 / 4 = 3", swap: ["12", "3"] }, 
            { equation: "2 + 4 = 6", swap: ["2", "6"] }, { equation: "7 - 5 = 2", swap: ["7", "2"] }
        ] 
    },
    { 
        level: 8, description: "Basic Logic", hint: "Find the two tiles that need to trade places.", 
        variations: [ 
            { equation: "6 + 3 = 9", swap: ["6", "9"] }, { equation: "8 - 2 = 6", swap: ["-", "6"] }, 
            { equation: "2 * 2 = 4", swap: ["*", "4"] }, { equation: "12 / 6 = 2", swap: ["12", "2"] }, 
            { equation: "5 + 3 = 8", swap: ["5", "8"] }, { equation: "7 - 1 = 6", swap: ["7", "6"] }, 
            { equation: "3 * 1 = 3", swap: ["*", "3"] }, { equation: "15 / 3 = 5", swap: ["15", "5"] }, 
            { equation: "4 + 1 = 5", swap: ["4", "5"] }, { equation: "10 - 2 = 8", swap: ["-", "8"] }
        ] 
    },
    { 
        level: 9, description: "Basic Logic", hint: "Focus on the numbers; one of them is in the wrong spot.", 
        variations: [ 
            { equation: "4 + 3 = 7", swap: ["4", "7"] }, { equation: "9 - 4 = 5", swap: ["-", "5"] }, 
            { equation: "2 * 4 = 8", swap: ["*", "8"] }, { equation: "14 / 2 = 7", swap: ["14", "7"] }, 
            { equation: "2 + 3 = 5", swap: ["2", "5"] }, { equation: "8 - 5 = 3", swap: ["8", "3"] }, 
            { equation: "5 * 2 = 10", swap: ["*", "10"] }, { equation: "16 / 4 = 4", swap: ["16", "4"] }, 
            { equation: "3 + 5 = 8", swap: ["3", "8"] }, { equation: "10 - 3 = 7", swap: ["-", "7"] }
        ] 
    },
    { 
        level: 10, description: "Basic Logic", hint: "The solution is just one swap away.", 
        variations: [ 
            { equation: "5 + 4 = 9", swap: ["5", "9"] }, { equation: "8 - 1 = 7", swap: ["-", "7"] }, 
            { equation: "3 * 2 = 6", swap: ["*", "6"] }, { equation: "18 / 3 = 6", swap: ["18", "6"] }, 
            { equation: "6 + 1 = 7", swap: ["6", "7"] }, { equation: "9 - 6 = 3", swap: ["9", "3"] }, 
            { equation: "4 * 2 = 8", swap: ["4", "8"] }, { equation: "20 / 5 = 4", swap: ["20", "4"] }, 
            { equation: "2 + 2 = 4", swap: ["2", "4"] }, { equation: "7 - 6 = 1", swap: ["-", "1"] }
        ] 
    },

    // 🔢 LEVELS 11-20: INTRODUCE MULTI-DIGIT RESULTS
    {
        level: 11, description: "Multi-Digit Results", hint: "The answer is a two-digit number. One of its digits has been swapped with a number in the problem.",
        variations: [
            { equation: "8 + 4 = 12", swap: ["4", "1"] }, { equation: "9 + 5 = 14", swap: ["5", "1"] },
            { equation: "7 + 6 = 13", swap: ["6", "1"] }, { equation: "6 * 3 = 18", swap: ["3", "1"] },
            { equation: "5 * 4 = 20", swap: ["4", "2"] }, { equation: "20 - 9 = 11", swap: ["9", "1"] },
            { equation: "25 - 5 = 20", swap: ["5", "0"] }, { equation: "30 - 9 = 21", swap: ["9", "1"] },
            { equation: "7 + 7 = 14", swap: ["7", "1"] }, { equation: "8 * 2 = 16", swap: ["2", "1"] }
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
            { equation: "10 + 5 = 15", swap: ["0", "5"] }, { equation: "20 - 8 = 12", swap: ["8", "2"] }, 
            { equation: "6 * 3 = 18", swap: ["6", "1"] }, { equation: "40 / 4 = 10", swap: ["4", "1"] }, 
            { equation: "9 + 3 = 12", swap: ["3", "1"] }, { equation: "25 - 10 = 15", swap: ["0", "5"] }, 
            { equation: "7 * 3 = 21", swap: ["7", "2"] }, { equation: "50 / 5 = 10", swap: ["5", "1"] }, 
            { equation: "8 + 8 = 16", swap: ["8", "1"] }, { equation: "30 - 11 = 19", swap: ["1", "9"] }
        ] 
    },
    { 
        level: 14, description: "Multi-Digit Swaps", hint: "It's not what the numbers say, it's where they are.", 
        variations: [ 
            { equation: "12 + 7 = 19", swap: ["2", "9"] }, { equation: "22 - 5 = 17", swap: ["2", "7"] }, 
            { equation: "3 * 5 = 15", swap: ["3", "1"] }, { equation: "28 / 2 = 14", swap: ["8", "4"] }, 
            { equation: "9 + 8 = 17", swap: ["9", "1"] }, { equation: "19 - 7 = 12", swap: ["9", "2"] }, 
            { equation: "6 * 4 = 24", swap: ["6", "2"] }, { equation: "39 / 3 = 13", swap: ["9", "3"] }, 
            { equation: "11 + 9 = 20", swap: ["1", "2"] }, { equation: "26 - 6 = 20", swap: ["6", "0"] }
        ] 
    },
    { 
        level: 15, description: "Multi-Digit Swaps", hint: "A single digit swap will make the equation balance.", 
        variations: [ 
            { equation: "14 + 5 = 19", swap: ["4", "9"] }, { equation: "28 - 9 = 19", swap: ["8", "9"] }, 
            { equation: "5 * 5 = 25", swap: ["5", "2"] }, { equation: "36 / 3 = 12", swap: ["6", "2"] }, 
            { equation: "13 + 6 = 19", swap: ["3", "9"] }, { equation: "21 - 8 = 13", swap: ["1", "3"] }, 
            { equation: "4 * 5 = 20", swap: ["4", "2"] }, { equation: "48 / 4 = 12", swap: ["8", "2"] }, 
            { equation: "12 + 9 = 21", swap: ["2", "1"] }, { equation: "32 - 8 = 24", swap: ["2", "4"] }
        ] 
    },
    { 
        level: 16, description: "Multi-Digit Swaps", hint: "Two digits are in the wrong positions.", 
        variations: [ 
            { equation: "17 + 8 = 25", swap: ["7", "2"] }, { equation: "30 - 8 = 22", swap: ["0", "2"] }, 
            { equation: "6 * 5 = 30", swap: ["6", "3"] }, { equation: "44 / 2 = 22", swap: ["4", "2"] }, 
            { equation: "15 + 9 = 24", swap: ["5", "2"] }, { equation: "28 - 6 = 22", swap: ["8", "2"] }, 
            { equation: "7 * 4 = 28", swap: ["7", "2"] }, { equation: "60 / 3 = 20", swap: ["6", "2"] }, 
            { equation: "19 + 5 = 24", swap: ["9", "2"] }, { equation: "35 - 10 = 25", swap: ["0", "5"] }
        ] 
    },
    { 
        level: 17, description: "Multi-Digit Swaps", hint: "The digits of the answer are correct, but swapped.", 
        variations: [ 
            { equation: "8 * 4 = 32", swap: ["2", "3"] }, { equation: "9 * 5 = 45", swap: ["4", "5"] }, 
            { equation: "7 * 6 = 42", swap: ["2", "4"] }, { equation: "9 * 6 = 54", swap: ["4", "5"] }, 
            { equation: "8 * 7 = 56", swap: ["6", "5"] }, { equation: "9 * 7 = 63", swap: ["3", "6"] }, 
            { equation: "8 * 8 = 64", swap: ["4", "6"] }, { equation: "9 * 8 = 72", swap: ["2", "7"] }, 
            { equation: "9 * 9 = 81", swap: ["1", "8"] }, { equation: "12 * 5 = 60", swap: ["0", "6"] }
        ] 
    },
    { 
        level: 18, description: "Multi-Digit Swaps", hint: "One number in the question and one in the answer need to swap.", 
        variations: [ 
            { equation: "25 + 25 = 50", swap: ["5", "0"] }, { equation: "50 - 25 = 25", swap: ["0", "5"] }, 
            { equation: "12 * 4 = 48", swap: ["2", "8"] }, { equation: "100 / 4 = 25", swap: ["0", "5"] }, 
            { equation: "30 + 20 = 50", swap: ["0", "5"] }, { equation: "40 - 15 = 25", swap: ["0", "5"] }, 
            { equation: "15 * 3 = 45", swap: ["5", "4"] }, { equation: "75 / 3 = 25", swap: ["7", "2"] }, 
            { equation: "35 + 15 = 50", swap: ["5", "0"] }, { equation: "60 - 15 = 45", swap: ["0", "5"] }
        ] 
    },
    { 
        level: 19, description: "Operator & Digit Swaps", hint: "The numbers are right, but the operators are wrong.", 
        variations: [ 
            { equation: "5 * 5 - 5 = 20", swap: ["-", "0"] }, { equation: "6 * 6 - 6 = 30", swap: ["-", "0"] }, 
            { equation: "4 * 4 - 4 = 12", swap: ["-", "2"] }, { equation: "10 * 2 - 5 = 15", swap: ["-", "5"] }, 
            { equation: "8 * 3 - 4 = 20", swap: ["-", "0"] }, { equation: "9 * 2 - 8 = 10", swap: ["-", "0"] }, 
            { equation: "7 * 3 - 1 = 20", swap: ["-", "0"] }, { equation: "3 * 5 - 5 = 10", swap: ["-", "0"] }, 
            { equation: "12 * 2 - 4 = 20", swap: ["-", "0"] }, { equation: "10 * 3 - 10 = 20", swap: ["-", "0"] }
        ] 
    },
    { 
        level: 20, description: "Multi-Digit Swaps", hint: "Find the two digits that are out of place.", 
        variations: [ 
            { equation: "12 + 13 = 25", swap: ["3", "5"] }, { equation: "25 - 11 = 14", swap: ["1", "4"] }, 
            { equation: "14 * 2 = 28", swap: ["4", "8"] }, { equation: "33 / 3 = 11", swap: ["3", "1"] }, 
            { equation: "15 + 12 = 27", swap: ["2", "7"] }, { equation: "30 - 12 = 18", swap: ["2", "8"] }, 
            { equation: "11 * 5 = 55", swap: ["1", "5"] }, { equation: "42 / 2 = 21", swap: ["2", "1"] }, 
            { equation: "16 + 11 = 27", swap: ["1", "7"] }, { equation: "29 - 10 = 19", swap: ["0", "9"] }
        ] 
    },
    
    // 🧮 LEVELS 21-30: ORDER OF OPERATIONS
    { 
        level: 21, description: "Order of Operations", hint: "Which operation should happen first? Swap an operator and a number.", 
        variations: [ 
            { equation: "2 + 3 * 4 = 14", swap: ["+", "4"] }, { equation: "5 + 2 * 3 = 11", swap: ["+", "1"] }, 
            { equation: "10 - 2 * 4 = 2", swap: ["-", "2"] }, { equation: "15 - 3 * 3 = 6", swap: ["-", "6"] }, 
            { equation: "3 * 4 + 2 = 14", swap: ["*", "4"] }, { equation: "4 * 3 + 5 = 17", swap: ["*", "7"] }, 
            { equation: "20 / 2 - 5 = 5", swap: ["-", "5"] }, { equation: "18 / 3 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "5 + 5 * 2 = 15", swap: ["+", "5"] }, { equation: "8 - 2 * 3 = 2", swap: ["-", "2"] }
        ] 
    },
    { 
        level: 22, description: "Order of Operations", hint: "Remember: Multiplication before Addition. One digit is out of place.", 
        variations: [ 
            { equation: "3 + 5 * 3 = 18", swap: ["5", "8"] }, { equation: "2 * 6 + 4 = 16", swap: ["6", "1"] }, 
            { equation: "10 * 2 - 3 = 17", swap: ["-", "7"] }, { equation: "8 + 6 / 2 = 11", swap: ["6", "1"] }, 
            { equation: "12 - 2 * 5 = 2", swap: ["-", "2"] }, { equation: "7 + 2 * 5 = 17", swap: ["2", "7"] }, 
            { equation: "20 / 4 - 1 = 4", swap: ["-", "4"] }, { equation: "9 * 2 - 5 = 13", swap: ["-", "3"] }, 
            { equation: "15 + 10 / 5 = 17", swap: ["0", "7"] }, { equation: "3 + 4 * 5 = 23", swap: ["4", "3"] }
        ] 
    },
    { 
        level: 23, description: "Order of Operations", hint: "A digit or an operator might be in the wrong place.", 
        variations: [ 
            { equation: "5 + 2 * 5 = 15", swap: ["2", "1"] }, { equation: "10 / 2 + 3 = 8", swap: ["/", "8"] }, 
            { equation: "12 + 8 / 4 = 14", swap: ["8", "4"] }, { equation: "20 - 5 * 2 = 10", swap: ["-", "0"] }, 
            { equation: "9 * 3 - 3 = 24", swap: ["-", "4"] }, { equation: "18 - 6 / 3 = 16", swap: ["-", "6"] }, 
            { equation: "7 + 4 * 2 = 15", swap: ["4", "5"] }, { equation: "16 / 2 - 4 = 4", swap: ["/", "4"] }, 
            { equation: "1 + 9 * 2 = 19", swap: ["1", "9"] }, { equation: "25 - 5 * 4 = 5", swap: ["-", "5"] }
        ] 
    },
    { 
        level: 24, description: "Order of Operations", hint: "Think about the sequence of calculations.", 
        variations: [ 
            { equation: "10 - 3 * 2 = 4", swap: ["-", "4"] }, { equation: "15 / 3 + 2 = 7", swap: ["/", "7"] }, 
            { equation: "5 * 4 + 1 = 21", swap: ["4", "1"] }, { equation: "18 / 6 - 1 = 2", swap: ["-", "2"] }, 
            { equation: "8 + 2 * 3 = 14", swap: ["8", "4"] }, { equation: "24 / 4 - 2 = 4", swap: ["-", "4"] }, 
            { equation: "7 + 3 * 4 = 19", swap: ["7", "9"] }, { equation: "21 / 7 - 2 = 1", swap: ["-", "1"] }, 
            { equation: "6 + 5 * 2 = 16", swap: ["5", "6"] }, { equation: "30 / 5 + 1 = 7", swap: ["/", "7"] }
        ] 
    },
    { 
        level: 25, description: "Order of Operations", hint: "It's a puzzle of priority.", 
        variations: [ 
            { equation: "40 / 10 - 2 = 2", swap: ["-", "2"] }, { equation: "36 / 6 - 3 = 3", swap: ["-", "3"] }, 
            { equation: "100 / 10 - 9 = 1", swap: ["-", "1"] }, { equation: "50 / 10 + 5 = 10", swap: ["+", "0"] }, 
            { equation: "1 + 2 * 3 = 7", swap: ["+", "7"] }, { equation: "9 - 6 / 3 = 7", swap: ["-", "7"] }, 
            { equation: "4 * 8 + 2 = 34", swap: ["*", "4"] }, { equation: "16 / 4 - 2 = 2", swap: ["-", "2"] }, 
            { equation: "10 * 10 - 1 = 99", swap: ["-", "9"] }, { equation: "25 + 10 / 5 = 27", swap: ["0", "7"] }
        ] 
    },
    { 
        level: 26, description: "Order of Operations", hint: "Find the single incorrect symbol, digit or operator.", 
        variations: [ 
            { equation: "4 * 4 + 2 = 18", swap: ["4", "8"] }, { equation: "6 + 2 * 9 = 24", swap: ["2", "4"] }, 
            { equation: "30 / 3 - 5 = 5", swap: ["-", "5"] }, { equation: "5 * 7 - 9 = 26", swap: ["9", "6"] }, 
            { equation: "6 * 7 + 7 = 49", swap: ["+", "9"] }, { equation: "12 + 10 / 5 = 14", swap: ["0", "4"] }, 
            { equation: "45 / 9 - 5 = 0", swap: ["-", "0"] }, { equation: "8 * 4 + 12 = 44", swap: ["2", "4"] }, 
            { equation: "9 * 11 - 10 = 89", swap: ["-", "9"] }, { equation: "100 / 10 + 5 = 15", swap: ["+", "5"] }
        ] 
    },
    { 
        level: 27, description: "Order of Operations", hint: "Think outside the box. Digits can move anywhere.", 
        variations: [ 
            { equation: "5 * 6 + 2 = 32", swap: ["6", "3"] }, { equation: "9 * 4 - 6 = 30", swap: ["-", "0"] }, 
            { equation: "40 / 8 + 2 = 7", swap: ["8", "7"] }, { equation: "2 + 7 * 5 = 37", swap: ["5", "7"] }, 
            { equation: "18 + 24 / 4 = 24", swap: ["8", "4"] }, { equation: "10 * 10 - 9 = 91", swap: ["0", "1"] }, 
            { equation: "81 / 9 + 8 = 17", swap: ["8", "7"] }, { equation: "3 * 15 - 5 = 40", swap: ["-", "0"] }, 
            { equation: "60 / 6 + 4 = 14", swap: ["6", "4"] }, { equation: "22 + 2 * 8 = 38", swap: ["2", "3"] }
        ] 
    },
    { 
        level: 28, description: "Order of Operations", hint: "It might be an operator swap, or it might be a digit.", 
        variations: [ 
            { equation: "12 * 4 + 8 = 56", swap: ["*", "6"] }, { equation: "50 / 10 - 4 = 1", swap: ["-", "1"] }, 
            { equation: "7 + 3 * 9 = 34", swap: ["+", "4"] }, { equation: "100 / 5 - 5 = 15", swap: ["/", "5"] }, 
            { equation: "9 + 5 * 5 = 34", swap: ["+", "4"] }, { equation: "64 / 8 - 8 = 0", swap: ["-", "0"] }, 
            { equation: "13 + 9 * 3 = 40", swap: ["9", "4"] }, { equation: "49 / 7 - 7 = 0", swap: ["-", "0"] }, 
            { equation: "11 * 8 + 2 = 90", swap: ["*", "0"] }, { equation: "33 / 3 - 11 = 0", swap: ["-", "0"] }
        ] 
    },
    { 
        level: 29, description: "Order of Operations", hint: "The answer seems impossible until you find the swap.", 
        variations: [ 
            { equation: "9 * 9 - 9 = 72", swap: ["-", "2"] }, { equation: "8 * 8 - 8 = 56", swap: ["-", "6"] }, 
            { equation: "7 * 7 - 7 = 42", swap: ["-", "2"] }, { equation: "6 * 6 - 6 = 30", swap: ["-", "0"] }, 
            { equation: "5 * 5 - 5 = 20", swap: ["-", "0"] }, { equation: "12 * 12 - 12 = 132", swap: ["-", "2"] }, 
            { equation: "11 * 11 - 11 = 110", swap: ["-", "0"] }, { equation: "10 * 10 - 10 = 90", swap: ["-", "0"] }, 
            { equation: "13 * 13 - 13 = 156", swap: ["-", "6"] }, { equation: "14 * 14 - 12 = 184", swap: ["-", "4"] }
        ] 
    },
    { 
        level: 30, description: "Order of Operations", hint: "One swap makes it all add up. Or multiply.", 
        variations: [ 
            { equation: "4 + 4 * 4 = 20", swap: ["4", "0"] }, { equation: "6 + 3 * 5 = 21", swap: ["3", "1"] }, 
            { equation: "45 / 5 + 4 = 13", swap: ["4", "3"] }, { equation: "100 - 9 * 9 = 19", swap: ["0", "1"] }, 
            { equation: "1 + 9 * 3 = 28", swap: ["9", "8"] }, { equation: "8 * 5 - 10 = 30", swap: ["1", "3"] }, 
            { equation: "72 / 8 + 4 = 13", swap: ["4", "3"] }, { equation: "60 - 5 * 7 = 25", swap: ["0", "2"] }, 
            { equation: "2 + 4 * 8 = 34", swap: ["4", "3"] }, { equation: "99 / 9 - 1 = 10", swap: ["1", "0"] }
        ] 
    },
    
    // 🧩 LEVELS 31-40: FILL-IN-THE-BLANK (PRE-ALGEBRA)
    { 
        level: 31, description: "Fill in the Blank", hint: "What number is missing? Swap it with the blank space.", 
        variations: [ 
            { equation: "4 + _ = 10", swap: ["_", "6"] }, { equation: "_ + 7 = 12", swap: ["_", "5"] }, 
            { equation: "5 + _ = 9", swap: ["_", "4"] }, { equation: "_ + 8 = 13", swap: ["_", "5"] }, 
            { equation: "6 + _ = 11", swap: ["_", "5"] }, { equation: "_ + 9 = 14", swap: ["_", "5"] }, 
            { equation: "3 + _ = 7", swap: ["_", "4"] }, { equation: "_ + 2 = 6", swap: ["_", "4"] }, 
            { equation: "_ + 1 = 4", swap: ["_", "3"] }, { equation: "5 + _ = 15", swap: ["_", "10"] }
        ] 
    },
    { 
        level: 32, description: "Fill in the Blank", hint: "Find the missing piece of the puzzle.", 
        variations: [ 
            { equation: "15 - _ = 8", swap: ["_", "7"] }, { equation: "20 - _ = 11", swap: ["_", "9"] }, 
            { equation: "12 - _ = 5", swap: ["_", "7"] }, { equation: "18 - _ = 9", swap: ["_", "9"] }, 
            { equation: "25 - _ = 15", swap: ["_", "10"] }, { equation: "14 - _ = 6", swap: ["_", "8"] }, 
            { equation: "17 - _ = 9", swap: ["_", "8"] }, { equation: "22 - _ = 13", swap: ["_", "9"] }, 
            { equation: "30 - _ = 21", swap: ["_", "9"] }, { equation: "19 - _ = 12", swap: ["_", "7"] }
        ] 
    },
    { 
        level: 33, description: "Fill in the Blank", hint: "What times 3 equals 21?", 
        variations: [ 
            { equation: "7 * _ = 21", swap: ["_", "3"] }, { equation: "_ * 5 = 25", swap: ["_", "5"] }, 
            { equation: "9 * _ = 36", swap: ["_", "4"] }, { equation: "_ * 6 = 42", swap: ["_", "7"] }, 
            { equation: "8 * _ = 64", swap: ["_", "8"] }, { equation: "_ * 2 = 18", swap: ["_", "9"] }, 
            { equation: "9 * _ = 81", swap: ["_", "9"] }, { equation: "_ * 7 = 49", swap: ["_", "7"] }, 
            { equation: "10 * _ = 100", swap: ["_", "10"] }, { equation: "11 * _ = 121", swap: ["_", "11"] }
        ] 
    },
    { 
        level: 34, description: "Fill in the Blank", hint: "A number is missing from the equation.", 
        variations: [ 
            { equation: "45 / _ = 9", swap: ["_", "5"] }, { equation: "63 / _ = 7", swap: ["_", "9"] }, 
            { equation: "48 / _ = 8", swap: ["_", "6"] }, { equation: "56 / _ = 7", swap: ["_", "8"] }, 
            { equation: "72 / _ = 9", swap: ["_", "8"] }, { equation: "81 / _ = 9", swap: ["_", "9"] }, 
            { equation: "49 / _ = 7", swap: ["_", "7"] }, { equation: "100 / _ = 10", swap: ["_", "10"] }, 
            { equation: "144 / _ = 12", swap: ["_", "12"] }, { equation: "110 / _ = 11", swap: ["_", "10"] }
        ] 
    },
    { 
        level: 35, description: "Fill in the Blank", hint: "Swap the correct number into the blank space.", 
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
        level: 37, description: "Blank + Multi-digit", hint: "What single digit completes the equation?", 
        variations: [ 
            { equation: "3 * _ = 36", swap: ["_", "12"] }, { equation: "100 - _ = 85", swap: ["_", "15"] }, 
            { equation: "25 + _ = 41", swap: ["_", "16"] }, { equation: "144 / _ = 12", swap: ["_", "12"] }, 
            { equation: "12 * _ = 108", swap: ["_", "9"] }, { equation: "75 - _ = 50", swap: ["_", "25"] }, 
            { equation: "50 + _ = 77", swap: ["_", "27"] }, { equation: "132 / _ = 11", swap: ["_", "12"] }, 
            { equation: "8 * _ = 96", swap: ["_", "12"] }, { equation: "200 - _ = 175", swap: ["_", "25"] }
        ] 
    },
    { 
        level: 38, description: "Blank + Multi-digit", hint: "Find the missing number to balance the equation.", 
        variations: [ 
            { equation: "13 * _ = 39", swap: ["_", "3"] }, { equation: "55 - _ = 20", swap: ["_", "35"] }, 
            { equation: "42 + _ = 60", swap: ["_", "18"] }, { equation: "125 / _ = 25", swap: ["_", "5"] }, 
            { equation: "15 * _ = 75", swap: ["_", "5"] }, { equation: "75 - _ = 30", swap: ["_", "45"] }, 
            { equation: "60 + _ = 99", swap: ["_", "39"] }, { equation: "250 / _ = 25", swap: ["_", "10"] }, 
            { equation: "11 * _ = 132", swap: ["_", "12"] }, { equation: "150 - _ = 50", swap: ["_", "100"] }
        ] 
    },
    { 
        level: 39, description: "Blank + Multi-digit", hint: "A single swap will solve it.", 
        variations: [ 
            { equation: "14 * _ = 56", swap: ["_", "4"] }, { equation: "80 - _ = 65", swap: ["_", "15"] }, 
            { equation: "20 + _ = 55", swap: ["_", "35"] }, { equation: "90 / _ = 6", swap: ["_", "15"] }, 
            { equation: "16 * _ = 64", swap: ["_", "4"] }, { equation: "120 - _ = 95", swap: ["_", "25"] }, 
            { equation: "45 + _ = 70", swap: ["_", "25"] }, { equation: "105 / _ = 7", swap: ["_", "15"] }, 
            { equation: "18 * _ = 72", swap: ["_", "4"] }, { equation: "150 - _ = 125", swap: ["_", "25"] }
        ] 
    },
    { 
        level: 40, description: "Blank + Multi-digit", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "19 * _ = 95", swap: ["_", "5"] }, { equation: "100 - _ = 15", swap: ["_", "85"] }, 
            { equation: "70 + _ = 110", swap: ["_", "40"] }, { equation: "180 / _ = 9", swap: ["_", "20"] }, 
            { equation: "22 * _ = 88", swap: ["_", "4"] }, { equation: "150 - _ = 25", swap: ["_", "125"] }, 
            { equation: "90 + _ = 130", swap: ["_", "40"] }, { equation: "200 / _ = 8", swap: ["_", "25"] }, 
            { equation: "24 * _ = 120", swap: ["_", "5"] }, { equation: "200 - _ = 75", swap: ["_", "125"] }
        ] 
    },
    
    // 🔥 LEVELS 41-50: EVIL GENIUS LEVELS (MIXED LOGIC)
    { 
        level: 41, description: "Mixed Logic", hint: "Solve backwards. Find the missing number.", 
        variations: [ 
            { equation: "_ * 4 + 2 = 18", swap: ["_", "4"] }, { equation: "_ * 3 + 1 = 13", swap: ["_", "4"] }, 
            { equation: "_ * 5 - 5 = 20", swap: ["_", "5"] }, { equation: "_ * 6 / 2 = 9", swap: ["_", "3"] }, 
            { equation: "_ * 2 + 4 = 14", swap: ["_", "5"] }, { equation: "_ * 7 - 7 = 21", swap: ["_", "4"] }, 
            { equation: "_ * 3 + 6 = 15", swap: ["_", "3"] }, { equation: "_ * 8 / 4 = 6", swap: ["_", "3"] }, 
            { equation: "_ * 9 - 9 = 27", swap: ["_", "4"] }, { equation: "_ * 10 / 5 = 8", swap: ["_", "4"] }
        ] 
    },
    { 
        level: 42, description: "Mixed Logic", hint: "What needs to happen first?", 
        variations: [ 
            { equation: "10 + _ * 2 = 24", swap: ["_", "7"] }, { equation: "20 - _ * 3 = 8", swap: ["_", "4"] }, 
            { equation: "5 * _ + 5 = 30", swap: ["_", "5"] }, { equation: "30 / _ + 2 = 7", swap: ["_", "6"] }, 
            { equation: "8 + _ * 4 = 20", swap: ["_", "3"] }, { equation: "40 - _ * 5 = 15", swap: ["_", "5"] }, 
            { equation: "6 * _ + 8 = 32", swap: ["_", "4"] }, { equation: "50 / _ - 3 = 7", swap: ["_", "5"] }, 
            { equation: "12 + _ * 3 = 30", swap: ["_", "6"] }, { equation: "100 - _ * 10 = 0", swap: ["_", "10"] }
        ] 
    },
    { 
        level: 43, description: "Mixed Logic", hint: "Two steps. One swap.", 
        variations: [ 
            { equation: "3 * 4 + _ = 18", swap: ["_", "6"] }, { equation: "5 * 6 - _ = 20", swap: ["_", "10"] }, 
            { equation: "20 / 4 + _ = 9", swap: ["_", "4"] }, { equation: "18 / _ - 2 = 1", swap: ["_", "6"] }, 
            { equation: "2 * 8 + _ = 22", swap: ["_", "6"] }, { equation: "7 * 3 - _ = 15", swap: ["_", "6"] }, 
            { equation: "36 / _ + 6 = 15", swap: ["_", "4"] }, { equation: "40 / 8 - _ = 2", swap: ["_", "3"] }, 
            { equation: "5 * 7 + _ = 40", swap: ["_", "5"] }, { equation: "60 / _ - 6 = 0", swap: ["_", "10"] }
        ] 
    },
    { 
        level: 44, description: "Mixed Logic", hint: "Find the single incorrect symbol.", 
        variations: [ 
            { equation: "4 + 5 * _ = 19", swap: ["_", "3"] }, { equation: "25 - 2 * _ = 15", swap: ["_", "5"] }, 
            { equation: "8 * 2 + _ = 20", swap: ["_", "4"] }, { equation: "42 / 7 - _ = 3", swap: ["_", "3"] }, 
            { equation: "9 + 3 * _ = 18", swap: ["_", "3"] }, { equation: "32 - 4 * _ = 16", swap: ["_", "4"] }, 
            { equation: "6 * 5 + _ = 33", swap: ["_", "3"] }, { equation: "54 / 9 - _ = 2", swap: ["_", "4"] }, 
            { equation: "11 + 6 * _ = 29", swap: ["_", "3"] }, { equation: "70 - 7 * _ = 21", swap: ["_", "7"] }
        ] 
    },
    { 
        level: 45, description: "Mixed Logic", hint: "It looks impossible, but one swap makes it work.", 
        variations: [ 
            { equation: "6 + _ * 3 = 21", swap: ["_", "5"] }, { equation: "4 * _ - 7 = 21", swap: ["_", "7"] }, 
            { equation: "50 / _ + 5 = 10", swap: ["_", "10"] }, { equation: "100 - 10 * _ = 10", swap: ["_", "9"] }, 
            { equation: "1 + _ * 3 = 28", swap: ["_", "9"] }, { equation: "8 * _ - 10 = 30", swap: ["_", "5"] }, 
            { equation: "72 / _ + 4 = 12", swap: ["_", "9"] }, { equation: "60 - 5 * _ = 25", swap: ["_", "7"] }, 
            { equation: "2 + _ * 8 = 34", swap: ["_", "4"] }, { equation: "99 / _ - 1 = 10", swap: ["_", "9"] }
        ] 
    },
    { 
        level: 46, description: "Evil Genius", hint: "The digits are there, just scrambled.", 
        variations: [ 
            { equation: "24 * 4 = 96", swap: ["4", "9"] }, { equation: "72 / 3 = 24", swap: ["2", "7"] }, 
            { equation: "31 + 41 = 72", swap: ["1", "2"] }, { equation: "98 - 19 = 79", swap: ["8", "9"] }, 
            { equation: "18 * 5 = 90", swap: ["8", "0"] }, { equation: "156 / 6 = 26", swap: ["5", "6"] }, 
            { equation: "68 + 23 = 91", swap: ["8", "1"] }, { equation: "83 - 18 = 65", swap: ["3", "5"] }, 
            { equation: "22 * 4 = 88", swap: ["2", "8"] }, { equation: "49 / 7 = 7", swap: ["9", "7"] }
        ] 
    },
    { 
        level: 47, description: "Evil Genius", hint: "Two numbers are switched. Can you spot them?", 
        variations: [ 
            { equation: "10 + 8 = 18", swap: ["0", "8"] }, { equation: "19 - 10 = 9", swap: ["0", "9"] }, 
            { equation: "7 * 7 = 49", swap: ["7", "9"] }, { equation: "36 / 4 = 9", swap: ["6", "9"] }, 
            { equation: "22 + 9 = 31", swap: ["2", "1"] }, { equation: "50 - 25 = 25", swap: ["0", "5"] }, 
            { equation: "15 * 8 = 120", swap: ["5", "2"] }, { equation: "81 / 9 = 9", swap: ["1", "9"] }, 
            { equation: "46 + 53 = 99", swap: ["6", "9"] }, { equation: "110 - 11 = 99", swap: ["0", "9"] }
        ] 
    },
    { 
        level: 48, description: "Evil Genius", hint: "The equation looks complex, but the fix is a simple digit swap.", 
        variations: [ 
            { equation: "13 * 8 = 104", swap: ["3", "0"] }, { equation: "15 * 15 = 225", swap: ["1", "2"] }, 
            { equation: "16 * 14 = 224", swap: ["6", "2"] }, { equation: "12 * 16 = 192", swap: ["6", "9"] }, 
            { equation: "25 * 5 = 125", swap: ["5", "1"] }, { equation: "11 * 19 = 209", swap: ["1", "0"] }, 
            { equation: "20 * 11 = 220", swap: ["1", "2"] }, { equation: "23 * 11 = 253", swap: ["3", "5"] }, 
            { equation: "14 * 18 = 252", swap: ["8", "5"] }, { equation: "28 * 8 = 224", swap: ["8", "2"] }
        ] 
    },
    { 
        level: 49, description: "Evil Genius", hint: "Focus on the relationship between the numbers.", 
        variations: [ 
            { equation: "7 - 1 = 6", swap: ["-", "6"] }, { equation: "3 * 4 = 12", swap: ["*", "1"] }, 
            { equation: "10 + 5 = 15", swap: ["+", "1"] }, { equation: "8 * 2 = 16", swap: ["*", "1"] }, 
            { equation: "6 + 3 = 9", swap: ["+", "9"] }, { equation: "5 - 4 = 1", swap: ["-", "1"] }, 
            { equation: "12 + 2 = 14", swap: ["+", "4"] }, { equation: "9 * 3 = 27", swap: ["*", "2"] }, 
            { equation: "14 / 7 = 2", swap: ["/", "2"] }, { equation: "2 + 5 = 7", swap: ["+", "7"] }
        ] 
    },
    { 
        level: 50, description: "Evil Genius", hint: "One simple sign swap will solve it.", 
        variations: [ 
            { equation: "20 / 5 = 4", swap: ["/", "4"] }, { equation: "8 - 2 = 6", swap: ["-", "6"] }, 
            { equation: "15 / 5 = 3", swap: ["/", "3"] }, { equation: "6 + 4 = 10", swap: ["+", "10"] }, 
            { equation: "18 - 3 = 15", swap: ["-", "5"] }, { equation: "7 * 2 = 14", swap: ["*", "4"] }, 
            { equation: "16 / 4 = 4", swap: ["/", "4"] }, { equation: "5 + 5 = 10", swap: ["+", "10"] }, 
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
    
    // Use modulo to safely cycle through variations
    const variationIndex = (level + retryCount) % config.variations.length;
    const puzzleTemplate = config.variations[variationIndex];
    
    const { equation, swap } = puzzleTemplate;

    const scrambledEquation = createScrambledEquation(equation, swap);

    const correctTiles = toTiles(templateToCorrectEquation(equation, swap));
    const scrambledTiles = toTiles(scrambledEquation);

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
