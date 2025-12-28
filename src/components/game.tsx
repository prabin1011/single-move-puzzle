'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const initialBoard = Array(3)
  .fill(null)
  .map(() => Array(3).fill(null));

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<(string | null)[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const handleStartGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setGameStarted(true);
  };

  const handleTileClick = (row: number, col: number) => {
    if (board[row][col] || !gameStarted) {
      return;
    }

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return currentPlayer;
        }
        return cell;
      })
    );

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">
          {gameStarted ? `Player ${currentPlayer}'s Turn` : 'Tic Tac Toe'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {!gameStarted ? (
          <Button onClick={handleStartGame}>Start Game</Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  className={cn(
                    'flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 text-4xl font-bold',
                    cell === 'X' ? 'text-blue-500' : 'text-red-500',
                    !cell && 'hover:bg-accent'
                  )}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
