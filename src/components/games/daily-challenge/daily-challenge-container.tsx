
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTodaysDateKey, seededRandom } from '@/lib/daily-challenge';

// Dynamically import all possible game containers
import LandmarkGameContainer from '@/components/games/one-move-landmark/game-container';
import MathGameContainer from '@/components/games/one-move-math/game-container';
import PatternsGameContainer from '@/components/games/one-move-patterns/game-container';
import SymbolPuzzleGameContainer from '@/components/games/symbol-puzzle/game-container';

// A mapping from puzzleType in Firestore to the actual component
const puzzleComponents = {
  'one-move-landmark': LandmarkGameContainer,
  'one-move-math': MathGameContainer,
  'one-move-patterns': PatternsGameContainer,
  'symbol-puzzle': SymbolPuzzleGameContainer,
};

type PuzzleType = keyof typeof puzzleComponents;

// word-swap has been removed from this list as requested.
const puzzleTypes: PuzzleType[] = [
  'one-move-landmark',
  'one-move-math',
  'one-move-patterns',
  'symbol-puzzle',
];

interface DailyPuzzle {
  puzzleType: PuzzleType;
  level: number;
}

const generateDailyPuzzle = (dateKey: string): DailyPuzzle => {
    // Use the date string as a seed for all "random" choices to ensure consistency
    const typeRng = seededRandom(dateKey + '-type');
    const levelRng = seededRandom(dateKey + '-level');

    const typeIndex = Math.floor(typeRng * puzzleTypes.length);
    const puzzleType = puzzleTypes[typeIndex];

    // Difficulty range: levels 40 to 50
    const minLevel = 40;
    const maxLevel = 50;
    const level = minLevel + Math.floor(levelRng * (maxLevel - minLevel + 1));
    
    return {
        puzzleType,
        level,
    };
}


export default function DailyChallengeContainer() {
  const [puzzleData, setPuzzleData] = useState<DailyPuzzle | null>(null);

  // Generate the puzzle on the client side based on the date
  useEffect(() => {
    const dateKey = getTodaysDateKey();
    const puzzle = generateDailyPuzzle(dateKey);
    setPuzzleData(puzzle);
  }, []);

  if (!puzzleData) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating Daily Challenge...</p>
      </div>
    );
  }

  const PuzzleComponent = puzzleComponents[puzzleData.puzzleType];

  if (!PuzzleComponent) {
     return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Unknown Puzzle Type</AlertTitle>
        <AlertDescription>
          The daily challenge puzzle type &quot;{puzzleData.puzzleType}&quot; is not recognized by the app.
        </AlertDescription>
      </Alert>
    );
  }

  // Pass a consistent seed to the component for reproducible puzzles
  const puzzleSeed = seededRandom(getTodaysDateKey() + '-puzzle-instance');

  return <PuzzleComponent isDailyChallenge={true} dailyLevel={puzzleData.level} puzzleSeed={puzzleSeed} />;
}
