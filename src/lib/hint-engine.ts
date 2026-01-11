
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
 * @returns A string representing a simple equation, e.g., "The Row is 2 + 1".
 */
function generateMathProblem(value: number, label: string): string {
  if (value === 1) {
    const options = [`${label} is 1 * 1`, `${label} is 2 - 1`, `${label} is 3 - 2`];
    return options[Math.floor(Math.random() * options.length)];
  }

  const operand1 = Math.floor(Math.random() * (value - 1)) + 1;
  const operand2 = value - operand1;

  if (Math.random() > 0.5) {
     return `${label} is ${operand1} + ${operand2}`;
  } else {
     const newOperand1 = value + operand2;
     return `${label} is ${newOperand1} - ${operand2}`;
  }
}

/**
 * Generates procedural hints for one of the swapped tiles.
 * Provides up to 3 tiers of hints: general location, exact column, and exact row.
 * @param grid The size of the puzzle grid.
 * @param swappedIndices An array containing the one or two swapped indices.
 * @returns An array of hint strings.
 */
export function generateHints(grid: number, swappedIndices: number[]): string[] {
  // Pick one of the two swapped tiles to give a hint for.
  const targetIndex = swappedIndices[Math.floor(Math.random() * swappedIndices.length)];
  const { row, col } = getCoords(targetIndex, grid);
  
  const hints: string[] = [];

  // Hint 1: Vague positional hint (quadrant or edge)
  const getQuadrant = (r: number, c: number, g: number) => {
    const mid = Math.ceil(g / 2);
    if (r === 1) return "on the top edge";
    if (r === g) return "on the bottom edge";
    if (c === 1) return "on the left edge";
    if (c === g) return "on the right edge";

    if (r <= mid && c <= mid) return "in the top-left quadrant";
    if (r <= mid && c > mid) return "in the top-right quadrant";
    if (r > mid && c <= mid) return "in the bottom-left quadrant";
    return "in the bottom-right quadrant";
  };
  const quadrant = getQuadrant(row, col, grid);
  hints.push(`One of the incorrect tiles is ${quadrant}.`);

  // Hint 2: Specific column hint (math problem)
  hints.push(generateMathProblem(col, "The column"));

  // Hint 3: Specific row hint (math problem)
  hints.push(generateMathProblem(row, "The row"));

  return hints;
}
