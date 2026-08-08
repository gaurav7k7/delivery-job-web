import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().optional(),
    avatar: z.string().trim().url().optional().or(z.literal('')),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Please provide a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(10, 'Invalid or expired reset token'),
  }),
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});
