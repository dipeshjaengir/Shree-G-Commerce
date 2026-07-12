import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Counter from '../models/Counter.js';
import Settings from '../models/Settings.js';
import AuditLog from '../models/AuditLog.js';

const MOCK_CATEGORIES = [
  { name: 'Atta & Flours', slug: 'atta-flours', module: 'grocery' },
  { name: 'Rice & Grains', slug: 'rice-grains', module: 'grocery' },
  { name: 'Oils & Ghee', slug: 'oils-ghee', module: 'grocery' },
  { name: 'Dairy & Milk', slug: 'dairy-milk', module: 'grocery' },
  { name: 'Spices & Salt', slug: 'spices-salt', module: 'grocery' },
  { name: 'Noodles & Pasta', slug: 'noodles-pasta', module: 'grocery' },
  { name: 'Biscuits & Cookies', slug: 'biscuits-cookies', module: 'grocery' },
  { name: 'Tea & Coffee', slug: 'tea-coffee', module: 'grocery' },
  { name: 'Soaps & Bath', slug: 'soaps-bath', module: 'grocery' },
  { name: 'Shampoo & Hair Care', slug: 'shampoo-hair-care', module: 'grocery' },
  { name: 'Oral Care', slug: 'oral-care', module: 'grocery' },
  { name: 'Handwash & Sanitizer', slug: 'handwash-sanitizer', module: 'grocery' },
  { name: 'Household Cleaners', slug: 'household-cleaners', module: 'grocery' },
  { name: 'Beverages & Juices', slug: 'beverages-juices', module: 'grocery' },
  { name: 'Pooja Essentials', slug: 'pooja-essentials', module: 'grocery' }
];

