import React from 'react';
import { Package } from 'lucide-react';
import type { BookItem } from '../types';

interface ItemCardProps {
  book: BookItem;
  onEdit: (book: BookItem) => void;
}

export default function ItemCard({ book, onEdit }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <img 
        src={book.imageUrl} 
        alt={book.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            book.quantity > 10 ? 'bg-green-100 text-green-800' : 
            book.quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            Stock: {book.quantity}
          </span>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">
              <span className="text-sm">Buy: ${book.purchasePrice}</span>
            </div>
            <div className="text-gray-600">
              <span className="text-sm">Sell: ${book.sellingPrice}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Package size={16} className="mr-2" />
            <span className="text-sm">{book.supplier}</span>
          </div>
        </div>

        <button
          onClick={() => onEdit(book)}
          className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Edit Item
        </button>
      </div>
    </div>
  );
}