'use client';
import { Board, MoveMechanic } from '@/lib/types';

export function areBoardsEqual(board1: Board, board2: Board): boolean {
  if (board1.length !== board2.length) return false;
  for (let i = 0; i < board1.length; i++) {
    if (board1[i] !== board2[i]) return false;
  }
  return true;
}

function applySwap(board: Board, indices: number[]): Board {
  const newBoard = [...board];
  if (indices.length === 2) {
    const [index1, index2] = indices;
    [newBoard[index1], newBoard[index2]] = [newBoard[index2], newBoard[index1]];
  }
  return newBoard;
}

function applyRotate(board: Board, size: number, index: number): Board {
    const newBoard = [...board];
    const isRow = Math.floor(index / size) === Math.floor((index+1) / size) -1; // Simplified check
    
    // For simplicity, we assume rotate clicks a tile, and we rotate its row clockwise.
    const rowIndex = Math.floor(index / size);
    const rowStart = rowIndex * size;
    const row = newBoard.slice(rowStart, rowStart + size);
    const lastElement = row.pop()!;
    row.unshift(lastElement);

    for(let i=0; i < size; i++) {
        newBoard[rowStart + i] = row[i];
    }
    
    return newBoard;
}

function applyShift(board: Board, size: number, index: number): Board {
    const newBoard = [...board];
    // Assume shift moves the row of the clicked tile to the right
    const rowIndex = Math.floor(index / size);
    const rowStart = rowIndex * size;
    const row = newBoard.slice(rowStart, rowStart + size);
    const lastElement = row.pop()!;
    row.unshift(lastElement);

     for(let i=0; i < size; i++) {
        newBoard[rowStart + i] = row[i];
    }
    return newBoard;
}

function applyFlip(board: Board, index: number): Board {
  const newBoard = [...board];
  // Example flip: increments value, wraps around at 9. Null is not flipped.
  if (newBoard[index] !== null) {
      newBoard[index] = ((newBoard[index] as number) + 1) % 9;
  }
  return newBoard;
}


export function applyUserMove(board: Board, boardSize: number, mechanic: MoveMechanic, indices: number[]): Board {
    switch(mechanic) {
        case 'swap':
            return applySwap(board, indices);
        case 'rotate':
            return applyRotate(board, boardSize, indices[0]);
        case 'shift':
            return applyShift(board, boardSize, indices[0]);
        case 'flip':
            return applyFlip(board, indices[0]);
        default:
            return board;
    }
}
