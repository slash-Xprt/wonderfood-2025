import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Administration</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/products"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gestion des produits</h2>
                <p className="text-gray-600">Ajouter, modifier ou supprimer des produits</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gestion des commandes</h2>
                <p className="text-gray-600">Voir et gérer les commandes en cours</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 