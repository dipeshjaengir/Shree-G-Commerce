import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Counter from '../models/Counter.js';
import Address from '../models/Address.js';
import { getSettings } from '../services/settingsService.js';
import { verifyStock, deductStock, restoreStock } from '../services/inventoryService.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/appError.js';

// Helper: Atomic Daily Sequence Order Number Generator
const generateOrderNumber = async (session) => {
  const today = new Date();
  const dateStr = today.getFullYear().toString() +
                  (today.getMonth() + 1).toString().padStart(2, '0') +
                  today.getDate().toString().padStart(2, '0');
  
  const counterId = `orders_${dateStr}`;
  const counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );

  const seqStr = counter.seq.toString().padStart(4, '0');
  return `SG${dateStr}${seqStr}`;
};

// 1. PLACE NEW ORDER (Checkout)
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { addressId, paymentMethod = 'COD' } = req.body;

    if (!addressId) {
      throw new ValidationError('Shipping address is required.');
    }

    // 1. Fetch User Cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').session(session);
    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Your cart is empty.');
    }

    // 2. Fetch Settings (Shipping limits, tax limits)
    const settings = await getSettings();
    const gstRate = settings.gstPercentage || 18;
    const deliveryFee = settings.deliveryCharge || 40;
    const freeDeliveryLimit = settings.freeDeliveryLimit || 500;
    const inventoryTrigger = settings.inventoryDeductionTrigger || 'Delivered';

    // 3. Verify Stock availability
    await verifyStock(cart.items, session);

    // 4. Resolve Shipping Address
    const address = await Address.findOne({ _id: addressId, user: req.user._id }).session(session);
    if (!address) {
      throw new NotFoundError('Selected shipping address not found.');
    }

    // 5. Calculate Financial Breakdown & Build Items Snapshot
    let subtotal = 0;
    let discountAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const prod = item.product;
      const itemSubtotal = prod.price * item.quantity;
      const itemMrpTotal = prod.mrp * item.quantity;
      const itemDiscount = itemMrpTotal - itemSubtotal;

      subtotal += itemSubtotal;
      discountAmount += itemDiscount;

      // Lock item snapshot
      orderItems.push({
        product: prod._id,
        name: prod.name,
        brand: prod.brand || 'Generic',
        sku: prod.sku,
        price: prod.price,
        mrp: prod.mrp,
        discount: prod.discount,
        weight: prod.attributes.get('weight') ? `${prod.attributes.get('weight')} ${prod.attributes.get('unit') || 'g'}` : '1 unit',
        quantity: item.quantity,
        tax: gstRate,
        total: itemSubtotal
      });
    }

    // Determine shipping charges
    const shippingFee = subtotal >= freeDeliveryLimit ? 0 : deliveryFee;
    
    // Tax calculation (GST included in price snapshot or calculated on top - assume included)
    const taxAmount = parseFloat(((subtotal * gstRate) / (100 + gstRate)).toFixed(2));
    const totalAmount = subtotal + shippingFee;

    // 6. Generate sequential order number
    const orderNumber = await generateOrderNumber(session);

    // 7. Deduct stock if trigger is set to 'Placed'
    if (inventoryTrigger === 'Placed') {
      await deductStock(cart.items, session);
    }

    // 8. Create Order Document
    const order = new Order({
      orderNumber,
      user: req.user._id,
      customerSnapshot: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      items: orderItems,
      shippingAddress: {
        houseNumber: address.street.split(',')[0] || '1',
        street: address.street,
        area: address.city,
        landmark: address.state,
        city: address.city,
        state: address.state,
        pincode: address.zipCode,
        mobileNumber: req.user.phone
      },
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Placed',
      subtotal,
      discountAmount,
      taxAmount,
      shippingFee,
      totalAmount,
      statusHistory: [{ status: 'Placed', remarks: 'Order successfully placed.' }]
    });

    await order.save({ session });

    // 9. Clear User's Cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(res, 201, 'Order placed successfully.', { order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// 2. GET USER ORDERS HISTORY (Paginated)
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isAdmin } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    let query = { user: req.user._id };

    if (isAdmin === 'true') {
      const allowedRoles = ['super_admin', 'admin', 'manager', 'staff'];
      if (!allowedRoles.includes(req.user.role)) {
        return next(new AuthorizationError(`Access Forbidden: Role '${req.user.role}' is unauthorized to query all orders.`));
      }
      query = {};
    }

    const [orders, totalDocs] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum);

    return sendSuccess(
      res, 
      200, 
      'Orders retrieved successfully.', 
      { orders }, 
      { page: pageNum, limit: limitNum, totalDocs, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

// 3. GET ORDER DETAILS
export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return next(new NotFoundError('Order not found.'));
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
      return next(new AuthorizationError('Unauthorized access to this order details.'));
    }

    return sendSuccess(res, 200, 'Order details retrieved.', { order });
  } catch (error) {
    next(error);
  }
};

