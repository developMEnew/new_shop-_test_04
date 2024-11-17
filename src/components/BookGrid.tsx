import React from 'react';
import ItemCard from './ItemCard';
import type { BookItem } from '../types';

interface BookGridProps {
  books: BookItem[];
  onEditBook: (book: BookItem) => void;
}

export default function BookGrid({ books, onEditBook }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <ItemCard
          key={book.id}
          book={book}
          onEdit={onEditBook}
        />
      ))}
    </div>
  );
}