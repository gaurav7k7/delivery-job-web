import { z } from 'zod';
import { imageSchema } from './shared.validator.js';

export const createPlatformSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    slug: z.string().trim().toLowerCase().optional(),
    logo: imageSchema,
    brandColor: z.string().trim().optional(),
    description: z.string().trim().optional(),
    benefits: z.array(z.string().trim()).optional(),
    order: z.number().optional(),
  }),
});

export const updatePlatformSchema = z.object({ body: createPlatformSchema.shape.body.partial() });
