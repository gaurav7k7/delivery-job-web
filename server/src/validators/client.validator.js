import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(150),
    logo: imageSchema,
    websiteUrl: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateClientSchema = z.object({ body: createClientSchema.shape.body.partial() });
