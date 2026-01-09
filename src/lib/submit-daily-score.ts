
'use client';

import { doc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";

type GameId = "landmark" | "word-swap" | "symbol-puzzle" | "patterns" | "math";

type SubmitDailyScoreArgs = {
  firestore: Firestore;
  todayKey: string;
  gameId: GameId;
  user: User;
  timeTaken: number;
  hintsUsed: boolean;
  level?: number;
};

export async function submitDailyScore({
  firestore,
  todayKey,
  gameId,
  user,
  timeTaken,
  hintsUsed,
  level,
}: SubmitDailyScoreArgs) {
  // One entry per user per game per day (prevents duplicates)
  const entryId = `${gameId}_${user.uid}`;

  const entryRef = doc(firestore, `dailyLeaderboards/${todayKey}/entries/${entryId}`);

  await setDoc(entryRef, {
    userId: user.uid,
    userName: user.displayName || `Player ${user.uid.slice(0, 4)}`,
    gameId,
    level: typeof level === "number" ? level : null,
    timeTaken,
    hintsUsed,
    timestamp: serverTimestamp(),
    clientDateISO: new Date().toISOString(),
  });
}
