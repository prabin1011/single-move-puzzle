'use client';

import { useState, useMemo } from 'react';
import PuzzleBoard from './puzzle-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { levels, generatePuzzle } from '@/lib/levels';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GameContainer() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = levels[levelIndex];
  const [gameState, setGameState] = useState<'PREVIEW' | 'PLAYING' | 'SOLVED' | 'FAILED'>('PREVIEW');
  const [showFacts, setShowFacts] = useState(false);

  const { scrambledBoard, solvedBoard } = useMemo(() => generatePuzzle(level), [level]);

  const startGame = () => {
    setGameState('PLAYING');
  };

  const handleSuccess = () => {
    setGameState('SOLVED');
    setTimeout(() => setShowFacts(true), 500); // Delay for effect
  };
  
  const handleFail = () => {
    setGameState('FAILED');
  };

  const resetGame = () => {
    setGameState('PREVIEW');
    setShowFacts(false);
  };
  
  const nextLevel = () => {
    setLevelIndex((prevIndex) => (prevIndex + 1) % levels.length);
    resetGame();
  }

  return (
    <Card className="w-full max-w-lg text-center shadow-lg transition-all duration-500">
      <CardHeader>
        {gameState === 'PREVIEW' && (
          <>
            <CardTitle className="text-3xl font-bold">{level.place}</CardTitle>
            <CardDescription>Memorize the image, then find the single swap.</CardDescription>
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
             <div className="flex justify-center text-green-500">
               <CheckCircle className="h-16 w-16" />
             </div>
             <CardTitle className="text-3xl font-bold pt-4">{level.place}</CardTitle>
             <CardDescription>{level.country}</CardDescription>
           </>
        )}
        {gameState === 'FAILED' && (
          <>
            <div className="flex justify-center text-destructive">
              <XCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">Not Quite</CardTitle>
            <CardDescription>That wasn't the correct swap. Give it another try!</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {gameState === 'PREVIEW' && (
          <div className="relative h-80 w-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={level.imageUrl}
              alt={level.place}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        
        {gameState === 'PLAYING' && (
           <PuzzleBoard
              key={`playing-${level.id}`}
              level={level}
              boardState={scrambledBoard}
              targetState={solvedBoard}
              onSuccess={handleSuccess}
              onFail={handleFail}
            />
        )}

        {gameState === 'FAILED' && (
            <PuzzleBoard
              key={`failed-${level.id}`}
              level={level}
              boardState={scrambledBoard}
              targetState={solvedBoard}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={true}
            />
        )}

        {gameState === 'SOLVED' && (
          <div className="flex flex-col items-center">
            <div className="relative h-80 w-80 rounded-lg overflow-hidden shadow-lg mx-auto mb-6">
              <Image src={level.imageUrl} alt={level.place} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={cn("transition-opacity duration-500", showFacts ? "opacity-100" : "opacity-0")}>
              <ul className="space-y-2 text-left">
                {level.facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1">📍</span>
                      <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-center">
        {gameState === 'PREVIEW' && <Button onClick={startGame} size="lg">Start Puzzle</Button>}
        {gameState === 'FAILED' && <Button onClick={() => setGameState('PLAYING')} size="lg">Try Again</Button>}
        {gameState === 'SOLVED' && <Button onClick={nextLevel} size="lg">Next Puzzle</Button>}
      </CardFooter>
    </Card>
  );
}
