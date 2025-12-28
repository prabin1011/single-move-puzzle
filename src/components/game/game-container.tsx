'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Puzzle,
  Stats,
  GameStatus,
  Board,
  SolutionMove,
} from '@/lib/types';
import { getNewPuzzle } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { GameBoard } from './game-board';
import { TargetPattern } from './target-pattern';
import { GameSidebar } from './game-sidebar';
import { GameStatusModal } from './game-status-modal';
import { useGameTimer } from '@/hooks/use-game-timer';
import { areBoardsEqual, applyUserMove } from './game-logic';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { AppLogo } from '../icons';

const INITIAL_STATS: Stats = {
  levelsCompleted: 0,
  timeTaken: 0,
  currentStreak: 0,
  longestStreak: 0,
};

export function GameContainer() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentBoard, setCurrentBoard] = useState<Board>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('initial');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hint, setHint] = useState<SolutionMove | null>(null);
  const { toast } = useToast();
  
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  
  const boardSize = useMemo(() => puzzle ? Math.sqrt(puzzle.initialBoardState.length) : 0, [puzzle]);

  const { time, reset: resetTimer } = useGameTimer(gameStatus === 'playing');

  const startNewGame = useCallback(async (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setGameStatus('loading');
    setDifficulty(newDifficulty);
    setHint(null);
    setSelectedIndices([]);

    const boardSizeConfig = { easy: 3, medium: 4, hard: 5 };
    const moveMechanics = ['swap', 'rotate', 'shift'] as const;
    
    try {
      const newPuzzle = await getNewPuzzle({
        difficulty: newDifficulty,
        boardSize: boardSizeConfig[newDifficulty],
        moveMechanic: moveMechanics[Math.floor(Math.random() * moveMechanics.length)],
      });
      setPuzzle(newPuzzle);
      setCurrentBoard(newPuzzle.initialBoardState);
      setGameStatus('playing');
      resetTimer();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not generate a new puzzle. Please try again.',
        variant: 'destructive',
      });
      setGameStatus('initial');
    }
  }, [toast, resetTimer]);

  const handleTileClick = (index: number) => {
    if (gameStatus !== 'playing' || !puzzle) return;
    
    if (puzzle.moveMechanic === 'swap') {
      const newSelected = [...selectedIndices, index];
      if (newSelected.length === 2) {
        const newBoard = applyUserMove(currentBoard, boardSize, puzzle.moveMechanic, newSelected);
        setCurrentBoard(newBoard);
        checkSolution(newBoard);
        setSelectedIndices([]);
      } else {
        setSelectedIndices(newSelected);
      }
    } else { // For rotate, flip, shift - one click is enough
      const newBoard = applyUserMove(currentBoard, boardSize, puzzle.moveMechanic, [index]);
      setCurrentBoard(newBoard);
      checkSolution(newBoard);
    }
  };

  const checkSolution = (board: Board) => {
    if (!puzzle) return;

    if (areBoardsEqual(board, puzzle.targetBoardState)) {
      setGameStatus('won');
      setStats(prevStats => {
        const newCurrentStreak = prevStats.currentStreak + 1;
        return {
          levelsCompleted: prevStats.levelsCompleted + 1,
          timeTaken: prevStats.timeTaken + time,
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(prevStats.longestStreak, newCurrentStreak),
        };
      });
    } else {
      setGameStatus('lost');
      setStats(prevStats => ({ ...prevStats, currentStreak: 0 }));
    }
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    setCurrentBoard(puzzle.initialBoardState);
    setSelectedIndices([]);
    setGameStatus('playing');
    setHint(null);
  };

  const showHint = () => {
    if (!puzzle) return;
    setHint(puzzle.solutionMove);
    toast({
      title: 'Hint Revealed!',
      description: 'The key move has been highlighted.',
    });
  }

  const isLoading = gameStatus === 'loading';

  return (
    <>
      <SidebarHeader className="flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
            <AppLogo className="w-8 h-8 text-accent" />
            <h1 className="text-xl font-semibold font-headline">Single Move Master</h1>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <GameSidebar
          stats={stats}
          difficulty={difficulty}
          onDifficultyChange={(d) => {
            setDifficulty(d);
            startNewGame(d);
          }}
          onNewGame={() => startNewGame(difficulty)}
          onShowHint={showHint}
          gameStatus={gameStatus}
        />
      </SidebarContent>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background">
        {isLoading && (
           <div className="flex flex-col items-center justify-center gap-4">
             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div>
             <p className="text-muted-foreground">
              Generating your puzzle...
             </p>
          </div>
        )}

        {!isLoading && gameStatus === 'initial' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-muted-foreground mb-6">Select a difficulty to start your first puzzle.</p>
            <Button onClick={() => startNewGame(difficulty)}>
              Start Game
            </Button>
          </div>
        )}

        {!isLoading && (gameStatus === 'playing' || gameStatus === 'lost' || gameStatus === 'won') && puzzle && (
          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
            <TargetPattern board={puzzle.targetBoardState} size={boardSize} />
            <GameBoard
              board={currentBoard}
              size={boardSize}
              onTileClick={handleTileClick}
              selectedIndices={selectedIndices}
              status={gameStatus}
              hint={hint}
              moveMechanic={puzzle.moveMechanic}
            />
          </div>
        )}
        
        <GameStatusModal
          status={gameStatus}
          onNext={() => startNewGame(difficulty)}
          onRetry={resetPuzzle}
        />
      </div>
    </>
  );
}
