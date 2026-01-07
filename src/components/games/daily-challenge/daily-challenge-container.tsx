
'use client';

import { seededRandom, getTodaysDateKey } from '@/lib/daily-challenge';

import LandmarkGameContainer from '@/components/games/one-move-landmark/game-container';
import MathGameContainer from '@/components/games/one-move-math/game-container';
import PatternsGameContainer from '@/components/games/one-move-patterns/game-container';
import SymbolPuzzleGameContainer from '@/components/games/symbol-puzzle/game-container';
import WordSwapGameContainer from '@/components/games/word-swap/game-container';

const puzzleComponents = {
  'one-move-landmark': LandmarkGameContainer,
  'one-move-math': MathGameContainer,
  'one-move-patterns': PatternsGameContainer,
  'symbol-puzzle': SymbolPuzzleGameContainer,
};

type PuzzleType = keyof typeof puzzleComponents;

const puzzleTypes: PuzzleType[] = [
  'one-move-landmark',
  'one-move-math',
  'one-move-patterns',
  'symbol-puzzle',
];

const maxLevels: Record<PuzzleType, number> = {
  'one-move-landmark': 48,
  'one-move-math': 50,
  'one-move-patterns': 50,
  'symbol-puzzle': 100,
};

export default function DailyChallengeContainer() {
  const dateKey = getTodaysDateKey();

  const typeIndex = Math.floor(
    seededRandom(dateKey + '-type') * puzzleTypes.length
  );
  const puzzleType = puzzleTypes[typeIndex];

  const maxLevelForType = maxLevels[puzzleType];
  // Generate a level from the top 10 available for that game type.
  const level =
    maxLevelForType - Math.floor(seededRandom(dateKey + '-level') * 10);

  const PuzzleComponent = puzzleComponents[puzzleType];

  return (
    <PuzzleComponent
      isDailyChallenge
      dailyLevel={level}
      puzzleSeed={dateKey} // STRING SEED ONLY
    />
  );
}
