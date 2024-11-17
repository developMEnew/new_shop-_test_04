import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection } from 'firebase/firestore';

export function useFirebaseConnection() {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'books'),
      {
        next: () => {
          setIsConnected(true);
          setConnectionChecked(true);
        },
        error: () => {
          setIsConnected(false);
          setConnectionChecked(true);
        }
      },
      (error) => {
        console.error('Firestore connection error:', error);
        setIsConnected(false);
        setConnectionChecked(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionChecked };
}