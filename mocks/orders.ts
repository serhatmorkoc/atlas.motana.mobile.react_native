export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  totalPrice: string;
  status: 'delivered' | 'in_progress' | 'cancelled';
  date: string;
  deliveryAddress: string;
  estimatedTime?: string;
}

export const orders: Order[] = [
  {
    id: 'ord-001',
    restaurantName: 'Pizza Palace',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    items: [
      { id: 'i1', name: 'Margherita Pizza', quantity: 1, price: '₺85' },
      { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, price: '₺95' },
      { id: 'i3', name: 'Coca Cola 1L', quantity: 2, price: '₺30' },
    ],
    totalPrice: '₺225',
    status: 'in_progress',
    date: '2024-12-30',
    deliveryAddress: '113 Vakthang Gorgasali Street',
    estimatedTime: '15-20 min',
  },
  {
    id: 'ord-002',
    restaurantName: 'Burger House',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    items: [
      { id: 'i4', name: 'Classic Burger', quantity: 2, price: '₺120' },
      { id: 'i5', name: 'French Fries', quantity: 1, price: '₺35' },
    ],
    totalPrice: '₺167',
    status: 'delivered',
    date: '2024-12-28',
    deliveryAddress: '113 Vakthang Gorgasali Street',
  },
  {
    id: 'ord-003',
    restaurantName: 'Sushi Master',
    restaurantImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    items: [
      { id: 'i6', name: 'Salmon Roll Set', quantity: 1, price: '₺180' },
      { id: 'i7', name: 'Miso Soup', quantity: 2, price: '₺40' },
      { id: 'i8', name: 'Edamame', quantity: 1, price: '₺35' },
    ],
    totalPrice: '₺275',
    status: 'delivered',
    date: '2024-12-25',
    deliveryAddress: '45 Rustaveli Avenue',
  },
  {
    id: 'ord-004',
    restaurantName: 'Turkish Delight',
    restaurantImage: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    items: [
      { id: 'i9', name: 'Adana Kebab', quantity: 2, price: '₺160' },
      { id: 'i10', name: 'Lahmacun', quantity: 3, price: '₺75' },
      { id: 'i11', name: 'Ayran', quantity: 2, price: '₺20' },
    ],
    totalPrice: '₺270',
    status: 'delivered',
    date: '2024-12-22',
    deliveryAddress: '113 Vakthang Gorgasali Street',
  },
  {
    id: 'ord-005',
    restaurantName: 'Asian Wok',
    restaurantImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    items: [
      { id: 'i12', name: 'Pad Thai', quantity: 1, price: '₺95' },
      { id: 'i13', name: 'Spring Rolls', quantity: 1, price: '₺45' },
    ],
    totalPrice: '₺156',
    status: 'cancelled',
    date: '2024-12-20',
    deliveryAddress: '113 Vakthang Gorgasali Street',
  },
  {
    id: 'ord-006',
    restaurantName: 'Vegan Garden',
    restaurantImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    items: [
      { id: 'i14', name: 'Buddha Bowl', quantity: 1, price: '₺85' },
      { id: 'i15', name: 'Green Smoothie', quantity: 1, price: '₺45' },
    ],
    totalPrice: '₺144',
    status: 'delivered',
    date: '2024-12-18',
    deliveryAddress: '78 Chavchavadze Avenue',
  },
];

export const favoriteRestaurants = [
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
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: '30-40',
    cuisine: 'Japanese, Sushi',
    deliveryFee: '₺20',
    distance: '3.5 km',
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Turkish Delight',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '15-25',
    cuisine: 'Turkish, Kebab',
    deliveryFee: '₺10',
    distance: '0.8 km',
    isFavorite: true,
  },
  {
    id: '8',
    name: 'Grill Master',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '30-40',
    cuisine: 'Steakhouse, BBQ',
    deliveryFee: '₺22',
    distance: '4.2 km',
    isFavorite: true,
  },
  {
    id: '9',
    name: 'Vegan Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '15-25',
    cuisine: 'Healthy, Vegan',
    deliveryFee: '₺14',
    distance: '1.1 km',
    isFavorite: true,
  },
  {
    id: '10',
    name: 'Seafood Bay',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: '35-45',
    cuisine: 'Seafood, Fish',
    deliveryFee: '₺25',
    distance: '5.0 km',
    isFavorite: true,
  },
];
