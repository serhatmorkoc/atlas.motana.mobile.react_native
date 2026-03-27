export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  storeName: string;
}

export const offers: Offer[] = [
  {
    id: 'o1',
    title: '50% Off',
    description: 'On your first order from any store. Valid for new customers only. Maximum discount ₺50.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=200&fit=crop',
    discount: '50%',
    storeName: 'All Stores'
  },
  {
    id: 'o2',
    title: 'Free Delivery',
    description: 'No delivery fees on orders over ₺100. Available at participating stores near you.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
    discount: 'FREE',
    storeName: 'Selected Stores'
  },
  {
    id: 'o3',
    title: '₺30 Off',
    description: 'Special discount on all pizza orders. Choose from 20+ pizza varieties with premium toppings.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop',
    discount: '₺30',
    storeName: 'Pizza Palace'
  },
  {
    id: 'o4',
    title: 'Buy 1 Get 1',
    description: 'Get a free burger when you order any burger meal. Includes all premium burger options.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop',
    discount: 'BOGO',
    storeName: 'Burger House'
  },
  {
    id: 'o5',
    title: '40% Off',
    description: 'Amazing deals on authentic sushi rolls, sashimi, and Japanese cuisine. Fresh ingredients daily.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop',
    discount: '40%',
    storeName: 'Sushi Master'
  },
  {
    id: 'o6',
    title: '₺25 Off',
    description: 'Enjoy traditional Turkish dishes with special discount. Kebabs, pide, lahmacun and more.',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=200&fit=crop',
    discount: '₺25',
    storeName: 'Turkish Delight'
  },
  {
    id: 'o7',
    title: 'Happy Hour',
    description: 'Save 30% on all orders between 2PM - 5PM daily. Perfect time for a delicious lunch break!',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
    discount: '30%',
    storeName: 'All Stores'
  },
  {
    id: 'o8',
    title: 'Weekend Special',
    description: 'Family meal packages with huge savings. Perfect for weekend gatherings with loved ones.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=200&fit=crop',
    discount: '₺50',
    storeName: 'Selected Stores'
  },
  {
    id: 'o9',
    title: 'Late Night Deal',
    description: 'Craving pizza after 10PM? Get 35% off on all pizzas. Late night orders never tasted so good.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop',
    discount: '35%',
    storeName: 'Pizza Hut'
  },
  {
    id: 'o10',
    title: 'Student Discount',
    description: 'Show your student ID and get 20% off. Available at all partner stores for students.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop',
    discount: '20%',
    storeName: 'All Stores'
  }
];
