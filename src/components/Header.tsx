import React from 'react';
import { Plus, BookOpen } from 'lucide-react';

interface HeaderProps {
  isAddingItem: boolean;
  onToggleAdd: () => void;
}

export default function Header({ isAddingItem, onToggleAdd }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Book Inventory
              
            </h1>
          </div>
          <button
            onClick={onToggleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isAddingItem ? 'View Inventory' : (
              <>
                <Plus size={20} />
                
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}