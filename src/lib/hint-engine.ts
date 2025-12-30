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
    // Limited options for 1 to avoid 0s
    return `${label} is 1 * 1`;
  }
  const operand1 = Math.floor(Math.random() * (value - 1)) + 1;
  const operand2 = value - operand1;
  const operators = ['+', '-'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  if (operator === '+') {
    return `${label} is ${operand1} + ${operand2}`;
  } else {
    // For subtraction, rephrase as a + b = value
    const newOperand1 = value + operand2;
    return `${label} is ${newOperand1} - ${operand2}`;
  }
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
  const hintType = Math.floor(Math.random() * 3);

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

    default:
      return `One of the tiles is in Row ${row}, Column ${col}.`;
  }
}
