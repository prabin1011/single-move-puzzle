'use client';

import { useState, useMemo } from 'react';
import PuzzleBoard from './puzzle-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { levels, generatePuzzle } from '@/lib/levels';
import { CheckCircle, XCircle } from 'lucide-react';

export default function GameContainer() {
  const [level, setLevel] = useState(levels[0]);
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
    // For now, we only have one level
    setGameState('PREVIEW');
    setShowFacts(false);
  };
  
  const nextLevel = () => {
    // For now, just reset the game
    resetGame();
  }

  if (gameState === 'PREVIEW') {
    return (
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{level.place}</CardTitle>
          <CardDescription>Memorize the image, then find the single swap.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative h-80 w-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={level.imageUrl}
              alt={level.place}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={startGame} size="lg">Start Puzzle</Button>
        </CardFooter>
      </Card>
    );
  }

  if (gameState === 'SOLVED') {
     return (
       <Card className="w-full max-w-lg text-center shadow-lg transition-all duration-500">
         <CardHeader>
           <div className="flex justify-center text-green-500">
             <CheckCircle className="h-16 w-16" />
           </div>
           <CardTitle className="text-3xl font-bold pt-4">{level.place}</CardTitle>
           <CardDescription>{level.country}</CardDescription>
         </CardHeader>
         <CardContent>
          <div className="relative h-80 w-80 rounded-lg overflow-hidden shadow-lg mx-auto mb-6">
            <Image src={level.imageUrl} alt={level.place} fill style={{ objectFit: 'cover' }} />
          </div>
           {showFacts && (
             <ul className="space-y-2 text-left animate-in fade-in duration-500">
               {level.facts.map((fact, index) => (
                 <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">📍</span>
                    <span>{fact}</span>
                 </li>
               ))}
             </ul>
           )}
         </CardContent>
         <CardFooter className="flex justify-center">
           <Button onClick={nextLevel} size="lg">Next Puzzle</Button>
         </CardFooter>
       </Card>
     );
  }
  
  if (gameState === 'FAILED') {
    return (
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
           <div className="flex justify-center text-destructive">
             <XCircle className="h-16 w-16" />
           </div>
          <CardTitle className="text-3xl font-bold pt-4">Not Quite</CardTitle>
          <CardDescription>That wasn't the correct swap. Give it another try!</CardDescription>
        </CardHeader>
        <CardContent>
           <PuzzleBoard
              level={level}
              boardState={scrambledBoard}
              targetState={solvedBoard}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={true}
            />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => setGameState('PLAYING')} size="lg">Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
       <div className="text-center">
          <h1 className="text-2xl font-semibold">Find the two swapped pieces.</h1>
          <p className="text-muted-foreground">Select two tiles to swap them back into place.</p>
       </div>
        <PuzzleBoard
          level={level}
          boardState={scrambledBoard}
          targetState={solvedBoard}
          onSuccess={handleSuccess}
          onFail={handleFail}
        />
    </div>
  );
}
