
'use client';

import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useMemo } from 'react';
import { DailyChallengeCountdown } from './daily-challenge-countdown';

interface DailyLeaderboardProps {
  date: string;
  currentUserTime?: number;
}

export function DailyLeaderboard({ date, currentUserTime }: DailyLeaderboardProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const leaderboardCollectionRef = collection(firestore, `dailyLeaderboards/${date}/entries`);

  // Memoize the query to prevent re-renders
  const leaderboardQuery = useMemoFirebase(() => {
    return query(leaderboardCollectionRef, orderBy('timeTaken', 'asc'), limit(10));
  }, [leaderboardCollectionRef]);

  const { data: entries, isLoading, error } = useCollection<{
    userId: string;
    userName: string;
    timeTaken: number;
    hintsUsed: boolean;
  }>(leaderboardQuery);

  const hasUserSubmitted = useMemo(() => {
    if (!user || !entries) return false;
    return entries.some(entry => entry.userId === user.uid);
  }, [user, entries]);

  // Submit score for the current user if they have a time and haven't submitted yet
  useEffect(() => {
    if (currentUserTime && user && !hasUserSubmitted && firestore) {
      const entry = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        timeTaken: currentUserTime,
        hintsUsed: false, // Assuming no hints for now
        timestamp: new Date().toISOString(),
      };
      addDoc(leaderboardCollectionRef, entry);
    }
  }, [currentUserTime, user, hasUserSubmitted, leaderboardCollectionRef, firestore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading Leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive text-center p-4">Could not load leaderboard.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-headline">Today's Leaderboard</CardTitle>
        <CardDescription className="text-xs">Top 10 players for {date}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries && entries.length > 0 ? (
              entries.map((entry, index) => (
                <TableRow key={entry.id} className={cn(user && entry.userId === user.uid && 'bg-primary/20')}>
                  <TableCell className="font-medium text-center">{index + 1}</TableCell>
                  <TableCell>{entry.userName}</TableCell>
                  <TableCell className="text-right">{entry.timeTaken}s</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No one has completed the challenge yet. Be the first!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DailyChallengeCountdown />
      </CardContent>
    </Card>
  );
}
