import { z } from 'zod';
import { imageSchema, seoSchema, objectId } from './shared.validator.js';

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(150),
    slug: z.string().trim().toLowerCase().optional(),
    icon: z.string().trim().optional(),
    shortDescription: z.string().trim().min(2).max(200),
    description: z.string().trim().optional(),
    features: z.array(z.string().trim()).optional(),
    image: imageSchema.optional(),
    industries: z.array(objectId).optional(),
    order: z.number().optional(),
    isFeatured: z.boolean().optional(),
    seo: seoSchema.optional(),
  }),
});

export const updateServiceSchema = z.object({ body: createServiceSchema.shape.body.partial() });
