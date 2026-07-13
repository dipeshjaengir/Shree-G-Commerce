import { logger } from '../utils/logger.js';
import { sendError } from '../utils/responseHandler.js';
import { ValidationError, ConflictError, AuthenticationError } from '../utils/appError.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.code = err.code;

  // 1. Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const val = err.keyValue ? err.keyValue[field] : '';
    const msg = `${field.charAt(0).toUpperCase() + field.slice(1)} '${val}' is already registered.`;
    error = new ConflictError(msg);
  }

  // 2. Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errorsList = Object.values(err.errors).map(el => el.message);
    error = new ValidationError(errorsList.join('. '), errorsList);
  }

  // 3. Handle Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = `Invalid format for field ${err.path}: ${err.value}`;
    error.isOperational = true;
    error.code = 'INVALID_FORMAT';
  }

  // 4. Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Your session has expired. Please log in again.');
  }

  logger.error(`[Error Context] ${req.method} ${req.originalUrl} - Code: ${error.code || 'INTERNAL_ERROR'} - Message: ${error.message}`);

  if (process.env.NODE_ENV === 'development') {
    return sendError(res, error.statusCode, error.message, {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      details: error.errors || null,
      stack: err.stack
    });
  } else {
    // Production Mode: don't leak server code details except for operational ones
    if (error.isOperational) {
      return sendError(res, error.statusCode, error.message, {
        code: error.code || 'OPERATIONAL_ERROR',
        details: error.errors || null
      });
    }

    return sendError(res, 500, 'Something went wrong on our end. Please try again later.', {
      code: 'INTERNAL_SERVER_ERROR',
      details: null
    });
  }
};