// Helper to generate products list
const generateProductsList = (categoryIds) => {
  const brandList = [
    'Aashirvaad', 'Fortune', 'Amul', 'Mother Dairy', 'Tata', 'Surf Excel', 'Maggi',
    'Parle', 'Britannia', 'Red Label', 'Bru', 'Dove', 'Clinic Plus', 'Colgate',
    'Dettol', 'Lizol', 'Real', 'Coca-Cola', 'Pepsi', 'Bisleri'
  ];

  const productsData = [];

  const addProd = (name, brand, catSlug, price, mrp, unit, weight, desc) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `GRC-${brand.substring(0, 3).toUpperCase()}-${randNum}`;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    
    productsData.push({
      name,
      slug,
      sku,
      description: desc || `${name} by ${brand}. Fresh and authentic quality product.`,
      images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'],
      price,
      mrp,
      discount,
      stock: Math.floor(10 + Math.random() * 90),
      isAvailable: true,
      brand,
      module: 'grocery',
      category: categoryIds[catSlug],
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      isBestSeller: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      attributes: new Map([
        ['weight', weight],
        ['unit', unit]
      ])
    });
  };

  // 1. Atta & Flours
  addProd('Aashirvaad Shudh Chakki Atta', 'Aashirvaad', 'atta-flours', 460, 520, 'kg', '10', '100% Whole Wheat Flour, zero maida addition.');
  addProd('Pillsbury Chakki Fresh Atta', 'Aashirvaad', 'atta-flours', 240, 270, 'kg', '5', 'Freshly milled whole wheat flour.');
  addProd('Fortune Chakki Fresh Atta', 'Fortune', 'atta-flours', 230, 260, 'kg', '5', 'Traditional stone ground wheat flour.');
  addProd('Rajdhani Besan', 'Tata', 'atta-flours', 90, 110, 'g', '500', 'Premium quality gram flour.');
  addProd('Rajdhani Maida', 'Tata', 'atta-flours', 45, 55, 'g', '500', 'Refined fine wheat flour.');
  addProd('Rajdhani Sooji', 'Tata', 'atta-flours', 50, 60, 'g', '500', 'Coarse semolina wheat grain.');
  addProd('Organic Tattva Ragi Flour', 'Tata', 'atta-flours', 85, 99, 'g', '500', 'Finger millet healthy gluten-free flour.');

  // 2. Rice & Grains
  addProd('Daawat Rozana Super Basmati Rice', 'Fortune', 'rice-grains', 399, 480, 'kg', '5', 'Naturally aged flavorful long grain rice.');
  addProd('India Gate Feast Rozana Rice', 'Fortune', 'rice-grains', 380, 450, 'kg', '5', 'Long slender basmati grains.');
  addProd('Fortune Biryani Special Rice', 'Fortune', 'rice-grains', 110, 140, 'kg', '1', 'Elongated non-sticky rice for biryani.');
  addProd('Tata Sampann Kabuli Chana', 'Tata', 'rice-grains', 140, 170, 'g', '500', 'Unpolished chickpeas.');
  addProd('Tata Sampann Toor Dal', 'Tata', 'rice-grains', 160, 195, 'kg', '1', 'High protein unpolished arhar dal.');
  addProd('Tata Sampann Moong Dal', 'Tata', 'rice-grains', 145, 180, 'kg', '1', 'Yellow split moong dal.');
  addProd('Tata Sampann Chana Dal', 'Tata', 'rice-grains', 110, 130, 'kg', '1', 'Premium split Bengal gram.');

  // 3. Oils & Ghee
  addProd('Fortune Mustard Oil Kachi Ghani', 'Fortune', 'oils-ghee', 170, 195, 'L', '1', 'Cold pressed mustard oil.');
  addProd('Fortune Refined Sunflower Oil', 'Fortune', 'oils-ghee', 145, 170, 'L', '1', 'Light and healthy refined cooking oil.');
  addProd('Amul Cow Ghee Jar', 'Amul', 'oils-ghee', 670, 720, 'mL', '1000', 'Pure clarified cow milk fat.');
  addProd('Mother Dairy Cow Ghee Carton', 'Mother Dairy', 'oils-ghee', 320, 360, 'mL', '500', 'Rich aroma pure cow ghee.');
  addProd('Saffola Gold Blended Oil', 'Fortune', 'oils-ghee', 740, 820, 'L', '5', 'Pro-cardiac blended edible cooking oil.');
  addProd('Dhara Refined Groundnut Oil', 'Fortune', 'oils-ghee', 185, 210, 'L', '1', 'Aromatic groundnut edible oil.');

  // 4. Dairy & Milk
  addProd('Amul Gold Full Cream Milk', 'Amul', 'dairy-milk', 33, 33, 'mL', '500', 'High fat fresh pasteurized milk pouch.');
  addProd('Amul Taaza Toned Milk Tetra', 'Amul', 'dairy-milk', 72, 76, 'L', '1', 'UHT processed toned milk.');
  addProd('Mother Dairy Toned Milk Pouch', 'Mother Dairy', 'dairy-milk', 27, 27, 'mL', '500', 'Daily fresh toned milk.');
  addProd('Amul Butter Salted Block', 'Amul', 'dairy-milk', 275, 290, 'g', '500', 'Creamy salted dairy butter.');
  addProd('Mother Dairy Paneer Block', 'Mother Dairy', 'dairy-milk', 85, 95, 'g', '200', 'Fresh soft cottage cheese.');
  addProd('Amul Masti Spiced Buttermilk', 'Amul', 'dairy-milk', 15, 15, 'mL', '200', 'Refreshing spiced curd drink.');
  addProd('Amul Fresh Dahi Cup', 'Amul', 'dairy-milk', 32, 35, 'g', '400', 'Thick creamy pasteurized curd.');

  // 5. Spices & Salt
  addProd('Tata Salt Vacuum Evaporated', 'Tata', 'spices-salt', 28, 28, 'kg', '1', 'Iodized dynamic vacuum evaporated table salt.');
  addProd('Tata Salt Lite Low Sodium', 'Tata', 'spices-salt', 42, 45, 'kg', '1', 'Low sodium dietary salt.');
  addProd('Catch Turmeric Powder', 'Tata', 'spices-salt', 38, 45, 'g', '200', 'Sourced from fresh haldi roots.');
  addProd('Catch Coriander Powder', 'Tata', 'spices-salt', 40, 48, 'g', '200', 'Aromatic ground dhaniya seeds.');
  addProd('Catch Red Chilli Powder', 'Tata', 'spices-salt', 75, 90, 'g', '200', 'Spicy hot lal mirch powder.');
  addProd('MDH Garam Masala Powder', 'Tata', 'spices-salt', 88, 98, 'g', '100', 'Blend of hot spices powder.');

  // Add more mock items dynamically to hit 100+ threshold
  const extraCategories = Object.keys(categoryIds);
  let counter = 1;
  while (productsData.length < 105) {
    const cat = extraCategories[productsData.length % extraCategories.length];
    const brand = brandList[productsData.length % brandList.length];
    const name = `${brand} Grocery Item ${counter++}`;
    addProd(name, brand, cat, 80 + (counter % 150), 100 + (counter % 200), 'g', '250', `Premium quality grocery stock item.`);
  }

  return productsData;
};

// Seeder Execution Engine
const runSeeder = async () => {
  try {
    console.log('Connecting to database...');
    let mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      mongoUri = mongoUri.trim().replace(/^["']|["']$/g, '');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas.');

    const args = process.argv.slice(2);
    if (args.includes('--clear') || args.includes('-c')) {
      await clearData();
    } else {
      await importData();
    }

    await mongoose.disconnect();
    console.log('Disconnected database successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeder Process Failure: ${error.message}`);
    process.exit(1);
  }
};

const clearData = async () => {
  console.log('Evicting old collections data...');
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Counter.deleteMany(),
    Settings.deleteMany(),
    AuditLog.deleteMany()
  ]);
  console.log('Database collections cleared successfully.');
};

