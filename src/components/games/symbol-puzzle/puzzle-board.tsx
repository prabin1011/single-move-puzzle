
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { SymbolPuzzle, SymbolTile } from '@/lib/symbol-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';

interface PuzzleBoardProps {
  puzzle: SymbolPuzzle;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
  showSolution?: boolean;
}

const colorMap = {
  blue: 'text-blue-500',
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-400',
  purple: 'text-purple-500',
  none: 'text-foreground',
};

export default function PuzzleBoard({
  puzzle,
  onSuccess,
  onFail,
  isReadOnly = false,
  showSolution = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState<SymbolTile[]>(puzzle.grid);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || selectedIndices.length >= 2 || showIncorrect || showSolution) {
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
      const [first, second] = selectedIndices;
      const [sol1, sol2] = puzzle.solution.indices;
      
      const isCorrectSwap = (first === sol1 && second === sol2) || (first === sol2 && second === sol1);
      
      if (isCorrectSwap) {
        playSound('swap', isSoundOn);
        const newBoard = [...board];
        [newBoard[first], newBoard[second]] = [newBoard[second], newBoard[first]];
        setBoard(newBoard);
        setSelectedIndices([]); 
        
        setTimeout(() => onSuccess(), 500);
      } else {
        setShowIncorrect(true);
        setTimeout(() => {
          onFail();
          setSelectedIndices([]); 
          setShowIncorrect(false);
        }, 800);
      }
  }, [selectedIndices, puzzle.solution.indices, onSuccess, onFail, board, isSoundOn]);


  useEffect(() => {
    if (selectedIndices.length === 2 && !isReadOnly) {
      const timer = setTimeout(checkSolution, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, checkSolution, isReadOnly]);

  useEffect(() => {
    setBoard(puzzle.grid);
    setSelectedIndices([]);
    setShowIncorrect(false);
  }, [puzzle.id]);
  
  const gridSize = Math.sqrt(board.length);

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2">
      <div
        className="grid gap-1 sm:gap-2 rounded-lg bg-muted/20 p-1 sm:p-2 shadow-inner w-full max-w-sm"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {board.map((tile, index) => {
          const isSelected = selectedIndices.includes(index);
          const showIncorrectHighlight = showIncorrect && selectedIndices.includes(index);
          const showSolutionHighlight = showSolution && puzzle.solution.indices.includes(index);

          return (
            <div
              key={tile.id}
              onClick={() => handleTileClick(index)}
              className={cn(
                'flex items-center justify-center rounded-md aspect-square select-none transition-all duration-300 ease-in-out bg-card border text-3xl sm:text-4xl font-mono',
                !isReadOnly && !showSolution && 'cursor-pointer hover:scale-105 active:scale-100',
                isSelected && 'z-10 scale-[1.08] tile-glow',
                showIncorrectHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse',
                showSolutionHighlight && 'z-10 tile-glow', // Use green glow for correct solution
                isReadOnly && 'cursor-default'
              )}
            >
              <span className={cn(colorMap[tile.color])}>
                {tile.symbol}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6 text-center mt-2">
          {!isReadOnly && !showIncorrect && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first symbol to swap.</p>}
          {!isReadOnly && !showIncorrect && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second symbol to swap.</p>}
          {isReadOnly && !showIncorrect && !showSolution && <p className="text-sm text-muted-foreground">&nbsp;</p>}
          {showSolution && <p className="text-sm text-success animate-pulse">This was the correct swap.</p>}
       </div>
    </div>
  );
}
