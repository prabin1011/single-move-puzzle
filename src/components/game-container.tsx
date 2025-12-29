
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
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  HeartCrack,
  Info,
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

  const [currentLevel, setCurrentLevel] = useState<Level>(levels[levelIndex]);

  // Load progress on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('currentLevelIndex');
    const savedHighestLevel = localStorage.getItem('highestLevel');

    const initialIndex = savedLevel ? parseInt(savedLevel, 10) : 0;
    const initialHighest = savedHighestLevel ? parseInt(savedHighestLevel, 10) : 0;

    setLevelIndex(initialIndex);
    setHighestLevel(initialHighest);
    setCurrentLevel(levels[initialIndex]);
    setMistakeCount(0);
  }, [levels]);

  // Save progress whenever level changes
  useEffect(() => {
    localStorage.setItem('currentLevelIndex', levelIndex.toString());
    if (levelIndex > highestLevel) {
      setHighestLevel(levelIndex);
      localStorage.setItem('highestLevel', levelIndex.toString());
    }
  }, [levelIndex, highestLevel]);


  const currentGridSize = useMemo(() => {
    if (levelIndex < 2) return 3; // Levels 1-2
    if (levelIndex < 4) return 4; // Levels 3-4
    if (levelIndex < 7) return 5; // Levels 5-7
    return 6; // Levels 8+
  }, [levelIndex]);

  const [currentPuzzle, setCurrentPuzzle] = useState(() =>
    generatePuzzle(currentLevel.image.url, currentGridSize)
  );
  const [retryCount, setRetryCount] = useState(0);

  const [gameState, setGameState] = useState<
    "PREVIEW" | "PLAYING" | "SOLVED" | "FAILED" | "GAME_OVER"
  >("PREVIEW");
  const [showFacts, setShowFacts] = useState(false);
  
  const isTimerRunning = gameState === "PREVIEW";
  const { time, reset: resetTimer } = useGameTimer(isTimerRunning);

  useEffect(() => {
    if (isTimerRunning) {
        resetTimer();
    }
  }, [isTimerRunning, resetTimer]);
  
  useEffect(() => {
    if (gameState === 'PREVIEW' && time >= PREVIEW_TIME) {
      setGameState('PLAYING');
    }
  }, [time, gameState]);


  useEffect(() => {
    setCurrentPuzzle(generatePuzzle(currentLevel.image.url, currentGridSize));
    setRetryCount(0);
  }, [currentLevel, currentGridSize]);

  const { scrambledBoard, solvedBoard, swapped, imageUrl } = useMemo(() => {
    return currentPuzzle;
  }, [currentPuzzle]);


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
    setCurrentLevel(levels[0]);
    setMistakeCount(0);
    setGameState("PREVIEW");
    setShowFacts(false);
    setRetryCount(0);
    resetTimer();
  }

  const nextLevel = () => {
    const newIndex = (levelIndex + 1);
    if (newIndex >= levels.length) {
      setLevelIndex(0);
      setCurrentLevel(levels[0]);
    } else {
      setLevelIndex(newIndex);
      setCurrentLevel(levels[newIndex]);
    }

    setGameState("PREVIEW");
    setShowFacts(false);
    setRetryCount(0);
    setMistakeCount(0);
    resetTimer();
  };

  const puzzleKey = `${currentLevel.id}-${imageUrl}-${retryCount}`;

  return (
    <Card className="w-full max-w-sm bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center min-h-[160px] flex flex-col justify-center">
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
              {currentLevel.place}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Level {levelIndex + 1} &bull; {currentGridSize}x{currentGridSize} Grid
            </CardDescription>
            <CardDescription className="text-muted-foreground pt-2">
              Memorize the image before the timer runs out.
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
              That wasn&apos;t the correct swap. Give it another try!
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
                You've run out of chances. Better luck next time!
              </CardDescription>
            </>
        )}
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {gameState === "PREVIEW" && (
          <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg border-2 border-border flex items-center justify-center">
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={currentLevel.place}
              width={300}
              height={300}
              priority
              className="object-cover"
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
