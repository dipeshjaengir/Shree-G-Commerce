export const MOCK_CATEGORIES = [
  { id: 'atta-rice', name: 'Atta & Rice', itemsCount: '24 Items', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', itemsCount: '18 Items', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80' },
  { id: 'snacks-sweets', name: 'Snacks & Sweets', itemsCount: '15 Items', image: 'https://images.unsplash.com/photo-1599490659223-e1b98f24b3c9?auto=format&fit=crop&w=300&q=80' },
  { id: 'beverages', name: 'Beverages', itemsCount: '12 Items', image: 'https://images.unsplash.com/photo-1534080391025-09795d197a5b?auto=format&fit=crop&w=300&q=80' },
  { id: 'fresh-vegetables', name: 'Fresh Vegetables', itemsCount: '30 Items', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80' },
  { id: 'fresh-fruits', name: 'Fresh Fruits', itemsCount: '20 Items', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=300&q=80' },
  { id: 'personal-care', name: 'Personal Care', itemsCount: '16 Items', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=300&q=80' },
  { id: 'cleaning-household', name: 'Cleaning & Household', itemsCount: '14 Items', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80' }
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Basmati Rice',
    brand: 'India Gate',
    price: 120,
    mrp: 150,
    discount: 20,
    unit: '1 kg',
    stock: 25,
    rating: 4.8,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    category: 'atta-rice',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80'],
    description: 'India Gate Premium Basmati Rice is thin and long-grained rice known for its aromatic properties and exquisite taste. Cultivated in the fertile foothills of Himalayas, this rice is aged to perfection.',
    specifications: {
      'Shelf Life': '24 Months',
      'Origin': 'India',
      'Pack Size': '1 kg Bag'
    }
  },
  {
    id: 'p2',
    name: 'Organic Sunflower Oil',
    brand: 'Fortune',
    price: 180,
    mrp: 220,
    discount: 18,
    unit: '1 L',
    stock: 12,
    rating: 4.5,
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    category: 'beverages',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80'],
    description: 'Fortune Organic Sunflower Oil is healthy oil processed from selected seeds. Loaded with vital nutrients, it keeps your heart healthy and food delicious.',
    specifications: {
      'Shelf Life': '12 Months',
      'Origin': 'India',
      'Pack Size': '1 L Bottle'
    }
  },
  {
    id: 'p3',
    name: 'Farm Fresh Organic Eggs',
    brand: 'Eggo Farm',
    price: 80,
    mrp: 95,
    discount: 15,
    unit: '6 pcs',
    stock: 5,
    rating: 4.7,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: true,
    category: 'dairy-eggs',
    images: ['https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80'],
    description: 'Rich in proteins and nutrients, our farm fresh eggs are gathered daily from free-range hens. Certified organic and free from synthetic feed additions.',
    specifications: {
      'Shelf Life': '10 Days',
      'Origin': 'Local Farm',
      'Pack Size': '6 Tray'
    }
  },
  {
    id: 'p4',
    name: 'Whole Wheat Sourdough',
    brand: 'Bakers Craft',
    price: 90,
    mrp: 110,
    discount: 18,
    unit: '500 g',
    stock: 0, // Out of stock
    rating: 4.4,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    category: 'dairy-eggs',
    images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80'],
    description: 'Freshly baked artisanal whole wheat sourdough bread. No yeast, made with pure sourdough starter for an incredible gut-friendly taste.',
    specifications: {
      'Shelf Life': '3 Days',
      'Origin': 'In-house Bakery',
      'Pack Size': '500 g Loaf'
    }
  },
  {
    id: 'p5',
    name: 'Fresh Organic Broccoli',
    brand: 'Green Farms',
    price: 60,
    mrp: 80,
    discount: 25,
    unit: '500 g',
    stock: 15,
    rating: 4.9,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    category: 'fresh-vegetables',
    images: ['https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=400&q=80'],
    description: 'Fresh and crispy organic broccoli, hand-harvested from the fields of local farmers. Extremely high in vitamins and fiber.',
    specifications: {
      'Shelf Life': '5 Days',
      'Origin': 'Local farm',
      'Pack Size': '500 g'
    }
  },
  {
    id: 'p6',
    name: 'Premium California Almonds',
    brand: 'Happilo',
    price: 350,
    mrp: 450,
    discount: 22,
    unit: '250 g',
    stock: 18,
    rating: 4.6,
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    category: 'atta-rice',
    images: ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80'],
    description: 'Premium quality raw California almonds. Packed with proteins and anti-oxidants, they make a perfect daily superfood snack.',
    specifications: {
      'Shelf Life': '12 Months',
      'Origin': 'USA',
      'Pack Size': '250 g pouch'
    }
  },
  {
    id: 'p7',
    name: 'Fresh Washington Apples',
    brand: 'USA Apple',
    price: 150,
    mrp: 180,
    discount: 16,
    unit: '500 g',
    stock: 20,
    rating: 4.8,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    category: 'fresh-fruits',
    images: ['https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=400&q=80'],
    description: 'Juicy, crisp, sweet Washington Red Delicious apples imported fresh. Great source of vitamins and dietary fiber.',
    specifications: {
      'Shelf Life': '7 Days',
      'Origin': 'USA',
      'Pack Size': '500 g Pack'
    }
  },
  {
    id: 'p8',
    name: 'Fresh Alphonso Mangoes',
    brand: 'Ratnagiri King',
    price: 450,
    mrp: 600,
    discount: 25,
    unit: '1 kg',
    stock: 8,
    rating: 4.9,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    category: 'fresh-fruits',
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80'],
    description: 'Legendary Ratnagiri Alphonso mangoes, rich and sweet in taste with a smooth texture. Handpicked and chemical-free ripening.',
    specifications: {
      'Shelf Life': '4 Days',
      'Origin': 'India',
      'Pack Size': '1 kg Box'
    }
  }
];

export const MOCK_BRANDS = [
  'India Gate',
  'Fortune',
  'Eggo Farm',
  'Bakers Craft',
  'Green Farms',
  'Happilo',
  'Ratnagiri King'
];
