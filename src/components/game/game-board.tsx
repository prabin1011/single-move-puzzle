'use client';

import { motion } from 'framer-motion';
import { cn, getTileColor } from '@/lib/utils';
import { Board, GameStatus, MoveMechanic, SolutionMove } from '@/lib/types';

interface GameBoardProps {
  board: Board;
  size: number;
  onTileClick: (index: number) => void;
  selectedIndices: number[];
  status: GameStatus;
  hint: SolutionMove | null;
  moveMechanic: MoveMechanic;
}

const getHintIndices = (hint: SolutionMove | null, size: number): number[] => {
    if (!hint) return [];
    if(hint.details.indices) return hint.details.indices;
    if(hint.details.index) {
        if (hint.details.type === 'row') {
            return Array.from({length: size}, (_, i) => hint.details.index * size + i);
        }
        if (hint.details.type === 'col' || hint.details.type === 'column') {
            return Array.from({length: size}, (_, i) => hint.details.index + i * size);
        }
        return [hint.details.index];
    }
    return [];
}


export function GameBoard({ board, size, onTileClick, selectedIndices, status, hint, moveMechanic }: GameBoardProps) {
  if (size === 0) return null;
  const hintIndices = getHintIndices(hint, size);

  return (
    <div
      className="grid gap-2 bg-primary/50 p-4 rounded-lg shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
      }}
    >
      {board.map((tileValue, index) => {
        const isSelected = selectedIndices.includes(index);
        const isHinted = hintIndices.includes(index);
        const isDisabled = status !== 'playing' || tileValue === null;

        return (
          <button
            key={index}
            onClick={() => onTileClick(index)}
            disabled={isDisabled}
            className={cn(
              'aspect-square rounded-md flex items-center justify-center text-2xl font-bold text-primary-foreground transition-all duration-300 ease-in-out',
              getTileColor(tileValue),
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent',
              'disabled:cursor-not-allowed disabled:opacity-60',
              isSelected && 'ring-4 ring-accent ring-offset-2 ring-offset-background',
              isHinted && 'animate-pulse glow',
              status === 'playing' && 'hover:scale-105 hover:brightness-110'
            )}
          >
            {tileValue !== null ? tileValue : ''}
          </button>
        );
      })}
    </div>
  );
}
