import React from 'react';
import { ShoppingBag, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isCartOpen, setIsCartOpen }: NavbarProps) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't render the navbar on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold text-gray-900">
            FoodHub
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-gray-900"
            >
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}