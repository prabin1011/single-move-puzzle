'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GameStatus, Stats } from '@/lib/types';
import { Award, BrainCircuit, Lightbulb, Repeat, Timer, Zap, LogIn, LogOut } from 'lucide-react';
import { getStatsMessage } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';
import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';

interface GameSidebarProps {
  stats: Stats;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onNewGame: () => void;
  onShowHint: () => void;
  gameStatus: GameStatus;
}

export function GameSidebar({
  stats,
  difficulty,
  onDifficultyChange,
  onNewGame,
  onShowHint,
  gameStatus
}: GameSidebarProps) {
  const [aiMessage, setAiMessage] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (stats.levelsCompleted > 0 && user) {
      setIsMessageLoading(true);
      getStatsMessage(stats).then(msg => {
        setAiMessage(msg);
        setIsMessageLoading(false);
      });
    } else {
      setAiMessage('');
    }
  }, [stats.levelsCompleted, user]);

  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const isLoading = gameStatus === 'loading' || userLoading;

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
        <Card>
            <CardHeader>
                <CardTitle>Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Difficulty</label>
                        <Select value={difficulty} onValueChange={onDifficultyChange} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy (3x3)</SelectItem>
                                <SelectItem value="medium">Medium (4x4)</SelectItem>
                                <SelectItem value="hard">Hard (5x5)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={onNewGame} className="w-full" disabled={isLoading}>
                        <Repeat className="mr-2" /> New Puzzle
                    </Button>
                     <Button variant="outline" onClick={onShowHint} className="w-full" disabled={gameStatus !== 'playing'}>
                        <Lightbulb className="mr-2" /> Get Hint
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="w-full">
                      <LogOut className="mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleLogin} className="w-full" disabled={userLoading}>
                    <LogIn className="mr-2" /> Login with Google
                  </Button>
                )}
            </CardContent>
        </Card>
        
        <Card className="flex-grow">
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  {user ? 'Track your puzzle-solving journey.' : 'Log in to save your progress.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              { userLoading ? (
                <>
                  <div className="flex justify-between items-center"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-8" /></div>
                  <div className="flex justify-between items-center"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-12" /></div>
                  <div className="flex justify-between items-center"><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-8" /></div>
                  <div className="flex justify-between items-center"><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-8" /></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-muted-foreground"><BrainCircuit /> Levels Solved</span>
                      <span className="font-bold text-lg">{user ? stats.levelsCompleted : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-muted-foreground"><Timer /> Avg. Time</span>
                      <span className="font-bold text-lg">
                          {user && stats.levelsCompleted > 0 ? (stats.timeTaken / stats.levelsCompleted).toFixed(1) : 0}s
                      </span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-muted-foreground"><Zap /> Current Streak</span>
                      <span className="font-bold text-lg">{user ? stats.currentStreak : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-muted-foreground"><Award /> Longest Streak</span>
                      <span className="font-bold text-lg">{user ? stats.longestStreak : 0}</span>
                  </div>
                </>
              )}
                <Separator className="my-4" />
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">AI Motivator</h4>
                    {isMessageLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            {aiMessage || (user ? "Solve your first puzzle to get a motivational message!" : "Log in to get personalized encouragement.")}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