// 4. CANCEL ORDER
export const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Unauthorized to cancel this order.');
    }

    // Cancellation constraint check: can only cancel Placed or Confirmed orders
    const cancellableStatuses = ['Placed', 'Confirmed'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new ValidationError(`Order cannot be cancelled. Current status is '${order.orderStatus}'.`);
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', remarks: 'Cancelled by customer.' });

    // Restore stock if it was already deducted at checkout ('Placed')
    const settings = await getSettings();
    const trigger = settings.inventoryDeductionTrigger || 'Delivered';
    if (trigger === 'Placed' || (trigger === 'Confirmed' && previousStatus === 'Confirmed')) {
      await restoreStock(order.items, session);
    }

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(res, 200, 'Order cancelled successfully.', { order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// 5. UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { orderStatus, remarks = '' } = req.body;

    if (!orderStatus) {
      throw new ValidationError('Order status is required.');
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    const previousStatus = order.orderStatus;
    const previousState = order.toObject();

    if (previousStatus === 'Cancelled' || previousStatus === 'Delivered' || previousStatus === 'Returned') {
      throw new ValidationError(`Cannot update status of a ${previousStatus} order.`);
    }

    // Load Settings
    const settings = await getSettings();
    const trigger = settings.inventoryDeductionTrigger || 'Delivered';

    // 1. Check if stock was previously deducted
    const wasDeducted = (trigger === 'Placed') ||
                        (trigger === 'Confirmed' && ['Confirmed', 'Packed', 'Out For Delivery', 'Delivered'].includes(previousStatus)) ||
                        (trigger === 'Packed' && ['Packed', 'Out For Delivery', 'Delivered'].includes(previousStatus)) ||
                        (trigger === 'Delivered' && previousStatus === 'Delivered');

    // 2. Check if we should deduct stock now
    const shouldDeductNow = !wasDeducted && (
      (trigger === 'Confirmed' && ['Confirmed', 'Packed', 'Out For Delivery', 'Delivered'].includes(orderStatus)) ||
      (trigger === 'Packed' && ['Packed', 'Out For Delivery', 'Delivered'].includes(orderStatus)) ||
      (trigger === 'Delivered' && orderStatus === 'Delivered')
    );

    if (shouldDeductNow) {
      await deductStock(order.items, session);
    }

    // 3. Check if we should restore stock (If cancelled or returned and stock was already deducted)
    const shouldRestoreNow = wasDeducted && (orderStatus === 'Cancelled' || orderStatus === 'Returned');
    if (shouldRestoreNow) {
      await restoreStock(order.items, session);
    }

    // 4. Update status and timeline
    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      remarks: remarks || `Order status updated to ${orderStatus} by Admin.`,
      timestamp: new Date()
    });

    if (orderStatus === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    await order.save({ session });

    // 5. Audit Log Entry
    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'Order',
      entityId: order._id,
      previousState,
      newState: order.toObject(),
      req
    });

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(res, 200, 'Order status updated successfully.', { order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
