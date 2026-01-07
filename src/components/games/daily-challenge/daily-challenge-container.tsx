
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Dynamically import all possible game containers
import LandmarkGameContainer from '@/components/games/one-move-landmark/game-container';
import MathGameContainer from '@/components/games/one-move-math/game-container';
import PatternsGameContainer from '@/components/games/one-move-patterns/game-container';
import WordSwapGameContainer from '@/components/games/word-swap/game-container';
import SymbolPuzzleGameContainer from '@/components/games/symbol-puzzle/game-container';

// A mapping from puzzleType in Firestore to the actual component
const puzzleComponents = {
  'one-move-landmark': LandmarkGameContainer,
  'one-move-math': MathGameContainer,
  'one-move-patterns': PatternsGameContainer,
  'word-swap': WordSwapGameContainer,
  'symbol-puzzle': SymbolPuzzleGameContainer,
};

type PuzzleType = keyof typeof puzzleComponents;

const puzzleTypes: PuzzleType[] = [
  'one-move-landmark',
  'one-move-math',
  'one-move-patterns',
  'word-swap',
  'symbol-puzzle',
];

interface DailyPuzzle {
  puzzleType: PuzzleType;
  level: number;
}

// Simple pseudo-random number generator based on a seed (date string)
const seededRandom = (seed: string) => {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < seed.length; i++) {
      k = seed.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1, k);
      h2 = h3 ^ Math.imul(h2, k);
      h3 = h4 ^ Math.imul(h3, k);
      h4 = h1 ^ Math.imul(h4, k);
  }
  return (h1>>>0) / 4294967296;
}

const getTodaysDateKey = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateDailyPuzzle = (dateKey: string): DailyPuzzle => {
    // Use the date string as a seed for all "random" choices
    const typeIndex = Math.floor(seededRandom(dateKey) * puzzleTypes.length);
    const puzzleType = puzzleTypes[typeIndex];

    // Difficulty range: levels 15 to 30 (inclusive)
    const minLevel = 15;
    const maxLevel = 30;
    const level = minLevel + Math.floor(seededRandom(dateKey + '-level') * (maxLevel - minLevel + 1));
    
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

  // Pass a 'isDailyChallenge' prop and the generated level to the component.
  // The component will need to be updated to handle this.
  // For now, we render it with its default logic, but this is the next step.
  // @ts-ignore
  return <PuzzleComponent isDailyChallenge={true} dailyLevel={puzzleData.level} />;
}
