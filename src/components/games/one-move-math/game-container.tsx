
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { generatePuzzle, type MathPuzzle } from '@/lib/math-puzzles';
import PuzzleBoard from './puzzle-board';
import { Loader2, RefreshCw } from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { playSound } from '@/lib/sounds';

type GameState = 'READY' | 'PLAYING' | 'SOLVED' | 'FAILED' | 'GAME_OVER';

export default function GameContainer() {
  const [level, setLevel] = useState(0);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [puzzle, setPuzzle] = useState<MathPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isSoundOn } = useSound();

  const loadPuzzle = () => {
    setIsLoading(true);
    setGameState('PLAYING');
    // Difficulty can increase here
    const newPuzzle = generatePuzzle(level);
    setPuzzle(newPuzzle);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPuzzle();
  }, [level]);

  const handleSuccess = () => {
    playSound('success', isSoundOn);
    setGameState('SOLVED');
  };

  const handleFail = () => {
    playSound('fail', isSoundOn);
    setGameState('FAILED');
    setTimeout(() => {
        setGameState('PLAYING'); // Reset to allow another try
    }, 1500)
  };

  const handleNextLevel = () => {
    playSound('ui', isSoundOn);
    setLevel(prev => prev + 1);
  };
  
  const handleTryAgain = () => {
    playSound('ui', isSoundOn);
    loadPuzzle();
  };

  if (isLoading || !puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Puzzle...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md text-center border shadow-2xl rounded-2xl bg-card">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline">One Move Math</CardTitle>
        <CardDescription>Level {level + 1}</CardDescription>
        
        {gameState === 'PLAYING' && <p className="text-muted-foreground pt-2">Swap two numbers to solve the equation.</p>}
        {gameState === 'FAILED' && <p className="text-error animate-pulse pt-2">Not quite! Try again.</p>}
        {gameState === 'SOLVED' && (
             <div className="flex flex-col items-center gap-2 pt-2">
                <Image src="/logo.png" alt="Correct!" width={64} height={64} className="opacity-90"/>
                <p className="text-lg font-semibold text-success">Correct!</p>
            </div>
        )}

      </CardHeader>
      <CardContent>
        <PuzzleBoard
          key={puzzle.id}
          puzzle={puzzle}
          onSuccess={handleSuccess}
          onFail={handleFail}
          isReadOnly={gameState === 'SOLVED'}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[110px]">
        {gameState === 'SOLVED' ? (
          <Button onClick={handleNextLevel} size="lg" className="w-full">
            Next Puzzle
          </Button>
        ) : (
            <Button onClick={handleTryAgain} variant="secondary" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4"/>
                New Puzzle
            </Button>
        )}
        <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
            <Link href="/">Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
