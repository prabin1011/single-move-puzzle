'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  CollectionReference,
  getDocs,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '..';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  listen?: boolean;
}

export const useCollection = <T extends DocumentData>(
  ref: Query | CollectionReference | null,
  options: UseCollectionOptions<T> = { listen: true }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);

    if (options.listen) {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
          setData(docs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      getDocs(ref)
        .then((snapshot) => {
          const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
          setData(docs);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setLoading(false);
        });
    }
  }, [ref, options.listen]);

  return { data, loading, error };
};
