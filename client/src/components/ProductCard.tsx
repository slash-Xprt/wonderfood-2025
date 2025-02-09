import { MenuItem } from '../types/menu';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function ProductCard({ item, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-gray-900 font-medium">
            {item.price.toFixed(2)} €
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={!item.isActive || item.stock <= 0}
          >
            {!item.isActive ? 'Indisponible' :
             item.stock <= 0 ? 'En rupture' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
} 