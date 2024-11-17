import React, { useState } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import BookGrid from './components/BookGrid';
import AddItemForm from './components/AddItemForm';
import ConnectionStatus from './components/ConnectionStatus';
import LoadingSpinner from './components/LoadingSpinner';
import { useSupabaseStatus } from './hooks/useSupabaseStatus';
import { useBooks } from './hooks/useBooks';
import { Toaster } from 'react-hot-toast';
import type { BookItem } from './types';

export default function App() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | undefined>();
  const { isConnected, connectionChecked } = useSupabaseStatus();
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();

  const handleAddBook = async (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    await addBook(bookData);
    setIsAddingItem(false);
  };

  const handleEditBook = async (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    if (editingBook) {
      await updateBook(editingBook.id, bookData);
      setEditingBook(undefined);
      setIsAddingItem(false);
    }
  };

  const handleDeleteBook = async (book: BookItem) => {
    await deleteBook(book.id);
    setEditingBook(undefined);
    setIsAddingItem(false);
  };

  const totalItems = books.reduce((sum, book) => sum + book.quantity, 0);
  const totalBooks = books.length;

  if (!connectionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAddingItem={isAddingItem}
        onToggleAdd={() => {
          setIsAddingItem(!isAddingItem);
          setEditingBook(undefined);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAddingItem || editingBook ? (
          <AddItemForm
            book={editingBook}
            onSubmit={editingBook ? handleEditBook : handleAddBook}
            onDelete={handleDeleteBook}
            onCancel={() => {
              setIsAddingItem(false);
              setEditingBook(undefined);
            }}
          />
        ) : (
          <>
            <StatsCard totalItems={totalItems} totalBooks={totalBooks} />
            {loading ? (
              <LoadingSpinner />
            ) : (
              <BookGrid 
                books={books}
                onEditBook={(book) => {
                  setEditingBook(book);
                  setIsAddingItem(true);
                }}
              />
            )}
          </>
        )}
      </main>

      <ConnectionStatus isConnected={isConnected} />
      <Toaster />
    </div>
  );
}