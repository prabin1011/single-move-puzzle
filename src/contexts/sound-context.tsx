
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeSounds } from '@/lib/sounds';

interface SoundContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundOn, setIsSoundOn] = useState(true);

  // On initial mount, check localStorage for saved preference
  useEffect(() => {
    const savedState = localStorage.getItem('soundEnabled');
    if (savedState !== null) {
      setIsSoundOn(JSON.parse(savedState));
    }
    // Also initialize the sound files
    initializeSounds();
  }, []);

  const toggleSound = () => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);
    localStorage.setItem('soundEnabled', JSON.stringify(newState));
  };

  return (
    <SoundContext.Provider value={{ isSoundOn, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
