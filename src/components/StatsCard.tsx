import React from 'react';

interface StatsCardProps {
  totalItems: number;
  totalBooks: number;
}

export default function StatsCard({ totalItems, totalBooks }: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
        <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
      </div>
    </div>
  );
}