import { useProductStore } from '../stores/useProductStore';

export const useProducts = () => {
  const { products, loading, error, refreshProducts } = useProductStore();

  return {
    products,
    loading,
    error,
    refreshProducts
  };
}; 