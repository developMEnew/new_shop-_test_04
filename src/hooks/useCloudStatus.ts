import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Octokit } from '@octokit/rest';
import { GITHUB_CONFIG } from '../config/github';

const octokit = new Octokit({ auth: GITHUB_CONFIG.token });

export function useCloudStatus() {
  const [dbConnected, setDbConnected] = useState(false);
  const [storageConnected, setStorageConnected] = useState(false);

  useEffect(() => {
    const checkConnections = async () => {
      try {
        // Check Firestore connection
        await getDocs(collection(db, 'books'));
        setDbConnected(true);
      } catch (error) {
        console.error('Firestore connection error:', error);
        setDbConnected(false);
      }

      try {
        // Check GitHub connection
        await octokit.repos.get({
          owner: GITHUB_CONFIG.owner,
          repo: GITHUB_CONFIG.repo,
        });
        setStorageConnected(true);
      } catch (error) {
        console.error('GitHub connection error:', error);
        setStorageConnected(false);
      }
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { dbConnected, storageConnected };
}