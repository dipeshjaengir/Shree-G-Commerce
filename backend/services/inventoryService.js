import Product from '../models/Product.js';
import { getSettings } from './settingsService.js';
import { ValidationError } from '../utils/appError.js';

// 1. Check stock availability for cart items
export const verifyStock = async (items, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.product).session(session);
    if (!product) {
      throw new ValidationError(`Product ID ${item.product} not found in catalog.`);
    }
    if (product.stock < item.quantity) {
      throw new ValidationError(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`);
    }
  }
};

// 2. Deduct stock from database
export const deductStock = async (items, session = null) => {
  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { session, new: true }
    );
    if (!result) {
      // Fetch product name for better error logging
      const prod = await Product.findById(item.product).session(session);
      throw new ValidationError(`Overselling prevented! Stock depleted for product "${prod?.name || item.product}".`);
    }
  }
};

// 3. Restore stock to database
export const restoreStock = async (items, session = null) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { session }
    );
  }
};

// 4. State-machine based trigger updates
export const handleStockForStatusChange = async (order, oldStatus, newStatus, session = null) => {
  const settings = await getSettings();
  const trigger = settings.inventoryDeductionTrigger || 'Delivered';

  // CASE A: Trigger is 'Placed'
  if (trigger === 'Placed') {
    // Stock was deducted at checkout.
    // If order gets cancelled or returned, we restore stock.
    if (newStatus === 'Cancelled' || newStatus === 'Returned') {
      if (oldStatus !== 'Cancelled' && oldStatus !== 'Returned') {
        await restoreStock(order.items, session);
      }
    }
  }

  // CASE B: Trigger is 'Delivered' (Default)
  if (trigger === 'Delivered') {
    // Stock is deducted only upon delivery.
    if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
      await deductStock(order.items, session);
    }
    // If a delivered order gets returned, restore stock.
    if (newStatus === 'Returned' && oldStatus === 'Delivered') {
      await restoreStock(order.items, session);
    }
  }

  // CASE C: Trigger is 'Confirmed'
  if (trigger === 'Confirmed') {
    if (newStatus === 'Confirmed' && oldStatus === 'Placed') {
      await deductStock(order.items, session);
    }
    if ((newStatus === 'Cancelled' || newStatus === 'Returned') && (oldStatus !== 'Placed' && oldStatus !== 'Cancelled')) {
      await restoreStock(order.items, session);
    }
  }

  // CASE D: Trigger is 'Packed'
  if (trigger === 'Packed') {
    if (newStatus === 'Packed' && (oldStatus === 'Placed' || oldStatus === 'Confirmed')) {
      await deductStock(order.items, session);
    }
    if ((newStatus === 'Cancelled' || newStatus === 'Returned') && (oldStatus === 'Packed' || oldStatus === 'Out For Delivery' || oldStatus === 'Delivered')) {
      await restoreStock(order.items, session);
    }
  }
};
