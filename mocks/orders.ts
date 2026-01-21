/**
 * @deprecated This file contains mock data for development/testing only.
 * The Order and OrderItem types are now defined in @/types/order.types.ts
 * Real data should be fetched from the database using useOrders hook.
 */

import { Order, OrderItem } from '@/types/order.types';

export const orders: Order[] = [
  {
    id: 'ord-001',
    orderCode: 'ORD-001',
    storeName: 'Pizza Palace',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    items: [
      { id: 'i1', name: 'Margherita Pizza', quantity: 1, price: '₺85' },
      { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, price: '₺95' },
      { id: 'i3', name: 'Coca Cola 1L', quantity: 2, price: '₺30' },
    ],
    totalPrice: '₺225',
    status: 'in_progress',
    rawStatus: 'PREPARING',
    date: '2024-12-30',
    deliveryAddress: '113 Vakthang Gorgasali Street',
    estimatedTime: '15-20 min',
  },
];

export const favoriteStores = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '20-30',
    cuisine: 'Italian, Pizza',
    deliveryFee: '₺15',
    distance: '1.2 km',
    isFavorite: true,
  },
];
