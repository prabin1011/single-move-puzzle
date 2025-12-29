
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PuzzleBoardProps {
  imageUrl: string;
  grid: number;
  boardState: number[];
  swappedIndices: number[];
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
}

export default function PuzzleBoard({
  imageUrl,
  grid,
  boardState,
  swappedIndices,
  onSuccess,
  onFail,
  isReadOnly = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(boardState);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  
  const PUZZLE_SIZE = 300;
  const TILE_SIZE = PUZZLE_SIZE / grid;

  const handleTileClick = (boardIndex: number) => {
    if (isReadOnly || selectedIndices.includes(boardIndex) || selectedIndices.length >= 2 || showSolution) {
      return;
    }
    setSelectedIndices([...selectedIndices, boardIndex]);
  };

  const checkSolution = useCallback(() => {
      const [first, second] = selectedIndices;
      const isCorrectSwap = 
        (swappedIndices.includes(first) && swappedIndices.includes(second));

      if (isCorrectSwap) {
        onSuccess();
      } else {
        setShowSolution(true);
        setTimeout(() => {
          onFail();
        }, 1500); 
      }
  }, [selectedIndices, swappedIndices, onSuccess, onFail]);

  // Effect to handle the swap and check logic
  useEffect(() => {
    if (selectedIndices.length === 2) {
      // Perform the swap visually first
      const newBoard = [...board];
      const [firstIndex, secondIndex] = selectedIndices;
      [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
      setBoard(newBoard);

      // Then check if it was the correct one after a short delay
      const timer = setTimeout(checkSolution, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, checkSolution]);
  
  // Reset component state when the underlying puzzle changes via key prop
  useEffect(() => {
    setBoard(boardState);
    setSelectedIndices([]);
    setShowSolution(false);
  }, [boardState]);


  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid gap-1 rounded-lg bg-muted p-1 shadow-md"
        style={{ 
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
          width: `${PUZZLE_SIZE}px`,
          height: `${PUZZLE_SIZE}px`,
        }}
      >
        {board.map((tileValue, boardIndex) => {
          const row = Math.floor(tileValue / grid);
          const col = tileValue % grid;
          const isSelected = selectedIndices.includes(boardIndex);
          const shouldHighlight = showSolution && swappedIndices.includes(boardIndex);

          return (
            <div
              key={boardIndex}
              onClick={() => handleTileClick(boardIndex)}
              className={cn(
                'relative overflow-hidden rounded-sm transition-all duration-300',
                !isReadOnly && !showSolution && 'cursor-pointer',
                isSelected && 'ring-4 ring-yellow-400 ring-inset z-10',
                shouldHighlight && 'ring-4 ring-red-500 ring-inset animate-pulse z-10'
              )}
              style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: `${PUZZLE_SIZE}px ${PUZZLE_SIZE}px`,
                backgroundPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
              }}
            />
          );
        })}
      </div>
       <div className="h-6 text-center">
          {!isReadOnly && !showSolution && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first tile to swap.</p>}
          {!isReadOnly && !showSolution && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second tile to swap.</p>}
          {showSolution && <p className="text-sm text-yellow-400 animate-pulse">Showing correct swap...</p>}
          {isReadOnly && !showSolution && <p className="text-sm text-muted-foreground">&nbsp;</p> }
       </div>
    </div>
  );
}

    