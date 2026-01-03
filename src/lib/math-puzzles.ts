
export type TileValue = number | '+' | '-' | '*' | '/' | '=' | null;

export interface Tile {
  value: TileValue;
  isLocked: boolean; // Operators and equals sign are locked
}

export interface MathPuzzle {
  id: string;
  board: Tile[];
  gridSize: number; // Will be the length of the equation array
  swappedIndices: [number, number];
  correctSolution: (number | string)[]; 
}

const generateSimpleAddition = (level: number): {a: number, b: number, c: number} => {
    if (level < 10) { // Levels 0-9
        // Single digit addition
        const a = Math.floor(Math.random() * 8) + 1; // 1-8
        const b = Math.floor(Math.random() * (9 - a)) + 1; // Ensure a+b <= 9
        return { a, b, c: a + b };
    } else { // Levels 10+
        // Double digit + single/double digit addition
        const a = Math.floor(Math.random() * 90) + 10; // 10-99
        const b = Math.floor(Math.random() * (100 - a)) + 1; // Ensure a+b <= 99
        return { a, b, c: a + b };
    }
}

const generateSimpleSubtraction = (level: number): {a: number, b: number, c: number} => {
    if (level < 35) { // Levels 25-34
        // single digit result
        const c = Math.floor(Math.random() * 9) + 1; // 1-9
        const b = Math.floor(Math.random() * (20 - c)) + 1; // keep numbers reasonable
        return { a: c + b, b, c };
    } else { // Levels 35+
        // double digit result
        const c = Math.floor(Math.random() * 50) + 10; // 10-59
        const b = Math.floor(Math.random() * 40) + 10; // 10-49
        return { a: c + b, b, c };
    }
}


// Generates a simple puzzle based on level
export const generatePuzzle = (level: number, retryCount: number = 0): MathPuzzle => {
  const gridSize = 5; // e.g., [a, op, b, =, c]
  
  let a: number, b: number, c: number;
  let operator: '+' | '-';

  if (level < 25) {
      operator = '+';
      ({a, b, c} = generateSimpleAddition(level));
  } else {
      operator = '-';
      ({a, b, c} = generateSimpleSubtraction(level));
  }

  // Flatten the equation into numbers to be placed on the board
  const numbers = [a, b, c].flatMap(num => num.toString().split('').map(Number));
  
  // This logic is simplified and assumes single-digit results for now.
  // It needs to be expanded for multi-digit numbers.
  const correctBoard: Tile[] = [
    ...a.toString().split('').map(n => ({ value: parseInt(n), isLocked: false })),
    { value: operator, isLocked: true },
    ...b.toString().split('').map(n => ({ value: parseInt(n), isLocked: false })),
    { value: '=', isLocked: true },
    ...c.toString().split('').map(n => ({ value: parseInt(n), isLocked: false })),
  ];
  
  const equationToString = (n1: number, op: string, n2: number, res: number) => `${n1} ${op} ${n2} = ${res}`;

  // This needs to be smarter to handle multi-digit numbers correctly
  const boardWithDigits = [];
  const strA = a.toString();
  for (let i = 0; i < strA.length; i++) boardWithDigits.push({ value: parseInt(strA[i]), isLocked: false });
  boardWithDigits.push({ value: operator, isLocked: true });
  const strB = b.toString();
  for (let i = 0; i < strB.length; i++) boardWithDigits.push({ value: parseInt(strB[i]), isLocked: false });
  boardWithDigits.push({ value: '=', isLocked: true });
  const strC = c.toString();
  for (let i = 0; i < strC.length; i++) boardWithDigits.push({ value: parseInt(strC[i]), isLocked: false });

  const finalCorrectBoard: Tile[] = boardWithDigits;


  // --- 2. Create the puzzle by swapping two numbers ---
  const scrambledBoard = JSON.parse(JSON.stringify(finalCorrectBoard));
  const numberIndices = finalCorrectBoard.map((tile, i) => !tile.isLocked ? i : -1).filter(i => i !== -1);

  // Pick two distinct random indices from the available number positions
  let idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  let idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  while (idx1 === idx2) {
    idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  }

  // Swap the values at these indices to create the puzzle
  [scrambledBoard[idx1].value, scrambledBoard[idx2].value] = [scrambledBoard[idx2].value, scrambledBoard[idx1].value];
  
  const correctSolutionValues = finalCorrectBoard.map(tile => tile.value);

  return {
    id: `math-lvl-${level}-${retryCount}-${new Date().getTime()}`,
    board: scrambledBoard,
    gridSize: finalCorrectBoard.length,
    swappedIndices: [idx1, idx2].sort((a,b) => a - b) as [number, number],
    correctSolution: correctSolutionValues.map(v => (v === null ? '' : String(v))),
  };
};

export const getHint = (puzzle: MathPuzzle): string => {
    const [idx1, idx2] = puzzle.swappedIndices;
    const tile1Value = puzzle.correctSolution[idx1];
    const tile2Value = puzzle.correctSolution[idx2];
    
    const hints = [
        `One of the numbers you need to swap is '${tile1Value}'.`,
        `One of the swapped numbers should be '${tile2Value}'.`,
        `Think about the relationship between the numbers. Does the result make sense?`,
        `One of the tiles is in the wrong position. It should be a '${tile1Value}'.`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
}

    