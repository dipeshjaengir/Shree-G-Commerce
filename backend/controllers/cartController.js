import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError } from '../utils/appError.js';

// 1. GET CART
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    return sendSuccess(res, 200, 'Cart retrieved successfully.', { cart });
  } catch (error) {
    next(error);
  }
};

// 2. ADD / UPDATE QUANTITY IN CART
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      return next(new ValidationError('Quantity must be greater than zero.'));
    }

    // Check if product exists & has stock
    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError('Product not found in catalog.'));
    }

    if (product.stock < quantity) {
      return next(new ValidationError(`Insufficient stock. Only ${product.stock} units available.`));
    }

    // Max limit safety check (E.g. 10 items per product per user to prevent scalping)
    const MAX_QTY_PER_PRODUCT = 10;
    if (quantity > MAX_QTY_PER_PRODUCT) {
      return next(new ValidationError(`Cannot exceed ${MAX_QTY_PER_PRODUCT} units per product.`));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      // Validate updated quantity against stock
      const newQuantity = quantity;
      if (product.stock < newQuantity) {
        return next(new ValidationError(`Insufficient stock. Only ${product.stock} units available.`));
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    return sendSuccess(res, 200, 'Cart updated successfully.', { cart });
  } catch (error) {
    next(error);
  }
};

// 3. REMOVE PRODUCT FROM CART
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new NotFoundError('Cart not found.'));
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');

    return sendSuccess(res, 200, 'Product removed from cart.', { cart });
  } catch (error) {
    next(error);
  }
};
