/**
 * Converts a tile's linear index into its row and column.
 * Rows and columns are 1-based for user-friendliness.
 * @param index The linear index of the tile (0 to grid*grid - 1).
 * @param grid The size of the puzzle grid (e.g., 3 for a 3x3).
 * @returns An object with the row and column.
 */
function getCoords(index: number, grid: number): { row: number; col: number } {
  return {
    row: Math.floor(index / grid) + 1,
    col: (index % grid) + 1,
  };
}

/**
 * Generates a simple mathematical puzzle for a given coordinate.
 * @param value The actual coordinate value (row or column).
 * @param label The name of the coordinate (e.g., "Row", "Column").
 * @returns A string representing a simple equation, e.g., "Row is 2 + 1".
 */
function generateMathProblem(value: number, label: string): string {
  if (value === 1) {
    const options = [`${label} is 1 * 1`, `${label} is 2 - 1`, `${label} is 3 - 2`];
    return options[Math.floor(Math.random() * options.length)];
  }

  const operand1 = Math.floor(Math.random() * (value - 1)) + 1;
  const operand2 = value - operand1;

  const operators: (['+', '-'] | ['*', '/']) = Math.random() > 0.5 ? ['+', '-'] : ['*', '/'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  switch (operator) {
    case '+':
      return `${label} is ${operand1} + ${operand2}`;
    case '-':
       const newOperand1 = value + operand2;
       return `${label} is ${newOperand1} - ${operand2}`;
    case '*':
      if (value > 2 && Math.random() > 0.5) {
        const factors = findFactors(value);
        if (factors.length > 0) {
          const [f1, f2] = factors[Math.floor(Math.random() * factors.length)];
          return `${label} is ${f1} * ${f2}`;
        }
      }
      // Fallback for multiplication
      return `${label} is ${value} * 1`;
    case '/':
      const dividend = value * (Math.floor(Math.random() * 3) + 2); // Multiply by 2, 3, or 4
      const divisor = dividend / value;
      return `${label} is ${dividend} / ${divisor}`;
  }
}

function findFactors(num: number): [number, number][] {
    const factors: [number, number][] = [];
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            factors.push([i, num / i]);
        }
    }
    return factors;
}


/**
 * Generates a procedural hint for one of the swapped tiles.
 * @param grid The size of the puzzle grid.
 * @param swappedIndices An array containing the two swapped indices.
 * @returns A string containing the hint.
 */
export function generateHint(grid: number, swappedIndices: number[]): string {
  // Randomly pick one of the two swapped tiles to give a hint for.
  const targetIndex = swappedIndices[Math.floor(Math.random() * 2)];
  const { row, col } = getCoords(targetIndex, grid);

  // Randomly choose a hint type.
  const hintType = Math.floor(Math.random() * 4);

  switch (hintType) {
    // Case 0: Direct coordinate hint.
    case 0:
      return `One of the tiles is in Row ${row}, Column ${col}.`;

    // Case 1: Mathematical hint for the row.
    case 1:
      return `For one tile: ${generateMathProblem(row, 'Row')}.`;

    // Case 2: Mathematical hint for the column.
    case 2:
      return `For one tile: ${generateMathProblem(col, 'Column')}.`;
    
    // Case 3: Positional hint
    case 3:
      const positions = [];
      if (row === 1) positions.push('top');
      if (row === grid) positions.push('bottom');
      if (col === 1) positions.push('left');
      if (col === grid) positions.push('right');
      if (positions.length > 0) {
        const side = positions[Math.floor(Math.random() * positions.length)];
        return `One of the tiles is on the ${side} edge of the puzzle.`;
      }
      // Fallback if not on an edge
      return `One tile is in the upper half of the puzzle (Row <= ${Math.ceil(grid/2)}).`;

    default:
      return `One of the tiles is in Row ${row}, Column ${col}.`;
  }
}
