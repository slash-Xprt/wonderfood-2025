import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const categories = [
  { id: 'all', name: 'Tout' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'chicken', name: 'Poulet' },
  { id: 'sides', name: 'Accompagnements' },
  { id: 'drinks', name: 'Boissons' },
  { id: 'desserts', name: 'Desserts' }
];

const menuItems = {
  burgers: [
    {
      id: 1,
      name: 'Burger Classique',
      description: 'Steak haché juteux avec laitue fraîche, tomate et notre sauce spéciale',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
      category: 'burgers'
    },
    {
      id: 2,
      name: 'Cheese Deluxe',
      description: 'Double steak haché avec fromage fondu et bacon',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80',
      category: 'burgers'
    }
  ],
  chicken: [
    {
      id: 3,
      name: 'Poulet Croustillant',
      description: 'Poulet pané croustillant avec laitue et mayonnaise',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80',
      category: 'chicken'
    }
  ],
  sides: [
    {
      id: 4,
      name: 'Frites',
      description: 'Frites dorées et croustillantes au sel de mer',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80',
      category: 'sides'
    }
  ],
  drinks: [
    {
      id: 5,
      name: 'Boisson',
      description: 'Au choix : Coca-Cola, Sprite ou Fanta',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&q=80',
      category: 'drinks'
    }
  ],
  desserts: [
    {
      id: 6,
      name: 'Sundae',
      description: 'Glace vanille avec sauce chocolat',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80',
      category: 'desserts'
    }
  ]
};

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();

  const getDisplayItems = () => {
    if (activeCategory === 'all') {
      return Object.values(menuItems).flat();
    }
    return menuItems[activeCategory];
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="sticky top-16 bg-white z-40 shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex whitespace-nowrap px-4 py-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          {getDisplayItems().map((item) => (
            <div
              key={item.id}
              className="flex bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="w-1/3">
                <img
                  className="h-24 w-full object-cover sm:h-32"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="w-2/3 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-red-600">{item.price.toFixed(2)} €</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;