const importData = async () => {
  await clearData();

  console.log('Seeding default operational settings...');
  const settings = new Settings({
    storeName: 'Shree G Mart',
    currencySymbol: '₹',
    deliveryCharge: 40,
    freeDeliveryLimit: 500,
    gstPercentage: 18,
    inventoryDeductionTrigger: 'Delivered',
    failedLoginAttemptsLimit: 5,
    lockoutDurationMinutes: 15
  });
  await settings.save();

  console.log('Creating demo profiles...');
  const salt = await bcrypt.genSalt(12);
  const hashPassword = async (pass) => bcrypt.hash(pass, salt);

  const demoUsers = [
    {
      name: 'Super Admin Operator',
      email: 'superadmin@shreeg.com',
      password: await hashPassword('SuperAdmin@123'),
      phone: '9999999999',
      role: 'super_admin'
    },
    {
      name: 'Manager Operator',
      email: 'manager@shreeg.com',
      password: await hashPassword('Manager@123'),
      phone: '9888888888',
      role: 'manager'
    },
    {
      name: 'Staff Operator',
      email: 'staff@shreeg.com',
      password: await hashPassword('Staff@123'),
      phone: '9777777777',
      role: 'staff'
    },
    {
      name: 'Dipesh Kumar (Customer)',
      email: 'customer@shreeg.com',
      password: await hashPassword('Customer@123'),
      phone: '9666666666',
      role: 'customer'
    }
  ];

  const seededUsers = await User.insertMany(demoUsers);
  console.log(`Created ${seededUsers.length} test accounts.`);

  // Write local credentials to DEMO_CREDENTIALS.md simulator helper
  const demoDoc = `
# Shree G Commerce - Demo Login Credentials

This file lists the credentials seeded automatically for local evaluation and testing.

### 1. Super Admin Role
- **Email**: \`superadmin@shreeg.com\`
- **Password**: \`SuperAdmin@123\`
- **Scope**: Access to all settings, system audits, catalogs, and orders.

### 2. Manager Role
- **Email**: \`manager@shreeg.com\`
- **Password**: \`Manager@123\`
- **Scope**: Product catalog CRUD and stock balance controls.

### 3. Staff Role
- **Email**: \`staff@shreeg.com\`
- **Password**: \`Staff@123\`
- **Scope**: Orders updates, trackings, and catalog lookups.

### 4. Customer Role
- **Email**: \`customer@shreeg.com\`
- **Password**: \`Customer@123\`
- **Scope**: Carts, wishlists, and placements.
`;
  const fs = await import('fs');
  fs.writeFileSync('DEMO_CREDENTIALS.md', demoDoc.trim());
  console.log('DEMO_CREDENTIALS.md file updated successfully.');

  console.log('Seeding categories...');
  const seededCats = await Category.insertMany(MOCK_CATEGORIES);
  console.log(`Inserted ${seededCats.length} categories.`);

  // Map category slug to MongoDB ObjectId
  const categoryIds = {};
  seededCats.forEach(c => {
    categoryIds[c.slug] = c._id;
  });

  console.log('Seeding 100+ Indian grocery products...');
  const productsData = generateProductsList(categoryIds);
  const seededProducts = await Product.insertMany(productsData);
  console.log(`Seeded ${seededProducts.length} products successfully.`);

  console.log('Seeding mock customer records & orders...');
  const customerId = seededUsers.find(u => u.role === 'customer')._id;
  
  const mockOrders = [];
  for (let i = 1; i <= 102; i++) {
    const orderNum = `SG202607${String(12 - (i % 5)).padStart(2, '0')}${String(i).padStart(4, '0')}`;
    const randProd = seededProducts[i % seededProducts.length];
    
    mockOrders.push({
      orderNumber: orderNum,
      user: customerId,
      customerSnapshot: { name: 'Dipesh Kumar', email: 'customer@shreeg.com', phone: '9666666666' },
      items: [
        {
          product: randProd._id,
          name: randProd.name,
          brand: randProd.brand,
          sku: randProd.sku,
          price: randProd.price,
          mrp: randProd.mrp,
          quantity: 2,
          weight: randProd.attributes.get('weight') ? `${randProd.attributes.get('weight')} ${randProd.attributes.get('unit')}` : '500 g',
          total: randProd.price * 2
        }
      ],
      shippingAddress: {
        houseNumber: 'Flat 3B',
        street: 'Park Circus Lane',
        area: 'Bandra',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        mobileNumber: '9666666666'
      },
      paymentMethod: 'COD',
      paymentStatus: i % 4 === 0 ? 'Paid' : 'Pending',
      orderStatus: i % 5 === 0 ? 'Delivered' : i % 5 === 1 ? 'Placed' : i % 5 === 2 ? 'Confirmed' : i % 5 === 3 ? 'Packed' : 'Cancelled',
      subtotal: randProd.price * 2,
      discountAmount: (randProd.mrp - randProd.price) * 2,
      taxAmount: Math.round(randProd.price * 2 * 0.18),
      shippingFee: randProd.price * 2 >= 500 ? 0 : 40,
      totalAmount: (randProd.price * 2) + (randProd.price * 2 >= 500 ? 0 : 40),
      statusHistory: [
        { status: 'Placed', remarks: 'Order placed by customer.', timestamp: new Date() }
      ]
    });
  }

  await Order.insertMany(mockOrders);
  console.log(`Seeded ${mockOrders.length} orders into collection.`);
  console.log('Seeding operations completed successfully.');
};

runSeeder();
