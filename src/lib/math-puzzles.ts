
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

export interface MathLevel {
  level: number;
  description: string;
  hint: string;
  generate: (levelIndex: number, variation: number) => MathPuzzle;
}

/* ---------- helpers: basic token building ---------- */

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

const toTiles = (values: TileValue[]): Tile[] =>
  values.map((value) => ({
    value,
    // ⛔ lock ONLY the equals sign
    isLocked: value === '=',
  }));

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


/* ---------- helpers: swap choice & puzzle creation ---------- */

const createPuzzleFromTokens = (
  tokens: TileValue[],
  scrambled: TileValue[],
  swappedIndices: [number, number],
  levelIndex: number,
  variation: number
): MathPuzzle => {
  return {
    id: `L${levelIndex + 1}-V${variation}`,
    board: toTiles(scrambled),
    swappedIndices,
    correctSolution: tokens,
  };
};

/* ---------- generators for difficulty bands ---------- */

const makeAddSubGenerator = (
  min: number,
  max: number,
  allowSubtract: boolean
): ((levelIndex: number, variation: number) => MathPuzzle) => {
    const span = max - min + 1;
    return (levelIndex, variation) => {
        const seed = levelIndex * 17 + variation * 13;

        let a = min + ((seed * 3) % span);
        let b = min + ((seed * 7 + 1) % span);

        let op: '+' | '-' = '+';
        if (allowSubtract && variation % 2 === 1) {
            op = '-';
            if (a < b) [a, b] = [b, a]; // Ensure positive result
        }

        const correctEq = `${a} ${op} ${b} = ${op === '+' ? a + b : a - b}`;
        const correctTokens = toValues(correctEq);

        // Swap first operand with result
        const swap: [string, string] = [`${a}`, `${op === '+' ? a + b : a - b}`];
        const scrambledEq = createScrambledEquation(correctEq, swap);
        const scrambledTokens = toValues(scrambledEq);
        const swappedIndices = findSwapIndices(scrambledTokens, correctTokens);

        return createPuzzleFromTokens(correctTokens, scrambledTokens, swappedIndices, levelIndex, variation);
    };
};

const makeMultiplicationGenerator = (
  minA: number,
  maxA: number,
  minB: number,
  maxB: number
): ((levelIndex: number, variation: number) => MathPuzzle) => {
    const spanA = maxA - minA + 1;
    const spanB = maxB - minB + 1;
    return (levelIndex, variation) => {
        const seed = levelIndex * 23 + variation * 19;
        const a = minA + (seed % spanA);
        const b = minB + ((seed * 3 + 1) % spanB);
        const correctEq = `${a} * ${b} = ${a * b}`;
        const correctTokens = toValues(correctEq);
        
        // Swap one factor with the result
        const swap: [string, string] = variation % 2 === 0 ? [`${a}`, `${a*b}`] : [`${b}`, `${a*b}`];
        const scrambledEq = createScrambledEquation(correctEq, swap);
        const scrambledTokens = toValues(scrambledEq);
        const swappedIndices = findSwapIndices(scrambledTokens, correctTokens);

        return createPuzzleFromTokens(correctTokens, scrambledTokens, swappedIndices, levelIndex, variation);
    };
};

const makeDivisionGenerator = (
  minQuotient: number,
  maxQuotient: number,
  minDivisor: number,
  maxDivisor: number
): ((levelIndex: number, variation: number) => MathPuzzle) => {
    const spanQ = maxQuotient - minQuotient + 1;
    const spanD = maxDivisor - minDivisor + 1;
    return (levelIndex, variation) => {
        const seed = levelIndex * 29 + variation * 31;
        const q = minQuotient + (seed % spanQ);
        const d = minDivisor + ((seed * 5 + 1) % spanD);
        const dividend = q * d;
        const correctEq = `${dividend} / ${d} = ${q}`;
        const correctTokens = toValues(correctEq);

        // Swap quotient with dividend
        const swap: [string, string] = [`${dividend}`, `${q}`];
        const scrambledEq = createScrambledEquation(correctEq, swap);
        const scrambledTokens = toValues(scrambledEq);
        const swappedIndices = findSwapIndices(scrambledTokens, correctTokens);
        
        return createPuzzleFromTokens(correctTokens, scrambledTokens, swappedIndices, levelIndex, variation);
    };
};

