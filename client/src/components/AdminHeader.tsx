import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, ShoppingBag } from 'lucide-react';

export default function AdminHeader() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/admin/orders',
      label: 'Commandes',
      icon: ShoppingBag
    },
    {
      path: '/admin/products',
      label: 'Produits',
      icon: ClipboardList
    }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              WonderFood Admin
            </Link>
          </div>
          
          <nav className="flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-1.5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}