import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, ClipboardList, Package2 } from 'lucide-react';

export default function AdminHeader() {
  const location = useLocation();

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col">
          {/* Top Bar */}
          <div className="px-4 py-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <Store className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Navigation */}
          <div className="px-4 flex space-x-8">
            <Link
              to="/admin"
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                location.pathname === '/admin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Commandes
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                location.pathname === '/admin/products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package2 className="h-5 w-5 mr-2" />
              Produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}