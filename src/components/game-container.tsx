
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
import Image from "next/image";
import { levels as initialLevels, generatePuzzle, type Level } from "@/lib/levels";
import { getLevelConfig } from "@/lib/game-config";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  HeartCrack,
  Info,
  Play,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGameTimer } from "@/hooks/use-game-timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const MAX_MISTAKES = 1; // Allows 1 mistake, game over on the 2nd.
const PREVIEW_TIME = 5; // 5 seconds to memorize

// Preload the next image
function preloadImage(url: string) {
  const img = new window.Image();
  img.src = url;
}

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
  const [levels] = useState(() => shuffle(initialLevels));
  const [levelIndex, setLevelIndex] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('currentLevelIndex');
    const savedHighestLevel = localStorage.getItem('highestLevel');

    const initialIndex = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;
    
    setLevelIndex(initialIndex);
    setHighestLevel(initialHighest);
    setIsLoading(false);
  }, []);

  const { grid: currentGridSize, categories } = useMemo(() => getLevelConfig(levelIndex), [levelIndex]);

  const availableLevels = useMemo(() => {
    // For the first few levels, allow all categories.
    if (categories.includes('all')) return levels;
    // Otherwise, filter by the allowed categories for the current difficulty tier.
    const pastCategories = ['all'];
    const seenIds = new Set<string>();
    
    return levels.filter(level => {
        const isCorrectCategory = categories.includes(level.category) && !pastCategories.includes(level.category);
        if (isCorrectCategory && !seenIds.has(level.id)) {
            seenIds.add(level.id);
            return true;
        }
        return false;
    });
  }, [levels, categories]);
  
  const currentLevel = useMemo(() => {
    if (!availableLevels.length) return levels[levelIndex % levels.length]; // Fallback to looping all levels
    // Use modulo to loop through available levels for the current difficulty tier
    const levelFromTier = availableLevels[levelIndex % availableLevels.length];
    return levelFromTier;
  }, [availableLevels, levelIndex, levels]);


  const [currentPuzzle, setCurrentPuzzle] = useState(() => {
    if (!currentLevel) return null;
    return generatePuzzle(currentLevel.image.url, currentGridSize);
  });
  
  // Save progress whenever level changes
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('currentLevelIndex', levelIndex.toString());
    if (levelIndex > highestLevel) {
      setHighestLevel(levelIndex);
      localStorage.setItem('highestLevel', levelIndex.toString());
    }
  }, [levelIndex, highestLevel, isLoading]);
  
  // Preload the next level's image
  useEffect(() => {
    const nextLevelIndex = (levelIndex + 1);
    const nextLevelConfig = getLevelConfig(nextLevelIndex);
    const nextAvailableLevels = levels.filter(l => nextLevelConfig.categories.includes(l.category) || nextLevelConfig.categories.includes('all'));
    if (nextAvailableLevels.length > 0) {
        const nextLevel = nextAvailableLevels[nextLevelIndex % nextAvailableLevels.length];
        if (nextLevel?.image.url) {
            preloadImage(nextLevel.image.url);
        }
    }
  }, [levelIndex, levels]);
  
  useEffect(() => {
    if (currentLevel) {
      setCurrentPuzzle(generatePuzzle(currentLevel.image.url, currentGridSize));
      setRetryCount(0);
    }
  }, [currentLevel, currentGridSize]);


  const [retryCount, setRetryCount] = useState(0);

  const [gameState, setGameState] = useState<
    "READY" | "PREVIEW" | "PLAYING" | "SOLVED" | "FAILED" | "GAME_OVER"
  >("READY");
  const [showFacts, setShowFacts] = useState(false);
  
  const isTimerRunning = gameState === "PREVIEW";
  const { time, reset: resetTimer, stop: stopTimer } = useGameTimer(isTimerRunning);

  useEffect(() => {
    if (gameState === 'PREVIEW' && time >= PREVIEW_TIME) {
      stopTimer();
      setGameState('PLAYING');
    }
  }, [time, gameState, stopTimer]);


  if (isLoading || !currentLevel || !currentPuzzle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Puzzle...</p>
      </div>
    );
  }

  const { scrambledBoard, swapped, imageUrl } = currentPuzzle;


  const handleSuccess = async () => {
    setGameState("SOLVED");
    setTimeout(() => setShowFacts(true), 500);
  };

  const handleFail = () => {
    const newMistakeCount = mistakeCount + 1;
    setMistakeCount(newMistakeCount);
    if (newMistakeCount > MAX_MISTAKES) {
      setGameState("GAME_OVER");
      localStorage.removeItem('currentLevelIndex'); // Reset for next game
    } else {
      setGameState("FAILED");
    }
  };

  const resetForRetry = () => {
    setRetryCount((prev) => prev + 1);
    setCurrentPuzzle(generatePuzzle(currentLevel.image.url, currentGridSize));
    setGameState("PLAYING");
  };

  const restartGame = () => {
    setLevelIndex(0);
    setMistakeCount(0);
    setGameState("READY");
    setShowFacts(false);
    setRetryCount(0);
    resetTimer();
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

  const puzzleKey = `${currentLevel.id}-${imageUrl}-${retryCount}`;

  return (
    <Card className="w-full max-w-sm bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center relative">
        {gameState === "READY" && (
            <>
                <CardTitle className="text-3xl font-bold">
                {currentLevel.place}
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
        {gameState === "PLAYING" && (
          <>
            <CardTitle className="text-2xl font-semibold">
              Find the two swapped pieces.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have {MAX_MISTAKES - mistakeCount + 1} chance(s) remaining.
            </CardDescription>
            {levelIndex >= 2 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="mx-auto mt-2">
                      <Info className="mr-2 h-4 w-4" /> Hint
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{currentLevel.hint}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </>
        )}
        {gameState === "SOLVED" && (
          <>
            <div className="flex justify-center text-green-400">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">
              {currentLevel.place}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {currentLevel.country}
            </CardDescription>
          </>
        )}
        {gameState === "FAILED" && (
          <>
            <div className="flex justify-center text-red-500">
              <XCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-3xl font-bold pt-4">
              Not Quite
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              That wasn&apos;t the correct swap. You have {MAX_MISTAKES - mistakeCount + 1} chance remaining.
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
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {(gameState === "READY" || gameState === "PREVIEW") && (
          <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg border-2 border-border flex items-center justify-center">
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={currentLevel.place}
              width={300}
              height={300}
              priority
              className={cn(
                  "object-cover transition-all duration-500",
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
            isReadOnly={gameState === "FAILED"}
          />
        )}

        {gameState === "SOLVED" && (
          <div className="flex flex-col items-center w-full">
            <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg mx-auto mb-6 border-2 border-green-400/50">
              <Image
                src={imageUrl}
                alt={currentLevel.place}
                width={300}
                height={300}
                className="object-cover"
                priority
              />
            </div>
            <div
              className={cn(
                "transition-opacity duration-500 w-full",
                showFacts ? "opacity-100" : "opacity-0"
              )}
            >
              <ul className="space-y-3 text-left text-base">
                {currentLevel.facts.map((fact, index) => (
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
                <p>You reached Level {levelIndex + 1}.</p>
                <p>Your highest level is {highestLevel + 1}.</p>
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
          <Button onClick={resetForRetry} size="lg" className="w-full">
            Try Again
          </Button>
        )}

        {gameState === "GAME_OVER" && (
            <Button onClick={restartGame} size="lg" className="w-full">
                Restart Game
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
                className="absolute top-0 left-0 text-muted-foreground"
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

    