import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Order } from '../types/orders';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  socket: Socket | null;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  setSocket: (socket: Socket | null) => void;
  initializeSocket: () => void;
}

// Get the base URL from the API URL, but use the server port
const API_URL = import.meta.env.VITE_API_URL.replace('/api', '');
const SOCKET_URL = API_URL.replace('5503', '5000');

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
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
        console.log('Connected to WebSocket (Orders) - Socket ID:', newSocket.id);
        newSocket.emit('join_admin');
        set({ error: null }); // Clear any previous connection errors
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error (Orders):', error.message);
        set({ error: `WebSocket connection error: ${error.message}` });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket (Orders). Reason:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          newSocket.connect();
        }
      });

      newSocket.on('new_order', (order: Order) => {
        console.log('New order received:', order);
        set(state => ({ orders: [order, ...state.orders] }));
      });

      newSocket.on('order_updated', (updatedOrder: Order) => {
        console.log('Order updated:', updatedOrder);
        set(state => ({
          orders: state.orders.map(order =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        }));
      });

      set({ socket: newSocket });

      // Clean up function
      return () => {
        console.log('Cleaning up WebSocket connection (Orders)');
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      set({ error: 'Failed to initialize WebSocket connection' });
    }
  },

  refreshOrders: async () => {
    try {
      set({ loading: true });
      console.log('Fetching orders from:', `${API_URL}/orders`);
      
      const response = await fetch(`${API_URL}/orders`, {
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
      set({ orders: data, error: null });
    } catch (err) {
      console.error('Error fetching orders:', err);
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch orders',
        orders: []
      });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    try {
      console.log('Updating order status:', { orderId, status });
      
      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      set(state => ({
        orders: state.orders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        ),
        error: null
      }));
    } catch (err) {
      console.error('Error updating order status:', err);
      set({ error: err instanceof Error ? err.message : 'An error occurred' });
      throw err;
    }
  }
})); 