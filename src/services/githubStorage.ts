import { Octokit } from '@octokit/rest';
import { encode, decode } from 'base-64';
import { GITHUB_CONFIG } from '../config/github';
import toast from 'react-hot-toast';
import type { BookItem } from '../types';

const octokit = new Octokit({ 
  auth: GITHUB_CONFIG.token,
  userAgent: 'book-inventory-app/1.0.0',
});

const handleGitHubError = (error: any, operation: string) => {
  console.error(`GitHub ${operation} error:`, error);
  
  if (error.status === 401) {
    const message = 'GitHub authentication failed. Please check your credentials.';
    toast.error(message);
    return new Error(message);
  }
  
  if (error.status === 403) {
    const message = 'GitHub API rate limit exceeded. Please try again later.';
    toast.error(message);
    return new Error(message);
  }
  
  if (error.status === 404) {
    return null; // Not found is handled specially in some cases
  }
  
  const message = `Failed to ${operation}. Please try again.`;
  toast.error(message);
  return new Error(message);
};

async function getFileSha(path: string): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path,
      ref: GITHUB_CONFIG.branch,
    });

    if ('sha' in response.data) {
      return response.data.sha;
    }
    return null;
  } catch (error: any) {
    return handleGitHubError(error, 'get file SHA');
  }
}

export async function uploadImageToGitHub(imageBlob: Blob, fileName: string): Promise<string> {
  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    reader.readAsDataURL(imageBlob);
    
    const base64Data = await base64Promise;
    const base64Content = base64Data.split(',')[1];
    
    const path = `${GITHUB_CONFIG.paths.images}/${fileName}`;
    const sha = await getFileSha(path);
    
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path,
      message: `Add image: ${fileName}`,
      content: base64Content,
      branch: GITHUB_CONFIG.branch,
      ...(sha && { sha }),
    });

    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${path}`;
  } catch (error: any) {
    handleGitHubError(error, 'upload image');
    throw error;
  }
}

export async function fetchBooks(): Promise<BookItem[]> {
  try {
    const sha = await getFileSha(GITHUB_CONFIG.paths.data);
    
    if (!sha) {
      await saveBooks([]);
      return [];
    }

    const response = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path: GITHUB_CONFIG.paths.data,
      ref: GITHUB_CONFIG.branch,
    });

    if (!('content' in response.data)) {
      throw new Error('Invalid response format');
    }

    const content = decode(response.data.content);
    const books = JSON.parse(content);
    return Array.isArray(books) ? books : [];
  } catch (error: any) {
    const handledError = handleGitHubError(error, 'fetch books');
    if (handledError === null) {
      return [];
    }
    throw handledError;
  }
}

export async function saveBooks(books: BookItem[]): Promise<void> {
  try {
    const content = JSON.stringify(books, null, 2);
    const sha = await getFileSha(GITHUB_CONFIG.paths.data);

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path: GITHUB_CONFIG.paths.data,
      message: sha ? 'Update books data' : 'Initialize books data',
      content: encode(content),
      branch: GITHUB_CONFIG.branch,
      ...(sha && { sha }),
    });
  } catch (error: any) {
    handleGitHubError(error, 'save books');
    throw error;
  }
}