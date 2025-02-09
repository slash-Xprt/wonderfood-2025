import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { MenuItem } from '../types/menu';

interface ProductState {
  products: MenuItem[];
  loading: boolean;
  error: string | null;
  socket: Socket | null;
  refreshProducts: () => Promise<void>;
  setSocket: (socket: Socket | null) => void;
  initializeSocket: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = API_URL.replace('/api', '');

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  error: null,
  socket: null,

  setSocket: (socket) => set({ socket }),

  initializeSocket: () => {
    console.log('Initializing WebSocket connection to:', SOCKET_URL);
    
    try {
      const newSocket = io(SOCKET_URL, {
        path: '/socket.io',
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
        timeout: 10000,
        auth: {
          serverOffset: 0
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket (Products) - Socket ID:', newSocket.id);
        newSocket.emit('join_products');
        set({ error: null }); // Clear any previous connection errors
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error (Products):', error.message);
        set({ error: `WebSocket connection error: ${error.message}` });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket (Products). Reason:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          newSocket.connect();
        }
      });

      newSocket.on('product_updated', (updatedProduct: MenuItem) => {
        console.log('Product updated:', updatedProduct);
        set(state => ({
          products: state.products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        }));
      });

      newSocket.on('product_created', (newProduct: MenuItem) => {
        console.log('New product created:', newProduct);
        set(state => ({ products: [newProduct, ...state.products] }));
      });

      newSocket.on('product_deleted', (productId: number) => {
        console.log('Product deleted:', productId);
        set(state => ({
          products: state.products.filter(product => product.id !== productId)
        }));
      });

      set({ socket: newSocket });

      // Clean up function
      return () => {
        console.log('Cleaning up WebSocket connection (Products)');
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      set({ error: 'Failed to initialize WebSocket connection' });
    }
  },

  refreshProducts: async () => {
    try {
      set({ loading: true });
      console.log('Fetching products from:', `${API_URL}/products`);
      
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const activeProducts = data.filter((product: MenuItem) => product.isActive);
      
      set({ products: activeProducts, error: null });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch products',
        products: []
      });
    } finally {
      set({ loading: false });
    }
  }
})); 