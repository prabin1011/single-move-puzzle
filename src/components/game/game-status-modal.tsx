'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GameStatus } from '@/lib/types';
import { PartyPopper, Frown } from 'lucide-react';

interface GameStatusModalProps {
  status: GameStatus;
  onNext: () => void;
  onRetry: () => void;
}

export function GameStatusModal({ status, onNext, onRetry }: GameStatusModalProps) {
  const isOpen = status === 'won' || status === 'lost';

  const handleNext = () => {
    onNext();
  };

  const handleRetry = () => {
    onRetry();
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            {status === 'won' ? (
                <>
                    <PartyPopper className="text-green-500" /> Puzzle Solved!
                </>
            ) : (
                <>
                    <Frown className="text-red-500" /> Incorrect Move
                </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status === 'won'
              ? "Great job! You've found the single move to solve the puzzle. Ready for the next challenge?"
              : "Not quite right. Remember, there's always a solution in a single move. Would you like to try again?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {status === 'won' ? (
            <AlertDialogAction onClick={handleNext}>Next Puzzle</AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleRetry}>Try Again</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
