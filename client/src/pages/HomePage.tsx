import React from 'react';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';

export default function HomePage() {
  const { addToCart } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  return (
    <main className="pt-16">
      <Hero />
      <MenuSection onAddToCart={handleAddToCart} />
    </main>
  );
} 