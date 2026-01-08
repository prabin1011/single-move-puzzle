

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
import { useRouter } from 'next/navigation';
import { generatePuzzle, getHint, type MathPuzzle, getMathPuzzleConfig, mathLevels } from '@/lib/math-puzzles';
import PuzzleBoard from '../puzzle-board';
import { Loader2, RefreshCw, Info, Play, ArrowRight, PartyPopper, BrainCircuit, Plus, Minus, X, Divide } from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import type { TileValue } from '@/lib/math-puzzles';
import { trackEvent } from '@/lib/analytics';
import { useGameTimer } from "@/hooks/use-game-timer";
import { getTodaysDateKey } from '@/lib/daily-challenge';
import { DailyLeaderboard } from '@/components/daily-leaderboard';

type GameState = 'READY' | 'PLAYING' | 'SOLVED_VISUALIZING' | 'SOLVED_COMPLETE' | 'FAILED' | 'GAME_OVER' | 'ALL_LEVELS_COMPLETE';

const MAX_MISTAKES = 0; // Game over on first mistake

interface GameContainerProps {
  isDailyChallenge?: boolean;
  dailyLevel?: number;
  puzzleSeed?: string;
}

export default function GameContainer({ isDailyChallenge = false, dailyLevel = 0, puzzleSeed = '0' }: GameContainerProps) {
  const router = useRouter();
  const [level, setLevel] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('READY');
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { isSoundOn } = useSound();
  const { time, reset: resetTimer, getDuration } = useGameTimer(gameState === 'PLAYING');
  const [showAlreadyCompleted, setShowAlreadyCompleted] = useState(false);

  // Load progress on mount
  useEffect(() => {
    if (isDailyChallenge) {
        const todayKey = getTodaysDateKey();
        if (localStorage.getItem(`dailyChallengeCompletion:${todayKey}`) === "1") {
            setShowAlreadyCompleted(true);
            setIsLoading(false);
            return;
        }
        const safeDaily = Math.max(0, Math.min(dailyLevel, mathLevels.length - 1));
        setLevel(safeDaily);
    } else {
        const savedLevel = localStorage.getItem('mathCurrentLevel');
        const savedHighestLevel = localStorage.getItem('mathHighestLevel');
        
        const initialLevel = savedLevel ? parseInt(savedLevel, 10) : 0;
        const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;

        if (savedLevel) {
            trackEvent('math_continue', { level: initialLevel });
        }

        setLevel(initialLevel);
        setHighestLevel(initialHighest);
    }
    setIsLoading(false);
  }, [isDailyChallenge, dailyLevel]);

  // Save progress whenever level changes
  useEffect(() => {
    if (isLoading || isDailyChallenge) return;
    localStorage.setItem('mathCurrentLevel', level.toString());
    if (level > highestLevel) {
      const newHighest = level;
      setHighestLevel(newHighest);
      localStorage.setItem('mathHighestLevel', newHighest.toString());
    }
  }, [level, highestLevel, isLoading, isDailyChallenge]);
  
  const puzzle = useMemo(() => {
    const currentLevel = isDailyChallenge ? dailyLevel : level;
    let seed = isDailyChallenge && puzzleSeed ? puzzleSeed : `${retryCount}`;
    return generatePuzzle(currentLevel, seed);
  }, [level, retryCount, dailyLevel, isDailyChallenge, puzzleSeed]);


  const handleSuccess = () => {
    playSound('success', isSoundOn);
    setGameState('SOLVED_VISUALIZING');
    const duration = getDuration();
    trackEvent('game_level_complete', { game: 'math', level: level + 1 });

    if (isDailyChallenge) {
        const todayKey = getTodaysDateKey();
        localStorage.setItem(`dailyChallengeCompletion:${todayKey}`, "1");
        // TODO: Save score
    }

    setTimeout(() => {
        // There are 50 levels, indexed 0-49
        if (level >= mathLevels.length - 1 && !isDailyChallenge) { 
            playSound('win', isSoundOn);
            trackEvent('game_all_levels_complete', { game: 'math' });
            setGameState('ALL_LEVELS_COMPLETE');
            localStorage.removeItem('mathCurrentLevel');
            localStorage.removeItem('mathHighestLevel');
        } else {
            setGameState('SOLVED_COMPLETE');
        }
    }, 1500);
  };

  const handleFail = () => {
    playSound('fail', isSoundOn);
    trackEvent('game_level_fail', { game: 'math', level: level + 1 });

    if (isDailyChallenge) {
        const todayKey = getTodaysDateKey();
        localStorage.setItem(`dailyChallengeCompletion:${todayKey}`, "1");
        setGameState("GAME_OVER");
    } else {
        const newMistakeCount = mistakeCount + 1;
        setMistakeCount(newMistakeCount);
        if (newMistakeCount > MAX_MISTAKES) {
          trackEvent('game_over', { game: 'math', level: level + 1 });
          setGameState("GAME_OVER");
          localStorage.removeItem('mathCurrentLevel');
          localStorage.removeItem('mathHighestLevel');
        } else {
          setGameState("FAILED");
        }
    }
  };

  const handleNextLevel = () => {
    if (isDailyChallenge) return;
    playSound('ui', isSoundOn);
    setMistakeCount(0);
    setRetryCount(0);
    setLevel(prev => prev + 1);
    setGameState('READY');
  };
  
  const handleTryAgain = () => {
    playSound('ui', isSoundOn);
    trackEvent('puzzle_retry', { game: 'math', level: level + 1 });
    setMistakeCount(0);
    setRetryCount(prev => prev + 1);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    playSound("ui", isSoundOn);
    trackEvent('math_start_new');
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
    trackEvent('puzzle_start', { game: 'math', level: level + 1 });
    setGameState("PLAYING");
    resetTimer();
  };

  const handleViewHint = () => {
    trackEvent('hint_viewed', { game: 'math', level: level + 1 });
  }

  const handleBackToHome = () => {
    playSound("ui", isSoundOn);
    router.push('/');
    trackEvent('navigate_to_home');
  }

  const effectiveLevel = isDailyChallenge ? dailyLevel : level;

  if (isLoading || !puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Puzzle...</p>
      </div>
    );
  }

    if (showAlreadyCompleted) {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader className="items-center text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary overflow-hidden mb-4">
                        <Image src="/logo.png" alt="One Move Puzzle Logo" width={64} height={64} />
                    </div>
                    <AlertDialogTitle>Challenge Already Completed</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've already solved or attempted today's challenge. Come back tomorrow for a new one!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Link href="/">Back to Home</Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
  }
  
  const hint = getHint(puzzle, effectiveLevel);
  const puzzleConfig = getMathPuzzleConfig(effectiveLevel);

  const solutionBoard = {
    ...puzzle,
    board: puzzle.correctSolution.map((val) => {
      const isLocked = val === '=';
      return { value: val, isLocked: isLocked };
    })
  };

  const title = isDailyChallenge ? 'Daily Challenge' : `Level ${effectiveLevel + 1}`;

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
            <CardTitle className="text-3xl font-bold font-headline mt-4">{title}: {puzzleConfig.description}</CardTitle>
            <CardDescription
                className="
                mt-2 text-base text-muted-foreground
                "
            >
                Press Start to begin the challenge.
            </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "PLAYING" || gameState === "FAILED") ? 'opacity-100' : 'opacity-0 invisible')}>
            <CardTitle className="text-2xl font-semibold font-headline">
              Swap two tiles to solve the equation.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have {isDailyChallenge ? 1 : (MAX_MISTAKES - mistakeCount + 1)} chance remaining.
            </CardDescription>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mx-auto mt-2" onClick={handleViewHint}>
                  <Info className="mr-2 h-4 w-4" /> Hint
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline">Hint for {title}</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                      <div className="text-left text-base p-4 rounded-lg mt-2 bg-yellow-100/70 dark:bg-yellow-900/40 border border-yellow-200/70 dark:border-yellow-700/60">
                        {hint}
                      </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            {gameState === 'FAILED' && <p className="text-error animate-pulse pt-2">Not quite! That wasn't the correct swap.</p>}
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "SOLVED_VISUALIZING") ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden">
                <Image src="/logo.png" alt="Puzzle Solved" width={64} height={64} />
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Puzzle Solved!
            </CardTitle>
        </div>

        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'GAME_OVER' ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive overflow-hidden mb-2">
                <Image src="/logo.png" alt="Game Over" width={64} height={64} style={{ borderRadius: '50%' }}/>
            </div>
              <CardTitle className="text-3xl font-bold pt-2 font-headline">
                Game Over
              </CardTitle>
              <CardDescription className="text-muted-foreground px-4 text-sm">
                 Here is the correct solution.
              </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'ALL_LEVELS_COMPLETE' ? 'opacity-100' : 'opacity-0 invisible')}>
            <PartyPopper className="h-12 w-12 mx-auto text-yellow-400" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">All Levels Complete!</CardTitle>
            <CardDescription
                className="
                mt-2 text-base text-muted-foreground
                "
            >
                You are a math wizard! Congratulations!
            </CardDescription>
        </div>


      </CardHeader>
      <CardContent className={cn("flex items-center justify-center min-h-[128px] transition-opacity duration-500 px-2 sm:px-4")}>
        { (gameState === 'PLAYING' || gameState === 'FAILED' || gameState === 'SOLVED_VISUALIZING') && (
            <PuzzleBoard
              key={puzzle.id}
              puzzle={puzzle}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={gameState !== 'PLAYING'}
            />
        )}
        {gameState === 'GAME_OVER' && !isDailyChallenge && (
            <PuzzleBoard
                key={`${puzzle.id}-solution`}
                puzzle={solutionBoard}
                onSuccess={() => {}}
                onFail={() => {}}
                isReadOnly={true}
                showSolution={true}
            />
        )}
        { gameState === 'READY' && (
            <div className="flex justify-center items-center gap-4 text-primary/50">
              <Plus className="h-8 w-8" />
              <Minus className="h-8 w-8" />
              <X className="h-8 w-8" />
              <Divide className="h-8 w-8" />
            </div>
        )}
         <AlertDialog open={gameState === 'SOLVED_COMPLETE'}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden mb-4">
                  <Image src="/logo.png" alt="Level Complete" width={64} height={64} />
              </div>
              <AlertDialogTitle className="text-3xl font-bold font-headline">
                {isDailyChallenge ? "Challenge Complete!" : `Level ${effectiveLevel + 1} Complete!`}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                {isDailyChallenge ? `You solved it in ${getDuration()} seconds!` : "Great job! You solved the equation."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 flex flex-col gap-2">
                {isDailyChallenge ? (
                    <>
                        <DailyLeaderboard date={getTodaysDateKey()} currentUserTime={getDuration()} />
                        <Button asChild size="lg" className="w-full">
                            <Link href="/" onClick={handleBackToHome}>Back to Home</Link>
                        </Button>
                    </>
                ) : (
                    <Button
                    onClick={handleNextLevel}
                    size="lg"
                    className="w-full"
                    >
                    Next Puzzle <ArrowRight className="ml-2" />
                    </Button>
                )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={gameState === 'GAME_OVER' && isDailyChallenge}>
            <AlertDialogContent>
                <AlertDialogHeader className="items-center text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive overflow-hidden mb-4">
                        <Image src="/logo.png" alt="Game Over" width={64} height={64} style={{ borderRadius: '50%' }} />
                    </div>
                    <AlertDialogTitle className="text-3xl font-bold font-headline">Better Luck Tomorrow!</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                        That was a tough one. Come back tomorrow for a new challenge!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-4 flex flex-col gap-2">
                    <DailyLeaderboard date={getTodaysDateKey()} />
                    <Button asChild size="lg" className="w-full">
                        <Link href="/" onClick={handleBackToHome}>Back to Home</Link>
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
                <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
                    <Link href="/">Back to Home</Link>
                </Button>
             </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'SOLVED_VISUALIZING') && (
            <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
                <Link href="/">Back to Home</Link>
            </Button>
        )}
        
        {gameState === "FAILED" && !isDailyChallenge && (
           <div className="w-full text-center space-y-4">
            <Button
              onClick={handleTryAgain}
              size="lg"
              className="
                w-full
                bg-gradient-to-r from-[#FF9F0A] to-[#FF375F]
                text-white shadow-md shadow-rose-200
                hover:brightness-110 hover:shadow-lg
                active:scale-[0.98] transition
              "
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground"
              onClick={handleBackToHome}
            >
              <Link href="/">Back to Home</Link>
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER" || gameState === "ALL_LEVELS_COMPLETE") && !isDailyChallenge && (
          <div className="w-full text-center space-y-4">
            <Button onClick={restartGame} size="lg" className="w-full">
              Play Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
        
      </CardFooter>
    </Card>
  );
}

    