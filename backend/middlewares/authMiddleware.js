import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthenticationError, AuthorizationError } from '../utils/appError.js';

// Central Dynamic RBAC Role-to-Permissions Mapping
const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'products:read', 'products:write',
    'categories:read', 'categories:write',
    'orders:read', 'orders:write',
    'customers:read',
    'banners:read', 'banners:write',
    'coupons:read', 'coupons:write',
    'reports:read',
    'settings:read', 'settings:write'
  ],
  manager: [
    'products:read', 'products:write',
    'categories:read', 'categories:write',
    'orders:read', 'orders:write',
    'banners:read', 'banners:write',
    'coupons:read', 'coupons:write',
    'inventory:read', 'inventory:write'
  ],
  staff: [
    'products:read',
    'orders:read', 'orders:write',
    'inventory:read', 'inventory:write'
  ],
  customer: [
    'cart:read', 'cart:write',
    'wishlist:read', 'wishlist:write',
    'orders:own',
    'profile:own'
  ]
};

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // 1. Read token from cookies or Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError('You are not logged in. Please log in to get access.'));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AuthenticationError('The user belonging to this token no longer exists.'));
    }

    // 4. Grant access and attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token. Please log in again.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Your token has expired. Please log in again.'));
    }
    next(error);
  }
};

// Check if user role matches permission scope dynamically
export const checkPermission = (requiredScope) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('User details missing in request.'));
    }

    const userRole = req.user.role;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    // Super Admins have bypass permission
    if (permissions.includes('*')) {
      return next();
    }

    // Check if user permissions contains required scope
    if (permissions.includes(requiredScope)) {
      return next();
    }

    return next(new AuthorizationError(`Access Forbidden: Role '${userRole}' lacks required scope '${requiredScope}'`));
  };
};
