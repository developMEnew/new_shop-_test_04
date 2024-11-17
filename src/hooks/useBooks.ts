import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { BookItem } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

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

  const handleError = (err: unknown, fallbackMessage: string) => {
    let errorMessage = fallbackMessage;
    
    if (isSupabaseError(err)) {
      errorMessage = err.error.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    console.error(`Error: ${errorMessage}`, err);
    setError(new Error(errorMessage));
    toast.error(errorMessage);
    return new Error(errorMessage);
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
          const { error: initError } = await supabase.rpc('init_books_table');
          if (initError) throw initError;
          
          const { data: retryData, error: retryError } = await supabase
            .from('books')
            .select('*')
            .order('date_added', { ascending: false });
            
          if (retryError) throw retryError;
          setBooks(retryData || []);
        } else {
          throw error;
        }
      } else {
        setBooks(data || []);
      }
    } catch (err) {
      throw handleError(err, 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks().catch(() => {}); // Error is already handled in loadBooks

    const channel = supabase.channel('books_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'books' 
        }, 
        () => {
          loadBooks().catch(() => {});
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
        const file = await fetch(imageUrl).then(r => r.blob());
        const fileName = `book_${Date.now()}.${file.type.split('/')[1]}`;
        
        const { error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('book-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
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
        }])
        .select()
        .single();

      if (error) throw error;
      
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
        const file = await fetch(imageUrl).then(r => r.blob());
        const fileName = `book_${Date.now()}.${file.type.split('/')[1]}`;
        
        const { error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('book-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
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
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
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
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
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