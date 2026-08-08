import { z } from 'zod';
import { CONTACT_REQUEST_STATUSES } from '../constants/enums.js';

export const createContactRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    email: z.string().trim().email('Please provide a valid email address'),
    phone: z.string().trim().optional(),
    subject: z.string().trim().optional(),
    message: z.string().trim().min(2).max(2000),
  }),
});

export const updateContactRequestSchema = z.object({
  body: z.object({
    status: z.enum(CONTACT_REQUEST_STATUSES).optional(),
  }),
});
