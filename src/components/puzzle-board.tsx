'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const TILE_SIZE = 100; // Base size for a tile, adjust as needed

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
    
    setTimeout(() => checkSolution(newBoard), 100);

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


  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid gap-1 rounded-lg bg-muted p-1 shadow-md"
        style={{ 
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
          width: `${grid * TILE_SIZE}px`,
          height: `${grid * TILE_SIZE}px`,
        }}
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
                'relative overflow-hidden rounded-md transition-all duration-300',
                !isReadOnly && 'cursor-pointer',
                isSelected && 'ring-4 ring-primary ring-inset'
              )}
              style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${grid * TILE_SIZE}px ${grid * TILE_SIZE}px`,
                backgroundPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
              }}
            />
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
