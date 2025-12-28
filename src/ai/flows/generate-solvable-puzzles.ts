'use server';

/**
 * @fileOverview Generates solvable puzzles for the Single Move Master game.
 *
 * - generateSolvablePuzzle - A function that generates a solvable puzzle based on difficulty, board size, and move mechanics.
 * - GeneratePuzzleInput - The input type for the generateSolvablePuzzle function.
 * - GeneratePuzzleOutput - The return type for the generateSolvablePuzzle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePuzzleInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the puzzle.'),
  boardSize: z.number().describe('The size of the board (e.g., 3 for a 3x3 board).'),
  moveMechanic: z
    .enum(['swap', 'rotate', 'flip', 'shift'])
    .describe('The move mechanic for the puzzle.'),
});
export type GeneratePuzzleInput = z.infer<typeof GeneratePuzzleInputSchema>;

const GeneratePuzzleOutputSchema = z.object({
  initialBoardState: z.array(z.any()).describe('The initial scrambled state of the board.'),
  targetBoardState: z.array(z.any()).describe('The target configuration of the board.'),
  solutionMove: z.object({
    type: z.string().describe('The type of move to perform (e.g., swap, rotate).'),
    details: z.record(z.any()).describe('Details of the move, such as indices to swap.'),
  }).describe('The single move required to solve the puzzle'),
});
export type GeneratePuzzleOutput = z.infer<typeof GeneratePuzzleOutputSchema>;

export async function generateSolvablePuzzle(input: GeneratePuzzleInput): Promise<GeneratePuzzleOutput> {
  return generateSolvablePuzzleFlow(input);
}

const puzzlePrompt = ai.definePrompt({
  name: 'puzzlePrompt',
  input: {schema: GeneratePuzzleInputSchema},
  output: {schema: GeneratePuzzleOutputSchema},
  prompt: `You are a puzzle generator for the "Single Move Master" game. Your task is to create a puzzle that can be solved in a single move, given the difficulty, board size, and move mechanic.

Difficulty: {{{difficulty}}}
Board Size: {{{boardSize}}}
Move Mechanic: {{{moveMechanic}}}

Create an initial board state and a target board state, ensuring that only one move of the specified mechanic is required to transform the initial state into the target state. The board should be represented as a 1-dimensional array. Provide the details of the solution move.

Output the puzzle as a JSON object matching the following schema:
${GeneratePuzzleOutputSchema.description ?? ''}

Make sure that the generated puzzle has varying complexity. For example:

- Easy Levels: Small boards (3x3), simple patterns.
- Medium Levels: Larger boards (4x4 or 5x5), elements with chain reactions (one move affects multiple tiles).
- Hard Levels: Complex patterns, obstacles (locked tiles, unchangeable elements, or indirect effects).

Ensure that the "solutionMove" field precisely reflects the single move required to solve the puzzle.
`,
});

const generateSolvablePuzzleFlow = ai.defineFlow(
  {
    name: 'generateSolvablePuzzleFlow',
    inputSchema: GeneratePuzzleInputSchema,
    outputSchema: GeneratePuzzleOutputSchema,
  },
  async input => {
    const {output} = await puzzlePrompt(input);
    return output!;
  }
);
