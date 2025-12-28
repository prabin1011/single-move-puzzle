
'use server';

import { generateSolvablePuzzle, GeneratePuzzleInput } from '@/ai/flows/generate-solvable-puzzles';
import { generateUserStatisticMessage, GenerateUserStatisticMessageInput } from '@/ai/flows/generate-user-statistic-message';

export async function getNewPuzzle(input: GeneratePuzzleInput) {
  try {
    const puzzle = await generateSolvablePuzzle(input);
    
    // Defensive parsing for fields that might be stringified JSON
    if (puzzle.initialBoardState && typeof puzzle.initialBoardState === 'string') {
        try {
            puzzle.initialBoardState = JSON.parse(puzzle.initialBoardState);
        } catch (e) { console.error("Failed to parse initialBoardState", e); }
    }
    if (puzzle.targetBoardState && typeof puzzle.targetBoardState === 'string') {
         try {
            puzzle.targetBoardState = JSON.parse(puzzle.targetBoardState);
        } catch (e) { console.error("Failed to parse targetBoardState", e); }
    }
    if (puzzle.solutionMove && typeof puzzle.solutionMove === 'string') {
         try {
            puzzle.solutionMove = JSON.parse(puzzle.solutionMove);
        } catch (e) { console.error("Failed to parse solutionMove", e); }
    }
    return puzzle;
  } catch (error) {
    console.error('Error generating puzzle:', error);
    throw new Error('Failed to generate a new puzzle.');
  }
}

export async function getStatsMessage(input: GenerateUserStatisticMessageInput) {
  try {
    const result = await generateUserStatisticMessage(input);
    return result.message;
  } catch (error) {
    console.error('Error generating stats message:', error);
    return "Keep up the great work! Every puzzle you solve makes you sharper.";
  }
}
