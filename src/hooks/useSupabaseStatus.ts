import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export function useSupabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to access the books table or create it if it doesn't exist
        const { error: tableError } = await supabase
          .from('books')
          .select('id')
          .limit(1);

        if (tableError?.message?.includes('does not exist')) {
          const { error: createError } = await supabase.rpc('init_books_table');
          setIsConnected(!createError);
        } else {
          setIsConnected(!tableError);
        }
      } catch (error) {
        setIsConnected(false);
        console.error('Connection error:', error);
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