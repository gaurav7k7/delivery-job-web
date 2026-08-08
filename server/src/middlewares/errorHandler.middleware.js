import { isProduction } from '../config/env.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let fieldErrors = err.fieldErrors || null;

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 422;
    message = 'Validation failed';
    fieldErrors = Object.fromEntries(Object.entries(err.errors).map(([field, e]) => [field, e.message]));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
    fieldErrors = field ? { [field]: 'Already in use' } : null;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  if (!err.isOperational && statusCode === 500) {
    console.error('[unhandled error]', err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(fieldErrors ? { errors: fieldErrors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
