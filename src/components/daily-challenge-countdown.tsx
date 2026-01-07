'use client';

import { useState, useEffect } from 'react';

const getNextUTCMidnight = () => {
  const now = new Date();
  const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return nextMidnight;
};

export function DailyChallengeCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextMidnight = getNextUTCMidnight();
      const difference = nextMidnight.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`Resets in ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('New challenge available!');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-xs text-muted-foreground mt-2 text-center">
      {timeLeft}
    </p>
  );
}
