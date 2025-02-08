import { MenuItem } from '../data/menu';

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
} 