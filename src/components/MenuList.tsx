import React from 'react';
import { MenuItem as MenuItemType } from '../types';

interface MenuListProps {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType) => void;
}

export function MenuList({ items, onAddToCart }: MenuListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold">{item.price.toFixed(2)} €</span>
              <button
                onClick={() => onAddToCart(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}