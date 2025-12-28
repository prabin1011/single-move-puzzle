'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGameTimer = (isRunning: boolean) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    if(isRunning) {
        start();
    }
  }, [isRunning, start]);
  
  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [isRunning, start, stop]);

  return { time, reset, stop };
};
