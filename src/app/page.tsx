'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Loader2, Landmark, Calculator, Shapes, BookText, Sigma } from 'lucide-react';
import { levels } from '@/lib/levels';
import type { Level } from '@/lib/levels';
import { ThemeToggle } from '@/components/theme-toggle';
import { SoundToggle } from '@/components/sound-toggle';
import { useSound } from "@/contexts/sound-context";
import { playSound } from "@/lib/sounds";
import { trackEvent } from '@/lib/analytics';

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
  const [landmarkHighestLevel, setLandmarkHighestLevel] = useState(0);
  const [mathHighestLevel, setMathHighestLevel] = useState(0);
  const [patternsHighestLevel, setPatternsHighestLevel] = useState(0);
  const [wordSwapHighestLevel, setWordSwapHighestLevel] = useState(0);
  const [symbolHighestLevel, setSymbolHighestLevel] = useState(0);
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
    const savedLandmarkLevel = localStorage.getItem('highestLevel');
    if (savedLandmarkLevel) {
      setLandmarkHighestLevel(parseInt(savedLandmarkLevel, 10));
    }

    const savedMathLevel = localStorage.getItem('mathHighestLevel');
    if (savedMathLevel) {
        setMathHighestLevel(parseInt(savedMathLevel, 10));
    }

    const savedPatternLevel = localStorage.getItem('patternHighestLevel');
    if (savedPatternLevel) {
        setPatternsHighestLevel(parseInt(savedPatternLevel, 10));
    }

    const savedWordSwapLevel = localStorage.getItem('wordSwapHighestLevel');
    if (savedWordSwapLevel) {
        setWordSwapHighestLevel(parseInt(savedWordSwapLevel, 10));
    }

    const savedSymbolLevel = localStorage.getItem('symbolHighestLevel');
    if (savedSymbolLevel) {
        setSymbolHighestLevel(parseInt(savedSymbolLevel, 10));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // When auth is ready and there's no user, sign in anonymously.
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const handleNewGame = (game: 'landmark' | 'math' | 'patterns' | 'word-swap' | 'symbol-puzzle') => {
    playSound("ui", isSoundOn);
    trackEvent('game_start_new', { game });

    if (game === 'landmark') {
        const currentRound = parseInt(localStorage.getItem('gameRound') || '0', 10);
        localStorage.setItem('gameRound', (currentRound + 1).toString());
        localStorage.removeItem('currentLevelIndex');
        localStorage.removeItem('highestLevel');
        const newShuffledLevels = shuffle(levels);
        localStorage.setItem('shuffledLevels', JSON.stringify(newShuffledLevels));
        router.push('/games/one-move-landmark');
    } else if (game === 'math') {
        localStorage.removeItem('mathCurrentLevel');
        localStorage.removeItem('mathHighestLevel');
        router.push('/games/one-move-math');
    } else if (game === 'patterns') {
        localStorage.removeItem('patternCurrentLevel');
        localStorage.removeItem('patternHighestLevel');
        router.push('/games/one-move-patterns');
    } else if (game === 'word-swap') {
        localStorage.removeItem('wordSwapCurrentLevel');
        localStorage.removeItem('wordSwapHighestLevel');
        router.push('/games/word-swap');
    } else if (game === 'symbol-puzzle') {
        localStorage.removeItem('symbolCurrentLevel');
        localStorage.removeItem('symbolHighestLevel');
        router.push('/games/symbol-puzzle');
    }
  };
  
  const showLandmarkContinue = !isLoading && landmarkHighestLevel > 0;
  const showMathContinue = !isLoading && mathHighestLevel > 0;
  const showPatternsContinue = !isLoading && patternsHighestLevel > 0;
  const showWordSwapContinue = !isLoading && wordSwapHighestLevel > 0;
  const showSymbolContinue = !isLoading && symbolHighestLevel > 0;

  if (isUserLoading || !auth) {
    return (
      <main className="flex h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Connecting...</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <main className="flex flex-col items-center justify-center w-full">
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
                <Landmark className="h-10 w-10 text-primary shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold font-headline text-lg">Landmark Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Guess the swapped tiles in famous landmark photos.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button onClick={() => handleNewGame('landmark')} className="w-full">New Game</Button>
                  {showLandmarkContinue && (
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/games/one-move-landmark" onClick={() => playSound("ui", isSoundOn)}>
                        Continue (Lvl {landmarkHighestLevel + 1})
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

              {/* Game 2: One Move Math */}
              <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/50">
                <Calculator className="h-10 w-10 text-primary shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold font-headline text-lg">Math Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Solve the math equation in just one move.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button onClick={() => handleNewGame('math')} className="w-full">New Game</Button>
                  {showMathContinue && (
                    <Button asChild variant="secondary">
                      <Link href="/games/one-move-math" onClick={() => playSound("ui", isSoundOn)}>
                        Continue (Lvl {mathHighestLevel + 1})
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

              {/* Game 3: One Move Patterns */}
              <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/50">
                <Shapes className="h-10 w-10 text-primary shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold font-headline text-lg">Patterns Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Fix the broken pattern in just one move.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button onClick={() => handleNewGame('patterns')} className="w-full">New Game</Button>
                   {showPatternsContinue && (
                    <Button asChild variant="secondary">
                      <Link href="/games/one-move-patterns" onClick={() => playSound("ui", isSoundOn)}>
                        Continue (Lvl {patternsHighestLevel + 1})
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

              {/* Game 4: Word Swap Puzzle */}
              <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/50">
                <BookText className="h-10 w-10 text-primary shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold font-headline text-lg">Word Swap Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Fix the broken word relationships in one move.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button onClick={() => handleNewGame('word-swap')} className="w-full">New Game</Button>
                   {showWordSwapContinue && (
                    <Button asChild variant="secondary">
                      <Link href="/games/word-swap" onClick={() => playSound("ui", isSoundOn)}>
                        Continue (Lvl {wordSwapHighestLevel + 1})
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

               {/* Game 5: Symbol Puzzle */}
               <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/50">
                <Sigma className="h-10 w-10 text-primary shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold font-headline text-lg">Symbol Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Restore the logical sequence of abstract symbols.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button onClick={() => handleNewGame('symbol-puzzle')} className="w-full">New Game</Button>
                   {showSymbolContinue && (
                    <Button asChild variant="secondary">
                      <Link href="/games/symbol-puzzle" onClick={() => playSound("ui", isSoundOn)}>
                        Continue (Lvl {symbolHighestLevel + 1})
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

            </div>
          </CardContent>
        </Card>

        <footer className="w-full max-w-md mt-8 text-center">
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors" onClick={() => trackEvent('navigate_to_legal', { page: 'about' })}>About</Link>
            <span className="opacity-50">|</span>
            <Link href="/privacy" className="hover:text-primary transition-colors" onClick={() => trackEvent('navigate_to_legal', { page: 'privacy' })}>Privacy</Link>
            <span className="opacity-50">|</span>
            <Link href="/contact" className="hover:text-primary transition-colors" onClick={() => trackEvent('navigate_to_legal', { page: 'contact' })}>Contact</Link>
            <span className="opacity-50">|</span>
            <Link href="/disclaimer" className="hover:text-primary transition-colors" onClick={() => trackEvent('navigate_to_legal', { page: 'disclaimer' })}>Disclaimer</Link>
          </div>
           <p className="text-xs text-muted-foreground/50 mt-4">
              © {new Date().getFullYear()} One Move Puzzle. All Rights Reserved.
            </p>
        </footer>
      </main>
    </div>
  );
}
