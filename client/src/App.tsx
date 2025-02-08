import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import Hero from './components/Hero';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import ProductsPanel from './components/ProductsPanel';
import { useCart } from './context/CartContext';
import { MenuItem } from './types';
import { useState } from 'react';

export default function App() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setIsCartOpen(true);
  };

  const cartProps = {
    items: cartItems,
    isOpen: isCartOpen,
    onClose: () => setIsCartOpen(false),
    onUpdateQuantity: updateQuantity,
    onRemoveItem: removeFromCart
  };

  return (
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
              <MenuSection onAddToCart={handleAddToCart} />
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
        <Cart {...cartProps} />
      </div>
    </Router>
  );
}