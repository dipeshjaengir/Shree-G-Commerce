import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError } from '../utils/appError.js';

// 1. GET ALL CATEGORIES (Filtered by Module)
export const getCategories = async (req, res, next) => {
  try {
    const { module = 'grocery' } = req.query;

    const categories = await Category.find({ module });
    return sendSuccess(res, 200, 'Categories retrieved successfully.', { categories });
  } catch (error) {
    next(error);
  }
};

// 2. GET ALL PRODUCTS (Paginated, Filtered, and Sorted)
export const getProducts = async (req, res, next) => {
  try {
    const { 
      module = 'grocery', 
      category, 
      brand, 
      minPrice = 0, 
      maxPrice = 10000, 
      minDiscount = 0,
      inStock,
      search,
      sort = 'newest',
      page = 1,
      limit = 10 
    } = req.query;

    // Build Mongo Query Criteria dynamically
    const query = { module };

    // Filter by category object references
    if (category) {
      // Find category ID by slug or ID
      const cat = await Category.findOne({ 
        $or: [{ slug: category }, { _id: mongoose.isValidObjectId(category) ? category : null }]
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Filter by Brand list
    if (brand) {
      const brandArray = brand.split(',');
      query.brand = { $in: brandArray };
    }

    // Filter by Price range
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

    // Filter by discount thresholds
    if (Number(minDiscount) > 0) {
      query.discount = { $gte: Number(minDiscount) };
    }

    // Filter by stock levels
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Full-Text Keyword Search
    if (search) {
      query.$text = { $search: search };
    }

    // Define Sorting strategy
    let sortCriteria = {};
    if (sort === 'newest') {
      sortCriteria = { createdAt: -1 };
    } else if (sort === 'price-low') {
      sortCriteria = { price: 1 };
    } else if (sort === 'price-high') {
      sortCriteria = { price: -1 };
    } else if (sort === 'bestSelling') {
      sortCriteria = { isBestSeller: -1, rating: -1 };
    } else if (sort === 'popularity') {
      sortCriteria = { rating: -1 };
    }

    // Calculate Pagination skip
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Execute queries in parallel
    const [products, totalDocs] = await Promise.all([
      Product.find(query)
        .sort(sortCriteria)
        .skip(skipNum)
        .limit(limitNum)
        .populate('category', 'name slug'),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum);

    return sendSuccess(
      res, 
      200, 
      'Products catalog retrieved successfully.', 
      { products }, 
      { page: pageNum, limit: limitNum, totalDocs, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

// 3. GET SINGLE PRODUCT DETAIL
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name slug');
    if (!product) {
      return next(new NotFoundError('Product not found in store catalog.'));
    }

    return sendSuccess(res, 200, 'Product details retrieved.', { product });
  } catch (error) {
    next(error);
  }
};

// 4. CREATE PRODUCT (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, images, price, mrp, stock, category, brand, module = 'grocery', isFeatured, isBestSeller, attributes } = req.body;

    if (!name || !sku || !description || !price || !mrp || !category) {
      return next(new ValidationError('Please provide all required fields.'));
    }

    // Check unique SKU
    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return next(new ValidationError('Product SKU already exists.'));
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProduct = new Product({
      name, slug, sku, description, images: images || ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'],
      price: Number(price), mrp: Number(mrp), stock: Number(stock || 0), category, brand, module, isFeatured, isBestSeller, attributes
    });

    await newProduct.save();

    // Log admin action
    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'CREATE_PRODUCT',
      entityType: 'Product',
      entityId: newProduct._id,
      newState: newProduct.toObject(),
      req
    });

    return sendSuccess(res, 201, 'Product created successfully.', { product: newProduct });
  } catch (error) {
    next(error);
  }
};

// 5. UPDATE PRODUCT (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return next(new NotFoundError('Product not found.'));
    }

    const previousState = product.toObject();

    // Apply updates
    Object.keys(updates).forEach(key => {
      product[key] = updates[key];
    });

    if (updates.name) {
      product.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    await product.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'UPDATE_PRODUCT',
      entityType: 'Product',
      entityId: product._id,
      previousState,
      newState: product.toObject(),
      req
    });

    return sendSuccess(res, 200, 'Product updated successfully.', { product });
  } catch (error) {
    next(error);
  }
};

// 6. SOFT DELETE PRODUCT (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return next(new NotFoundError('Product not found.'));
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'DELETE_PRODUCT',
      entityType: 'Product',
      entityId: product._id,
      req
    });

    return sendSuccess(res, 200, 'Product soft-deleted successfully.');
  } catch (error) {
    next(error);
  }
};

// 7. RESTORE SOFT DELETED PRODUCT (Admin)
export const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Use findOne to bypass Pre-Find deleted check bypass
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return next(new NotFoundError('Product not found.'));
    }

    product.isDeleted = false;
    product.deletedAt = undefined;
    await product.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'RESTORE_PRODUCT',
      entityType: 'Product',
      entityId: product._id,
      req
    });

    return sendSuccess(res, 200, 'Product restored successfully.', { product });
  } catch (error) {
    next(error);
  }
};

// 8. CREATE CATEGORY (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, module = 'grocery' } = req.body;

    if (!name || !slug) {
      return next(new ValidationError('Please provide category name and slug.'));
    }

    const newCategory = new Category({ name, slug, description, image, module });
    await newCategory.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'CREATE_CATEGORY',
      entityType: 'Category',
      entityId: newCategory._id,
      newState: newCategory.toObject(),
      req
    });

    return sendSuccess(res, 201, 'Category created successfully.', { category: newCategory });
  } catch (error) {
    next(error);
  }
};

// 9. UPDATE CATEGORY (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return next(new NotFoundError('Category not found.'));
    }

    const previousState = category.toObject();

    Object.keys(updates).forEach(key => {
      category[key] = updates[key];
    });

    await category.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'UPDATE_CATEGORY',
      entityType: 'Category',
      entityId: category._id,
      previousState,
      newState: category.toObject(),
      req
    });

    return sendSuccess(res, 200, 'Category updated successfully.', { category });
  } catch (error) {
    next(error);
  }
};

// 10. DELETE CATEGORY (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return next(new NotFoundError('Category not found.'));
    }

    category.isDeleted = true;
    category.deletedAt = new Date();
    await category.save();

    const logAdminAction = await import('../services/auditService.js').then(m => m.logAdminAction);
    await logAdminAction({
      adminId: req.user._id,
      action: 'DELETE_CATEGORY',
      entityType: 'Category',
      entityId: category._id,
      req
    });

    return sendSuccess(res, 200, 'Category soft-deleted successfully.');
  } catch (error) {
    next(error);
  }
};

