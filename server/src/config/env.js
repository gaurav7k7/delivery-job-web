import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 characters'),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().positive().default(15),
  RATE_LIMIT_MAX: z.coerce.number().positive().default(300),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().positive().default(20),

  // Optional (Phase 1 SRS §10): response caching degrades gracefully to
  // "no caching" when unset, so it's safe to leave blank in any environment
  // that doesn't have a Redis instance provisioned yet.
  REDIS_URL: z.string().optional(),
  SITE_URL: z.string().default('https://www.zerivon.in'),

  // Optional — error tracking degrades to console-only logging when unset,
  // same graceful pattern as REDIS_URL above.
  SENTRY_DSN: z.string().optional(),

  // Optional — password-reset emails degrade to a console log of the reset
  // link when SMTP isn't configured, same graceful pattern as REDIS_URL.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // Optional — only read by scripts/seed.js. Leave unset to auto-generate a
  // random password for the first admin user (printed once at seed time).
  SEED_ADMIN_NAME: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:');
  console.error(JSON.stringify(parsedEnv.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
