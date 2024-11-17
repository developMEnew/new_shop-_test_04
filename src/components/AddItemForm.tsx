import React, { useState, useEffect } from "react";
import { Package, Trash2 } from "lucide-react";
import type { BookItem } from "../types";
import ImagePicker from "./ImagePicker";

interface AddItemFormProps {
  book?: BookItem;
  onSubmit: (book: Omit<BookItem, "id" | "dateAdded">) => void;
  onDelete?: (book: BookItem) => void;
  onCancel: () => void;
}

export default function AddItemForm({
  book,
  onSubmit,
  onDelete,
  onCancel,
}: AddItemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    category: "",
    supplier: "",
    imageUrl: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        purchasePrice: (
          book.purchase_price ||
          book.purchasePrice ||
          0
        ).toString(),
        sellingPrice: (book.selling_price || book.sellingPrice || 0).toString(),
        quantity: (book.quantity || 0).toString(),
        category: book.category || "",
        supplier: book.supplier || "",
        imageUrl: book.image_url || book.imageUrl || "",
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
      imageUrl: formData.imageUrl,
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
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {book ? "Edit Book" : "Add New Book"}
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
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
                onSelect={(url) =>
                  setFormData((prev) => ({ ...prev, imageUrl: url }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <optgroup label="පොත්">
                  <option value="a5-exercise-books">A5 exercise පොත්</option>
                  <option value="a4-cr-books">A4 CR පොත්</option>
                  <option value="b5-books">B5 පොත්</option>
                  <option value="a5-practical-books">A5 පද්ධති පොත්</option>
                  <option value="notebooks">නෝට්බුක්</option>
                  <option value="a4-drawing-books">A4 සිතුවිලි පොත්</option>
                  <option value="a4-science-books">A4 විද්‍යා පොත්</option>
                  <option value="a4-cr-practical-book">
                    A4 CR පද්ධති පොත්
                  </option>
                  <option value="diaries">දිවානුව</option>
                  <option value="planners">සංවිධානය</option>
                  <option value="story-books">කතා පොත්</option>
                </optgroup>

                <optgroup label="පෙන්ස්">
                  <option value="ball-point-pens">බෝල පින්පත</option>
                  <option value="gel-pens">ජෙල් පෙන්</option>
                  <option value="glitter-pens">ග්ලිටර් පෙන්</option>
                  <option value="fountain-pens">ෆවුන්ටන් පෙන්</option>
                  <option value="marker-pens">මාර්කර් පෙන්</option>
                  <option value="whiteboard-pens">වයිට්බෝර්ඩ් පෙන්</option>
                  <option value="erasable-pens">මකාදැමිය හැකි පෙන්</option>
                </optgroup>

                <optgroup label="බෝතල් සහ කොටස්">
                  <option value="straw-bottles-kids">දරුවන් සඳහා බෝතල්</option>
                  <option value="screw-cap-bottles">ස්ක්‍රූ කැප් බෝතල්</option>
                  <option value="flip-cap-bottles">ෆ්ලිප් කැප් බෝතල්</option>
                  <option value="squeezable-bottles">
                    ඉඟිලි වලට සකස් කළ බෝතල්
                  </option>
                  <option value="easy-open-boxes">
                    ඉක්මන් විවෘත කිරීම් කොටස්
                  </option>
                  <option value="sealed-boxes">සීල් කරන කොටස්</option>
                  <option value="partitioned-boxes">පැතිකඩ සහිත කොටස්</option>
                  <option value="water-bottles">ජල බෝතල්</option>
                  <option value="lunch-boxes">ඉවක්කූ කොටස්</option>
                  <option value="storage-boxes">සැම්ප්ල මෘදු කොටස්</option>
                </optgroup>

                <optgroup label="වර්ණ නිෂ්පාදන">
                  <option value="pastel">පැස්ටල්</option>
                  <option value="colour-pencil">වර්ණ පෙන්සල</option>
                  <option value="water-colours">ජල වර්ණ</option>
                  <option value="felt-pens">ෆෙල්ට් පෙන්</option>
                  <option value="poster-colours">පෝස්ටර් වර්ණ</option>
                  <option value="crayons">ක්‍රයෝන්</option>
                  <option value="oil-paints">තෙල් වර්ණ</option>
                  <option value="acrylic-paints">ඇක්‍රිලික වර්ණ</option>
                  <option value="highlighters">අයිල්යිට් පෙන්</option>
                </optgroup>

                <optgroup label="කාර්යාල නිෂ්පාදන">
                  <option value="files">ෆයිල්</option>
                  <option value="calculators">ගණනයකාරක</option>
                  <option value="correction-pens">හෝඳුන් පෙන්</option>
                  <option value="staplers-and-pins">ස්ටේපලර් සහ පින්</option>
                  <option value="paper-clips">කඩදාසි කලිප්</option>
                  <option value="envelopes">සැරැස්ලි</option>
                  <option value="folders">ෆෝල්ඩර්</option>
                </optgroup>

                <optgroup label="පාසල් නිෂ්පාදන">
                  <option value="pencil">පෙන්සල</option>
                  <option value="glue">ලොකු ගල</option>
                  <option value="scissors">පේරා</option>
                  <option value="sharpeners">පෙන්සල ශාප්පනය</option>
                  <option value="rulers">මානකුරු</option>
                  <option value="erasers">මකාදැමීම</option>
                  <option value="kids-clay">දරුවන්ට ගල</option>
                  <option value="math-boxes">ගණිත පෙට්ටිය</option>
                  <option value="geometry-kits">ජ්‍යෝතිශ්‍ය කට්ටල</option>
                </optgroup>

                <optgroup label="කා纸 නිෂ්පාදන">
                  <option value="copy-papers">පිටපත පත්‍ර</option>
                  <option value="colour-papers">වර්ණ පත්‍ර</option>
                  <option value="exam-sheets">පරීක්ෂණ පත්‍ර</option>
                  <option value="foolscap-papers">ෆුල්ස්කැප් පත්‍ර</option>
                  <option value="writing-pads">ලේඛන පෑඩ්</option>
                  <option value="sticky-notes">ස්ටික් මතක පත</option>
                  <option value="notepads">නෝට්පැඩ්</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <div className="relative">
                <Package
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  required
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purchasePrice: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sellingPrice: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                }
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
              {book ? "Update Book" : "Add Book"}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Book
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{book?.title}"? This action
              cannot be undone.
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
