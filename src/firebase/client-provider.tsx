'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider {...firebaseApp}>
      {children}
      <FirebaseErrorListener />
    </FirebaseProvider>
  );
}
