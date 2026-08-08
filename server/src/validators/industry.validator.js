import { z } from 'zod';
import { imageSchema, seoSchema } from './shared.validator.js';

export const createIndustrySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    slug: z.string().trim().toLowerCase().optional(),
    icon: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: imageSchema.optional(),
    order: z.number().optional(),
    seo: seoSchema.optional(),
  }),
});

export const updateIndustrySchema = z.object({ body: createIndustrySchema.shape.body.partial() });
