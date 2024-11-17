import React from 'react';
import { Database } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const [showBanner, setShowBanner] = React.useState(!isConnected);

  React.useEffect(() => {
    if (!isConnected) {
      setShowBanner(true);
      toast.error('Database connection lost! Showing sample data.', {
        duration: 4000,
        position: 'bottom-center',
      });
    } else {
      setShowBanner(false);
    }
  }, [isConnected]);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
      <Database size={20} />
      <span className="font-medium">Offline mode - Showing sample data</span>
      <button 
        onClick={() => setShowBanner(false)}
        className="ml-4 bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
      >
        Dismiss
      </button>
    </div>
  );
}