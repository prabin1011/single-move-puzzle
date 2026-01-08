
'use client';

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import type { WithId } from '@/firebase';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  timeTaken: number;
  hintsUsed: boolean;
  timestamp: any;
}

export function useDailyLeaderboard(dateKey: string) {
  const firestore = useFirestore();
  const [entries, setEntries] = useState<WithId<LeaderboardEntry>[]>([]);
  const [loading, setLoading] = useState(true);

  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore || !dateKey) return null;
    return query(
      collection(firestore, `dailyLeaderboards/${dateKey}/entries`),
      orderBy("timeTaken", "asc")
    );
  }, [firestore, dateKey]);


  useEffect(() => {
    if (!leaderboardQuery) {
      setLoading(false);
      setEntries([]);
      return;
    };

    setLoading(true);
    const unsub = onSnapshot(leaderboardQuery, (snap) => {
      setEntries(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<LeaderboardEntry>))
      );
      setLoading(false);
    }, (error) => {
        console.error("Leaderboard snapshot error:", error);
        setLoading(false);
    });

    return () => unsub();
  }, [leaderboardQuery]);

  return { entries, loading };
}
