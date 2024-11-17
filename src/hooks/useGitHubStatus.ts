import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { GITHUB_CONFIG } from '../config/github';

const octokit = new Octokit({ auth: GITHUB_CONFIG.token });

export function useGitHubStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await octokit.repos.get({
          owner: GITHUB_CONFIG.owner,
          repo: GITHUB_CONFIG.repo,
        });
        setIsConnected(true);
      } catch (error) {
        console.error('GitHub connection error:', error);
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, connectionChecked };
}