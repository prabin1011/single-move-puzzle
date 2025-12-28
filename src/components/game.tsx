'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PUZZLE_IMAGE = PlaceHolderImages[0];
const GRID_SIZE = 3;

// Generates the initial solved state of the board
const generateSolvedBoard = () => {
  const board = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    board.push(i);
  }
  return board;
};

// Scrambles the board by swapping two random tiles
const scrambleBoard = (board: number[]) => {
  const newBoard = [...board];
  const firstIndex = Math.floor(Math.random() * newBoard.length);
  let secondIndex = Math.floor(Math.random() * newBoard.length);
  
  // Ensure the second index is different from the first
  while (firstIndex === secondIndex) {
    secondIndex = Math.floor(Math.random() * newBoard.length);
  }

  // Swap the two tiles
  [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];
  return newBoard;
};

const SOLVED_BOARD = generateSolvedBoard();
const INITIAL_BOARD = scrambleBoard(SOLVED_BOARD);

const Board = ({
  board,
  onTileClick,
  imageUrl,
  gridSize,
  isTarget = false,
}: {
  board: number[];
  onTileClick?: (index: number) => void;
  imageUrl: string;
  gridSize: number;
  isTarget?: boolean;
}) => (
  <div
    className="grid gap-1 rounded-lg bg-muted p-1"
    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
  >
    {board.map((tileValue, boardIndex) => {
      const row = Math.floor(tileValue / gridSize);
      const col = tileValue % gridSize;
      const tileSize = 100 / (gridSize - 1);

      return (
        <div
          key={boardIndex}
          onClick={() => onTileClick?.(boardIndex)}
          className={`relative h-20 w-20 overflow-hidden rounded-md ${onTileClick ? 'cursor-pointer' : ''}`}
        >
          <Image
            src={imageUrl}
            alt={`Tile ${tileValue + 1}`}
            fill
            priority
            style={{
              objectFit: 'cover',
              objectPosition: `${col * tileSize}% ${row * tileSize}%`,
              transform: 'scale(1.55)', // Adjust scale to make each piece a close-up
            }}
            unoptimized // Prevents Next.js image optimization from changing the URL
          />
        </div>
      );
    })}
  </div>
);

export default function Game() {
  const [gameState, setGameState] = useState<'PREVIEW' | 'PLAYING'>('PREVIEW');
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      handleMove();
    }
  }, [selectedIndices]);

  useEffect(() => {
    if (moves > 0) {
      checkSolution();
    }
  }, [board, moves]);


  const handleTileClick = (index: number) => {
    if (moves >= 1 || isSolved || selectedIndices.includes(index)) return;

    setSelectedIndices([...selectedIndices, index]);
  };
  
  const handleMove = () => {
    if (selectedIndices.length !== 2 || moves >= 1) return;

    const newBoard = [...board];
    const [firstIndex, secondIndex] = selectedIndices;
    
    // Swap the tiles
    [newBoard[firstIndex], newBoard[secondIndex]] = [newBoard[secondIndex], newBoard[firstIndex]];

    setBoard(newBoard);
    setMoves(moves + 1);
    setSelectedIndices([]);
  };

  const checkSolution = () => {
    const solved = JSON.stringify(board) === JSON.stringify(SOLVED_BOARD);
    if (solved) {
      setIsSolved(true);
    }
  };

  const resetGame = () => {
    setBoard(scrambleBoard(SOLVED_BOARD));
    setMoves(0);
    setIsSolved(false);
    setSelectedIndices([]);
  };
  
  const startGame = () => {
    resetGame();
    setGameState('PLAYING');
  };

  if (gameState === 'PREVIEW') {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Picture Puzzle</CardTitle>
          <CardDescription>Memorize the image, then solve the puzzle in one move.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative h-64 w-64 rounded-lg overflow-hidden">
            <Image
              src={PUZZLE_IMAGE.imageUrl}
              alt="Full puzzle"
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={PUZZLE_IMAGE.imageHint}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={startGame}>Start Puzzle</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <CardTitle>Single Move Puzzle</CardTitle>
        <CardDescription>Find the two swapped pieces and swap them back.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex flex-col w-full items-center justify-center gap-4">
           <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Your Board</p>
            <Board 
              board={board} 
              onTileClick={handleTileClick} 
              imageUrl={PUZZLE_IMAGE.imageUrl}
              gridSize={GRID_SIZE}
            />
          </div>
        </div>

        {isSolved && <p className="font-bold text-green-600">Congratulations! You solved it!</p>}
        {moves >= 1 && !isSolved && <p className="font-bold text-red-600">Not quite! Try again.</p>}
        {selectedIndices.length > 0 && <p className="text-sm text-muted-foreground">Select a second tile to swap.</p>}

      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetGame}>
          {isSolved || moves >= 1 ? 'Play Again' : 'Reset'}
        </Button>
      </CardFooter>
    </Card>
  );
}
