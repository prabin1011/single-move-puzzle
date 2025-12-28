import type { GeneratePuzzleOutput, GeneratePuzzleInput } from '@/ai/flows/generate-solvable-puzzles';

export type Puzzle = GeneratePuzzleOutput;
export type PuzzleConfig = Omit<GeneratePuzzleInput, 'moveMechanic'> & { moveMechanic: MoveMechanic };

export type MoveMechanic = 'swap' | 'rotate' | 'flip' | 'shift';

export interface Stats {
  levelsCompleted: number;
  timeTaken: number; // in seconds
  currentStreak: number;
  longestStreak: number;
}

export type GameStatus = 'playing' | 'won' | 'lost' | 'loading' | 'initial' | 'hint';

export type Board = (number | null)[];

export type SolutionMove = Puzzle['solutionMove'];
