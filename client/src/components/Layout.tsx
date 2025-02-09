import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Cart from './Cart';
import { useCart } from '../hooks/useCart';

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Calculate total number of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartProps = {
    items: cartItems,
    isOpen: isCartOpen,
    onClose: () => setIsCartOpen(false),
    onUpdateQuantity: updateQuantity,
    onRemoveItem: removeFromCart
  };

  const navbarProps = {
    isCartOpen,
    setIsCartOpen,
    cartItemCount
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar {...navbarProps} />
      <Outlet />
      <Cart {...cartProps} />
    </div>
  );
} 