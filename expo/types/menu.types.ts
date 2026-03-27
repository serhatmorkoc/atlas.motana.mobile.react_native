/**
 * Menu item related types
 */

export interface MenuItemExtra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  extras?: MenuItemExtra[];
}

