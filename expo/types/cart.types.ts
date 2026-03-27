/**
 * Cart related types
 */

import { MenuItem, MenuItemExtra } from './menu.types';

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

