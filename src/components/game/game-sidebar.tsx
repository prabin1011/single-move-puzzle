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
import { Award, BrainCircuit, Lightbulb, Repeat, Timer, Zap } from 'lucide-react';
import { getStatsMessage } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';

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

  useEffect(() => {
    if (stats.levelsCompleted > 0) {
      setIsMessageLoading(true);
      getStatsMessage(stats).then(msg => {
        setAiMessage(msg);
        setIsMessageLoading(false);
      });
    } else {
      setAiMessage('');
    }
  }, [stats, stats.levelsCompleted]);


  const isLoading = gameStatus === 'loading';

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
        <Card>
            <CardHeader>
                <CardTitle>Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>
        
        <Card className="flex-grow">
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your puzzle-solving journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-muted-foreground"><BrainCircuit /> Levels Solved</span>
                    <span className="font-bold text-lg">{stats.levelsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-muted-foreground"><Timer /> Avg. Time</span>
                    <span className="font-bold text-lg">
                        {stats.levelsCompleted > 0 ? (stats.timeTaken / stats.levelsCompleted).toFixed(1) : 0}s
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-muted-foreground"><Zap /> Current Streak</span>
                    <span className="font-bold text-lg">{stats.currentStreak}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-muted-foreground"><Award /> Longest Streak</span>
                    <span className="font-bold text-lg">{stats.longestStreak}</span>
                </div>
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
                            {aiMessage || "Solve your first puzzle to get a motivational message!"}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
