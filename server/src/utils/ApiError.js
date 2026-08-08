export class ApiError extends Error {
  constructor(statusCode, message, fieldErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.fieldErrors = fieldErrors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, fieldErrors = null) {
    return new ApiError(400, message, fieldErrors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static unprocessable(message, fieldErrors = null) {
    return new ApiError(422, message, fieldErrors);
  }

  static tooMany(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(500, message);
  }
}
