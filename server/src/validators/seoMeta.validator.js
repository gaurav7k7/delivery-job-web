import { z } from 'zod';
import { seoSchema } from './shared.validator.js';

export const createSeoMetaSchema = z.object({
  body: z.object({
    route: z.string().trim().toLowerCase().min(1),
    seo: seoSchema,
    structuredData: z.record(z.string(), z.any()).optional(),
  }),
});

export const updateSeoMetaSchema = z.object({
  body: z.object({
    route: z.string().trim().toLowerCase().min(1).optional(),
    seo: seoSchema.optional(),
    structuredData: z.record(z.string(), z.any()).optional(),
  }),
});
