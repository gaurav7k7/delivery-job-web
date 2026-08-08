import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const windowMs = env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

const baseOptions = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next, options) => next(ApiError.tooMany(options.message)),
};

// Applied globally to every request.
export const globalLimiter = rateLimit({
  ...baseOptions,
  windowMs,
  max: env.RATE_LIMIT_MAX,
  message: 'Too many requests, please try again later.',
});

// Applied to login/refresh/password-reset — brute-force protection.
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: 'Too many authentication attempts, please try again later.',
});

// Applied to public write endpoints (Apply Now, Contact form, Newsletter signup).
export const publicWriteLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many submissions from this device, please try again later.',
});
