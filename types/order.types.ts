/**
 * Order related types
 */

export type OrderStatus = 'delivered' | 'in_progress' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  storeName: string;
  storeImage: string;
  items: OrderItem[];
  totalPrice: string;
  status: OrderStatus;
  date: string;
  deliveryAddress: string;
  estimatedTime?: string;
}

