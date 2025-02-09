export interface Order {
  _id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  total: number;
  count: number;
  status: Order['status'];
} 