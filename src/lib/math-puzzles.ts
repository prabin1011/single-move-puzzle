
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
  equation: string;        // correct equation
  swap: [string, string];  // tokens to swap to create the puzzle
}

export interface MathLevel {
  level: number;
  description: string;
  hint: string;
  variations: PuzzleVariation[];
}

/**
 * Tokenise an equation string into tile values.
 * Every token must be separated by spaces: "10 + 5 = 15".
 * Multi-digit numbers stay as a single tile.
 */
const toValues = (equation: string): TileValue[] => {
  const parts = equation.split(' ').filter(p => p.trim() !== '');
  return parts.map(part => {
    // integer (possibly multi-digit, possibly negative)
    if (/^-?\d+$/.test(part)) {
      return Number(part);
    }
    return part;
  });
};

/**
 * Convert values into tiles. Only '=' is locked.
 */
const toTiles = (values: TileValue[]): Tile[] => {
  return values.map(value => ({
    value,
    isLocked: value === '=', // everything else (numbers & operators) is swappable
  }));
};

/**
 * Find the indices where scrambled and correct boards differ.
 * Must be exactly 2 for a valid puzzle.
 */
const findSwapIndices = (
  scrambledValues: TileValue[],
  correctValues: TileValue[]
): [number, number] => {
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

  console.error('CRITICAL: math puzzle does not differ in exactly two positions.', {
    scrambledValues,
    correctValues,
    diffIndices,
  });

  // Safe fallback—will still be solvable but not ideal.
  return [0, 1];
};

/**
 * Swap the first occurrence of val1 and val2 *as tokens* in the equation string.
 * Equation must be space-separated.
 */
const createScrambledEquation = (
  correctEquation: string,
  swapPair: [string, string]
): string => {
  const [val1, val2] = swapPair;
  const parts = correctEquation.split(' ');

  const index1 = parts.indexOf(val1);
  const index2 = parts.indexOf(val2);

  if (index1 === -1 || index2 === -1) {
    console.error(
      `Swap pair [${val1}, ${val2}] not found in equation "${correctEquation}".`
    );
    return correctEquation;
  }

  [parts[index1], parts[index2]] = [parts[index2], parts[index1]];
  return parts.join(' ');
};

// -----------------------------------------------------------------------------
// PUZZLE VARIATION GENERATORS
// -----------------------------------------------------------------------------

/**
 * Levels 1–10 – Basic one-step equations (add/sub) with single-digit numbers.
 */
const makeAddSubVariations = (seed: number): PuzzleVariation[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const a = 2 + ((seed + i) % 8);          // 2..9
    const b = 1 + ((seed * 2 + i) % 8);      // 1..8

    if (i % 2 === 0) {
      // a + b = result, swap a <-> result
      const result = a + b;
      return {
        equation: `${a} + ${b} = ${result}`,
        swap: [`${a}`, `${result}`],
      };
    } else {
      // (a + b) - b = a, swap (a+b) <-> a
      const sum = a + b;
      return {
        equation: `${sum} - ${b} = ${a}`,
        swap: [`${sum}`, `${a}`],
      };
    }
  });
};

/**
 * Levels 11–20 – Two-digit practice (add & sub).
 */
const makeMultiDigitVariations = (seed: number): PuzzleVariation[] => {
  return Array.from({ length: 10 }, (_, i) => {
    let a = 10 + ((seed * 3 + i * 2) % 40);  // ~10..49
    let b = 5 + ((seed + i) % 15);          // ~5..19

    if (i % 2 === 0) {
      // a + b = result, swap b <-> result
      const result = a + b;
      return {
        equation: `${a} + ${b} = ${result}`,
        swap: [`${b}`, `${result}`],
      };
    } else {
      // a - b = result, ensure non-negative
      if (a - b < 0) {
        // simple fix: use (a + b) - a = b
        const sum = a + b;
        return {
          equation: `${sum} - ${a} = ${b}`,
          swap: [`${sum}`, `${b}`],
        };
      }
      const result = a - b;
      return {
        equation: `${a} - ${b} = ${result}`,
        swap: [`${a}`, `${result}`],
      };
    }
  });
};

/**
 * Levels 21–30 – Multiplication focus.
 */
