
"use client";

import { useState, useMemo, useEffect, useActionState } from "react";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getLandmarkData } from "@/lib/actions";
import { useLandmarkImages } from "@/hooks/useLandmarkImages";
import { Skeleton } from "./ui/skeleton";

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
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);

  const [currentPuzzle, setCurrentPuzzle] = useState(() =>
    generatePuzzle(currentLevel, "") // image will be injected later
  );
  const [retryCount, setRetryCount] = useState(0);

  const [gameState, setGameState] = useState<
    "PREVIEW" | "PLAYING" | "SOLVED" | "FAILED"
  >("PREVIEW");
  const [showFacts, setShowFacts] = useState(false);

  const [state, getNewFacts, isPending] = useActionState(getLandmarkData, null);
  const [currentFacts, setCurrentFacts] = useState(currentLevel.facts);

  // 🔥 IMAGE ENGINE
  const {
    currentImage,
    nextImage,
    loading: imageLoading,
    error: imageError,
    hasImages,
  } = useLandmarkImages(currentLevel.place);

  // When AI returns new facts
  useEffect(() => {
    if (state?.facts) {
      setCurrentFacts(state.facts);
    }
  }, [state]);

  // Whenever the image changes, regenerate the puzzle
  useEffect(() => {
    if (!currentImage) return;
    setCurrentPuzzle(generatePuzzle(currentLevel, currentImage));
    setRetryCount(0);
  }, [currentImage, currentLevel]);

  const { scrambledBoard, solvedBoard, swapped, imageUrl } = useMemo(() => {
    return currentPuzzle;
  }, [currentPuzzle]);

  const startGame = () => {
    setGameState("PLAYING");
  };

  const handleSuccess = async () => {
    setGameState("SOLVED");
    getNewFacts({ landmarkName: currentLevel.place });
    setTimeout(() => setShowFacts(true), 500);
  };

  const handleFail = () => {
    setGameState("FAILED");
  };

  const resetForRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (currentImage) {
      setCurrentPuzzle(generatePuzzle(currentLevel, currentImage));
    }
    setGameState("PLAYING");
  };

  const nextLevel = () => {
    const newIndex = (levelIndex + 1) % levels.length;
    const newLevel = levels[newIndex];

    setLevelIndex(newIndex);
    setCurrentLevel(newLevel);
    setCurrentFacts(newLevel.facts);

    setGameState("PREVIEW");
    setShowFacts(false);
    setRetryCount(0);
  };

  const handleNewImage = () => {
    // Just move to the next image from the engine
    nextImage();
  };

  // Key to force re-render puzzle board when the underlying puzzle changes
  const puzzleKey = `${currentLevel.id}-${imageUrl}-${retryCount}`;

  const showImageSkeleton = imageLoading || !currentImage;

  return (
    <Card className="w-full max-w-sm bg-background border-border shadow-2xl transition-all duration-500">
      <CardHeader className="text-center min-h-[140px] flex justify-center">
        {gameState === "PREVIEW" && (
          <>
            <CardTitle className="text-3xl font-bold">
              {currentLevel.place}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Memorize the image, then find the single swap.
            </CardDescription>
          </>
        )}
        {gameState === "PLAYING" && (
          <>
            <CardTitle className="text-2xl font-semibold">
              Find the two swapped pieces.
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select two tiles to swap them back into place.
            </CardDescription>
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
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4 sm:px-6">
        {/* PREVIEW STATE */}
        {gameState === "PREVIEW" && (
          <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg border-2 border-border flex items-center justify-center">
            {showImageSkeleton ? (
              <Skeleton className="h-full w-full" />
            ) : (
              currentImage && (
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={currentLevel.place}
                  width={300}
                  height={300}
                  priority
                  className="object-cover"
                />
              )
            )}
          </div>
        )}

        {/* PLAYING / FAILED STATE */}
        {(gameState === "PLAYING" || gameState === "FAILED") && currentImage && (
          <PuzzleBoard
            key={puzzleKey}
            imageUrl={imageUrl}
            grid={currentLevel.grid}
            boardState={scrambledBoard}
            targetState={solvedBoard}
            swappedIndices={swapped}
            onSuccess={handleSuccess}
            onFail={handleFail}
            isReadOnly={gameState === "FAILED"}
          />
        )}

        {/* SOLVED STATE */}
        {gameState === "SOLVED" && currentImage && (
          <div className="flex flex-col items-center w-full">
            <div className="relative h-[300px] w-[300px] rounded-lg overflow-hidden shadow-lg mx-auto mb-6 border-2 border-green-400/50">
              <Image
                src={currentImage}
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
              <ul className="space-y-3 text-left text-lg">
                {currentFacts.map((fact, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-secondary rounded-md"
                  >
                    <span className="text-primary mt-1">✓</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  getNewFacts({ landmarkName: currentLevel.place })
                }
                className="w-full mt-4"
                variant="secondary"
                size="sm"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                Get New Facts
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center p-6 space-y-4">
        {gameState === "PREVIEW" && (
          <div className="w-full space-y-2">
            <Button
              onClick={startGame}
              size="lg"
              className="w-full"
              disabled={!hasImages || imageLoading}
            >
              {imageLoading ? <Loader2 className="animate-spin" /> : "Start Puzzle"}
            </Button>
            <Button
              onClick={handleNewImage}
              size="lg"
              variant="secondary"
              className="w-full"
              disabled={!hasImages || imageLoading}
            >
              <RefreshCw />
              New Image
            </Button>
          </div>
        )}

        {gameState === "FAILED" && (
          <Button onClick={resetForRetry} size="lg" className="w-full">
            Try Again
          </Button>
        )}

        {gameState === "SOLVED" && (
          <Button onClick={nextLevel} size="lg" className="w-full">
            Next Puzzle <ArrowRight className="ml-2" />
          </Button>
        )}

        <div className="relative w-full text-center h-6">
          {gameState !== "PREVIEW" && (
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
