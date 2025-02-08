import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Cart from './Cart';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const cartProps = {
    items: cartItems,
    isOpen: isCartOpen,
    onClose: () => setIsCartOpen(false),
    onUpdateQuantity: updateQuantity,
    onRemoveItem: removeFromCart
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      <Outlet />
      <Cart {...cartProps} />
    </div>
  );
} 