import { DBOrderStatus } from '@/types/order.types';

// Order Status Colors for React Native
export const ORDER_STATUS_COLORS: Record<DBOrderStatus, {
  background: string;
  text: string;
  textDark: string;
  border: string;
}> = {
  PENDING: {
    background: "rgba(234, 179, 8, 0.1)", // yellow-500/10
    text: "#ca8a04", // yellow-600
    textDark: "#eab308", // yellow-500
    border: "rgba(234, 179, 8, 0.2)", // yellow-500/20
  },
  CONFIRMED: {
    background: "rgba(59, 130, 246, 0.1)", // blue-500/10
    text: "#2563eb", // blue-600
    textDark: "#3b82f6", // blue-500
    border: "rgba(59, 130, 246, 0.2)", // blue-500/20
  },
  PREPARING: {
    background: "rgba(249, 115, 22, 0.1)", // orange-500/10
    text: "#ea580c", // orange-600
    textDark: "#f97316", // orange-500
    border: "rgba(249, 115, 22, 0.2)", // orange-500/20
  },
  READY: {
    background: "rgba(168, 85, 247, 0.1)", // purple-500/10
    text: "#9333ea", // purple-600
    textDark: "#a855f7", // purple-500
    border: "rgba(168, 85, 247, 0.2)", // purple-500/20
  },
  ON_WAY: {
    background: "rgba(99, 102, 241, 0.1)", // indigo-500/10
    text: "#4f46e5", // indigo-600
    textDark: "#6366f1", // indigo-500
    border: "rgba(99, 102, 241, 0.2)", // indigo-500/20
  },
  DELIVERED: {
    background: "rgba(34, 197, 94, 0.1)", // green-500/10
    text: "#16a34a", // green-600
    textDark: "#22c55e", // green-500
    border: "rgba(34, 197, 94, 0.2)", // green-500/20
  },
  CANCELLED: {
    background: "rgba(239, 68, 68, 0.1)", // red-500/10
    text: "#dc2626", // red-600
    textDark: "#ef4444", // red-500
    border: "rgba(239, 68, 68, 0.2)", // red-500/20
  },
};
