import React from 'react';
import { ShoppingBag, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItemCount: number;
}

export default function Navbar({ isCartOpen, setIsCartOpen, cartItemCount }: NavbarProps) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't render the navbar on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            FoodHub
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </Link>
            
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}