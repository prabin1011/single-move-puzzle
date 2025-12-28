'use client';

import { cn, getTileColor } from '@/lib/utils';
import { Board } from '@/lib/types';

interface TargetPatternProps {
  board: Board;
  size: number;
}

export function TargetPattern({ board, size }: TargetPatternProps) {
  if (size === 0) return null;
  
  return (
    <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Target Pattern</h3>
        <div
        className="grid gap-1 bg-card p-2 rounded-md shadow-md"
        style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
        >
        {board.map((tileValue, index) => (
            <div
            key={index}
            className={cn(
                'w-6 h-6 rounded-sm',
                getTileColor(tileValue)
            )}
            />
        ))}
        </div>
    </div>
  );
}
