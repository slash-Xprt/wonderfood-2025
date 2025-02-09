import React, { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { MenuItem } from '../types/menu';
import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';

export default function MenuSection() {
  const { products, loading, error, refreshProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const categories = [...new Set(products.map(item => item.category))];

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(item => item.category === category)
              .map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={addItem}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}