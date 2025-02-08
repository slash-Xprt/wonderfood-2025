import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import Hero from './components/Hero';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import ProductsPanel from './components/ProductsPanel';
import { CartProvider } from './context/CartContext';
import { CartItem, MenuItem } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCartItems(current => {
      const existingItem = current.find(i => i.id === item.id);
      if (existingItem) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(current =>
      current.map(item =>
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(current => current.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
          <Routes>
            <Route path="/" element={
              <main className="pt-16">
                <Hero />
                <MenuSection onAddToCart={addToCart} />
              </main>
            } />
            <Route path="/checkout" element={
              <Checkout 
                items={cartItems}
                onOrderComplete={clearCart}
              />
            } />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products" element={<ProductsPanel />} />
            <Route path="/confirmation" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande Confirmée</h1>
                  <p className="text-gray-600 mb-6">
                    Merci pour votre commande ! Nous vous contacterons bientôt pour confirmer les détails.
                  </p>
                  <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            } />
          </Routes>
          <Cart
            items={cartItems}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;