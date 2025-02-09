import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order } from '../types/orders';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL.replace('/api', '');

  // Initialize socket connection
  useEffect(() => {
    console.log('Connecting to WebSocket at:', API_URL);
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
      console.log('Connected to WebSocket - Socket ID:', newSocket.id);
      newSocket.emit('join_admin');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setError(`WebSocket connection error: ${error.message}`);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket. Reason:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to WebSocket after', attemptNumber, 'attempts');
      newSocket.emit('join_admin');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
      setError('Failed to reconnect to WebSocket');
    });

    newSocket.on('new_order', (order: Order) => {
      console.log('New order received:', order);
      setOrders(prev => [order, ...prev]);
    });

    newSocket.on('order_updated', (updatedOrder: Order) => {
      console.log('Order updated:', updatedOrder);
      setOrders(prev =>
        prev.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, [API_URL]);

  // Fetch initial orders
  useEffect(() => {
    refreshOrders();
  }, []);

  const refreshOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders from:', `${API_URL}/orders`);
      
      const response = await fetch(`${API_URL}/orders`, {
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
      console.log('Fetched orders:', data);
      
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      setOrders([]); // Reset orders on error
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
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
        console.error('Error updating order:', errorData);
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      console.log('Order status updated:', updatedOrder);
      
      setOrders(prev =>
        prev.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        updateOrderStatus,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
} 