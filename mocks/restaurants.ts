export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '20-30',
    cuisine: 'Italian, Pizza',
    deliveryFee: '₺15',
    distance: '1.2 km'
  },
  {
    id: '2',
    name: 'Burger House',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '25-35',
    cuisine: 'Fast Food, Burgers',
    deliveryFee: '₺12',
    distance: '2.1 km'
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: '30-40',
    cuisine: 'Japanese, Sushi',
    deliveryFee: '₺20',
    distance: '3.5 km'
  },
  {
    id: '4',
    name: 'Turkish Delight',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '15-25',
    cuisine: 'Turkish, Kebab',
    deliveryFee: '₺10',
    distance: '0.8 km'
  },
  {
    id: '5',
    name: 'Pasta Corner',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '20-30',
    cuisine: 'Italian, Pasta',
    deliveryFee: '₺15',
    distance: '1.5 km'
  },
  {
    id: '6',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '25-35',
    cuisine: 'Mexican, Tacos',
    deliveryFee: '₺18',
    distance: '2.8 km'
  },
  {
    id: '7',
    name: 'Asian Wok',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '20-30',
    cuisine: 'Asian, Noodles',
    deliveryFee: '₺16',
    distance: '1.8 km'
  },
  {
    id: '8',
    name: 'Grill Master',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: '30-40',
    cuisine: 'Steakhouse, BBQ',
    deliveryFee: '₺22',
    distance: '4.2 km'
  },
  {
    id: '9',
    name: 'Vegan Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: '15-25',
    cuisine: 'Healthy, Vegan',
    deliveryFee: '₺14',
    distance: '1.1 km'
  },
  {
    id: '10',
    name: 'Seafood Bay',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: '35-45',
    cuisine: 'Seafood, Fish',
    deliveryFee: '₺25',
    distance: '5.0 km'
  }
];

export const brandRestaurants: Restaurant[] = [
  {
    id: 'b1',
    name: "McDonald's",
    image: 'https://images.unsplash.com/photo-1615934483863-2287f394254b?w=400&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '15-25',
    cuisine: 'Fast Food, Burgers',
    deliveryFee: '₺10',
    distance: '1.5 km'
  },
  {
    id: 'b2',
    name: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=400&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '10-20',
    cuisine: 'Coffee, Drinks',
    deliveryFee: '₺8',
    distance: '0.9 km'
  },
  {
    id: 'b3',
    name: 'KFC',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '20-30',
    cuisine: 'Fast Food, Chicken',
    deliveryFee: '₺12',
    distance: '2.0 km'
  },
  {
    id: 'b4',
    name: 'Dominos Pizza',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop',
    rating: 4.2,
    deliveryTime: '25-35',
    cuisine: 'Pizza, Italian',
    deliveryFee: '₺15',
    distance: '2.5 km'
  },
  {
    id: 'b5',
    name: 'Burger King',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '20-30',
    cuisine: 'Fast Food, Burgers',
    deliveryFee: '₺11',
    distance: '1.8 km'
  },
  {
    id: 'b6',
    name: 'Subway',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop',
    rating: 4.1,
    deliveryTime: '15-25',
    cuisine: 'Fast Food, Sandwiches',
    deliveryFee: '₺9',
    distance: '1.3 km'
  },
  {
    id: 'b7',
    name: 'Popeyes',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a72c7ba7c9?w=400&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: '20-30',
    cuisine: 'Fast Food, Chicken',
    deliveryFee: '₺13',
    distance: '2.2 km'
  },
  {
    id: 'b8',
    name: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '25-35',
    cuisine: 'Pizza, Italian',
    deliveryFee: '₺16',
    distance: '3.0 km'
  },
  {
    id: 'b9',
    name: 'Taco Bell',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop',
    rating: 4.2,
    deliveryTime: '20-30',
    cuisine: 'Mexican, Tacos',
    deliveryFee: '₺14',
    distance: '2.7 km'
  },
  {
    id: 'b10',
    name: 'Dunkin Donuts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    rating: 4.0,
    deliveryTime: '10-20',
    cuisine: 'Coffee, Donuts',
    deliveryFee: '₺7',
    distance: '1.0 km'
  }
];
