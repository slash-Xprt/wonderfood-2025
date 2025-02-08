import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import MenuSection from '../components/MenuSection';
import Cart from '../components/Cart';
import Hero from '../components/Hero';

function StoreFront() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      <main className="pt-16">
        <Hero />
        <MenuSection />
      </main>
      <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </div>
  );
}

export default StoreFront;