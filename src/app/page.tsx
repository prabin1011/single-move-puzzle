
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

export default function Home() {
  const router = useRouter();
  const [highestLevel, setHighestLevel] = useState(0);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const savedLevel = localStorage.getItem('highestLevel');
    if (savedLevel) {
      setHighestLevel(parseInt(savedLevel, 10));
    }
  }, []);

  useEffect(() => {
    // When auth is ready and there's no user, sign in anonymously.
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const handleNewGame = () => {
    localStorage.removeItem('currentLevelIndex');
    router.push('/play');
  };

  if (isUserLoading || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Connecting...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
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
            <Button size="lg" className="w-full" onClick={handleNewGame} disabled={isUserLoading}>
              New Game
            </Button>
            {highestLevel > 0 && (
              <Link href="/play" className="w-full">
                <Button size="lg" variant="secondary" className="w-full" disabled={isUserLoading}>
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
