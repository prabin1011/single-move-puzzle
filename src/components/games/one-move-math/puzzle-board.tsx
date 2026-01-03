
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { MathPuzzle } from '@/lib/math-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';

interface PuzzleBoardProps {
  puzzle: MathPuzzle;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
  showSolution?: boolean;
}

export default function PuzzleBoard({
  puzzle,
  onSuccess,
  onFail,
  isReadOnly = false,
  showSolution = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(puzzle.board);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || board[index].isLocked || selectedIndices.length >= 2) {
      return;
    }

    playSound('click', isSoundOn);
    if(selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };
  
  const checkSolution = useCallback(() => {
      const sortedSelection = [...selectedIndices].sort((a,b) => a - b);
      const sortedSwapped = [...puzzle.swappedIndices].sort((a,b) => a-b);
      
      if (sortedSelection[0] === sortedSwapped[0] && sortedSelection[1] === sortedSwapped[1]) {
        // Correct swap
        playSound('swap', isSoundOn);
        const newBoard = [...board];
        const [firstIndex, secondIndex] = selectedIndices;
        [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
        setBoard(newBoard);
        setSelectedIndices([]); // Clear selection immediately to prevent re-triggering

        setTimeout(() => onSuccess(), 500);
      } else {
        // Incorrect swap
        setTimeout(() => {
          onFail();
          setSelectedIndices([]); // Clear selection after failing
        }, 800);
      }
  }, [selectedIndices, puzzle, onSuccess, onFail, board, isSoundOn]);


  useEffect(() => {
    if (selectedIndices.length === 2) {
      const timer = setTimeout(checkSolution, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, checkSolution]);

  useEffect(() => {
    // Reset internal state if the puzzle changes (e.g., new level)
    setBoard(puzzle.board);
    setSelectedIndices([]);
  }, [puzzle.id]);


  return (
    <div
      className="flex justify-center items-center gap-3 rounded-lg bg-muted/50 p-4 shadow-inner"
    >
      {board.map((tile, index) => {
        const isSelected = selectedIndices.includes(index);
        const shouldHighlight = showSolution && selectedIndices.includes(index);

        return (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={cn(
              'flex items-center justify-center rounded-lg w-20 h-24 text-5xl font-bold font-headline select-none transition-all duration-300',
              tile.isLocked ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground shadow-sm border',
              !isReadOnly && !tile.isLocked && 'cursor-pointer hover:scale-105',
              isSelected && 'z-10 scale-[1.08] tile-glow',
              shouldHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse',
              isReadOnly && 'cursor-default'
            )}
          >
            {tile.value}
          </div>
        );
      })}
    </div>
  );
}