const makeMixedGenerator = (
  aRange: [number, number],
  bRange: [number, number],
  cRange: [number, number]
): ((levelIndex: number, variation: number) => MathPuzzle) => {
    const [aMin, aMax] = aRange;
    const [bMin, bMax] = bRange;
    const [cMin, cMax] = cRange;

    const spanA = aMax - aMin + 1;
    const spanB = bMax - bMin + 1;
    const spanC = cMax - cMin + 1;

    return (levelIndex, variation) => {
        const seed = levelIndex * 37 + variation * 41;
        let a = aMin + (seed % spanA);
        const b = bMin + ((seed * 3) % spanB);
        const c = cMin + ((seed * 5) % spanC);
        
        const op1: '+' | '-' = variation % 3 === 0 ? '-' : '+';
        if (op1 === '-' && a < (b*c)) {
            a += (b*c); // Ensure positive result
        }
        
        const result = op1 === '+' ? a + (b * c) : a - (b * c);
        const correctEq = `${a} ${op1} ${b} * ${c} = ${result}`;
        const correctTokens = toValues(correctEq);
        
        // Swap an operator with a number
        const swap: [string, string] = variation % 2 === 0 ? [op1, `${c}`] : ['*', `${a}`];
        const scrambledEq = createScrambledEquation(correctEq, swap);
        const scrambledTokens = toValues(scrambledEq);
        const swappedIndices = findSwapIndices(scrambledTokens, correctTokens);

        return createPuzzleFromTokens(correctTokens, scrambledTokens, swappedIndices, levelIndex, variation);
    };
};

/* ---------- level table: 50 levels, 10 variations each ---------- */

const mathLevels: MathLevel[] = (() => {
  const levels: MathLevel[] = [];

  // Level 1 – baby addition tutorial
  levels.push({
    level: 1,
    description: 'Getting Started',
    hint: 'Swap the two tiles that make this tiny addition fact true.',
    generate: makeAddSubGenerator(1, 9, false),
  });

  // 🔥 Level 2 – already mixed 2-digit + ×
  levels.push({
    level: 2,
    description: 'Early Mix: Add & Multiply',
    hint: 'Do the multiplication first, then the addition or subtraction. A digit or an operator is in the wrong place.',
    generate: makeMixedGenerator([10, 40], [2, 9], [2, 9]),
  });

  // Levels 3–4 – two-digit add/sub
  for (let i = 0; i < 2; i++) {
    levels.push({
      level: 3 + i,
      description: 'Two-Digit Add & Subtract',
      hint: 'Check the tens and ones carefully on both sides of the equals sign.',
      generate: makeAddSubGenerator(5, 40, true),
    });
  }

  // Levels 5–8 – early multiplication
  for (let i = 0; i < 4; i++) {
    levels.push({
      level: 5 + i,
      description: 'Multiplication Basics',
      hint: 'Think in times tables. One factor, the product, or even the × sign is wrong.',
      generate: makeMultiplicationGenerator(2, 9, 2, 9),
    });
  }

  // Levels 9–12 – early division
  for (let i = 0; i < 4; i++) {
    levels.push({
      level: 9 + i,
      description: 'Division & Inverses',
      hint: 'Remember: dividend ÷ divisor = quotient. Something on the left or right is swapped.',
      generate: makeDivisionGenerator(2, 9, 2, 9),
    });
  }

  // Levels 13–20 – harder 2-digit add/sub
  for (let i = 0; i < 8; i++) {
    levels.push({
      level: 13 + i,
      description: 'Challenging Two-Digit Equations',
      hint: 'Use mental column addition/subtraction. One tile belongs somewhere else.',
      generate: makeAddSubGenerator(10, 99, true),
    });
  }

  // Levels 21–30 – harder multiplication
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 21 + i,
      description: 'Multiplication Workout',
      hint: 'Larger factors mean more digits. Check both the factors and the product.',
      generate: makeMultiplicationGenerator(3, 12, 3, 12),
    });
  }

  // Levels 31–40 – harder division
  for (let i = 0; i < 10; i++) {
    levels.push({
      level: 31 + i,
      description: 'Division Drills',
      hint: 'Imagine the hidden multiplication fact: dividend = divisor × quotient.',
      generate: makeDivisionGenerator(3, 12, 3, 12),
    });
  }

  // Levels 41–45 – mixed operations, moderate ranges
  for (let i = 0; i < 5; i++) {
    levels.push({
      level: 41 + i,
      description: 'Order of Operations',
      hint: 'Do the multiplication first, then the addition or subtraction. Even an operator might be wrong.',
      generate: makeMixedGenerator([5, 30], [2, 9], [2, 9]),
    });
  }

  // Levels 46–50 – mixed operations, big numbers (final boss zone)
  for (let i = 0; i < 5; i++) {
    levels.push({
      level: 46 + i,
      description: 'Ultimate Challenge',
      hint: 'Big numbers and two operations. Track the math step by step to find the swapped tiles.',
      generate: makeMixedGenerator([20, 80], [3, 12], [3, 12]),
    });
  }

  return levels;
})();

/* ---------- public API ---------- */

export function getMathPuzzleConfig(level: number): MathLevel {
  const idx = Math.max(0, Math.min(level, mathLevels.length - 1));
  return mathLevels[idx];
}

export function generatePuzzle(
  level: number,
  retryCount: number
): MathPuzzle {
  const config = getMathPuzzleConfig(level);
  const variation = retryCount % 10; // 0..9 → 10 variations per level
  return config.generate(level, variation);
}

export function getHint(_puzzle: MathPuzzle, level: number): string {
  const config = getMathPuzzleConfig(level);
  return config.hint;
}
