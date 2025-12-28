'use client';

import { useState, useMemo } from 'react';
import PuzzleBoard from './puzzle-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { levels, generatePuzzle } from '@/lib/levels';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
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
    setLevelIndex((prevIndex) => (prevIndex + 1) % levels.length);
    resetGame();
  }

  return (
    <Card className="w-full max-w-md bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center">
        {gameState === 'PREVIEW' && (
          <>
            <CardTitle className="text-3xl font-bold">{level.place}</CardTitle>
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
             <CardTitle className="text-3xl font-bold pt-4">{level.place}</CardTitle>
             <CardDescription className="text-lg text-muted-foreground">{level.country}</CardDescription>
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
          <div className="relative h-96 w-96 rounded-lg overflow-hidden shadow-lg border-2 border-border">
            <Image
              src={level.imageUrl}
              alt={level.place}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        {(gameState === 'PLAYING' || gameState === 'FAILED') && (
           <PuzzleBoard
              key={`playing-${level.id}-${gameState}`}
              level={level}
              boardState={scrambledBoard}
              targetState={solvedBoard}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={gameState === 'FAILED'}
            />
        )}

        {gameState === 'SOLVED' && (
          <div className="flex flex-col items-center w-full">
            <div className="relative h-96 w-96 rounded-lg overflow-hidden shadow-lg mx-auto mb-6 border-2 border-green-400/50">
              <Image src={level.imageUrl} alt={level.place} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            <div className={cn("transition-opacity duration-500 w-full", showFacts ? "opacity-100" : "opacity-0")}>
              <ul className="space-y-3 text-left text-lg">
                {level.facts.map((fact, index) => (
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
      <CardFooter className="flex justify-center p-6">
        {gameState === 'PREVIEW' && <Button onClick={startGame} size="lg" className="w-full">Start Puzzle</Button>}
        {gameState === 'FAILED' && <Button onClick={() => setGameState('PLAYING')} size="lg" className="w-full">Try Again</Button>}
        {gameState === 'SOLVED' && <Button onClick={nextLevel} size="lg" className="w-full">Next Puzzle <ArrowRight className="ml-2"/></Button>}
      </CardFooter>
    </Card>
  );
}
