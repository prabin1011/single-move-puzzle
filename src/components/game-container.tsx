
"use client";

import { useState, useMemo, useEffect } from "react";
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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { levels as initialLevels, generatePuzzle, getImageUrl, type Level } from "@/lib/levels";
import { getLevelConfig } from "@/lib/game-config";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  HeartCrack,
  Info,
  Play,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useRouter } from "next/navigation";
import { usePrefetchNextImages } from "@/hooks/use-prefetch-images";


const MAX_MISTAKES = 1; // Allows 1 mistake, game over on the 2nd.
const PREVIEW_TIME = 5; // 5 seconds to memorize

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

export default function GameContainer() {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const [gameState, setGameState] = useState<
    "READY" | "PREVIEW" | "PLAYING" | "SOLVED" | "FAILED" | "GAME_OVER" | "ALL_LEVELS_COMPLETE"
  >("READY");
  const [showFacts, setShowFacts] = useState(false);
  
  const isTimerRunning = gameState === "PREVIEW";
  const { time, reset: resetTimer, stop: stopTimer } = useGameTimer(isTimerRunning);

  usePrefetchNextImages(levelIndex);

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
    // Pass the imageId to generatePuzzle
    return generatePuzzle(currentLevelData.imageId, currentGridSize);
  }, [currentLevelData, currentGridSize, retryCount]); // Rerun if level or retryCount changes

  // Game timer logic
  useEffect(() => {
    if (gameState === 'PREVIEW' && time >= PREVIEW_TIME) {
      stopTimer();
      setGameState('PLAYING');
    }
  }, [time, gameState, stopTimer]);


  if (isComponentLoading || !currentLevelData || !currentPuzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Game...</p>
      </div>
    );
  }

  const { scrambledBoard, swapped, imageUrl } = currentPuzzle;
  const { url: currentImageUrl, hint: currentImageHint } = getImageUrl(currentLevelData.imageId);


  const handleSuccess = async () => {
    // Check if this was the last level
    if (levelIndex === levels.length - 1) {
      setGameState("ALL_LEVELS_COMPLETE");
      localStorage.removeItem('currentLevelIndex');
      localStorage.removeItem('highestLevel');
    } else {
      setGameState("SOLVED");
    }
    setTimeout(() => setShowFacts(true), 500);
  };

  const handleFail = () => {
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
    setRetryCount((prev) => prev + 1); // This will trigger puzzle regeneration via useMemo
    setGameState("PREVIEW"); // Go back to preview for another look
    resetTimer();
  };

  const restartGame = () => {
    router.push('/');
  }

  const nextLevel = () => {
    const newIndex = (levelIndex + 1);
    setLevelIndex(newIndex);
    setGameState("READY");
    setShowFacts(false);
    setRetryCount(0);
    setMistakeCount(0); // Reset mistakes for the new level
  };
  
  const handleStart = () => {
    setGameState("PREVIEW");
    resetTimer();
  }

  const puzzleKey = `${currentLevelData.id}-${retryCount}`;

  return (
    <Card className="w-full max-w-sm bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative">
        {gameState === "READY" && (
            <>
                <CardTitle className="text-3xl font-bold">
                {currentLevelData.place}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                Level {levelIndex + 1} &bull; {currentGridSize}x{currentGridSize} Grid
                </CardDescription>
                <CardDescription className="text-muted-foreground pt-2">
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
            <CardTitle className="text-3xl font-bold">
              Memorize!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Level {levelIndex + 1} &bull; {currentGridSize}x{currentGridSize} Grid
            </CardDescription>
            <CardDescription className="text-muted-foreground pt-2">
              The timer has started. Memorize the image.
            </CardDescription>
          </>
        )}
        {(gameState === "PLAYING" || gameState === "FAILED") && (
          <>
            <CardTitle className="text-2xl font-semibold">
              Find the two swapped pieces.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have {MAX_MISTAKES - mistakeCount + 1} chance(s) remaining.
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
                    <AlertDialogTitle>Hint for {currentLevelData.place}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {currentLevelData.hint}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
        {gameState === "SOLVED" && (
          <>
            <div className="flex justify-center text-green-400">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">
              {currentLevelData.place}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {currentLevelData.country}
            </CardDescription>
          </>
        )}
        
        {gameState === "GAME_OVER" && (
            <>
              <div className="flex justify-center text-red-500">
                <HeartCrack className="h-16 w-16" />
              </div>
              <CardTitle className="text-3xl font-bold pt-4">
                Game Over
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                You reached level {levelIndex + 1}. Better luck next time!
              </CardDescription>
            </>
        )}
        {gameState === "ALL_LEVELS_COMPLETE" && (
          <>
            <div className="flex justify-center text-yellow-400">
              <PartyPopper className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">
              Congratulations!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have completed all {levels.length} levels!
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {(gameState === "READY" || gameState === "PREVIEW") && (
          <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg border-2 border-border flex items-center justify-center">
            <img
              key={currentImageUrl}
              src={currentImageUrl}
              alt={currentLevelData.place}
              width={300}
              height={300}
              data-ai-hint={currentImageHint}
              className={cn(
                  "object-cover transition-all duration-500",
                  "h-[300px] w-[300px]",
                  gameState === "READY" && "blur-md scale-110",
              )}
            />
          </div>
        )}

        {(gameState === "PLAYING" || gameState === "FAILED") && (
          <PuzzleBoard
            key={puzzleKey}
            imageUrl={imageUrl}
            grid={currentGridSize}
            boardState={scrambledBoard}
            swappedIndices={swapped}
            onSuccess={handleSuccess}
            onFail={handleFail}
            isReadOnly={gameState !== "PLAYING"}
          />
        )}

        {gameState === "SOLVED" && (
          <div className="flex flex-col items-center w-full">
            <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg mx-auto mb-6 border-2 border-green-400/50">
              <img
                src={currentImageUrl}
                alt={currentLevelData.place}
                width={300}
                height={300}
                data-ai-hint={currentImageHint}
                className="object-cover h-[300px] w-[300px]"
              />
            </div>
            <div
              className={cn(
                "transition-opacity duration-500 w-full",
                showFacts ? "opacity-100" : "opacity-0"
              )}
            >
              <ul className="space-y-3 text-left text-base">
                {currentLevelData.facts.map((fact, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-secondary rounded-md"
                  >
                    <span className="text-primary mt-1">✓</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {(gameState === "GAME_OVER") && (
            <div className="text-center">
                <p>You made too many mistakes.</p>
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

      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[110px]">
        {gameState === "READY" && (
            <Button onClick={handleStart} size="lg" className="w-full">
                <Play className="mr-2" /> Start Puzzle
            </Button>
        )}
        
        {gameState === "PREVIEW" && (
          <Button
            onClick={() => setGameState("PLAYING")}
            size="lg"
            className="w-full"
            variant="secondary"
          >
            Skip Preview
          </Button>
        )}
        
        {gameState === "FAILED" && (
           <div className="flex w-full space-x-2">
            <Button onClick={resetForRetry} size="lg" className="w-full">
                Try Again
            </Button>
            </div>
        )}

        {(gameState === "GAME_OVER" || gameState === "ALL_LEVELS_COMPLETE") && (
            <Button onClick={restartGame} size="lg" className="w-full">
                Play Again
            </Button>
        )}

        {gameState === "SOLVED" && (
          <Button onClick={nextLevel} size="lg" className="w-full">
            Next Puzzle <ArrowRight className="ml-2" />
          </Button>
        )}

        <div className="relative w-full text-center h-6">
          {(gameState === "PLAYING" || gameState === "FAILED" || gameState === "GAME_OVER") && (
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="link"
                className=" text-muted-foreground"
              >
                Back to Home
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
