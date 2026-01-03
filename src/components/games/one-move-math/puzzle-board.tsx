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
  const puzzleSize = 280; // Fixed size for math puzzle
  const TILE_SIZE = puzzleSize / puzzle.gridSize;

  const handleTileClick = (index: number) => {
    if (isReadOnly || board[index].isLocked || selectedIndices.includes(index)) {
        if(selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
            playSound('click', isSoundOn);
        }
      return;
    }

    playSound('click', isSoundOn);
    setSelectedIndices([...selectedIndices, index]);
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

  return (
    <div
      className="grid gap-2 rounded-lg bg-muted/50 p-2 shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)`,
        width: `${puzzleSize}px`,
        height: `${puzzleSize}px`,
      }}
    >
      {board.map((tile, index) => {
        const isSelected = selectedIndices.includes(index);
        return (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={cn(
              'flex items-center justify-center rounded-md text-4xl font-bold font-headline select-none transition-all duration-300',
              tile.isLocked ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground shadow-sm border',
              !isReadOnly && !tile.isLocked && 'cursor-pointer',
              isSelected && 'z-10 scale-[1.08] tile-glow',
              isReadOnly && puzzle.swappedIndices.includes(index) && 'bg-success/20'
            )}
            style={{
              width: `${TILE_SIZE - 8}px`,
              height: `${TILE_SIZE - 8}px`,
            }}
          >
            {tile.value}
          </div>
        );
      })}
    </div>
  );
}
