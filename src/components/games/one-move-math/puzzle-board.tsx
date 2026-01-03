
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { MathPuzzle, Tile } from '@/lib/math-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';
import { X } from 'lucide-react'; // Using X for multiplication

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
  const [board, setBoard] = useState<Tile[]>(puzzle.board);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || board[index].isLocked || selectedIndices.length >= 2 || showIncorrect) {
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
      const sortedSwapped = [...puzzle.swappedIndices].sort((a,b) => a - b);
      
      if (sortedSelection[0] === sortedSwapped[0] && sortedSelection[1] === sortedSwapped[1]) {
        // Correct swap
        playSound('swap', isSoundOn);
        const newBoard = [...board];
        const [firstIndex, secondIndex] = selectedIndices;
        [newBoard[firstIndex].value, newBoard[secondIndex].value] = [newBoard[secondIndex].value, newBoard[firstIndex].value];
        setBoard(newBoard);
        setSelectedIndices([]); 
        
        setTimeout(() => onSuccess(), 500);
      } else {
        // Incorrect swap
        setShowIncorrect(true);
        setTimeout(() => {
          onFail();
          setSelectedIndices([]); 
          setShowIncorrect(false);
        }, 800);
      }
  }, [selectedIndices, puzzle.swappedIndices, onSuccess, onFail, board, isSoundOn]);


  useEffect(() => {
    if (selectedIndices.length === 2 && !isReadOnly) {
      const timer = setTimeout(checkSolution, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, checkSolution, isReadOnly]);

  useEffect(() => {
    // Reset internal state if the puzzle changes (e.g., new level or retry)
    setBoard(puzzle.board);
    setSelectedIndices([]);
    setShowIncorrect(false);
  }, [puzzle.id]);


  return (
    <div className="flex flex-col items-center gap-4 w-full px-2">
      <div
        className="flex justify-center items-center gap-1 sm:gap-2 rounded-lg bg-muted/50 p-1 sm:p-2 shadow-inner w-full"
      >
        {board.map((tile, index) => {
          const isSelected = selectedIndices.includes(index);
          const shouldHighlight = showIncorrect && selectedIndices.includes(index);

          const isOperator = ['+', '-', '*', '/'].includes(tile.value as string);
          const isEquals = tile.value === '=';
          const isNumber = typeof tile.value === 'number' || (typeof tile.value === 'string' && !isNaN(parseInt(tile.value)));
          const isBlank = tile.value === '_';


          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={cn(
                'flex items-center justify-center rounded-md aspect-square select-none transition-all duration-300 ease-in-out font-bold font-headline',
                // Base styles for all tiles
                'w-full h-full text-2xl sm:text-4xl md:text-5xl',
                
                // Styles for number tiles
                isNumber && 'bg-card text-card-foreground shadow-sm border',
                
                // Styles for blank tiles
                isBlank && 'bg-card/50 text-card-foreground shadow-inner border-2 border-dashed',

                // Styles for operator/equals tiles
                (isOperator || isEquals) && 'bg-secondary text-secondary-foreground text-3xl md:text-4xl',

                // Interaction styles for non-locked tiles
                !isReadOnly && !tile.isLocked && 'cursor-pointer hover:scale-105 active:scale-100',
                
                // State-based styles
                isSelected && 'z-10 scale-[1.08] tile-glow',
                shouldHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse',
                isReadOnly && 'cursor-default',
                tile.isLocked && 'cursor-not-allowed'
              )}
            >
              {tile.value === '*' ? <X className="h-1/2 w-1/2" /> : (isBlank ? <span className="text-muted-foreground">_</span> : String(tile.value))}
            </div>
          );
        })}
      </div>
      <div className="h-6 text-center mt-2">
          {!isReadOnly && !showIncorrect && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first tile to swap.</p>}
          {!isReadOnly && !showIncorrect && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second tile to swap.</p>}
          {isReadOnly && !showIncorrect && <p className="text-sm text-muted-foreground">&nbsp;</p>}
       </div>
    </div>
  );
}
