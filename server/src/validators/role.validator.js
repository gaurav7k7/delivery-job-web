import { z } from 'zod';
import { objectId } from './shared.validator.js';

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(300).optional(),
    permissions: z.array(objectId).optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().max(300).optional(),
    permissions: z.array(objectId).optional(),
  }),
});
