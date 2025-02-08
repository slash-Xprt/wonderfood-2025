import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isCartOpen,
  setIsCartOpen
}) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-red-600">WonderFood</span>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-red-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;