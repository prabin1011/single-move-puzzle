'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTileColor } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const initialBoard = [
  [1, 2, 1],
  [2, 0, 2],
  [1, 2, 1],
];

const targetBoard = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const Board = ({ board, onTileClick, isTarget = false }: { board: number[][]; onTileClick?: (row: number, col: number) => void; isTarget?: boolean }) => (
  <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-2">
    {board.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          onClick={() => onTileClick?.(rowIndex, colIndex)}
          className={`flex h-16 w-16 items-center justify-center rounded-md text-4xl font-bold transition-colors ${getTileColor(cell)} ${onTileClick ? 'cursor-pointer hover:opacity-80' : ''}`}
        >
        </div>
      ))
    )}
  </div>
);

export default function Game() {
  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    checkSolution();
  }, [board]);

  const handleTileClick = (row: number, col: number) => {
    if (moves >= 1 || isSolved) return;

    // A simple move mechanic: flip the clicked tile and its neighbors
    const newBoard = board.map(r => [...r]);
    const flip = (r: number, c: number) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        newBoard[r][c] = (newBoard[r][c] + 1) % 4; // Cycle through a few colors
      }
    };
    
    flip(row, col);
    flip(row - 1, col); // North
    flip(row + 1, col); // South
    flip(row, col - 1); // West
    flip(row, col + 1); // East

    setBoard(newBoard);
    setMoves(moves + 1);
  };
  
  const checkSolution = () => {
    const solved = JSON.stringify(board) === JSON.stringify(targetBoard);
    if (solved) {
      setIsSolved(true);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setMoves(0);
    setIsSolved(false);
  };

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle>Single Move Puzzle</CardTitle>
        <CardDescription>Match the target pattern in just one move.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex w-full items-center justify-center gap-4">
           <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Your Board</p>
            <Board board={board} onTileClick={handleTileClick} />
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
           <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Target</p>
            <Board board={targetBoard} isTarget />
          </div>
        </div>

        {isSolved && <p className="font-bold text-green-600">Congratulations! You solved it!</p>}
        {moves >= 1 && !isSolved && <p className="font-bold text-red-600">Not quite! Try again.</p>}

      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetGame}>
          {isSolved || moves >= 1 ? 'Play Again' : 'Reset'}
        </Button>
      </CardFooter>
    </Card>
  );
}
