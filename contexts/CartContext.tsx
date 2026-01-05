import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { MenuItem, MenuItemExtra } from '@/mocks/menu-items';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedExtras: MenuItemExtra[];
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
}

export interface CartRestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
}

export const [CartProvider, useCart] = createContextHook(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((
    menuItem: MenuItem,
    quantity: number,
    selectedExtras: Set<string>,
    restaurantName: string,
    restaurantImage: string
  ) => {
    const extras = menuItem.extras?.filter(e => selectedExtras.has(e.id)) ?? [];
    
    const newItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedExtras: extras,
      restaurantId: menuItem.restaurantId,
      restaurantName,
      restaurantImage,
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

  const clearRestaurantItems = useCallback((restaurantId: string) => {
    setCartItems(prev => prev.filter(item => item.restaurantId !== restaurantId));
    console.log('Cleared items for restaurant:', restaurantId);
  }, []);

  const getItemPrice = useCallback((item: CartItem): number => {
    const basePrice = item.menuItem.price * item.quantity;
    const extrasPrice = item.selectedExtras.reduce(
      (sum, extra) => sum + extra.price * item.quantity,
      0
    );
    return basePrice + extrasPrice;
  }, []);

  const groupedByRestaurant = useMemo((): CartRestaurantGroup[] => {
    const groups: Record<string, CartRestaurantGroup> = {};

    cartItems.forEach(item => {
      if (!groups[item.restaurantId]) {
        groups[item.restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantImage: item.restaurantImage,
          items: [],
          subtotal: 0,
        };
      }
      groups[item.restaurantId].items.push(item);
      groups[item.restaurantId].subtotal += getItemPrice(item);
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
    clearRestaurantItems,
    groupedByRestaurant,
    totalItems,
    totalPrice,
    getItemPrice,
  };
});
