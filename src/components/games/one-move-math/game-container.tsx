
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { generatePuzzle, getHint, type MathPuzzle, getMathPuzzleConfig } from '@/lib/math-puzzles';
import PuzzleBoard from './puzzle-board';
import { Loader2, RefreshCw, CheckCircle, Info, Play, ArrowRight, PartyPopper, BrainCircuit } from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import type { TileValue } from '@/lib/math-puzzles';

type GameState = 'READY' | 'PLAYING' | 'SOLVED_VISUALIZING' | 'SOLVED_COMPLETE' | 'FAILED' | 'GAME_OVER';

const MAX_MISTAKES = 0; // Game over on first mistake

export default function GameContainer() {
  const [level, setLevel] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('READY');
  const [puzzle, setPuzzle] = useState<MathPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { isSoundOn } = useSound();

  const loadPuzzle = (currentLevel: number, retries: number) => {
    setIsLoading(true);
    // Adding a small delay to allow for smooth transitions, feels less jarring
    setTimeout(() => {
        const newPuzzle = generatePuzzle(currentLevel, retries);
        setPuzzle(newPuzzle);
        setIsLoading(false);
    }, 200);
  };
  
  // Load progress on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('mathCurrentLevel');
    const savedHighestLevel = localStorage.getItem('mathHighestLevel');
    
    const initialLevel = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;

    setLevel(initialLevel);
    setHighestLevel(initialHighest);
    loadPuzzle(initialLevel, retryCount);
  }, []);

  // Save progress whenever level changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load
    localStorage.setItem('mathCurrentLevel', level.toString());
    if (level > highestLevel) {
      const newHighest = level;
      setHighestLevel(newHighest);
      localStorage.setItem('mathHighestLevel', newHighest.toString());
    }
  }, [level, highestLevel, isLoading]);
  
  useEffect(() => {
    if (!isLoading && (level > 0 || retryCount > 0)) { // Don't run on initial load
        loadPuzzle(level, retryCount);
    }
  }, [level, retryCount]);


  const handleSuccess = () => {
    playSound('success', isSoundOn);
    setGameState('SOLVED_VISUALIZING');
    setTimeout(() => {
        setGameState('SOLVED_COMPLETE');
    }, 1500)
  };

  const handleFail = () => {
    playSound('fail', isSoundOn);
    const newMistakeCount = mistakeCount + 1;
    setMistakeCount(newMistakeCount);
    if (newMistakeCount > MAX_MISTAKES) {
      setGameState("GAME_OVER");
      localStorage.removeItem('mathCurrentLevel');
      localStorage.removeItem('mathHighestLevel');
    } else {
      setGameState("FAILED");
    }
  };

  const handleNextLevel = () => {
    playSound('ui', isSoundOn);
    setMistakeCount(0);
    setLevel(prev => prev + 1);
    setGameState('READY');
  };
  
  const handleTryAgain = () => {
    playSound('ui', isSoundOn);
    setMistakeCount(0);
    setRetryCount(prev => prev + 1);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    playSound("ui", isSoundOn);
    setLevel(0);
    setHighestLevel(0);
    setMistakeCount(0);
    setRetryCount(0);
    setGameState("READY");
    localStorage.removeItem('mathCurrentLevel');
    localStorage.removeItem('mathHighestLevel');
  }
  
  const handleStart = () => {
    playSound("ui", isSoundOn);
    setGameState("PLAYING");
  };

  if (isLoading || !puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Puzzle...</p>
      </div>
    );
  }
  
  const hint = getHint(puzzle);
  const puzzleConfig = getMathPuzzleConfig(level);

  const solutionBoard = {
    ...puzzle,
    board: puzzle.correctSolution.map((val, i) => {
      const originalTile = puzzle.board.find((t, ti) => solutionValuesMatch(t.value, val) && t.isLocked) || puzzle.board[i];
      return { value: val, isLocked: originalTile.isLocked };
    })
  };

  function solutionValuesMatch(a: TileValue, b: TileValue) {
    if (a === null || b === null) return false;
    return a === b;
  }

  return (
    <Card
        className="
            w-full max-w-lg border shadow-2xl rounded-2xl transition-all duration-500
            bg-card
            bg-[radial-gradient(circle_at_top,_#DBE9FFF,_#FFE0F7_45%,_#E0F2FF_85%)]
            dark:bg-[radial-gradient(circle_at_top,_#1F2933,_#111827_55%,_#020617_100%)]
        "
    >
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative transition-all duration-300">
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'READY' ? 'opacity-100' : 'opacity-0 invisible')}>
            <BrainCircuit className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">Level {level + 1}</CardTitle>
            <CardDescription
                className="
                mt-2 text-base text-muted-foreground
                "
            >
                {puzzleConfig.description}
            </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "PLAYING" || gameState === "FAILED") ? 'opacity-100' : 'opacity-0 invisible')}>
            <CardTitle className="text-2xl font-semibold font-headline">
              Swap two numbers to solve the equation.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have {MAX_MISTAKES - mistakeCount + 1} chance remaining.
            </CardDescription>
            {level >= 3 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mx-auto mt-2">
                    <Info className="mr-2 h-4 w-4" /> Hint
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline">Hint for Level {level + 1}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                       <div className="text-left text-base p-4 rounded-lg mt-2 bg-yellow-100/70 dark:bg-yellow-900/40 border border-yellow-200/70 dark:border-yellow-700/60">
                         {hint}
                       </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {gameState === 'FAILED' && <p className="text-error animate-pulse pt-2">Not quite! That wasn't the correct swap.</p>}
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "SOLVED_VISUALIZING" || gameState === "SOLVED_COMPLETE") ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="flex justify-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden">
                <Image src="/logo.png" alt="Puzzle Solved" width={64} height={64} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Puzzle Solved!
            </CardTitle>
        </div>

        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'GAME_OVER' ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="flex justify-center w-16 h-16 mx-auto">
                <Image src="/logo.png" alt="Game Over" width={64} height={64} className="object-contain"/>
              </div>
              <CardTitle className="text-3xl font-bold pt-4 font-headline">
                Game Over
              </CardTitle>
              <CardDescription className="text-muted-foreground px-4">
                You reached level {level + 1}. Here's the solution.
              </CardDescription>
        </div>

      </CardHeader>
      <CardContent className={cn("flex items-center justify-center min-h-[128px] transition-opacity duration-500", (gameState === 'READY' || isLoading) ? 'opacity-0' : 'opacity-100')}>
        { (gameState === 'PLAYING' || gameState === 'FAILED' || gameState === 'SOLVED_VISUALIZING') && (
            <PuzzleBoard
              key={puzzle.id}
              puzzle={puzzle}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={gameState !== 'PLAYING'}
            />
        )}
        {gameState === 'GAME_OVER' && (
            <PuzzleBoard
                key={`${puzzle.id}-solution`}
                puzzle={solutionBoard}
                onSuccess={() => {}}
                onFail={() => {}}
                isReadOnly={true}
            />
        )}
         <AlertDialog open={gameState === 'SOLVED_COMPLETE'}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center text-center">
              <div className="flex justify-center pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden">
                    <Image src="/logo.png" alt="Puzzle Solved" width={64} height={64} />
                </div>
              </div>
              <AlertDialogTitle className="text-3xl font-bold font-headline">
                Level {level + 1} Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                Great job! You solved the equation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4">
                <Button
                  onClick={handleNextLevel}
                  size="lg"
                  className="w-full"
                >
                  Next Puzzle <ArrowRight className="ml-2" />
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[110px]">
        {gameState === 'READY' && (
             <div className="w-full text-center space-y-4">
                <Button onClick={handleStart} size="lg" className="w-full">
                    <Play className="mr-2" /> Start Puzzle
                </Button>
                <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
                    <Link href="/">Back to Main Menu</Link>
                </Button>
             </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'SOLVED_VISUALIZING') && (
            <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
                <Link href="/">Back to Home</Link>
            </Button>
        )}
        
        {gameState === 'FAILED' && (
           <div className="w-full text-center space-y-4">
            <Button onClick={handleTryAgain} size="lg" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Try Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
                <Link href="/">Back to Home</Link>
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER") && (
          <div className="w-full text-center space-y-4">
            <Button onClick={restartGame} size="lg" className="w-full">
              Play Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
        
        { (gameState === 'SOLVED_COMPLETE' ) && (
            <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
                <Link href="/">Back to Main Menu</Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
