import { useOrderStore } from '../stores/useOrderStore';

export const useOrders = () => {
  const { orders, loading, error, updateOrderStatus, refreshOrders } = useOrderStore();

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders
  };
}; 