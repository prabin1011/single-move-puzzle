
'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

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

const getTodaysDateKey = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DailyChallengeContainer() {
  const { firestore } = useFirebase();
  const [dateKey, setDateKey] = useState('');

  // Set the date key only once on the client
  useEffect(() => {
    setDateKey(getTodaysDateKey());
  }, []);

  const dailyPuzzleRef = dateKey ? doc(firestore, 'dailyPuzzles', dateKey) : null;
  const { data: puzzleData, isLoading, error } = useDoc(dailyPuzzleRef);

  if (isLoading || !dateKey) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Daily Challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive" className="max-w-md">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
                Could not load the Daily Challenge. Please check your internet connection and try again.
            </AlertDescription>
        </Alert>
    );
  }
  
  if (!puzzleData) {
    return (
      <Alert className="max-w-md">
        <AlertTitle>No Challenge Today</AlertTitle>
        <AlertDescription>
            It looks like today&apos;s puzzle hasn&apos;t been set up yet. Please check back later!
        </AlertDescription>
      </Alert>
    );
  }

  const puzzleType = puzzleData.puzzleType as PuzzleType;
  const PuzzleComponent = puzzleComponents[puzzleType];

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

  // TODO: Once individual puzzle components can accept specific puzzle data,
  // we will pass puzzleData.puzzleData down as props.
  // For now, they generate their own level 0 puzzle.
  return <PuzzleComponent />;
}
