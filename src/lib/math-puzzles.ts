
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

// Generates a simple puzzle: a + b = c
export const generatePuzzle = (level: number): MathPuzzle => {
  const gridSize = 5; // e.g., [a, +, b, =, c]
  
  // --- 1. Generate a correct equation ---
  let a, b, c;
  const operator = '+'; // For simplicity, start with addition
  
  // Create simple, single-digit addition problems
  a = Math.floor(Math.random() * 8) + 1; // 1-8
  b = Math.floor(Math.random() * (9 - a)) + 1; // Ensure a+b <= 9
  c = a + b;

  const correctBoard: Tile[] = [
    { value: a, isLocked: false },
    { value: operator, isLocked: true },
    { value: b, isLocked: false },
    { value: '=', isLocked: true },
    { value: c, isLocked: false },
  ];

  // --- 2. Create the puzzle by swapping two numbers ---
  const scrambledBoard = JSON.parse(JSON.stringify(correctBoard));
  const numberIndices = [0, 2, 4]; // Indices of the numbers a, b, c

  // Pick two distinct random indices from the available number positions
  let idx1 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  let idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  while (idx1 === idx2) {
    idx2 = numberIndices[Math.floor(Math.random() * numberIndices.length)];
  }

  // Swap the values at these indices to create the puzzle
  [scrambledBoard[idx1].value, scrambledBoard[idx2].value] = [scrambledBoard[idx2].value, scrambledBoard[idx1].value];
  
  const correctSolutionValues = correctBoard.map(tile => tile.value);

  return {
    id: `math-lvl-${level}-${new Date().getTime()}`,
    board: scrambledBoard,
    gridSize,
    swappedIndices: [idx1, idx2].sort((a,b) => a - b) as [number, number],
    correctSolution: correctSolutionValues.map(v => (v === null ? '' : String(v))),
  };
};
