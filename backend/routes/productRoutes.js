import express from 'express';
import { 
  getCategories, 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/productController.js';
import { protect, checkPermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public read endpoints
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only product write endpoints
router.post('/', protect, checkPermission('products:write'), createProduct);
router.put('/:id', protect, checkPermission('products:write'), updateProduct);
router.delete('/:id', protect, checkPermission('products:write'), deleteProduct);
router.patch('/:id/restore', protect, checkPermission('products:write'), restoreProduct);

// Admin-only category write endpoints
router.post('/categories', protect, checkPermission('categories:write'), createCategory);
router.put('/categories/:id', protect, checkPermission('categories:write'), updateCategory);
router.delete('/categories/:id', protect, checkPermission('categories:write'), deleteCategory);

export default router;
