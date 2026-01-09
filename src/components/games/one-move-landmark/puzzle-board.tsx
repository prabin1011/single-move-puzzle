
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';
import type { Tile, Solution } from '@/lib/levels';

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
      const newSize = window.innerWidth - 32 - 32 - 32;
      setPuzzleSize(Math.min(300, newSize));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TILE_SIZE = puzzleSize / grid;

  const checkSolution = useCallback(() => {
    if (solution.type === 'swap') {
        const [first, second] = selectedIndices;
        const isCorrectSwap = solution.indices.includes(first) && solution.indices.includes(second);

        if (isCorrectSwap) {
            playSound("swap", isSoundOn);
            const newBoard = [...board];
            const [firstIndex, secondIndex] = selectedIndices;
            [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
            setBoard(newBoard);
            setTimeout(() => onSuccess(), 500);
        } else {
            setShowSolution(true);
            setTimeout(() => onFail(), 1500); 
        }
    }
    // Note: Rotation logic is handled directly in handleTileClick
  }, [selectedIndices, solution, onSuccess, onFail, board, isSoundOn]);

  const handleTileClick = (boardIndex: number) => {
    if (isReadOnly || showSolution) return;
    
    playSound('click', isSoundOn);

    if (solution.type === 'rotate') {
        if (board[boardIndex].rotation === 0) { // Can't rotate a correct tile
             onFail();
             return;
        }

        const newBoard = [...board];
        const currentRotation = newBoard[boardIndex].rotation;
        const newRotation = (currentRotation + 90) % 360;
        newBoard[boardIndex].rotation = newRotation;
        setBoard(newBoard);

        if (boardIndex === solution.index && newRotation === 0) {
            onSuccess();
        } else if (newRotation === 0) { // Rotated the wrong tile back to normal
            onFail();
        }
    } else if (solution.type === 'swap') {
        if (selectedIndices.includes(boardIndex)) {
          setSelectedIndices(selectedIndices.filter(i => i !== boardIndex));
        } else {
          setSelectedIndices([...selectedIndices, boardIndex]);
        }
    }
  };

  useEffect(() => {
    if (solution.type === 'swap' && selectedIndices.length === 2) {
      const timer = setTimeout(checkSolution, 300);
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
          if (showSolution && solution.type === 'swap') {
              shouldHighlight = solution.indices.includes(boardIndex);
          } else if (showSolution && solution.type === 'rotate') {
              shouldHighlight = solution.index === boardIndex;
          }

          return (
            <div
              key={boardIndex}
              onClick={() => handleTileClick(boardIndex)}
              className={cn(
                'relative overflow-hidden rounded-sm transition-all duration-300 ease-out',
                !isReadOnly && !showSolution && 'cursor-pointer',
                isSelected && 'z-10 scale-[1.06] tile-glow',
                shouldHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse'
              )}
              style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: `${puzzleSize}px ${puzzleSize}px`,
                backgroundPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
                transform: `rotate(${tile.rotation}deg)`,
              }}
            />
          );
        })}
      </div>
       <div className="h-6 text-center mt-2">
          {!isReadOnly && !showSolution && solution.type === 'swap' && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first tile to swap.</p>}
          {!isReadOnly && !showSolution && solution.type === 'swap' && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second tile to swap.</p>}
          {!isReadOnly && !showSolution && solution.type === 'rotate' && <p className="text-sm text-muted-foreground">Click the rotated tile to fix it.</p>}
          {showSolution && <p className="text-sm text-error animate-pulse">That wasn't it. Showing correct move...</p>}
          {isReadOnly && !showSolution && <p className="text-sm text-muted-foreground">&nbsp;</p>}
       </div>
    </div>
  );
}
