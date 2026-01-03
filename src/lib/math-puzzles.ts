export type TileValue = number | '+' | '-' | '*' | '/' | '=' | null;

export interface Tile {
  value: TileValue;
  isLocked: boolean; // Operators and equals sign are locked
}

export interface MathPuzzle {
  id: string;
  board: Tile[];
  gridSize: number;
  swappedIndices: [number, number];
  correctSolution: number[]; // The board state when solved
}

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generates a simple puzzle: a + b = c
export const generatePuzzle = (level: number): MathPuzzle => {
  const gridSize = 3; // For now, let's stick to a 3x3 grid
  const board: Tile[] = Array(gridSize * gridSize).fill(null).map(() => ({ value: null, isLocked: false }));

  // --- 1. Generate a correct equation ---
  let a, b, c;
  const operator = '+'; // For simplicity, start with addition
  
  a = Math.floor(Math.random() * 8) + 1; // 1-8
  b = Math.floor(Math.random() * (9 - a)) + 1; // Ensure a+b <= 9
  c = a + b;

  // --- 2. Place the equation on the board ---
  // Example placement: [a, +, b, =, c] on the middle row
  const equationTiles: TileValue[] = [a, operator, b, '=', c];
  const emptyTiles: TileValue[] = [
    Math.floor(Math.random() * 9) + 1,
    Math.floor(Math.random() * 9) + 1,
    Math.floor(Math.random() * 9) + 1,
    Math.floor(Math.random() * 9) + 1,
  ];

  // Avoid placing numbers that are already in the equation in empty spots
  const equationNumbers = [a, b, c];
  let filteredEmptyTiles = emptyTiles.filter(t => t !== null && !equationNumbers.includes(t));
  while(filteredEmptyTiles.length < 4) {
      const newTile = Math.floor(Math.random() * 9) + 1;
      if (!equationNumbers.includes(newTile) && !filteredEmptyTiles.includes(newTile)) {
        filteredEmptyTiles.push(newTile);
      }
  }

  const allTiles = [...equationTiles, ...filteredEmptyTiles];
  const shuffledBoardContent = shuffle(allTiles);

  const initialBoard: Tile[] = shuffledBoardContent.map(value => ({
      value,
      isLocked: typeof value === 'string'
  }));

  // --- 3. Find where the numbers landed to create a swap ---
  let numIndices: number[] = [];
  initialBoard.forEach((tile, index) => {
    if(typeof tile.value === 'number') {
        numIndices.push(index);
    }
  });

  // --- 4. Perform a swap to make the puzzle ---
  const scrambledBoard = JSON.parse(JSON.stringify(initialBoard));
  const [idx1, idx2] = shuffle(numIndices).slice(0, 2);

  // Swap the values
  [scrambledBoard[idx1].value, scrambledBoard[idx2].value] = [scrambledBoard[idx2].value, scrambledBoard[idx1].value];
  
  const correctSolutionBoard = initialBoard.map(t => t.value);

  return {
    id: `math-lvl-${level}-${new Date().getTime()}`,
    board: scrambledBoard,
    gridSize,
    swappedIndices: [idx1, idx2].sort((a,b) => a - b) as [number, number],
    correctSolution: correctSolutionBoard.map(v => (v === null ? 0 : (typeof v === 'string' ? -1 : v))), // Not used yet
  };
};
