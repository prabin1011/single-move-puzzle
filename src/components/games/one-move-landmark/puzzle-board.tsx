
"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sounds";
import { useSound } from "@/contexts/sound-context";
import type { Tile, Solution } from "@/lib/levels";

interface PuzzleBoardProps {
  imageUrl: string;
  grid: number;
  boardState: Tile[];
  solution: Solution;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
}

export default function PuzzleBoard({
  imageUrl,
  grid,
  boardState,
  solution,
  onSuccess,
  onFail,
  isReadOnly = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(boardState);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const { isSoundOn } = useSound();

  const [puzzleSize, setPuzzleSize] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      // Use a more generous sizing calculation for mobile
      const newSize = window.innerWidth - 64; 
      // Increase max size for larger screens
      setPuzzleSize(Math.min(360, newSize));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const TILE_SIZE = puzzleSize / grid;

  const isSwapCorrect = (first: number, second: number) => {
    if (solution.type === "swap" || solution.type === "symmetry-swap") {
      const [a, b] = solution.indices;
      return (first === a && second === b) || (first === b && second === a);
    }
    return false;
  };

  const checkSolution = useCallback(() => {
    if (solution.type === "swap" || solution.type === "symmetry-swap") {
      const [first, second] = selectedIndices;
      const correct = isSwapCorrect(first, second);

      if (correct) {
        playSound("swap", isSoundOn);
        const newBoard = [...board];
        [newBoard[first], newBoard[second]] = [newBoard[second], newBoard[first]];
        setBoard(newBoard);
        setTimeout(() => onSuccess(), 450);
      } else {
        setShowSolution(true);
        setTimeout(() => onFail(), 1200);
      }
    }
  }, [selectedIndices, solution, onSuccess, onFail, board, isSoundOn]);

  const handleTileClick = (boardIndex: number) => {
    if (isReadOnly || showSolution) return;

    playSound("click", isSoundOn);

    if (solution.type === "rotate") {
      if (board[boardIndex].rotation === 0) {
        return;
      }

      const newBoard = [...board];
      const currentRotation = newBoard[boardIndex].rotation;
      const newRotation = ((currentRotation + 90) % 360) as 0 | 90 | 180 | 270;
      newBoard[boardIndex].rotation = newRotation;
      setBoard(newBoard);

      if (boardIndex === solution.index && newRotation === 0) {
        onSuccess();
        return;
      }

      if (boardIndex !== solution.index && newRotation === 0) {
        setShowSolution(true);
        setTimeout(() => onFail(), 900);
      }
      return;
    }

    if (selectedIndices.includes(boardIndex)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== boardIndex));
    } else {
      const next = [...selectedIndices, boardIndex].slice(0, 2);
      setSelectedIndices(next);
    }
  };

  useEffect(() => {
    if ((solution.type === "swap" || solution.type === "symmetry-swap") && selectedIndices.length === 2) {
      const timer = setTimeout(checkSolution, 220);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, solution.type, checkSolution]);

  useEffect(() => {
    setBoard(boardState);
    setSelectedIndices([]);
    setShowSolution(false);
  }, [boardState]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="grid gap-1 rounded-lg bg-muted p-1 shadow-md"
        style={{
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
          width: `${puzzleSize}px`,
          height: `${puzzleSize}px`,
        }}
      >
        {board.map((tile, boardIndex) => {
          const row = Math.floor(tile.originalIndex / grid);
          const col = tile.originalIndex % grid;

          const isSelected = selectedIndices.includes(boardIndex);

          let shouldHighlight = false;
          if (showSolution) {
            if (solution.type === "swap" || solution.type === "symmetry-swap") {
              shouldHighlight = solution.indices.includes(boardIndex);
            } else if (solution.type === "rotate") {
              shouldHighlight = solution.index === boardIndex;
            }
          }

          const scale = isSelected || shouldHighlight ? 1.06 : 1.0;
          const bgSize = puzzleSize * 1.05; // 5% bigger to create crop effect

          return (
            <div
              key={boardIndex}
              onClick={() => handleTileClick(boardIndex)}
              className={cn(
                "relative overflow-hidden rounded-sm transition-all duration-300 ease-out",
                !isReadOnly && !showSolution && "cursor-pointer",
                isSelected && "z-10 tile-glow",
                shouldHighlight && "z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse"
              )}
              style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: `${bgSize}px ${bgSize}px`,
                backgroundPosition: `-${col * (bgSize / grid)}px -${row * (bgSize / grid)}px`,
                transform: `rotate(${tile.rotation}deg) scale(${scale})`,
              }}
            />
          );
        })}
      </div>

      <div className="h-6 text-center mt-2">
        {!isReadOnly && !showSolution && (solution.type === "swap" || solution.type === "symmetry-swap") && selectedIndices.length === 0 && (
          <p className="text-sm text-muted-foreground">Select the first tile.</p>
        )}
        {!isReadOnly && !showSolution && (solution.type === "swap" || solution.type === "symmetry-swap") && selectedIndices.length === 1 && (
          <p className="text-sm text-muted-foreground">Select the second tile.</p>
        )}
        {!isReadOnly && !showSolution && solution.type === "rotate" && (
          <p className="text-sm text-muted-foreground">Find the rotated tile and tap to fix it.</p>
        )}
        {showSolution && <p className="text-sm text-error animate-pulse">That wasn't it. Showing the correct move...</p>}
        {isReadOnly && !showSolution && <p className="text-sm text-muted-foreground">&nbsp;</p>}
      </div>
    </div>
  );
}
