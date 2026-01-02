'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Loader2 } from 'lucide-react';
import { levels } from '@/lib/levels';
import type { Level } from '@/lib/levels';
import { ThemeToggle } from '@/components/theme-toggle';

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;
  const arr = [...array];

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }

  return arr;
}


export default function Home() {
  const router = useRouter();
  const [highestLevel, setHighestLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const savedLevel = localStorage.getItem('highestLevel');
    if (savedLevel) {
      setHighestLevel(parseInt(savedLevel, 10));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // When auth is ready and there's no user, sign in anonymously.
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const handleNewGame = () => {
    // Increment the game round for image variations
    const currentRound = parseInt(localStorage.getItem('gameRound') || '0', 10);
    localStorage.setItem('gameRound', (currentRound + 1).toString());

    // Reset progress for the new game
    localStorage.removeItem('currentLevelIndex');
    localStorage.removeItem('highestLevel');

    // Create and save a new shuffled list for the new game
    const newShuffledLevels = shuffle(levels);
    localStorage.setItem('shuffledLevels', JSON.stringify(newShuffledLevels));
    router.push('/play');
  };
  
  const showContinue = !isLoading && highestLevel > 0;

  if (isUserLoading || !auth) {
    return (
      <main className="flex h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Connecting...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md text-center border-border shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <AppLogo className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Single Move Puzzle</CardTitle>
          <CardDescription className="text-lg text-muted-foreground px-4">
            A calm, educational puzzle game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-left space-y-2 px-6">
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Solve a simple visual puzzle.</span></p>
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Discover famous landmarks.</span></p>
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Learn a few fun facts.</span></p>
          </div>
          <div className="flex flex-col space-y-3 px-6">
            <Button size="lg" className="w-full" onClick={handleNewGame}>
              New Game
            </Button>
            {showContinue && (
              <Link href="/play" className="w-full">
                <Button size="lg" variant="secondary" className="w-full">
                  Continue (Level {highestLevel + 1})
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
