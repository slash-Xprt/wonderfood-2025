import { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customerInfo: CustomerInfo;
  items: OrderItemInput[];
  total: number;
}

export interface OrderWithItems extends PrismaOrder {
  items: PrismaOrderItem[];
}

export type { PrismaOrder as Order, PrismaOrderItem }; 