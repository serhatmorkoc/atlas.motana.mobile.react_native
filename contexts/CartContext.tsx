import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { MenuItem, MenuItemExtra } from '@/mocks/menu-items';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedExtras: MenuItemExtra[];
  storeId: string;
  storeName: string;
  storeImage: string;
}

export interface CartStoreGroup {
  storeId: string;
  storeName: string;
  storeImage: string;
  items: CartItem[];
  subtotal: number;
}

export const [CartProvider, useCart] = createContextHook(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((
    menuItem: MenuItem,
    quantity: number,
    selectedExtras: Set<string>,
    storeName: string,
    storeImage: string
  ) => {
    const extras = menuItem.extras?.filter(e => selectedExtras.has(e.id)) ?? [];
    
    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedExtras: extras,
      storeId: menuItem.storeId,
      storeName,
      storeImage,
    };

    setCartItems(prev => [...prev, newItem]);
    console.log('Added to cart:', newItem);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    console.log('Removed from cart:', cartItemId);
  }, []);

  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    console.log('Cart cleared');
  }, []);

  const clearStoreItems = useCallback((storeId: string) => {
    setCartItems(prev => prev.filter(item => item.storeId !== storeId));
    console.log('Cleared items for store:', storeId);
  }, []);

  const getItemPrice = useCallback((item: CartItem): number => {
    const basePrice = item.menuItem.price * item.quantity;
    const extrasPrice = item.selectedExtras.reduce(
      (sum, extra) => sum + extra.price * item.quantity,
      0
    );
    return basePrice + extrasPrice;
  }, []);

  const groupedByStore = useMemo((): CartStoreGroup[] => {
    const groups: Record<string, CartStoreGroup> = {};

    cartItems.forEach(item => {
      if (!groups[item.storeId]) {
        groups[item.storeId] = {
          storeId: item.storeId,
          storeName: item.storeName,
          storeImage: item.storeImage,
          items: [],
          subtotal: 0,
        };
      }
      groups[item.storeId].items.push(item);
      groups[item.storeId].subtotal += getItemPrice(item);
    });

    return Object.values(groups);
  }, [cartItems, getItemPrice]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + getItemPrice(item), 0);
  }, [cartItems, getItemPrice]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearStoreItems,
    groupedByStore,
    totalItems,
    totalPrice,
    getItemPrice,
  };
});
