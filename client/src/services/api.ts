import axios from 'axios';
import { MenuItem } from '../types/menu';
import { Order, OrderItem } from '../types/orders';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const { data } = await api.get('/menu');
    return data;
  },
  
  getById: async (id: number): Promise<MenuItem> => {
    const { data } = await api.get(`/menu/${id}`);
    return data;
  },
};

export const orderApi = {
  create: async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },
  
  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  
  updateStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};

// Error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
); 