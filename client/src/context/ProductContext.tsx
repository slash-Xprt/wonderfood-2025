import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { MenuItem } from '../types/menu';

interface ProductContextType {
  products: MenuItem[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL.replace('/api', '');

  // Initialize socket connection
  useEffect(() => {
    console.log('Connecting to WebSocket for products at:', API_URL);
    const newSocket = io(API_URL, {
      path: '/socket.io',
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket (Products) - Socket ID:', newSocket.id);
      newSocket.emit('join_products');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error (Products):', error.message);
      setError(`WebSocket connection error: ${error.message}`);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket (Products). Reason:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to WebSocket after', attemptNumber, 'attempts');
      newSocket.emit('join_products');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
      setError('Failed to reconnect to WebSocket');
    });

    newSocket.on('product_updated', (updatedProduct: MenuItem) => {
      console.log('Product updated:', updatedProduct);
      setProducts(prev =>
        prev.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    });

    newSocket.on('product_created', (newProduct: MenuItem) => {
      console.log('New product created:', newProduct);
      setProducts(prev => [newProduct, ...prev]);
    });

    newSocket.on('product_deleted', (productId: number) => {
      console.log('Product deleted:', productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection (Products)');
      newSocket.disconnect();
    };
  }, [API_URL]);

  // Fetch initial products
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from:', `${API_URL}/products`);
      
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched products:', data);
      
      // Filter out inactive products for the frontoffice
      const activeProducts = data.filter((product: MenuItem) => product.isActive);
      setProducts(activeProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]); // Reset products on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
} 