
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Loader2, Landmark, Calculator } from 'lucide-react';
import { levels } from '@/lib/levels';
import type { Level } from '@/lib/levels';
import { ThemeToggle } from '@/components/theme-toggle';
import { SoundToggle } from '@/components/sound-toggle';
import { useSound } from "@/contexts/sound-context";
import { playSound } from "@/lib/sounds";

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
  const { isSoundOn } = useSound();

  useEffect(() => {
    if (isSoundOn) {
      playSound("start", true);
    }
  }, [isSoundOn]);

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
    playSound("ui", isSoundOn);
    // Increment the game round for image variations
    const currentRound = parseInt(localStorage.getItem('gameRound') || '0', 10);
    localStorage.setItem('gameRound', (currentRound + 1).toString());

    // Reset progress for the new game
    localStorage.removeItem('currentLevelIndex');
    localStorage.removeItem('highestLevel');

    // Create and save a new shuffled list for the new game
    const newShuffledLevels = shuffle(levels);
    localStorage.setItem('shuffledLevels', JSON.stringify(newShuffledLevels));
    router.push('/games/one-move-landmark');
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <SoundToggle />
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md text-center border-border shadow-2xl bg-card">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary overflow-hidden">
            <Image src="/logo.png" alt="One Move Puzzle Logo" width={64} height={64} />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">One Move Puzzle</CardTitle>
          <CardDescription className="text-lg text-muted-foreground px-4">
            A collection of calm, educational puzzle games.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-4 px-6">

            {/* Game 1: One Move Landmark */}
            <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
              <Landmark className="h-10 w-10 text-primary hidden sm:block" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold font-headline text-lg">Landmark Puzzle</h3>
                <p className="text-sm text-muted-foreground">Guess the swapped tiles in famous landmark photos.</p>
              </div>
              <div className="flex flex-col space-y-2 w-full sm:w-auto">
                <Button onClick={handleNewGame} className="w-full">New Game</Button>
                {showContinue && (
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/games/one-move-landmark" onClick={() => playSound("ui", isSoundOn)}>
                      Continue (Lvl {highestLevel + 1})
                    </Link>
                  </Button>
                )}
              </div>
            </Card>

            {/* Game 2: One Move Math */}
            <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/50">
              <Calculator className="h-10 w-10 text-primary hidden sm:block" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold font-headline text-lg">Math Puzzle</h3>
                <p className="text-sm text-muted-foreground">Solve the math equation in just one move.</p>
              </div>
              <div className="flex flex-col space-y-2 w-full sm:w-auto">
                <Button asChild>
                  <Link href="/games/one-move-math" onClick={() => playSound("ui", isSoundOn)}>
                    Play Now
                  </Link>
                </Button>
              </div>
            </Card>

          </div>
        </CardContent>
      </Card>
    </main>
  );
}
