
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { WordSwapPuzzle, WordRelationType } from '@/lib/word-swap-puzzles';
import { playSound } from '@/lib/sounds';
import { useSound } from '@/contexts/sound-context';
import { ArrowRight } from 'lucide-react';


const relationSymbols: Record<WordRelationType, string> = {
    synonym: '≈',
    antonym: '≠',
    category: '∈',
    plural: '→',
    past_tense: '→',
    noun_adj: '→',
    analogy: ':',
    function: '∴',
};


interface PuzzleBoardProps {
  puzzle: WordSwapPuzzle;
  relationType: WordRelationType;
  onSuccess: () => void;
  onFail: () => void;
  isReadOnly?: boolean;
  showSolution?: boolean;
}

export default function PuzzleBoard({
  puzzle,
  relationType,
  onSuccess,
  onFail,
  isReadOnly = false,
  showSolution = false,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState(puzzle.pairs);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const { isSoundOn } = useSound();
  
  const handleTileClick = (index: number) => {
    if (isReadOnly || selectedIndices.length >= 2 || isIncorrect) {
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
      const [first, second] = selectedIndices.sort((a, b) => a - b);
      const [sol1, sol2] = puzzle.solutionIndices.sort((a,b) => a - b);
      
      if (first === sol1 && second === sol2) {
        playSound('swap', isSoundOn);
        const newBoard = [...board];
        const temp = newBoard[first].right;
        newBoard[first].right = newBoard[second].right;
        newBoard[second].right = temp;
        setBoard(newBoard);
        setSelectedIndices([]); 
        
        setTimeout(() => onSuccess(), 500);
      } else {
        setIsIncorrect(true);
        setTimeout(() => {
          onFail();
          setSelectedIndices([]); 
          setIsIncorrect(false);
        }, 800);
      }
  }, [selectedIndices, puzzle.solutionIndices, onSuccess, onFail, board, isSoundOn]);


  useEffect(() => {
    if (selectedIndices.length === 2 && !isReadOnly) {
      const timer = setTimeout(checkSolution, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndices, checkSolution, isReadOnly]);

  useEffect(() => {
    setBoard(puzzle.pairs);
    setSelectedIndices([]);
    setIsIncorrect(false);
  }, [puzzle.id]);


  return (
    <div className="flex flex-col items-center gap-3 w-full">
        {board.map((pair, index) => {
            const isSelected = selectedIndices.includes(index);
            const shouldHighlight = isIncorrect && selectedIndices.includes(index);
            const isSolutionTile = showSolution && puzzle.solutionIndices.includes(index);

            return (
                <div key={index} className="flex items-center justify-between w-full max-w-md gap-2">
                    <div className="flex-1 text-right p-2 rounded-md bg-secondary text-secondary-foreground font-semibold text-lg truncate">
                        {pair.left}
                    </div>
                    <div className="text-muted-foreground font-bold text-lg">
                        {relationSymbols[relationType] || ':'}
                    </div>
                    <div 
                        onClick={() => handleTileClick(index)}
                        className={cn(
                            'flex-1 text-left p-2 rounded-md font-semibold text-lg truncate transition-all duration-300 ease-in-out',
                            'bg-card text-card-foreground shadow-sm border',
                            !isReadOnly && 'cursor-pointer hover:scale-105 active:scale-100',
                            isSelected && 'z-10 scale-[1.08] tile-glow',
                            shouldHighlight && 'z-10 ring-4 ring-red-500 ring-offset-2 ring-offset-background animate-pulse',
                            isSolutionTile && 'z-10 ring-4 ring-green-500 ring-offset-2 ring-offset-background',
                            isReadOnly && 'cursor-default'
                        )}
                    >
                         {pair.right}
                    </div>
                </div>
            )
        })}
      <div className="h-6 text-center mt-2">
          {!isReadOnly && !isIncorrect && selectedIndices.length === 0 && <p className="text-sm text-muted-foreground">Select the first word to swap.</p>}
          {!isReadOnly && !isIncorrect && selectedIndices.length === 1 && <p className="text-sm text-muted-foreground">Select the second word.</p>}
          {isReadOnly && !isIncorrect && !showSolution && <p className="text-sm text-muted-foreground">&nbsp;</p>}
          {showSolution && <p className="text-sm text-success animate-pulse">This was the correct pairing.</p>}
       </div>
    </div>
  );
}
