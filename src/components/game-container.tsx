'use client';

import { useState, useMemo, useEffect, useActionState } from 'react';
import PuzzleBoard from './puzzle-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { levels as initialLevels, generatePuzzle, type Level } from '@/lib/levels';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getLandmarkData } from '@/lib/actions';

export default function GameContainer() {
  const [levels, setLevels] = useState(initialLevels);
  const [levelIndex, setLevelIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[levelIndex]);

  const [gameState, setGameState] = useState<'PREVIEW' | 'PLAYING' | 'SOLVED' | 'FAILED'>('PREVIEW');
  const [showFacts, setShowFacts] = useState(false);
  const [generatedFacts, setGeneratedFacts] = useState<string[]>([]);

  // Action state for fetching new landmark data
  const [state, getNewLandmarkData, isPending] = useActionState(getLandmarkData, null);

  // Update level data when new data is fetched
  useEffect(() => {
    if (state?.imageUrl && state?.facts) {
      const updatedLevel = { ...currentLevel, imageUrl: state.imageUrl, facts: state.facts };
      setCurrentLevel(updatedLevel);
      const updatedLevels = [...levels];
      updatedLevels[levelIndex] = updatedLevel;
      setLevels(updatedLevels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);


  const { scrambledBoard, solvedBoard } = useMemo(() => generatePuzzle(currentLevel), [currentLevel]);

  const startGame = () => {
    setGameState('PLAYING');
  };

  const handleSuccess = async () => {
    setGameState('SOLVED');
    if (state?.facts) {
      setGeneratedFacts(state.facts);
    } else {
      setGeneratedFacts(currentLevel.facts);
    }
    setTimeout(() => setShowFacts(true), 500);
  };
  
  const handleFail = () => {
    setGameState('FAILED');
  };

  const resetGame = () => {
    setGameState('PREVIEW');
    setShowFacts(false);
  };
  
  const nextLevel = () => {
    const newIndex = (levelIndex + 1) % levels.length;
    setLevelIndex(newIndex);
    setCurrentLevel(levels[newIndex]);
    resetGame();
  }

  const handleNewImage = () => {
    getNewLandmarkData({ landmarkName: currentLevel.place });
  }

  return (
    <Card className="w-full max-w-sm bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center min-h-[140px] flex justify-center">
        {gameState === 'PREVIEW' && (
          <>
            <CardTitle className="text-3xl font-bold">{currentLevel.place}</CardTitle>
            <CardDescription className="text-muted-foreground">Memorize the image, then find the single swap.</CardDescription>
          </>
        )}
        {gameState === 'PLAYING' && (
          <>
            <CardTitle className="text-2xl font-semibold">Find the two swapped pieces.</CardTitle>
            <CardDescription className="text-muted-foreground">Select two tiles to swap them back into place.</CardDescription>
          </>
        )}
        {gameState === 'SOLVED' && (
           <>
             <div className="flex justify-center text-green-400">
               <CheckCircle className="h-16 w-16" />
             </div>
             <CardTitle className="text-3xl font-bold pt-4">{currentLevel.place}</CardTitle>
             <CardDescription className="text-lg text-muted-foreground">{currentLevel.country}</CardDescription>
           </>
        )}
        {gameState === 'FAILED' && (
          <>
            <div className="flex justify-center text-red-500">
              <XCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">Not Quite</CardTitle>
            <CardDescription className="text-muted-foreground">That wasn't the correct swap. Give it another try!</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {gameState === 'PREVIEW' && (
          <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg border-2 border-border">
             <Image
              src={currentLevel.imageUrl}
              alt={currentLevel.place}
              width={300}
              height={300}
              priority
              className="object-cover"
            />
          </div>
        )}
        
        {(gameState === 'PLAYING' || gameState === 'FAILED') && (
           <PuzzleBoard
              key={`playing-${currentLevel.id}-${currentLevel.imageUrl}-${gameState}`}
              level={currentLevel}
              boardState={scrambledBoard}
              targetState={solvedBoard}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={gameState === 'FAILED'}
            />
        )}

        {gameState === 'SOLVED' && (
          <div className="flex flex-col items-center w-full">
            <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg mx-auto mb-6 border-2 border-green-400/50">
              <Image src={currentLevel.imageUrl} alt={currentLevel.place} width={300} height={300} className="object-cover" />
            </div>
            <div className={cn("transition-opacity duration-500 w-full", showFacts ? "opacity-100" : "opacity-0")}>
              <ul className="space-y-3 text-left text-lg">
                {generatedFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                      <span className="text-primary mt-1">✓</span>
                      <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4">
        {gameState === 'PREVIEW' && (
          <div className="w-full space-y-2">
            <Button onClick={startGame} size="lg" className="w-full">Start Puzzle</Button>
            <Button onClick={handleNewImage} size="lg" variant="secondary" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              New Image
            </Button>
          </div>
        )}
        {gameState === 'FAILED' && <Button onClick={() => setGameState('PLAYING')} size="lg" className="w-full">Try Again</Button>}
        {gameState === 'SOLVED' && <Button onClick={nextLevel} size="lg" className="w-full">Next Puzzle <ArrowRight className="ml-2"/></Button>}
        
        <div className="relative w-full text-center h-6">
          {gameState !== 'PREVIEW' && (
              <Link href="/" passHref legacyBehavior>
                  <Button variant="link" className="absolute top-0 left-0 text-muted-foreground">Back to Home</Button>
              </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
