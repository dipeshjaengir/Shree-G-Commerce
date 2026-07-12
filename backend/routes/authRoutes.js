import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  getProfile, 
  updateProfile, 
  addAddress, 
  deleteAddress,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes (Requires protect middleware)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);

export default router;
