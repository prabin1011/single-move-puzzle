
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGameTimer = (isRunning: boolean) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      if(startTimeRef.current) {
        setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTime(0);
    startTimeRef.current = null;
    if(isRunning) {
        start();
    }
  }, [isRunning, start, stop]);

  const getDuration = useCallback(() => {
    if (startTimeRef.current) {
      return Math.floor((Date.now() - startTimeRef.current) / 1000);
    }
    return time;
  }, [time]);
  
  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [isRunning, start, stop]);

  return { time, reset, stop, getDuration };
};
