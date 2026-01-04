'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { PatternPuzzle, Tile } from '@/lib/pattern-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';
import { Circle, Square, Triangle, Diamond, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface PuzzleBoardProps {
  puzzle: PatternPuzzle;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
}

const colorMap = {
  blue: 'text-blue-500',
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-400',
  purple: 'text-purple-500',
  empty: 'text-transparent',
};

const shapeMap = {
    circle: Circle,
    square: Square,
    triangle: Triangle,
    diamond: Diamond,
    empty: null,
};

const directionMap = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
    empty: null,
}

export default function PuzzleBoard({
  puzzle,
  onSuccess,
  onFail,
  isReadOnly = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState<Tile[]>(puzzle.grid);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || selectedIndices.length >= 2 || showIncorrect) {
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
          const shouldHighlight = showIncorrect && selectedIndices.includes(index);
          
          const ShapeComponent = shapeMap[tile.shape];
          const DirectionComponent = directionMap[tile.direction];

          return (
            <div
              key={tile.id}
              onClick={() => handleTileClick(index)}
              className={cn(
                'flex items-center justify-center rounded-md aspect-square select-none transition-all duration-300 ease-in-out bg-card border',
                !isReadOnly && 'cursor-pointer hover:scale-105 active:scale-100',
                isSelected && 'z-10 scale-[1.08] tile-glow',
                shouldHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse',
                isReadOnly && 'cursor-default'
              )}
            >
              <div className={cn('h-2/3 w-2/3', colorMap[tile.color])}>
                {ShapeComponent && <ShapeComponent className="h-full w-full" strokeWidth={3} />}
                {DirectionComponent && <DirectionComponent className="h-full w-full" strokeWidth={3} />}
              </div>
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
