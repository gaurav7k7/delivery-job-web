import { z } from 'zod';
import { imageSchema, seoSchema, objectId } from './shared.validator.js';

const metricSchema = z.object({
  label: z.string().trim().optional(),
  value: z.string().trim().optional(),
});

export const createPortfolioSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(200),
    slug: z.string().trim().toLowerCase().optional(),
    client: objectId.optional(),
    industry: objectId.optional(),
    service: objectId.optional(),
    coverImage: imageSchema,
    gallery: z.array(imageSchema).optional(),
    summary: z.string().trim().min(2),
    challenge: z.string().trim().optional(),
    solution: z.string().trim().optional(),
    results: z.string().trim().optional(),
    metrics: z.array(metricSchema).optional(),
    projectUrl: z.string().trim().optional(),
    completedAt: z.coerce.date().optional(),
    order: z.number().optional(),
    isFeatured: z.boolean().optional(),
    seo: seoSchema.optional(),
  }),
});

export const updatePortfolioSchema = z.object({ body: createPortfolioSchema.shape.body.partial() });
