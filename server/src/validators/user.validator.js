import { z } from 'zod';
import { objectId } from './shared.validator.js';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email('Please provide a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().trim().optional(),
    role: objectId,
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().optional(),
    avatar: z.string().trim().url().optional().or(z.literal('')),
    role: objectId.optional(),
    isActive: z.boolean().optional(),
  }),
});
