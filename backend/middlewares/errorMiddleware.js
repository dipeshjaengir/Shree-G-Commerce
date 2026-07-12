import { logger } from '../utils/logger.js';
import { sendError } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[Error Context] ${req.method} ${req.originalUrl} - Code: ${err.code || 'INTERNAL_ERROR'} - Message: ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (process.env.NODE_ENV === 'development') {
    return sendError(res, err.statusCode, err.message, {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.errors || null,
      stack: err.stack
    });
  } else {
    // Production Mode: don't leak server code details
    if (err.isOperational) {
      return sendError(res, err.statusCode, err.message, {
        code: err.code || 'OPERATIONAL_ERROR',
        details: err.errors || null
      });
    }

    return sendError(res, 500, 'Something went wrong on our end. Please try again later.', {
      code: 'INTERNAL_SERVER_ERROR',
      details: null
    });
  }
};
