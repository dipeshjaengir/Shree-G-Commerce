export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message || 'Validation Failed', 400);
    this.errors = errors;
    this.code = 'VALIDATION_ERROR';
  }
}

export class AuthenticationError extends AppError {
  constructor(message) {
    super(message || 'Authentication Failed', 401);
    this.code = 'AUTHENTICATION_ERROR';
  }
}

export class AuthorizationError extends AppError {
  constructor(message) {
    super(message || 'Access Forbidden: Insufficient Permissions', 403);
    this.code = 'AUTHORIZATION_ERROR';
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource Not Found', 404);
    this.code = 'NOT_FOUND_ERROR';
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message || 'Resource Conflict Already Exists', 409);
    this.code = 'CONFLICT_ERROR';
  }
}

export class DatabaseError extends AppError {
  constructor(message) {
    super(message || 'Database Transaction Operation Failed', 500);
    this.code = 'DATABASE_ERROR';
  }
}

export class InternalServerError extends AppError {
  constructor(message) {
    super(message || 'Internal Server Error', 500);
    this.code = 'INTERNAL_SERVER_ERROR';
  }
}
