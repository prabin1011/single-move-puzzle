
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import PuzzleBoard from "./puzzle-board";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { levels as initialLevels, generatePuzzle, type Level } from "@/lib/levels";
import { getLevelConfig } from "@/lib/game-config";
import {
  CheckCircle,
  ArrowRight,
  HeartCrack,
  Info,
  Play,
  Loader2,
  PartyPopper,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGameTimer } from "@/hooks/use-game-timer";
import { usePrefetchNextImages } from "@/hooks/use-prefetch-images";
import { playSound } from "@/lib/sounds";
import { useSound } from "@/contexts/sound-context";

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;
  const arr = [...array];

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}


const MAX_MISTAKES = 0; // Allows 0 mistakes, game over on the 1st.
const PREVIEW_TIME = 5; // 5 seconds to memorize

export default function GameContainer() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { isSoundOn } = useSound();

  const [gameState, setGameState] = useState<
    "READY" | "PREVIEW" | "PLAYING" | "SOLVED_VISUALIZING" | "SOLVED_COMPLETE" | "FAILED" | "GAME_OVER" | "ALL_LEVELS_COMPLETE"
  >("READY");
  const [showFacts, setShowFacts] = useState(false);
  
  const isTimerRunning = gameState === "PREVIEW";
  const { time, reset: resetTimer, stop: stopTimer } = useGameTimer(isTimerRunning);

  usePrefetchNextImages(levelIndex, levels);

  // Load progress and shuffled levels on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('currentLevelIndex');
    const savedHighestLevel = localStorage.getItem('highestLevel');
    const savedShuffledLevels = localStorage.getItem('shuffledLevels');

    if (savedShuffledLevels) {
      setLevels(JSON.parse(savedShuffledLevels));
    } else {
      // Fallback if the user lands here directly without starting a new game
      const newShuffledLevels = shuffle(initialLevels);
      setLevels(newShuffledLevels);
      localStorage.setItem('shuffledLevels', JSON.stringify(newShuffledLevels));
    }
    
    const initialIndex = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;
    
    setLevelIndex(initialIndex);
    setHighestLevel(initialHighest);
    setIsComponentLoading(false);
  }, []);
  
  // Save progress whenever level changes
  useEffect(() => {
    if (isComponentLoading) return;
    localStorage.setItem('currentLevelIndex', levelIndex.toString());
    if (levelIndex > highestLevel) {
      const newHighest = levelIndex;
      setHighestLevel(newHighest);
      localStorage.setItem('highestLevel', newHighest.toString());
    }
  }, [levelIndex, highestLevel, isComponentLoading]);

  const currentLevelData = useMemo(() => {
    if (isComponentLoading || levels.length === 0 || levelIndex >= levels.length) return null;
    return levels[levelIndex];
  }, [levelIndex, levels, isComponentLoading]);
  
  const { grid: currentGridSize } = getLevelConfig(levelIndex);

  // Generate the puzzle for the current level
  const currentPuzzle = useMemo(() => {
    if (!currentLevelData) return null;
    return generatePuzzle(currentLevelData.imageId, currentGridSize, retryCount);
  }, [currentLevelData, currentGridSize, retryCount]); // Rerun if level or retryCount changes

  // Game timer logic
  useEffect(() => {
    if (gameState === 'PREVIEW' && time >= PREVIEW_TIME) {
      stopTimer();
      setGameState('PLAYING');
    }
  }, [time, gameState, stopTimer]);

  // Play a gentle chime whenever preview starts
  useEffect(() => {
    if (gameState === "PREVIEW") {
      playSound("success", isSoundOn); // soft “preview started” chime
    }
  }, [gameState, isSoundOn]);


  if (isComponentLoading || !currentLevelData || !currentPuzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Game...</p>
      </div>
    );
  }

  const { imageUrl: currentImageUrl, hint, imageHint: currentImageHint, facts, solvedBoard } = currentPuzzle;
  const { scrambledBoard, swapped } = currentPuzzle;

  const handleSuccess = async () => {
    playSound('success', isSoundOn);
    setGameState("SOLVED_VISUALIZING");
    setTimeout(() => {
      if (levelIndex === levels.length - 1) {
        playSound('win', isSoundOn);
        setGameState("ALL_LEVELS_COMPLETE");
        localStorage.removeItem('currentLevelIndex');
        localStorage.removeItem('highestLevel');
      } else {
        setGameState("SOLVED_COMPLETE");
      }
      setTimeout(() => setShowFacts(true), 500);
    }, 1500);
  };

  const handleFail = () => {
    playSound('fail', isSoundOn);
    const newMistakeCount = mistakeCount + 1;
    setMistakeCount(newMistakeCount);
    if (newMistakeCount > MAX_MISTAKES) {
      setGameState("GAME_OVER");
      localStorage.removeItem('currentLevelIndex'); // Reset for next game
      localStorage.removeItem('highestLevel');
    } else {
      setGameState("FAILED");
    }
  };

  const resetForRetry = () => {
    playSound("click", isSoundOn);
    setMistakeCount(0); // Reset mistake count for the retry
    setRetryCount((prev) => prev + 1); // This will trigger puzzle regeneration via useMemo
    setGameState("PREVIEW"); // Go back to preview for another look
    resetTimer();
  };

  const restartGame = () => {
    playSound("click", isSoundOn);
    // This is the new "Play Again" logic
    // 1. Increment game round for new images
    const currentRound = parseInt(localStorage.getItem('gameRound') || '0', 10);
    localStorage.setItem('gameRound', (currentRound + 1).toString());

    // 2. Create and save a new shuffled list for the new game
    const newShuffledLevels = shuffle(initialLevels);
    localStorage.setItem('shuffledLevels', JSON.stringify(newShuffledLevels));
    setLevels(newShuffledLevels);

    // 3. Reset all game state
    setLevelIndex(0);
    setHighestLevel(0);
    setMistakeCount(0);
    setRetryCount(0);
    setShowFacts(false);
    
    // 4. Set the game state to ready for the new first level
    setGameState("READY");
  }

  const nextLevel = () => {
    playSound("click", isSoundOn);
    const newIndex = (levelIndex + 1);
    setLevelIndex(newIndex);
    setGameState("READY");
    setShowFacts(false);
    setRetryCount(0);
    setMistakeCount(0); // Reset mistakes for the new level
  };
  
  const handleStart = () => {
    playSound("click", isSoundOn);
    setGameState("PREVIEW");
    resetTimer();
  }

  const handleSkipPreview = () => {
    playSound("click", isSoundOn);
    setGameState("PLAYING");
  };

  const puzzleKey = `${currentLevelData.id}-${retryCount}`;

  return (
    <Card
      className="
        w-full max-w-sm border shadow-2xl rounded-2xl transition-all duration-500
        bg-card
        bg-[radial-gradient(circle_at_top,_#FFF9DB,_#FFE0F7_45%,_#E0F2FF_85%)]
        dark:bg-[radial-gradient(circle_at_top,_#1F2933,_#111827_55%,_#020617_100%)]
      "
    >
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative">
        {gameState === "READY" && (
            <>
                <CardTitle className="text-3xl font-bold font-headline">
                  {currentLevelData.place}
                </CardTitle>
                <CardDescription
                  className="
                    mt-3 inline-flex items-center justify-center
                    rounded-full px-3 py-1
                    text-[11px] font-semibold uppercase tracking-wide
                    bg-blue-100 text-primary border border-blue-200
                    dark:bg-secondary/90 dark:border-transparent
                  "
                >
                  Level {levelIndex + 1} • {currentGridSize}x{currentGridSize} Grid
                </CardDescription>
                <CardDescription className="text-muted-foreground pt-3">
                  Click Start to memorize the image.
                </CardDescription>
            </>
        )}
        {gameState === "PREVIEW" && (
          <>
             <div className="absolute top-4 right-4">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <p className="text-lg font-bold text-secondary-foreground">
                    {PREVIEW_TIME - time}
                  </p>
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
                    <circle
                        className="stroke-current text-primary/20"
                        strokeWidth="4"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                    />
                    <circle
                        className="stroke-current text-primary"
                        strokeWidth="4"
                        strokeDasharray={`${((PREVIEW_TIME - time) / PREVIEW_TIME) * 100}, 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                    />
                  </svg>
                </div>
            </div>
            <CardTitle className="text-3xl font-bold font-headline">
              Memorize!
            </CardTitle>
            <CardDescription
              className="
                mt-2 inline-flex items-center justify-center
                rounded-full px-3 py-1
                text-[11px] font-semibold uppercase tracking-wide
                bg-blue-100 text-primary border border-blue-200
                dark:bg-secondary/90 dark:border-transparent
              "
            >
              Level {levelIndex + 1} • {currentGridSize}x{currentGridSize} Grid
            </CardDescription>
            <CardDescription className="text-muted-foreground pt-2">
              The timer has started. Memorize the image.
            </CardDescription>
          </>
        )}
        {(gameState === "PLAYING" || gameState === "FAILED") && (
          <>
            <CardTitle className="text-2xl font-semibold font-headline">
              Find the two swapped pieces.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have {MAX_MISTAKES - mistakeCount + 1} chance remaining.
            </CardDescription>
            {levelIndex >= 2 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mx-auto mt-2">
                    <Info className="mr-2 h-4 w-4" /> Hint
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline">Hint for {currentLevelData.place}</AlertDialogTitle>
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
          </>
        )}
        {gameState === "SOLVED_VISUALIZING" && (
          <>
            <div className="flex justify-center text-success">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Puzzle Solved!
            </CardTitle>
          </>
        )}
        
        {gameState === "GAME_OVER" && (
            <>
              <div className="flex justify-center text-error">
                <HeartCrack className="h-16 w-16" />
              </div>
              <CardTitle className="text-3xl font-bold pt-4 font-headline">
                Game Over
              </CardTitle>
              <CardDescription className="text-muted-foreground px-4">
                You reached level {levelIndex + 1}. Every master was once a beginner. Try again!
              </CardDescription>
            </>
        )}
        {gameState === "ALL_LEVELS_COMPLETE" && (
          <>
            <div className="flex justify-center text-yellow-400">
              <PartyPopper className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4 font-headline">
              Congratulations!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have completed all {levels.length} levels!
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 sm:gap-6 px-2 sm:px-6">
        {(gameState === "READY" || gameState === "PREVIEW") && (
          <div className="relative w-full max-w-[300px] aspect-square rounded-lg overflow-hidden shadow-lg border-2 flex items-center justify-center">
            <Image
              key={currentImageUrl}
              src={currentImageUrl}
              alt={currentLevelData.place}
              fill
              sizes="(max-width: 640px) 90vw, 300px"
              data-ai-hint={currentImageHint}
              className={cn(
                  "object-cover transition-all duration-500",
                  gameState === "READY" && "blur-md scale-110",
              )}
            />
          </div>
        )}

        {(gameState === "PLAYING" || gameState === "FAILED" || gameState === "SOLVED_VISUALIZING") && (
          <PuzzleBoard
            key={puzzleKey}
            imageUrl={currentImageUrl}
            grid={currentGridSize}
            boardState={gameState === 'SOLVED_VISUALIZING' ? solvedBoard : scrambledBoard}
            swappedIndices={swapped}
            onSuccess={handleSuccess}
            onFail={handleFail}
            isReadOnly={gameState !== "PLAYING"}
          />
        )}
        
        <AlertDialog open={gameState === 'SOLVED_COMPLETE'}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center text-center">
              <div className="flex justify-center text-success pb-4">
                <CheckCircle className="h-16 w-16" />
              </div>
              <AlertDialogTitle className="text-3xl font-bold font-headline">
                Level {levelIndex + 1} Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-muted-foreground !mt-2">
                Well done! You found the swaps for {currentLevelData.place}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div
              className={cn(
                "transition-opacity duration-500 w-full pt-4 max-h-64 overflow-y-auto",
                showFacts ? "opacity-100" : "opacity-0"
              )}
            >
              <ul className="space-y-3 text-left text-sm sm:text-base">
                {facts.map((fact, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-secondary rounded-md"
                  >
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary-foreground">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            <AlertDialogFooter className="pt-4">
                <Button
                  onClick={nextLevel}
                  size="lg"
                  className="
                    w-full
                    bg-gradient-to-r from-[#0A84FF] via-[#2F6BFF] to-[#9B5CFF]
                    text-white shadow-md shadow-blue-200
                    hover:brightness-110 hover:shadow-lg
                    active:scale-[0.98] transition
                  "
                >
                  Next Puzzle <ArrowRight className="ml-2" />
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        
        {(gameState === "GAME_OVER") && (
            <div className="text-center">
                <p>You successfully completed {levelIndex} {levelIndex === 1 ? 'level' : 'levels'}.</p>
            </div>
        )}
        
        {(gameState === "ALL_LEVELS_COMPLETE") && (
          <div className="text-center">
            <p>You're a true world explorer!</p>
            <p>Thanks for playing.</p>
          </div>
        )}

      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[110px] relative">
        {gameState === "READY" && (
          <div className="w-full text-center space-y-4">
            <Button
              onClick={handleStart}
              size="lg"
              className="
                w-full
                bg-gradient-to-r from-[#FFD447] via-[#FF8A3D] to-[#FF4EC7]
                text-white shadow-lg shadow-orange-200
                hover:brightness-110 hover:shadow-xl
                active:scale-[0.98] transition
              "
            >
              <Play className="mr-2" /> Start Puzzle
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground"
              onClick={() => playSound("click", isSoundOn)}
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
        
        {gameState === "PREVIEW" && (
          <Button
            onClick={handleSkipPreview}
            size="lg"
            className="
              w-full
              bg-gradient-to-r from-[#34C759] to-[#0A84FF]
              text-white shadow-md shadow-sky-200
              hover:brightness-110 hover:shadow-lg
              active:scale-[0.98] transition
            "
          >
            Skip Preview
          </Button>
        )}

        {gameState === 'PLAYING' && (
             <Button
                asChild
                variant="link"
                className="text-muted-foreground"
                onClick={() => playSound("click", isSoundOn)}
              >
                <Link href="/">Back to Home</Link>
              </Button>
        )}
        
        {gameState === "FAILED" && (
           <div className="w-full text-center space-y-4">
            <Button
              onClick={resetForRetry}
              size="lg"
              className="
                w-full
                bg-gradient-to-r from-[#FF9F0A] to-[#FF375F]
                text-white shadow-md shadow-rose-200
                hover:brightness-110 hover:shadow-lg
                active:scale-[0.98] transition
              "
            >
              Try Again
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground"
              onClick={() => playSound("click", isSoundOn)}
            >
              <Link href="/">Back to Home</Link>
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER" || gameState === "ALL_LEVELS_COMPLETE") && (
          <div className="w-full text-center space-y-4">
            <Button
              onClick={restartGame}
              size="lg"
              className="
                w-full
                bg-gradient-to-r from-[#34C759] to-[#0A84FF]
                text-white shadow-md shadow-emerald-200
                hover:brightness-110 hover:shadow-lg
                active:scale-[0.98] transition
              "
            >
              Play Again
            </Button>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground"
              onClick={() => playSound("click", isSoundOn)}
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}

      </CardFooter>
    </Card>
  );
}
