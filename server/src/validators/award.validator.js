import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

export const createAwardSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    issuer: z.string().trim().optional(),
    year: z.number().int().optional(),
    image: imageSchema.optional(),
    description: z.string().trim().optional(),
    order: z.number().optional(),
  }),
});

export const updateAwardSchema = z.object({ body: createAwardSchema.shape.body.partial() });
