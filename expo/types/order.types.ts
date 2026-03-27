/**
 * Order related types
 */

// DB Order Status Types (from Supabase)
export type PaymentMethod = "CREDIT_CARD" | "CASH" | "WALLET";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type DBOrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "ON_WAY" | "DELIVERED" | "CANCELLED";

// Mobile App Order Status (for UI display)
export type OrderStatus = 'delivered' | 'in_progress' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  orderCode: string | null; // Order number (e.g., ORD-849078)
  storeName: string;
  storeImage: string;
  items: OrderItem[];
  totalPrice: string;
  status: OrderStatus; // Mapped status for UI (in_progress, delivered, cancelled)
  rawStatus: DBOrderStatus | null; // Original DB status (PENDING, CONFIRMED, etc.)
  date: string;
  deliveryAddress: string;
  estimatedTime?: string;
}

