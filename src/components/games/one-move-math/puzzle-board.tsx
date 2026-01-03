
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { MathPuzzle, Tile } from '@/lib/math-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';
import { Check } from 'lucide-react';

interface PuzzleBoardProps {
  puzzle: MathPuzzle;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
}

export default function PuzzleBoard({
  puzzle,
  onSuccess,
  onFail,
  isReadOnly = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(puzzle.board);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || board[index].isLocked) {
      return;
    }

    if(selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
      playSound('click', isSoundOn);
    } else {
      playSound('click', isSoundOn);
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const sortedSelection = [...selectedIndices].sort((a,b) => a - b);
      const sortedSwapped = [...puzzle.swappedIndices].sort((a,b) => a-b);
      
      if (sortedSelection[0] === sortedSwapped[0] && sortedSelection[1] === sortedSwapped[1]) {
        // Correct swap
        playSound('swap', isSoundOn);
        const newBoard = [...board];
        const [firstIndex, secondIndex] = selectedIndices;
        [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
        setBoard(newBoard);

        setTimeout(() => onSuccess(), 500);
      } else {
        // Incorrect swap
        onFail();
        setSelectedIndices([]);
      }
    }
  }, [selectedIndices, puzzle, onSuccess, onFail, board, isSoundOn]);

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
        return (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={cn(
              'flex items-center justify-center rounded-lg w-20 h-24 text-5xl font-bold font-headline select-none transition-all duration-300',
              tile.isLocked ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground shadow-sm border',
              !isReadOnly && !tile.isLocked && 'cursor-pointer hover:scale-105',
              isSelected && 'z-10 scale-[1.08] tile-glow',
              isReadOnly && 'cursor-default',
              isReadOnly && puzzle.correctSolution[index] === tile.value && 'tile-glow'
            )}
          >
            {tile.value}
          </div>
        );
      })}
    </div>
  );
}
