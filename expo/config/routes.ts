/**
 * Route constants
 */

export const routes = {
  // Tab routes
  home: '/(tabs)/home',
  search: '/(tabs)/search',
  orders: '/(tabs)/orders',
  checkout: '/(tabs)/checkout',
  account: '/(tabs)/account',
  
  // Store routes
  store: (id: string) => `/store/${id}`,
  
  // Order routes
  orderTracking: (params: { orderId: string; storeName: string; storeImage?: string; total: string; address: string; estimatedTime: string; itemCount: string }) => 
    `/order/tracking?${new URLSearchParams(params as any).toString()}`,
  orderConfirmation: (params: { orderId: string; storeName: string; total: string; subtotal: string; deliveryFee: string; serviceFee: string; itemCount: string; items: string; address: string }) =>
    `/order/confirmation?${new URLSearchParams(params as any).toString()}`,
  
  // Account routes
  accountSettings: '/account/settings',
  accountOrders: '/account/orders',
  accountFavorites: '/account/favorites',
  accountAddresses: '/account/addresses',
  accountPaymentMethods: '/account/payment-methods',
  
  // Search routes
  searchResults: (params: { query?: string; category?: string }) =>
    `/search/results?${new URLSearchParams(params as any).toString()}`,
} as const;

export type Routes = typeof routes;

