
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
import { generatePuzzle, getWordSwapLevelConfig, type WordSwapPuzzle, wordSwapLevels, bankSynEasy, bankSynVerbs, bankSynEmotion, bankAntBasic, bankAntEmotion, bankAntAbstract, bankCategoryObjects, bankCategoryTimePlace, bankCategoryAbstract, bankPlural, bankPastTense, bankNounAdj, bankAnalogy, bankFunction, bankAnalogyHard } from '@/lib/word-swap-puzzles';
import PuzzleBoard from './puzzle-board';
import { Loader2, RefreshCw, Info, Play, ArrowRight, PartyPopper, BookText } from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type GameState = 'READY' | 'PLAYING' | 'SOLVED_VISUALIZING' | 'SOLVED_COMPLETE' | 'FAILED' | 'GAME_OVER' | 'ALL_LEVELS_COMPLETE';

const MAX_MISTAKES = 0; // Game over on first mistake
const TOTAL_LEVELS = 100; // Updated to 100 levels

export default function GameContainer() {
  const [level, setLevel] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('READY');
  const [puzzle, setPuzzle] = useState<WordSwapPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { isSoundOn } = useSound();
  const [currentHint, setCurrentHint] = useState('');

  const loadPuzzle = (currentLevel: number, retries: number) => {
    setIsLoading(true);
    const newPuzzle = generatePuzzle(currentLevel, retries);
    setPuzzle(newPuzzle);
    
    // Set hint for the new puzzle
    const config = getWordSwapLevelConfig(currentLevel);
    const hints = [
      config.hint,
      `One of the swapped words is related to "${newPuzzle.pairs[0].left}".`,
      `The relationship you're looking for is: ${config.relation.replace('_', ' ')}.`,
    ];
    setCurrentHint(hints[retries % hints.length]);

    setIsLoading(false);
  };
  
  // Load progress on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('wordSwapCurrentLevel');
    const savedHighestLevel = localStorage.getItem('wordSwapHighestLevel');
    
    const initialLevel = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;

    if (savedLevel) {
        trackEvent('game_continue', { game: 'word-swap', level: initialLevel });
    }

    setLevel(initialLevel);
    setHighestLevel(initialHighest);
    loadPuzzle(initialLevel, 0); 
  }, []);

  // Save progress whenever level changes
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('wordSwapCurrentLevel', level.toString());
    if (level > highestLevel) {
      const newHighest = level;
      setHighestLevel(newHighest);
      localStorage.setItem('wordSwapHighestLevel', newHighest.toString());
    }
  }, [level, highestLevel, isLoading]);
  
  useEffect(() => {
    loadPuzzle(level, retryCount);
  }, [level, retryCount]);


  const handleSuccess = () => {
    playSound('success', isSoundOn);
    setGameState('SOLVED_VISUALIZING');
    trackEvent('game_level_complete', { game: 'word-swap', level: level + 1 });
    setTimeout(() => {
        if (level >= TOTAL_LEVELS - 1) { 
            playSound('win', isSoundOn);
            trackEvent('game_all_levels_complete', { game: 'word-swap' });
            setGameState('ALL_LEVELS_COMPLETE');
            localStorage.removeItem('wordSwapCurrentLevel');
            localStorage.removeItem('wordSwapHighestLevel');
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
      trackEvent('game_over', { game: 'word-swap', level: level + 1 });
      setGameState("GAME_OVER");
      localStorage.removeItem('wordSwapCurrentLevel');
      localStorage.removeItem('wordSwapHighestLevel');
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
    trackEvent('puzzle_retry', { game: 'word-swap', level: level + 1 });
    setMistakeCount(0);
    setRetryCount(prev => prev + 1);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    playSound("ui", isSoundOn);
    trackEvent('game_start_new', { game: 'word-swap' });
    setLevel(0);
    setHighestLevel(0);
    setMistakeCount(0);
    setRetryCount(0);
    setGameState("READY");
    loadPuzzle(0, 0);
    localStorage.removeItem('wordSwapCurrentLevel');
    localStorage.removeItem('wordSwapHighestLevel');
  }
  
  const handleStart = () => {
    playSound("ui", isSoundOn);
    trackEvent('puzzle_start', { game: 'word-swap', level: level + 1 });
    setGameState("PLAYING");
  };
  
  const handleViewHint = () => {
    trackEvent('hint_viewed', { game: 'word-swap', level: level + 1 });
  };
  
  const handleBackToHome = () => {
    playSound("ui", isSoundOn);
    trackEvent('navigate_to_home');
  }

  if (isLoading || !puzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Word Puzzle...</p>
      </div>
    );
  }
  
  const puzzleConfig = getWordSwapLevelConfig(level);

  return (
    <Card
        className="
            w-full max-w-lg border shadow-2xl rounded-2xl transition-all duration-500
            bg-card
            bg-[radial-gradient(circle_at_top,_#E0F2FF,_#FFE0F7_55%,_#FFF9DB_100%)]
            dark:bg-[radial-gradient(circle_at_top,_#111827,_#020617_60%,_#1F2933_100%)]
        "
    >
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative transition-all duration-300">
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center space-y-2", gameState === 'READY' ? 'opacity-100' : 'opacity-0 invisible')}>
            <BookText className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">Level {level + 1}: {puzzleConfig.concept}</CardTitle>
            <CardDescription className="mt-1 text-base text-muted-foreground">
                Find the two swapped words to fix the relationships.
            </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "PLAYING" || gameState === "FAILED") ? 'opacity-100' : 'opacity-0 invisible')}>
            <CardTitle className="text-2xl font-semibold font-headline">
              Find the two swapped words.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Swap them to restore the meaning.
            </CardDescription>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mx-auto mt-2" onClick={handleViewHint}>
                  <Info className="mr-2 h-4 w-4" /> Hint
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline">Hint for Level {level + 1}</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                      <div className="text-left text-base p-4 rounded-lg mt-2 bg-yellow-100/70 dark:bg-yellow-900/40 border border-yellow-200/70 dark:border-yellow-700/60">
                        {currentHint}
                      </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            {gameState === 'FAILED' && <p className="text-error animate-pulse pt-2">That wasn't the correct swap. Try again.</p>}
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", (gameState === "SOLVED_VISUALIZING") ? 'opacity-100' : 'opacity-0 invisible')}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden">
                <Image src="/logo.png" alt="Logic Restored" width={64} height={64} />
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Logic Restored!
            </CardTitle>
        </div>

        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'GAME_OVER' ? 'opacity-100' : 'opacity-0 invisible')}>
              <CardTitle className="text-3xl font-bold pt-4 font-headline">
                The Logic Was...
              </CardTitle>
              <CardDescription className="text-muted-foreground px-4 mt-2 text-sm">
                {puzzle.rule}
              </CardDescription>
        </div>
        
        <div className={cn("transition-opacity duration-300 absolute inset-0 p-6 flex flex-col justify-center", gameState === 'ALL_LEVELS_COMPLETE' ? 'opacity-100' : 'opacity-0 invisible')}>
            <PartyPopper className="h-12 w-12 mx-auto text-yellow-400" />
            <CardTitle className="text-3xl font-bold font-headline mt-2">All Levels Complete!</CardTitle>
            <CardDescription className="mt-2 text-base text-muted-foreground">
                You are a true word wizard!
            </CardDescription>
        </div>
      </CardHeader>

      <CardContent className={cn("flex flex-col items-center justify-center min-h-[200px] transition-opacity duration-500 px-4 sm:px-6")}>
        { gameState === 'READY' && (
             <div className="flex justify-center items-center gap-2 text-primary/30 dark:text-primary/20 text-lg font-mono">
                <span className="opacity-50">word</span>
                <span className="text-xl">↔</span>
                <span className="opacity-80">pair</span>
                <span className="text-2xl rotate-12 opacity-50">≠</span>
                <span className="opacity-60">logic</span>
                <span className="text-xl">↔</span>
                <span>swap</span>
            </div>
        )}
        { (gameState === 'PLAYING' || gameState === 'FAILED' || gameState === 'SOLVED_VISUALIZING') && (
            <PuzzleBoard
              key={puzzle.id}
              puzzle={puzzle}
              onSuccess={handleSuccess}
              onFail={handleFail}
              isReadOnly={gameState !== 'PLAYING'}
              relationType={puzzleConfig.relation}
            />
        )}
        {gameState === 'GAME_OVER' && (
            <PuzzleBoard
                key={`${puzzle.id}-solution`}
                puzzle={{
                  ...puzzle,
                  pairs: puzzle.pairs.map((p, i) => {
                    const originalBank = wordSwapLevels.find(l => l.level === level + 1)?.bankId;
                    const allBanks: Record<string, { pairs: { left: string, right: string }[] }> = {
                        'syn_easy': bankSynEasy, 'syn_verbs': bankSynVerbs,
                        'syn_emotion': bankSynEmotion, 'ant_basic': bankAntBasic,
                        'ant_emotion': bankAntEmotion, 'ant_abstract': bankAntAbstract,
                        'cat_objects': bankCategoryObjects, 'cat_time_place': bankCategoryTimePlace,
                        'cat_abstract': bankCategoryAbstract, 'plural_forms': bankPlural,
                        'past_tense': bankPastTense, 'noun_adj': bankNounAdj,
                        'analogy_basic': bankAnalogy, 'function': bankFunction,
                        'analogy_hard': bankAnalogyHard,
                    };
                    const correctPair = allBanks[originalBank!]?.pairs.find(bp => bp.left === p.left);
                    return { left: p.left, right: correctPair?.right || '???' };
                  })
                }}
                onSuccess={() => {}}
                onFail={() => {}}
                isReadOnly={true}
                relationType={puzzleConfig.relation}
                showSolution={true}
            />
        )}
         <AlertDialog open={gameState === 'SOLVED_COMPLETE'}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center text-center">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden mb-4">
                  <Image src="/logo.png" alt="Level Complete" width={64} height={64} />
              </div>
              <AlertDialogTitle className="text-3xl font-bold font-headline">
                Level {level + 1} Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                Excellent! You fixed the word pairs.
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
        
        {gameState === "FAILED" && (
           <div className="w-full text-center space-y-4">
            <Button onClick={handleTryAgain} size="lg" className="w-full" variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
              <Link href="/">Back to Home</Link>
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER" || gameState === "ALL_LEVELS_COMPLETE") && (
          <div className="w-full text-center space-y-4">
            <Button onClick={restartGame} size="lg" className="w-full">
              Play Again
            </Button>
            <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
        
        { (gameState === 'SOLVED_COMPLETE' ) && (
            <Button asChild variant="link" className="text-muted-foreground" onClick={handleBackToHome}>
                <Link href="/">Back to Home</Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
