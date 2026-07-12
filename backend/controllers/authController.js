import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Address from '../models/Address.js';
import { getSettings } from '../services/settingsService.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { 
  ValidationError, 
  AuthenticationError, 
  ConflictError, 
  NotFoundError 
} from '../utils/appError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieExpiresDays = parseInt(process.env.COOKIE_EXPIRES_IN || '7', 10);

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', token, cookieOptions);

  user.password = undefined;
  return sendSuccess(res, statusCode, message, { user, token });
};

// 1. SIGNUP CUSTOMER
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return next(new ValidationError('Please provide name, email, password and phone.'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError('Email is already registered.'));
    }

    // Standard signups default strictly to customer (Prevents Privilege Escalation)
    const newUser = new User({
      name,
      email,
      password,
      phone,
      role: 'customer'
    });

    await newUser.save();
    return sendTokenResponse(newUser, 201, res, 'Registration successful.');
  } catch (error) {
    next(error);
  }
};

// 2. LOGIN USER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError('Please provide email and password.'));
    }

    // 1. Fetch user including password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthenticationError('Invalid email or password.'));
    }

    // 2. Fetch Settings for Lockout configs
    const settings = await getSettings();
    const attemptsLimit = settings.failedLoginAttemptsLimit || 5;
    const lockoutMinutes = settings.lockoutDurationMinutes || 15;

    // 3. Check if account is currently locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return next(new AuthenticationError(`Account is temporarily locked. Try again in ${remainingTime} minutes.`));
    }

    // 4. Verify password
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      // Increment attempts
      user.failedLoginAttempts += 1;
      
      if (user.failedLoginAttempts >= attemptsLimit) {
        user.lockUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
        await user.save();
        return next(new AuthenticationError(`Too many failed login attempts. Your account has been locked for ${lockoutMinutes} minutes.`));
      }
      
      await user.save();
      return next(new AuthenticationError('Invalid email or password.'));
    }

    // 5. Successful login: reset limits
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// 3. LOGOUT USER
export const logout = async (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return sendSuccess(res, 200, 'Logged out successfully.');
};

// 4. GET CURRENT PROFILE
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addresses = await Address.find({ user: req.user._id });
    
    return sendSuccess(res, 200, 'Profile retrieved.', { user, addresses });
  } catch (error) {
    next(error);
  }
};

// 5. UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    return sendSuccess(res, 200, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};

// 6. ADD SHIPPING ADDRESS
export const addAddress = async (req, res, next) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;

    if (!street || !city || !state || !zipCode) {
      return next(new ValidationError('Please provide street, city, state and zipCode.'));
    }

    // If marked as default, clear other default addresses first
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = new Address({
      user: req.user._id,
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: isDefault || false
    });

    await newAddress.save();
    return sendSuccess(res, 201, 'Address added successfully.', { address: newAddress });
  } catch (error) {
    next(error);
  }
};

// 7. DELETE SHIPPING ADDRESS
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return next(new NotFoundError('Address not found or unauthorized access.'));
    }

    // Soft delete
    address.isDeleted = true;
    address.deletedAt = new Date();
    await address.save();

    return sendSuccess(res, 200, 'Address deleted successfully.');
  } catch (error) {
    next(error);
  }
};

// 8. FORGOT PASSWORD (SECURE TOKEN)
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ValidationError('Please provide an email address.'));
    }

    const user = await User.findOne({ email });
    // To prevent email enumeration/harvesting, we return 200 success regardless,
    // but execute actual token generation if user exists.
    if (!user) {
      return sendSuccess(res, 200, 'If email exists, a password reset link has been dispatched.');
    }

    // Generate secure crypto token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token to store in database
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 Hour

    await user.save();

    // Log recovery URL link simulator for testing purposes
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const logger = await import('../utils/logger.js').then(m => m.default || m);
    logger.info(`[PASSWORD RESET SIMULATION] User: ${email} | Link: ${resetUrl}`);

    return sendSuccess(res, 200, 'If email exists, a password reset link has been dispatched.');
  } catch (error) {
    next(error);
  }
};

// 9. RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return next(new ValidationError('Password must be at least 6 characters.'));
    }

    const crypto = await import('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find active user with unexpired reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return next(new ValidationError('Reset token is invalid or has expired.'));
    }

    // Prevent using current password as new password (History validation check)
    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      return next(new ValidationError('New password cannot be the same as your current password.'));
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    return sendSuccess(res, 200, 'Password has been reset successfully.');
  } catch (error) {
    next(error);
  }
};

// 10. CHANGE PASSWORD (AUTHENTICATED)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ValidationError('Please provide current and new passwords.'));
    }

    if (newPassword.length < 6) {
      return next(new ValidationError('New password must be at least 6 characters.'));
    }

    // Retrieve user details with select password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new NotFoundError('User not found.'));
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ValidationError('Current password is incorrect.'));
    }

    // Prevent using current password as new password
    if (currentPassword === newPassword) {
      return next(new ValidationError('New password cannot be the same as current password.'));
    }

    // Save hashed password
    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

