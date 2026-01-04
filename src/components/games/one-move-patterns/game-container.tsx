
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
import { generatePatternPuzzle, getPatternPuzzleConfig, type PatternPuzzle } from '@/lib/pattern-puzzles';
import PuzzleBoard from './puzzle-board';
import { Loader2, RefreshCw, CheckCircle, Info, Play, ArrowRight, PartyPopper, Shapes } from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

type GameState = 'READY' | 'PLAYING' | 'SOLVED_VISUALIZING' | 'SOLVED_COMPLETE' | 'FAILED' | 'GAME_OVER' | 'ALL_LEVELS_COMPLETE';

const MAX_MISTAKES = 0; // Game over on first mistake
const TOTAL_LEVELS = 50;

export default function GameContainer() {
  const [level, setLevel] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('READY');
  const [puzzle, setPuzzle] = useState<PatternPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { isSoundOn } = useSound();

  const loadPuzzle = (currentLevel: number, retries: number) => {
    setIsLoading(true);
    const newPuzzle = generatePatternPuzzle(currentLevel, retries);
    setPuzzle(newPuzzle);
    setIsLoading(false);
  };
  
  // Load progress on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('patternCurrentLevel');
    const savedHighestLevel = localStorage.getItem('patternHighestLevel');
    
    const initialLevel = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;

    setLevel(initialLevel);
    setHighestLevel(initialHighest);
    loadPuzzle(initialLevel, 0); 
  }, []);

  // Save progress whenever level changes
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('patternCurrentLevel', level.toString());
    if (level > highestLevel) {
      const newHighest = level;
      setHighestLevel(newHighest);
      localStorage.setItem('patternHighestLevel', newHighest.toString());
    }
  }, [level, highestLevel, isLoading]);
  
  useEffect(() => {
    loadPuzzle(level, retryCount);
  }, [level, retryCount]);


  const handleSuccess = () => {
    playSound('success', isSoundOn);
    setGameState('SOLVED_VISUALIZING');
    setTimeout(() => {
        if (level >= TOTAL_LEVELS - 1) { 
            playSound('win', isSoundOn);
            setGameState('ALL_LEVELS_COMPLETE');
            localStorage.removeItem('patternCurrentLevel');
            localStorage.removeItem('patternHighestLevel');
        } else {
            setGameState('SOLVED_COMPLETE');
        }
    }, 1500);
  };

  const handleFail = () => {
    playSound('fail', isSoundOn);
    const newMistakeCount = mistakeCount + 1;
    setMistakeCount(newMistakeCount);
    if (newMistakeCount > MAX_MISTAKES) {
      setGameState("GAME_OVER");
      localStorage.removeItem('patternCurrentLevel');
      localStorage.removeItem('patternHighestLevel');
    } else {
      setGameState("FAILED");
    }
  };

  const handleNextLevel = () => {
    playSound('ui', isSoundOn);
    setMistakeCount(0);
    setRetryCount(0);
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
    loadPuzzle(0, 0);
    localStorage.removeItem('patternCurrentLevel');
    localStorage.removeItem('patternHighestLevel');
  }
  
  const handleStart = () => {
    playSound("ui", isSoundOn);
    setGameState("PLAYING");
  };

  if (isLoading || !puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Patterns...</p>
      </div>
    );
  }
  
  const puzzleConfig = getPatternPuzzleConfig(level);
  
  const solvedGrid = copyGrid(puzzle.grid);
  const [index1, index2] = puzzle.solution.indices;
  [solvedGrid[index1], solvedGrid[index2]] = [solvedGrid[index2], solvedGrid[index1]];


  return (
    <Card
        className="
            w-full max-w-sm border shadow-2xl rounded-2xl transition-all duration-500
            bg-card
            bg-[radial-gradient(circle_at_top,_#DBE9FFF,_#E0F2FF_45%,_#FFE0F7_85%)]
            dark:bg-[radial-gradient(circle_at_top,_#1F2933,_#020617_55%,_#111827_100%)]
        "
    >
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative transition-all duration-300">
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center space-y-2", gameState === 'READY' ? 'opacity-100' : 'opacity-0 invisible')}>
            <Shapes className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">Level {level + 1}: {puzzleConfig.concept}</CardTitle>
            <CardDescription className="mt-1 text-base text-muted-foreground">
                Find the one broken rule. Fix it in one move.
            </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "PLAYING" || gameState === "FAILED") ? 'opacity-100' : 'opacity-0 invisible')}>
            <CardTitle className="text-2xl font-semibold font-headline">
              Find the two tiles that break the pattern.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Swap them to restore the order.
            </CardDescription>
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
                        {puzzleConfig.hint}
                      </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            {gameState === 'FAILED' && <p className="text-error animate-pulse pt-2">Not quite! That wasn't the correct swap.</p>}
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "SOLVED_VISUALIZING") ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="flex justify-center text-success">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Pattern Restored!
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
                Here is the correct solution.
              </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'ALL_LEVELS_COMPLETE' ? 'opacity-100' : 'opacity-0 invisible')}>
            <PartyPopper className="h-12 w-12 mx-auto text-yellow-400" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">All Patterns Solved!</CardTitle>
            <CardDescription className="mt-2 text-base text-muted-foreground">
                You have a true eye for detail!
            </CardDescription>
        </div>
      </CardHeader>

      <CardContent className={cn("flex items-center justify-center min-h-[256px] transition-opacity duration-500 px-2 sm:px-4")}>
        { gameState === 'READY' && (
             <div className="transform scale-75 opacity-70">
                <PuzzleBoard
                    key={`${puzzle.id}-preview`}
                    puzzle={{ ...puzzle, grid: puzzle.correctGrid }}
                    isReadOnly={true}
                    onSuccess={() => {}}
                    onFail={() => {}}
                />
             </div>
        )}
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
                puzzle={{ ...puzzle, grid: solvedGrid }}
                onSuccess={() => {}}
                onFail={() => {}}
                isReadOnly={true}
            />
        )}
         <AlertDialog open={gameState === 'SOLVED_COMPLETE'}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center text-center">
               <div className="flex justify-center text-success pb-4">
                <CheckCircle className="h-16 w-16" />
              </div>
              <AlertDialogTitle className="text-3xl font-bold font-headline">
                Level {level + 1} Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                Excellent! You fixed the pattern.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4">
                <Button
                  onClick={handleNextLevel}
                  size="lg"
                  className="w-full"
                >
                  Next Pattern <ArrowRight className="ml-2" />
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
        
        {gameState === "FAILED" && (
           <div className="w-full text-center space-y-4">
            <Button onClick={handleTryAgain} size="lg" className="w-full" variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={() => playSound("ui", isSoundOn)}>
              <Link href="/">Back to Home</Link>
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER" || gameState === "ALL_LEVELS_COMPLETE") && (
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

// Helper to create a deep copy of a grid
function copyGrid(grid: any[]): any[] {
  return grid.map(tile => ({ ...tile }));
}

    