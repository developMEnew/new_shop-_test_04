import React, { useState } from 'react';
import { Package, Tag, Calendar, ImageIcon } from 'lucide-react';
import type { BookItem } from '../types';

interface ItemCardProps {
  book: BookItem;
  onEdit: (book: BookItem) => void;
}

export default function ItemCard({ book, onEdit }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatPrice = (price: number) => {
    return Number(price).toFixed(2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Ensure we have valid numeric values for prices
  const purchasePrice = typeof book.purchase_price === 'number' ? book.purchase_price : 
                       typeof book.purchasePrice === 'number' ? book.purchasePrice : 0;
  
  const sellingPrice = typeof book.selling_price === 'number' ? book.selling_price : 
                      typeof book.sellingPrice === 'number' ? book.sellingPrice : 0;

  // Get the correct image URL from either property
  const imageUrl = book.image_url || book.imageUrl;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        {imageError || !imageUrl ? (
          <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        ) : (
          <img 
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            book.quantity > 10 ? 'bg-green-100 text-green-800' : 
            book.quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            ප්‍රමාණය : {book.quantity || 0}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {book.title || 'Untitled Book'}
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 border-solid border-2 border-sky-200 rounded-xl p-1 px-2">
              <span className="text-sm font-medium">ගත්:</span>
              <span className="text-sm ml-1 ">RS.{formatPrice(purchasePrice)}</span>
            </div>
            <div className="text-gray-600 border-solid border-2 border-green-200 rounded-xl p-1 px-2">
              <span className="text-sm font-medium">විකිණීම:</span>
              <span className="text-sm ml-1">RS.{formatPrice(sellingPrice)}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Package size={16} className="mr-2" />
            <span className="text-sm">අලෙවිකරු : {book.supplier || 'Unknown supplier'}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Tag size={16} className="mr-2" />
            <span className="text-sm capitalize">වර්ගය : {book.category || 'Uncategorized'}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">{formatDate(book.date_added || book.dateAdded)}</span>
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