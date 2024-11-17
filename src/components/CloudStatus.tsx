import React from 'react';
import { Cloud, CloudOff, Database, Github } from 'lucide-react';
import toast from 'react-hot-toast';

interface CloudStatusProps {
  dbConnected: boolean;
  storageConnected: boolean;
}

export default function CloudStatus({ dbConnected, storageConnected }: CloudStatusProps) {
  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <div className="relative group">
        <Database 
          size={20} 
          className={dbConnected ? 'text-green-500' : 'text-red-500'} 
        />
        <div className="absolute hidden group-hover:block right-0 mt-1 bg-white p-2 rounded-md shadow-lg text-sm whitespace-nowrap">
          Firebase Database: {dbConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="relative group">
        <Github
          size={20}
          className={storageConnected ? 'text-green-500' : 'text-red-500'}
        />
        <div className="absolute hidden group-hover:block right-0 mt-1 bg-white p-2 rounded-md shadow-lg text-sm whitespace-nowrap">
          GitHub Storage: {storageConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
}