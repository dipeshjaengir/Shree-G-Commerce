import Wishlist from '../models/Wishlist.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { NotFoundError } from '../utils/appError.js';

// 1. GET WISHLIST
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
      await wishlist.save();
    }
    return sendSuccess(res, 200, 'Wishlist retrieved successfully.', { wishlist });
  } catch (error) {
    next(error);
  }
};

// 2. ADD TO WISHLIST
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Prevent duplicates
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products');
    return sendSuccess(res, 200, 'Product added to wishlist.', { wishlist });
  } catch (error) {
    next(error);
  }
};

// 3. REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return next(new NotFoundError('Wishlist not found.'));
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    await wishlist.populate('products');
    return sendSuccess(res, 200, 'Product removed from wishlist.', { wishlist });
  } catch (error) {
    next(error);
  }
};
