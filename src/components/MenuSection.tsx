import React, { useState } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { MenuList } from './MenuList';
import { menuItems, categories } from '../data/menu';
import { MenuItem } from '../types';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = menuItems.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="sticky top-16 bg-gray-50 z-10 pb-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative pb-[75%]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {item.price.toFixed(2)} €
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">{item.description}</p>
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-gray-900 text-white py-1.5 text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}