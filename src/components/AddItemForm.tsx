import React, { useState, useEffect } from 'react';
import { Package, Trash2 } from 'lucide-react';
import type { BookItem } from '../types';
import ImagePicker from './ImagePicker';

interface AddItemFormProps {
  book?: BookItem;
  onSubmit: (book: Omit<BookItem, 'id' | 'dateAdded'>) => void;
  onDelete?: (book: BookItem) => void;
  onCancel: () => void;
}

export default function AddItemForm({ book, onSubmit, onDelete, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    category: '',
    supplier: '',
    imageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        purchasePrice: (book.purchase_price || book.purchasePrice || 0).toString(),
        sellingPrice: (book.selling_price || book.sellingPrice || 0).toString(),
        quantity: (book.quantity || 0).toString(),
        category: book.category || '',
        supplier: book.supplier || '',
        imageUrl: book.image_url || book.imageUrl || ''
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      quantity: parseInt(formData.quantity) || 0,
      category: formData.category,
      supplier: formData.supplier,
      imageUrl: formData.imageUrl
    });
  };

  const handleDelete = () => {
    if (book && onDelete) {
      onDelete(book);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          {book && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Image
              </label>
              <ImagePicker
                selectedUrl={formData.imageUrl}
                onSelect={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="educational">Educational</option>
                <option value="children">Children</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  required
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Book</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{book?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}