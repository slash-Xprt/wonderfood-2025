import { useCartStore } from '../stores/useCartStore';

export const useCart = () => {
  const {
    items: cartItems,
    addItem,
    removeItem: removeFromCart,
    updateQuantity,
    clearCart,
    getTotal
  } = useCartStore();

  return {
    cartItems,
    addToCart: addItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal
  };
}; 