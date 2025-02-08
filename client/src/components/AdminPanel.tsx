import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Store, Plus, Edit, Trash, Package2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';
import AdminHeader from './AdminHeader';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentMethod: 'card' | 'cash';
}

const categories = [
  { id: 'burgers', name: 'Burgers' },
  { id: 'sides', name: 'Accompagnements' },
  { id: 'drinks', name: 'Boissons' }
];

const initialProducts: MenuItem[] = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Steak haché juteux avec laitue fraîche, tomate et notre sauce spéciale',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
    category: 'burgers'
  },
  {
    id: 2,
    name: 'Frites',
    description: 'Frites dorées et croustillantes au sel de mer',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80',
    category: 'sides'
  },
  {
    id: 3,
    name: 'Soda',
    description: 'Au choix : Coca-Cola, Sprite ou Fanta',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&q=80',
    category: 'drinks'
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    items: [
      { name: 'Classic Burger', quantity: 2, price: 12.99 },
      { name: 'Frites', quantity: 1, price: 4.99 }
    ],
    total: 30.97,
    status: 'preparing',
    createdAt: '2024-02-28T10:30:00Z',
    paymentMethod: 'cash'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+33 6 98 76 54 32',
    items: [
      { name: 'Cheese Deluxe', quantity: 1, price: 14.99 },
      { name: 'Soda', quantity: 2, price: 2.99 }
    ],
    total: 20.97,
    status: 'ready',
    createdAt: '2024-02-28T09:45:00Z',
    paymentMethod: 'card'
  }
];

const statusColors = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé'
};

const statusButtons = {
  preparing: {
    next: 'ready',
    color: 'bg-green-600 hover:bg-green-700',
    label: 'Marquer comme prêt'
  },
  ready: {
    next: 'delivered',
    color: 'bg-blue-600 hover:bg-blue-700',
    label: 'Marquer comme livré'
  },
  delivered: {
    next: null,
    color: '',
    label: ''
  },
  cancelled: {
    next: null,
    color: '',
    label: ''
  }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<MenuItem[]>(initialProducts);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const [newProduct, setNewProduct] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'burgers'
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...newProduct, id: p.id } : p
      ));
    } else {
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'burgers'
    });
  };

  const handleEditProduct = (product: MenuItem) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const resetModalFields = () => {
    setCustomerInfo({ name: '', email: '', phone: '' });
    setPaymentMethod(null);
    clearCart();
  };

  const handleCloseModal = () => {
    resetModalFields();
    setIsNewOrderModalOpen(false);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      alert('Veuillez ajouter des articles à la commande');
      return;
    }

    if (!customerInfo.name.trim()) {
      alert('Veuillez entrer le nom du client');
      return;
    }

    if (!paymentMethod) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      customerName: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: 'preparing',
      createdAt: new Date().toISOString(),
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsNewOrderModalOpen(false);
    resetModalFields();
  };

  const filteredOrders = orders.filter(
    order => statusFilter === 'all' || order.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="w-64">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filtrer par statut
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Toutes les commandes</option>
              <option value="preparing">En préparation</option>
              <option value="ready">Prêtes</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle commande
          </button>
        </div>

        {/* Orders Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="flex items-center text-left flex-1"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-red-600 truncate">
                            Commande #{order.id}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {order.customerName}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              {order.phone}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="ml-4 flex items-center space-x-2">
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, statusButtons[order.status].next as Order['status'])}
                            className={`px-3 py-1 text-sm text-white font-medium rounded-md ${statusButtons[order.status].color}`}
                          >
                            {statusButtons[order.status].label}
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="px-3 py-1 text-sm text-white font-medium rounded-md bg-red-600 hover:bg-red-700"
                          >
                            Annuler
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {expandedOrders.has(order.id) && (
                    <div className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Article
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantité
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sous-total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.price.toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {(item.quantity * item.price).toFixed(2)} €
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50">
                              <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                Total
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.total.toFixed(2)} €
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Nouvelle commande</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-4 border-2 border-gray-200 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Informations client</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom du client*
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                    >
                      <div className="w-1/3">
                        <img
                          className="h-24 w-full object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-base font-bold text-red-600">{product.price.toFixed(2)} €</span>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {cartItems.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h4>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.price.toFixed(2)} €</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mode de paiement</span>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`px-3 py-1 rounded-full ${
                              paymentMethod === 'card'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Carte
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`px-3 py-1 rounded-full ${
                              paymentMethod === 'cash'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Espèces
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCreateOrder}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Créer la commande
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}