const makeMultiplicationVariations = (seed: number): PuzzleVariation[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const a = 2 + ((seed + i) % 8);         // 2..9
    const b = 2 + ((seed * 2 + i) % 8);     // 2..9
    const product = a * b;

    // swap left operand with result
    return {
      equation: `${a} * ${b} = ${product}`,
      swap: [`${a}`, `${product}`],
    };
  });
};

/**
 * Levels 31–40 – Division and inverse relationships.
 */
const makeDivisionVariations = (seed: number): PuzzleVariation[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const a = 2 + ((seed + i) % 9);         // 2..10
    const b = 2 + ((seed * 3 + i) % 8);     // 2..9
    const dividend = a * b;

    // dividend / b = a, swap dividend <-> a
    return {
      equation: `${dividend} / ${b} = ${a}`,
      swap: [`${dividend}`, `${a}`],
    };
  });
};

/**
 * Levels 41–50 – Mixed operations & order-of-operations with operator swaps.
 * Equation form: a + b * c = a + b*c; we swap the first operand and the '+'.
 * This forces at least one operator tile to be part of the swap.
 */
const makeMixedVariations = (seed: number): PuzzleVariation[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const a = 5 + ((seed + i) % 10);        // 5..14
    const b = 2 + ((seed * 2 + i) % 8);     // 2..9
    const c = 2 + ((seed * 3 + i) % 8);     // 2..9
    const result = a + b * c;

    return {
      equation: `${a} + ${b} * ${c} = ${result}`,
      // swap the first operand with '+', so one of the tiles is an operator
      swap: ['+', `${a}`],
    };
  });
};

// -----------------------------------------------------------------------------
// BUILD 50 LEVELS × 10 VARIATIONS
// -----------------------------------------------------------------------------

const buildMathLevels = (): MathLevel[] => {
  const levels: MathLevel[] = [];

  // Levels 1–10: Basic add/sub
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: i + 1,
      description: 'Basic Addition & Subtraction',
      hint: 'Check whether the answer matches the operation. Two tiles have swapped places.',
      variations: makeAddSubVariations(i),
    });
  }

  // Levels 11–20: Two-digit practice
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 11 + i,
      description: 'Two-Digit Numbers',
      hint: 'Most answers are two-digit numbers now. Look carefully for a swapped pair.',
      variations: makeMultiDigitVariations(i),
    });
  }

  // Levels 21–30: Multiplication
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 21 + i,
      description: 'Multiplication Practice',
      hint: 'Think of multiplication tables. The product tile might be in the wrong place.',
      variations: makeMultiplicationVariations(i),
    });
  }

  // Levels 31–40: Division & inverses
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 31 + i,
      description: 'Division & Inverses',
      hint: '“Product ÷ factor = other factor.” One of those tiles has swapped.',
      variations: makeDivisionVariations(i),
    });
  }

  // Levels 41–50: Mixed & order of operations
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 41 + i,
      description: 'Order of Operations',
      hint: 'Remember: multiplication happens before addition. Sometimes even an operator is out of place!',
      variations: makeMixedVariations(i),
    });
  }

  return levels;
};

export const mathLevels: MathLevel[] = buildMathLevels();

// -----------------------------------------------------------------------------
// PUBLIC API
// -----------------------------------------------------------------------------

export function getMathPuzzleConfig(levelIndex: number): MathLevel {
  // levelIndex is zero-based in the game code
  const clamped = Math.max(0, Math.min(levelIndex, mathLevels.length - 1));
  return mathLevels[clamped];
}

export function generatePuzzle(levelIndex: number, retryCount: number): MathPuzzle {
  const config = getMathPuzzleConfig(levelIndex);

  // Cycle variations per level on each retry (0..9)
  const variationIndex = retryCount % config.variations.length;
  const { equation: correctEquation, swap } = config.variations[variationIndex];

  const scrambledEquation = createScrambledEquation(correctEquation, swap);

  const correctValues = toValues(correctEquation);
  const scrambledValues = toValues(scrambledEquation);

  const board = toTiles(scrambledValues);
  const swappedIndices = findSwapIndices(scrambledValues, correctValues);

  return {
    id: `L${config.level}-V${variationIndex}`,
    board,
    swappedIndices,
    correctSolution: correctValues,
  };
}

export function getHint(_puzzle: MathPuzzle, levelIndex: number): string {
  const config = getMathPuzzleConfig(levelIndex);
  return config.hint;
}
