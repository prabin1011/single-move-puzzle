'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { type Level } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
    setSelectedIndices([]);
    
    // Check the solution right after the swap
    checkSolution(newBoard);

  }, [board, selectedIndices, checkSolution]);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const timer = setTimeout(performSwap, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, performSwap]);
  
  // Reset board when the level changes
  useEffect(() => {
    setBoard(boardState);
    setSelectedIndices([]);
  }, [boardState]);

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
          const tileSize = 100; // Each tile is a "full" tile
          const containerSize = 100 * grid;

          return (
            <div
              key={boardIndex}
              onClick={() => handleTileClick(boardIndex)}
              className={cn(
                'relative h-24 w-24 md:h-32 md:w-32 overflow-hidden rounded-md transition-all duration-200',
                !isReadOnly && 'cursor-pointer',
                isSelected && 'ring-4 ring-primary ring-inset'
              )}
            >
              <Image
                src={imageUrl}
                alt={`Tile ${boardIndex + 1}`}
                fill
                priority
                style={{
                  objectFit: 'none',
                  objectPosition: `${col * -tileSize}px ${row * -tileSize}px`,
                  width: `${containerSize}px`,
                  height: `${containerSize}px`,
                  maxWidth: 'none',
                  transform: `scale(${100 / containerSize})`,
                  transformOrigin: 'top left',
                }}
                unoptimized
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
