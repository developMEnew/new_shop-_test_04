import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { BookItem } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { SAMPLE_BOOKS } from '../utils/constants';

interface SupabaseErrorResponse {
  error: PostgrestError;
  data: null;
}

const isSupabaseError = (error: unknown): error is SupabaseErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    'data' in error &&
    error.data === null
  );
};

export function useBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleError = (err: unknown, fallbackMessage: string) => {
    let errorMessage = fallbackMessage;
    
    if (isSupabaseError(err)) {
      if (err.error.message.includes('policy')) {
        errorMessage = 'Database access error. Please try again.';
      } else {
        errorMessage = err.error.message;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    console.error(`Error: ${errorMessage}`, err);
    setError(new Error(errorMessage));
    toast.error(errorMessage);
    return new Error(errorMessage);
  };

  const uploadImage = async (imageFile: Blob): Promise<string> => {
    try {
      // Initialize storage if needed
      await initializeDatabase();

      const fileExt = imageFile.type.split('/')[1];
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('book-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('storage not initialized')) {
          await initializeDatabase();
          const { error: retryError, data: retryData } = await supabase.storage
            .from('book-images')
            .upload(fileName, imageFile, {
              cacheControl: '3600',
              upsert: false
            });
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('book-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const initializeDatabase = async () => {
    try {
      const { error: initError } = await supabase.rpc('init_books_table');
      if (initError) throw initError;
      return true;
    } catch (err) {
      console.error('Failed to initialize database:', err);
      return false;
    }
  };

  const loadBooks = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) {
        if (error.message.includes('does not exist')) {
          const initialized = await initializeDatabase();
          if (!initialized) throw new Error('Failed to initialize database');
          
          const { data: retryData, error: retryError } = await supabase
            .from('books')
            .select('*')
            .order('date_added', { ascending: false });
            
          if (retryError) throw retryError;
          setBooks(retryData || []);
        } else if (error.message.includes('policy')) {
          await initializeDatabase();
          throw error;
        } else {
          throw error;
        }
      } else {
        setBooks(data || []);
        setRetryCount(0);
      }
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadBooks(), 1000 * Math.pow(2, retryCount));
      } else {
        setBooks(SAMPLE_BOOKS);
        toast.error('Unable to connect to database. Showing sample data.');
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadBooks();

    const channel = supabase.channel('books_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'books' 
        }, 
        () => {
          loadBooks();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [loadBooks]);

  const addBook = async (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    try {
      setError(null);
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageUrl = await uploadImage(blob);
      }

      const { error } = await supabase
        .from('books')
        .insert([{
          title: bookData.title,
          purchase_price: bookData.purchasePrice,
          selling_price: bookData.sellingPrice,
          quantity: bookData.quantity,
          category: bookData.category,
          supplier: bookData.supplier,
          image_url: imageUrl,
        }]);

      if (error) {
        if (error.message.includes('policy')) {
          await initializeDatabase();
          throw error;
        } else {
          throw error;
        }
      }
      
      toast.success('Book added successfully');
      await loadBooks();
    } catch (err) {
      throw handleError(err, 'Failed to add book');
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookItem>) => {
    try {
      setError(null);
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl?.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageUrl = await uploadImage(blob);
      }

      const { error } = await supabase
        .from('books')
        .update({
          ...(bookData.title && { title: bookData.title }),
          ...(bookData.purchasePrice && { purchase_price: bookData.purchasePrice }),
          ...(bookData.sellingPrice && { selling_price: bookData.sellingPrice }),
          ...(bookData.quantity && { quantity: bookData.quantity }),
          ...(bookData.category && { category: bookData.category }),
          ...(bookData.supplier && { supplier: bookData.supplier }),
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq('id', id);

      if (error) {
        if (error.message.includes('policy')) {
          await initializeDatabase();
          throw error;
        } else {
          throw error;
        }
      }
      
      toast.success('Book updated successfully');
      await loadBooks();
    } catch (err) {
      throw handleError(err, 'Failed to update book');
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.message.includes('policy')) {
          await initializeDatabase();
          throw error;
        } else {
          throw error;
        }
      }
      
      toast.success('Book deleted successfully');
      await loadBooks();
    } catch (err) {
      throw handleError(err, 'Failed to delete book');
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refreshBooks: loadBooks,
  };
}