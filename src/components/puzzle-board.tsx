'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { type Level } from '@/lib/levels';
import { cn } from '@/lib/utils';

interface PuzzleBoardProps {
  level: Level;
  boardState: number[];
  targetState: number[];
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
}

export default function PuzzleBoard({
  level,
  boardState,
  targetState,
  onSuccess,
  onFail,
  isReadOnly = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(boardState);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const { grid, imageUrl } = level;

  const handleTileClick = (boardIndex: number) => {
    if (isReadOnly || selectedIndices.includes(boardIndex) || selectedIndices.length >= 2) {
      return;
    }
    setSelectedIndices([...selectedIndices, boardIndex]);
  };

  const checkSolution = useCallback((currentBoard: number[]) => {
    const isSolved = JSON.stringify(currentBoard) === JSON.stringify(targetState);
    if (isSolved) {
      onSuccess();
    } else {
      onFail();
    }
  }, [targetState, onSuccess, onFail]);

  const performSwap = useCallback(() => {
    if (selectedIndices.length !== 2) return;

    const newBoard = [...board];
    const [firstIndex, secondIndex] = selectedIndices;

    [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
    
    setBoard(newBoard);
    
    // Defer checking the solution to allow the state to update and re-render
    setTimeout(() => checkSolution(newBoard), 100);

    // Don't clear selected indices immediately to show the failed state
    setTimeout(() => setSelectedIndices([]), 500);

  }, [board, selectedIndices, checkSolution]);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const timer = setTimeout(performSwap, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, performSwap]);
  
  useEffect(() => {
    setBoard(boardState);
    setSelectedIndices([]);
  }, [boardState]);

  const TILE_SIZE = 100;
  const PUZZLE_SIZE = TILE_SIZE * grid;
  const TILE_DISPLAY_SIZE = 80; // Size of the tile on screen (w-20 in tailwind)
  const TILE_DISPLAY_SIZE_MD = 96; // md:w-24


  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid gap-1 rounded-lg bg-muted p-1 shadow-md"
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
      >
        {board.map((tileValue, boardIndex) => {
          const row = Math.floor(tileValue / grid);
          const col = tileValue % grid;
          const isSelected = selectedIndices.includes(boardIndex);

          return (
            <div
              key={boardIndex}
              onClick={() => handleTileClick(boardIndex)}
              className={cn(
                'relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-md transition-all duration-200',
                !isReadOnly && 'cursor-pointer',
                isSelected && 'ring-4 ring-primary ring-inset'
              )}
            >
              <Image
                src={imageUrl}
                alt={`Tile ${tileValue + 1}`}
                width={PUZZLE_SIZE}
                height={PUZZLE_SIZE}
                priority
                className="absolute top-0 left-0 max-w-none transition-transform duration-300"
                style={{
                  width: PUZZLE_SIZE,
                  height: PUZZLE_SIZE,
                  objectFit: 'none',
                  objectPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
                  transform: `scale(calc(${TILE_DISPLAY_SIZE} / ${PUZZLE_SIZE}))`,
                  transformOrigin: 'top left',
                }}
              />
            </div>
          );
        })}
      </div>
       <div className="h-6 text-center">
          {!isReadOnly && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first tile to swap.</p>}
          {!isReadOnly && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second tile to swap.</p>}
       </div>
    </div>
  );
}
